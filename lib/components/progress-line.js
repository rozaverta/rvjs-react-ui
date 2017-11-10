import React from "react";
import { intents, filterProps, mergeClassName } from "../tools";

/*
 * @property intent
 * @property stripes
 * @property animation
 * @property value
 *
 **/

function ProgressLine(props)
{
	let attributes = filterProps(props),
		className = "pg-line",
		intent = props.intent || 'default',
		proc = Math.floor(100 * (props.value || 0)), style;

	className += ' pg-' + (intents.indexOf(intent) < 0 ? intents[0] : intent);

	if( props.stripes !== false ) className += ' pg-stripes';
	if( props.animation !== false ) className += ' pg-animation';

	if( isNaN(proc) || proc > 100 ) {
		proc = 100
	}
	else if( proc < 0 ) {
		proc = 0
	}

	style = {width: proc + "%"};

	mergeClassName(attributes, className);

	return (
		<div {...attributes}>
			<div className="pg-meter" style={style} />
		</div>
	)
}

export default ProgressLine;
