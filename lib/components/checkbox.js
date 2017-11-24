import React from "react";
import SvgIcon from './svg-icon';
import {componentReloadProps, filterProps, mergeClassName} from "../tools";
import Emitter from "rvjs-emitter";

function init(state)
{
	if( typeof state.name !== "string" ) {
		state.name = ''
	}
	else if( state.name && state.emitter && state.emitter.has(state.name) ) {
		state.checked = state.emitter.get(state.name) === true
	}

	if( typeof state.disabled !== "boolean" ) {
		state.disabled = false
	}

	if( typeof state.checked !== "boolean" ) {
		state.checked = false
	}

	return state
}

class Checkbox extends React.Component
{
	constructor(props)
	{
		super(props);

		let self = this, state = Object.assign({}, props);
		self.onChange = self.onChange.bind(self);

		if( state.emitter ) {
			state.emitter = Emitter.create(state.emitter);
			state.emitter.on(self.emitUpdate)
		}

		self.state = init(state);
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
		componentReloadProps(this, props, {}, {}, init)
	}

	componentWillUnmount()
	{
		let state = this.state;
		if( state.emitter ) {
			state.emitter.off(this.emitUpdate)
		}
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