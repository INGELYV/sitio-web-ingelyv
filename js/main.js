// ======================================
// INGELYV - Main JavaScript
// ======================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- Mobile Menu Toggle ----
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            const icon = menuBtn.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = mobileMenu.classList.contains('open') ? 'close' : 'menu';
            }
        });
    }

    // ---- Active Navigation Link ----
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('nav-link-active');
        }
    });

    // ---- Scroll Reveal ----
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const top = el.getBoundingClientRect().top;
            const trigger = window.innerHeight - 100;
            if (top < trigger) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // trigger on load

    // ---- Contact Form Validation ----
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name');
            const company = document.getElementById('company');
            const phone = document.getElementById('phone');
            const sector = document.getElementById('sector');
            const message = document.getElementById('message');

            let valid = true;
            const fields = [name, company, phone, message];

            // Reset
            fields.forEach(f => {
                if (f) f.style.borderColor = '';
            });

            if (name && !name.value.trim()) {
                name.style.borderColor = '#ef4444';
                valid = false;
            }
            if (message && !message.value.trim()) {
                message.style.borderColor = '#ef4444';
                valid = false;
            }

            if (valid) {
                const btn = contactForm.querySelector('button[type="submit"]');
                if (btn) {
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span> Enviando...';
                    btn.disabled = true;

                    setTimeout(() => {
                        btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> ¡Mensaje Enviado!';
                        btn.classList.remove('bg-primary');
                        btn.classList.add('bg-green-600');

                        setTimeout(() => {
                            btn.innerHTML = originalHTML;
                            btn.disabled = false;
                            btn.classList.remove('bg-green-600');
                            btn.classList.add('bg-primary');
                            contactForm.reset();
                        }, 2500);
                    }, 1500);
                }
            }
        });
    }

    // ---- Smooth Scroll for Anchors ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                }
            }
        });
    });

});
