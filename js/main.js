/**
 * Hardhik Sai — AI Analyst Portfolio Website Logic
 * Features:
 * 1. Interactive Neural Canvas visualizer
 * 2. Sticky Navbar with backdrop blur & Active Scrollspy
 * 3. Mobile drawer menu
 * 4. Project tab filtering
 * 5. Case study modal viewer with deep project architecture breakdowns
 * 6. Contact form validation, dynamic states, & submission
 * 7. Counter animation for stats
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initNeuralCanvas();
  initProjectFilters();
  initCaseStudyModal();
  initContactForm();
  initStatsObserver();
});

/* ============================================================
   1. NAVBAR & SCROLLSPY
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Add scrolled class for glassmorphism
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scrollspy active link detection
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
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
}

/* ============================================================
   2. MOBILE DRAWER MENU
   ============================================================ */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function toggleMenu() {
    const isActive = drawer.classList.toggle('active');
    toggleBtn.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', isActive);
    drawer.setAttribute('aria-hidden', !isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  toggleBtn.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (drawer.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/* ============================================================
   3. INTERACTIVE REAL-TIME NEURAL NETWORK COMMAND CENTER
   ============================================================ */
function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth || 500;
    canvas.height = 200;
    createNodes();
  }

  // 4-Layer Architecture: Input -> Feature Extractor -> Model Reasoning -> Output
  const layerCounts = [4, 6, 5, 3];
  const layerColors = [
    { fill: '#38bdf8', glow: 'rgba(56, 189, 248, 0.6)' },   // Cyan Input
    { fill: '#a855f7', glow: 'rgba(168, 85, 247, 0.6)' },   // Purple Features
    { fill: '#818cf8', glow: 'rgba(129, 140, 248, 0.6)' },  // Indigo Reasoning
    { fill: '#ff6400', glow: 'rgba(255, 100, 0, 0.8)' }     // Amber Output
  ];

  let nodes = [];
  let signals = [];
  let mouse = { x: -1000, y: -1000, isOver: false };

  function createNodes() {
    nodes = [];
    const width = canvas.width;
    const height = canvas.height;
    const layerSpacing = width / (layerCounts.length + 1);

    layerCounts.forEach((count, lIndex) => {
      const baseX = layerSpacing * (lIndex + 1);
      const nodeSpacing = (height - 30) / (count + 1);
      const layerNodes = [];

      for (let i = 0; i < count; i++) {
        const baseY = 15 + nodeSpacing * (i + 1);
        layerNodes.push({
          baseX: baseX,
          baseY: baseY,
          x: baseX,
          y: baseY,
          vx: 0,
          vy: 0,
          radius: lIndex === 3 ? 5 : 4,
          color: layerColors[lIndex].fill,
          glow: layerColors[lIndex].glow,
          pulse: Math.random() * Math.PI * 2,
          layerIndex: lIndex
        });
      }
      nodes.push(layerNodes);
    });
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse interactivity on desktop
  if (!prefersReducedMotion && window.innerWidth > 768) {
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isOver = true;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.isOver = false;
    });
  }

  // Synaptic Data Packet generator
  function emitSignal() {
    if (prefersReducedMotion || nodes.length < 2) return;
    const startNode = nodes[0][Math.floor(Math.random() * nodes[0].length)];
    const targetNode = nodes[1][Math.floor(Math.random() * nodes[1].length)];
    signals.push({
      startX: startNode.x,
      startY: startNode.y,
      endX: targetNode.x,
      endY: targetNode.y,
      progress: 0,
      speed: 0.016 + Math.random() * 0.012,
      layerIndex: 0,
      color: Math.random() > 0.4 ? '#ff7a1a' : '#38bdf8'
    });
  }

  let signalInterval = setInterval(emitSignal, 360);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update node positions with subtle spring physics toward cursor
    nodes.forEach(layer => {
      layer.forEach(node => {
        if (!prefersReducedMotion) {
          node.pulse += 0.035;

          if (mouse.isOver) {
            const dx = mouse.x - node.baseX;
            const dy = mouse.y - node.baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
              const force = (90 - dist) / 90;
              node.x += (node.baseX + dx * force * 0.18 - node.x) * 0.1;
              node.y += (node.baseY + dy * force * 0.18 - node.y) * 0.1;
            } else {
              node.x += (node.baseX - node.x) * 0.1;
              node.y += (node.baseY - node.y) * 0.1;
            }
          } else {
            node.x += (node.baseX - node.x) * 0.1;
            node.y += (node.baseY - node.y) * 0.1;
          }
        }
      });
    });

    // 1. Draw Synapses (Synaptic weights)
    for (let l = 0; l < nodes.length - 1; l++) {
      const currentLayer = nodes[l];
      const nextLayer = nodes[l + 1];

      for (let i = 0; i < currentLayer.length; i++) {
        for (let j = 0; j < nextLayer.length; j++) {
          const n1 = currentLayer[i];
          const n2 = nextLayer[j];

          // Check if synapse is near cursor
          let alpha = 0.07;
          if (mouse.isOver) {
            const midX = (n1.x + n2.x) / 2;
            const midY = (n1.y + n2.y) / 2;
            const dist = Math.hypot(mouse.x - midX, mouse.y - midY);
            if (dist < 70) {
              alpha = 0.07 + (70 - dist) / 70 * 0.25;
            }
          }

          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // 2. Draw Synaptic Signals (Data Packets)
    if (!prefersReducedMotion) {
      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s];
        const speedMultiplier = mouse.isOver ? 1.3 : 1.0;
        sig.progress += sig.speed * speedMultiplier;

        const currentX = sig.startX + (sig.endX - sig.startX) * sig.progress;
        const currentY = sig.startY + (sig.endY - sig.startY) * sig.progress;

        ctx.beginPath();
        ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
        ctx.fillStyle = sig.color;
        ctx.shadowColor = sig.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (sig.progress >= 1) {
          if (sig.layerIndex < nodes.length - 2) {
            const nextLayerIndex = sig.layerIndex + 1;
            const currentNodes = nodes[nextLayerIndex];
            const nextNodes = nodes[nextLayerIndex + 1];
            const nextStart = currentNodes[Math.floor(Math.random() * currentNodes.length)];
            const nextTarget = nextNodes[Math.floor(Math.random() * nextNodes.length)];

            sig.startX = nextStart.x;
            sig.startY = nextStart.y;
            sig.endX = nextTarget.x;
            sig.endY = nextTarget.y;
            sig.progress = 0;
            sig.layerIndex = nextLayerIndex;
          } else {
            signals.splice(s, 1);
          }
        }
      }
    }

    // 3. Draw Nodes with soft pulsing aura
    nodes.forEach(layer => {
      layer.forEach(node => {
        const pulseOffset = prefersReducedMotion ? 0 : Math.sin(node.pulse) * 1.2;
        const currentR = Math.max(2, node.radius + pulseOffset);

        // Ambient node glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentR, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.glow;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Concentric precision ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentR + 3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(draw);
    }
  }

  draw();
  initCommandCenterLiveFeed();
}

/* Real-Time Terminal Activity & Pipeline Stage Synchronizer */
function initCommandCenterLiveFeed() {
  const terminalLog = document.getElementById('terminalLiveLog');
  const stages = [
    document.getElementById('flowStage1'),
    document.getElementById('flowStage2'),
    document.getElementById('flowStage3'),
    document.getElementById('flowStage4')
  ];

  const logs = [
    { text: '> initializing neural pipeline...', stage: 0 },
    { text: '> loading vision model (YOLO11)...', stage: 1 },
    { text: '> connecting Gemini multimodal engine...', stage: 2 },
    { text: '> inference pipeline ready ✓', stage: 3 }
  ];

  let currentLogIdx = 0;

  function cycleLiveLog() {
    if (!terminalLog) return;
    const logItem = logs[currentLogIdx];
    terminalLog.textContent = logItem.text;

    // Highlight active stage
    stages.forEach((stage, idx) => {
      if (stage) {
        if (idx === logItem.stage) {
          stage.classList.add('active');
        } else {
          stage.classList.remove('active');
        }
      }
    });

    currentLogIdx = (currentLogIdx + 1) % logs.length;
  }

  setInterval(cycleLiveLog, 2400);
}

/* ============================================================
   4. PROJECT TAB FILTERING
   ============================================================ */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category');
        if (filter === 'all' || (categories && categories.includes(filter))) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* ============================================================
   5. PROJECT CASE STUDY MODAL
   ============================================================ */
const projectCaseStudies = {
  'telegram-bot': {
    badge: 'APRIL 2025 • SERVERLESS AI BOT',
    title: 'Telegram AI Bot',
    image: 'images/telegram_ai_bot.png',
    subtitle: 'Multimodal AI assistant deployed on Vercel utilizing Google GenAI SDK for real-time document & image analysis.',
    overview: 'An AI-powered Telegram assistant designed to provide intelligent text-based responses, document summarization, and multimodal media analysis directly within Telegram chats.',
    problem: 'Users frequently need instant explanations, code debugging, and document summarization without switching contexts or opening separate AI web interfaces.',
    solution: 'Engineered a serverless asynchronous webhook architecture utilizing Google GenAI SDK to handle multi-format inputs (text, images, PDFs, code files) and deliver context-aware structured outputs.',
    capabilities: [
      'Multimodal analysis for images, PDFs, and code/text files',
      'AI-generated explanations, concise summaries, and context-aware answers',
      'Adaptive response formatting tailored to query type (code snippets, tables, bullet points)',
      'Asynchronous Telegram webhook processing with secure API key environment encapsulation'
    ],
    tech: ['Python', 'Google GenAI SDK', 'Telegram Bot API', 'Vercel', 'GitHub'],
    deployment: 'Deployed on Vercel with serverless function handlers and continuous integration from GitHub.',
    github: 'https://github.com/hardhiksai05'
  },
  'image-recognition': {
    badge: 'NOVEMBER 2025 • FULL-STACK COMPUTER VISION',
    title: 'AI Image Recognition System',
    image: 'images/ai_image_recognition.png',
    subtitle: 'Full-stack real-time image analysis & object monitoring system powered by YOLO11 and Gemini.',
    overview: 'An end-to-end full-stack computer vision system built to detect multiple objects in real time and enrich visual discoveries with deep contextual AI insights.',
    problem: 'Traditional object detection identifies bounding boxes but lacks semantic comprehension and contextual explanation of the scene.',
    solution: 'Integrated YOLO11 for high-speed object detection with Gemini for contextual reasoning, paired with a FastAPI backend and a responsive React frontend.',
    capabilities: [
      'Real-time image analysis with YOLO11 object bounding box detection',
      'Contextual insight generation using Google Gemini API',
      'Cloudinary media pipeline for asset ingestion and transformations',
      'Supabase database integration for image metadata and detection logs'
    ],
    tech: ['Python', 'FastAPI', 'React', 'YOLO', 'Gemini', 'Supabase', 'Cloudinary'],
    deployment: 'Backend and full-stack services deployed on Render cloud platform.',
    github: 'https://github.com/hardhiksai05'
  },
  'facial-emotion': {
    badge: 'OCTOBER 2025 • REAL-TIME VISION SYSTEM',
    title: 'Facial Emotion Detection System',
    image: 'images/facial_emotion_detection.png',
    subtitle: 'Real-time facial expression analysis utilizing DeepFace, TensorFlow, and OpenCV webcam pipeline.',
    overview: 'A real-time computer vision application that captures live webcam video, detects human faces, crops regions of interest, and classifies facial emotions dynamically.',
    problem: 'Raw facial emotion prediction from webcam streams often suffers from jitter, low confidence fluctuations, and erratic classification spikes.',
    solution: 'Designed an OpenCV processing pipeline with confidence threshold filtering and temporal moving-average smoothing to stabilize live emotion predictions.',
    capabilities: [
      'Classifies 7 distinct emotions: Happy, Sad, Angry, Fear, Surprise, Disgust, and Neutral',
      'Face detection and bounding box cropping',
      'Temporal smoothing and confidence filtering for stable output',
      'Live dashboard displaying detected faces, emotion probability scores, and real-time FPS'
    ],
    tech: ['Python', 'DeepFace', 'TensorFlow', 'OpenCV'],
    deployment: 'Local real-time computer vision execution engine running on Python environment.',
    github: 'https://github.com/hardhiksai05'
  }
};

function initCaseStudyModal() {
  const modal = document.getElementById('caseStudyModal');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalCloseBtn');
  const openBtns = document.querySelectorAll('.open-modal-btn');

  if (!modal || !modalBody) return;

  function openModal(projectId) {
    const data = projectCaseStudies[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      <div class="modal-header-badge">${data.badge}</div>
      <h3 class="modal-title">${data.title}</h3>
      <p class="modal-subtitle">${data.subtitle}</p>
      ${data.image ? `<img src="${data.image}" alt="${data.title}" class="modal-project-banner">` : ''}

      <div class="modal-section">
        <h4>Project Overview</h4>
        <p>${data.overview}</p>
      </div>

      <div class="modal-section">
        <h4>Problem Statement</h4>
        <p>${data.problem}</p>
      </div>

      <div class="modal-section">
        <h4>Engineered Solution</h4>
        <p>${data.solution}</p>
      </div>

      <div class="modal-section">
        <h4>AI Capabilities &amp; Key Features</h4>
        <ul>
          ${data.capabilities.map(cap => `<li>${cap}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-section">
        <h4>Technology Stack</h4>
        <div class="modal-tech-stack">
          ${data.tech.map(t => `<span class="tech-pill">${t}</span>`).join('')}
        </div>
      </div>

      <div class="modal-section">
        <h4>Deployment Architecture</h4>
        <p>${data.deployment}</p>
      </div>

      <div class="modal-actions">
        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn-primary">
          <svg class="icon-sm" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span>View on GitHub</span>
        </a>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      openModal(projectId);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ============================================================
   6. WORKING CONTACT FORM WITH SECURE SUBMISSION & FALLBACK
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('portfolioContactForm');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccessMessage');
  const errorMsg = document.getElementById('formErrorMessage');

  // Input validation helper
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function checkField(input, condition) {
    const group = input.closest('.form-group');
    if (!condition) {
      group.classList.add('has-error');
      return false;
    } else {
      group.classList.remove('has-error');
      return true;
    }
  }

  // Remove error on input change
  [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
    inp.addEventListener('input', () => {
      inp.closest('.form-group').classList.remove('has-error');
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide previous banners
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    // Validate inputs
    const isNameValid = checkField(nameInput, nameInput.value.trim().length > 0);
    const isEmailValid = checkField(emailInput, validateEmail(emailInput.value.trim()));
    const isSubjectValid = checkField(subjectInput, subjectInput.value.trim().length > 0);
    const isMsgValid = checkField(messageInput, messageInput.value.trim().length > 0);

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMsgValid) {
      return;
    }

    // Set Loading State
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const templateParams = {
      from_name: nameInput.value.trim(),
      from_email: emailInput.value.trim(),
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectInput.value.trim(),
      message: messageInput.value.trim(),
      reply_to: emailInput.value.trim(),
      'Reply-To': emailInput.value.trim()
    };

    try {
      // Send email directly through EmailJS
      const response = await emailjs.send(
        'service_ute8esh',
        'template_9fa18ml',
        templateParams,
        'pN62qsSYWGKTvAesY'
      );

      if (response && (response.status === 200 || response.text === 'OK')) {
        // Show Success banner only after confirmed submission
        successMsg.style.display = 'flex';
        errorMsg.style.display = 'none';
        form.reset();
      } else {
        throw new Error('EmailJS returned non-OK status');
      }
    } catch (err) {
      console.error('EmailJS submission error:', err);
      // Display error banner
      errorMsg.style.display = 'flex';
      successMsg.style.display = 'none';
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

/* ============================================================
   7. STATS OBSERVER (ANIMATION TRIGGER)
   ============================================================ */
function initStatsObserver() {
  const statsSection = document.querySelector('.verified-stats-grid');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statsSection.style.animation = 'fadeInUp 0.6s ease forwards';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}
