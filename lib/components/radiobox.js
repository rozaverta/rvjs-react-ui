import React from "react";
import SvgIcon from './svg-icon';
import {filterProps, mergeClassName} from "../tools";
import Emitter from "../emitter";
import Tools from "rvjs-tools";

class Radiobox extends React.Component
{
	constructor(props)
	{
		super(props);

		let self = this, state = Object.assign({}, props, ['value', 'checked', 'name']), emit = false, checked = false, name = '', value = '';
		self.onChange = self.onChange.bind(self);

		if( typeof state.disabled !== "boolean" ) {
			state.disabled = false
		}

		if( typeof props.checked === "boolean" ) {
			checked = props.checked
		}

		if( typeof props.name === 'string' ) {
			name = props.name
		}

		if( props.hasOwnProperty('value') ) {
			value = Tools.toString(props.value)
		}

		if( state.emitter ) {
			emit = Emitter.create(state.emitter);
			emit.on(self.emitUpdate);
			if( name ) {
				if( emit.has(name) ) {
					checked = emit.get(name) === value
				}
				else if( checked ) {
					emit.set(name, value, false)
				}
			}
		}

		state.name = name;
		state.emitter = emit;
		state.checked = checked;
		state.value = value;

		self.state = state;
	}

	emitUpdate(e)
	{
		let self = this;
		if( e.name && e.name === self.state.name && e.action !== 'delete' ) {
			self.setState({
				checked: e.value === self.state.value
			})
		}
	}

	componentWillReceiveProps(props)
	{
		let self  = this,
			state = self.state,
			name  = state.name,
			emit  = state.emitter,
			value = state.value,
			newState = assignNot({}, props, ['name', 'emitter', 'checked', 'disabled', 'value']);

		if( ! emit && props.emitter ) {
			emit = newState.emitter = Emitter.create(props.emitter);
		}

		if( typeof props.disabled === "boolean" ) {
			newState.disabled = props.disabled
		}

		if( typeof props.value === "string" && value !== props.value ) {
			value = props.value;
		}

		if( props.hasOwnProperty("name") ) {
			name = typeof props.name === 'string' ? props.name : ''
		}

		if( value !== state.value || name !== state.name ) {
			newState.name = name;
			newState.value = value;
			if( emit ) {
				if( emit.has(name) ) {
					newState.checked = value === emit.get(name)
				}
				else {
					emit.set(name, value, false);
					newState.checked = true
				}
			}
		}

		Object.keys(newState).length > 0 && this.setState(newState)
	}

	onChange(e)
	{
		let self = this, state = self.state, checked = e.target.checked;
		e.preventDefault();

		if( ! state.disabled && checked ) {

			if( state.name && state.emitter ) {
				state.emitter.set(state.name, state.value)
			}
			else {
				self.setState({
					checked: checked
				});
			}

			if( state.onChange ) {
				state.onChange.call( self, e )
			}
		}
	}

	render()
	{
		let self = this,
			state = self.state,
			attr = filterProps(state, {}, ['name', 'value', 'onChange']),
			className = "radio-box",
			child = [
				<input name={state.name} value={state.value} disabled={state.disabled} type="radio" checked={state.checked} onChange={self.onChange} key="input" />,
				<SvgIcon iconName={state.checked ? 'radiobox' : 'radiobox-blank'} key="icon" />
			];

		if( state.disabled ) {
			className += ' disabled'
		}
		if( state.checked ) {
			className += ' checked'
		}
		if( state.textLabel ) {
			child.push(
				<span className="text-label" key='label'>{state.textLabel}</span>
			)
		}

		mergeClassName(attr, className);

		return (
			<label {...attr}>
				{child}
			</label>
		)
	}
}

export default Radiobox;