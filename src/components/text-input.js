"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _tools = require("../tools");

var _svgIcon = require("./svg-icon");

var _svgIcon2 = _interopRequireDefault(_svgIcon);

var _emitter = require("../emitter");

var _emitter2 = _interopRequireDefault(_emitter);

var _textController = require("../text-controller");

var _textController2 = _interopRequireDefault(_textController);

var _rvjsTools = require("rvjs-tools");

var _rvjsTools2 = _interopRequireDefault(_rvjsTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // @import els
// @import view-util
// @import view/svg-icon

// @import tools/input-controllers/password
// @import tools/input-controllers/geo-point
// @import tools/input-controllers/color
// @import tools/input-controllers/date-time

function getController(controller) {
	if (controller instanceof _textController2.default) {
		return controller;
	}

	var name = controller,
	    props = {};

	if (typeof name !== 'string') {
		if (typeof controller.name === 'string') {
			name = controller.name;
			props = (0, _tools.assignNot)(props, controller, ['name']);
		} else {
			return false;
		}
	}

	if (!_textController2.default.has(name)) {
		return false;
	}

	return _textController2.default.create(name, props);
}

var TextInput = function (_React$Component) {
	_inherits(TextInput, _React$Component);

	function TextInput(props) {
		_classCallCheck(this, TextInput);

		var _this = _possibleConstructorReturn(this, (TextInput.__proto__ || Object.getPrototypeOf(TextInput)).call(this, props));

		var self = _this,
		    state = Object.assign({}, props),
		    emit = false,
		    controller = false;

		self.setValue = self.setValue.bind(self);
		self.onChange = self.onChange.bind(self);
		self.onControllerClick = self.onControllerClick.bind(self);
		self.emitUpdate = self.emitUpdate.bind(self);

		if (typeof state.name !== "string") {
			state.name = '';
		}

		if (state.emitter) {
			emit = _emitter2.default.create(state.emitter);
			emit.on(self.emitUpdate);
			if (state.name && emit.has(state.name)) {
				state.value = emit.get(state.name);
			}
		}

		if (typeof state.value !== "string") {
			state.value = state.hasOwnProperty('value') ? _rvjsTools2.default.toString(state.value) : '';
		}

		if (state.controller) {
			controller = getController(state.controller);
			if (controller) {
				state.originalController = state.controller;
			}
		}

		var valid = true,
		    error = void 0;

		if (state.value.length) {
			valid = controller ? controller.valid(state.value, function (text) {
				error = _rvjsTools2.default.toString(text);
			}) : true;
		} else if (state.required) {
			valid = false;
		}

		state.valid = valid;
		state.alertMessage = error;
		state.emitter = emit;
		state.controller = controller;

		self.state = state;
		return _this;
	}

	_createClass(TextInput, [{
		key: "emitUpdate",
		value: function emitUpdate(e) {
			var self = this;
			if (e.name === self.state.name) {
				self.setState({
					value: e.action === 'delete' ? '' : e.value
				});
			}
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(props) {
			var self = this,
			    state = self.state,
			    value = state.value,
			    name = state.name,
			    emit = state.emitter,
			    controller = state.controller,
			    newState = (0, _tools.assignNot)({}, props, ['name', 'emitter', 'value', 'controller', 'valid', 'alertMessage']),
			    set = props.hasOwnProperty('value');

			if (!emit && props.emitter) {
				emit = newState.emitter = _emitter2.default.create(props.emitter);
			}

			if (props.controller && props.controller !== state.originalController) {
				controller = getController(props.controller);
				newState.originalController = controller ? props.controller : false;
				newState.controller = controller;
			}

			if (set) {
				value = props.value;
				if (controller) {
					value = controller.filter(value);
				}
				value = _rvjsTools2.default.toString(value);
			}

			if (typeof props.name === 'string' && name !== props.name) {
				name = newState.name = props.name;
				if (name && emit) {
					if (set) {
						emit.set(name, value, false);
					} else if (emit.has(name)) {
						set = true;
						value = emit.get(name);
						if (controller) {
							value = controller.filter(value);
						}
						value = _rvjsTools2.default.toString(value);
					}
				}
			}

			if (set && value !== state.value) {
				var valid = true,
				    error = void 0;

				if (value.length) {
					valid = controller ? controller.valid(value, function (text) {
						error = _rvjsTools2.default.toString(text);
					}) : true;
				} else if (state.required) {
					valid = false;
				}

				newState.value = value;
				newState.valid = valid;
				newState.alertMessage = error;
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
		key: "setValue",
		value: function setValue(value, e, filter) {
			var self = this,
			    state = self.state,
			    valid = true;

			if (state.value !== value) {

				var controller = state.controller || 0,
				    error = void 0;
				if (filter && controller) {
					value = _rvjsTools2.default.toString(controller.filter(value));
				}

				if (value.length) {
					valid = controller ? controller.valid(value, function (text) {
						error = _rvjsTools2.default.toString(text);
					}) : true;
				} else if (state.required) {
					valid = false;
				}

				if (state.name && state.emitter) {
					state.emitter.set(state.name, value);
					if (state.valid !== valid || state.alertMessage !== error) {
						self.setState({
							valid: valid, alertMessage: error
						});
					}
				} else {
					self.setState({
						value: value, valid: valid, alertMessage: error
					});
				}

				if (state.onChange) {
					state.onChange.call(self, e);
				}
			}
		}
	}, {
		key: "onChange",
		value: function onChange(e) {
			this.setValue(e.target.value, e, true);
		}
	}, {
		key: "onControllerClick",
		value: function onControllerClick() {
			var self = this,
			    state = self.state,
			    value = state.value || '',
			    controller = state.controller;

			if (controller) {
				controller.run(value, function (newValue) {

					var event = void 0,
					    input = self.refs.input;

					try {
						event = new Proxy(new Event("fake"), {
							get: function get(target, prop) {
								if (prop === 'target' || prop === 'currentTarget') {
									return input;
								} else {
									return target[prop];
								}
							}
						});
					} catch (e) {
						event = { type: "fake", target: input, currentTarget: input };
					}

					// update value
					if (_rvjsTools2.default.isScalar(newValue)) {
						self.setValue(_rvjsTools2.default.toString(newValue), event, false);
					}

					// update state
					else if ((typeof newValue === "undefined" ? "undefined" : _typeof(newValue)) === 'object' && newValue !== null) {

							if (newValue.hasOwnProperty('value')) {
								self.setValue(_rvjsTools2.default.toString(newValue.value), event, false);
								newValue = (0, _tools.assignNot)({}, newValue, ['value']);
							}

							if (Object.keys(newValue).length) {
								self.setState(newValue);
							}
						}
				});
			}
		}
	}, {
		key: "render",
		value: function render() {
			var self = this,
			    input = [],
			    state = self.state,
			    icon = state.iconName || '',
			    className = 'form-input',
			    props = (0, _tools.filterProps)(state, { className: 'form-control' }, ['onChange']);

			if (state.multiLine) {
				className += ' form-multiline';
			} else if (state.password === true) {
				props.type = 'password';
			} else if (typeof state.type !== 'string') {
				props.type = 'input';
			}

			if (typeof props.readOnly !== 'boolean') {
				props.readOnly = false;
			}

			if (state.controller) {
				var controller = state.controller,
				    iconClassName = controller.iconClassName;
				icon = controller.iconName || icon || 'cursor-text';
				if (state.disabled) {
					icon = _react2.default.createElement(_svgIcon2.default, { iconName: icon, className: iconClassName, key: "icon" });
				} else {
					icon = _react2.default.createElement(_svgIcon2.default, { iconName: icon, className: (iconClassName ? iconClassName + " " : "") + 'clickable', onClick: self.onControllerClick, key: "icon" });
				}
				props.readOnly = controller.readOnly;
			} else if (icon) {
				icon = _react2.default.createElement(_svgIcon2.default, { iconName: icon, key: "icon" });
			}

			props.onChange = self.onChange;
			props.key = 'input';
			props.ref = 'input';

			input[0] = state.multiLine ? _react2.default.createElement("textarea", props) : _react2.default.createElement("input", props);
			if (icon) {
				input.push(icon);
			}

			if (props.disabled) className += ' form-disabled';
			if (!props.valid) {
				className += ' form-invalid';
				if (state.alertMessage) {
					input.push(_react2.default.createElement(
						"div",
						{ className: "form-alert" },
						state.alertMessage
					));
				}
			}

			return _react2.default.createElement(
				"div",
				{ className: className },
				input
			);
		}
	}]);

	return TextInput;
}(_react2.default.Component);

exports.default = TextInput;