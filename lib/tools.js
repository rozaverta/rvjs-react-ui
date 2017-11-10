import React from "react";
import Caller from './caller';

const regLTrim = /^\s+/;
const docFocus = typeof document !== "undefined" && 'hasFocus' in document;

const intents = ['default', 'primary', 'success', 'danger'];
const dimensions = ['lg', 'sm', 'xs'];
const htmlBlockNames = ('div,form,figure,blockquote,pre,p,h1,h2,h3,h4,h5,h6,address,article,aside,figure,footer,header,section,fieldset,figcaption,output,ul,ol,li,dd,dl,nav,hgroup,table,tfoot,thead,tbody,tr,th,td').split(',');

let Properties = {};
let Events = {};

("accept,acceptCharset,accessKey,action,allowFullScreen,allowTransparency,alt,as,async,autoComplete,autoPlay,capture,cellPadding,cellSpacing,charSet,challenge,checked,cite,classID,className,cols,colSpan,content,contentEditable,contextMenu,controls,coords,crossOrigin,data,dateTime,default,defer,dir,disabled,download,draggable,encType,form,formAction,formEncType,formMethod,formNoValidate,formTarget,frameBorder,headers,height,hidden,high,href,hrefLang,htmlFor,httpEquiv,icon,id,inputMode,integrity,is,keyParams,keyType,kind,label,lang,list,loop,low,manifest,marginHeight,marginWidth,max,maxLength,media,mediaGroup,method,min,minLength,multiple,muted,name,nonce,noValidate,open,optimum,pattern,placeholder,playsInline,poster,preload,profile,radioGroup,readOnly,referrerPolicy,rel,required,reversed,role,rows,rowSpan,sandbox,scope,scoped,scrolling,seamless,selected,shape,size,sizes,span,spellCheck,src,srcDoc,srcLang,srcSet,start,step,style,summary,tabIndex,target,title,type,useMap,value,width,wmode,wrap,about,datatype,inlist,prefix,property,resource,typeof,vocab,autoCapitalize,autoCorrect,autoSave,color,itemProp,itemScope,itemType,itemID,itemRef,results,security,unselectable,class,for")
	.split(",")
	.forEach(name => Properties[name] = true);

("Abort,CanPlay,CanPlayThrough,DurationChange,Emptied,Encrypted,Ended,Error,Input,Invalid,Load,LoadedData,LoadedMetadata,LoadStart,Pause,Play,Playing,Progress,RateChange,Reset,Seeked,Seeking,Stalled,Submit,Suspend,TimeUpdate,VolumeChange,Waiting,KeyPress,KeyDown,KeyUp,Blur,Focus,Click,DoubleClick,MouseDown,MouseMove,MouseUp,MouseOut,MouseOver,ContextMenu,Drag,DragEnd,DragEnter,DragExit,DragLeave,DragOver,DragStart,Drop,TouchCancel,TouchEnd,TouchMove,TouchStart,AnimationEnd,AnimationIteration,AnimationStart,TransitionEnd,Scroll,Wheel,Copy,Cut,Paste,Change,CompositionEnd,CompositionStart,CompositionUpdate,SelectionChange,TextInput")
	.split(",")
	.forEach(name => Events['on'+name] = true);

//

function getClassName( className )
{
	if( typeof className === 'function' ) {
		className = className()
	}

	if( Array.isArray(className) ) {
		return className.join(" ")
	}

	return typeof className === 'string' ? className : String(className)
}

function mergeClassName( props, className )
{
	if (props.className) {
		props.className = (getClassName(props.className) + " " + getClassName(className)).replace(regLTrim, '')
	} else {
		props.className = getClassName(className)
	}

	return props
}

function filterProps(props, def = {}, ignore = [])
{
	let isIgnore = ignore.length > 0;

	Object.keys(props).forEach(name => {

		if( isIgnore && ~ ignore.indexOf(name) ) {
			return
		}

		if( Events[name] ) {
			let value = props[name];

			if( typeof value === 'string' || Array.isArray(value) ) {
				def[name] = e => Caller.dispatch( value, e )
			}
			else {
				def[name] = value
			}
		}

		else if( Properties[name] || name.substr(0, 5) === 'data-' ) {
			def[name] = props[name]
		}
	});

	return def
}

function appendChild(child, props) {
	if( props.children && Array.isArray(props.children) && props.children.length ) {
		props.children.forEach((item, index) => {
			let tof = typeof item;
			if( tof !== 'undefined' && item !== null ) {
				if( tof === 'object' && !item.key ) {
					item.key = 'child-' + index;
				}
				child.push(item)
			}
		})
	}
}

function assignOnly(to, from, map)
{
	for( let i = 0, length = map.length, name; i < length; i++ ) {
		name = map[i];

		// ?name
		if( name.length && name[0] === "?" ) {
			name = name.substr(1);
			if( to.hasOwnProperty(name) ) {
				continue
			}
		}

		if(from.hasOwnProperty(name)) {
			to[name] = from[name]
		}
	}

	return to
}

function assignNot(to, from, map)
{
	Object.keys(from).forEach(name => {
		if( map.indexOf(name) < 1 ) {
			to[name] = from[name]
		}
	});

	return to
}

function blur(props)
{
	if( docFocus && document.hasFocus() ) {
		let focus, timeout = 45;
		if( typeof props.timeout === "number" && ! isNaN(props.timeout) && isFinite(props.timeout) && props.timeout > -1 ) {
			timeout = props.timeout
		}

		setTimeout(() => {
			focus = document.activeElement;
			if( focus && focus !== document.body && (! props.is || focus.closest(props.is)) && (! props.not || ! focus.closest(props.not)) ) {
				if( focus ) {
					try { focus.blur() } catch (e) {}
				}
			}
		}, timeout)
	}
}

class componentProto extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = Object.assign({}, props)
	}

	componentWillReceiveProps(props)
	{
		this.setState(props)
	}
}

export {
	intents, dimensions, htmlBlockNames, mergeClassName, filterProps, appendChild, assignOnly, assignNot, blur, componentProto
}