// Тексты для кейса №1
const storyParts = [
    `Взираю на сие пепелище...\n\n18 августа 1816 года огонь поглотил\n39 корпусов ярмарки. Но знай —\ntорги к тому моменту уже завершились.`,
    
    `Странно, не правда ли?\n\nТорги кончались к Первому Спасу —\n1 августа. А пожар случился\nспустя более двух недель...`,
    
    `Присмотрись к берегу...\n\nТечение Волги постоянно подмывало его.\nМеста для растущей ярмарки\nстановилось всё меньше.`,
    
    `Следствие назвало причиной\n«поджёг злоумышленных людей».\nНо признаний не было,\nи улик не нашли...`
];

const conclusionText = `Так что же на самом деле?..\n\nПожар стал лишь поводом.\nЯрмарка переросла Макарьев.\nНижний Новгород же —\nудобнее, просторнее, перспективнее.`;

// Элементы DOM
const startBtn = document.getElementById('startBtn');
const storyWindow = document.getElementById('storyWindow');
const storyText = document.getElementById('storyText');
const nextBtn = document.getElementById('nextBtn');
const conclusionWindow = document.getElementById('conclusionWindow');
const conclusionTextElement = document.getElementById('conclusionText');
const continueBtn = document.getElementById('continueBtn');

// Текущая часть рассказа
let currentPart = 0;
let isTyping = false;
let typingSpeed = 30; // мс между символами

// Инициализация
function initGame() {
    console.log('Игра "Исчезновение Макарьевской ярмарки" загружена!');
    
    // Начать рассказ
    startBtn.addEventListener('click', startStory);
    
    // Кнопка "Далее" (будет скрыта пока печатается)
    nextBtn.style.display = 'none';
    nextBtn.addEventListener('click', showNextPart);
    
    // Кнопка финального перехода
    continueBtn.addEventListener('click', function() {
        alert('Переход к следующему кейсу...\n(Это будет реализовано позже)');
    });
}

// Начать рассказ
function startStory() {
    startBtn.style.display = 'none'; // Скрыть кнопку начала
    storyWindow.style.display = 'flex'; // Показать окно рассказа
    currentPart = 0;
    nextBtn.style.display = 'none'; // Скрыть "Далее" пока печатается
    typeWriter(storyParts[currentPart], storyText);
}

// Эффект печатающейся машинки
function typeWriter(text, element) {
    if (isTyping) return;
    
    isTyping = true;
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            // Добавляем по одному символу
            if (text.charAt(i) === '\n') {
                element.innerHTML += '<br>';
            } else {
                element.textContent += text.charAt(i);
            }
            i++;
            
            // Звук печатания (опционально)
            playTypeSound();
            
            // Рекурсивный вызов с задержкой
            setTimeout(type, typingSpeed);
        } else {
            // Текст напечатан
            isTyping = false;
            nextBtn.style.display = 'block'; // Показать кнопку "Далее"
            
            // Если это последняя часть, меняем текст кнопки
            if (currentPart === storyParts.length - 1) {
                nextBtn.textContent = 'К выводу →';
            } else {
                nextBtn.textContent = 'Далее →';
            }
        }
    }
    
    type();
}

// Показать следующую часть
function showNextPart() {
    if (isTyping) return; // Нельзя перейти дальше пока печатается
    
    currentPart++;
    
    if (currentPart < storyParts.length) {
        // Скрыть кнопку и начать печатать следующую часть
        nextBtn.style.display = 'none';
        typeWriter(storyParts[currentPart], storyText);
    } else {
        // Показать финальный вывод (тоже с эффектом печати)
        storyWindow.style.display = 'none';
        conclusionWindow.style.display = 'flex';
        typeWriter(conclusionText, conclusionTextElement);
    }
}

// Простой звук печатания
function playTypeSound() {
    // Случайный звук для разнообразия
    const sounds = [400, 500, 600, 700];
    const freq = sounds[Math.floor(Math.random() * sounds.length)];
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    } catch (e) {
        // Игнорируем ошибки аудио
    }
}

// Звук клика
function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Игнорируем ошибки аудио
    }
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);

// Добавляем звук клика ко всем кнопкам
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', playClickSound);
});