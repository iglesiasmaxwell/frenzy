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
	remove,
	onValue,
	query,
	orderByChild,
	equalTo,
} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js';
import { firebaseConfig } from './privateConfig.js';
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = getDatabase(app);
const bookCountRef = ref(database, 'book');
const waitList = query(ref(database, 'book'), orderByChild('status/waitlist'), equalTo(false));
let reLoading = false;
let once = 0;
let newValue = [];
let oldValue = [];
let loop = 0;
onValue(bookCountRef, (snapshot) => {
	get(waitList)
		.then((snapshot) => {
			if (snapshot.exists()) {
				announcement.textContent = '';
				announcement.classList.remove('noannouncement');
				// if (reLoading === true) {
				// 	announcement = document.getElementById('announcement');
				// 	if (Object.keys(snapshot.val()).length < oldValue.length || announcement.textContent != null) {
				// 		reloadWindow();
				// 	}
				// }
				// snapshot.forEach((child) => {
				// 	let resultKey = [];
				// 	let resultValue = [];
				// 	let resultArray = [];
				// 	resultValue.push(child.val());
				// 	for (let i = 0; i < resultKey.length; i++) {
				// 		resultArray[i] = [];
				// 		resultArray[i][0] = resultKey[i];
				// 		resultArray[i][1] = resultValue[i];
				// 	}
				// });
				if (once === 0) {
					oldValue = Object.keys(snapshot.val());
					console.log(Object.keys(snapshot.val()));
					console.log(Object.values(snapshot.val()));
					const waitlists = document.getElementById('waitlists');
					let j = 0;
					Object.keys(snapshot.val()).forEach(() => {
						let createDiv = document.createElement('div');
						createDiv.className = 'booklists-con';
						createDiv.id = `booklistscon-${j}`;
						const waitlist = waitlists.appendChild(createDiv);
						waitlist.innerHTML = `
													<div class='info-con'>
														<div>
															<p class='key' id='key-${j}' hidden></p>
															<p class='top' id='top-${j}'></p>
															<p class='bot' id='bot-${j}'></p>
														</div>
														<div class='info-con-right'>
															<p class='name' id='name-${j}'></p>
														</div>
													</div>
													<div class='button-con'>
														<a class='delete' id='delete-${j}' onclick="deleteDatabase(${j})">CANCEL</a>
													</div>
												 `;
						waitlist.children[0].children[0].children[0].textContent = Object.keys(snapshot.val())[j];
						waitlist.children[0].children[0].children[1].textContent = Object.values(snapshot.val())[j].top;
						waitlist.children[0].children[0].children[2].textContent = Object.values(snapshot.val())[j].bot;
						waitlist.children[0].children[1].children[0].textContent = Object.values(snapshot.val())[j].name;
						j++;
					});
					once = 1;
				} else {
					newValue = Object.keys(snapshot.val());
					// announcement = document.getElementById('announcement');
					notification = document.getElementById('notification');
					console.log(newValue === oldValue);
					console.log(newValue + ' : ' + newValue.length);
					console.log(oldValue + ' : ' + oldValue.length);
					if (newValue.length <= oldValue.length || (newValue === oldValue) === false) {
						console.log('data changed');
						// announcement.textContent = 'Data Updated';
						// announcement.classList.add('announcement');
						// announcement.onclick = function () {
						// 	reloadWindow();
						// };
						notification.classList.add('notification-on');
						notification.classList.remove('fa-regular');
						notification.classList.add('fa-solid');
						notification.onclick = function () {
							reloadWindow();
						};
					} else {
						// console.log('data unchanged');
						// announcement.textContent = '';
						// announcement.classList.remove('announcement');
					}
					let j = oldValue.length + loop;
					for (let i = j; i < newValue.length; i++) {
						let createDiv = document.createElement('div');
						createDiv.className = 'booklists-con';
						createDiv.id = `booklistscon-${j}`;
						const waitlist = waitlists.appendChild(createDiv);
						waitlist.innerHTML = `
													<div class='info-con'>
														<div>
															<p class='key' id='key-${j}' hidden></p>
															<p class='top' id='top-${j}'></p>
															<p class='bot' id='bot-${j}'></p>
														</div>
														<div class='info-con-right'>
															<p class='name' id='name-${j}'></p>
														</div>
													</div>
													<div class='button-con'>
														<a class='delete' id='delete-${j}' onclick="deleteDatabase(${j})">CANCEL</a>
													</div>
												 `;
						waitlist.children[0].children[0].children[0].textContent = Object.keys(snapshot.val())[j];
						waitlist.children[0].children[0].children[1].textContent = Object.values(snapshot.val())[j].top;
						waitlist.children[0].children[0].children[2].textContent = Object.values(snapshot.val())[j].bot;
						waitlist.children[0].children[1].children[0].textContent = Object.values(snapshot.val())[j].name;
						j++;
					}
					loop++;
				}
			} else {
				console.log('no booklist found');
				// announcement.classList.remove('announcement');
				announcement.textContent = 'No Booklist Found';
				announcement.classList.add('noannouncement');
				notification.classList.remove('notification-on');
				notification.classList.remove('fa-solid');
				notification.classList.add('fa-regular');
				notification.onclick = function () {};
			}
		})
		.catch((error) => {
			console.error(error);
		});
});
function updateDatabase(index) {
	if (window.navigator.onLine) {
		const key = document.getElementById('key-' + index).innerHTML;
		if (key !== null) {
			const bookUpdate = ref(database, 'book/' + key + '/status');
			update(bookUpdate, {
				waitlist: false,
			});
			const waitlistcon = document.getElementById('booklistscon-' + index);
			waitlistcon.setAttribute('hidden', true);
			if (reLoading === true) {
				reloadWindow();
			}
			console.log('accepted ' + index);
		}
	}
}
function deleteDatabase(index) {
	if (window.navigator.onLine) {
		const key = document.getElementById('key-' + index).innerHTML;
		if (key !== null) {
			const bookDelete = ref(database, 'book/' + key);
			remove(bookDelete);
			const waitlistcon = document.getElementById('booklistscon-' + index);
			const calendarEvents = ref(database, 'calendarEvents/' + key);
			waitlistcon.setAttribute('hidden', true);
			console.log('canceled ' + index);
			remove(calendarEvents);
			if (reLoading === true) {
				reloadWindow();
			}
		}
	}
}
function reloadWindow() {
	window.location.reload();
}
function changeReloading() {
	const rotateIcon = document.querySelector('.fa-solid.fa-rotate.fa-fade.fa-fw');
	if (reLoading === true) {
		reLoading = false;
		console.log('Reloading false');
		rotateIcon.classList.remove('spin');
	} else if (reLoading === false) {
		reLoading = true;
		console.log('Reloading true');
		rotateIcon.classList.add('spin');
	}
}
window.updateDatabase = updateDatabase;
window.deleteDatabase = deleteDatabase;
window.reloadWindow = reloadWindow;
window.changeReloading = changeReloading;
