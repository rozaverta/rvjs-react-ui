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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function init(state) {
	if (typeof state.name !== "string") {
		state.name = '';
	} else if (state.name && state.emitter && state.emitter.has(state.name)) {
		state.checked = state.emitter.get(state.name) === true;
	}

	if (typeof state.disabled !== "boolean") {
		state.disabled = false;
	}

	if (typeof state.checked !== "boolean") {
		state.checked = false;
	}

	return state;
}

var Checkbox = function (_React$Component) {
	_inherits(Checkbox, _React$Component);

	function Checkbox(props) {
		_classCallCheck(this, Checkbox);

		var _this = _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).call(this, props));

		var self = _this,
		    state = Object.assign({}, props);
		self.onChange = self.onChange.bind(self);

		if (state.emitter) {
			state.emitter = _rvjsEmitter2.default.create(state.emitter);
			state.emitter.on(self.emitUpdate);
		}

		self.state = init(state);
		return _this;
	}

	_createClass(Checkbox, [{
		key: "emitUpdate",
		value: function emitUpdate(e) {
			var self = this;
			if (e.name === self.state.name) {
				self.setState({
					checked: e.action === 'delete' ? false : e.value === true
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

			if (!state.disabled) {

				if (state.name && state.emitter) {
					state.emitter.set(state.name, checked);
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
			    attr = (0, _tools.filterProps)(state, {}, ['value', 'onChange']),
			    switcher = state.switcher === true,
			    className = switcher ? "switcher" : "check-box",
			    child = [_react2.default.createElement("input", { name: state.name, type: "checkbox", checked: state.checked, disabled: state.disabled, onChange: self.onChange, key: "input" })];

			if (switcher) {
				child.push(_react2.default.createElement(
					"span",
					{ className: "switch-toggle", key: "switcher" },
					_react2.default.createElement("i", null)
				));
			} else {
				child.push(_react2.default.createElement(_svgIcon2.default, { iconName: state.checked ? 'checkbox' : 'checkbox-blank', key: "icon" }));
			}

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

	return Checkbox;
}(_react2.default.Component);

exports.default = Checkbox;