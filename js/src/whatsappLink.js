import { whatsappNumber } from './privateConfig.js';
const whatsappURL = `https://wa.me/${whatsappNumber}`;
document.getElementById('whatsappLink').href = whatsappURL;
