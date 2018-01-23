/* ----------------------------------------------------------------------------------------------------------------------------------------------------------
	Class: 	Align_old

	WARN:
		This class has been depreciated. It is only used for migrating old ads when there is a time sensitive
		deadline.  Otherwise, old units that are migrated should have their Align methods updated to use the
		<Align> class.

	Description:
		Utilities for aligning objects.
	---------------------------------------------------------------------------------------------------------------------------------------------------------- */
import { Styles, Markup, Align } from 'ad-view'

var Align_old = (function() {
	/*	Method: move()
		Moves the source DOM element horizontally and vertically, relative to its parent according to provided mode. The constants allow for picking which coordinate to apply.  

		Parameters:
			mode 	- The align type to apply
			source 	- dom element
			offset	- an optional amount to move the element after initial alignment, default to 0 
			offset2	- a second optional offset, applies when aligning on both directions, default to 0 
		
		(start code)
			Align.move ( Align.CENTER, myDiv );

			Align.move ( Align.RIGHT, myDiv, -4 );

			Align.move ( Align.BOTTOM, myDiv, -10 );

			Align.move ( Align.BOTTOM_RIGHT, myDiv, -4, -10 );

			Align.move ( Align.CENTER, myTF.textfield, 0, 15 );
		(end code)
	*/
	function move(mode, source, offset, offset2) {
		//console.log( 'Align.move()', mode, source, offset, offset2 );
		Styles.setCss(Markup.getElement(source), calculate(mode, source, offset, offset2))
	}

	/*	Method: moveX()
		Moves the source DOM element horizontally relative to its parent according to provided mode. The constants allow for picking which coordinate to apply.  

		Parameters:
			mode 	- The align type to apply
			source 	- dom element
			offset	- an optional amount to move the element after initial alignment, default to 0 
		
		(start code)
			Align.move ( Align.CENTER, myDiv );

			Align.move ( Align.RIGHT, myDiv, -4 );
		(end code)
	*/
	function moveX(mode, source, offset) {
		if (mode == Align.TOP || mode == Align.BOTTOM) {
			return
		}
		var obj = calculate(mode, source, offset)
		delete obj.y
		Styles.setCss(Markup.getElement(source), obj)
	}

	/*	Method: moveY()
		Moves the source DOM element vertically relative to its parent according to provided mode. The constants allow for picking which coordinate to apply.  

		Parameters:
			mode 	- The align type to apply
			source 	- dom element
			offset	- an optional amount to move the element after initial alignment, default to 0 
		
		(start code)
			Align.move ( Align.CENTER, myDiv );

			Align.move ( Align.BOTTOM, myDiv, -4 );
		(end code)
	*/
	function moveY(mode, source, offset) {
		if (mode == Align.LEFT || mode == Align.RIGHT) {
			return
		}
		var off1 = 0
		var off2 = offset
		if (mode == Align.TOP || mode == Align.BOTTOM) {
			off1 = offset
		}

		var obj = calculate(mode, source, off1, off2)
		delete obj.x
		Styles.setCss(Markup.getElement(source), obj)
	}

	/*	Method: calculate()
		Calculates the amount to move, but does not apply it to the source DOM element relative to its parent according to provided mode. This applies to horizontal and vertical movement. The constants allow for picking which coordinate to apply.  

		Parameters:
			mode 	- The align type to apply
			source 	- dom element
			offset	- an optional amount to move the element after initial alignment, default to 0 
			offset2	- a second optional offset, applies when aligning on both directions, default to 0 

		Note:

		
		(start code)
			Align.calculate ( Align.CENTER, myDiv );

			Align.calculate ( Align.TOP_RIGHT, myDiv, -4, -10 );
		(end code)
	*/
	function calculate(mode, source, offset, offset2) {
		var elem = Markup.getElement(source)
		offset = offset || 0
		offset2 = offset2 || 0
		var off = [offset, offset2]
		if (mode == Align.TOP || mode == Align.BOTTOM) {
			off = [0, offset]
		} else if (mode == Align.LEFT || mode == Align.RIGHT) {
			off[1] = 0
		}

		return {
			x: horizontal(mode, elem.offsetWidth, elem.parentNode.offsetWidth) + off[0],
			y: vertical(mode, elem.offsetHeight, elem.parentNode.offsetHeight) + off[1]
		}
	}

	/*	Method: horizontal()
		Calculates the x value needed to align the source width within the target width. NOT used for DOM elements, is a pure math.

		Parameters:
			mode 	- The align type to apply
			source 	- a Number representing the source width: the child
			target 	- a Number representing the target width: the parent
		
		(start code)
			var x = Align.horizontal ( Align.CENTER, obj.width, container.width );
		(end code)
	*/
	function horizontal(mode, source, target) {
		mode = mode || Align.CENTER
		var x = 0
		switch (mode) {
			case Align.BOTTOM_RIGHT:
			case Align.RIGHT:
			case Align.TOP_RIGHT:
				x = target - source
				break
			case Align.CENTER:
			case Align.TOP:
			case Align.BOTTOM:
				x = (target - source) / 2
				break
			default:
				x = 0
		}

		console.log(source, target, x)
		return x
	}

	/*	Method: vertical()
		Calculates the y value needed to align the source height within the target height. NOT used for DOM elements, is a pure math.

		Parameters:
			mode 	- The align type to apply
			source 	- a Number representing the source width: the child
			target 	- a Number representing the target width: the parent
		
		(start code)
			var y = Align.vertical ( Align.CENTER, obj.width, container.width );
		(end code)
	*/
	function vertical(mode, source, target) {
		mode = mode || Align.CENTER
		var y = 0
		switch (mode) {
			case Align.BOTTOM:
			case Align.BOTTOM_LEFT:
			case Align.BOTTOM_RIGHT:
				y = target - source
				break
			case Align.CENTER:
			case Align.LEFT:
			case Align.RIGHT:
				y = (target - source) / 2
				break
			default:
				y = 0
		}
		return y
	}

	return {
		/*	Constant: BOTTOM
			'alignBottom' */
		BOTTOM: 'alignBottom',

		/*	Constant: BOTTOM_LEFT
			'alignBottomLeft' */
		BOTTOM_LEFT: 'alignBottomLeft',

		/*	Constant: BOTTOM_RIGHT
			'alignBottomRight' */
		BOTTOM_RIGHT: 'alignBottomRight',

		/*	Constant: CENTER
			'alignCenter' */
		CENTER: 'alignCenter',

		/*	Constant: LEFT
			'alignLeft' */
		LEFT: 'alignLeft',

		/*	Constant: RIGHT
			'alignRight' */
		RIGHT: 'alignRight',

		/*	Constant: TOP
			'alignTop' */
		TOP: 'alignTop',

		/*	Constant: TOP_LEFT
			'alignTopLeft' */
		TOP_LEFT: 'alignTopLeft',

		/*	Constant: TOP_RIGHT
			'alignTopRight' */
		TOP_RIGHT: 'alignTopRight',

		move: move,
		moveX: moveX,
		moveY: moveY,
		calculate: calculate,

		horizontal: horizontal,
		vertical: vertical,

		// DEPRECIATED : backward Compatiblity
		/* Method: centerHorizontal()
				DEPRECIATED : Centers an element horizontally within its parent.
			
			Parameters:	
				target 		-	dom element
				offset		-	an optional amount to move the element after initial alignment, default to 0 
				setValue	- 	an optional Boolean, set to false will only return the target value without assigning it to the target element

			Returns:
				The targeted position left value

			DEPRECIATED: 
				 Use Align.move( Align.CENTER )
		*/
		centerHorizontal: function(target, offset, setValue) {
			return setValue ? calculate(Align.CENTER, target, offset).left : moveX(Align.CENTER, target, offset)
		},
		/* Method: centerVertical()
				DEPRECIATED : Centers an element vertically within its parent.
			
			Parameters:		
				target 		-	dom element
				offset		-	an optional amount to move the element after initial alignment, default to 0  
				setValue	- 	an optional Boolean, set to false will only return the target value without assigning it to the target element

			Returns:
				The targeted position left value

			DEPRECIATED: 
				 Use Align.move( Align.CENTER )
		*/
		centerVertical: function(target, offset, setValue) {
			var elem = Markup.getElement(target)
			offset = offset || 0
			var val = vertical(Align.CENTER, elem.offsetHeight, elem.parentNode.offsetHeight) + offset
			return setValue ? val : Styles.setCss(elem, { top: val })
		},
		/* Method: left()
				DEPRECIATED : Puts an element to the left in its parent.
			
			Parameters:		
				target 		-	dom element
				offset		-	an optional amount to move the element after initial alignment, default to 0 
				setValue	- 	an optional Boolean, set to false will only return the target value without assigning it to the target element

			Returns:
				The targeted position left value

			DEPRECIATED: 
				 Use Align.move( Align.LEFT )
		*/
		left: function(target, offset, setValue) {
			return setValue ? calculate(Align.LEFT, target, offset).left : moveX(Align.LEFT, target, offset)
		},
		/* Method: right()
				DEPRECIATED : Puts an element to the right in its parent.
			
			Parameters:	
				target 		-	dom element
				offset		-	an optional amount to move the element after initial alignment, default to 0 
				setValue	- 	an optional Boolean, set to false will only return the target value without assigning it to the target element

			Returns:
				The targeted position right value

			DEPRECIATED: 
				 Use Align.move( Align.RIGHT )
		*/
		right: function(target, offset, setValue) {
			return setValue ? calculate(Align.RIGHT, target, offset).left : moveX(Align.RIGHT, target, offset)
		},
		/* Method: top()
				DEPRECIATED : Puts an element to the top in its parent.
			
			Parameters:		
				target 		-	dom element
				offset		-	an optional amount to move the element after initial alignment, default to 0  
				setValue	- 	an optional Boolean, set to false will only return the target value without assigning it to the target element

			Returns:
				The targeted position top value

			DEPRECIATED: 
				 Use Align.move( Align.TOP )
		*/
		top: function(target, offset, setValue) {
			return setValue ? calculate(Align.TOP, target, offset).top : moveY(Align.TOP, target, offset)
		},

		/* Method: bottom()
				DEPRECIATED : Puts an element to the bottom of its parent.
			
			Parameters:		
				target 		-	dom element
				offset		-	an optional amount to move the element after initial alignment, default to 0 
				setValue	- 	an optional Boolean, set to false will only return the target value without assigning it to the target element

			Returns:
				The targeted position bottom value

			DEPRECIATED: 
				 Use Align.move( Align.BOTTOM )
		*/
		bottom: function(target, offset, setValue) {
			return setValue ? calculate(Align.BOTTOM, target, offset).top : moveY(Align.BOTTOM, target, offset)
		}
	}
})()

export default Align_old
