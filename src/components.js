"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.create = exports.has = exports.getName = exports.get = exports.set = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _button = require("./components/button");

var _button2 = _interopRequireDefault(_button);

var _checkbox = require("./components/checkbox");

var _checkbox2 = _interopRequireDefault(_checkbox);

var _formGroup = require("./components/form-group");

var _formGroup2 = _interopRequireDefault(_formGroup);

var _link = require("./components/link");

var _link2 = _interopRequireDefault(_link);

var _progressCircle = require("./components/progress-circle");

var _progressCircle2 = _interopRequireDefault(_progressCircle);

var _progressLine = require("./components/progress-line");

var _progressLine2 = _interopRequireDefault(_progressLine);

var _radiobox = require("./components/radiobox");

var _radiobox2 = _interopRequireDefault(_radiobox);

var _svgIcon = require("./components/svg-icon");

var _svgIcon2 = _interopRequireDefault(_svgIcon);

var _textInput = require("./components/text-input");

var _textInput2 = _interopRequireDefault(_textInput);

var _wrapper = require("./components/wrapper");

var _wrapper2 = _interopRequireDefault(_wrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Store = {
	Empty: function Empty(props) {
		return _react2.default.createElement('div', props);
	}
};

var regDash = /-([a-z])/g;
var dashUpper = function dashUpper(m) {
	return m[1].toUpperCase();
};

/**
 * @return {string}
 */
function getName(name) {
	if (typeof name !== "string") {
		name = String(name);
	}

	if (!name.length) {
		throw new Error("Component name is empty");
	}

	return name[0].toUpperCase() + name.substr(1).replace(regDash, dashUpper);
}

function set(name, component) {
	if ((typeof name === "undefined" ? "undefined" : _typeof(name)) === 'object' && arguments.length === 1) {
		Object.keys(name).forEach(function (cmp) {
			set(cmp, name[cmp]);
		});
	} else {
		name = getName(name);
		if (!Store.hasOwnProperty(name)) {
			Object.defineProperty(Store, name, {
				value: component,
				configurable: false,
				writable: false
			});
		}
	}
}

function get(name) {
	return Store[getName(name)] || Store.Empty;
}

set({
	Button: _button2.default,
	Checkbox: _checkbox2.default,
	FormGroup: _formGroup2.default,
	Link: _link2.default,
	ProgressCircle: _progressCircle2.default,
	ProgressLine: _progressLine2.default,
	Radiobox: _radiobox2.default,
	SvgIcon: _svgIcon2.default,
	TextInput: _textInput2.default,
	Wrapper: _wrapper2.default
});

exports.set = set;
exports.get = get;
exports.getName = getName;
var has = exports.has = function has(name) {
	return Store.hasOwnProperty(getName(name));
};

var create = exports.create = function create(name) {
	var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var child = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	return _react2.default.createElement(get(name), props, child);
};