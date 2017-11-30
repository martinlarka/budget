import React from 'react'
import axios from 'axios'

class DisplayBudget extends React.Component{
	// constructor to define initial state
	constructor() {
		super()
		this.state = {
			result: []
		}

		this.getData = this.getData.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	getData() {
		const self = this;

		self.setState({buttonState: 'Sending..'});
		axios({
		  method: 'get',
		  url: '/api/budget/get/',
		})
		.then(function (response) {
			const { days, result } = response.data;
			self.setState({ result, days});
		})
		.catch(function (error) {
			console.log(error);
		});
	}
	  
	render() {
		return (
			<div>
				{this.state.result.length}
			</div>
		)
	}
}


export default DisplayBudget
