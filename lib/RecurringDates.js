/**
	@class RecurringDates
	@desc
		<a href="https://github.com/ff0000-ad-tech/ad-legacy">Github repo</a>
		<br><br>

		<span style="color:#ff0000"><b>WARN:</b><br>
		This class has been deprecated.  See RecurringSchedule 
		</span>

		<br><br>

		This class is for determining the next showtime for events that repeat on a weekly basis. For example, you have a tune-in that
		is every Friday at 6pm, and you want your date messaging to update dynamically.
		<br><br>

		<b>Date Model:</b><br>
		For an event that is every Friday at 6pm for one hour, the model would look like:<br>
		<codeblock>
			// define event model
			var dateModel = [
				{	name: 'Once a week',
					tuneins: [
						{	days: ['Friday'],
							startTime: '18:00',
							endTime: '19:00'
						}
					]
				}
			];
		</codeblock>
		<br><br>

		For more complex schedules( like sports tournaments ), a more complex model might look like this
		<codeblock>
			// define event model
			var dateModel = [
				{	name: 'Weekend events',
					tuneins: [
						{	days: ['Friday','Saturday','Sunday'],
							startTime: '21:00',
							endTime: '22:00'
						}
					]
				},
				{	name: 'Weekday events',
					tuneins: [
						{	days: ['Monday','Tuesday','Wednesday','Thursday'],
							startTime: '18:00',
							endTime: '19:00'
						}
					]
				}
			];
		</codeblock>
		<br><br>
		
		After defining your event model, you must instantiate this class and submit it to {@link RecurringDates.init}. This
		will figure out for you when the next non-expired event starts, and when it will be over. So, to build on the previous example:
		<br>
		<codeblock>
			// generate next start-end dates
			var recurringEventsManager = new RecurringDates();
			recurringEventsManager.init( dateModel );
		</codeblock>
		<br><br>
	
		Now you can access the "next start date" and "next end date" methods. Use those returned Date objects, along with the standard {@link DateUtils} methods, to 
		properly format your date-messaging.
		<codeblock>
			// trace the date objects
			var nextStartDate = recurringEventsManager.getNextStartDate();
			var nextEndDate = recurringEventsManager.getNextEndDate();
			trace( nextStartDate, nextEndDate );

			// trace the messaging for the dates
			var nextStartDateMessage = DateUtils.selectMessagingForDate( nextStartDate );
			var nextEndDateMessage = DateUtils.selectMessagingForDate( nextEndDate );
			trace( nextStartDateMessage, nextEndDateMessage );
		</codeblock>
*/
import DateUtils from './DateUtils'

