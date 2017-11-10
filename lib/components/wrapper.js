
import React from "react";
import { htmlBlockNames, mergeClassName, filterProps, componentProto} from "../tools";
import { create } from "../components";
import Tools from "rvjs-tools";

function GetComponent( state, index, form )
{
	let component = "Components", props = {};

	// component
	if( Tools.isScalar(state) ) {
		component = Tools.toString(state)
	}
	else {
		if( state.component ) {
			component = state.component
		}
		props = Object.assign({}, state);
		delete props.component; // fix recursive
	}

	props.key = index;
	if( form ) {
		props.emitter = form
	}

	return create( component, props )
}

/*
 * @property tagName
 * @property child
 * @property emitter
 * @property component *
 */

class Wrapper extends componentProto
{
	render()
	{
		let self  = this,
			state = self.state,
			props = filterProps( state ),
			name  = state.tagName || 'div',
			child = null;

		if( htmlBlockNames.indexOf(name) < 0 ) {
			name = 'div'
		}

		// uiChild
		if( state.child && Array.isArray(state.child) ) {
			child = state.child.map( (component, index) => GetComponent(component, index, state.emitter) )
		}
		else if( state.component ) {
			child = GetComponent(state, 0, state.emitter)
		}
		else if( self.props.children ) {
			child = self.props.children
		}

		mergeClassName(props, "document-component");

		return React.createElement(name, props, child)
	}
}

export default Wrapper;