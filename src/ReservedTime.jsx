import React, { Component } from 'react';

import { timeToStringParser } from './utils';
import { ReactComponent as ClearIcon } from './clear.svg';
import  styles from'./ReservedTime.css';

const ReservedTime = ({ cellHeight, className, content, time, hourSplit, is12hours, removeReserved }) => {
	const blockHeight =
		cellHeight * (((time.end - time.start) * 1) / hourSplit) - 3 + "px";

	const style = {
		height: blockHeight
  };
  const timeParser = timeToStringParser(is12hours);

	return (
		<div className={`${className || ''} ` + styles.ReservedTime} style={style}>
			<button
				className={styles.ReservedTime__delete}
				onClick={() => removeReserved(time.id)}
			>
				<ClearIcon />
			</button>
			{content({...time, parsedStart: timeParser(time.start), parsedEnd: timeParser(time.end)})}
		</div>
	);
}

export default ReservedTime;