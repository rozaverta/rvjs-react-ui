
import React from "react";
import { mergeClassName, filterProps, assignOnly } from "../tools";

let Svg = {};

/*
 * @property iconName
 * @property viewBox
 * @property width
 * @property height
 */

function SvgIcon(props)
{
	let iconProps = filterProps(props),
		name = props.iconName || "empty",
		className = 'svg-icon icon-' + name,
		svgProps = assignOnly({viewBox: "0 0 24 24"}, props, ['width', 'height']),
		path = '',
		data = Svg[name] || "";

	if( typeof data === "string" ) {
		path = data
	}
	else if( data ) {
		assignOnly(svgProps, data, ['viewBox', '?width', '?height']);
		if( typeof data.path === 'string' ) {
			path = data.path
		}
	}

	mergeClassName(iconProps, className);

	return (
		<i {...iconProps}>
			<svg {...svgProps}>
				{path.length && path[0] === '#' ? <use xlinkHref={path} /> : <path d={path} />}
			</svg>
		</i>
	);
}

SvgIcon.add = function (name, value) {
	if( arguments.length < 2 && typeof name === 'object' ) {
		Object.assign(Svg, name)
	}
	else {
		Svg[String(name)] = value
	}
};

export default SvgIcon;