"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controllers = {};

var TextController = function () {
	function TextController(props) {
		_classCallCheck(this, TextController);

		this.props = props;
	}

	_createClass(TextController, [{
		key: "run",
		value: function run(value, complete) {
			console.log("Warning, method run must be overloaded");
		}
	}, {
		key: "valid",
		value: function valid(text, errorCallback) {
			return true;
		}
	}, {
		key: "filter",
		value: function filter(text) {
			return text;
		}
	}, {
		key: "init",
		value: function init(state) {}
	}, {
		key: "readOnly",
		get: function get() {
			return false;
		}
	}, {
		key: "iconName",
		get: function get() {
			return '';
		}
	}, {
		key: "iconClassName",
		get: function get() {
			return null;
		}
	}], [{
		key: "add",
		value: function add(name, controller) {
			if (TextController.has(name)) {
				throw new Error("Controller '" + name + "' is exist");
			}
			if (TextController.isPrototypeOf(controller)) {
				Controllers[name] = controller;
			} else {
				throw new Error("Controller '" + name + "' must be implemented from the TextController class");
			}
		}
	}, {
		key: "has",
		value: function has(name) {
			return Controllers.hasOwnProperty(name);
		}
	}, {
		key: "create",
		value: function create(name, props) {
			if (TextController.has(name)) {
				return new Controllers[name](props);
			} else {
				throw new Error("Controller '" + name + "' is not exist");
			}
		}
	}]);

	return TextController;
}();

exports.default = TextController;