import { GestureEvent } from 'ad-events'

var Expandable = new function() {
	var E = this

	var _afterInitExpanded = true
	var _expandStart
	var _expandComplete
	var _collapseStart
	var _collapseComplete

	/* ---------------------------------------------------------------------------------------------------- */
	// PUBLIC PROPERTIES
	E.userHasInteracted = false

	/* ---------------------------------------------------------------------------------------------------- */
	// PUBLIC METHODS
	E.init = function(arg) {
		arg = arg || {}
		_expandStart = arg.expandStart || function() {}
		_expandComplete = arg.expandComplete || function() {}
		_collapseStart = arg.collapseStart || function() {}
		_collapseComplete = arg.collapseComplete || function() {}

		/*-- Red.Component.expandable_init_content.start --*/
		/*-- Red.Component.expandable_init_content.end --*/

		if (adParams.expandable.expanded) {
			_afterInitExpanded = false

			/*-- Red.Component.expandable_init_expanded.start --*/
			/*-- Red.Component.expandable_init_expanded.end --*/

			E.expand()
		}
	}

	E.collapse = function(gestureEvent) {
		if (gestureEvent) {
			GestureEvent.stop(gestureEvent)
		}
		/*-- Red.Component.expandable_collapse_content.start --*/
		handleCollapseStart()
		/*-- Red.Component.expandable_collapse_content.end --*/
	}

	E.expand = function(gestureEvent) {
		if (gestureEvent) {
			GestureEvent.stop(gestureEvent)
		}
		/*-- Red.Component.expandable_expand_content.start --*/
		handleExpandStart()
		/*-- Red.Component.expandable_expand_content.end --*/
	}

	E.collapseComplete = function() {
		/*-- Red.Component.expandable_collapsecomplete_content.start --*/
		handleCollapseComplete()
		/*-- Red.Component.expandable_collapsecomplete_content.end --*/
	}

	E.expandComplete = function() {
		/*-- Red.Component.expandable_expandcomplete_content.start --*/
		handleExpandComplete()
		/*-- Red.Component.expandable_expandcomplete_content.end --*/
	}

	/* ---------------------------------------------------------------------------------------------------- */
	// EVENT HANDLERS
	function handleExpandStart(event) {
		_expandStart.call()
	}

	function handleExpandComplete(event) {
		_expandComplete.call()
		E.userHasInteracted = _afterInitExpanded
		_afterInitExpanded = true
	}

	function handleCollapseStart(event) {
		_collapseStart.call()
		E.userHasInteracted = true
	}

	function handleCollapseComplete(event) {
		_collapseComplete.call()
		E.userHasInteracted = true
	}
}()

export default Expandable
