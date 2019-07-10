# react-scheduler-table

> 

[![NPM](https://img.shields.io/npm/v/react-scheduler-table.svg)](https://www.npmjs.com/package/react-scheduler-table) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-scheduler-table
```

## Usage

```jsx
import React, { Component } from 'react'

import Timetable from 'react-scheduler-table'

const settings = {
	startDay: "09:00",
	endDay: "16:00",
	is12hours: false,
	hourSplit: 0.25,
	columnCnt: 4
};

class Example extends Component {
  render () {
    return (
      <Timetable settings={settings} />
    )
  }
}
```

### Default Settings

```jsx
...
const settings = {
	cellHeight: 40,    // `cellHeight` - height for cells (needed for proper render SavedTime);
	startDay: "01:00", // `startDay` - starting time for the table;
	endDay: "24:00",   // `endDay` - ending time for the table;
	hourSplit: 1,      // `is12hours` - 12 or 24 hours format;
	columnCnt: 1,      // `hourSplit` - how hour should be divided (or row count for one hour). `0.5` for 30 min hour split (or 2 rows for one hour);
	is12hours: false   // `columnCnt` - how many columns in the timetable;
};
...
```

## Props

| Property | Type | Description |
|----------------------|--------------------------|-------------------------------------|
| `settings` | Object | Initial settings for timetable |
| `className` | String | Class for main component table. |
| `classNameSavedTime` | String | Class for SavedTime component. |
| `reserved` | Array | Default data. |
| `savedTimeContent` | React Component / String | Content inside SavedTime component. |

## Methods

| Method       | Type     | Example                                  | Param                                                                                            | Description                                          |
|--------------|----------|------------------------------------------|--------------------------------------------------------------------------------------------------|------------------------------------------------------|
| `onAddTime`  | Function | `onAddTime={time => console.log(time)}`  | `{   activeColumn: number,    newStartTime: number,    newEndTime: number,    reserved: Array }` | Callback to choose any time (cell) in the timetable. |
| `onSaveTime` | Function | `onSaveTime={time => console.log(time)}` | `{   activeColumn: number,    newStartTime: number,    newEndTime: number,    reserved: Array }` | Callback to save time in the timetable.              |

## License

MIT © [SergeyDragunov](https://github.com/SergeyDragunov)
