import React from "react";
import SvgIcon from './svg-icon';
import { componentReloadProps, filterProps, mergeClassName } from "../tools";
import Emitter from "rvjs-emitter";
import Tools from "rvjs-tools";

function init(state)
{
	if( typeof state.disabled !== "boolean" ) {
		state.disabled = false
	}

	if( typeof state.checked !== "boolean" ) {
		state.checked = false
	}

	state.value = Tools.toString(state.value);

	if( typeof state.name !== 'string' ) {
		state.name = ''
	}
	else if( state.name && state.emitter ) {
		if( state.emitter.has(state.name) ) {
			state.checked = state.emitter.get(state.name) === state.value
		}
		else if( state.checked ) {
			state.emitter.set(state.name, state.value, false)
		}
	}

	return state
}

class Radiobox extends React.Component
{
	constructor(props)
	{
		super(props);

		let self = this, state = Object.assign({}, props);
		self.onChange = self.onChange.bind(self);

		if( state.emitter ) {
			state.emitter = Emitter.create(state.emitter);
			state.emitter.on(self.emitUpdate);
		}

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