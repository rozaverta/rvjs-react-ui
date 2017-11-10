"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _tools = require("../tools");

var _components = require("../components");

var _rvjsTools = require("rvjs-tools");

var _rvjsTools2 = _interopRequireDefault(_rvjsTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function GetComponent(state, index, form) {
	var component = "Components",
	    props = {};

	// component
	if (_rvjsTools2.default.isScalar(state)) {
		component = _rvjsTools2.default.toString(state);
	} else {
		if (state.component) {
			component = state.component;
		}
		props = Object.assign({}, state);
		delete props.component; // fix recursive
	}

	props.key = index;
	if (form) {
		props.emitter = form;
	}

	return (0, _components.create)(component, props);
}

/*
 * @property tagName
 * @property child
 * @property emitter
 * @property component *
 */

var Wrapper = function (_componentProto) {
	_inherits(Wrapper, _componentProto);

	function Wrapper() {
		_classCallCheck(this, Wrapper);

		return _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).apply(this, arguments));
	}

	_createClass(Wrapper, [{
		key: "render",
		value: function render() {
			var self = this,
			    state = self.state,
			    props = (0, _tools.filterProps)(state),
			    name = state.tagName || 'div',
			    child = null;

			if (_tools.htmlBlockNames.indexOf(name) < 0) {
				name = 'div';
			}

			// uiChild
			if (state.child && Array.isArray(state.child)) {
				child = state.child.map(function (component, index) {
					return GetComponent(component, index, state.emitter);
				});
			} else if (state.component) {
				child = GetComponent(state, 0, state.emitter);
			} else if (self.props.children) {
				child = self.props.children;
			}

			(0, _tools.mergeClassName)(props, "document-component");

			return _react2.default.createElement(name, props, child);
		}
	}]);

	return Wrapper;
}(_tools.componentProto);

exports.default = Wrapper;