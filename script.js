/**
 * Anand Sagar - Materials Science Academic Portfolio
 * Interactive Features & Performance Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modular elements
  initThemeSwitcher();
  initNavbarScroll();
  initMobileMenu();
  initMolecularCanvas();
  initStatsCounter();
  initContactForm();
});

/* ==========================================================================
   1. SMART THEME CUSTOMIZER (DARK/LIGHT MODE)
   ========================================================================== */
function initThemeSwitcher() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('theme');
  
  // Apply saved theme or fall back to system preferences
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateToggleIcon(currentTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', initialTheme);
    updateToggleIcon(initialTheme);
  }

  // Toggle button event listener
  themeToggleBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let targetTheme = theme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
    updateToggleIcon(targetTheme);
  });

  function updateToggleIcon(theme) {
    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun';
      themeToggleBtn.title = 'Switch to light mode';
    } else {
      icon.className = 'fa-solid fa-moon';
      themeToggleBtn.title = 'Switch to dark mode';
    }
  }
}

/* ==========================================================================
   2. STICKY NAVBAR, PROGRESS BAR & ACTIVE SECTIONS
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scroll-progress-bar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // 1. Sticky Navbar scroll class
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // 2. Reading Progress bar calculation
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const scrolledPercentage = (scrollY / totalHeight) * 100;
      progressBar.style.width = scrolledPercentage + '%';
    }

    // 3. Highlight current active section in nav menu
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }

    // 4. Scroll To Top Button visibility
    if (scrollY > 500) {
      scrollTopBtn.style.opacity = '1';
      scrollTopBtn.style.pointerEvents = 'all';
    } else {
      scrollTopBtn.style.opacity = '0';
      scrollTopBtn.style.pointerEvents = 'none';
    }
  });

  // Smooth scroll helper for active states
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close mobile menu if active
      const navMenu = document.getElementById('nav-menu');
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        document.getElementById('mobile-menu-btn').querySelector('i').className = 'fa-solid fa-bars';
      }
    });
  });
}

/* ==========================================================================
   3. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  if (!mobileMenuBtn || !navMenu) return;

  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Toggle bars and x icon
    const icon = mobileMenuBtn.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });
}

/* ==========================================================================
   4. MOLECULAR CANVAS LATTICE SIMULATION (PERFORMANT)
   ========================================================================== */
function initMolecularCanvas() {
  const canvas = document.getElementById('molecular-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;

  const particles = [];
  // Reduce density on smaller mobile screens for extreme rendering efficiency
  const particleCount = width < 768 ? 35 : 75;
  const connectionDistance = 110;
  
  // Track mouse coordinates
  const mouse = {
    x: null,
    y: null,
    radius: 150 // Pull strength radius
  };

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45; // Gentle float speed
      this.vy = (Math.random() - 0.5) * 0.45;
      this.size = Math.random() * 2.5 + 1.5; // Atom size
    }

    draw() {
      // Get HSL tailored variables from stylesheet using standard colors
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.fillStyle = isDark ? 'rgba(88, 166, 255, 0.65)' : 'rgba(12, 68, 124, 0.45)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    update() {
      // Float drift animation
      this.x += this.vx;
      this.y += this.vy;

      // Handle canvas borders wrap bounce
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Magnetic pull to mouse cursor
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= dx * force * 0.02; // Soft pull factor
          this.y -= dy * force * 0.02;
        }
      }
    }
  }

  // Populate network
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Mouse interactivity triggers
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Molecular network draw tick
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connecting lattices (bonds)
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bondColor = isDark ? 'rgba(52, 211, 153, 0.08)' : 'rgba(15, 110, 86, 0.06)';

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          // Dynamic alpha based on bond proximity
          const alpha = (1 - (dist / connectionDistance)) * 0.85;
          ctx.strokeStyle = isDark ? `rgba(88, 166, 255, ${alpha * 0.09})` : `rgba(12, 68, 124, ${alpha * 0.08})`;
          ctx.lineWidth = alpha * 1.2;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Draw virtual lines connecting mouse to nearby nodes
      if (mouse.x !== null && mouse.y !== null) {
        const p = particles[i];
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius - 20) {
          const alpha = (1 - (dist / (mouse.radius - 20))) * 0.65;
          ctx.strokeStyle = isDark ? `rgba(179, 136, 255, ${alpha * 0.15})` : `rgba(124, 77, 255, ${alpha * 0.12})`;
          ctx.lineWidth = alpha * 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // Handle responsiveness resize
  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationFrameId);
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    
    // Repopulate coordinates within boundaries
    particles.length = 0;
    const newCount = width < 768 ? 35 : 75;
    for (let i = 0; i < newCount; i++) {
      particles.push(new Particle());
    }
    animate();
  });

  animate();
}

