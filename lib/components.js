
import React from "react";

import Button from "./components/button";
import Checkbox from "./components/checkbox";
import Link from "./components/link";
import ProgressCircle from "./components/progress-circle";
import ProgressLine from "./components/progress-line";
import Radiobox from "./components/radiobox";
import SvgIcon from "./components/svg-icon";
import TextInput from "./components/text-input";
import Wrapper from "./components/wrapper";

let Store = {
	Empty(props) {
		return React.createElement('div', props)
	}
};

const regDash = /-([a-z])/g;
const dashUpper = m => m[1].toUpperCase();

/**
 * @return {string}
 */
function getName(name)
{
	if( typeof name !== "string" ) {
		name = String(name)
	}

	if( !name.length ) {
		throw new Error("Component name is empty")
	}

	return name[0].toUpperCase() + name.substr(1).replace(regDash, dashUpper)
}

function set(name, component)
{
	if( typeof name === 'object' && arguments.length === 1 ) {
		Object.keys(name).forEach( cmp => {
			set( cmp, name[cmp] )
		})
	}
	else {
		name = getName(name);
		if( ! Store.hasOwnProperty( name ) ) {
			Object.defineProperty(Store, name, {
				value: component,
				configurable: false,
				writable: false
			})
		}
	}
}

function get(name)
{
	return Store[getName(name)] || Store.Empty;
}

set({
	Button,
	Checkbox,
	Link,
	ProgressCircle,
	ProgressLine,
	Radiobox,
	SvgIcon,
	TextInput,
	Wrapper
});

export {
	set,
	get,
	getName
}

export const has = (name) => Store.hasOwnProperty( getName(name) );

export const create = (name, props = {}, child = null) =>  React.createElement( get(name), props, child );
