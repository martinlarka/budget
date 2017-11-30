import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import styles from './style.css'

class AddBudget extends React.Component{
	// constructor to define initial state
	constructor() {
		super()
		this.state = {
			value: '',
			buttonState: 'Send data'
		}

		this.uploadData = this.uploadData.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	uploadData() {
		const self = this;

		self.setState({buttonState: 'Sending..'});
		axios({
		  method: 'post',
		  url: '/api/budget/add/',
		  data: {
		    budget: self.state.value
		  }
		})
		.then(function (response) {
			self.setState({buttonState: 'Send data'});
		})
		.catch(function (error) {
			self.setState({buttonState: 'Error'});
		});
	}
	  
	render() {
		return (
			<div>
				<h1>Add data</h1>
				<textarea rows="10" cols="30" value={this.state.value} onChange={this.handleChange}></textarea>
				<button onClick={this.uploadData}>{this.state.buttonState}</button>
			</div>
		)
	}
}


export default AddBudget
