"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _tools = require("../tools");

var _rvjsTools = require("rvjs-tools");

var _rvjsTools2 = _interopRequireDefault(_rvjsTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * @property tagName
 * @property child
 * @property isHtml
 * @property text
 */

function CreateText(item, index) {
	if (item === null || item === undefined) {
		return null;
	}

	if (_rvjsTools2.default.isScalar(item)) {
		return _rvjsTools2.default.toString(item);
	}

	var name = 'div',
	    props = { key: index },
	    text = void 0;

	(0, _tools.filterProps)(item, props);

	if (item.child && Array.isArray(item.child)) {
		text = item.child.map(function (e, i) {
			return CreateText(e, i);
		});
	} else {
		text = _rvjsTools2.default.toString(item.text);

		if (item.isHtml && text.length) {
			props.dangerouslySetInnerHTML = { __html: text };
			text = null;
		}

		if (typeof item.tagName === 'string' && _tools.htmlBlockNames.indexOf(item.tagName)) {
			name = item.tagName;
		}
	}

	return _react2.default.createElement(name, props, text);
}

var Text = function (_componentProto) {
	_inherits(Text, _componentProto);

	function Text() {
		_classCallCheck(this, Text);

		return _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).apply(this, arguments));
	}

	_createClass(Text, [{
		key: "render",
		value: function render() {
			var self = this,
			    state = self.state,
			    props = (0, _tools.filterProps)(state),
			    name = state.tagName || 'div',
			    child = null;

			if (_tools.htmlBlockNames.indexOf(name) < 1) {
				name = 'div';
			}

			if (state.child) {
				if (Array.isArray(state.child)) {
					child = state.child.map(function (item, index) {
						return CreateText(item, index);
					});
				} else {
					child = CreateText(state.child, 0);
				}
			} else if (state.text) {
				if (state.isHtml) {
					props.dangerouslySetInnerHTML = { __html: _rvjsTools2.default.toString(state.text) };
				} else {
					child = _rvjsTools2.default.toString(state.text);
				}
			} else if (self.props.children) {
				child = self.props.children;
			}

			return _react2.default.createElement(name, props, child);
		}
	}]);

	return Text;
}(_tools.componentProto);

exports.default = Text;