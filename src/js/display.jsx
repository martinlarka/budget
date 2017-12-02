import React from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import _ from 'lodash';

class DisplayBudget extends React.Component{
	// constructor to define initial state
	constructor() {
		super()
		this.state = {
			result: [],
			colors: ['#EAC435', '#345995', '#03CEA4', '#FB4D3D', '#CA1551']
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
			console.log(error);q
		});
	}

	mapBarData(data) {
		const group = _.groupBy(data, (d) => d.date);
		const who = _.uniq(_.map(data, 'who'));

		//. {date, martin, debbie}

		return _.map(group, (arr, date) => 
			_.zipObject(_.concat(['date'], who), _.concat([date], _.map(who, (w) => _.reduce(arr, (sum, d) => {
				if (d.who === w) return sum + Math.abs(d.price);
				return sum;
			}, 0)))));
	}
	  
	render() {
		const { result, colors } = this.state;
		const bars = _.map(_.uniq(_.map(result, 'who')), (who, i) => <Bar key={who} dataKey={who} fill={colors[i]} stackId="a"/>)
		
		return (
			<div>	{/*'expand' | 'none' | 'wiggle' | 'silhouette' | 'sign'*/}
				<BarChart width={730} height={250} data={this.mapBarData(result)} > 
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip />
					<Legend />
					{bars}
				</BarChart>
			</div>
		)
	}
}


export default DisplayBudget
