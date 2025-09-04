import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js';
// import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js';
import {
	getDatabase,
	ref,
	child,
	get,
	set,
	push,
	update,
	onValue,
	query,
	orderByChild,
	equalTo,
} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js';
import {
	getFirestore,
	addDoc,
	setDoc,
	doc,
	collection,
} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';
import { firebaseConfig } from './privateConfig.js';
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const db = getFirestore(app);
const bookCountRef = ref(database, 'book');
// onValue(bookCountRef, (snapshot) => {
// 	const queryBook = ref(database, 'book');
// 	get(queryBook)
// 		.then((snapshot) => {
// 			if (snapshot.exists()) {
// 				const book = Object.values(snapshot.val());
// 				const bookKey = Object.keys(snapshot.val());
// 			} else {
// 				console.log('no book found');
// 			}
// 		})
// 		.catch((error) => {
// 			console.error(error);
// 		});
// });
const calendarEventsRef = ref(database, 'calendarEvents');
// const eventsElement = document.getElementById('events');
const eventPromise = new Promise(function (resolve) {
	get(calendarEventsRef).then((snapshot) => {
		if (snapshot.exists()) {
			// eventsElement.setAttribute('event', JSON.stringify(Object.values(snapshot.val())));
			resolve(Object.values(snapshot.val()));
			// const eventKey = Object.keys(snapshot.val());
			// const eventValues = JSON.stringify(Object.values(snapshot.val()));
			// let eventArray = [];
			// let j = 0;
			// Object.keys(snapshot.val()).forEach(() => {
			// 	console.log(j);
			// 	console.log(eventValues[j]);
			// 	eventArray.push(eventValues[j]);
			// 	j++;
			// });
			// console.log(eventArray);
			// console.log(eventValues);
			// return eventArray;
			// return eventValues;
		} else {
			// console.log('firebase event not found');
		}
	});
});
// onValue(calendarEventsRef, (snapshot) => {
// 	if (snapshot.exists()) {
// 		// const eventKey = Object.keys(snapshot.val());
// 		const eventValues = Object.values(snapshot.val());
// 		let eventArray = [];
// 		let j = 0;
// 		Object.keys(snapshot.val()).forEach(() => {
// 			console.log(eventValues[j]);
// 			eventArray.push(eventValues[j]);
// 			console.log(j);
// 			j++;
// 			window.eventArray = eventArray;
// 		});
// 		console.log(eventArray);
// 		console.log(window.eventArray);
// 	} else {
// 		console.log('no firebase event found');
// 	}
// });
function setDatabase() {
	let date = new Date();
	const dateTime = document.getElementById('dateTime').innerHTML;
	let dotw;
	switch (dateTime.split(',')[0].trim()) {
		case 'Senin':
			dotw = 'Monday';
			break;
		case 'Selasa':
			dotw = 'Tuesday';
			break;
		case 'Rabu':
			dotw = 'Wednesday';
			break;
		case 'Kamis':
			dotw = 'Thursday';
			break;
		case 'Jumat':
			dotw = 'Friday';
			break;
		case 'Sabtu':
			dotw = 'Saturday';
			break;
		case 'Minggu':
			dotw = 'Sunday';
	}
	const datenum = dateTime.split(',')[1].split(' ')[1].trim();
	let month;
	switch (dateTime.split(',')[1].split(' ')[2].trim()) {
		case 'Januari':
			month = 'January';
			break;
		case 'Februari':
			month = 'February';
			break;
		case 'Maret':
			month = 'March';
			break;
		case 'April':
			month = 'April';
			break;
		case 'Mei':
			month = 'May';
			break;
		case 'Juni':
			month = 'June';
			break;
		case 'Juli':
			month = 'July';
			break;
		case 'Agustus':
			month = 'August';
			break;
		case 'September':
			month = 'September';
			break;
		case 'Oktober':
			month = 'October';
			break;
		case 'November':
			month = 'November';
			break;
		case 'Desember':
			month = 'December';
	}
	const year = dateTime.split(',')[1].split(' ')[3].trim();
	const playTime = document.getElementById('playTime').innerHTML;
	const startTime = playTime.split('-')[0].trim();
	const endTime = playTime.split('-')[1].trim();
	const nameValue = document
		.getElementById('name')
		.value.trim()
		.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
	let modal = document.getElementById('bookModal');
	let content = document.getElementById('modalContent');
	let error = document.getElementById('bookModalMulti');
	const newBookRef = push(bookCountRef);
	const bookPromise = new Promise(function (resolve) {
		if (nameValue == '') {
			document.getElementById('name').placeholder = 'Harap mengisi nama pemesan!';
		} else if (window.navigator.onLine) {
			set(newBookRef, {
				top: dateTime,
				bot: playTime,
				name: nameValue,
				dates: {
					date: dateTime,
					splitdate: {
						dotw: dotw,
						date: datenum,
						month: month,
						year: year,
						start: {
							dotw: dotw,
							date: datenum,
							month: month,
							year: year,
						},
						end: {
							dotw: dotw,
							date: datenum,
							month: month,
							year: year,
						},
					},
					time: playTime,
					splittime: {
						starttime: startTime,
						endtime: endTime,
					},
				},
				status: {
					waitlist: true,
					// member: {
					// 	condition: false,
					// 	time: 0,
					// },
				},
				timestamps: {
					hms: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
					day: date.getDay(),
					dmy: date.getDate() + ', ' + date.getMonth() + ', ' + date.getFullYear(),
					ms: Date.now(),
					offsetUTC: date.getTimezoneOffset(),
					iso: date.toISOString(),
				},
			}).then(function () {
				resolve(true);
			});
			// addDoc(collection(db, 'waitlist'), {
			// 	name: nameValue,
			// 	dates: {
			// 		date: {
			// 			dotw: dotw,
			// 			date: datenum,
			// 			month: month,
			// 			year: year,
			// 		},
			// 		time: playTime,
			// 	},
			// 	status: {
			// 		waitlist: true,
			// 		member: {
			// 			condition: false,
			// 			time: 0,
			// 		},
			// 	},
			// 	timestamps: {
			// 		hms: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
			// 		day: date.getDay(),
			// 		dmy: date.getDate() + ', ' + date.getMonth() + ', ' + date.getFullYear(),
			// 		ms: Date.now(),
			// 		offsetUTC: date.getTimezoneOffset(),
			// 	},
			// });
			modal.style.opacity = 0;
			modal.style.visibility = 'hidden';
			content.style.visibility = 'hidden';
			error.style.visibility = 'hidden';
			content.style.display = 'none';
			error.style.display = 'none';
			document.getElementById('name').value = '';
			document.getElementById('name').placeholder = 'Pesan atas nama?';
			// window.location.reload();
		}
	});
	let success = document.getElementById('successModal');
	bookPromise.then(function (value) {
		if (value === true) {
			modal.style.opacity = 1;
			modal.style.visibility = 'visible';
			success.style.visibility = 'visible';
			success.style.display = 'block';
			console.log('Book Success');
		}
	});
}
function setDatabaseMulti() {
	let date = new Date();
	const startFullDateTime =
		document.getElementById('dateTimeStart').innerHTML + ' ' + document.getElementById('playTimeStart').innerHTML;
	const endFullDateTime =
		document.getElementById('dateTimeEnd').innerHTML + ' ' + document.getElementById('playTimeEnd').innerHTML;
	const dateTime =
		document.getElementById('dateTimeStart').innerHTML + ' - ' + document.getElementById('dateTimeEnd').innerHTML;
	const startDateTime = document.getElementById('dateTimeStart').innerHTML;
	const endDateTime = document.getElementById('dateTimeEnd').innerHTML;
	let startDotw;
	let endDotw;
	switch (startDateTime.split(',')[0].trim()) {
		case 'Senin':
			startDotw = 'Monday';
			break;
		case 'Selasa':
			startDotw = 'Tuesday';
			break;
		case 'Rabu':
			startDotw = 'Wednesday';
			break;
		case 'Kamis':
			startDotw = 'Thursday';
			break;
		case 'Jumat':
			startDotw = 'Friday';
			break;
		case 'Sabtu':
			startDotw = 'Saturday';
			break;
		case 'Minggu':
			startDotw = 'Sunday';
	}
	switch (endDateTime.split(',')[0].trim()) {
		case 'Senin':
			endDotw = 'Monday';
			break;
		case 'Selasa':
			endDotw = 'Tuesday';
			break;
		case 'Rabu':
			endDotw = 'Wednesday';
			break;
		case 'Kamis':
			endDotw = 'Thursday';
			break;
		case 'Jumat':
			endDotw = 'Friday';
			break;
		case 'Sabtu':
			endDotw = 'Saturday';
			break;
		case 'Minggu':
			endDotw = 'Sunday';
	}
	const startDatenum = startDateTime.split(',')[1].split(' ')[1].trim();
	const endDatenum = endDateTime.split(',')[1].split(' ')[1].trim();
	let startMonth;
	let endMonth;
	switch (startDateTime.split(',')[1].split(' ')[2].trim()) {
		case 'Januari':
			startMonth = 'January';
			break;
		case 'Februari':
			startMonth = 'February';
			break;
		case 'Maret':
			startMonth = 'March';
			break;
		case 'April':
			startMonth = 'April';
			break;
		case 'Mei':
			startMonth = 'May';
			break;
		case 'Juni':
			startMonth = 'June';
			break;
		case 'Juli':
			startMonth = 'July';
			break;
		case 'Agustus':
			startMonth = 'August';
			break;
		case 'September':
			startMonth = 'September';
			break;
		case 'Oktober':
			startMonth = 'October';
			break;
		case 'November':
			startMonth = 'November';
			break;
		case 'Desember':
			startMonth = 'December';
	}
	switch (endDateTime.split(',')[1].split(' ')[2].trim()) {
		case 'Januari':
			endMonth = 'January';
			break;
		case 'Februari':
			endMonth = 'February';
			break;
		case 'Maret':
			endMonth = 'March';
			break;
		case 'April':
			endMonth = 'April';
			break;
		case 'Mei':
			endMonth = 'May';
			break;
		case 'Juni':
			endMonth = 'June';
			break;
		case 'Juli':
			endMonth = 'July';
			break;
		case 'Agustus':
			endMonth = 'August';
			break;
		case 'September':
			endMonth = 'September';
			break;
		case 'Oktober':
			endMonth = 'October';
			break;
		case 'November':
			endMonth = 'November';
			break;
		case 'Desember':
			endMonth = 'December';
	}
	const startYear = startDateTime.split(',')[1].split(' ')[3].trim();
	const endYear = endDateTime.split(',')[1].split(' ')[3].trim();
	const playTime =
		document.getElementById('playTimeStart').innerHTML + ' - ' + document.getElementById('playTimeEnd').innerHTML;
	const startTime = document.getElementById('playTimeStart').innerHTML;
	const endTime = document.getElementById('playTimeEnd').innerHTML;
	const nameValue = document
		.getElementById('nameTwo')
		.value.trim()
		.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
	let modal = document.getElementById('bookModal');
	let content = document.getElementById('modalContent');
	let error = document.getElementById('bookModalMulti');
	const newBookRef = push(bookCountRef);
	const bookPromise = new Promise(function (resolve) {
		if (nameValue == '') {
			document.getElementById('name').placeholder = 'Harap mengisi nama pemesan!';
		} else if (window.navigator.onLine) {
			set(newBookRef, {
				top: startFullDateTime,
				bot: endFullDateTime,
				name: nameValue,
				dates: {
					date: dateTime,
					splitdate: {
						start: {
							full: startDateTime,
							dotw: startDotw,
							date: startDatenum,
							month: startMonth,
							year: startYear,
						},
						end: {
							full: endDateTime,
							dotw: endDotw,
							date: endDatenum,
							month: endMonth,
							year: endYear,
						},
					},
					time: playTime,
					splittime: {
						starttime: startTime,
						endtime: endTime,
					},
				},
				status: {
					waitlist: true,
					// member: {
					// 	condition: false,
					// 	time: 0,
					// },
				},
				timestamps: {
					hms: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
					day: date.getDay(),
					dmy: date.getDate() + ', ' + date.getMonth() + ', ' + date.getFullYear(),
					ms: Date.now(),
					offsetUTC: date.getTimezoneOffset(),
					iso: date.toISOString(),
				},
			}).then(function () {
				resolve(true);
			});
			// addDoc(collection(db, 'waitlist'), {
			// 	name: nameValue,
			// 	dates: {
			// 		date: {
			// 			dotw: dotw,
			// 			date: datenum,
			// 			month: month,
			// 			year: year,
			// 		},
			// 		time: playTime,
			// 	},
			// 	status: {
			// 		waitlist: true,
			// 		member: {
			// 			condition: false,
			// 			time: 0,
			// 		},
			// 	},
			// 	timestamps: {
			// 		hms: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
			// 		day: date.getDay(),
			// 		dmy: date.getDate() + ', ' + date.getMonth() + ', ' + date.getFullYear(),
			// 		ms: Date.now(),
			// 		offsetUTC: date.getTimezoneOffset(),
			// 	},
			// });
			modal.style.opacity = 0;
			modal.style.visibility = 'hidden';
			content.style.visibility = 'hidden';
			error.style.visibility = 'hidden';
			content.style.display = 'none';
			error.style.display = 'none';
			document.getElementById('name').value = '';
			document.getElementById('name').placeholder = 'Pesan atas nama?';
			// window.location.reload();
		}
	});
	bookPromise.then(function (value) {
		if (value === true) {
			let modal = document.getElementById('bookModal');
			let success = document.getElementById('successModal');
			modal.style.opacity = 1;
			modal.style.visibility = 'visible';
			success.style.display = 'block';
			success.style.visibility = 'visible';
			console.log('Book Success');
		}
	});
}

