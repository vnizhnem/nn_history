// Тексты для кейса №1
const storyParts = [
    `Взираю на сие пепелище...\n\n18 августа 1816 года огонь поглотил\n39 корпусов ярмарки. Но знай —\nторги к тому моменту уже завершились.`,
    
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

// Инициализация
function initGame() {
    console.log('Игра "Исчезновение Макарьевской ярмарки" загружена!');
    
    // Показать кнопку начала
    startBtn.style.display = 'flex';
    
    // Начать рассказ
    startBtn.addEventListener('click', startStory);
    
    // Кнопка "Далее"
    nextBtn.addEventListener('click', showNextPart);
    
    // Кнопка финального перехода
    continueBtn.addEventListener('click', function() {
        alert('Переход к следующему кейсу...\n(Это будет реализовано позже)');
        // Здесь будет переход к следующему кейсу
    });
}

// Начать рассказ
function startStory() {
    startBtn.style.display = 'none'; // Скрыть кнопку начала
    storyWindow.style.display = 'flex'; // Показать окно рассказа
    currentPart = 0;
    storyText.textContent = storyParts[currentPart];
}

// Показать следующую часть
function showNextPart() {
    currentPart++;
    
    if (currentPart < storyParts.length) {
        // Показываем следующую часть
        storyText.textContent = storyParts[currentPart];
        
        // Если это последняя часть, меняем текст кнопки
        if (currentPart === storyParts.length - 1) {
            nextBtn.textContent = 'К выводу →';
        }
    } else {
        // Показать финальный вывод
        storyWindow.style.display = 'none';
        conclusionWindow.style.display = 'flex';
        conclusionTextElement.textContent = conclusionText;
    }
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);

// Добавим звуковые эффекты (опционально)
function playClickSound() {
    // Простой звук клика
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
}

// Добавляем звук клика ко всем кнопкам
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', playClickSound);
});