/* ==========================================================================
   5. STATS GRID SMOOTH INCREMENTAL COUNTER
   ========================================================================= */
function initStatsCounter() {
  const statsSection = document.getElementById('stats-bar');
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statsSection || statNumbers.length === 0) return;

  let animated = false;

  const observerOptions = {
    root: null,
    threshold: 0.15 // Trigger when stats section is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        startCounting();
        animated = true;
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observer.observe(statsSection);

  function startCounting() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      const duration = 1200; // Counter animation speed in ms
      const stepTime = Math.max(Math.floor(duration / target), 30);
      
      let current = 0;
      const timer = setInterval(() => {
        current += 1;
        stat.textContent = current;
        if (current >= target) {
          stat.textContent = target + (target === 2 ? '+' : ''); // Add project offset
          clearInterval(timer);
        }
      }, stepTime);
    });
  }
}

/* ==========================================================================
   6. CONTACT FORM VALIDATION & INTERACTIVE TOAST SUCCESS
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast-success');
  const toastCloseBtn = document.getElementById('toast-close-btn');
  if (!form) return;

  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const messageInput = document.getElementById('form-message');
  
  const submitBtn = document.getElementById('form-submit-btn');
  const submitText = document.getElementById('submit-btn-text');
  const submitLoader = document.getElementById('submit-btn-loader');

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent standard page redirects

    // 1. Run basic validation audits
    let isFormValid = true;

    if (nameInput.value.trim() === '') {
      setErrorFor(nameInput);
      isFormValid = false;
    } else {
      setSuccessFor(nameInput);
    }

    if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value.trim())) {
      setErrorFor(emailInput);
      isFormValid = false;
    } else {
      setSuccessFor(emailInput);
    }

    if (messageInput.value.trim() === '') {
      setErrorFor(messageInput);
      isFormValid = false;
    } else {
      setSuccessFor(messageInput);
    }

    // 2. Submit form processes
    if (isFormValid) {
      // Toggle button visual loading states
      submitBtn.disabled = true;
      submitText.style.display = 'none';
      submitLoader.style.display = 'inline-block';

      // Simulate a robust form response delay (Web3Forms/Formspree replication)
      setTimeout(() => {
        // Reset loader visual states
        submitBtn.disabled = false;
        submitText.style.display = 'inline';
        submitLoader.style.display = 'none';

        // Clear input form fields
        form.reset();
        removeValidationStates();

        // 3. Render elegant success toast notice
        showToast();
      }, 1500);
    }
  });

  // Dynamic input keyboard listeners to remove error markers when corrected
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        if (input.type === 'email') {
          if (isValidEmail(input.value.trim())) {
            setSuccessFor(input);
          }
        } else {
          setSuccessFor(input);
        }
      }
    });
  });

  // Close toast event listeners
  if (toastCloseBtn) {
    toastCloseBtn.addEventListener('click', hideToast);
  }

  function showToast() {
    toast.classList.add('show');
    // Auto collapse notification card after 6 seconds
    setTimeout(hideToast, 6000);
  }

  function hideToast() {
    toast.classList.remove('show');
  }

  function setErrorFor(input) {
    const formGroup = input.parentElement;
    formGroup.classList.add('invalid');
  }

  function setSuccessFor(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('invalid');
  }

  function removeValidationStates() {
    [nameInput, emailInput, messageInput].forEach(input => {
      input.parentElement.classList.remove('invalid');
    });
  }

  function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
