"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _svgIcon = require("./svg-icon");

var _svgIcon2 = _interopRequireDefault(_svgIcon);

var _tools = require("../tools");

var _rvjsEmitter = require("rvjs-emitter");

var _rvjsEmitter2 = _interopRequireDefault(_rvjsEmitter);

var _rvjsTools = require("rvjs-tools");

var _rvjsTools2 = _interopRequireDefault(_rvjsTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function init(state) {
	if (typeof state.disabled !== "boolean") {
		state.disabled = false;
	}

	if (typeof state.checked !== "boolean") {
		state.checked = false;
	}

	state.value = _rvjsTools2.default.toString(state.value);

	if (typeof state.name !== 'string') {
		state.name = '';
	} else if (state.name && state.emitter) {
		if (state.emitter.has(state.name)) {
			state.checked = state.emitter.get(state.name) === state.value;
		} else if (state.checked) {
			state.emitter.set(state.name, state.value, false);
		}
	}

	return state;
}

var Radiobox = function (_React$Component) {
	_inherits(Radiobox, _React$Component);

	function Radiobox(props) {
		_classCallCheck(this, Radiobox);

		var _this = _possibleConstructorReturn(this, (Radiobox.__proto__ || Object.getPrototypeOf(Radiobox)).call(this, props));

		var self = _this,
		    state = Object.assign({}, props);
		self.onChange = self.onChange.bind(self);

		if (state.emitter) {
			state.emitter = _rvjsEmitter2.default.create(state.emitter);
			state.emitter.on(self.emitUpdate);
		}

		self.state = state;
		return _this;
	}

	_createClass(Radiobox, [{
		key: "emitUpdate",
		value: function emitUpdate(e) {
			var self = this;
			if (e.name && e.name === self.state.name && e.action !== 'delete') {
				self.setState({
					checked: e.value === self.state.value
				});
			}
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(props) {
			(0, _tools.componentReloadProps)(this, props, {}, {}, init);
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			var state = this.state;
			if (state.emitter) {
				state.emitter.off(this.emitUpdate);
			}
		}
	}, {
		key: "onChange",
		value: function onChange(e) {
			var self = this,
			    state = self.state,
			    checked = e.target.checked;
			e.preventDefault();

			if (!state.disabled && checked) {

				if (state.name && state.emitter) {
					state.emitter.set(state.name, state.value);
				} else {
					self.setState({
						checked: checked
					});
				}

				if (state.onChange) {
					state.onChange.call(self, e);
				}
			}
		}
	}, {
		key: "render",
		value: function render() {
			var self = this,
			    state = self.state,
			    attr = (0, _tools.filterProps)(state, {}, ['name', 'value', 'onChange']),
			    className = "radio-box",
			    child = [_react2.default.createElement("input", { name: state.name, value: state.value, disabled: state.disabled, type: "radio", checked: state.checked, onChange: self.onChange, key: "input" }), _react2.default.createElement(_svgIcon2.default, { iconName: state.checked ? 'radiobox' : 'radiobox-blank', key: "icon" })];

			if (state.disabled) {
				className += ' disabled';
			}
			if (state.checked) {
				className += ' checked';
			}
			if (state.textLabel) {
				child.push(_react2.default.createElement(
					"span",
					{ className: "text-label", key: "label" },
					state.textLabel
				));
			}

			(0, _tools.mergeClassName)(attr, className);

			return _react2.default.createElement(
				"label",
				attr,
				child
			);
		}
	}]);

	return Radiobox;
}(_react2.default.Component);

exports.default = Radiobox;