import { googleCalendarConfig } from './privateConfig.js';

function fullcalendarConfig() {
	let calendarEl = document.getElementById('calendar');
	let calendar = new FullCalendar.Calendar(calendarEl, {
		locale: 'id', // locale language
		selectable: true,
		views: {
			// custom views
			timeGridFourDay: {
				type: 'timeGrid',
				duration: { days: 4 },
			},
		},
		windowResize: function () {
			if (window.innerWidth < 769) {
				calendar.changeView('timeGridDay');
				calendar.setOption('contentHeight', 1000);
			} else if (window.innerWidth < 982) {
				calendar.changeView('timeGridFourDay');
				calendar.setOption('contentHeight', 1000);
			} else if (window.innerWidth < 1240) {
				calendar.changeView('timeGridWeek');
				calendar.setOption('contentHeight', 1000);
			} else {
				calendar.changeView('timeGridWeek');
				calendar.setOption('contentHeight');
			}
		},
		selectLongPressDelay: 250,
		select: function (event) {
			let start = String(event.start);
			let end = String(event.end);

			let startArray = start.split(' ');
			let endArray = end.split(' ');

			// parse selected event Start day of the week
			let startDayOfTheWeek;
			switch (startArray[0]) {
				case 'Mon':
					startDayOfTheWeek = 'Senin';
					break;
				case 'Tue':
					startDayOfTheWeek = 'Selasa';
					break;
				case 'Wed':
					startDayOfTheWeek = 'Rabu';
					break;
				case 'Thu':
					startDayOfTheWeek = 'Kamis';
					break;
				case 'Fri':
					startDayOfTheWeek = 'Jumat';
					break;
				case 'Sat':
					startDayOfTheWeek = 'Sabtu';
					break;
				case 'Sun':
					startDayOfTheWeek = 'Minggu';
			}

			// parse selected event Start day
			let startDayDigit;
			let startDayLastDigit;
			// let suffix;

			if (startArray[2] < 10) {
				startDayDigit = startArray[2] % 10;
			} else {
				startDayDigit = startArray[2];
			}

			// if (startArray[2] >= 10 && startArray[2] <= 20) { // parse day digit to get the suffix
			// 	startDayLastDigit = startArray[2];
			// } else {
			// 	startDayLastDigit = startArray[2] % 10;
			// }

			// switch (startDayLastDigit) { // get suffix from number
			// 	case 1:
			// 		suffix = 'st';
			// 		break;
			// 	case 2:
			// 		suffix = 'nd';
			// 		break;
			// 	case 3:
			// 		suffix = 'rd';
			// 		break;
			// 	default:
			// 		suffix = 'th';
			// }
			// let startDay = startDayDigit + suffix;
			let startDay = startDayDigit;

			// parse selected event Start month
			let startMonth;
			switch (startArray[1]) {
				case 'Jan':
					startMonth = 'Januari';
					break;
				case 'Feb':
					startMonth = 'Februari';
					break;
				case 'Mar':
					startMonth = 'Maret';
					break;
				case 'Apr':
					startMonth = 'April';
					break;
				case 'May':
					startMonth = 'Mei';
					break;
				case 'Jun':
					startMonth = 'Juni';
					break;
				case 'Jul':
					startMonth = 'Juli';
					break;
				case 'Aug':
					startMonth = 'Agustus';
					break;
				case 'Sep':
					startMonth = 'September';
					break;
				case 'Oct':
					startMonth = 'Oktober';
					break;
				case 'Nov':
					startMonth = 'November';
					break;
				case 'Dec':
					startMonth = 'Desember';
			}

			// parse selected event Start year
			let startYear = startArray[3];

			// parse selected event Start time
			let startTime = startArray[4];
			let startHour = startTime.split(':')[0];
			let startMinute = startTime.split(':')[1];

			// parse selected event End day of the week
			let endDayOfTheWeek;
			switch (endArray[0]) {
				case 'Mon':
					endDayOfTheWeek = 'Senin';
					break;
				case 'Tue':
					endDayOfTheWeek = 'Selasa';
					break;
				case 'Wed':
					endDayOfTheWeek = 'Rabu';
					break;
				case 'Thu':
					endDayOfTheWeek = 'Kamis';
					break;
				case 'Fri':
					endDayOfTheWeek = 'Jumat';
					break;
				case 'Sat':
					endDayOfTheWeek = 'Sabtu';
					break;
				case 'Sun':
					endDayOfTheWeek = 'Minggu';
			}

			// parse selected event End day
			let endDayDigit;
			let endDayLastDigit;
			// let suffix;

			if (endArray[2] < 10) {
				endDayDigit = endArray[2] % 10;
			} else {
				endDayDigit = endArray[2];
			}

			// if (endArray[2] >= 10 && endArray[2] <= 20) { // parse day digit to get the suffix
			// 	endDayLastDigit = endArray[2];
			// } else {
			// 	endDayLastDigit = endArray[2] % 10;
			// }

			// switch (endDayLastDigit) { // get suffix from number
			// 	case 1:
			// 		suffix = 'st';
			// 		break;
			// 	case 2:
			// 		suffix = 'nd';
			// 		break;
			// 	case 3:
			// 		suffix = 'rd';
			// 		break;
			// 	default:
			// 		suffix = 'th';
			// }
			// let endDay = endDayDigit + suffix;
			let endDay = endDayDigit;

			// parse selected event End month
			let endMonth;
			switch (endArray[1]) {
				case 'Jan':
					endMonth = 'Januari';
					break;
				case 'Feb':
					endMonth = 'Februari';
					break;
				case 'Mar':
					endMonth = 'Maret';
					break;
				case 'Apr':
					endMonth = 'April';
					break;
				case 'May':
					endMonth = 'Mei';
					break;
				case 'Jun':
					endMonth = 'Juni';
					break;
				case 'Jul':
					endMonth = 'Juli';
					break;
				case 'Aug':
					endMonth = 'Agustus';
					break;
				case 'Sep':
					endMonth = 'September';
					break;
				case 'Oct':
					endMonth = 'Oktober';
					break;
				case 'Nov':
					endMonth = 'November';
					break;
				case 'Dec':
					endMonth = 'Desember';
			}

			// parse selected event End year
			let endYear = endArray[3];

			// parse selected event End time
			let endTime = endArray[4];
			let endHour = endTime.split(':')[0];
			let endMinute = endTime.split(':')[1];

			// initialize price variable
			let priceToPay = 0;

			if (event.allDay === false) {
				// do not calculate allday event
				// calculate hours difference for times selected
				let diffSeconds = (event.end.getTime() - event.start.getTime()) / 1000;
				let diffMinutes = Math.abs(Math.round(diffSeconds / 60));
				let diffHour = diffMinutes / 60;

				for (
					let i = Number(startHour) - 8 + Number(startMinute) / 60;
					i < Number(endHour) - 8 + Number(endMinute) / 60;
					i += 0.5
				) {
					if (i >= 10) {
						priceToPay += 70000;
					} else {
						priceToPay += 45000;
					}
				}

				// calculate price
				let pricePerHour = 90000;
				let pricePerHourLamps = 50000;
				// if (Number(endDay) > Number(startDay)) {
				// 	openHour = diffHour - 10;
				// 	// let priceWithLamps = nightHour * pricePerHourLamps;
				// 	let priceTotal = openHour * pricePerHour;
				// 	priceToPay = priceTotal;
				// }
				if (Number(startHour) >= 18 && Number(endHour) <= 23) {
					// with lamps
					let priceTotal = diffHour * (pricePerHour + pricePerHourLamps);
					priceToPay = priceTotal;
				} else if (Number(startHour) >= 9 && Number(endHour) < 18) {
					// without lamps
					let priceTotal = diffHour * pricePerHour;
					priceToPay = priceTotal;
				} else if (Number(startHour) == 17 && Number(startMinute) == 30 && Number(endHour) == 18) {
					let priceTotal = diffHour * pricePerHour;
					priceToPay = priceTotal;
				} else if (Number(startHour) <= 18 && Number(endHour) >= 18) {
					let minNightHour = Number(startHour) - 18;
					let nightHour = diffHour + minNightHour;
					let priceWithLamps = nightHour * pricePerHourLamps;
					let priceTotal = diffHour * pricePerHour + priceWithLamps;
					priceToPay = priceTotal;
				}

				let currency = 'Rp';
				let localeCurrency = 'id';
				document.getElementById('priceToPay').innerHTML = currency + ' ' + priceToPay.toLocaleString(localeCurrency);
				let dateTime;

				// dateTime format template
				let startDateTimeFullFormat = startDayOfTheWeek + ', ' + startDay + ' ' + startMonth + ' ' + startYear;
				// let startDateTimeSameMonthFormat = startDayOfTheWeek + ', ' + startDay;
				// let startDateTimeSameYearFormat = startDayOfTheWeek + ', ' + startDay + ' ' + startMonth;

				let endDateTimeFullFormat = endDayOfTheWeek + ', ' + endDay + ' ' + endMonth + ' ' + endYear;
				// let endDateTimeSameMonthFormat = endDayOfTheWeek + ', ' + endDay;
				// let endDateTimeSameYearFormat = endDayOfTheWeek + ', ' + endDay + ' ' + endMonth;

				dateTime = startDateTimeFullFormat;

				document.getElementById('dateTime').innerHTML = dateTime;
				let playTime = startHour + ':' + startMinute + ' - ' + endHour + ':' + endMinute;
				document.getElementById('playTime').innerHTML = playTime;

				document.getElementById('dateTimeStart').innerHTML = startDateTimeFullFormat;
				document.getElementById('dateTimeEnd').innerHTML = endDateTimeFullFormat;

				document.getElementById('playTimeStart').innerHTML = startHour + ':' + startMinute;
				document.getElementById('playTimeEnd').innerHTML = endHour + ':' + endMinute;

				let modal = document.getElementById('bookModal');
				let content = document.getElementById('modalContent');
				let error = document.getElementById('bookModalMulti');
				let success = document.getElementById('successModal');
				let close = document.getElementById('closeModal');
				let closetwo = document.getElementById('closeModalMulti');
				let closesuccess = document.getElementById('closeModalSuccess');
				if (Number(startDay) !== Number(endDay)) {
					modal.style.opacity = 1;
					modal.style.visibility = 'visible';
					content.style.display = 'none';
					error.style.display = 'block';
					error.style.visibility = 'visible';
					success.style.display = 'none';
				} else {
					modal.style.opacity = 1;
					modal.style.visibility = 'visible';
					error.style.display = 'none';
					content.style.display = 'block';
					content.style.visibility = 'visible';
					success.style.display = 'none';
				}
				close.onclick = function () {
					modal.style.opacity = 0;
					modal.style.visibility = 'hidden';
					content.style.visibility = 'hidden';
					content.style.display = 'none';
					error.style.visibility = 'hidden';
					document.getElementById('name').value = '';
					document.getElementById('name').placeholder = 'Pesan atas nama?';
				};
				closetwo.onclick = function () {
					modal.style.opacity = 0;
					modal.style.visibility = 'hidden';
					content.style.visibility = 'hidden';
					error.style.visibility = 'hidden';
					error.style.display = 'none';
					document.getElementById('nameTwo').value = '';
					document.getElementById('nameTwo').placeholder = 'Pesan atas nama?';
				};
				closesuccess.onclick = function () {
					modal.style.opacity = 0;
					modal.style.visibility = 'hidden';
					success.style.visibility = 'hidden';
				};
				window.onclick = function (event) {
					if (event.target == modal) {
						modal.style.opacity = 0;
						modal.style.visibility = 'hidden';
						content.style.visibility = 'hidden';
						error.style.visibility = 'hidden';
						success.style.visibility = 'hidden';
						document.getElementById('name').value = '';
						document.getElementById('name').placeholder = 'Pesan atas nama?';
						document.getElementById('nameTwo').value = '';
						document.getElementById('nameTwo').placeholder = 'Pesan atas nama?';
					}
				};
			}
		},
		googleCalendarApiKey: googleCalendarConfig.apiKey,
		eventSources: [
			eventPromise.then(function (value) {
				calendar.addEventSource({
					events: value,
					backgroundColor: 'blue',
				});
				// console.log(value);
				// calendar.addEventSource(JSON.parse(document.getElementById('events').getAttribute('event')));
				// console.log(JSON.parse(document.getElementById('events').getAttribute('event')));
			}),
			// setTimeout(() => {
			// 	calendar.addEventSource(JSON.parse(document.getElementById('events').getAttribute('event')));
			// }, 5000),
			{
				// regular
				googleCalendarId: googleCalendarConfig.googleCalendarId.regular,
				backgroundColor: 'red',
			},
			{
				// member
				googleCalendarId: googleCalendarConfig.googleCalendarId.member,
				backgroundColor: 'yellow',
			},
			{
				// announcement
				googleCalendarId: googleCalendarConfig.googleCalendarId.announcement,
				backgroundColor: 'purple',
			},
			{
				// holiday in indonesia
				googleCalendarId: googleCalendarConfig.googleCalendarId.holidays,
				backgroundColor: 'orange',
			},
		],
		validRange: function () {
			let startDate = new Date();
			let endDate = new Date();

			// adjust start & end dates, respectively
			startDate.setDate(startDate.getDate());
			endDate.setDate(endDate.getDate() + 29);

			return { start: startDate, end: endDate };
		},
		allDayText: '',
		titleFormat: {
			month: 'long',
			year: 'numeric',
		},
		dayHeaderFormat: {
			weekday: 'long',
			day: 'numeric',
		},
		slotLabelFormat: {
			hour: 'numeric',
			minute: 'numeric',
			hour12: false,
			omitZeroMinute: false,
		},
		slotMinTime: { hours: 9 }, // open time
		slotMaxTime: { hours: 23 }, // closed time plus 1
		initialView: responsiveView(),
		headerToolbar: {
			left: 'today',
			center: 'title',
			right: 'prev next',
		},
		buttonText: {
			today: '',
		},
		stickyHeaderDates: true,
		expandRows: true,
		slotDuration: '01:00:00',
		nowIndicator: true,
		// slotLabelInterval: {minutes:30},
		firstDay: 1, // 0:sunday, 1:monday
		// lazyFetching: false,
	});
	calendar.render();
}
function responsiveView() {
	let initialView;
	if (window.innerWidth < 769) {
		let changedView = 'timeGridDay';
		initialView = changedView;
	} else if (window.innerWidth < 982) {
		let changedView = 'timeGridFourDay';
		initialView = changedView;
	} else {
		let changedView = 'timeGridWeek';
		initialView = changedView;
	}
	return initialView;
}

