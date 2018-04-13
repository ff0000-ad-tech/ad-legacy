// TODO - update expand() / collapse() to new requestExpand() / requestCollapse()
//		- change onExitCollapse to event based, similar to Gesture for clarity
//		- https://www.google.com/doubleclick/studio/docs/sdk/html5/en/class_studio_Enabler.html
/**
	@npmpackage
	@class DcsExpandable
	@desc
		Import from <a href="https://github.com/ff0000-ad-tech/ad-legacy">ad-legacy</a>
		<br>
		<codeblock>
			// importing into an ES6 class
			import { DcsExpandable } from 'ad-legacy'
		</codeblock>
		<br><br>

		A static class for DoubleClick Expandable Units: Creates Markup and handles core expand/collapse logic.

	@example
		// Parameters found in the adParams object in the index		
		expandable: {
			expandedX			: 0,	// expanded x position
			expandedY			: 0,	// expanded y position
			collapsedX		: 0,	// collapsed y position
			collapsedY		: 0,	// collapsed x position
			collapsedWidth		: 300,	// collapsed height
			collapsedHeight	: 50,	// collapsed width
			expanded			: true,	// sets whether or not the unti starts in the expanded state
			collapseOnExit		: true	// sets whether or not the unit collapses when exiting the unit
		},
*/
var DcsExpandable = new function() {
	var D = this
	var _afterInitExpanded = true

	/* ------------------------------------------------------------------------------------------------------------------------------- */
	// PUBLIC METHODS

	/**
		@memberOf DcsExpandable
		@method collapse
		@param {GestureEvent} gestureEvent 
			if `DcsExpandable.collapse` is passed as the callback to {@link Gesture}, then it will be assumed that this was a 
			user-request for collapse, in which case it will be reported as such.
		@desc
			Manually starts the unit to collapse. 
		@example
			DcsExpandable.collapse();
	*/
	D.collapse = function(gestureEvent) {
		Enabler.requestCollapse()
		if (gestureEvent) Enabler.reportManualClose()
	}

	/**
		@memberOf DcsExpandable
		@method expand
		@desc
			Manually starts the unit to expand
		@example
			DcsExpandable.expand();
	*/
	D.expand = function() {
		Enabler.requestExpand()
	}

	/**
		@memberOf DcsExpandable
		@method linkMainContainers
		@param {element} collapsed
			The collapsed container, should be called: View.main.stage.collapsedContainer
		@param {element} expanded
			The expanded container, should be called: View.main.stage.expandedContainer
		@desc
			Creates a re-direct link from the Edge output version of the collapse and expand containers to the buil versions.
			Edge outputs elements onto a stage object, hand coded elements do not. This ethod bridges that gap.
		@example
			//
			DcsExpandable.linkMainContainers( 
				View.main.stage.collapsedContainer, 
				View.main.stage.expandedContainer 
			);
	*/
	D.linkMainContainers = function(collapsed, expanded) {
		View.main.expandedContainer = expanded
		View.main.collapsedContainer = collapsed
	}

	/**
		@memberOf DcsExpandable
		@method init
		@desc
			Initailizes the class, adding all listeners and setting the initail state of the unit: either expand or collapse.
		@example
			DcsExpandable.init();
	*/
	D.init = function() {
		console.log('DcsExpandable.init()')
		// Define this var on adData instance
		adData.userHasInteracted = false

		Enabler.addEventListener(studio.events.StudioEvent.EXPAND_START, Control.handleExpandStart)
		Enabler.addEventListener(studio.events.StudioEvent.EXPAND_FINISH, handleExpandFinish)
		Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_START, Control.handleCollapseStart)
		Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_FINISH, handleCollapseFinish)

		//Enabler.setExpandingPixelOffsets( adParams.expandable.expandedX, adParams.expandable.expandedY, adParams.adWidth, adParams.adHeight );

		if (adParams.expandable.expanded) {
			_afterInitExpanded = false
			Enabler.setStartExpanded(true)
			Enabler.requestExpand()
		}
	}

	/* ------------------------------------------------------------------------------------------------------------------------------- */
	// EVENT HANDLERS
	function handleExpandFinish(event) {
		Control.handleExpandFinish.call()
		adData.userHasInteracted = _afterInitExpanded
		_afterInitExpanded = true
	}

	function handleCollapseFinish(event) {
		Control.handleCollapseFinish.call()
		adData.userHasInteracted = true
	}
}()
export default DcsExpandable
