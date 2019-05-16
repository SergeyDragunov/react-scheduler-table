import React, { Component } from "react";

// import { ID } from "./utils.js";
import Timetable from "react-scheduler";

const settings = {
	startDay: "09:00",
	endDay: "16:00",
	is12hours: false,
	hourSplit: 0.25, // 1 hour / 0.25 = 15 min - each row
	columnCnt: 4
};

// const reserved = [
// 	{
// 		id: ID(),
// 		start: 6,
// 		end: 7.75,
// 		column: 1
// 	},
// 	{
// 		id: ID(),
// 		start: 8,
// 		end: 10,
// 		column: 2
// 	}
// ];

class App extends Component {
	render() {
		return (
			<div>
				<Timetable
					className="MyTable"
					settings={settings}
					onAddTime={time => console.log("onAddTime: ", time)}
					onSaveTime={reserved =>
						console.log("onSaveTime: ", reserved)
					}
				/>
			</div>
		);
	}
}

export default App;
