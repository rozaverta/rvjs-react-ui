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

var Checkbox = function (_React$Component) {
	_inherits(Checkbox, _React$Component);

	function Checkbox(props) {
		_classCallCheck(this, Checkbox);

		var _this = _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).call(this, props));

		var self = _this,
		    state = Object.assign({}, props),
		    emit = false,
		    checked = false,
		    name = null;
		self.onChange = self.onChange.bind(self);

		if (typeof state.disabled !== "boolean") {
			state.disabled = false;
		}

		if (typeof state.checked === "boolean") {
			checked = state.checked;
		}

		if (typeof state.name === 'string' && state.name.length) {
			name = state.name;
		}

		if (state.emitter) {
			emit = _rvjsEmitter2.default.create(state.emitter);
			emit.on(self.emitUpdate);
			if (state.name && emit.has(state.name)) {
				checked = emit.get(state.name) === true;
			}
		}

		state.checked = checked;
		state.emitter = emit;
		state.name = name;

		self.state = state;
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
			var self = this,
			    state = self.state,
			    checked = state.checked,
			    name = state.name,
			    emit = state.emitter,
			    newState = assignNot({}, props, ['name', 'emitter', 'checked', 'disabled', 'value']),
			    set = typeof props.checked === "boolean" && props.checked !== checked;

			if (!emit && props.emitter) {
				emit = newState.emitter = _rvjsEmitter2.default.create(props.emitter);
			}

			if (typeof props.disabled === "boolean") {
				newState.disabled = props.disabled;
			}

			if (typeof props.name === 'string') {
				var rename = props.name.length ? props.name : null;
				if (rename !== name) {
					name = newState.name = rename;
					if (name && emit) {
						if (set) {
							emit.set(name, checked, false);
						} else if (emit.has(name)) {
							checked = emit.get(name) === true;
							set = state.checked !== checked;
						}
					}
				}
			}

			if (set) {
				newState.checked = checked;
			} else {
				set = Object.keys(newState).length > 0;
			}

			set && this.setState(newState);
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