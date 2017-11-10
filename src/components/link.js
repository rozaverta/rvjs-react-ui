"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _svgIcon = require("./svg-icon");

var _svgIcon2 = _interopRequireDefault(_svgIcon);

var _tools = require("../tools");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @property iconName
 * @property textLabel
 *
 **/

function Link(state) {
	var props = (0, _tools.filterProps)(state, { className: "link" }),
	    child = [];

	if (!props.href) {
		props.href = "#";
	}

	if (state.iconName) {
		child.push(_react2.default.createElement(_svgIcon2.default, { iconName: state.iconName, key: "icon" }));
	}

	if (state.textLabel) {
		child.push(state.length ? _react2.default.createElement(
			"span",
			{ className: "text-label", key: "label" },
			state.textLabel
		) : state.textLabel);
	}

	(0, _tools.appendChild)(child, state);

	return _react2.default.createElement(
		"a",
		props,
		child
	);
}

exports.default = Link;