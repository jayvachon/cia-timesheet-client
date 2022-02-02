import React, { Component } from 'react'
import { Field } from 'redux-form'

class Name extends Component {

	constructor(props) {
		super(props)
	}

	required = value => value ? undefined : 'Required'

	renderField = ({ input, type, meta: { touched, error, warning } }) => (
	  <div>
	    <label className="left-label">Full name</label>
	      <input className="name-input" {...input} type={type}/>
	      <br />
	      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
	  </div>
	)

	render() {
		return (
			<div>
				<Field
					// className="name-input"
					name="fullname"
					component={this.renderField}
					type='text'
					onChange={this.props.callback}
					validate={[ this.required ]}
				 />
			 </div>
		)
	}
}

export default Name