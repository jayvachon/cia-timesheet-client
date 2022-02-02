import React, { Component } from 'react'
import update from 'immutability-helper'
import download from 'downloadjs';
import { Field, reduxForm, formValueSelector } from 'redux-form'
import HourInput from './HourInput'
import Rate from './Rate'
import Name from './Name'

class HourColumn extends Component {

	constructor(props) {
		super(props)
		this.state = {
			name: '',
			hours: {
				teaching: Array(14).fill(0),
				prep: Array(14).fill(0),
			},
			rates: {
				teaching: '',
				prep: '',
			},
			payPeriod: '',
		}
		this.updateHour = this.updateHour.bind(this);
		this.updateTeachingRate = this.updateTeachingRate.bind(this);
		this.updatePrepRate = this.updatePrepRate.bind(this);
		this.updateName = this.updateName.bind(this);
	}

	updateHour(props, value) {

		// Get type of hours and index
		const name = props.currentTarget.name
		let type = name.split(/(\d+)/)[0]
		let index = name.split(/(\d+)/)[1]

		// Update the appropriate array
		const arr = this.state.hours[type]
		arr[index] = Number(value)
		const newState = update(this.state, {
			hours: { [type]: { $set: arr }}
		});
		this.setState(newState)
	}

	updateTeachingRate(props, value) {
		const newState = update(this.state, {
			rates: { teaching: { $set: Number(value) }}
		});
		this.setState(newState)
	}

	updatePrepRate(props, value) {
		const newState = update(this.state, {
			rates: { prep: { $set: Number(value) }}
		});
		this.setState(newState)
	}

	updateName(props, value) {
		this.setState({
			name: value,
		})
	}

	getSumTeaching() {
		return this.state.hours.teaching.length > 0 ? this.state.hours.teaching.reduce((p, c) => p + c) : 0
	}

	getSumPrep() {
		return this.state.hours.prep.length > 0 ? this.state.hours.prep.reduce((p, c) => p + c) : 0
	}

	getTeachingPay() {
		return this.getSumTeaching() * this.state.rates.teaching
	}

	getPrepPay() {
		return this.getSumPrep() * this.state.rates.prep
	}

	getTotalPay() {
		return (this.getSumTeaching() * this.state.rates.teaching) + (this.getSumPrep() * this.state.rates.prep)
	}

	getNetPay() {
		return (
			<div className="row">
				<div className="col">
					<strong>Total pay:</strong>
				</div>
				<div className="col">
					<strong>${this.getTeachingPay()} +</strong>
				</div>
				<div className="col">
					<strong>${this.getPrepPay()} =</strong>
				</div>
				<div className="col">
					<strong>${this.getTotalPay()}</strong>
				</div>
			</div>
		)
	}

	handleSubmit = async (event) => {
		event.preventDefault()
		await this.setState({ payPeriod: this.props.payPeriod })
		try {
			let res = await fetch(`https://codeimmersivesadmissions.website/timesheet/api/hours`, {
			    crossDomain: true,
			    mode: 'cors',
			    method: 'POST',
			    headers: {
			        'Accept': 'application/json',
			        'Content-Type': 'application/json',
			    },
			    body: JSON.stringify(this.state)
			})
			let blob = await res.blob()
			download(blob, 'timesheet.pdf', 'application/pdf')
			this.props.callback()
		} catch (err) {
			console.error(err)
		}
	}

	render() {

		const days = []
		if (this.props.payPeriod) {
			for (let i = 0; i < this.props.payPeriod.dates.length; i ++) {
				days.push(this.props.payPeriod.dates[i])
			}
		}
		const rows = []

		for (const [index, value] of days.entries()) {
			rows.push(
				<HourInput
					key={index}
					index={index}
					day={value}
					callback={this.updateHour}
				/>
			)
		}

		return (
			<div>
				<form onSubmit={this.handleSubmit}>

					{/* Row Headers */}
					<div className="row">
						<div className="col">
							<p><strong>Weekday</strong></p>
						</div>
						<div className="col">
							<p><strong>Date</strong></p>
						</div>
						<div className="col">
							<p><strong>Instruction Time</strong></p>
						</div>
						<div className="col">
							<p><strong>Prep Time</strong></p>
						</div>
					</div>

					{rows}

					{/* Hour totals */}
					<div className="row">
						<div className="col"></div>
						<div className="col"><strong>Total hours</strong></div>
						<div className="col">
							{this.getSumTeaching()} hours
						</div>
						<div className="col">
							{this.getSumPrep()} hours
						</div>
					</div>

					<hr />

					{/* Rates */}
					<Rate
						label="Instruction"
						callback={this.updateTeachingRate}
					/>
					<Rate
						label="Prep"
						callback={this.updatePrepRate}
					/>

					<hr />

					{/* Total Pay*/}
					{this.getNetPay()}

					<hr />

					{/* Name */}
					<div className="row">
						<Name
							callback={this.updateName}
						/>
					</div>

					<input 
						type="submit" 
						value="Submit" 
						className="submit" 
					/>

				</form>
			</div>
		)
	}
}

export default reduxForm({
	form: 'hours'
})(HourColumn)