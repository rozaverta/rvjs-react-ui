'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var Callbacks = {};
var Callers = {};
var self = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof undefined !== 'undefined' ? undefined : {};

/**
 * @return {boolean}
 */
function Has(name) {
	return Callbacks.hasOwnProperty(name);
}

exports.default = {
	add: function add(name, callback, caller) {
		if (!Has(name) && typeof callback === 'function') {
			Callbacks[name] = callback;
			Callers[name] = arguments.length > 2 && typeof caller !== 'undefined' ? caller : self;
		}
	},
	remove: function remove(name) {
		if (Has(name)) {
			delete Callbacks[name];
			delete Callers[name];
		}
	},
	callable: function callable(name) {
		return Has(Array.isArray(name) ? name[0] : name);
	},
	dispatch: function dispatch(value) {
		var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		var name = void 0,
		    props = [];

		if (Array.isArray(value)) {
			props = Object.assign([], value);
			name = props.shift();
		} else {
			name = String(value);
		}

		if (!Has(name)) {
			return null;
		}

		if (event) {
			if (!Array.isArray(event)) {
				event = [event];
			}
			if (props.length) {
				while (event.length) {
					props[props.length] = event.shift();
				}
			} else {
				props = event;
			}
		}

		return Callbacks[name].apply(Callers[name], props);
	}
};