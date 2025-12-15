// Тексты для кейса №1 (исправленные с пробелами)
const storyParts = [
    `Взираю на сие пепелище...\n\n18 августа 1816 года огонь поглотил\n39 корпусов ярмарки. Но знай —\nторги к тому моменту уже завершились.`,
    
    `Странно, не правда ли?\n\nТорги кончались к Первому Спасу —\n1 августа. А пожар случился\nспустя более двух недель...`,
    
    `Присмотрись к берегу...\n\nТечение Волги постоянно подмывало его.\nМеста для растущей ярмарки\nстановилось всё меньше.`,
    
    `Следствие назвало причиной\n«поджёг злоумышленных людей».\nНо признаний не было,\nи улик не нашли...`
];

const conclusionText = `Так что же на самом деле?..\n\nПожар стал лишь поводом.\nЯрмарка переросла Макарьев.\nНижний Новгород же —\nудобнее, просторнее, перспективнее.`;

// Элементы DOM
let startBtn, storyWindow, storyText, nextBtn, conclusionWindow, conclusionTextElement, continueBtn;
let backBtn, restartBtn, playerChoices;

// Текущая часть рассказа
let currentPart = 0;
let isTyping = false;
let typingSpeed = 30;
let typeTimeout = null;

// История диалогов
let dialogHistory = [];

// Инициализация
function initGame() {
    console.log('Игра "Исчезновение Макарьевской ярмарки" загружена!');
    
    // Находим элементы DOM
    startBtn = document.getElementById('startBtn');
    storyWindow = document.getElementById('storyWindow');
    storyText = document.getElementById('storyText');
    nextBtn = document.getElementById('nextBtn');
    conclusionWindow = document.getElementById('conclusionWindow');
    conclusionTextElement = document.getElementById('conclusionText');
    continueBtn = document.getElementById('continueBtn');
    
    // Создаём кнопки игрока
    createPlayerButtons();
    
    // Начать рассказ
    startBtn.addEventListener('click', startStory);
    
    // Кнопка "Далее"
    nextBtn.style.display = 'none';
    nextBtn.addEventListener('click', showNextPart);
    
    // Кнопка финального перехода
    continueBtn.addEventListener('click', function() {
        showMenuButton();
    });
    
    // Пропуск печати по клику
    storyText.addEventListener('click', skipTyping);
    conclusionTextElement.addEventListener('click', skipTyping);
    
    console.log('Игра инициализирована!');
}

// Создаём кнопки действий игрока
function createPlayerButtons() {
    // Контейнер для кнопок игрока
    const playerButtons = document.createElement('div');
    playerButtons.className = 'player-buttons';
    playerButtons.style.cssText = `
        position: absolute;
        bottom: 50px;
        left: 50px;
        display: flex;
        gap: 15px;
        z-index: 10;
        display: none;
    `;
    
    // Кнопка "Расскажи дальше"
    const tellMoreBtn = document.createElement('button');
    tellMoreBtn.id = 'tellMoreBtn';
    tellMoreBtn.className = 'player-btn';
    tellMoreBtn.innerHTML = '🗣️ Расскажи дальше';
    tellMoreBtn.addEventListener('click', showNextPart);
    
    // Кнопка "Вернуться назад"
    const backBtn = document.createElement('button');
    backBtn.id = 'backBtn';
    backBtn.className = 'player-btn';
    backBtn.innerHTML = '↩️ Вернуться назад';
    backBtn.addEventListener('click', goBack);
    
    // Кнопка "Повторить"
    const restartBtn = document.createElement('button');
    restartBtn.id = 'restartBtn';
    restartBtn.className = 'player-btn';
    restartBtn.innerHTML = '🔄 Начать заново';
    restartBtn.addEventListener('click', restartStory);
    
    // Кнопка "Что было раньше?"
    const historyBtn = document.createElement('button');
    historyBtn.id = 'historyBtn';
    historyBtn.className = 'player-btn';
    historyBtn.innerHTML = '📜 Что было раньше?';
    historyBtn.addEventListener('click', showHistory);
    
    playerButtons.appendChild(tellMoreBtn);
    playerButtons.appendChild(backBtn);
    playerButtons.appendChild(historyBtn);
    playerButtons.appendChild(restartBtn);
    
    document.querySelector('.game-container').appendChild(playerButtons);
    
    // Сохраняем ссылки
    playerChoices = {
        tellMoreBtn: tellMoreBtn,
        backBtn: backBtn,
        restartBtn: restartBtn,
        historyBtn: historyBtn,
        container: playerButtons
    };
}

// Показать кнопки игрока
function showPlayerButtons() {
    if (playerChoices && playerChoices.container) {
        playerChoices.container.style.display = 'flex';
        
        // Настраиваем видимость кнопок в зависимости от контекста
        playerChoices.backBtn.style.display = currentPart > 0 ? 'block' : 'none';
        playerChoices.tellMoreBtn.style.display = !isTyping && currentPart < storyParts.length ? 'block' : 'none';
        playerChoices.historyBtn.style.display = dialogHistory.length > 0 ? 'block' : 'none';
    }
}

// Скрыть кнопки игрока
function hidePlayerButtons() {
    if (playerChoices && playerChoices.container) {
        playerChoices.container.style.display = 'none';
    }
}

