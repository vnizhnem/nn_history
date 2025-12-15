// Тексты для кейса №1 (исправленные с пробелами)
const storyParts = [
    `Взираю на сие пепелище...18 августа 1816 года огонь поглотил 39 корпусов ярмарки. Но знай — торги к тому моменту уже завершились.`,
    
    `Странно, не правда ли? Торги кончались к Первому Спасу — 1 августа. А пожар случился спустя более двух недель...`,
    
    `Присмотрись к берегу...Течение Волги постоянно подмывало его. Места для растущей ярмарки становилось всё меньше.`,
    
    `Следствие назвало причиной «поджёг злоумышленных людей». Но признаний не было, и улик не нашли...`
];

const conclusionText = `Так что же на самом деле?.. Пожар стал лишь поводом. Ярмарка переросла Макарьев. Нижний Новгород же — удобнее, просторнее, перспективнее.`;

// Варианты текста для кнопки "Далее"
const nextButtonTexts = [
    "Расскажи ещё →",
    "Слушать дальше →", 
    "Продолжай →",
    "Что дальше? →",
    "Далее →",
    "И что же? →",
    "Понятно, дальше →"
];

// Элементы DOM
let startBtn, storyWindow, storyText, nextBtn, backBtn, conclusionWindow, conclusionTextElement, continueBtn;

// Текущая часть рассказа
let currentPart = 0;
let isTyping = false;
let typingSpeed = 30;
let typeTimeout = null;

// Инициализация
function initGame() {
    console.log('Игра "Исчезновение Макарьевской ярмарки" загружена!');
    
    // Находим элементы DOM
    startBtn = document.getElementById('startBtn');
    storyWindow = document.getElementById('storyWindow');
    storyText = document.getElementById('storyText');
    nextBtn = document.getElementById('nextBtn');
    backBtn = document.getElementById('backBtn');
    conclusionWindow = document.getElementById('conclusionWindow');
    conclusionTextElement = document.getElementById('conclusionText');
    continueBtn = document.getElementById('continueBtn');
    
    // Проверяем, найдены ли элементы
    if (!startBtn) {
        console.error('Элемент startBtn не найден!');
        return;
    }
    
    // Начать рассказ
    startBtn.addEventListener('click', startStory);
    
    // Кнопки навигации
    nextBtn.style.display = 'none';
    backBtn.style.display = 'none';
    
    nextBtn.addEventListener('click', showNextPart);
    backBtn.addEventListener('click', goBack);
    
    // Кнопка финального перехода
    continueBtn.addEventListener('click', function() {
        showMenuButton();
    });
    
    // Пропуск печати по клику
    storyText.addEventListener('click', skipTyping);
    conclusionTextElement.addEventListener('click', skipTyping);
    
    console.log('Игра инициализирована!');
}

// Получить случайный текст для кнопки "Далее"
function getRandomNextText() {
    const randomIndex = Math.floor(Math.random() * nextButtonTexts.length);
    return nextButtonTexts[randomIndex];
}

// Начать рассказ
function startStory() {
    console.log('Начало рассказа!');
    
    startBtn.style.display = 'none';
    storyWindow.style.display = 'flex';
    currentPart = 0;
    
    // Показываем кнопки навигации
    nextBtn.style.display = 'none'; // Скрываем пока печатается
    backBtn.style.display = 'none'; // В начале нет куда возвращаться
    
    typeWriter(storyParts[currentPart], storyText);
}

// Эффект печатающейся машинки
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
                nextBtn.textContent = getRandomNextText();
            }
            
            // Показываем кнопку "Назад" если есть куда возвращаться
            if (backBtn && currentPart > 0) {
                backBtn.style.display = 'block';
            }
            
            // Если это последняя часть, меняем текст кнопки "Далее"
            if (currentPart === storyParts.length - 1) {
                nextBtn.textContent = 'К выводу →';
            }
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
        
        // Показываем кнопки сразу
        if (nextBtn && storyWindow.style.display === 'flex') {
            nextBtn.style.display = 'block';
            nextBtn.textContent = getRandomNextText();
            
            if (currentPart === storyParts.length - 1) {
                nextBtn.textContent = 'К выводу →';
            }
        }
        
        if (backBtn && currentPart > 0) {
            backBtn.style.display = 'block';
        }
        
        if (continueBtn && conclusionWindow.style.display === 'flex') {
            continueBtn.style.display = 'block';
        }
    }
}

// Показать следующую часть
function showNextPart() {
    if (isTyping) return;
    
    // Скрываем кнопки на время перехода
    nextBtn.style.display = 'none';
    backBtn.style.display = 'none';
    
    currentPart++;
    console.log('Переход к части:', currentPart);
    
    if (currentPart < storyParts.length) {
        typeWriter(storyParts[currentPart], storyText);
    } else {
        storyWindow.style.display = 'none';
        if (conclusionWindow) {
            conclusionWindow.style.display = 'flex';
            continueBtn.style.display = 'none';
            typeWriter(conclusionText, conclusionTextElement);
            
            const checkButton = setInterval(() => {
                if (!isTyping && continueBtn) {
                    continueBtn.style.display = 'block';
                    clearInterval(checkButton);
                }
            }, 100);
        }
    }
}

// Вернуться назад
function goBack() {
    if (currentPart > 0) {
        currentPart--;
        
        if (storyWindow.style.display === 'flex') {
            storyText.textContent = storyParts[currentPart];
            
            // Показываем кнопки
            nextBtn.style.display = 'block';
            nextBtn.textContent = getRandomNextText();
            
            if (currentPart === storyParts.length - 1) {
                nextBtn.textContent = 'К выводу →';
            }
            
            // Показываем/скрываем кнопку "Назад"
            if (backBtn) {
                backBtn.style.display = currentPart > 0 ? 'block' : 'none';
            }
        }
    }
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
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', initGame);