/**
 * پیکسل وب - JavaScript اصلی
 * شامل تعاملات، اعتبارسنجی فرم و انیمیشن‌ها
 */

// ========================================
// متغیرهای سراسری
// ========================================
let isMenuOpen = false;
let currentModal = null;

// ========================================
// تنظیمات اولیه
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupHeader();
    setupMobileMenu();
    setupContactForm();
    setupPortfolioModals();
    setupSmoothScroll();
    setupAnimations();
}

// ========================================
// Header و Navigation
// ========================================
function setupHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    // تغییر استایل header هنگام اسکرول
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('nav');
    
    if (!mobileToggle || !nav) return;

    mobileToggle.addEventListener('click', function() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            nav.classList.add('active');
            mobileToggle.innerHTML = '✕';
            mobileToggle.setAttribute('aria-label', 'بستن منو');
        } else {
            nav.classList.remove('active');
            mobileToggle.innerHTML = '☰';
            mobileToggle.setAttribute('aria-label', 'منوی موبایل');
        }
    });

    // بستن منو هنگام کلیک روی لینک
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (isMenuOpen) {
                isMenuOpen = false;
                nav.classList.remove('active');
                mobileToggle.innerHTML = '☰';
                mobileToggle.setAttribute('aria-label', 'منوی موبایل');
            }
        });
    });

    // بستن منو هنگام کلیک خارج از آن
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !nav.contains(e.target) && !mobileToggle.contains(e.target)) {
            isMenuOpen = false;
            nav.classList.remove('active');
            mobileToggle.innerHTML = '☰';
            mobileToggle.setAttribute('aria-label', 'منوی موبایل');
        }
    });
}

// ========================================
// فرم تماس و اعتبارسنجی
// ========================================
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });

    // اعتبارسنجی real-time
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(input);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(input);
        });
    });
}

function validateForm() {
    const form = document.getElementById('contact-form');
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    
    let isValid = true;
    
    // اعتبارسنجی نام
    if (!validateField(name)) {
        isValid = false;
    }
    
    // اعتبارسنجی ایمیل
    if (!validateField(email)) {
        isValid = false;
    }
    
    // اعتبارسنجی پیام
    if (!validateField(message)) {
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // بررسی خالی نبودن فیلد
    if (!value) {
        isValid = false;
        switch (fieldName) {
            case 'name':
                errorMessage = 'لطفاً نام خود را وارد کنید';
                break;
            case 'email':
                errorMessage = 'لطفاً ایمیل خود را وارد کنید';
                break;
            case 'message':
                errorMessage = 'لطفاً پیام خود را وارد کنید';
                break;
        }
    }
    
    // اعتبارسنجی ایمیل
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'لطفاً ایمیل معتبر وارد کنید';
        }
    }
    
    // اعتبارسنجی طول پیام
    if (fieldName === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'پیام باید حداقل 10 کاراکتر باشد';
    }
    
    // نمایش خطا
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('form-error')) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('form-error')) {
        errorElement.style.display = 'none';
    }
}

function submitForm() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    
    // نمایش loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '⏳ در حال ارسال...';
    submitBtn.disabled = true;
    
    // شبیه‌سازی ارسال فرم (در پروژه واقعی باید به سرور ارسال شود)
    setTimeout(() => {
        // نمایش پیام موفقیت
        showSuccessMessage();
        
        // بازگردانی دکمه
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // پاک کردن فرم
        form.reset();
        
        // لاگ کردن داده‌ها (در پروژه واقعی باید به سرور ارسال شود)
        console.log('Form Data:', {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        });
        
    }, 2000);
}

function showSuccessMessage() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    
    if (successMessage) {
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // اسکرول به پیام موفقیت
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }
}

// ========================================
// Portfolio Modals
// ========================================
function setupPortfolioModals() {
    // بستن modal هنگام کلیک خارج از آن
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('portfolio-modal');
        if (modal && e.target === modal) {
            closePortfolioModal();
        }
    });
    
    // بستن modal با کلید Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentModal) {
            closePortfolioModal();
        }
    });
}

