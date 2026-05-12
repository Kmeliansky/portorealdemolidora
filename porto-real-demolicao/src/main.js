/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar ícones do Lucide
    lucide.createIcons();

    // Menu Mobile
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Header Scroll Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('py-2', 'bg-white', 'shadow-md');
            header.classList.remove('py-4', 'bg-white/90', 'backdrop-blur-sm');
        } else {
            header.classList.remove('py-2', 'bg-white', 'shadow-md');
            header.classList.add('py-4', 'bg-white/90', 'backdrop-blur-sm');
        }
    });

    // Modal Logic
    const ctaModal = document.getElementById('cta-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const ctaButtons = document.querySelectorAll('.cta-button');

    function openModal() {
        ctaModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        ctaModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    ctaButtons.forEach(btn => btn.addEventListener('click', openModal));
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Cookie Banner Logic
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const closeCookieBannerBtn = document.getElementById('close-cookie-banner');

    if (!localStorage.getItem('cookies-accepted')) {
        setTimeout(() => {
            cookieBanner.classList.remove('hidden');
        }, 2000);
    }

    function hideCookieBanner() {
        cookieBanner.classList.add('hidden');
        localStorage.setItem('cookies-accepted', 'true');
    }

    acceptCookiesBtn.addEventListener('click', hideCookieBanner);
    closeCookieBannerBtn.addEventListener('click', hideCookieBanner);

    // Form Submission Logic
    const forms = document.querySelectorAll('#main-form, #modal-form');
    const WHATSAPP_NUMBER = '5511992941268';
    const WEBHOOK_URL = ''; // INSIRA O LINK DO N8N AQUI

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                nome: formData.get('nome'),
                email: formData.get('email'),
                whatsapp: formData.get('whatsapp'),
                pageUrl: window.location.href,
                timestamp: new Date().toISOString()
            };

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // UI Feedback
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Enviando...';
            lucide.createIcons();

            try {
                // 1. Enviar para Webhook (se houver URL)
                if (WEBHOOK_URL) {
                    await fetch(WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                }

                // 2. Preparar mensagem do WhatsApp
                const message = `Olá! Acabei de solicitar um orçamento no site.\n\n` +
                                `*Dados do Formulário*:\n` +
                                `• Nome: ${data.nome}\n` +
                                `• E-mail: ${data.email}\n` +
                                `• WhatsApp: ${data.whatsapp}\n\n` +
                                `Origem: ${data.pageUrl}`;
                
                const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

                // 3. Redirecionar
                window.location.href = whatsappUrl;

            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                alert('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                lucide.createIcons();
            }
        });
    });

    // Iniciar animações simples ao carregar
    const animatedItems = document.querySelectorAll('.animate-fade-in-left');
    animatedItems.forEach(item => {
        item.style.opacity = '1';
    });
});
