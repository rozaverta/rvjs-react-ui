"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _tools = require("../tools");

var _components = require("../components");

var _svgIcon = require("svg-icon");

var _svgIcon2 = _interopRequireDefault(_svgIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * @property formComponent
 * @property labelText
 * @property tooltipText
 * @property required
 */

var PropsIgnored = ['formComponent', 'labelText', 'tooltipText'];

function showTooltip(text, e) {
	console.log("@todo show tooltip", text, e.currentTarget);
}

function hideTooltip() {}

var FormGroup = function (_React$Component) {
	_inherits(FormGroup, _React$Component);

	function FormGroup(props) {
		_classCallCheck(this, FormGroup);

		var _this = _possibleConstructorReturn(this, (FormGroup.__proto__ || Object.getPrototypeOf(FormGroup)).call(this, props));

		var state = Object.assign({
			formComponent: 'TextInput',
			labelText: '',
			tooltipText: '',
			required: false
		}, props);

		if (!state.id) {
			state.id = 'form_group_' + Math.floor(Math.random() * 10000000);
		}

		_this.state = state;
		return _this;
	}

	_createClass(FormGroup, [{
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(props) {
			this.setState(props);
		}
	}, {
		key: "render",
		value: function render() {
			var self = this,
			    state = this.state,
			    form = (0, _tools.filterProps)(state, {}, PropsIgnored),
			    label = [],
			    className = "form-group";

			if (state.labelText) {
				label.push(_react2.default.createElement(
					"label",
					{ key: "label", htmlFor: state.id },
					state.labelText
				));
			}

			if (state.required) {
				className += ' form-group-required';
			}

			if (state.tooltipText) {
				className += ' form-group-tooltip';
				label.push(_react2.default.createElement(_svgIcon2.default, { key: "icon", iconName: "help", onMouseLeave: hideTooltip, onMouseEnter: showTooltip.bind(self, state.tooltipText) }));
			}

			if (state.label) {
				label.push(_react2.default.createElement(
					"label",
					{ className: "control-label", key: "label", htmlFor: state.id },
					state.label
				));
				delete state.label;
			}

			return _react2.default.createElement(
				"div",
				{ className: className },
				_react2.default.createElement(
					"div",
					{ className: "row-label" },
					label
				),
				_react2.default.createElement(
					"div",
					{ className: "row-input" },
					(0, _components.create)(state.formComponent, form)
				)
			);
		}
	}]);

	return FormGroup;
}(_react2.default.Component);

exports.default = FormGroup;