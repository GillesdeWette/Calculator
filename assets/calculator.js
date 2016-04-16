jQuery( document ).ready( function() {
	calculator.init();
} );

var calculator = new function() {

	var self                = this;

	self.wrapTarget         = '.calculator';
	self.screenTarget       = '.screen';

	self.lastCalculated     = '0';
	self.currentValue       = '';
	self.inputStack         = [];
	self.equalsLastOperator = false;

	self.init = function() {

		jQuery( 'ul.buttons li .button' ).click( function( e ) {
			self.processInput( jQuery( this) );
		} );

		self.setScreen( self.lastCalculated );
	};

	self.processInput = function( button ) {

		var numberButton = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.' ];
		var value        = button.text();

		if ( button.parent().hasClass( 'divide' ) ) {
			value = '/';
		}

		if ( ( jQuery.inArray( value, numberButton ) !== -1 ) || ( value === '-' && self.currentValue === '' ) ) {

			if ( self.equalsLastOperator ) {
				self.currentValue = '';
			}

			if ( value == '.' && self.currentValue.match( /\./ ) ) {
				return;
			}

			self.currentValue       += value;
			self.equalsLastOperator = false;

			self.setScreen( self.currentValue );

		} else if ( value === '=' ) {

			if ( ! self.currentValue ) {
				self.currentValue = self.inputStack[ ( self.inputStack.length - 2 ) ];
			}

			self.inputStack.push( self.currentValue );

			self.currentValue       = self.processStack();
			self.inputStack         = [];
			self.equalsLastOperator = true;

			self.setScreen( self.currentValue );

		} else if ( value === 'C' ) {

			self.lastCalculated     = '0';
			self.currentValue       = '';
			self.inputStack         = [];
			self.equalsLastOperator = false;

			self.setScreen( self.lastCalculated );

		} else if ( self.currentValue && self.currentValue !== '-' ) {

			self.inputStack.push( self.currentValue );
			self.inputStack.push( value );

			self.currentValue       = '';
			self.equalsLastOperator = false;

			self.setScreen( value );
		}
	};

	self.setScreen = function( value ) {

		jQuery( self.wrapTarget + ' ' + self.screenTarget ).text( value );
	};

	self.processStack = function() {

		var lastValue    = 0;
		var lastOperator = '';
		var currentValue = 0;
		var nonNumber    = [ '/', 'x', '-', '+' ];

		jQuery.each( self.inputStack, function( index, value ) {

			// not a numner
			if ( jQuery.inArray( value, nonNumber ) !== -1 ) {

				lastOperator = value;

			// is a number
			} else {

				if ( lastOperator ) {

					currentValue = self.calculate( lastValue, value, lastOperator );
					lastValue = currentValue;
					lastOperator = '';

				} else {

					lastValue = value;
				}
			}

		} );



		return currentValue;
	};

	self.calculate = function( value1, value2, operator ) {

		value1 = parseFloat( value1 );
		value2 = parseFloat( value2 );

		var result = 0;

		switch ( operator ) {

			case '/':
				result = value1 / value2;
				break;

			case 'x' :
				result = value1 * value2;
				break;

			case '-' :
				result = value1 - value2;
				break;

			case '+' :
				result = value1 + value2;
				break;
		}

		return Math.round( result * Math.pow( 10, 8 ) ) / Math.pow( 10, 8 );
	};

};