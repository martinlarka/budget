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
			self.setState({buttonState: 'Send data', upladedRows: response.data.added, value: ''});
		})
		.catch(function (error) {
			self.setState({buttonState: 'Error'});
		});
	}
	  
	render() {
		return (
			<div className="row justify-content-md-center">
			    <div className="col-12">
					<h3>
			    		Lägg till <small className="text-muted">data</small>
			    	</h3>
					<div className="form-group">
						<label htmlFor="exampleFormControlTextarea1">Example textarea</label>
						<textarea className="form-control"  rows="3" cols="30" value={this.state.value} onChange={this.handleChange}></textarea>
					</div>
					<div>
						<button className="btn btn-outline-primary" onClick={this.uploadData}>{this.state.buttonState}</button>
						{this.state.upladedRows && <span className='added-info'>{this.state.upladedRows} rader inlagda</span>}
					</div>
				</div>
			</div>
		)
	}
}


export default AddBudget