// داده‌های پروژه‌ها
const portfolioData = {
    1: {
        title: 'ایران کاکتوس',
        description: 'طراحی فروشگاهی مینیمال، تمرکز روی تبدیل کاربر',
        fullDescription: 'این پروژه شامل طراحی کامل یک فروشگاه آنلاین با تمرکز بر تجربه کاربری و تبدیل بازدیدکنندگان به مشتری بود. طراحی مینیمال و کاربرپسند با تاکید بر سرعت بارگذاری و سهولت استفاده.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
        features: [
            'طراحی واکنش‌گرا برای تمام دستگاه‌ها',
            'بهینه‌سازی سرعت بارگذاری',
            'رابط کاربری ساده و کاربرپسند',
            'سیستم سبد خرید بهینه',
            'بهینه‌سازی برای موتورهای جستجو'
        ],
        duration: '3 هفته',
        client: 'شرکت رنگین'
    },
    2: {
        title: 'پلتفرم خدماتی ابزار اتومات',
        description: 'داشبورد خدماتی با UX ساده و کاربرپسند',
        fullDescription: 'طراحی و توسعه یک پلتفرم خدماتی کامل با داشبورد مدیریتی پیشرفته. این پروژه شامل بخش‌های مختلفی از جمله مدیریت کاربران، خدمات، پرداخت‌ها و گزارش‌گیری بود.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL'],
        features: [
            'داشبورد مدیریتی کامل',
            'سیستم مدیریت کاربران',
            'پنل مدیریت خدمات',
            'سیستم پرداخت آنلاین',
            'گزارش‌گیری پیشرفته',
            'طراحی واکنش‌گرا'
        ],
        duration: '6 هفته',
        client: 'استارتاپ ابزار اتومات'
    },
    3: {
        title: 'لندینگ برند نِوَ',
        description: 'لندینگ با انیمیشن‌های میکرو و سرعت بالا',
        fullDescription: 'طراحی یک لندینگ پیج مدرن و جذاب برای برند نِوَ با تمرکز بر انیمیشن‌های میکرو و تجربه کاربری منحصر به فرد. این پروژه شامل طراحی خلاقانه و پیاده‌سازی انیمیشن‌های پیشرفته بود.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'WebGL'],
        features: [
            'انیمیشن‌های میکرو پیشرفته',
            'طراحی خلاقانه و منحصر به فرد',
            'سرعت بارگذاری بالا',
            'تجربه کاربری تعاملی',
            'طراحی واکنش‌گرا',
            'بهینه‌سازی برای موبایل'
        ],
        duration: '4 هفته',
        client: 'برند نِوَ'
    }
};

