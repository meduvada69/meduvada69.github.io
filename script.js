$(document).ready(function () {

  /* ── CUSTOM CURSOR ── */
  const $cursor = $('#cursor');
  const $ring   = $('#cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  $(document).on('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    $cursor.css({ left: mouseX, top: mouseY });
  });

  // Smooth lag on ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    $ring.css({ left: ringX, top: ringY });
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Light/Dark toggle
  $('nav').append('<button id="theme-toggle">☀ Light</button>');
  $('#theme-toggle').on('click', function() {
    $('html').toggleClass('light-mode');
    const isLight = $('html').hasClass('light-mode');
    $(this).text(isLight ? '☾ Dark' : '☀ Light');
  });

  // Scale cursor on hover over links/buttons
  $('a, button').on('mouseenter', function () {
    $cursor.css({ transform: 'translate(-50%,-50%) scale(2)', opacity: 0.5 });
    $ring.css({ transform: 'translate(-50%,-50%) scale(1.5)', opacity: 0.4 });
  }).on('mouseleave', function () {
    $cursor.css({ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 });
    $ring.css({ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 });
  });


  /* ── PARTICLE CANVAS ── */
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  $(window).on('resize', resizeCanvas);

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '0,245,255' : '123,47,255'
    };
  }

  for (let i = 0; i < 120; i++) particles.push(createParticle());

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
        Object.assign(p, createParticle());
      }
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();


  /* ── NAVBAR SCROLL EFFECT ── */
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 60) {
      $('#navbar').addClass('scrolled');
    } else {
      $('#navbar').removeClass('scrolled');
    }
    revealOnScroll();
  });


  /* ── SCROLL REVEAL ── */
  function revealOnScroll() {
    const windowBottom = $(window).scrollTop() + $(window).height();

    // Timeline items
    $('.tl-item').each(function () {
      const itemTop = $(this).offset().top;
      if (windowBottom > itemTop + 60) {
        $(this).addClass('visible');
      }
    });

    // Feature cards with stagger
    $('.feat-card').each(function (i) {
      const itemTop = $(this).offset().top;
      if (windowBottom > itemTop + 40) {
        const $card = $(this);
        setTimeout(function () {
          $card.addClass('visible');
        }, i * 80);
      }
    });

    // Team cards
    $('.team-card').each(function (i) {
      const itemTop = $(this).offset().top;
      if (windowBottom > itemTop + 40) {
        const $card = $(this);
        setTimeout(function () {
          $card.addClass('visible');
        }, i * 120);
      }
    });
  }

  // Run once on load
  revealOnScroll();


  /* ── SMOOTH NAV SCROLL ── */
  $('.nav-links a, .hero-btns a').on('click', function (e) {
    const href = $(this).attr('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = $(href);
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - 70
        }, 700, 'swing');
      }
    }
  });


  /* ── ACTIVE NAV LINK ── */
  $(window).on('scroll', function () {
    const scrollPos = $(this).scrollTop() + 120;
    $('section').each(function () {
      const id    = $(this).attr('id');
      const top   = $(this).offset().top;
      const bottom = top + $(this).outerHeight();
      if (scrollPos >= top && scrollPos < bottom) {
        $('.nav-links a').removeClass('active');
        $(`.nav-links a[href="#${id}"]`).addClass('active');
      }
    });
  });


  /* ── LIVE YEAR IN NAV STATUS ── */
  const year = new Date().getFullYear();
  $('.nav-status').html(`<span class="status-dot"></span> LIVE — ${year}`);


  /* ── FEATURE CARD TILT ON HOVER ── */
  $('.feat-card').on('mousemove', function (e) {
    const rect  = this.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width  / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    $(this).css('transform', `translateY(-4px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`);
  }).on('mouseleave', function () {
    $(this).css('transform', '');
  });


  /* ── TYPING EFFECT IN HERO EYEBROW ── */
  const original = $('.hero-eyebrow').text();
  $('.hero-eyebrow').text('');
  setTimeout(function () {
    let i = 0;
    const interval = setInterval(function () {
      $('.hero-eyebrow').text(original.slice(0, i));
      i++;
      if (i > original.length) clearInterval(interval);
    }, 40);
  }, 500);

});
