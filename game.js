// Тексты для кейса №1
const storyParts = [
    `Взираю на сие пепелище...18 августа 1816 года огонь поглотил 39 корпусов ярмарки. Но знай — торги к тому моменту уже завершились.`,
    
    `Странно, не правда ли? Торги кончались к Первому Спасу — 1 августа. А пожар случился спустя более двух недель...`,
    
    `Присмотрись к берегу...Течение Волги постоянно подмывало его. Места для растущей ярмарки становилось всё меньше.`,
    
    `Следствие назвало причиной «поджёг злоумышленных людей». Но признаний не было,и улик не нашли...`
];

const conclusionText = `Так что же на самом деле?..Пожар стал лишь поводом. Ярмарка переросла Макарьев. Нижний Новгород же — удобнее, просторнее, перспективнее.`;

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

// Вопросы для викторины
const quizQuestions = [
    {
        question: "В каком году произошёл пожар на Макарьевской ярмарке?",
        options: [
            "1812",
            "1816", 
            "1820",
            "1824"
        ],
        correct: 1, // Индекс правильного ответа (0, 1, 2, 3)
        explanation: "Пожар произошёл 18 августа 1816 года."
    },
    {
        question: "Сколько корпусов ярмарки уничтожил пожар?",
        options: [
            "25 корпусов",
            "32 корпуса",
            "39 корпусов", 
            "45 корпусов"
        ],
        correct: 2,
        explanation: "Огонь поглотил 39 корпусов ярмарки."
    },
    {
        question: "К какому празднику обычно завершались торги?",
        options: [
            "К Пасхе",
            "К Троице",
            "К Первому Спасу", 
            "К Рождеству"
        ],
        correct: 2,
        explanation: "Торги завершались к Первому Спасу — 1 августа."
    },
    {
        question: "Какую главную проблему имела Макарьевская ярмарка?",
        options: [
            "Не хватало купцов",
            "Берег постоянно подмывало течением",
            "Высокие налоги", 
            "Конкуренция с Москвой"
        ],
        correct: 1,
        explanation: "Берег Волги постоянно подмывало, места становилось меньше."
    },
    {
        question: "Какую версию назвало следствие?",
        options: [
            "Неосторожное обращение с огнём",
            "Удар молнии",
            "Поджёг злоумышленных людей", 
            "Самовозгорание"
        ],
        correct: 2,
        explanation: "Следствие назвало причиной «поджёг злоумышленных людей»."
    }
];

// Элементы DOM
let startBtn, storyWindow, storyText, nextBtn, backBtn, conclusionWindow, conclusionTextElement, continueBtn;
let quizWindow, quizQuestion, quizOptions, quizScore, quizNextBtn, quizResults;

// Текущая часть рассказа
let currentPart = 0;
let isTyping = false;
let typingSpeed = 30;
let typeTimeout = null;

// Викторина
let currentQuestion = 0;
let score = 0;
let quizActive = false;

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
    quizWindow = document.getElementById('quizWindow');
    quizQuestion = document.getElementById('quizQuestion');
    quizOptions = document.getElementById('quizOptions');
    quizScore = document.getElementById('quizScore');
    quizNextBtn = document.getElementById('quizNextBtn');
    quizResults = document.getElementById('quizResults');
    
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
    
    // Кнопка "Закрепить знания"
    continueBtn.addEventListener('click', startQuiz);
    
    // Кнопка "Следующий вопрос" в викторине
    quizNextBtn.addEventListener('click', showNextQuestion);
    
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
    backBtn.style.display = 'none'; // В начале нет куда возвраваться
    
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
                    // Меняем текст кнопки на "Закрепить знания"
                    continueBtn.textContent = '📚 Закрепить знания';
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

// Начать викторину
function startQuiz() {
    console.log('Начало викторины!');
    
    // Скрываем окно вывода, показываем викторину
    conclusionWindow.style.display = 'none';
    quizWindow.style.display = 'flex';
    
    // Сбрасываем прогресс викторины
    currentQuestion = 0;
    score = 0;
    quizActive = true;
    
    // Обновляем счёт
    updateScore();
    
    // Показываем первый вопрос
    showQuestion(currentQuestion);
}

