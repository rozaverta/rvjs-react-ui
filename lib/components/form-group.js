import React from "react";
import { filterProps } from "../tools";
import { create } from "../components";
import SvgIcon from "svg-icon";

/*
 * @property formComponent
 * @property labelText
 * @property tooltipText
 * @property required
 */

const PropsIgnored = ['formComponent', 'labelText', 'tooltipText'];

function showTooltip(text, e)
{
	console.log("@todo show tooltip", text, e.currentTarget)
}

function hideTooltip()
{

}

class FormGroup extends React.Component
{
	constructor(props)
	{
		super(props);

		let state = Object.assign({
			formComponent: 'TextInput',
			labelText: '',
			tooltipText: '',
			required: false
		}, props);

		if( !state.id ) {
			state.id = 'form_group_' + Math.floor(Math.random()*10000000);
		}

		this.state = state;
	}

	componentWillReceiveProps(props)
	{
		this.setState(props)
	}

	render()
	{
		let self  = this,
			state = this.state,
			form  = filterProps(state, {}, PropsIgnored),
			label = [],
			className = "form-group";

		if( state.labelText ) {
			label.push(
				<label key="label" htmlFor={state.id}>{state.labelText}</label>
			)
		}

		if( state.required ) {
			className += ' form-group-required'
		}

		if( state.tooltipText ) {
			className += ' form-group-tooltip';
			label.push(
				<SvgIcon key="icon" iconName="help" onMouseLeave={hideTooltip} onMouseEnter={showTooltip.bind(self, state.tooltipText)} />
			)
		}

		if( state.label ) {
			label.push(
				<label className="control-label" key="label" htmlFor={state.id}>{state.label}</label>
			);
			delete state.label
		}

		return (
			<div className={className}>
				<div className="row-label">
					{label}
				</div>
				<div className="row-input">
					{create(state.formComponent, form)}
				</div>
			</div>
		)
	}
}

export default FormGroup;