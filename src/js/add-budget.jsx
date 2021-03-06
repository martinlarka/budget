import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import styles from './style.css'

class AddBudget extends React.Component{
	// constructor to define initial state
	constructor(props) {
		super()
		this.state = {
			entries: '',
			budget: props.budget,
			buttonState: 'Send data'
		}

		this.uploadData = this.uploadData.bind(this);
		this.handleDataChange = this.handleDataChange.bind(this);
		this.handleBudgetChange = this.handleBudgetChange.bind(this);
	}

	handleDataChange(event) {
		this.setState({entries: event.target.value});
	}

	handleBudgetChange(event) {
		this.props.setBudget(event.target.value);
	}

	uploadData() {
		const self = this;

		self.setState({buttonState: 'Sending..'});
		axios({
		  method: 'post',
		  url: '/api/budget/add/',
		  data: {
		    entries: self.state.entries,
		    budget: self.props.budget
		  }
		})
		.then(function (response) {
			self.setState({buttonState: 'Send data', upladedRows: response.data.added, value: ''});
			self.props.setBudget(self.props.budget)
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
						<label>Data</label>
						<textarea className="form-control"  rows="3" cols="30" value={this.state.entries} onChange={this.handleDataChange}></textarea>
					</div>					
					<div className="form-group">
						<label>Budget</label>
						<input 
							type="number" 
							className="form-control"
							step={1000}
							value={this.props.budget} 
							onChange={this.handleBudgetChange} />
					</div>
					<div className='send-btn-holder'>
						<button className="btn btn-outline-primary" onClick={this.uploadData}>{this.state.buttonState}</button>
						{this.state.upladedRows && <span className='added-info'>{this.state.upladedRows} rader inlagda</span>}
					</div>
				</div>
				<p>{'0.0.2'}</p>
			</div>
		)
	}
}


export default AddBudget
