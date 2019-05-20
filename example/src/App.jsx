import React, { Component } from "react";

import { ID } from "./utils.js";
import Timetable from "react-scheduler-table";

const settings = {
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
		this.setState({settings: {...this.state.settings, is12hours: parseInt(e.target.value, 10) === 12}})
	}

	render() {
		return (
			<div>
				<div className="container">
					<div className="Settings">
						<h2>Settings</h2>
						<div className="form-group">
							<div className="custom-control custom-radio custom-control-inline">
							  <input 
							  	type="radio" 
							  	id="customRadioInline1" 
							  	name="customRadioInline1" 
							  	className="custom-control-input"
							  	onChange={this.setHourFormat.bind(this)}  
							  	value={12} />
							  <label className="custom-control-label" htmlFor="customRadioInline1">12 hour format</label>
							</div>
							<div className="custom-control custom-radio custom-control-inline">
							  <input 
							  	checked
							  	type="radio" 
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
					    	  <label htmlFor="formGroupExampleInput">Start of the day</label>
						      <select className="custom-select">
									  <option>Default select</option>
									</select>
					    	</div>
					    </div>
					    <div className="col">
					    	<div className="form-group">
					    	  <label htmlFor="formGroupExampleInput">End of the day</label>
						      <select className="custom-select">
									  <option>Default select</option>
									</select>
					    	</div>
					    </div>
					  </div>
					  <div className="form-row">
					  	<div className="col">
					  		<label htmlFor="customRange1">Columns</label>
					  		<input 
					  			type="range" 
					  			className="custom-range" 
					  			id="customRange1" 
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
			</div>
		);
	}
}

export default App;