function openPortfolioModal(projectId) {
    const modal = document.getElementById('portfolio-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    const project = portfolioData[projectId];
    if (!project) return;
    
    // تنظیم عنوان
    modalTitle.textContent = project.title;
    
    // تنظیم محتوا
    modalBody.innerHTML = `
        <div style="margin-bottom: var(--spacing-lg);">
            <h4 style="color: var(--text-dark); margin-bottom: var(--spacing-md);">توضیحات پروژه</h4>
            <p style="margin-bottom: var(--spacing-lg);">${project.fullDescription}</p>
        </div>
        
        <div style="margin-bottom: var(--spacing-lg);">
            <h4 style="color: var(--text-dark); margin-bottom: var(--spacing-md);">فناوری‌های استفاده شده</h4>
            <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
                ${project.technologies.map(tech => 
                    `<span style="background: var(--primary-color); color: var(--white); padding: var(--spacing-xs) var(--spacing-sm); border-radius: 4px; font-size: var(--font-size-sm);">${tech}</span>`
                ).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: var(--spacing-lg);">
            <h4 style="color: var(--text-dark); margin-bottom: var(--spacing-md);">ویژگی‌های کلیدی</h4>
            <ul style="list-style: none; padding: 0;">
                ${project.features.map(feature => 
                    `<li style="padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--gray-200); display: flex; align-items: center; gap: var(--spacing-sm);">
                        <span style="color: var(--primary-color);">✓</span>
                        ${feature}
                    </li>`
                ).join('')}
            </ul>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg); margin-bottom: var(--spacing-lg);">
            <div>
                <h4 style="color: var(--text-dark); margin-bottom: var(--spacing-sm);">مدت زمان</h4>
                <p style="color: var(--text-light);">${project.duration}</p>
            </div>
            <div>
                <h4 style="color: var(--text-dark); margin-bottom: var(--spacing-sm);">مشتری</h4>
                <p style="color: var(--text-light);">${project.client}</p>
            </div>
        </div>
        
        <div style="text-align: center; padding-top: var(--spacing-lg); border-top: 1px solid var(--gray-200);">
            <a href="https://t.me/pixel_webs" class="btn btn-primary" target="_blank" rel="noopener">
                📱 درخواست پروژه مشابه در تلگرام
            </a>
        </div>
    `;
    
    // نمایش modal
    modal.classList.add('active');
    currentModal = modal;
    
    // جلوگیری از اسکرول body
    document.body.style.overflow = 'hidden';
}

function closePortfolioModal() {
    const modal = document.getElementById('portfolio-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    currentModal = null;
    
    // بازگردانی اسکرول body
    document.body.style.overflow = '';
}

// ========================================
// Smooth Scroll
// ========================================
function setupSmoothScroll() {
    // اسکرول نرم برای لینک‌های داخلی
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// انیمیشن‌ها و تعاملات
// ========================================
function setupAnimations() {
    // انیمیشن fade-in برای عناصر هنگام اسکرول
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // اعمال انیمیشن به عناصر
    const animatedElements = document.querySelectorAll('.card, .portfolio-item, .section-title');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// ========================================
// Utility Functions
// ========================================

// تابع برای نمایش پیام‌های toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // استایل toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-out'
    });
    
    // رنگ‌بندی بر اساس نوع
    switch (type) {
        case 'success':
            toast.style.backgroundColor = '#28a745';
            break;
        case 'error':
            toast.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            toast.style.backgroundColor = '#ffc107';
            toast.style.color = '#212529';
            break;
        default:
            toast.style.backgroundColor = '#17a2b8';
    }
    
    document.body.appendChild(toast);
    
    // انیمیشن ورود
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // حذف خودکار بعد از 3 ثانیه
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// تابع برای کپی کردن متن
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('متن کپی شد!', 'success');
        });
    } else {
        // Fallback برای مرورگرهای قدیمی
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('متن کپی شد!', 'success');
    }
}

// ========================================
// Event Listeners اضافی
// ========================================

// بستن modal با کلید Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (currentModal) {
            closePortfolioModal();
        }
    }
});

// مدیریت تغییر اندازه پنجره
window.addEventListener('resize', function() {
    // بستن منوی موبایل در صورت تغییر اندازه
    if (window.innerWidth > 900 && isMenuOpen) {
        isMenuOpen = false;
        const nav = document.getElementById('nav');
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        
        if (nav && mobileToggle) {
            nav.classList.remove('active');
            mobileToggle.innerHTML = '☰';
            mobileToggle.setAttribute('aria-label', 'منوی موبایل');
        }
    }
});

// ========================================
// Performance Optimization
// ========================================

// Lazy loading برای تصاویر
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// اجرای lazy loading
document.addEventListener('DOMContentLoaded', setupLazyLoading);

// ========================================
// Debug و Development
// ========================================

// تابع برای لاگ کردن اطلاعات debug
function debugLog(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[Pixel Web Debug] ${message}`, data);
    }
}

// لاگ کردن اطلاعات اولیه
debugLog('Pixel Web JavaScript loaded successfully');
debugLog('Current page:', window.location.pathname);
