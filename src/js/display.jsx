import React from 'react';
import axios from 'axios';
import { ResponsiveContainer, BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import _ from 'lodash';
import moment from 'moment';

class DisplayBudget extends React.Component{
	// constructor to define initial state
	constructor() {
		super()
		this.state = {
			result: [],
			colors: ['#EAC435', '#345995', '#03CEA4', '#FB4D3D', '#CA1551']
		}

		this.months = _.times(12, i => moment().subtract(i, 'months').format('YYYY MM')).reverse();

		this.getData = this.getData.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	componentWillUpdate(nextProps, nextState) {
		if (this.state.selectedMonth !== nextState.selectedMonth) {
			this.getData(nextState.selectedMonth);
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({budget: nextProps.budget});
	}

	getData(month) {
		const self = this;
		axios({
		  method: 'get',
		  url: '/api/budget/get/',
		  params: {
			month
		  }
		})
		.then(function (response) {
			const { days, result } = response.data;
			self.setState({ result, days});
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	mapBarData(data) {
		const group = _.groupBy(data, (d) => d.date);
		const who = _.uniq(_.map(data, 'who'));

		return _.map(group, (arr, date) => 
			_.zipObject(_.concat(['date'], who), _.concat([date], _.map(who, (w) => _.reduce(arr, (sum, d) => {
				if (d.who === w && d.price < 0) return sum + Math.abs(d.price);
				return sum;
			}, 0)))));
	}

	mapLineData(data) {
		const group = _.groupBy(data, (d) => d.date);
		// {date, budget, spent}
		let out = _.map(group, (arr, date) => 
			_.zipObject(['date', 'spent', 'budget'], [date, _.reduce(arr, (sum, d) => {
				if (d.price < 0) return sum + Math.abs(d.price);
				return sum;
			}, 0), this.state.budget]));

		for (var i = 1; i < out.length; i++) {
			out[i].spent += out[i-1].spent;
		}
		return out;
	}

	renderTableRows(data) {
		return _.flatMap(data, (r, i) => (
			<tr key={'table-row-' + i} className={r.date === this.state.selectedDate ? 'table-success' : ''}>
				<th scope="row">{r.date}</th>
				<td>{r.purchase}</td>
				<td>{r.city}</td>
				<td>{r.who}</td>
				<td>{r.price}</td>
			</tr>));
	}
	  
	render() {
		const { result, colors, days } = this.state;
		return (
			<div className="row justify-content-md-center">
				<div className="col-auto month-picker">
					<div className="btn-group" role="group" aria-label="Basic example">
						{this.months.map(month => 
							<button 
								onClick={() => this.setState({selectedMonth: month})}
								key={'month-button-' + month} 
								type="button" 
								className={'btn ' + (this.state.selectedMonth === month ? 'btn-primary' : 'btn-secondary')}
							>
								{moment(month).format('MMM')}
							</button>
						)}
					</div>
				</div>
			    <div className="col-12">
			    	<h3>
			    		Köp <small className="text-muted">mellan {_.first(days)} och {_.last(days)}</small>
			    	</h3>
			    	<ResponsiveContainer width='100%' height={250}>
						<BarChart barCategoryGap={5} data={this.mapBarData(result)} > 
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Legend />
							{_.map(_.uniq(_.map(result, 'who')), (who, i) => 
								<Bar 
									key={who} 
									dataKey={who} 
									fill={colors[i]} 
									stackId="a" 
									onClick={(e) => this.setState({selectedDate: e.date})}/>
							)}
						</BarChart>
					</ResponsiveContainer>
				</div>
				<div className="col-12">
			    	<h3>
			    		Budget <small className="text-muted">mellan {_.first(days)} och {_.last(days)}</small>
			    	</h3>
			    	<ResponsiveContainer width='100%' height={250}>
						<LineChart width={730} height={250} data={this.mapLineData(result)}
							margin={{ top: 5, right: 30, left: 20, bottom: 5 }} onClick={(e) => this.setState({selectedDate: e.activeLabel})}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line type="monotone" dataKey="budget" dot={false} stroke="#F72C25" />
							<Line type="monotone" dataKey="spent" dot={false} stroke="#345995" />
						</LineChart>		
					</ResponsiveContainer>
				</div>
				<div className="col-12">
					<table className="table table-hover table-responsive">
					  <thead>
					    <tr>
					      <th scope="col">Datum</th>
					      <th scope="col">Köp</th>
					      <th scope="col">Stad</th>
					      <th scope="col">Vem</th>
					      <th scope="col">Pris</th>
					    </tr>
					  </thead>
					  <tbody>
					      {this.renderTableRows(result).reverse()}
					  </tbody>
					</table>
			    </div>
			</div>
		)
	}
}


export default DisplayBudget