// Начать рассказ
function startStory() {
    console.log('Начало рассказа!');
    
    startBtn.style.display = 'none';
    storyWindow.style.display = 'flex';
    currentPart = 0;
    nextBtn.style.display = 'none';
    
    // Очищаем историю
    dialogHistory = [];
    
    // Добавляем первую реплику в историю
    dialogHistory.push({
        speaker: 'Князь',
        text: storyParts[currentPart],
        part: currentPart
    });
    
    typeWriter(storyParts[currentPart], storyText);
    showPlayerButtons();
}

// Эффект печатающейся машинки (без звука)
function typeWriter(text, element) {
    if (isTyping || !element) return;
    
    isTyping = true;
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            if (text.charAt(i) === '\n') {
                element.innerHTML += '<br>';
            } else {
                element.textContent += text.charAt(i);
            }
            i++;
            
            typeTimeout = setTimeout(type, typingSpeed);
        } else {
            isTyping = false;
            
            // Показываем кнопки после завершения печати
            if (nextBtn) {
                nextBtn.style.display = 'block';
                if (currentPart === storyParts.length - 1) {
                    nextBtn.textContent = 'К выводу →';
                } else {
                    nextBtn.textContent = 'Далее →';
                }
            }
            
            showPlayerButtons();
        }
    }
    
    type();
}

// Пропустить печать
function skipTyping() {
    if (isTyping && typeTimeout) {
        clearTimeout(typeTimeout);
        isTyping = false;
        
        if (currentPart < storyParts.length && storyText) {
            storyText.textContent = storyParts[currentPart];
        } else if (conclusionTextElement) {
            conclusionTextElement.textContent = conclusionText;
        }
        
        if (nextBtn && storyWindow.style.display === 'flex') {
            nextBtn.style.display = 'block';
            if (currentPart === storyParts.length - 1) {
                nextBtn.textContent = 'К выводу →';
            }
        }
        
        if (continueBtn && conclusionWindow.style.display === 'flex') {
            continueBtn.style.display = 'block';
        }
        
        showPlayerButtons();
    }
}

// Показать следующую часть
function showNextPart() {
    if (isTyping) return;
    
    // Скрываем кнопку "Далее" на время перехода
    nextBtn.style.display = 'none';
    
    currentPart++;
    console.log('Переход к части:', currentPart);
    
    if (currentPart < storyParts.length) {
        // Добавляем реплику в историю
        dialogHistory.push({
            speaker: 'Князь',
            text: storyParts[currentPart],
            part: currentPart
        });
        
        typeWriter(storyParts[currentPart], storyText);
    } else {
        storyWindow.style.display = 'none';
        if (conclusionWindow) {
            conclusionWindow.style.display = 'flex';
            continueBtn.style.display = 'none';
            
            // Добавляем вывод в историю
            dialogHistory.push({
                speaker: 'Князь',
                text: conclusionText,
                part: 'conclusion'
            });
            
            typeWriter(conclusionText, conclusionTextElement);
            
            const checkButton = setInterval(() => {
                if (!isTyping && continueBtn) {
                    continueBtn.style.display = 'block';
                    clearInterval(checkButton);
                }
            }, 100);
        }
    }
    
    // Обновляем кнопки игрока
    showPlayerButtons();
}

// Вернуться назад
function goBack() {
    if (currentPart > 0) {
        currentPart--;
        
        if (storyWindow.style.display === 'flex') {
            storyText.textContent = storyParts[currentPart];
            nextBtn.style.display = 'block';
            
            if (currentPart === storyParts.length - 1) {
                nextBtn.textContent = 'К выводу →';
            } else {
                nextBtn.textContent = 'Далее →';
            }
        }
        
        // Удаляем последнюю реплику из истории
        if (dialogHistory.length > 0) {
            dialogHistory.pop();
        }
        
        showPlayerButtons();
    }
}

// Начать заново
function restartStory() {
    if (confirm('Начать историю заново?')) {
        currentPart = 0;
        dialogHistory = [];
        
        if (conclusionWindow.style.display === 'flex') {
            conclusionWindow.style.display = 'none';
        }
        
        storyWindow.style.display = 'flex';
        storyText.textContent = '';
        nextBtn.style.display = 'none';
        
        // Добавляем первую реплику в историю
        dialogHistory.push({
            speaker: 'Князь',
            text: storyParts[currentPart],
            part: currentPart
        });
        
        typeWriter(storyParts[currentPart], storyText);
        showPlayerButtons();
    }
}

// Показать историю диалогов
function showHistory() {
    if (dialogHistory.length === 0) {
        alert('История диалогов пока пуста.');
        return;
    }
    
    let historyText = '📜 ИСТОРИЯ ДИАЛОГОВ:\n\n';
    
    dialogHistory.forEach((entry, index) => {
        historyText += `${index + 1}. ${entry.speaker}:\n`;
        historyText += `"${entry.text.substring(0, 100)}${entry.text.length > 100 ? '...' : ''}"\n\n`;
    });
    
    alert(historyText);
}

// Показать кнопку меню после завершения
function showMenuButton() {
    const menuBtn = document.createElement('button');
    menuBtn.id = 'menuBtn';
    menuBtn.className = 'menu-btn';
    menuBtn.innerHTML = '🏠 В главное меню';
    menuBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        background: #2d5a1c;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-family: 'Press Start 2P', cursive;
        font-size: 12px;
        z-index: 100;
    `;
    
    menuBtn.addEventListener('click', function() {
        if (confirm('Вернуться в главное меню?\n(В будущем здесь будут другие кейсы)')) {
            location.reload();
        }
    });
    
    document.querySelector('.game-container').appendChild(menuBtn);
    
    // Скрываем кнопки игрока в финале
    hidePlayerButtons();
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', initGame);