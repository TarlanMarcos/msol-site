// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
  
  // ===== NAVEGAÇÃO SUAVE =====
  // Seleciona todos os links com href começando com "#"
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
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Adiciona classe quando rola a página
    if (scrollTop > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
  });

  // ===== MENU MOBILE =====
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.querySelector('nav ul');
  
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function() {
      menu.classList.toggle('active');
      menuToggle.classList.toggle('active');
      
      // Anima as barras do hamburger
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
    
    // Fecha o menu ao clicar em um link
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
    
    // Fecha o menu ao clicar fora dele
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
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== ANIMAÇÕES DE SCROLL =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  }, observerOptions);
  
  // Observa elementos para animação
  const animatedElements = document.querySelectorAll('.servico, .projeto, .depoimento, .feature');
  animatedElements.forEach(el => observer.observe(el));

  // ===== NAVEGAÇÃO ATIVA =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');
  
  window.addEventListener('scroll', function() {
    let current = '';
    const scrollPosition = window.pageYOffset + 200;
    
    sections.forEach(section => {
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

  // ===== FORMULÁRIO DE CONTATO =====
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      
      // Desabilita o botão e mostra loading
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      
      try {
        // Coleta os dados do formulário
        const formData = new FormData(contactForm);
        const data = {
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          service: formData.get('service'),
          message: formData.get('message')
        };
        
        // Envia para a API
        const response = await fetch('/api/form-submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
          // Sucesso
          showNotification('Formulário enviado com sucesso! Entraremos em contato em breve.', 'success');
          contactForm.reset();
        } else {
          // Erro
          showNotification(result.error || 'Erro ao enviar formulário. Tente novamente.', 'error');
        }
        
      } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro de conexão. Verifique sua internet e tente novamente.', 'error');
      } finally {
        // Restaura o botão
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    });
    
    // Remove bordas vermelhas ao digitar
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
      input.addEventListener('input', function() {
        this.style.borderColor = '';
      });
    });
  }

  // ===== CONTADOR ANIMADO =====
  const stats = document.querySelectorAll('.stat-number');
  let statsAnimated = false;
  
  const statsObserver = new IntersectionObserver(function(entries) {
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
  
  const imageObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '100';
        img.style.transition = 'opacity 0.3s ease';
        
        img.onload = function() {
          img.style.opacity = '1';
        };
        
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
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
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
      
      this.addEventListener('mouseleave', function() {
        tooltip.remove();
      }, { once: true });
    });
  });

  // ===== PERFORMANCE: DEBOUNCE PARA SCROLL =====
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Aplica debounce aos eventos de scroll mais pesados
  const debouncedScrollHandler = debounce(function() {
    // Handlers de scroll que não precisam ser executados a cada frame
  }, 16); // ~60fps

  window.addEventListener('scroll', debouncedScrollHandler);

  // ===== ACESSIBILIDADE: NAVEGAÇÃO POR TECLADO =====
  document.addEventListener('keydown', function(e) {
    // ESC fecha o menu mobile
    if (e.key === 'Escape' && menu && menu.classList.contains('active')) {
      menu.classList.remove('active');
      menuToggle.classList.remove('active');
    }
    
    // Enter/Space ativa botões
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('btn')) {
      e.preventDefault();
      e.target.click();
    }
  });

  // ===== DETECÇÃO DE DISPOSITIVO MÓVEL =====
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    document.body.classList.add('mobile-device');
    
    // Desabilita efeitos pesados em dispositivos móveis
    const heavyAnimations = document.querySelectorAll('.parallax, .heavy-animation');
    heavyAnimations.forEach(el => el.style.transform = 'none');
  }

  // ===== PRELOADER (se necessário) =====
  window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Remove qualquer preloader se existir
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => preloader.remove(), 300);
    }
  });

  // ===== CONSOLE LOG PARA DEBUG =====
  console.log('🌞 M Sol Energia - Website carregado com sucesso!');
  console.log('📱 Dispositivo móvel:', isMobile);
  console.log('🎯 Elementos animados encontrados:', animatedElements.length);
});

// ===== FUNÇÕES UTILITÁRIAS =====

// Função para formatar números
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Função para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para validar telefone brasileiro
function isValidPhone(phone) {
  const phoneRegex = /^(\(?\d{2}\)?\s?)?(\d{4,5})-?(\d{4})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Função para scroll suave para elemento específico
function scrollToElement(elementId, offset = 100) {
  const element = document.getElementById(elementId);
  if (element) {
    const headerHeight = document.querySelector('header').offsetHeight;
    const targetPosition = element.offsetTop - headerHeight - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// Função para mostrar notificação
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
  `;
  
  // Cores baseadas no tipo
  const colors = {
    info: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  };
  
  notification.style.backgroundColor = colors[type] || colors.info;
  
  document.body.appendChild(notification);
  
  // Anima a entrada
  setTimeout(() => notification.style.transform = 'translateX(0)', 10);
  
  // Remove após 5 segundos
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Exporta funções para uso global se necessário
window.MSolUtils = {
  formatNumber,
  isValidEmail,
  isValidPhone,
  scrollToElement,
  showNotification
};

