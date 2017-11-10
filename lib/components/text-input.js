// @import els
// @import view-util
// @import view/svg-icon

// @import tools/input-controllers/password
// @import tools/input-controllers/geo-point
// @import tools/input-controllers/color
// @import tools/input-controllers/date-time

import React from "react";
import { filterProps, assignNot } from "../tools";
import SvgIcon from "./svg-icon";
import Emitter from "rvjs-emitter";
import TextController from "../text-controller";
import Tools from "rvjs-tools";

function getController( controller )
{
	if( controller instanceof TextController ) {
		return controller
	}

	let name = controller, props = {};

	if( typeof name !== 'string' ) {
		if( typeof controller.name === 'string' ) {
			name = controller.name;
			props = assignNot( props, controller, ['name'] )
		}
		else {
			return false
		}
	}

	if( ! TextController.has(name) ) {
		return false
	}

	return TextController.create( name, props )
}

class TextInput extends React.Component
{
	constructor(props)
	{
		super(props);

		let self = this, state = Object.assign({}, props), emit = false, controller = false;

		self.setValue = self.setValue.bind(self);
		self.onChange = self.onChange.bind(self);
		self.onControllerClick = self.onControllerClick.bind(self);
		self.emitUpdate = self.emitUpdate.bind(self);

		if( typeof state.name !== "string" ) {
			state.name = ''
		}

		if( state.emitter ) {
			emit = Emitter.create(state.emitter);
			emit.on(self.emitUpdate);
			if( state.name && emit.has(state.name) ) {
				state.value = emit.get(state.name)
			}
		}

		if( typeof state.value !== "string" ) {
			state.value = state.hasOwnProperty('value') ? Tools.toString(state.value) : ''
		}

		if( state.controller ) {
			controller = getController(state.controller);
			if( controller ) {
				state.originalController = state.controller;
			}
		}

		let valid = true, error = void 0;

		if( state.value.length ) {
			valid = controller ? controller.valid(state.value, text => {error = Tools.toString(text)}) : true;
		}
		else if( state.required ) {
			valid = false;
		}

		state.valid = valid;
		state.alertMessage = error;
		state.emitter = emit;
		state.controller = controller;

		self.state = state
	}

	emitUpdate(e)
	{
		let self = this;
		if( e.name === self.state.name ) {
			self.setState({
				value: e.action === 'delete' ? '' : e.value
			})
		}
	}

	componentWillReceiveProps(props)
	{
		let self = this,
			state = self.state,
			value = state.value,
			name = state.name,
			emit = state.emitter,
			controller = state.controller,
			newState = assignNot({}, props, ['name', 'emitter', 'value', 'controller', 'valid', 'alertMessage']),
			set = props.hasOwnProperty('value');

		if( ! emit && props.emitter ) {
			emit = newState.emitter = Emitter.create(props.emitter);
		}

		if( props.controller && props.controller !== state.originalController ) {
			controller = getController(props.controller);
			newState.originalController = controller ? props.controller : false;
			newState.controller = controller
		}

		if( set ) {
			value = props.value;
			if( controller ) {
				value = controller.filter(value)
			}
			value = Tools.toString(value);
		}

		if( typeof props.name === 'string' && name !== props.name ) {
			name = newState.name = props.name;
			if( name && emit ) {
				if( set ) {
					emit.set(name, value, false)
				}
				else if( emit.has(name) ) {
					set = true;
					value = emit.get(name);
					if(controller) {
						value = controller.filter(value)
					}
					value = Tools.toString(value);
				}
			}
		}

		if( set && value !== state.value ) {
			let valid = true, error = void 0;

			if( value.length ) {
				valid = controller ? controller.valid(value, text => {error = Tools.toString(text)}) : true;
			}
			else if( state.required ) {
				valid = false;
			}

			newState.value = value;
			newState.valid = valid;
			newState.alertMessage = error;
		}
		else {
			set = Object.keys(newState).length > 0
		}

		set && this.setState(newState)
	}

