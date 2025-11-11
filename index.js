// ===================== УЛУЧШЕННЫЙ JS =====================

// Калькулятор
function openCalculator() {
    document.getElementById('calculatorModal').style.display = 'flex';
}

function closeCalculator() {
    document.getElementById('calculatorModal').style.display = 'none';
}

// Форма звонка
function openCallForm() {
    document.getElementById('callModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeCallForm() {
    document.getElementById('callModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Закрытие модалок по клику вне
window.addEventListener('click', function(event) {
    const callModal = document.getElementById('callModal');
    const calculatorModal = document.getElementById('calculatorModal');
    
    if (event.target === callModal) closeCallForm();
    if (event.target === calculatorModal) closeCalculator();
});

// Обработка отправки формы звонка — УЛУЧШЕНА
document.getElementById('callForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    this.innerHTML = `
        <div class="form-submitted">
            <i class="fas fa-check-circle"></i>
            <h3>Спасибо!</h3>
            <p>Мы перезвоним вам в течение 15 минут.</p>
        </div>
    `;
    setTimeout(() => {
        closeCallForm();
        this.reset();
        this.innerHTML = `
            <div class="form-group">
                <label for="callName">Имя *</label>
                <input type="text" id="callName" name="name" required placeholder="Введите ваше имя">
            </div>
            <div class="form-group">
                <label for="callPhone">Телефон *</label>
                <input type="tel" id="callPhone" name="phone" required placeholder="Введите ваш телефон">
            </div>
            <div class="form-group">
                <label for="callMessage">Дополнительное сообщение</label>
                <textarea id="callMessage" name="message" rows="4" placeholder="Расскажите подробнее о ваших пожеланиях..."></textarea>
            </div>
            <button type="submit" class="submit-btn">Отправить заявку</button>
        `;
    }, 3000);
});

// Обновление калькулятора — ДОБАВЛЕНА АНИМАЦИЯ ЦЕНЫ
function updateService() {
    const service = document.getElementById('serviceType').value;
    const areaSection = document.getElementById('areaSection');
    const materialSection = document.getElementById('materialSection');
    const additionalServices = document.getElementById('additionalServices');
    const materialOptions = document.getElementById('materialOptions');
    const serviceList = document.getElementById('serviceList');

    areaSection.style.display = 'none';
    materialSection.style.display = 'none';
    additionalServices.style.display = 'none';

    materialOptions.innerHTML = '';
    serviceList.innerHTML = '';

    switch(service) {
        case 'repair-apartment':
        case 'euro-repair':
        case 'office-repair':
        case 'construction':
        case 'design':
        case 'furniture':
        case 'windows':
        case 'bbq':
            areaSection.style.display = 'block';
            break;
        case 'ventilation':
            areaSection.style.display = "block";
            materialOptions.innerHTML = `
                <div class="option-item" data-value="acm">ACM-система</div>
                <div class="option-item" data-value="duct">Воздуховоды ACL</div>
                <div class="option-item" data-value="split">Сплит-система</div>
            `;
            materialSection.style.display = 'block';
            break;
        case 'fence':
            areaSection.style.display = 'block';
            materialOptions.innerHTML = `
                <div class="option-item" data-value="concrete">Бетонные блоки</div>
                <div class="option-item" data-value="brick">Кирпич</div>
                <div class="option-item" data-value="metal">Металл</div>
            `;
            materialSection.style.display = 'block';
            serviceList.innerHTML = `
                <div class="checkbox-item">
                    <input type="checkbox" id="service-delivery">
                    <label for="service-delivery">Доставка материалов — 15 000 ₽</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="service-waste">
                    <label for="service-waste">Вывоз мусора — 8 000 ₽</label>
                </div>
            `;
            additionalServices.style.display = 'block';
            break;
    }

    calculatePrice();
}

function calculatePrice() {
    const area = parseFloat(document.getElementById('area').value) || 0;
    const service = document.getElementById('serviceType').value;
    let total = 0;

    const baseRates = {
        'repair-apartment': 2000,
        'euro-repair': 4000,
        'office-repair': 7500,
        'construction': 4200,
        'design': 1200,
        'furniture': 1500,
        'windows': 2800,
        'ventilation': 1800,
        'fence': 1100,
        'bbq': 25000
    };

    if (area > 0 && baseRates[service]) {
        total += area * baseRates[service];
    }

    const checkedServices = document.querySelectorAll('#serviceList input:checked');
    checkedServices.forEach(item => {
        const label = item.nextElementSibling.textContent;
        if (label.includes('Доставка')) total += 15000;
        if (label.includes('Вывоз')) total += 8000;
    });

    const selectedMaterial = document.querySelector('.option-item.selected');
    if (selectedMaterial) {
        const matValue = selectedMaterial.getAttribute('data-value');
        if (matValue === 'duct' || matValue === 'acm') total *= 1.2;
        if (matValue === 'concrete' || matValue === 'brick') total *= 1.1;
    }

    // Анимация цены
    const priceEl = document.getElementById('resultPrice');
    const oldPrice = parseFloat(priceEl.getAttribute('data-current') || 0);
    const step = (total - oldPrice) / 20;
    let current = oldPrice;

    if (Math.abs(step) > 0.1) {
        const anim = setInterval(() => {
            current += step;
            if ((step > 0 && current >= total) || (step < 0 && current <= total)) {
                current = total;
                clearInterval(anim);
            }
            priceEl.textContent = Math.round(current).toLocaleString('ru-RU') + ' ₽';
        }, 20);
    } else {
        priceEl.textContent = total.toLocaleString('ru-RU') + ' ₽';
    }

    priceEl.setAttribute('data-current', total);
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('option-item')) {
        document.querySelectorAll('.option-item').forEach(i => i.classList.remove('selected'));
        e.target.classList.add('selected');
        calculatePrice();
    }
});

document.getElementById('area')?.addEventListener('input', calculatePrice);

// Шапка при прокрутке — УЛУЧШЕНО
const mainHeader = document.getElementById('mainHeader');
const topBanner = document.getElementById('topBanner');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
        mainHeader.classList.add('visible');
        topBanner.style.opacity = '0.7';
    } else {
        mainHeader.classList.remove('visible');
        topBanner.style.opacity = '1';
    }
    
    if (currentScrollY > 200) {
        topBanner.style.transform = 'translateY(-100%)';
    } else {
        topBanner.style.transform = 'translateY(0)';
    }

    // Показываем back-to-top
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (currentScrollY > 600) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
});

// Прокрутка к разделам — УЛУЧШЕНА
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Анимации при скролле
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.content-block, .stat-item, .portfolio-item, .process-step').forEach(block => {
        if (!block.classList.contains('animate-in')) {
            block.classList.add('animate-init');
            observer.observe(block);
        }
    });
}

function createFloatingCTA() {
    const cta = document.createElement('div');
    cta.className = 'floating-social';
    cta.innerHTML = `
        <button class="main-btn" aria-label="Связаться с нами">
            <i class="fas fa-comments"></i>
        </button>
        <a href="https://t.me/ваш_телеграм" target="_blank" class="social-btn telegram" aria-label="Написать в Telegram">
            <i class="fab fa-telegram-plane"></i>
        </a>
        <a href="https://vk.com/ваш_вк" target="_blank" class="social-btn vk" aria-label="Написать ВКонтакте">
            <i class="fab fa-vk"></i>
        </a>
    `;
    
    document.body.appendChild(cta);

    const mainBtn = cta.querySelector('.main-btn');
    let isOpen = false;

    mainBtn.addEventListener('click', function(e) {
        e.preventDefault();
        isOpen = !isOpen;
        cta.classList.toggle('open', isOpen);
        this.innerHTML = isOpen 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-comments"></i>';
    });
}
// Back to top
function createBackToTop() {
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(backToTop);
}

// Инициализация
window.addEventListener('load', () => {
    calculatePrice();
    animateOnScroll();
    createFloatingCTA();
    createBackToTop();
    
    // Показываем header
    setTimeout(() => {
        mainHeader.classList.add('visible');
    }, 100);
});

// Обработка форм — УЛУЧШЕНА
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitBtn = form.querySelector('.submit-btn');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;

        // Имитация отправки (в реальном проекте замени на fetch/Formspree)
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Отправлено!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            setTimeout(() => {
                form.reset();
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 2000);
        }, 1500);
    });
});

// Карусель портфолио
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
const indicators = document.querySelectorAll('.indicator');

function changeSlide(direction) {
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }
    
    updateCarousel();
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    updateCarousel();
}

function updateCarousel() {
    const wrapper = document.querySelector('.carousel-wrapper');
    wrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    
    // Обновить индикаторы
    indicators.forEach((indicator, index) => {
        if (index === currentSlideIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Автоматическая смена слайдов
setInterval(() => {
    changeSlide(1);
}, 5000);

// Открытие страниц проектов
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', function() {
        const project = this.getAttribute('data-project');
        window.location.href = `portfolio/${project}.html`;
    });
});

// Инициализация карусели
window.addEventListener('load', () => {
    updateCarousel();
});