import { whatsappNumber } from './privateConfig.js';

function redirectWhatsapp() {
	let dateTime = document.getElementById('dateTime').innerHTML;
	let playTime = document.getElementById('playTime').innerHTML;
	let nameValue = document
		.getElementById('name')
		.value.trim()
		.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

	let till = 'sampai';
	let date = 'tanggal';
	let href;

	let phoneNumber = whatsappNumber;

	setDatabase();
	if (nameValue == '') {
		href = '#';
		document.getElementById('name').placeholder = 'Harap mengisi nama pemesan!';
	} else {
		href =
			'https://wa.me/' +
			phoneNumber +
			'?text=Booking untuk:%0a' +
			'Tanggal%09: ' +
			dateTime +
			'%0a' +
			'Jam%09: ' +
			playTime +
			'%0a' +
			'Nama%09: ' +
			nameValue;
	}
	window.location.href = href;
}
function redirectWhatsappOnly() {
	setDatabaseMulti();
	let dateTimeStart = document.getElementById('dateTimeStart').innerHTML;
	let dateTimeEnd = document.getElementById('dateTimeEnd').innerHTML;
	let playTimeStart = document.getElementById('playTimeStart').innerHTML;
	let playTimeEnd = document.getElementById('playTimeEnd').innerHTML;
	let nameValueTwo = document
		.getElementById('nameTwo')
		.value.trim()
		.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

	let till = 'sampai';
	let date = 'tanggal';
	let href;

	let phoneNumber = whatsappNumber;

	if (nameValueTwo == '') {
		href = '#';
		document.getElementById('nameTwo').placeholder = 'Harap mengisi nama pemesan!';
	} else {
		href =
			'https://wa.me/' +
			phoneNumber +
			'?text=Booking untuk:%0a' +
			'Mulai%09: ' +
			dateTimeStart +
			' ' +
			playTimeStart +
			'%0a' +
			'Selesai%09: ' +
			dateTimeEnd +
			' ' +
			playTimeEnd +
			'%0a' +
			'Nama%09: ' +
			nameValueTwo;
	}
	window.location.href = href;
}
window.fullcalendarConfig = fullcalendarConfig;
window.setDatabase = setDatabase;
window.setDatabaseMulti = setDatabaseMulti;
window.responsiveView = responsiveView;
window.redirectWhatsapp = redirectWhatsapp;
window.redirectWhatsappOnly = redirectWhatsappOnly;
