
// @import tools/input-controllers/password
// @import tools/input-controllers/geo-point
// @import tools/input-controllers/color
// @import tools/input-controllers/date-time

import React from "react";
import { filterProps, assignNot, componentReloadProps } from "../tools";
import SvgIcon from "./svg-icon";
import Emitter from "rvjs-emitter";
import TextController from "../text-controller";
import Tools from "rvjs-tools";

// fake dispatcher

let evnTrue = true;
try { evnTrue = document.dispatchEvent( new Event('FakeChange') ) }
catch(e) { evnTrue = false }

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

function init(state)
{
	if( typeof state.name !== "string" ) {
		state.name = ''
	}
	else if( state.name && state.emitter && state.emitter.has(state.name) ) {
		state.value = state.emitter.get(state.name)
	}

	if( typeof state.value !== "string" ) {
		state.value = state.hasOwnProperty('value') ? Tools.toString(state.value) : ''
	}

	if( state.controller ) {
		state.controller = getController(state.controller);
	}

	let valid = true, error = void 0;
	if( state.value.length ) {
		valid = state.controller ? state.controller.valid(state.value, text => { error = Tools.toString(text) }) : true;
	}
	else if( state.required ) {
		valid = false;
	}

	state.valid = valid;
	state.alertMessage = error;

	if( state.controller ) {
		state.controller.init(state)
	}

	return state;
}

class TextInput extends React.Component
{
	constructor(props)
	{
		super(props);

		let self = this, state = Object.assign({}, props);

		self.setValue = self.setValue.bind(self);
		self.onChange = self.onChange.bind(self);
		self.onControllerClick = self.onControllerClick.bind(self);
		self.emitUpdate = self.emitUpdate.bind(self);

		if( state.emitter ) {
			state.emitter = Emitter.create(state.emitter);
			state.emitter.on(self.emitUpdate);
		}

		self.state = init(state);
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
		componentReloadProps(this, props, {}, {}, init)
	}

	componentWillUnmount()
	{
		let state = this.state;
		if( state.emitter ) {
			state.emitter.off(this.emitUpdate)
		}
	}

	setValue(value, event, filter)
	{
		let self  = this,
			state = self.state,
			valid = true;

		if( state.value !== value ) {

			let controller = state.controller || 0, alertMessage = void 0;
			if( filter && controller ) {
				value = Tools.toString(controller.filter(value))
			}

			if( value.length ) {
				valid = controller ? controller.valid(value, text => { alertMessage = Tools.toString(text) }) : true
			}
			else if( state.required ) {
				valid = false
			}

			if( state.name && state.emitter ) {
				state.emitter.set( state.name, value );
				if( state.valid !== valid || state.alertMessage !== alertMessage) {
					self.setState({
						valid, alertMessage
					})
				}
			}
			else {
				self.setState({
					value, valid, alertMessage
				})
			}

			if( state.onChange ) {
				state.onChange.call(self, event)
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

				let event,
					prop = { bubbles: true, cancelable: true },
					target = self.refs.input,
					trigger = e => {

						// update value
						if( Tools.isScalar(newValue) ) {
							self.setValue(Tools.toString(newValue), e, false)
						}

						// update state
						else if( typeof newValue === 'object' && newValue !== null) {

							if( newValue.hasOwnProperty('value') ) {
								self.setValue(Tools.toString(newValue.value), e, false);
								newValue = assignNot({}, newValue, ['value']);
							}

							if( Object.keys(newValue).length ) {
								self.setState(newValue)
							}
						}
					};

				try {
					if( evnTrue ) {
						event = new UIEvent('FakeChange', prop);
					}
					else {
						event = document.createEvent('Event');
						event.initEvent('FakeChange', prop);
					}

					target.addEventListener('FakeChange', trigger, false);
					target.dispatchEvent(event);
				}
				catch(e) {
					trigger({
						type: 'FakeChange',
						currentTarget: target,
						target
					})
				}
				finally {
					target.removeEventListener('FakeChange', trigger, false)
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
			if( controller.iconName !== false ) {
				icon = controller.iconName || icon || 'cursor-text';
			}

			if( icon ) {
				if( state.disabled || controller.readOnly ) {
					icon = <SvgIcon iconName={icon} className={iconClassName} key="icon" />
				}
				else {
					icon = <SvgIcon iconName={icon} className={(iconClassName ? (iconClassName + " ") : "") + 'clickable'} onClick={self.onControllerClick} key="icon" />
				}
			}
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
		if( ! state.valid ) {
			className += ' form-invalid';
			if( state.alertMessage ) {
				input.push(<div className="form-alert" key="alert">{state.alertMessage}</div>)
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