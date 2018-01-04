/**
	@class DateStates
	@desc
		<span style="color:#ff0000"><b>WARN:</b><br>
		This class has been deprecated.  See DateSchedule
		</span>

		<br><br>

		Used to create a schedule of dates. Then this class can be queried for:
		<ul>
			<li>a label representing the current valid date</li>
			<li>an index which can be used to manually retrieve the current valid object</li>
		</ul>
		
		Also interfaces with {@link StaticGenerator} in order to create a schedule of "static states" for the ad.
		<br><br>

		<b>AdData.js:</b><br>
		It is recommended that you centralize your schedule in AdData. This way, changes to the schedule can easily 
		be achieved with one common update.<br>
		<codeblock>
			this.dateStates = new DateStates();
			this.dateStates.addDate( '2015-08-01 12:00:00', DateUtils.TZ_LOCAL );
			this.dateStates.addDate( '2015-08-30 12:00:00', DateUtils.TZ_LOCAL );
			this.dateStates.traceSchedule();
		</codeblock>
		<br><br>

		<b>build.js:</b><br>
		In <u>build.View</u>, you can write functions that build out the DOM for each of your states. 
		<codeblock>
			this.buildDateState0 = function() {
				console.log( 'View.buildDateState0()' );
				// Markup...
			}
			this.buildDateState1 = function() {
				console.log( 'View.buildDateState1()' );
				// Markup...
			}
			this.buildDateState2 = function() {
				console.log( 'View.buildDateState2()' );
				// Markup...
			}
		</codeblock>
		<br><br>

		In <u>build.Control</u>, you can write the logic to switch which build function gets called. Please *NOTE*, the first date is ALWAYS
		passed. In other words, index 0, or "date-0" is the default state, before any of your dates have passed.
		<codeblock>
			switch( adData.dateStates.getCurrentLabel()) {
				case 'date-0': // default state
					View.buildDateState0();
					break;

				case 'date-1': // first date has passed
					View.buildDateState1();
					break;

				case 'date-2': // second date has passed
					View.buildDateState2();
					break;
			}
		</codeblock>
		<br><br>
*/
import DateUtils from './DateUtils'

var DateStates = function() {
		
	this.dates = [];
	
	
	/**
		@memberof DateStates
		@method addDate
		@param {Date|string} _date
			Expected to be either a Date object, or a date-time string in the format of YYYY-MM-DD HH:MM:SS, where HH:MM:SS are optional.
		@param {object} _tzDesignation
			Any one of the supported {@link DateUtils} timezone ("TZ_") constants, assumes the client's timezone, but if your
			list of dates is in EST, for example, then you would need to switch this argument to DateUtils.TZ_EST.
		@param {object} _label
			Optionally specify a label, which can make the logic read a little easier in the build.
		@param {object} _args
			Optionally specify any other random arguments or callback functions that may be required for your build

		@desc
			Add a date/timezone and label the the 
	*/
	this.addDate = function( _date, _tzDesignation, _label, _args ) {
		_tzDesignation = _tzDesignation || DateUtils.TZ_LOCAL;
		if( !( _date instanceof Date ))
			_date = DateUtils.parseToDate( _date, _tzDesignation );
		this.dates.push({ 
			date: _date,
			tzDesignation: _tzDesignation,
			label: _label,
			args: _args
		});
		this.sortDates();
		this.confirmLabels();
	}



	/**
		@memberof DateStates
		@method traceSchedule
		@desc
			Write the schedule and associated indexes/labels to the console. 
	*/
	this.traceSchedule = function() {
		console.log( 'DateStates.traceSchedule()' );
		for( var i in this.dates ) {
			console.log( ' - ' + this.dates[i].date + '( ' + this.dates[i].tzDesignation.label + ' ), index: "' + i.toString() + '", label: "' + this.dates[i].label + '"' );
		}
	}
	
	
	/**
		@memberof DateStates
		@method getCurrentLabel
		@desc
			Returns the label associated with the current date-state. If no label was specified for the current date, 
			this function will return labels, like:<br>
			<ul>
				<li><code>date-0</code> - before first date has passed</li>
				<li><code>date-1</code> - first date has passed</li>
				<li><code>date-2</code> - second date has passed</li> 
	*/
	this.getCurrentLabel = function() {
		return this.dates[this.getCurrentIndex()].label;
	}

	
	
	/**
		@memberof DateStates
		@method getCurrentIndex
		@desc
			Get the current date-state index. The 0-index date is ALWAYS passed, so if the first date in your list has
			NOT passed, this function will return 0.  
	*/
	this.getCurrentIndex = function() {
		var currentIndex = -1;
		for( var _i=0; _i < this.dates.length; _i++ ) {
			var _now = DateUtils.getNow( this.dates[_i].tzDesignation );
			if( _now.getTime() >= this.dates[_i].date.getTime() ) {
				currentIndex = _i;
			}
		}
		return currentIndex;
	}
	
	
	/**
		@memberof DateStates
		@method getDates
		@desc
			Return a list of the actual date objects 
	*/
	this.getDates = function() {
		var dates = [];
		for( var i in this.dates ) {
			dates.push( this.dates[i].date );
		}
		return dates;
	}




	this.sortDates = function() {
		function sortOnDateTime( a, b ) {
			if( a.date.getTime() < b.date.getTime()) return -1;
			if( a.date.getTime() > b.date.getTime()) return 1;
			return 0;				
		}
		this.dates.sort( sortOnDateTime );
	}
	this.confirmLabels = function() {
		for( var i in this.dates ) {
			if( !this.dates[i].label )
				this.dates[i].label = 'date-' + i.toString();
		}
	}


	this.addDate( '2000-01-01 00:00:00' );

}

export default DateStates