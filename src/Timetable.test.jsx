import React from "react";
import { shallow } from "enzyme";

import Timetable from "./Timetable.jsx";

const props = {
	settings: {
		startDay: 5,
		endDay: 23,
		hourSplit: 0.5,
		spaceCnt: 4
	}
};

const defaultState = {
	newStartTime: null,
	newEndTime: null,
	activeSpace: null,
	reserved: []
};

describe("render", () => {
	const { endDay, startDay, hourSplit, spaceCnt } = props.settings;
	let wrapper;
	beforeEach(() => {
		wrapper = shallow(<Timetable {...props} />);
	});
	test("renders component without error", () => {
		const component = wrapper.find('[data-test="Timetable"]');
		expect(component.length).toBe(1);
	});
	test("renders correct amount of rows", () => {
		const rowsCnt = ((endDay - startDay) * 1) / hourSplit;
		const els = wrapper.find('[data-test="Timetable"] tbody tr');
		expect(els.length).toBe(rowsCnt);
	});
	test("renders correct amount of cols with 1 time col", () => {
		const els = wrapper.find('[data-test="Timetable"] thead th');
		expect(els.length).toBe(spaceCnt + 1);
	});
	test("renders all `Add` buttons", () => {
		const rowsCnt = ((endDay - startDay) * 1) / hourSplit;
		const expectedButtonCnt = rowsCnt * spaceCnt;
		const addButtons = wrapper.find('[data-test="Timetable"] tbody td button');
		expect(addButtons.length).toBe(expectedButtonCnt);
	});
	test("renders correct time in the cell", () => {
		const cell = wrapper
			.find('[data-test="Timetable"] tbody tr')
			.first()
			.find("td")
			.first();
		expect(cell.text()).toBe("5:00");
	});
});

describe("TimeCell", () => {
	const { startDay, hourSplit, spaceCnt } = props.settings;
	let wrapper;
	let resetButton;
	beforeEach(() => {
		wrapper = shallow(<Timetable {...props} />);
		wrapper.setState({
			newStartTime: startDay + 3 * hourSplit,
			newEndTime: startDay + 5 * hourSplit,
			activeSpace: 1
		});
		wrapper.update();
		resetButton = wrapper
			.find('[data-test="Timetable"] tbody tr')
			.at(3)
			.find('[data-test="TimeCell__reset-button"]')
			.first();
	});
	describe("reset button", () => {
		test('renders correctly if "newStartTime" piece of state exist', () => {
			expect(resetButton.length).toBe(1);
		});
		test("reset button change state to its default on click", () => {
			resetButton.simulate("click");
			expect(wrapper.state()).toEqual(defaultState);
		});
	});
});

describe("state", () => {
	const { startDay, hourSplit, spaceCnt } = props.settings;
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
			activeSpace: 1
		};
		const state = wrapper.state();
		expect(state).toEqual(expecedState);
	});
	test("adding end time change state correctly; state with start day and space", () => {
		wrapper.setState({
			newStartTime: startDay + 3 * hourSplit,
			activeSpace: 1
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
			activeSpace: 1
		};
		const state = wrapper.state();
		expect(state).toEqual(expecedState);
	});
	test("adding end time on the same space and less than start time change state correctly; state with start day and space", () => {
		wrapper.setState({
			newStartTime: startDay + 5 * hourSplit,
			activeSpace: 1
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
			activeSpace: 1
		};
		const state = wrapper.state();
		expect(state).toEqual(expecedState);
	});
	test("adding start time on other space change spate correctly; state with start, end and space", () => {
		wrapper.setState({
			newStartTime: startDay + 3 * hourSplit,
			newEndTime: startDay + 5 * hourSplit,
			activeSpace: 1
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
			activeSpace: 3
		};
		const state = wrapper.state();
		expect(state).toEqual(expecedState);
	});
});
