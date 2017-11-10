import React from "react";
import { intents, dimensions, mergeClassName, appendChild, filterProps, blur, componentProto } from "../tools";
import SvgIcon from "./svg-icon";

/*
 * @property intent
 * @property dimension
 * @property fab
 * @property iconName
 * @property textLabel
 */

class Button extends componentProto
{
	constructor(props)
	{
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick( original, e )
	{
		let self = this;
		if( self.state.disabled ) {
			e.preventDefault()
		}
		else {
			original.call(self, e) !== false && blur({is: ".btn"})
		}
	}

	render()
	{
		let self  = this,
			state = self.state,
			props = filterProps(state),
			className = 'btn btn-' + ( ~ intents.indexOf(state.intent || '') || state.intent === 'link' ? state.intent : intents[0] ),
			child = [];

		if( props.disabled ) {
			className += ' btn-disabled'
		}

		if( state.dimension && ~ dimensions.indexOf(state.dimension) ) {
			className += ' btn-' + state.dimension
		}

		if( state.fab ) {
			className += ' btn-fab';
		}

		if( state.iconName ) {
			if( ! state.textLabel ) {
				className += ' btn-icon';
			}
			child.push(
				<SvgIcon iconName={state.iconName} key="icon" />
			)
		}

		if( state.textLabel ) {
			child.push(
				<span className="label" key="label">{state.textLabel}</span>
			)
		}

		appendChild(child, self.props);

		if( ! props.role ) {
			props.role = 'button'
		}

		props.ref  = 'button';
		mergeClassName(props, className);

		if( props.onClick ) {
			props.onClick = self.onClick.bind(self, props.onClick);
		}

		if( props.href ) {
			return <a {...props}>{child}</a>
		}
		else {
			return <button {...props}>{child}</button>
		}
	}
}

export default Button;