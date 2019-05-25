import React from "react";
import { shallow } from "enzyme";

import { timeToStringParser, timeToIntParser } from './utils'
import Timetable from "./Timetable";

const props = {
	settings: {
		cellHeight: 40,
		startDay: "09:00",
		endDay: "16:00",
		is12hours: false,
		hourSplit: 0.25, // 1 hour / 0.25 = 15 min - each row
		columnCnt: 4
	}
};

const defaultState = {
	newStartTime: null,
	newEndTime: null,
	activeColumn: null,
	reserved: []
};

describe("render", () => {
	const { hourSplit, spaceCnt, is12hours, columnCnt } = props.settings;
	const timeToInt = timeToIntParser(is12hours);
	const startDay = timeToInt(props.settings.startDay);
	const endDay = timeToInt(props.settings.endDay);

	let wrapper;
	beforeEach(() => {
		wrapper = shallow(<Timetable {...props} />);
	});
	test("renders component without error", () => {
		const component = wrapper.find('[data-test="Timetable"]');
		expect(component.length).toBe(1);
	});
	test("renders component with default settings (without any props)", () => {
		let wrapper = shallow(<Timetable />);
		const component = wrapper.find('[data-test="Timetable"]');
		expect(component.length).toBe(1);
	});
	test("renders correct amount of rows", () => {
		const rowsCnt = ((endDay - startDay) * 1) / hourSplit;
		const els = wrapper.find('[data-test="Timetable"] tbody tr');
		expect(els.length).toBe(rowsCnt);
	});
	test("renders correct amount of columns with 'Time' col", () => {
		const els = wrapper.find('[data-test="Timetable"] thead th');
		expect(els.length).toBe(columnCnt + 1);
	});
	test("renders every button in every cell", () => {
		const rowsCnt = ((endDay - startDay) * 1) / hourSplit;
		const expectedButtonCnt = rowsCnt * columnCnt;
		const addButtons = wrapper.find('[data-test="Timetable"] tbody td button');
		expect(addButtons.length).toBe(expectedButtonCnt);
	});
	test("renders correct time in the cell", () => {
		const cell = wrapper
			.find('[data-test="Timetable"] tbody tr')
			.first()
			.find("td")
			.first();
		expect(cell.text()).toBe(props.settings.startDay);
	});
});

describe("TimeCell", () => {
	const { hourSplit, spaceCnt, is12hours } = props.settings;
	const timeToInt = timeToIntParser(is12hours);
	const startDay = timeToInt(props.settings.startDay);

	let wrapper;
	let resetButton;
	let saveButton;

	beforeEach(() => {
		wrapper = shallow(<Timetable {...props} />);
		wrapper.setState({
			newStartTime: startDay + 3 * hourSplit,
			newEndTime: startDay + 5 * hourSplit,
			activeColumn: 1
		});
		wrapper.update();
		resetButton = wrapper
			.find('[data-test="Timetable"] tbody tr')
			.at(3)
			.find('[data-test="TimeCell__reset-button"]')
			.first();
		saveButton = wrapper
			.find('[data-test="Timetable"] tbody tr')
			.at(5)
			.find('[data-test="TimeCell__save-button"]')
			.first();
	});

	describe("reset button", () => {
		test('renders correctly if "newStartTime" piece of state exist', () => {
			expect(resetButton.length).toBe(1);
		});
		test("reset button change state to its default on click", () => {
			resetButton.simulate("click");
			wrapper.update();
			expect(wrapper.state()).toEqual(defaultState);
		});
	});

	describe("save button", () => {
		test("renders correctly if 'newEndTime' piece of state exist", () => {
			expect(saveButton.length).toBe(1);
		});
		test("save buttom change state to its default on click (except new item in reserved)", () => {
			saveButton.simulate("click");
			wrapper.update();
			let newPieceOfState = {
				newStartTime: wrapper.state().newStartTime,
				newEndTime: wrapper.state().newEndTime,
				activeColumn: wrapper.state().activeColumn,
			}
			expect(newPieceOfState).toEqual({
				newStartTime: null,
				newEndTime: null,
				activeColumn: null,
			});
		});
		test("save buttom creates new item in reserved array on click", () => {
			saveButton.simulate("click");
			wrapper.update();
			let newReserved = wrapper.state().reserved;
			expect(newReserved.length).toBe(1);
		});
		test("save button creates correct time in reserved array on click", () => {
			saveButton.simulate("click");
			wrapper.update();
			let newReservedTime = {
				start: wrapper.state().reserved[0].start,
			  end: wrapper.state().reserved[0].end - hourSplit,
			  column: wrapper.state().reserved[0].column
			};
			expect(newReservedTime).toEqual({
			  start: startDay + 3 * hourSplit,
			  end: startDay + 5 * hourSplit,
			  column: 1
			});
		});
	});
});

describe("state", () => {
	const { hourSplit, spaceCnt, is12hours } = props.settings;
	const timeToInt = timeToIntParser(is12hours);
	const startDay = timeToInt(props.settings.startDay);

	let wrapper;
	beforeEach(() => {
		wrapper = shallow(<Timetable {...props} />);
	});
	test("adding start time change state correctly; state is empty", () => {
		const addButton = wrapper
			.find('[data-test="Timetable"] tbody tr')
			.at(3)
			.find("button")
			.first();
		addButton.simulate("click");
		wrapper.update();
		const expecedState = {
			...defaultState,
			newStartTime: startDay + 3 * hourSplit,
			activeColumn: 1
		};
		const state = wrapper.state();
		expect(state).toEqual(expecedState);
	});
	test("adding end time change state correctly; state with start day and space", () => {
		wrapper.setState({
			newStartTime: startDay + 3 * hourSplit,
			activeColumn: 1
		});
		wrapper.update();
		const addButton = wrapper
			.find('[data-test="Timetable"] tbody tr')
			.at(5)
			.find("button")
			.first();
		addButton.simulate("click");
		wrapper.update();
		const expecedState = {
			...defaultState,
			newStartTime: startDay + 3 * hourSplit,
			newEndTime: startDay + 5 * hourSplit,
			activeColumn: 1
		};
		const state = wrapper.state();
		expect(state).toEqual(expecedState);
	});
	test("adding end time on the same space and less than start time change state correctly; state with start day and space", () => {
		wrapper.setState({
			newStartTime: startDay + 5 * hourSplit,
			activeColumn: 1
		});
		wrapper.update();
		const addButton = wrapper
			.find('[data-test="Timetable"] tbody tr')
			.at(3)
			.find("button")
			.first();
		addButton.simulate("click");
		wrapper.update();
		const expecedState = {
			...defaultState,
			newStartTime: startDay + 3 * hourSplit,
			activeColumn: 1
		};
		const state = wrapper.state();
		expect(state).toEqual(expecedState);
	});
	test("adding start time on other space change spate correctly; state with start, end and space", () => {
		wrapper.setState({
			newStartTime: startDay + 3 * hourSplit,
			newEndTime: startDay + 5 * hourSplit,
			activeColumn: 1
		});
		wrapper.update();
		const addButton = wrapper
			.find('[data-test="Timetable"] tbody tr')
			.at(1)
			.find("button")
			.at(2);
		addButton.simulate("click");
		wrapper.update();
		const expecedState = {
			...defaultState,
			newStartTime: startDay + 1 * hourSplit,
			newEndTime: null,
			activeColumn: 3
		};
		const state = wrapper.state();
		expect(state).toEqual(expecedState);
	});
});
