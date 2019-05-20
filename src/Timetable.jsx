import React, { Component } from "react";
import PropTypes from "prop-types";

import styles from "./Timetable.css";
import { ReactComponent as ClearIcon } from './clear.svg';

import { timeToStringParser, timeToIntParser, ID } from "./utils.js";
import ReservedTime from "./ReservedTime.jsx";

const settings = {
	startDay: "01:00",
	endDay: "24:00",
	hourSplit: 1,
	columnCnt: 1,
	is12hours: false
};

export class Timetable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newStartTime: null,
			newEndTime: null,
			activeColumn: null,
			reserved: this.props.reserved || []
		};

		this.addTime = this.addTime.bind(this);
		this.resetTime = this.resetTime.bind(this);
		this.addToReserved = this.addToReserved.bind(this);
		this.removeFromReserved = this.removeFromReserved.bind(this);
	}

	removeFromReserved(id) {
		const updatedReserved = this.state.reserved.filter(item => item.id !== id);
		this.setState({ reserved: updatedReserved });
	}

	addToReserved() {
		const { activeColumn, newStartTime, newEndTime, reserved } = this.state;
		const { hourSplit } = this.settings;

		const isNewTimeValid = (newTime, reserved) => {
			let valid = true;
			for (let i = 0; i < reserved.length; i++) {
				const time = reserved[i];
				if (newTime.column === time.column) {
					if (
						(newTime.start >= time.start && newTime.start < time.end) ||
						(newTime.end > time.start && newTime.end <= time.end) ||
						(newTime.start < time.start && newTime.end > time.end)
					) {
						valid = false;
					}
				}
			}
			return valid;
		};

		const newTime = {
			id: ID(),
			start: newStartTime,
			end: newEndTime + hourSplit,
			column: activeColumn
		};

		if (isNewTimeValid(newTime, reserved)) {
			const newReserved = [...reserved, newTime];
			this.setState({ reserved: newReserved });
			this.resetTime();
			if (this.props.onSaveTime) this.props.onSaveTime(newReserved);
		} else {
			alert("Time is not valid");
		}
	}

	addTime(time, column) {
		const { activeColumn, newStartTime, newEndTime, reserved } = this.state;
		let newTimeObj = {};
		// chech if new column === column from state OR activeColumn is falsy
		if (column === activeColumn || !activeColumn) {
			// check if new 'end' time is not set
			if (!newEndTime) {
				// check if new start time exist and new added time greater than start time
				if (newStartTime && time > newStartTime) {
					newTimeObj = { newEndTime: time };
					this.setState({ ...newTimeObj });
				} else {
					newTimeObj = { newStartTime: time, activeColumn: column };
					this.setState({ ...newTimeObj });
				}
			} else if (
				// check if new 'end' time is exist AND new 'end' time is not less than 'start' time
				newEndTime &&
				time < newStartTime
			) {
				newTimeObj = { newStartTime: time, newEndTime: null };
				this.setState({ ...newTimeObj });
			} else {
				newTimeObj = { newEndTime: time };
				this.setState({ ...newTimeObj });
			}
		} else {
			newTimeObj = {
				newStartTime: time,
				newEndTime: null,
				activeColumn: column
			};
			this.setState({ ...newTimeObj });
		}
		newTimeObj = {
			activeColumn,
			newStartTime,
			newEndTime,
			reserved,
			...newTimeObj
		};
		if (this.props.onAddTime) this.props.onAddTime(newTimeObj);
	}

	resetTime() {
		this.setState({ newStartTime: null, newEndTime: null, activeColumn: null });
	}

	isTimeReserved(time, column) {
		let bool = false;
		const reserved = this.state.reserved;
		for (let i = 0; i < reserved.length; i++) {
			if (
				reserved[i].column === column &&
				time >= reserved[i].start &&
				time <= reserved[i].end - this.settings.hourSplit
			) {
				bool = true;
				break;
			}
		}
		return bool;
	}

	renderTimeCell(time) {
		const { columnCnt, hourSplit, is12hours } = this.settings;
		const { newStartTime, newEndTime, activeColumn } = this.state;

		const shouldAddButtonRendered = (time, column) => {
			let bool =
				((time !== newStartTime &&
					time !== newEndTime &&
					!(time >= newStartTime && time <= newEndTime)) ||
					activeColumn !== column) &&
				!this.isTimeReserved(time, column);
			return bool;
		};

		const cellStatus = column => {
			let status = "";
			if (column === activeColumn) {
				if (time === newStartTime) status = "start";
				else if (time === newEndTime) status = "end";
				else if (time > newStartTime && time < newEndTime) status = "between";
			}
			return status;
		};

		const cellReservedStatus = cellColumn => {
			let status = "";
			const reserved = this.state.reserved;
			for (let i = 0; i < reserved.length; i++) {
				const { start, end, column } = reserved[i];
				if (cellColumn === column) {
					if (time === start) status = "reserved-start";
					else if (time === end - hourSplit) status = "reserved-end";
					else if (time > start && time < end - hourSplit)
						status = "reserved-between";
				}
			}
			return status;
		};

		const getReservedTime = cellColumn => {
			const reserved = this.state.reserved;
			for (let i = 0; i < reserved.length; i++) {
				const { start, column } = reserved[i];
				if (cellColumn === column && time === start) return reserved[i];
			}
		};

		// const activeTime = () =>
		// 	newStartTime && !newEndTime
		// 		? `${this.timeToStringParser(newStartTime)} - `
		// 		: newStartTime && newEndTime
		// 		? `${this.timeToStringParser(newStartTime)} - ${this.timeToStringParser(
		// 				newEndTime + hourSplit
		// 		  )}`
		// 		: "";

		let arr = [];
		for (let column = 1; column <= columnCnt; column++) {
			arr.push(
				<td
					data-test="TimeCell"
					className={`${styles.TimeCell} ${cellStatus(column) ? styles[cellStatus(column)] : ''} ${cellReservedStatus(column)}`}
					key={column}
				>
					<div className={styles.TimeCell__wrapper}>
						{cellReservedStatus(column) === "reserved-start" ? (
							<ReservedTime
								className={this.props.classNameSavedTime}
								content={this.props.savedTimeContent}
								time={getReservedTime(column)}
								hourSplit={hourSplit}
								is12hours={is12hours}
								removeReserved={this.removeFromReserved}
							/>
						) : null}
						{cellStatus(column) === "start" ? (
							<div>
								<button
									data-test="TimeCell__reset-button"
									className={styles.TimeCell__clear}
									onClick={this.resetTime}
								>
									<ClearIcon />
								</button>
							</div>
						) : null}
						{cellStatus(column) === "end" ? (
							<button
								data-test="TimeCell__save-button"
								className={styles.TimeCell__save}
								onClick={this.addToReserved}
							>
								Save
							</button>
						) : null}
						{shouldAddButtonRendered(time, column) ? (
							<button
								data-test="TimeCell__add-time-button"
								className={styles.TimeCell__button}
								onClick={() => this.addTime(time, column)}
							/>
						) : null}
					</div>
				</td>
			);
		}
		return arr;
	}

	renderTimeRow() {
		const { startDay, endDay, hourSplit } = this.settings;
		let arr = [];
		for (let i = startDay; i < endDay; i += hourSplit) {
			let el = (
				<tr key={i}>
					<td>{Number.isInteger(i) ? this.timeToStringParser(i) : null}</td>
					{this.renderTimeCell(i)}
				</tr>
			);
			arr.push(el);
		}
		return arr;
	}

	setSettings() {
		// Default settings || props settings
		this.settings = this.props.settings ? { ...settings,	...this.props.settings } : settings;

		// Assigning 12 || 24 hour format
		this.timeToStringParser = timeToStringParser(this.settings.is12hours)
		this.timeToIntParser = timeToIntParser(this.settings.is12hours)

		this.settings.startDay = this.timeToIntParser(this.settings.startDay);
		this.settings.endDay = this.timeToIntParser(this.settings.endDay);
	}

	render() {
		this.setSettings();
		const { columnCnt } = this.settings;
		const { className } = this.props;

		return (
			<div data-test="Timetable" className={`${styles.Timetable} ${className}` || styles.Timetable}>
				<table>
					<thead>
						<tr>
							<th>Time</th>
							{(() => {
								let arr = [];
								for (let i = 0; i < columnCnt; i++) {
									arr.push(<th key={i}>{i + 1}</th>);
								}
								return arr;
							})()}
						</tr>
					</thead>
					<tbody>{this.renderTimeRow()}</tbody>
				</table>
			</div>
		);
	}
}

Timetable.propTypes = {
	settings: PropTypes.shape({
		startDay: PropTypes.string,
		endDay: PropTypes.string,
		hourSplit: PropTypes.number,
		columnCnt: PropTypes.number,
		is12hours: PropTypes.bool
	}),
	reserved: PropTypes.array,
	className: PropTypes.string,
	classNameSavedTime: PropTypes.string,
	onAddTime: PropTypes.func,
	onSaveTime: PropTypes.func
};

export default Timetable;
