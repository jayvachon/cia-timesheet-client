import React, { Component } from 'react'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { createNumberMask, createTextMask } from 'redux-form-input-masks'

const hourMask = createTextMask({
	pattern: '99.9',
	allowEmpty: true,
})

const HourInput = (props) => {
	return (
		<div id={"row-" + props.index} className="row">
			<div className="col">
				<label>{props.day.weekday}</label>
			</div>
			<div className="col">
				<label>{props.day.date}</label>
			</div>
			<div className="col">
				<Field
					className="hour-input"
					name={"teaching" + props.index}
					component='input'
					type='number'
					max='24'
					min='0'
					onChange={props.callback}
				 />
				 <span className="right-label">hours</span>
			 </div>
			 <div className="col">
				 <Field
					className="hour-input"
					name={"prep" + props.index}
					component='input'
					type='number'
					max='24'
					min='0'
					onChange={props.callback}
				 />
				 <span className="right-label">hours</span>
			 </div>
		 </div>
	)
}

export default HourInput