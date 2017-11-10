import React from "react";
import SvgIcon from './svg-icon';
import {filterProps, mergeClassName} from "../tools";
import Emitter from "rvjs-emitter";

class Checkbox extends React.Component
{
	constructor(props)
	{
		super(props);

		let self = this, state = Object.assign({}, props), emit = false, checked = false, name = null;
		self.onChange = self.onChange.bind(self);

		if( typeof state.disabled !== "boolean" ) {
			state.disabled = false
		}

		if( typeof state.checked === "boolean" ) {
			checked = state.checked
		}

		if( typeof state.name === 'string' && state.name.length ) {
			name = state.name
		}

		if( state.emitter ) {
			emit = Emitter.create(state.emitter);
			emit.on(self.emitUpdate);
			if( state.name && emit.has(state.name) ) {
				checked = emit.get(state.name) === true
			}
		}

		state.checked = checked;
		state.emitter = emit;
		state.name = name;

		self.state = state;
	}

	emitUpdate(e)
	{
		let self = this;
		if( e.name === self.state.name ) {
			self.setState({
				checked: e.action === 'delete' ? false : e.value === true
			})
		}
	}

	componentWillReceiveProps(props)
	{
		let self = this,
			state = self.state,
			checked = state.checked,
			name = state.name,
			emit = state.emitter,
			newState = assignNot({}, props, ['name', 'emitter', 'checked', 'disabled', 'value']),
			set = typeof props.checked === "boolean" && props.checked !== checked;

		if( ! emit && props.emitter ) {
			emit = newState.emitter = Emitter.create(props.emitter);
		}

		if( typeof props.disabled === "boolean" ) {
			newState.disabled = props.disabled
		}

		if( typeof props.name === 'string') {
			let rename = props.name.length ? props.name : null;
			if( rename !== name ) {
				name = newState.name = rename;
				if( name && emit ) {
					if( set ) {
						emit.set(name, checked, false)
					}
					else if( emit.has(name) ) {
						checked = emit.get(name) === true;
						set = state.checked !== checked;
					}
				}
			}
		}

		if( set ) {
			newState.checked = checked;
		}
		else {
			set = Object.keys(newState).length > 0
		}

		set && this.setState(newState)
	}

	onChange(e)
	{
		let self = this, state = self.state, checked = e.target.checked;
		e.preventDefault();

		if( ! state.disabled ) {

			if( state.name && state.emitter ) {
				state.emitter.set(state.name, checked)
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
			attr = filterProps(state, {}, ['value', 'onChange']),
			switcher = state.switcher === true,
			className = switcher ? "switcher" : "check-box",
			child = [
				<input name={state.name} type="checkbox" checked={state.checked} disabled={state.disabled} onChange={self.onChange} key="input" />
			];

		if( switcher ) {
			child.push(
				<span className="switch-toggle" key="switcher"><i /></span>
			)
		}
		else {
			child.push(
				<SvgIcon iconName={state.checked ? 'checkbox' : 'checkbox-blank'} key="icon" />
			)
		}

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

export default Checkbox;