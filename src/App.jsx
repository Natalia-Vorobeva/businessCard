import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './App.scss';
import { 
  FiMail, 
  FiPhone, 
  FiGithub, 
  FiLinkedin, 
  FiExternalLink, 
  FiHome, 
  FiCheck, 
  FiAlertCircle, 
  FiRefreshCw 
} from 'react-icons/fi';
import { 
  FaReact, 
  FaNodeJs, 
  FaDatabase, 
  FaTicketAlt, 
  FaCheckCircle, 
  FaComments,
  FaRobot
} from 'react-icons/fa';

// Инициализация EmailJS (замените YOUR_PUBLIC_KEY на ваш ключ)
emailjs.init("YOUR_PUBLIC_KEY");

function App() {
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  // Состояние капчи
  const [captcha, setCaptcha] = useState({
    question: '',
    answer: 0,
    userAnswer: ''
  });
  
  // Состояние отправки формы
  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: false,
    message: ''
  });

  // Время начала заполнения формы
  const [formStartTime] = useState(Date.now());

  // Портфолио проекты
  const portfolioItems = [
    {
      id: 1,
      title: "Билетная касса",
      description: "Система бронирования билетов с выбором мест, онлайн-оплатой и админ-панелью",
      icon: <FaTicketAlt />,
      tech: ["React", "Node.js", "MongoDB", "Stripe API"],
      link: "#",
      demo: "#"
    },
    {
      id: 2,
      title: "ToDo List",
      description: "Продуктивное приложение с категориями, тегами, дедлайнами и аналитикой",
      icon: <FaCheckCircle />,
      tech: ["React", "Redux", "Firebase", "SCSS"],
      link: "#",
      demo: "#"
    },
    {
      id: 3,
      title: "Мессенджер",
      description: "Чат-приложение в реальном времени с комнатами, файлами и видеозвонками",
      icon: <FaComments />,
      tech: ["React", "Socket.io", "WebRTC", "PostgreSQL"],
      link: "#",
      demo: "#"
    }
  ];

  // Генерация математической капчи
  const generateCaptcha = () => {
    const operators = ['+', '-', '×'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1, num2, answer;
    
    switch(operator) {
      case '+':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 10) + 5;
        num2 = Math.floor(Math.random() * 5) + 1;
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
        answer = num1 * num2;
        break;
      default:
        num1 = 2;
        num2 = 3;
        answer = 5;
    }
    
    setCaptcha({
      question: `Сколько будет ${num1} ${operator} ${num2}?`,
      answer: answer,
      userAnswer: ''
    });
  };

  // Генерируем капчу при загрузке компонента
  useEffect(() => {
    generateCaptcha()
  }, [])

  // Обработчики изменений
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleCaptchaChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Только цифры
    setCaptcha(prev => ({
      ...prev,
      userAnswer: value
    }));
  }

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Проверка капчи
    const userAnswer = parseInt(captcha.userAnswer.trim());
    if (isNaN(userAnswer) || userAnswer !== captcha.answer) {
      setFormStatus({
        loading: false,
        success: false,
        error: true,
        message: 'Неверный ответ на капчу. Пожалуйста, попробуйте еще раз.'
      });
      generateCaptcha();
      return;
    }

    // Проверка на слишком быстрое заполнение
    const formFillTime = Date.now() - formStartTime;
    if (formFillTime < 3000) {
      setFormStatus({
        loading: false,
        success: false,
        error: true,
        message: 'Форма заполнена слишком быстро. Пожалуйста, заполните форму внимательно.'
      });
      generateCaptcha();
      return;
    }

    // Проверка на спам-слова
    const spamWords = [
      'http://', 'https://', 'www.', 'купить', 'дешево', 
      'viagra', 'casino', 'порно', 'займ', 'кредит'
    ];
    const message = formData.message.toLowerCase();
    const name = formData.name.toLowerCase();
    
    for (let word of spamWords) {
      if (message.includes(word.toLowerCase()) || name.includes(word.toLowerCase())) {
        setFormStatus({
          loading: false,
          success: false,
          error: true,
          message: 'Обнаружены недопустимые слова в сообщении.'
        });
        generateCaptcha();
        return;
      }
    }

    setFormStatus({
      loading: true,
      success: false,
      error: false,
      message: 'Проверка данных...'
    });

    try {
      // Отправка через EmailJS
      const result = await emailjs.send(
        'YOUR_SERVICE_ID', // Замените на ваш Service ID
        'YOUR_TEMPLATE_ID', // Замените на ваш Template ID
        {
          to_email: 'vorobjeva.natalia76@yandex.ru',
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          name: formData.name,
          email: formData.email,
          date: new Date().toLocaleString('ru-RU'),
          captcha_answer: captcha.answer,
          user_ip: 'user',
          timestamp: new Date().toISOString()
        }
      );

      if (result.status === 200) {
        setFormStatus({
          loading: false,
          success: true,
          error: false,
          message: 'Заявка успешно отправлена! Я свяжусь с вами в ближайшее время.'
        });
        
        // Очистка формы
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        generateCaptcha();

        // Сброс статуса через 5 секунд
        setTimeout(() => {
          setFormStatus({
            loading: false,
            success: false,
            error: false,
            message: ''
          });
        }, 5000);
      } else {
        throw new Error('Ошибка отправки');
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      setFormStatus({
        loading: false,
        success: false,
        error: true,
        message: 'Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь со мной другим способом.'
      });
      generateCaptcha();
    }
  };

  return (
    <div className="app">
      {/* Хедер */}
      <header className="header">
        <div className="container">
          <div className="header-left">
            <div className="header-avatar">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                alt="Наталья Воробьева" 
                className="avatar-small"
              />
            </div>
            <div className="header-name">
              <h1 className="name-title">Наталья Воробьева</h1>
              <p className="name-subtitle">Frontend Developer</p>
            </div>
          </div>
          
          <nav className="nav">
            <a href="#home" className="nav-link active">
              <FiHome /> Главная
            </a>
            <a href="#portfolio" className="nav-link">
              Портфолио
            </a>
            <a href="#about" className="nav-link">
              Обо мне
            </a>
            <a href="#contact" className="nav-link">
              Контакты
            </a>
          </nav>
        </div>
      </header>

      {/* Герой секция */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-left">
              <div className="avatar-section">
                <div className="avatar-large">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                    alt="Наталья Воробьева" 
                    className="avatar-img"
                  />
                  <div className="avatar-status"></div>
                </div>
                <div className="name-display">
                  <h1 className="main-name">Наталья Воробьева</h1>
                  <p className="main-title">Frontend Developer</p>
                  <div className="title-tags">
                    <span className="tag">React</span>
                    <span className="tag">TypeScript</span>
                    <span className="tag">SCSS</span>
                    <span className="tag">Node.js</span>
                  </div>
                </div>
              </div>
              
              <div className="hero-text">
                <h2>Создаю современные и эффективные веб-приложения</h2>
                <p>Специализируюсь на разработке пользовательских интерфейсов с использованием React, TypeScript и современных подходов к фронтенд-разработке. Каждый проект — это решение конкретной бизнес-задачи.</p>
                <div className="tech-stack">
                  <span className="tech-badge"><FaReact /> React</span>
                  <span className="tech-badge"><FaNodeJs /> Node.js</span>
                  <span className="tech-badge"><FaDatabase /> Databases</span>
                </div>
                <div className="hero-buttons">
                  <a href="#portfolio" className="cta-button secondary">Мои работы</a>
                  <a href="#contact" className="cta-button primary">Обсудить проект</a>
                </div>
              </div>
            </div>
            
            <div className="hero-image">
              <div className="code-window">
                <div className="window-header">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                  <span className="window-title">portfolio.js</span>
                </div>
                <div className="code-content">
                  <pre>{`// Мой стек технологий
const techStack = {
  frontend: ["React", "Vue", "TypeScript"],
  styling: ["SCSS", "Tailwind", "Styled Components"],
  tools: ["Git", "Webpack", "Figma"],
  backend: ["Node.js", "Express", "MongoDB"]
};

// Доступен для вашего проекта
function startProject(requirements) {
  return develop({
    deadline: "в срок",
    quality: "высокая",
    communication: "прозрачная"
  });
}

// Готов к сотрудничеству!
const isAvailable = true;`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Портфолио */}
      <section id="portfolio" className="portfolio">
        <div className="container">
          <h2 className="section-title">Мои проекты</h2>
          <p className="section-subtitle">Реализованные решения, демонстрирующие мой опыт и навыки</p>
          
          <div className="portfolio-grid">
            {portfolioItems.map(item => (
              <div key={item.id} className="portfolio-card">
                <div className="card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="tech-tags">
                  {item.tech.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="card-buttons">
                  <a href={item.link} className="card-link">
                    Код <FiExternalLink />
                  </a>
                  <a href={item.demo} className="card-demo">
                    Демо →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Обо мне */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">Обо мне</h2>
              <p>Фронтенд-разработчик с фокусом на создании интуитивных и производительных интерфейсов. Имею опыт работы с современными технологиями и фреймворками. Верю, что качественный код — это код, который решает проблемы пользователей и бизнеса.</p>
              
              <div className="about-details">
                <div className="detail-item">
                  <h4>Подход к работе</h4>
                  <p>Анализирую задачу, предлагаю оптимальное решение, тестирую и оптимизирую результат.</p>
                </div>
                <div className="detail-item">
                  <h4>Коммуникация</h4>
                  <p>Прозрачная работа, регулярные отчеты о прогрессе, открытость к правкам.</p>
                </div>
                <div className="detail-item">
                  <h4>Технологии</h4>
                  <p>Постоянно изучаю новые инструменты и лучшие практики разработки.</p>
                </div>
              </div>
              
              <div className="stats">
                <div className="stat">
                  <span className="stat-number">15+</span>
                  <span className="stat-label">Проектов</span>
                </div>
                <div className="stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Соблюдение сроков</span>
                </div>
                <div className="stat">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Поддержка</span>
                </div>
                <div className="stat">
                  <span className="stat-number">3+</span>
                  <span className="stat-label">Года опыта</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Контакты */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Свяжитесь со мной</h2>
          <p className="section-subtitle">Готов обсудить ваш проект и предложить решение</p>
          
          <div className="security-note">
            <FaRobot />
            <span>Форма защищена от спама и ботов</span>
          </div>
          
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-block">
                <h3>Прямые контакты</h3>
                <a href="mailto:vorobjeva.natalia76@yandex.ru" className="contact-item">
                  <FiMail />
                  <div>
                    <span className="contact-label">Email для заказов</span>
                    <span className="contact-value">vorobjeva.natalia76@yandex.ru</span>
                  </div>
                </a>
                <a href="tel:+79991234567" className="contact-item">
                  <FiPhone />
                  <div>
                    <span className="contact-label">Телефон / Telegram</span>
                    <span className="contact-value">+7 (999) 123-45-67</span>
                  </div>
                </a>
              </div>
              
              <div className="contact-block">
                <h3>Социальные сети</h3>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="contact-item">
                  <FiGithub />
                  <div>
                    <span className="contact-label">GitHub</span>
                    <span className="contact-value">Мои проекты и код</span>
                  </div>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="contact-item">
                  <FiLinkedin />
                  <div>
                    <span className="contact-label">LinkedIn</span>
                    <span className="contact-value">Профессиональный профиль</span>
                  </div>
                </a>
              </div>
              
              <div className="working-hours">
                <h3>Время работы</h3>
                <p>Пн-Пт: 10:00 - 19:00</p>
                <p>Сб-Вс: по договоренности</p>
                <p className="note">Отвечаю на письма в течение 24 часов</p>
              </div>
            </div>
            
            <div className="contact-form-container">
              <form className="contact-form" onSubmit={handleSubmit}>
                {/* Honeypot поле для ботов */}
                <div className="honeypot-field">
                  <label htmlFor="website">Не заполняйте это поле</label>
                  <input 
                    type="text" 
                    id="website"
                    name="website"
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </div>
                
                {/* Основные поля формы */}
                <div className="form-group">
                  <label htmlFor="name">Ваше имя *</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    placeholder="Александр Иванов" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                    minLength="2"
                    maxLength="50"
                    disabled={formStatus.loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    placeholder="example@mail.ru" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    disabled={formStatus.loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Сообщение *</label>
                  <textarea 
                    id="message"
                    name="message"
                    placeholder="Опишите ваш проект, требования, сроки и бюджет..." 
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    minLength="10"
                    maxLength="1000"
                    disabled={formStatus.loading}
                  ></textarea>
                  <div className="char-counter">
                    {formData.message.length}/1000 символов
                  </div>
                </div>
                
                {/* Капча секция */}
                <div className="form-group captcha-section">
                  <div className="captcha-header">
                    <label>Подтвердите, что вы не робот *</label>
                    <button 
                      type="button" 
                      className="refresh-captcha"
                      onClick={generateCaptcha}
                      disabled={formStatus.loading}
                    >
                      <FiRefreshCw /> Новая задача
                    </button>
                  </div>
                  
                  <div className="captcha-container">
                    <div className="captcha-question">
                      <span className="captcha-icon">🧮</span>
                      <span className="captcha-text">{captcha.question}</span>
                    </div>
                    
                    <div className="captcha-input-group">
                      <input 
                        type="text" 
                        placeholder="Введите ответ цифрами"
                        value={captcha.userAnswer}
                        onChange={handleCaptchaChange}
                        required
                        disabled={formStatus.loading}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        maxLength="3"
                      />
                      <span className="captcha-hint">Только цифры</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className={`submit-button ${formStatus.loading ? 'loading' : ''}`}
                  disabled={formStatus.loading}
                >
                  {formStatus.loading ? (
                    <>
                      <span className="spinner"></span>
                      Проверка и отправка...
                    </>
                  ) : (
                    'Отправить заявку'
                  )}
                </button>
                
                {formStatus.message && (
                  <div className={`form-feedback ${formStatus.success ? 'success' : formStatus.error ? 'error' : ''}`}>
                    {formStatus.success ? <FiCheck /> : <FiAlertCircle />}
                    <span>{formStatus.message}</span>
                  </div>
                )}
                
                <div className="form-note">
                  <p>✓ Защищено от спама</p>
                  <p>✓ Ваши данные в безопасности</p>
                  <p>✓ Отвечаю в течение 24 часов</p>
                  <p className="privacy">
                    Отправляя форму, вы соглашаетесь с обработкой персональных данных
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h3>Наталья Воробьева</h3>
              <p>Frontend Developer</p>
            </div>
            
            <div className="footer-links">
              <a href="#home">Главная</a>
              <a href="#portfolio">Портфолио</a>
              <a href="#about">Обо мне</a>
              <a href="#contact">Контакты</a>
            </div>
            
            <div className="footer-social">
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <FiGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <FiLinkedin />
              </a>
              <a href="mailto:vorobjeva.natalia76@yandex.ru">
                <FiMail />
              </a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Наталья Воробьева. Все права защищены.</p>
            <p className="footer-note">Сайт-портфолио фронтенд-разработчика</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App