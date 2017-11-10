
import React from "react";
import SvgIcon from "./svg-icon";
import { appendChild, filterProps } from "../tools";

/*
 * @property iconName
 * @property textLabel
 *
 **/

function Link(state)
{
	let props = filterProps( state, {className: "link"} ),
		child = [];

	if( !props.href ) {
		props.href = "#"
	}

	if( state.iconName ) {
		child.push(
			<SvgIcon iconName={state.iconName} key="icon" />
		)
	}

	if( state.textLabel ) {
		child.push(
			state.length ? <span className="text-label" key="label">{state.textLabel}</span> : state.textLabel
		)
	}

	appendChild(child, state);

	return (
		<a {...props}>{child}</a>
	)
}

export default Link;