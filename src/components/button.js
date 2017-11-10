"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _tools = require("../tools");

var _svgIcon = require("./svg-icon");

var _svgIcon2 = _interopRequireDefault(_svgIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * @property intent
 * @property dimension
 * @property fab
 * @property iconName
 * @property textLabel
 */

var Button = function (_componentProto) {
	_inherits(Button, _componentProto);

	function Button(props) {
		_classCallCheck(this, Button);

		var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, props));

		_this.onClick = _this.onClick.bind(_this);
		return _this;
	}

	_createClass(Button, [{
		key: "onClick",
		value: function onClick(original, e) {
			var self = this;
			if (self.state.disabled) {
				e.preventDefault();
			} else {
				original.call(self, e) !== false && (0, _tools.blur)({ is: ".btn" });
			}
		}
	}, {
		key: "render",
		value: function render() {
			var self = this,
			    state = self.state,
			    props = (0, _tools.filterProps)(state),
			    className = 'btn btn-' + (~_tools.intents.indexOf(state.intent || '') || state.intent === 'link' ? state.intent : _tools.intents[0]),
			    child = [];

			if (props.disabled) {
				className += ' btn-disabled';
			}

			if (state.dimension && ~_tools.dimensions.indexOf(state.dimension)) {
				className += ' btn-' + state.dimension;
			}

			if (state.fab) {
				className += ' btn-fab';
			}

			if (state.iconName) {
				if (!state.textLabel) {
					className += ' btn-icon';
				}
				child.push(_react2.default.createElement(_svgIcon2.default, { iconName: state.iconName, key: "icon" }));
			}

			if (state.textLabel) {
				child.push(_react2.default.createElement(
					"span",
					{ className: "label", key: "label" },
					state.textLabel
				));
			}

			(0, _tools.appendChild)(child, self.props);

			if (!props.role) {
				props.role = 'button';
			}

			props.ref = 'button';
			(0, _tools.mergeClassName)(props, className);

			if (props.onClick) {
				props.onClick = self.onClick.bind(self, props.onClick);
			}

			if (props.href) {
				return _react2.default.createElement(
					"a",
					props,
					child
				);
			} else {
				return _react2.default.createElement(
					"button",
					props,
					child
				);
			}
		}
	}]);

	return Button;
}(_tools.componentProto);

exports.default = Button;