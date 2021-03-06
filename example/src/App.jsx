import React, { Component } from "react";

import { ID, timeToStringParser, timeToIntParser } from "./utils.js";
import Timetable from "react-scheduler-table";

const settings = {
	cellHeight: 40,
	startDay: "09:00",
	endDay: "16:00",
	is12hours: false,
	hourSplit: 0.25, // 1 hour / 0.25 = 15 min - each row
	columnCnt: 4
};

const reserved = [
	{
		id: ID(),
		start: 10,
		end: 12,
		column: 1
	},
	{
		id: ID(),
		start: 9,
		end: 10.5,
		column: 2
	}
];

class App extends Component {
	state = {
		settings
	}

	setHourFormat(e) {
		let newSettings = {
			...this.state.settings,
			cellHeight: parseInt(e.target.value, 10) === 12 ? 52 : 40,
			is12hours: parseInt(e.target.value, 10) === 12
		}

		this.setState({ settings: newSettings })
	}

	setHours(e) {
		let newSettings = {
			...this.state.settings,
			[e.target.name]: e.target.value
		}

		this.setState({ settings: newSettings })
	}

	render() {
		const { is12hours, startDay, endDay } = this.state.settings;
		const timeToStr = timeToStringParser(is12hours);
		const timeToInt = timeToIntParser(is12hours);

		return (
			<div className="App">
				<div className="container">
					<div className="Settings">
						<h2>Settings</h2>
						<div className="form-group">
							<div className="custom-control custom-radio custom-control-inline">
							  <input 
							  	type="radio" 
							  	checked={is12hours}
							  	id="customRadioInline1" 
							  	name="customRadioInline1" 
							  	className="custom-control-input"
							  	onChange={this.setHourFormat.bind(this)}  
							  	value={12} />
							  <label className="custom-control-label" htmlFor="customRadioInline1">12 hour format</label>
							</div>
							<div className="custom-control custom-radio custom-control-inline">
							  <input 
							  	type="radio" 
							  	checked={!is12hours}
							  	id="customRadioInline2" 
							  	name="customRadioInline1" 
							  	className="custom-control-input"
							  	onChange={this.setHourFormat.bind(this)} 
							  	value={24} />
							  <label className="custom-control-label" htmlFor="customRadioInline2">24 hour format</label>
							</div>	
						</div>
						<div className="form-row">
					    <div className="col">
					    	<div className="form-group">
					    	  <label htmlFor="start_day">Start of the day</label>
						      <select
						      	id="start_day"
						      	name="startDay" 
						      	value={startDay} 
						      	className="custom-select"
						      	onChange={this.setHours.bind(this)}
						      >
									  {(() => {
									  	let arr = [];
									  	for (let i = 1; i < timeToInt(endDay); i++) {
									  		arr.push(<option value={timeToStr(i)} key={i}>{timeToStr(i)}</option>)
									  	}
									  	return arr;
									  })()}
									</select>
					    	</div>
					    </div>
					    <div className="col">
					    	<div className="form-group">
					    	  <label htmlFor="end_day">End of the day</label>
						      <select 
						      	id="end_day"
						      	name="endDay" 
						      	value={endDay} 
						      	className="custom-select"
						      	onChange={this.setHours.bind(this)}
						      >
									  {(() => {
									  	let arr = [];
									  	for (let i = timeToInt(startDay) + 1; i <= 24; i++) {
									  		arr.push(<option value={timeToStr(i)} key={i}>{timeToStr(i)}</option>)
									  	}
									  	return arr;
									  })()}
									</select>
					    	</div>
					    </div>
					  </div>
					  <div className="form-row">
					  	<div className="col">
					  		<label htmlFor="columns">Columns</label>
					  		<input 
					  			type="range" 
					  			className="custom-range" 
					  			id="columns" 
					  			min={1} 
					  			max={10} 
					  			value={this.state.settings.columnCnt}
					  			onChange={e => this.setState({settings: {...this.state.settings, columnCnt: parseInt(e.target.value, 10)}})} />
					  	</div>
					  </div>
					</div>
					<Timetable
						className="MyTable"
						classNameSavedTime="MySavedTime"
						settings={this.state.settings}
						reserved={reserved}
						savedTimeContent={
							savedTime => 
							<h5>
								My Saved Time: <br /> {`${savedTime.parsedStart} - ${savedTime.parsedEnd}`}
							</h5>
						}
						onAddTime={time => console.log("onAddTime: ", time)}
						onSaveTime={reserved =>
							console.log("onSaveTime: ", reserved)
						}
					/>
				</div>
				<footer className="Footer">
					MIT © <a href="https://github.com/SergeyDragunov">SergeyDragunov</a>
				</footer>
			</div>
		);
	}
}

export default App;
