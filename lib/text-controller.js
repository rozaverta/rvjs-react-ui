
let Controllers = {};

class TextController
{
	constructor(props)
	{
		this.props = props;
	}

	run(value, complete)
	{
		console.log("Warning, method run must be overloaded")
	}

	valid(text, errorCallback)
	{
		return true
	}

	filter(text)
	{
		return text
	}

	get readOnly()
	{
		return false
	}

	get iconName()
	{
		return ''
	}

	get iconClassName()
	{
		return null
	}

	static add(name, controller)
	{
		if( TextController.has(name) ) {
			throw new Error(`Controller '${name}' is exist`)
		}
		if( controller instanceof TextController ) {
			Controllers[name] = controller;
		}
		else {
			throw new Error(`Controller '${name}' must be implemented from the TextController class`)
		}
	}

	static has(name)
	{
		return Controllers.hasOwnProperty(name)
	}

	static create(name, props)
	{
		if( TextController.has(name) )
		{
			return new Controllers[name](props)
		}
		else {
			throw new Error(`Controller '${name}' is not exist`)
		}
	}
}

export default TextController;
