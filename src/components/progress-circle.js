"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _tools = require("../tools");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Path = "M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89";

/*
 * @property intent
 * @property dimension
 * @property value
 * @property spinner
 *
 **/

function ProgressCircle(props) {
	var attributes = (0, _tools.filterProps)(props),
	    pathAttributes = { pathLength: null, style: null },
	    className = "pg-round",
	    dimension = props.dimension || '',
	    intent = props.intent || 'default';

	if (_tools.dimensions.indexOf(dimension) > -1) {
		className += " pg-" + dimension;
	}

	className += ' pg-' + (_tools.intents.indexOf(intent) < 0 ? _tools.intents[0] : intent);

	if (typeof props.value === "number") {
		var proc = Math.floor(280 * (props.value || 0));
		if (isNaN(proc) || proc > 280) {
			proc = 280;
		} else if (proc < 0) {
			proc = 0;
		}

		pathAttributes.pathLength = "280";
		pathAttributes.style = {
			strokeDasharray: "280, 280",
			strokeDashoffset: 280 - proc
		};

		if (props.spinner) {
			className += " pg-spinner";
		}
	} else {
		className += " pg-spinner";
	}

	(0, _tools.mergeClassName)(attributes, className);

	return _react2.default.createElement(
		"div",
		attributes,
		_react2.default.createElement(
			"div",
			{ className: "pg-round-wrap" },
			_react2.default.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				_react2.default.createElement("path", { className: "pg-round-track", d: Path }),
				_react2.default.createElement("path", _extends({ className: "pg-round-head", d: Path }, pathAttributes))
			)
		)
	);
}

exports.default = ProgressCircle;