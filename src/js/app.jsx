import React from 'react'
import ReactDOM from 'react-dom'
import styles from './style.css'
import AddBudget from './add-budget'
import Display from './display'

class App extends React.Component{
	// constructor to define initial state
	constructor() {
		super()
		this.state = {
		}
	}
	
	render() {
		return (
			<div className={`container`}>
				<Display />
				<AddBudget />
			</div>
		)
	}
}

export default App

ReactDOM.render(<App />, document.getElementById('root'))
