import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import styles from './style.css'
import AddBudget from './add-budget'
import Display from './display'

class App extends React.Component{
	// constructor to define initial state
	constructor() {
		super()
		this.state = {
			budget: 0
		}

		this.getBudget = this.getBudget.bind(this);
		this.setBudget = this.setBudget.bind(this);
	}

	componentDidMount() { 
		this.getBudget();
	}

	setBudget(budget) {
		this.setState({budget});
	}

	getBudget() {
		const self = this;
		axios({
		  method: 'get',
		  url: '/api/budget/'
		})
		.then(function (response) {
			if (response.data.budget) {
				self.setState({ budget: response.data.budget});
			} 
		})
		.catch(function (error) {
			console.log(error);q
		});		
	}
	
	render() {
		return (
			<div className={`container`}>
				<Display budget={this.state.budget}/>
				<AddBudget budget={this.state.budget} setBudget={this.setBudget}/>
			</div>
		)
	}
}

export default App

ReactDOM.render(<App />, document.getElementById('root'))
