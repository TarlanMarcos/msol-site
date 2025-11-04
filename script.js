// Função para exibir notificações
function showNotification(message, type) {
  let notification = document.getElementById('custom-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'custom-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateX(120%);
      transition: transform 0.3s ease-out;
    `;
    document.body.appendChild(notification);
  }

  notification.style.backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
  notification.textContent = message;

  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);

  setTimeout(() => {
    notification.style.transform = 'translateX(120%)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== FORMULÁRIO DE CONTATO → WHATSAPP =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    const formData = new FormData(contactForm);
    const name = formData.get('name') || 'Cliente';
    const email = formData.get('email') || '';
    const phone = formData.get('phone') || '';
    const service = formData.get('service') || '';
    const message = formData.get('message') || '';

    const serviceText = {
      'rural': 'Rural',
      'residencial': 'Residencial Urbano',
      'comercial': 'Comercial',
      'industrial': 'Industrial'
    }[service] || service;

    let msg = `Olá! Recebi uma nova solicitação de orçamento pelo site:\n\n`;
    msg += `*Nome:* ${name}\n`;
    if (email) msg += `*E-mail:* ${email}\n`;
    if (phone) msg += `*Telefone/WhatsApp:* ${phone}\n`;
    if (service) msg += `*Tipo de projeto:* ${serviceText}\n`;
    if (message) msg += `*Mensagem:* ${message}\n`;

    const whatsappNumber = '5546920003297'; // (46) 92000-3297
    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

    window.open(whatsappUrl, '_blank');

    showNotification("Redirecionando para o WhatsApp...", "success");
    contactForm.reset();

    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }, 1000);
  });
}

// ===== AJUSTE DINÂMICO DO PADDING-TOP PARA HEADER FIXO =====
function updateBodyPadding() {
  const header = document.querySelector('header');
  if (header) {
    const headerHeight = header.offsetHeight;
    document.body.style.paddingTop = `${headerHeight}px`;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  updateBodyPadding();
  window.addEventListener('resize', updateBodyPadding);
  window.addEventListener('scroll', updateBodyPadding); // atualiza ao rolar (caso o header mude de altura)

  // ===== NAVEGAÇÃO SUAVE =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== HEADER SCROLL EFFECT =====
  const header = document.querySelector('header');
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ===== MENU MOBILE =====
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.querySelector('nav ul');
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function() {
      menu.classList.toggle('active');
      menuToggle.classList.toggle('active');
      const spans = menuToggle.querySelectorAll('span');
      if (menuToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });

    document.addEventListener('click', function(e) {
      if (!menuToggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // ===== BOTÃO VOLTAR AO TOPO =====
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== ANIMAÇÕES DE SCROLL =====
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.servico, .projeto, .depoimento, .feature').forEach(el => observer.observe(el));

  // ===== NAVEGAÇÃO ATIVA =====
  const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');
  window.addEventListener('scroll', function() {
    let current = '';
    const scrollPosition = window.pageYOffset + 200;
    document.querySelectorAll('section[id]').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ===== CONTADOR ANIMADO =====
  const stats = document.querySelectorAll('.stat-number');
  let statsAnimated = false;
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateStats();
      }
    });
  }, { threshold: 0.5 });
  if (stats.length > 0) {
    statsObserver.observe(stats[0].closest('.hero-stats'));
  }

  function animateStats() {
    stats.forEach(stat => {
      const target = parseInt(stat.textContent.replace(/\D/g, ''));
      const suffix = stat.textContent.replace(/\d/g, '');
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = Math.floor(current) + suffix;
      }, 40);
    });
  }

  // ===== LAZY LOADING PARA IMAGENS =====
  const images = document.querySelectorAll('img[src]');
  const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '1';
        img.style.transition = 'opacity 0.3s ease';
        imageObserver.unobserve(img);
      }
    });
  });
  images.forEach(img => imageObserver.observe(img));

  // ===== EFEITO PARALLAX SUAVE =====
  const heroBackground = document.querySelector('.hero-background');
  if (heroBackground) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      heroBackground.style.transform = `translateY(${rate}px)`;
    });
  }

  // ===== TOOLTIP PARA BOTÕES =====
  document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', function() {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = this.getAttribute('data-tooltip');
      tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(tooltip);
      const rect = this.getBoundingClientRect();
      tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
      tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
      setTimeout(() => tooltip.style.opacity = '1', 10);
      this.addEventListener('mouseleave', () => tooltip.remove(), { once: true });
    });
  });

  // ===== ACESSIBILIDADE =====
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('active')) {
      menu.classList.remove('active');
      menuToggle.classList.remove('active');
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
});
