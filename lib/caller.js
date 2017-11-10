let Callbacks = {};
let Callers = {};
const self = typeof window !== 'undefined' ? window : ( typeof global !== 'undefined' ? global : (typeof this !== 'undefined' ? this : {}));

/**
 * @return {boolean}
 */
function Has(name)
{
	return Callbacks.hasOwnProperty(name)
}

export default {

	add(name, callback, caller)
	{
		if( ! Has(name) && typeof callback === 'function' ) {
			Callbacks[name] = callback;
			Callers[name] = arguments.length > 2 && typeof caller !== 'undefined' ? caller : self;
		}
	},

	remove(name)
	{
		if( Has(name) ) {
			delete Callbacks[name];
			delete Callers[name]
		}
	},

	callable(name)
	{
		return Has(Array.isArray(name) ? name[0] : name)
	},

	dispatch(value, event = null)
	{
		let name, props = [];

		if( Array.isArray(value) ) {
			props = Object.assign([], value);
			name = props.shift()
		}
		else {
			name = String(value)
		}

		if( !Has(name) ) {
			return null
		}

		if( event ) {
			if( ! Array.isArray(event) ) {
				event = [event]
			}
			if( props.length ) {
				while( event.length ) props[props.length] = event.shift()
			}
			else {
				props = event;
			}
		}

		return Callbacks[name].apply(Callers[name], props)
	}
}