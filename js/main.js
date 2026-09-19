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

    // ---- Active Navigation Link (URLs limpias y con .html) ----
    // "/servicios", "/servicios.html" y "servicios.html" → "servicios"; "/" e "index.html" → "index"
    const pageKey = (path) => (path || '').split(/[?#]/)[0].split('/').pop().replace(/\.html$/, '') || 'index';
    const currentPage = pageKey(window.location.pathname);
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (pageKey(link.getAttribute('href')) === currentPage) {
            link.classList.add('nav-link-active');
        }
    });

    // ---- Año del copyright ----
    // El HTML trae un año escrito para quien navegue sin JS; aquí solo se actualiza.
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

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

    // ---- Contact Form: WhatsApp + Email (sin backend) ----
    const WHATSAPP_NUMBER = '56948004882';
    const CONTACT_EMAIL = 'contacto@ingelyv.cl';

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

            if (!valid) return;

            const nameVal = name ? name.value.trim() : '';
            const companyVal = company ? company.value.trim() : '';
            const phoneVal = phone ? phone.value.trim() : '';
            const sectorText = sector && sector.value
                ? sector.options[sector.selectedIndex].text
                : 'No especificado';
            const messageVal = message ? message.value.trim() : '';

            const text =
                'Nueva consulta - Sitio web INGELYV\n\n' +
                `Nombre: ${nameVal}\n` +
                (companyVal ? `Empresa: ${companyVal}\n` : '') +
                (phoneVal ? `Teléfono: ${phoneVal}\n` : '') +
                `Servicio: ${sectorText}\n\n` +
                `Mensaje:\n${messageVal}`;

            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
            const mailUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Consulta web - ' + nameVal)}&body=${encodeURIComponent(text)}`;

            window.open(waUrl, '_blank', 'noopener');

            // Respaldo visible por si el navegador bloquea la ventana (sin innerHTML con datos del usuario)
            let feedback = document.getElementById('contact-feedback');
            if (!feedback) {
                feedback = document.createElement('div');
                feedback.id = 'contact-feedback';
                feedback.setAttribute('role', 'status');
                feedback.className = 'mt-4 p-4 rounded-sm bg-green-950/60 border border-green-700/50 text-sm text-gray-300';
                contactForm.appendChild(feedback);
            }
            feedback.textContent = '';

            const title = document.createElement('p');
            title.className = 'font-bold text-white mb-1';
            title.textContent = `¡Gracias, ${nameVal}! Tu consulta está lista.`;

            const hint = document.createElement('p');
            hint.className = 'text-xs mb-3';
            hint.textContent = 'Si WhatsApp no se abrió automáticamente, usa uno de estos enlaces:';

            const links = document.createElement('div');
            links.className = 'flex flex-wrap gap-2';
            [
                { href: waUrl, label: 'Abrir WhatsApp', cls: 'bg-green-600 hover:bg-green-500', blank: true },
                { href: mailUrl, label: 'Enviar por email', cls: 'bg-white/10 hover:bg-white/20', blank: false }
            ].forEach(({ href, label, cls, blank }) => {
                const a = document.createElement('a');
                a.href = href;
                a.textContent = label;
                a.className = `inline-flex items-center px-3 py-1.5 ${cls} text-white rounded-sm font-bold text-xs no-underline transition-colors`;
                if (blank) {
                    a.target = '_blank';
                    a.rel = 'noopener';
                }
                links.appendChild(a);
            });

            feedback.append(title, hint, links);
            contactForm.reset();
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
