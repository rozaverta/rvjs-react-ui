import React from "react";
import { intents, dimensions, filterProps, mergeClassName } from "../tools";

const Path = "M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89";

/*
 * @property intent
 * @property dimension
 * @property value
 * @property spinner
 *
 **/

function ProgressCircle(props)
{
	let attributes = filterProps(props),
		pathAttributes = { pathLength: null, style: null },
		className = "pg-round",
		dimension = props.dimension || '',
		intent = props.intent || 'default';

	if( dimensions.indexOf(dimension) > -1 ) {
		className += " pg-" + dimension
	}

	className += ' pg-' + ( intents.indexOf(intent) < 0 ? intents[0] : intent );

	if( typeof props.value === "number" ) 
	{
		let proc = Math.floor(280 * (props.value || 0));
		if( isNaN(proc) || proc > 280 ) {
			proc = 280
		}
		else if( proc < 0 ) {
			proc = 0
		}

		pathAttributes.pathLength = "280";
		pathAttributes.style = {
			strokeDasharray: "280, 280",
			strokeDashoffset: 280 - proc
		};

		if( props.spinner ) {
			className += " pg-spinner"
		}
	}
	else {
		className += " pg-spinner"
	}

	mergeClassName(attributes, className);

	return (
		<div {...attributes}>
			<div className="pg-round-wrap">
				<svg viewBox="0 0 100 100">
					<path className="pg-round-track" d={Path} />
					<path className="pg-round-head"  d={Path} {...pathAttributes} />
				</svg>
			</div>
		</div>
	)
}

export default ProgressCircle;