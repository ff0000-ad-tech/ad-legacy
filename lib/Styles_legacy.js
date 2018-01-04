/* ----------------------------------------------------------------------------------------------------------------------------------------------------------
	Class: 	Styles_legacy
	WARNING: 
		This class is only used for migrating old ads. 

	Description:
		This object contains depreciated methods for the Styles module.
	---------------------------------------------------------------------------------------------------------------------------------------------------------- */
import { Markup } from 'ad-view'

var Styles_legacy = (function() {
	var Styles = {}

	/*	Method: Styles_legacy.init()
			Add this method ahead of any calls to Styles...probably in PrepareCommon.init()
	 */

	/*	Method: Styles.show()
			Utility for setting a dom element's visibility css to 'visible'.

		_element				- target dom element */
	Styles.show = function(_element) {
		Styles.setCss(_element, 'visibility', 'visible')
	}

	/*	Method: Styles.hide()
			Utility for setting a dom element's visibility css to 'hidden'.

		_element				- target dom element */
	Styles.hide = function(_element) {
		Styles.setCss(_element, 'visibility', 'hidden')
	}

	/*	Method: Styles.setBackgroundImage()
			Sets the background-image property with an url for the specified element.

		_target 			- id or element to which css style should be applied
		_imageUrl 			- image url */
	Styles.setBackgroundImage = function(_target, _imageUrl) {
		var element = Markup.getElement(_target)
		if (_imageUrl instanceof HTMLImageElement) {
			_imageUrl = _imageUrl.src
		}
		element.style.backgroundImage = 'url(' + _imageUrl + ')'
	}

	/*	Method: Styles.setBackgroundColor()
			Sets the background-image property with an url for the specified element.

		_target 			- id or element to which css style should be applied
		color 			- hex or rgb color value  */
	Styles.setBackgroundColor = function(_target, _color) {
		var element = Markup.getElement(_target)
		element.style['background-color'] = _color
	}

	/*	Method: Styles.getWidth()
			Returns the css width value for this element.

		_target			- id or element to which css style should be acquired */
	Styles.getWidth = function(_target) {
		var element = Markup.getElement(_target)
		return element.offsetWidth
	}

	/*	Method: Styles.getHeight()
			Returns the css height value for this element.

		_target			- id or element to which css style should be acquired */
	Styles.getHeight = function(_target) {
		var element = Markup.getElement(_target)
		return element.offsetHeight
	}

	/*	Method: Styles.getTop()
			Returns the css top value for this element.

		_target			- id or element to which css style should be acquired */
	Styles.getTop = function(_target) {
		return Styles.getCss(_target, 'top')
	}

	/*	Method: Styles.getLeft()
			Returns the css left value for this element.

		_target			- id or element to which css style should be acquired */
	Styles.getLeft = function(_target) {
		return Styles.getCss(_target, 'left')
	}

	/*	Method: Styles.getX()
			Returns the css transform matrix x value for this element.

		_target			- id or element to which css style should be acquired */
	Styles.getX = function(_target) {
		return Styles.getCss(_target, 'x')
	}

	/*	Method: Styles.getY()
			Returns the css transform matrix y value for this element.

		_target			- id or element to which css style should be acquired */
	Styles.getY = function(_target) {
		return Styles.getCss(_target, 'y')
	}

	return {
		init: function() {}
	}
})()

export default Styles_legacy
