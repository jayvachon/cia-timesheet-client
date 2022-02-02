import React, { Component } from 'react'
import { Field } from 'redux-form'

class Rate extends Component {

	constructor(props) {
		super(props)
	}

	required = value => {
		if (this.props.label.toLowerCase() === 'instruction') {
			if (value === undefined) {
				return 'Required'
			} else {
				return undefined
			}
		} else {
			return undefined
		}
	}
	min = value => {
		if (value !== undefined && value < 0) {
			return 'Must be greater than 0'
		} else {
			return undefined
		}
	}

	renderField = ({ input, type, meta: { touched, error, warning } }) => (
	  <div className="col">
	    <label className="left-label">$</label>
	      <input className="rate-input" {...input} type={type}/>
	      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
	  </div>
	)

	render() {
		return (
			<div className="row">
				<div className="col">
					<label>{this.props.label} rate</label>
				</div>
					<Field
						name={this.props.label.toLowerCase() + "rate"}
						component={this.renderField}
						type='number'
						validate={[ this.required, this.min ]}
						onChange={this.props.callback}
					 />
				 <div className="col"></div>
				 <div className="col"></div>
			 </div>
		)
	}
}

export default Rate