/* ----------------------------------------------------------------------------------------------------------------------------------------------------------
	Class: 	Markup_legacy
	WARNING: 
		This class is only used for migrating old ads. 

	Description:
		This object contains depreciated methods for the Markup module.
	---------------------------------------------------------------------------------------------------------------------------------------------------------- */
import { Styles } from 'ad-view'

var Markup_legacy = (function() {
	var Markup = {}

	/*	Method: Markup_legacy.init()
			Add this method ahead of any calls to Markup...probably in PrepareCommon.init()
	 */

	/*	Method: Markup.getElement()
			Return an element by its string-id.	*/

	Markup.getElement = function(_target) {
		if (typeof _target !== 'string') return _target
		else if (_target === 'head') return Markup.getHeader()
		else if (_target === 'body') return Markup.getBody()
		else return document.getElementById(_target)
	}

	/*	Method: Markup.clearElement()
			Empties an element of all content.	

		_target 			- element to be emptied. */

	Markup.clearElement = function(_target) {
		var element = Markup.getElement(_target)
		console.log('clearElement (' + _target + ')')
		while (element.firstChild) element.removeChild(element.firstChild)
	}

	/*	Method: Markup.getParent()
			Return an element's first parent by its string-id. 

		_target 			- element whose parent is to be returned. */
	Markup.getParent = function(_target) {
		console.log('Markup.getParent()')
		return Markup.getElement(_target).parentNode
	}

	/*	Method: Markup.getBody()
			Return the body element. */
	Markup.getBody = function() {
		return document.getElementsByTagName('body')[0]
	}

	/*	Method: Markup.getHeader()
			Return the header element. */
	Markup.getHeader = function() {
		return document.getElementsByTagName('head')[0]
	}

	/*	Method: Markup.addDiv()
			Create and add a new div element with the submitted containerData object.

		_containerData		- object with the necessary keys for creating an element. */
	Markup.addDiv = function(_containerData) {
		var element = document.createElement('div')
		element.id = _containerData.id

		Markup.applyContainerCss(element, _containerData)

		if (_containerData.target) Markup.addChild(_containerData.target, element)

		return element
	}

	/*	Method: Markup.removeDiv()
			Remove an element.

		target 				- either an element-id or the element reference itself.	*/
	Markup.removeDiv = function(_target) {
		var elem = self.getElement(_target)
		elem.parentNode.removeChild(elem)
	}

	/*	Method: Markup.addTextfield()
			Creates set of textfield divs that give us the flexibility to autosize and position text dynamically.

		_containerData			- object with the necessary keys for creating an element
		_text 					- A String of text to put inserted into the textfield
		_debug 					- Optional Boolean will turn on background colors for each of the textfield divs, or a number to set the opacity level of the colors
		_fitContainerToContents	- Optional Boolean will resize the parent and container to fit the text	
		
		Returns:
			An object containing dom elements: 
			 - container : the top most div
			 - parent : the middle div, child of container
			 - textfield : the last div, child of parent

		(start code)
			var myTf = Markup.addTextfield( {
				id: 'my_tf',
				target: View.main,
				css: {
					width: 300,
					height: 50,
					x: 0,
					y: 0
				},
				margin: 5,
				multiline: false,
				textStyles: 'color: #ff0000; font-size: 27px; line-height: 24px; font-family: template_font;'
			}, 'My first Textfield', false, false );
		(end code)
	*/
	Markup.addTextfield = function(_containerData, _text, _debug, _fitContainerToContents) {
		_debug = _debug || false
		var opacity = typeof _debug === 'boolean' ? 1 : _debug
		if (_debug) _containerData.css['backgroundColor'] = 'rgba(255,0,0,' + opacity + ')'

		// container
		var container = Markup.addDiv(_containerData)

		// parent
		var parentData = {
			id: _containerData.id + '_textParent',
			target: _containerData.id,
			css: {
				position: 'absolute',
				width: Styles.getCss(container, 'width') - _containerData.margin * 2,
				height: Styles.getCss(container, 'height'),
				left: _containerData.margin
			}
		}
		if (_debug) parentData.css['backgroundColor'] = 'rgba(0,0,255,' + opacity + ')'
		var parent = Markup.addDiv(parentData)

		//tf
		var tfData = {
			id: _containerData.id + '_textfield',
			target: parentData.id,
			css: {
				position: 'absolute',
				fontSmoothing: 'antialiased',
				osxFontSmoothing: 'grayscale',
				width: 'auto',
				height: 'auto',
				whiteSpace: _containerData.multiline ? 'normal' : 'nowrap'
			},
			multiline: _containerData.multiline ? true : false,
			styles: _containerData.textStyles
		}
		if (_debug) tfData.css['backgroundColor'] = 'rgba(0,180,0,' + opacity + ')'
		var textfield = Markup.addDiv(tfData)

		// set text
		if (_text) textfield.innerHTML = _text

		// fit divs to text
		if (_fitContainerToContents) {
			var textWidth = Styles.getWidth(textfield)
			var _margin = parseInt(_containerData.margin)

			Styles.setCss(parent, 'width', textWidth)
			Styles.setCss(parent, 'left', _margin)

			var newContainerWidth = parseInt(textWidth + _margin * 2)
			Styles.setCss(container, 'width', newContainerWidth)

			var textHeight = Styles.getHeight(textfield)
			Styles.setCss(parent, 'height', textHeight)
			Styles.setCss(container, 'height', textHeight)
		}
		return {
			container: container,
			parent: parent,
			textfield: textfield
		}
	}

	/*	Method: Markup.addInputField()
			Add an input field to the containerData.target.

		_containerData			- object with the necessary keys for creating an element. 

		(start code)
			global.View.main.zipCodeBox = Markup.addInputField( {
				id: 'zipCodeBox',
				target: View.main,
				css: {
					width: 115,
					height: 30,
					x: 22,
					y: 68
				},
				defaultValue: 'ZIP',
				styles: 'color: black; font-size: 20px; line-height: 20px; font-family: Lato-Regular_opt_US_LATAM; text-align: center;'
			});				
		(end code) */
	Markup.addInputField = function(_containerData) {
		var element = document.createElement('input')
		element.id = _containerData.id

		element.setAttribute('type', 'text')
		element.setAttribute('value', _containerData.defaultValue)
		_containerData.css.boxSizing = 'border-box'
		Markup.applyContainerCss(element, _containerData)

		Markup.addChild(_containerData.target, element)
		return element
	}

	/*	Method: Markup.addCanvas()
			Add a canvas to the containerData.target.

		_containerData			- object with the necessary keys for creating an element. 
		_add					- boolean which determines if the html DOM element is created or not (would most likely only be used with canvas data not needing visual rendering)
		*/
	Markup.addCanvas = function(_containerData, _add) {
		var element = document.createElement('canvas')
		element.id = _containerData.id
		element.width = _containerData.css.width
		element.height = _containerData.css.height
		delete _containerData.css.width
		delete _containerData.css.height
		Markup.applyContainerCss(element, _containerData)
		if (_add === false ? false : true) Markup.addChild(_containerData.target, element)
		return element
	}

	/*	Method: Markup.addChild()

		target 				- object to which the child should be added
		child 				- object to be added */
	Markup.addChild = function(_target, _child) {
		_target = Markup.getElement(_target)
		_child = Markup.getElement(_child)
		_target.appendChild(_child)
	}

	/*	Method: Markup.addHtml()
			Creates a new div element with specified id, writes the html string into it, applies the css styles, 
			and appends the new element to the targeted element.

		newDivID			- id for the new div
		htmlString			- html to be written to this div
		cssString 			- style string to be applied to this div
		targetID 			- element-id to which the div should be appended */
	Markup.addHtml = function(newDivID, htmlString, cssString, targetID) {
		var element = document.createElement('div')
		element.id = newDivID
		element.innerHTML = htmlString
		element.style.cssText = cssString
		document.getElementsByTagName(targetID)[0].appendChild(element)
	}

	/*	Method: Markup.addBorder()
			Adds borders to an element, a short cut to calling new Border().

		Parameters:
			id 			- a unique id to add to each div to avoid conflicts with other borders
			target 		- id or element to which borders should be applied
			size 		- number of pixels the border should be
			color 		- color the border should be
			alpha		- optional, transparency of border
			zIndex 		- optional, z-index of border

		Returns:
			A new Border object, see Border.js
	*/
	Markup.addBorder = function(id, target, size, color, alpha, zIndex) {
		return new Border(id, target, size, color, alpha, zIndex)
	}

	return {
		init: function() {}
	}
})()

export default Markup_legacy
