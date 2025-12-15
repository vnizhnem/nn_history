// Тексты для кейса №1
const storyParts = [
    `Взираю на сие пепелище...\n\n18 августа 1816 года огонь поглотил\n39 корпусов ярмарки. Но знай —\nторги к тому моменту уже завершились.`,
    
    `Странно, не правда ли?\n\nТорги кончались к Первому Спасу —\n1 августа. А пожар случился\nспустя более двух недель...`,
    
    `Присмотрись к берегу...\n\nТечение Волги постоянно подмывало его.\nМеста для растущей ярмарки\nстановилось всё меньше.`,
    
    `Следствие назвало причиной\n«поджёг злоумышленных людей».\nНо признаний не было,\nи улик не нашли...`
];

const conclusionText = `Так что же на самом деле?..\n\nПожар стал лишь поводом.\nЯрмарка переросла Макарьев.\nНижний Новгород же —\nудобнее, просторнее, перспективнее.`;

// Переменные для элементов DOM
let startBtn, storyWindow, storyText, nextBtn, conclusionWindow, conclusionTextElement, continueBtn;

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
    conclusionWindow = document.getElementById('conclusionWindow');
    conclusionTextElement = document.getElementById('conclusionText');
    continueBtn = document.getElementById('continueBtn');
    
    // Проверяем, найдены ли элементы
    if (!startBtn) {
        console.error('Элемент startBtn не найден!');
        return;
    }
    
    console.log('Все элементы DOM загружены:', {
        startBtn: !!startBtn,
        storyWindow: !!storyWindow,
        storyText: !!storyText,
        nextBtn: !!nextBtn
    });
    
    // Начать рассказ
    startBtn.addEventListener('click', startStory);
    
    // Кнопка "Далее"
    nextBtn.style.display = 'none';
    nextBtn.addEventListener('click', showNextPart);
    
    // Кнопка финального перехода
    continueBtn.addEventListener('click', function() {
        alert('Переход к следующему кейсу...');
    });
    
    // Пропуск печати по клику
    storyText.addEventListener('click', skipTyping);
    conclusionTextElement.addEventListener('click', skipTyping);
    
    console.log('Игра инициализирована!');
}

// Начать рассказ
function startStory() {
    console.log('Начало рассказа!');
    
    if (!startBtn || !storyWindow) {
        console.error('Элементы не найдены!');
        return;
    }
    
    startBtn.style.display = 'none';
    storyWindow.style.display = 'flex';
    currentPart = 0;
    nextBtn.style.display = 'none';
    
    console.log('Печатаем часть:', currentPart);
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
            
            playTypeSound();
            typeTimeout = setTimeout(type, typingSpeed);
        } else {
            isTyping = false;
            if (nextBtn) {
                nextBtn.style.display = 'block';
                if (currentPart === storyParts.length - 1) {
                    nextBtn.textContent = 'К выводу →';
                } else {
                    nextBtn.textContent = 'Далее →';
                }
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
        
        if (nextBtn && storyWindow.style.display === 'flex') {
            nextBtn.style.display = 'block';
            if (currentPart === storyParts.length - 1) {
                nextBtn.textContent = 'К выводу →';
            }
        }
        
        if (continueBtn && conclusionWindow.style.display === 'flex') {
            continueBtn.style.display = 'block';
        }
    }
}

// Показать следующую часть
function showNextPart() {
    if (isTyping) return;
    
    currentPart++;
    console.log('Переход к части:', currentPart);
    
    if (currentPart < storyParts.length) {
        nextBtn.style.display = 'none';
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

// Звуки
function playTypeSound() {
    // Простой звук
    const audioContext = new (window.AudioContext || window.webkitAudioContext);
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 400 + Math.random() * 300;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', initGame);

// Альтернативный запуск для старых браузеров
window.onload = initGame;