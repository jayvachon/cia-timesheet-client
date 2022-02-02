import React, { Component } from 'react'
import Select from 'react-select'

class PeriodSelector extends Component {

	constructor(props) {
		super(props)
	}

	changeHandler = (value) => {
		this.props.callback(value)
	}

	render() {

		return (
			<form>
				<label>Select pay period</label>
				<Select
					value={this.props.value}
					options={this.props.options}
					onChange={this.changeHandler}
					/>
			</form>
		)
	}
}

export default PeriodSelector