"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _tools = require("../tools");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @property intent
 * @property stripes
 * @property animation
 * @property value
 *
 **/

function ProgressLine(props) {
	var attributes = (0, _tools.filterProps)(props),
	    className = "pg-line",
	    intent = props.intent || 'default',
	    proc = Math.floor(100 * (props.value || 0)),
	    style = void 0;

	className += ' pg-' + (_tools.intents.indexOf(intent) < 0 ? _tools.intents[0] : intent);

	if (props.stripes !== false) className += ' pg-stripes';
	if (props.animation !== false) className += ' pg-animation';

	if (isNaN(proc) || proc > 100) {
		proc = 100;
	} else if (proc < 0) {
		proc = 0;
	}

	style = { width: proc + "%" };

	(0, _tools.mergeClassName)(attributes, className);

	return _react2.default.createElement(
		"div",
		attributes,
		_react2.default.createElement("div", { className: "pg-meter", style: style })
	);
}

exports.default = ProgressLine;