	componentWillUnmount()
	{
		let state = this.state;
		if( state.emitter ) {
			state.emitter.off(this.emitUpdate)
		}
	}

	setValue(value, e, filter)
	{
		let self  = this,
			state = self.state,
			valid = true;

		if( state.value !== value ) {

			let controller = state.controller || 0, error = void 0;
			if( filter && controller ) {
				value = Tools.toString(controller.filter(value))
			}

			if( value.length ) {
				valid = controller ? controller.valid(value, (text) => {error = Tools.toString(text)}) : true;
			}
			else if( state.required ) {
				valid = false;
			}

			if( state.name && state.emitter ) {
				state.emitter.set( state.name, value );
				if( state.valid !== valid || state.alertMessage !== error) {
					self.setState({
						valid: valid, alertMessage: error
					})
				}
			}
			else {
				self.setState({
					value: value, valid: valid, alertMessage: error
				})
			}

			if( state.onChange ) {
				state.onChange.call(self, e)
			}
		}
	}

	onChange(e)
	{
		this.setValue(e.target.value, e, true)
	}

	onControllerClick()
	{
		let self = this,
			state = self.state,
			value = state.value || '',
			controller = state.controller;

		if( controller ) {
			controller.run( value, newValue => {

				let event, input = self.refs.input;

				try {
					event = new Proxy( new Event("fake"), {
						get(target, prop) {
							if( prop === 'target' || prop === 'currentTarget' ) {
								return input
							}
							else {
								return target[prop]
							}
						}
					});
				}
				catch(e) {
					event = { type: "fake", target: input, currentTarget: input }
				}

				// update value
				if( Tools.isScalar(newValue) ) {
					self.setValue(Tools.toString(newValue), event, false)
				}

				// update state
				else if( typeof newValue === 'object' && newValue !== null) {

					if( newValue.hasOwnProperty('value') ) {
						self.setValue(Tools.toString(newValue.value), event, false);
						newValue = assignNot({}, newValue, ['value']);
					}

					if( Object.keys(newValue).length ) {
						self.setState(newValue)
					}
				}
			})
		}
	}

	render()
	{
		let self  = this,
			input = [],
			state = self.state,
			icon  = state.iconName || '',
			className = 'form-input',
			props = filterProps(state, {className: 'form-control'}, ['onChange']);

		if( state.multiLine ) {
			className += ' form-multiline';
		}
		else if( state.password === true ) {
			props.type = 'password'
		}
		else if( typeof state.type !== 'string' ) {
			props.type = 'input';
		}

		if( typeof props.readOnly !== 'boolean' ) {
			props.readOnly = false
		}

		if( state.controller ) {
			let controller = state.controller, iconClassName = controller.iconClassName;
			icon = controller.iconName || icon || 'cursor-text';
			if( state.disabled ) {
				icon = <SvgIcon iconName={icon} className={iconClassName} key="icon" />
			}
			else {
				icon = <SvgIcon iconName={icon} className={(iconClassName ? iconClassName + " " : "") + 'clickable'} onClick={self.onControllerClick} key="icon" />
			}
			props.readOnly = controller.readOnly;
		}
		else if( icon ) {
			icon = <SvgIcon iconName={icon} key="icon" />
		}

		props.onChange = self.onChange;
		props.key = 'input';
		props.ref = 'input';

		input[0] = state.multiLine ? <textarea {... props} /> : <input {... props} />;
		if( icon ) {
			input.push(icon)
		}

		if( props.disabled ) className += ' form-disabled';
		if( ! props.valid ) {
			className += ' form-invalid';
			if( state.alertMessage ) {
				input.push(<div className="form-alert">{state.alertMessage}</div>)
			}
		}

		return (
			<div className={className}>
				{input}
			</div>
		)
	}
}

export default TextInput;