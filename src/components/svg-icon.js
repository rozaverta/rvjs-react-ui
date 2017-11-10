"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _tools = require("../tools");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Svg = {};

/*
 * @property iconName
 * @property viewBox
 * @property width
 * @property height
 */

function SvgIcon(props) {
	var iconProps = (0, _tools.filterProps)(props),
	    name = props.iconName || "empty",
	    className = 'svg-icon icon-' + name,
	    svgProps = (0, _tools.assignOnly)({ viewBox: "0 0 24 24" }, props, ['width', 'height']),
	    path = '',
	    data = Svg[name] || "";

	if (typeof data === "string") {
		path = data;
	} else if (data) {
		(0, _tools.assignOnly)(svgProps, data, ['viewBox', '?width', '?height']);
		if (typeof data.path === 'string') {
			path = data.path;
		}
	}

	(0, _tools.mergeClassName)(iconProps, className);

	return _react2.default.createElement(
		"i",
		iconProps,
		_react2.default.createElement(
			"svg",
			svgProps,
			path.length && path[0] === '#' ? _react2.default.createElement("use", { xlinkHref: path }) : _react2.default.createElement("path", { d: path })
		)
	);
}

SvgIcon.add = function (name, value) {
	if (arguments.length < 2 && (typeof name === "undefined" ? "undefined" : _typeof(name)) === 'object') {
		Object.assign(Svg, name);
	} else {
		Svg[String(name)] = value;
	}
};

exports.default = SvgIcon;