export const timeToStringParser = is12hours => time => {
	const timeStr = time.toString();
	let m = "00";
	if (timeStr.includes(".")) {
		const hourPart = "0" + timeStr.slice(timeStr.indexOf("."));
		m = 60 * hourPart;
	}
	let h = parseInt(time) < 10 ? "0" + parseInt(time) : parseInt(time);
	let parsedTime = `${h}:${m}`;

	return is12hours ? tConv12(parsedTime) : parsedTime;
};

export const timeToIntParser = is12hours => time => {
	time = is12hours ? tConv24(time) : time;
	const timeArr = time.split(':');
	const h = parseInt(timeArr[0]);
	const m = parseInt(timeArr[1]) / 60;

	return h + m;
}

const tConv12 = time24 => {
  var ts = time24;
  var H = +ts.substr(0, 2);
  var h = (H % 12) || 12;
  h = (h < 10)?("0"+h):h;  // leading 0 at the left for 1 digit hours
  var ampm = H < 12 ? " AM" : " PM";
  ts = h + ts.substr(2, 3) + ampm;
  return ts;
};

const tConv24 = time12h => {
  const [time, modifier] = time12h.split(' ');

  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
}

// console.log(tConv24("08:00 PM"));

export const ID = function() {
	return (
		"_" +
		Math.random()
			.toString(36)
			.substr(2, 9)
	);
};