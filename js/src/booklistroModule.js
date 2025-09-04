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
	limitToLast,
	equalTo,
} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js';
import { firebaseConfig } from './privateConfig.js';
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = getDatabase(app);
const bookCountRef = ref(database, 'book');
const waitList = query(ref(database, 'book'));
// let reLoading = false;
let once = 0;
let newValue = [];
let oldValue = [];
let loop = 0;
onValue(bookCountRef, (snapshot) => {
	get(waitList)
		.then((snapshot) => {
			if (snapshot.exists()) {
				announcement = document.getElementById('announcement');
				announcement.textContent = '';
				announcement.classList.remove('noannouncement');
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
					oldValue = Object.keys(snapshot.val()).reverse();
					// console.log(Object.keys(snapshot.val()).reverse());
					// console.log(Object.values(snapshot.val()).reverse());
					const waitlists = document.getElementById('waitlists');
					let date = new Date();
					let j = 0;
					Object.keys(snapshot.val())
						.reverse()
						.forEach(() => {
							if (
								Object.values(snapshot.val()).reverse()[j].timestamps.dmy ===
								date.getDate() + ', ' + date.getMonth() + ', ' + date.getFullYear()
							) {
								let createDiv = document.createElement('div');
								createDiv.className = 'booklistsro-con';
								createDiv.id = `booklistsrocon-${j}`;
								const waitlist = waitlists.appendChild(createDiv);
								waitlist.innerHTML = `
														<div class='info-con'>
															<div>
																<p class='key' id='key-${j}' hidden></p>
																<p class='top' id='top-${j}'></p>
																<p class='bot' id='bot-${j}'></p>
															</div>
															<div class='info-con-right' style="display: grid; row-gap: 18px">
																<div style="display: flex; align-items: center; column-gap: 8px">
																	<p class='status-text-${j}' style="margin: 0"></p>
																	<i class='fa-solid fa-fw' id='status-${j}'></i>
																</div>
																<p class='name' id='name-${j}' style="margin: 0"></p>
															</div>
														</div>
													 `;
								waitlist.children[0].children[0].children[0].textContent = Object.keys(snapshot.val()).reverse()[j];
								waitlist.children[0].children[0].children[1].textContent = Object.values(snapshot.val()).reverse()[j].top;
								waitlist.children[0].children[0].children[2].textContent = Object.values(snapshot.val()).reverse()[j].bot;
								waitlist.children[0].children[1].children[1].textContent = Object.values(snapshot.val()).reverse()[j].name;
								if (Object.values(snapshot.val()).reverse()[j].status.waitlist === true) {
									waitlist.children[0].children[1].children[0].children[1].classList.add('fa-hourglass');
									waitlist.children[0].children[1].children[0].children[0].textContent = 'MENUNGGU';
								} else if (Object.values(snapshot.val()).reverse()[j].status.waitlist === false) {
									waitlist.children[0].children[1].children[0].children[1].classList.add('fa-check');
									waitlist.children[0].children[1].children[0].children[0].textContent = 'DITERIMA';
								}
							}
							j++;
						});
					if (waitlists.innerHTML === '') {
						announcement.textContent = 'Daftar pesan kosong';
						announcement.classList.add('noannouncement');
						notification.classList.remove('notification-on');
						notification.classList.remove('fa-solid');
						notification.classList.add('fa-regular');
						notification.onclick = function () {};
					}
					once = 1;
				} else {
					newValue = Object.keys(snapshot.val()).reverse();
					// announcement = document.getElementById('announcement');
					notification = document.getElementById('notification');
					// console.log(newValue === oldValue);
					// console.log(newValue + ' : ' + newValue.length);
					// console.log(oldValue + ' : ' + oldValue.length);
					if (newValue.length <= oldValue.length || (newValue === oldValue) === false) {
						// console.log('Daftar Berubah');
						// announcement.textContent = 'Daftar Berubah';
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
					// let j = oldValue.length + loop;
					// for (let i = j; i < newValue.length; i++) {
					// 	let createDiv = document.createElement('div');
					// 	createDiv.className = 'booklistsro-con';
					// 	createDiv.id = `booklistsrocon-${j}`;
					// 	const waitlist = waitlists.appendChild(createDiv);
					// 	waitlist.innerHTML = `
					// 								<div class='info-con'>
					// 									<div>
					// 										<p class='key' id='key-${j}' hidden></p>
					// 										<p class='top' id='top-${j}'></p>
					// 										<p class='bot' id='bot-${j}'></p>
					// 									</div>
					// 									<div class='info-con-right' style="display: grid; row-gap: 18px">
					// 										<div style="display: flex; align-items: center; column-gap: 8px">
					// 											<p class='status-text-${j}' style="margin: 0"></p>
					// 											<i class='fa-solid fa-fw' id='status-${j}'></i>
					// 										</div>
					// 										<p class='name' id='name-${j}' style="margin: 0"></p>
					// 									</div>
					// 								</div>
					// 							 `;
					// 	waitlist.children[0].children[0].children[0].textContent = Object.keys(snapshot.val()).reverse()[j];
					// 	waitlist.children[0].children[0].children[1].textContent = Object.values(snapshot.val()).reverse()[j].top;
					// 	waitlist.children[0].children[0].children[2].textContent = Object.values(snapshot.val()).reverse()[j].bot;
					// 	waitlist.children[0].children[1].children[1].textContent = Object.values(snapshot.val()).reverse()[j].name;
					// 	if (Object.values(snapshot.val()).reverse()[j].status.waitlist === true) {
					// 		waitlist.children[0].children[1].children[0].children[1].classList.add('fa-hourglass');
					// 		waitlist.children[0].children[1].children[0].children[0].textContent = 'MENUNGGU';
					// 	} else if (Object.values(snapshot.val()).reverse()[j].status.waitlist === false) {
					// 		waitlist.children[0].children[1].children[0].children[1].classList.add('fa-check');
					// 		waitlist.children[0].children[1].children[0].children[0].textContent = 'DITERIMA';
					// 	}
					// 	j++;
					// }
					// loop++;
				}
			} else {
				const waitlists = document.getElementById('booklistsrocon-0');
				if (waitlists) {
					// console.log('Daftar Berubah');
					// announcement.textContent = 'Daftar Berubah';
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
					// console.log('Daftar Tidak Ditemukan');
					// announcement.classList.remove('announcement');
					announcement.textContent = 'Daftar pesan kosong';
					announcement.classList.add('noannouncement');
					notification.classList.remove('notification-on');
					notification.classList.remove('fa-solid');
					notification.classList.add('fa-regular');
					notification.onclick = function () {};
				}
			}
		})
		.catch((error) => {
			console.error(error);
		});
});
function reloadWindow() {
	window.location.reload();
}
window.reloadWindow = reloadWindow;
