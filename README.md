# react-scheduler-table

> 

[![NPM](https://img.shields.io/npm/v/react-scheduler.svg)](https://www.npmjs.com/package/react-scheduler) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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
	hourSplit: 0.25, // 1 hour / 0.25 = 15 min - each row
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

## Props

| Property | Type | Default | Example | Description |
|----------------------|--------------------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `settings` | object |  | {\     cellHeight: 40,\       startDay: "09:00",\        endDay: "16:00",\        is12hours: false,\        hourSplit: 0.25,\         columnCnt: 4\    } | Initial settings for timetable: `cellHeight` - height for cells (needed for proper render SavedTime); `startDay` - starting time for the table; `endDay` - ending time for the table; `is12hours` - 12 or 24 hours format; `hourSplit` - how hour should be divided (or row count for one hour). `0.5` for 30 min hour split (or 2 rows for one hour); `columnCnt` - how many columns in the timetable; |
| `className` | string |  | 'MyTable' | Class for main component table. |
| `classNameSavedTime` | string |  | 'MySavedTime' | Class for SavedTime component. |
| `reserved` | Array |  | [        {		     id: uniqueID,  	     start: 10,  	     end: 12,  	     column: 1  	   }   ]      | Default data. |
| `savedTimeContent` | React Component / String |  | `savedTime => <h5>My Saved Time: <br /> {`${savedTime.parsedStart} - ${savedTime.parsedEnd}`}</h5>` | Content inside SavedTime component. |

## Methods

| Method       | Type     | Example                                  | Param                                                                                            | Description                                          |
|--------------|----------|------------------------------------------|--------------------------------------------------------------------------------------------------|------------------------------------------------------|
| `onAddTime`  | function | `onAddTime={time => console.log(time)}`  | `{   activeColumn: number,    newStartTime: number,    newEndTime: number,    reserved: Array }` | Callback to choose any time (cell) in the timetable. |
| `onSaveTime` | function | `onSaveTime={time => console.log(time)}` | `{   activeColumn: number,    newStartTime: number,    newEndTime: number,    reserved: Array }` | Callback to save time in the timetable.              |

## License

MIT © [SergeyDragunov](https://github.com/SergeyDragunov)