// Показать вопрос
function showQuestion(questionIndex) {
    if (questionIndex >= quizQuestions.length) {
        showQuizResults();
        return;
    }
    
    const question = quizQuestions[questionIndex];
    
    // Устанавливаем текст вопроса
    quizQuestion.textContent = `Вопрос ${questionIndex + 1}/${quizQuestions.length}: ${question.question}`;
    
    // Очищаем варианты ответов
    quizOptions.innerHTML = '';
    
    // Создаём кнопки вариантов ответов
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'quiz-option';
        optionBtn.textContent = `${String.fromCharCode(65 + index)}) ${option}`; // A), B), C), D)
        
        optionBtn.addEventListener('click', function() {
            if (quizActive) {
                checkAnswer(index, optionBtn, question.correct, question.explanation);
            }
        });
        
        quizOptions.appendChild(optionBtn);
    });
    
    // Скрываем кнопку "Следующий вопрос" пока не ответили
    quizNextBtn.style.display = 'none';
    quizNextBtn.textContent = questionIndex < quizQuestions.length - 1 ? 'Следующий вопрос →' : 'Посмотреть результаты →';
}

// Проверить ответ
function checkAnswer(selectedIndex, buttonElement, correctIndex, explanation) {
    // Делаем все кнопки неактивными
    const allOptions = document.querySelectorAll('.quiz-option');
    allOptions.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
    });
    
    if (selectedIndex === correctIndex) {
        // Правильный ответ
        buttonElement.style.background = '#2d5a1c';
        buttonElement.style.borderColor = '#1a3510';
        score++;
        updateScore();
        
        // Показываем пояснение
        const explanationEl = document.createElement('div');
        explanationEl.className = 'explanation';
        explanationEl.textContent = `✅ Верно! ${explanation}`;
        explanationEl.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            background: rgba(45, 90, 28, 0.2);
            border-left: 4px solid #2d5a1c;
            font-size: 14px;
            line-height: 1.5;
        `;
        
        // Вставляем пояснение после кнопок
        quizOptions.appendChild(explanationEl);
        
    } else {
        // Неправильный ответ
        buttonElement.style.background = '#8b0000';
        buttonElement.style.borderColor = '#660000';
        
        // Показываем правильный ответ
        const correctBtn = quizOptions.children[correctIndex];
        correctBtn.style.background = '#2d5a1c';
        correctBtn.style.borderColor = '#1a3510';
        
        // Показываем пояснение
        const explanationEl = document.createElement('div');
        explanationEl.className = 'explanation';
        explanationEl.textContent = `❌ Неверно. ${explanation}`;
        explanationEl.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            background: rgba(139, 0, 0, 0.2);
            border-left: 4px solid #8b0000;
            font-size: 14px;
            line-height: 1.5;
        `;
        
        quizOptions.appendChild(explanationEl);
    }
    
    // Показываем кнопку "Следующий вопрос"
    quizNextBtn.style.display = 'block';
    quizActive = false;
}

// Обновить счёт
function updateScore() {
    quizScore.textContent = `Баллы: ${score}/${quizQuestions.length}`;
}

// Показать следующий вопрос
function showNextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < quizQuestions.length) {
        quizActive = true;
        showQuestion(currentQuestion);
    } else {
        showQuizResults();
    }
}

// Показать результаты викторины
function showQuizResults() {
    // Скрываем окно с вопросами, показываем результаты
    const questionContainer = document.querySelector('.quiz-content');
    questionContainer.style.display = 'none';
    
    quizResults.style.display = 'block';
    
    // Определяем результат
    const percentage = Math.round((score / quizQuestions.length) * 100);
    let title, message, color;
    
    if (percentage === 100) {
        title = "🎉 Отлично!";
        message = "Вы отлично знаете историю Макарьевской ярмарки! Все ответы верные!";
        color = "#2d5a1c";
    } else if (percentage >= 70) {
        title = "👍 Хорошо!";
        message = "Вы хорошо запомнили историю. Есть над чем подумать!";
        color = "#4a90e2";
    } else if (percentage >= 50) {
        title = "😐 Неплохо";
        message = "Неплохой результат, но можно лучше. Перечитайте историю!";
        color = "#f39c12";
    } else {
        title = "📚 Повторите историю";
        message = "Стоит вернуться и перечитать историю внимательнее!";
        color = "#e74c3c";
    }
    
    // Заполняем результаты
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsTitle').style.color = color;
    document.getElementById('resultsScore').textContent = `Ваш результат: ${score} из ${quizQuestions.length} (${percentage}%)`;
    document.getElementById('resultsMessage').textContent = message;
    
    // Кнопка возврата в меню
    document.getElementById('backToMenuBtn').addEventListener('click', function() {
        showMenuButton();
    }, { once: true });
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
    
    // Скрываем все окна
    storyWindow.style.display = 'none';
    conclusionWindow.style.display = 'none';
    quizWindow.style.display = 'none';
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', initGame);