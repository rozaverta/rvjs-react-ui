"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.componentProto = exports.blur = exports.assignNot = exports.assignOnly = exports.appendChild = exports.filterProps = exports.mergeClassName = exports.htmlBlockNames = exports.dimensions = exports.intents = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _caller = require("./caller");

var _caller2 = _interopRequireDefault(_caller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var regLTrim = /^\s+/;
var docFocus = typeof document !== "undefined" && 'hasFocus' in document;

var intents = ['default', 'primary', 'success', 'danger'];
var dimensions = ['lg', 'sm', 'xs'];
var htmlBlockNames = 'div,form,figure,blockquote,pre,p,h1,h2,h3,h4,h5,h6,address,article,aside,figure,footer,header,section,fieldset,figcaption,output,ul,ol,li,dd,dl,nav,hgroup,table,tfoot,thead,tbody,tr,th,td'.split(',');

var Properties = {};
var Events = {};

"accept,acceptCharset,accessKey,action,allowFullScreen,allowTransparency,alt,as,async,autoComplete,autoPlay,capture,cellPadding,cellSpacing,charSet,challenge,checked,cite,classID,className,cols,colSpan,content,contentEditable,contextMenu,controls,coords,crossOrigin,data,dateTime,default,defer,dir,disabled,download,draggable,encType,form,formAction,formEncType,formMethod,formNoValidate,formTarget,frameBorder,headers,height,hidden,high,href,hrefLang,htmlFor,httpEquiv,icon,id,inputMode,integrity,is,keyParams,keyType,kind,label,lang,list,loop,low,manifest,marginHeight,marginWidth,max,maxLength,media,mediaGroup,method,min,minLength,multiple,muted,name,nonce,noValidate,open,optimum,pattern,placeholder,playsInline,poster,preload,profile,radioGroup,readOnly,referrerPolicy,rel,required,reversed,role,rows,rowSpan,sandbox,scope,scoped,scrolling,seamless,selected,shape,size,sizes,span,spellCheck,src,srcDoc,srcLang,srcSet,start,step,style,summary,tabIndex,target,title,type,useMap,value,width,wmode,wrap,about,datatype,inlist,prefix,property,resource,typeof,vocab,autoCapitalize,autoCorrect,autoSave,color,itemProp,itemScope,itemType,itemID,itemRef,results,security,unselectable,class,for".split(",").forEach(function (name) {
	return Properties[name] = true;
});

"Abort,CanPlay,CanPlayThrough,DurationChange,Emptied,Encrypted,Ended,Error,Input,Invalid,Load,LoadedData,LoadedMetadata,LoadStart,Pause,Play,Playing,Progress,RateChange,Reset,Seeked,Seeking,Stalled,Submit,Suspend,TimeUpdate,VolumeChange,Waiting,KeyPress,KeyDown,KeyUp,Blur,Focus,Click,DoubleClick,MouseDown,MouseMove,MouseUp,MouseOut,MouseOver,ContextMenu,Drag,DragEnd,DragEnter,DragExit,DragLeave,DragOver,DragStart,Drop,TouchCancel,TouchEnd,TouchMove,TouchStart,AnimationEnd,AnimationIteration,AnimationStart,TransitionEnd,Scroll,Wheel,Copy,Cut,Paste,Change,CompositionEnd,CompositionStart,CompositionUpdate,SelectionChange,TextInput".split(",").forEach(function (name) {
	return Events['on' + name] = true;
});

//

function getClassName(className) {
	if (typeof className === 'function') {
		className = className();
	}

	if (Array.isArray(className)) {
		return className.join(" ");
	}

	return typeof className === 'string' ? className : String(className);
}

function mergeClassName(props, className) {
	if (props.className) {
		props.className = (getClassName(props.className) + " " + getClassName(className)).replace(regLTrim, '');
	} else {
		props.className = getClassName(className);
	}

	return props;
}

function filterProps(props) {
	var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var ignore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

	var isIgnore = ignore.length > 0;

	Object.keys(props).forEach(function (name) {

		if (isIgnore && ~ignore.indexOf(name)) {
			return;
		}

		if (Events[name]) {
			var value = props[name];

			if (typeof value === 'string' || Array.isArray(value)) {
				def[name] = function (e) {
					return _caller2.default.dispatch(value, e);
				};
			} else {
				def[name] = value;
			}
		} else if (Properties[name] || name.substr(0, 5) === 'data-') {
			def[name] = props[name];
		}
	});

	return def;
}

function appendChild(child, props) {
	if (props.children && Array.isArray(props.children) && props.children.length) {
		props.children.forEach(function (item, index) {
			var tof = typeof item === "undefined" ? "undefined" : _typeof(item);
			if (tof !== 'undefined' && item !== null) {
				if (tof === 'object' && !item.key) {
					item.key = 'child-' + index;
				}
				child.push(item);
			}
		});
	}
}

function assignOnly(to, from, map) {
	for (var i = 0, length = map.length, name; i < length; i++) {
		name = map[i];
		if (from.hasOwnProperty(name)) {
			to[name] = from[name];
		}
	}

	return to;
}

function assignNot(to, from, map) {
	Object.keys(from).forEach(function (name) {
		if (map.indexOf(name) < 1) {
			to[name] = from[name];
		}
	});

	return to;
}

function blur(props) {
	if (docFocus && document.hasFocus()) {
		var focus = void 0,
		    timeout = 45;
		if (typeof props.timeout === "number" && !isNaN(props.timeout) && isFinite(props.timeout) && props.timeout > -1) {
			timeout = props.timeout;
		}

		setTimeout(function () {
			focus = document.activeElement;
			if (focus && focus !== document.body && (!props.is || focus.closest(props.is)) && (!props.not || !focus.closest(props.not))) {
				if (focus) {
					try {
						focus.blur();
					} catch (e) {}
				}
			}
		}, timeout);
	}
}

var componentProto = function (_React$Component) {
	_inherits(componentProto, _React$Component);

	function componentProto(props) {
		_classCallCheck(this, componentProto);

		var _this = _possibleConstructorReturn(this, (componentProto.__proto__ || Object.getPrototypeOf(componentProto)).call(this, props));

		_this.state = Object.assign({}, props);
		return _this;
	}

	_createClass(componentProto, [{
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(props) {
			this.setState(props);
		}
	}]);

	return componentProto;
}(_react2.default.Component);

exports.intents = intents;
exports.dimensions = dimensions;
exports.htmlBlockNames = htmlBlockNames;
exports.mergeClassName = mergeClassName;
exports.filterProps = filterProps;
exports.appendChild = appendChild;
exports.assignOnly = assignOnly;
exports.assignNot = assignNot;
exports.blur = blur;
exports.componentProto = componentProto;