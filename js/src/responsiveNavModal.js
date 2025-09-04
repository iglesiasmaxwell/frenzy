function openModalNav() {
	const modalNav = document.getElementById('modalNav');
	const modalBg = document.getElementById('modalBg');
	modalBg.style.visibility = 'visible';
	modalBg.style.opacity = 1;
	modalNav.style.right = 0;
}
function closeModalNav() {
	const modalNav = document.getElementById('modalNav');
	const modalBg = document.getElementById('modalBg');
	modalBg.style.visibility = 'hidden';
	modalBg.style.opacity = 0;
	modalNav.style.right = '-50rem';
}
function closeModalNavOther() {
	const modalNav = document.getElementById('modalNav');
	const modalBg = document.getElementById('modalBg');
	modalBg.style.visibility = 'hidden';
	modalBg.style.opacity = 0;
	modalNav.style.right = '-50rem';
}
