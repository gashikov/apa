// ========== admin.js (АДМИН ЛОГИКА) ==========
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();
tg.setHeaderColor('#0d1117');
tg.setBackgroundColor('#0d1117');

const BOT = 'infiserachtestijsRobot';
let currentFile = '';

function switchTab(name) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`.tab[onclick*="${name}"]`).classList.add('active');
    document.getElementById(`tab-${name}`).classList.add('active');
}

function loadFile(filename) {
    currentFile = filename;
    // Отправляем запрос боту
    tg.openTelegramLink(`https://t.me/${BOT}?start=admin_getfile_${filename}`);
    document.getElementById('fileContent').value = 'Загрузка... Запросите файл у бота.';
}

function saveFile() {
    if (!currentFile) return;
    const content = document.getElementById('fileContent').value;
    if (!content.trim()) return;
    const param = encodeURIComponent(`admin_savefile_${currentFile}_${btoa(content)}`);
    tg.openTelegramLink(`https://t.me/${BOT}?start=${param}`);
    alert('Файл отправлен на сохранение!');
}

function saveToken() {
    const key = document.getElementById('tokenSelect').value;
    const val = document.getElementById('tokenValue').value.trim();
    if (!val) return;
    const param = encodeURIComponent(`admin_token_${key}_${val}`);
    tg.openTelegramLink(`https://t.me/${BOT}?start=${param}`);
    alert('Токен отправлен на сохранение!');
}

function createSession() {
    const phone = document.getElementById('phoneNumber').value.trim();
    if (!phone) return;
    const param = encodeURIComponent(`admin_createsession_${phone}`);
    tg.openTelegramLink(`https://t.me/${BOT}?start=${param}`);
    alert('Запрос на создание сессии отправлен!');
}

function restartBot() {
    const param = encodeURIComponent('admin_restart');
    tg.openTelegramLink(`https://t.me/${BOT}?start=${param}`);
    alert('Запрос на перезапуск отправлен!');
}
