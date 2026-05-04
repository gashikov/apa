// ========== app.js (ОБЩАЯ ЛОГИКА) ==========
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();
tg.setHeaderColor('#0d1117');
tg.setBackgroundColor('#0d1117');

const BOT = 'infiserachtestijsRobot';
let currentType = 'auto';

// История
let history = JSON.parse(localStorage.getItem('swill_history') || '[]');

function saveToHistory(query) {
    history.unshift({ query, type: currentType, time: new Date().toLocaleTimeString() });
    history = history.slice(0, 20);
    localStorage.setItem('swill_history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('historyList');
    const card = document.getElementById('historyCard');
    if (!list || !card) return;
    if (history.length === 0) { card.style.display = 'none'; return; }
    card.style.display = 'block';
    list.innerHTML = history.map(h => `
        <div class="history-item" onclick="useHistory('${h.query.replace(/'/g, "\\'")}')">
            <span class="icon">${{phone:'📱',email:'📧',vk:'🔷',tg:'📨',auto:'🔍'}[h.type]||'🔍'}</span>
            <span class="query">${h.query.length > 25 ? h.query.slice(0,25)+'...' : h.query}</span>
            <span class="time">${h.time}</span>
        </div>
    `).join('');
}

function useHistory(query) {
    document.getElementById('queryInput').value = query;
    document.getElementById('queryInput').focus();
}

function clearHistory() {
    history = [];
    localStorage.removeItem('swill_history');
    renderHistory();
}

function showLoading() {
    const modal = document.getElementById('loadingModal');
    if (modal) modal.classList.add('show');
}

function hideLoading() {
    const modal = document.getElementById('loadingModal');
    if (modal) modal.classList.remove('show');
}

// Поиск
function doSearch() {
    const input = document.getElementById('queryInput');
    if (!input) return;
    const query = input.value.trim();
    if (!query) return;
    
    saveToHistory(query);
    showLoading();
    
    const param = encodeURIComponent(query);
    tg.openTelegramLink(`https://t.me/${BOT}?start=${param}`);
    
    setTimeout(() => {
        hideLoading();
        tg.close();
    }, 1500);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Тип поиска
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentType = btn.dataset.type;
            const input = document.getElementById('queryInput');
            if (input) input.focus();
        });
    });
    
    // Кнопка поиска
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) searchBtn.addEventListener('click', doSearch);
    
    // Enter
    const input = document.getElementById('queryInput');
    if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
    
    renderHistory();
    if (input) input.focus();
});
