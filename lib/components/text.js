import React from "react";
import { htmlBlockNames, componentProto, filterProps } from "../tools";
import Tools from "rvjs-tools";

/*
 * @property tagName
 * @property child
 * @property isHtml
 * @property text
 */

function CreateText( item, index )
{
	if( item === null || item === undefined ) {
		return null
	}

	if( Tools.isScalar(item) ) {
		return Tools.toString(item)
	}

	let name = 'div', props = {key: index}, text;

	filterProps(item, props);

	if(item.child && Array.isArray(item.child)) {
		text = item.child.map( (e, i) => CreateText(e, i) )
	}
	else {
		text = Tools.toString( item.text );

		if( item.isHtml && text.length ) {
			props.dangerouslySetInnerHTML = { __html: text };
			text = null
		}

		if( typeof item.tagName === 'string' && htmlBlockNames.indexOf(item.tagName) ) {
			name = item.tagName
		}
	}

	return React.createElement( name, props, text )
}

class Text extends componentProto
{
	render()
	{
		let self  = this,
			state = self.state,
			props = filterProps(state),
			name  = state.tagName || 'div',
			child = null;

		if( htmlBlockNames.indexOf(name) < 1 ) {
			name = 'div'
		}

		if( state.child ) {
			if( Array.isArray(state.child) ) {
				child = state.child.map( (item, index) => CreateText(item, index) )
			}
			else {
				child = CreateText(state.child, 0)
			}
		}
		else if( state.text ) {
			if( state.isHtml ) {
				props.dangerouslySetInnerHTML = { __html: Tools.toString(state.text) };
			}
			else {
				child = Tools.toString(state.text)
			}
		}
		else if( self.props.children ) {
			child = self.props.children;
		}

		return React.createElement( name, props, child )
	}
}

export default Text;