var RecurringDates = function() {

	var self = this;
	
	/**
		@memberof RecurringDates
		@method init
		@param {array} _dateModel
			See the top of this page for a detailed example of what this list of objects looks like.
		@param {object} _tzDesignation
			Optional. Default is {@link DateUtils.TZ_LOCAL}.
		@desc
			Prepares the class with a schedule of dates and an optional timezone-designation, against which to compare times.
	*/
	self.init = function( _dateModel, _tzDesignation ) {
		trace( 'RecurringDates.init()' );
		self.dateModel = _dateModel;
		self.tzDesignation = _tzDesignation || DateUtils.TZ_LOCAL;
		self.parseModel(); 
	}


	/**
		@memberof RecurringDates
		@method getNextStartDate
		@param {string} _name
			corresponds to the name property in submitted date-model, which is documented at the top of this page.
		@returns {Date}
			Returns as a Date object representing the tunein time for the next event. If you have multiple groups of events, 
			for example, "weekday" and "weekend", you can specify which date is returned by the name property of date-object.

	*/
	self.getNextStartDate = function( _name ) {
		return self.getDateModelFor( _name ).nextStartDate; 
	}


	/**
		@memberof RecurringDates
		@method getNextEndDate
		@param {string} _name
			corresponds to the name property in submitted date-model, which is documented at the top of this page.
		@returns {Date}
			Returns as a Date object representing the expiration time for the next event. If you have multiple groups of events, 
			for example, "weekday" and "weekend", you can specify which date is returned by the name property of date-object.
	*/
	self.getNextEndDate = function( _name ) {
		return self.getDateModelFor( _name ).nextEndDate;
	}


	/* -- INTERNAL ------------------------------------------------------------
	 *
	 *
	 */


	// loop all the events and create actual date objects representing the next show
	self.parseModel = function() {
		for( var i in self.dateModel ) {
			trace( ' checking: ' + self.dateModel[i].name );
			var eventTimeDates = self.getShowtimeDatesOfNext( self.dateModel[i] );
			self.dateModel[i].nextStartDate = eventTimeDates.startDate;
			self.dateModel[i].nextEndDate = eventTimeDates.endDate;
			trace( '  - next show: ' + self.dateModel[i].nextStartDate, '\n' );
		}
	}
	
	self.getShowtimeDatesOfNext = function( _event ) {
		var fewestDaysToNextShow = 100;
		var lastShow;
		var nextShow;
		var dayIndexForNow = self.getDayIndexForNow();
		for( var i in _event.tuneins ) {
			trace( '  - checking tunein: ' + _event.tuneins[i].days + ', startTime: ' + _event.tuneins[i].startTime + ' - endTime: ' + _event.tuneins[i].endTime );
			for( var j in _event.tuneins[i].days ) {
				var eventDayIndex = self.getDayIndexFor( _event.tuneins[i].days[j] );
				var daysToNextShow = 0;
				//trace( 'checking event day-index: ' + eventDayIndex + ', now day-index: ' + dayIndexForNow );
				if( eventDayIndex >= dayIndexForNow )
					daysToNextShow = eventDayIndex - dayIndexForNow;
				else if( eventDayIndex < dayIndexForNow )
					daysToNextShow = 7 - dayIndexForNow + eventDayIndex;
					
				if( daysToNextShow < fewestDaysToNextShow ) {
					var eventTimeDates = self.buildShowtimeDatesFor( _event.tuneins[i], daysToNextShow );
					//trace( 'now: ' + DateUtils.getNow( this.tzDesignation ) + '\nstart: ' + eventTimeDates.startDate + '\nend: ' + eventTimeDates.endDate );
					if( DateUtils.getNow( self.tzDesignation ).getTime() < eventTimeDates.endDate.getTime()) {
						fewestDaysToNextShow = daysToNextShow;
						nextShow = eventTimeDates;
					}
					else {	// for events that are once-a-week, but passed for today, push this date forward a week
						lastShow = eventTimeDates;
						lastShow.startDate.setHours( 7 * 24 + eventTimeDates.startDate.getHours());
						lastShow.startDate.setMinutes( eventTimeDates.startDate.getMinutes());
						lastShow.endDate.setHours( 7 * 24 + eventTimeDates.endDate.getHours());
						lastShow.endDate.setMinutes( eventTimeDates.endDate.getMinutes());
					}
				}
			}
		}
		if( !nextShow )
			return lastShow;
		else return nextShow;
	}


	self.buildShowtimeDatesFor = function( _tunein, _daysToNextShow ) {
		//trace( 'RecurringDates.buildShowtimeDatesFor(), tunein: ' + _tunein + ', daysToNextShow: ' + _daysToNextShow );
		var result = {};
		
		var eventTimeStart = _tunein.startTime.split( ':' );
		var eventStartHours = eventTimeStart[0];
		var eventStartMinutes = eventTimeStart[1];
		var eventTimeEnd = _tunein.endTime.split( ':' );
		var eventEndHours = eventTimeEnd[0];
		var eventEndMinutes = eventTimeEnd[1];
		
		var eventStart = self.adjustDateToStartOfDay();
		eventStart.setHours( _daysToNextShow * 24 );
		eventStart.setHours( eventStartHours );
		eventStart.setMinutes( eventStartMinutes );
		eventStart.setSeconds( 0 );
		result.startDate = DateUtils.parseToDate( DateUtils.toTimestamp( eventStart ));
		
		var eventEnd = self.adjustDateToStartOfDay();
		eventEnd.setHours( _daysToNextShow * 24 );
		eventEnd.setHours( eventEndHours );
		eventEnd.setMinutes( eventEndMinutes );
		eventEnd.setSeconds( 0 );
		result.endDate = eventEnd;
		
		return result;
	}

	self.adjustDateToStartOfDay = function( _date ) {
		var now = DateUtils.getNow( self.tzDesignation );
		var todayMinutes = ( now.getHours() * 60 ) + now.getMinutes();
		if( todayMinutes < DateUtils.newDayStartsAt ) 
			now.setHours( now.getHours() - 24 );
		else now.setHours( 0 );
		now.setMinutes( 0 );
		return now;
	}
	

	self.getDayIndexForNow = function() {
		var now = DateUtils.getNow( self.tzDesignation );
		var todayMinutes = ( now.getHours() * 60 ) + now.getMinutes();
		if( todayMinutes < DateUtils.newDayStartsAt ) 
			return now.getDay() > 0 ? now.getDay() - 1 : 6;
		else return now.getDay();
	}

	// from a day-string, like "monday", return the flash.date day index
	self.getDayIndexFor = function( _day ) {
		for( var i in DateUtils.getLabels().WEEKDAYS_FULL ) {
			if( DateUtils.getLabels().WEEKDAYS_FULL[i].toLowerCase() == _day.toLowerCase()) {
				return parseInt( i );
			}
		}
		return 0;
	}


	// return the requested date object by name
	self.getDateModelFor = function( _name ) {
		for( var i in self.dateModel ) {
			if( self.dateModel[i].name == _name )
				return self.dateModel[i];
		}
		return self.dateModel[0]
	}

}


export default RecurringDates