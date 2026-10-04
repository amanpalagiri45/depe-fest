/**
 * AIMEX 2026 - Interactive AI Neural Synapse Background
 * Developed for Department of Artificial Intelligence and Machine Learning
 * Renders an animated, interactive neural network particle system in the Hero section.
 */
(function () {
  'use strict';

  function initNeuralBackground() {
    const background = document.querySelector('.site-bg');
    if (!background) return;

    let canvas = document.getElementById('neuralCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'neuralCanvas';
      canvas.className = 'neural-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      background.append(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let animationId = null;
    let isVisible = true;

    // Mouse coordinates relative to the fixed page background
    const mouse = { x: -1000, y: -1000, active: false, radius: 150 };

    // Configuration
    const NODE_COUNT_BASE = 55;
    let nodes = [];
    let pulses = [];

    function resize() {
      const rect = background.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initNodes();
    }

    function initNodes() {
      nodes = [];
      pulses = [];
      const count = Math.min(Math.floor((width * height) / 12000), 75) || NODE_COUNT_BASE;

      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.65,
          vy: (Math.random() - 0.5) * 0.65,
          radius: Math.random() * 2.2 + 1.2,
          baseRadius: Math.random() * 2.2 + 1.2,
          phase: Math.random() * Math.PI * 2,
          isSpecial: Math.random() < 0.25 // Highlighted AI neuron
        });
      }
    }

    // Spawn synaptic data packet traveling along an edge
    function maybeSpawnPulse(n1, n2) {
      if (pulses.length > 12) return;
      if (Math.random() < 0.008) {
        pulses.push({
          from: n1,
          to: n2,
          progress: 0,
          speed: 0.02 + Math.random() * 0.02,
          size: 2.5
        });
      }
    }

    function isDarkMode() {
      return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    function getPalette() {
      if (isDarkMode()) {
        return {
          nodeDefault: 'rgba(91, 139, 255, 0.75)',
          nodeSpecial: 'rgba(16, 231, 157, 0.95)',
          nodeGlow: 'rgba(16, 231, 157, 0.35)',
          linePrimary: '16, 231, 157',
          lineSecondary: '91, 139, 255',
          pulse: 'rgba(255, 255, 255, 0.95)',
          mouseLine: '16, 231, 157'
        };
      } else {
        return {
          nodeDefault: 'rgba(26, 60, 200, 0.75)',
          nodeSpecial: 'rgba(212, 175, 55, 0.95)',
          nodeGlow: 'rgba(26, 60, 200, 0.25)',
          linePrimary: '26, 60, 200',
          lineSecondary: '212, 175, 55',
          pulse: 'rgba(255, 255, 255, 0.95)',
          mouseLine: '212, 175, 55'
        };
      }
    }

    function updateAndDraw() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      const pal = getPalette();
      const maxDist = width < 768 ? 95 : 125;
      const mouseDist = 140;

      // Update & Draw Connections
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];

        // Move nodes
        n1.x += n1.vx;
        n1.y += n1.vy;

        // Bounce walls smoothly
        if (n1.x < 0 || n1.x > width) n1.vx *= -1;
        if (n1.y < 0 || n1.y > height) n1.vy *= -1;

        // Connect to other nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.32;
            const lineColor = n1.isSpecial || n2.isSpecial ? pal.linePrimary : pal.lineSecondary;

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            maybeSpawnPulse(n1, n2);
          }
        }

        // Connect to mouse if nearby
        if (mouse.active) {
          const mdx = n1.x - mouse.x;
          const mdy = n1.y - mouse.y;
          const mDist = Math.hypot(mdx, mdy);

          if (mDist < mouseDist) {
            const mAlpha = (1 - mDist / mouseDist) * 0.75;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${pal.mouseLine}, ${mAlpha})`;
            ctx.lineWidth = 1.3;
            ctx.stroke();

            // Subtle attraction force towards mouse
            n1.x -= (mdx / mDist) * 0.45;
            n1.y -= (mdy / mDist) * 0.45;
          }
        }

        // Draw node
        n1.phase += 0.03;
        const currentRadius = n1.baseRadius + Math.sin(n1.phase) * 0.5;

        ctx.beginPath();
        ctx.arc(n1.x, n1.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = n1.isSpecial ? pal.nodeSpecial : pal.nodeDefault;
        ctx.fill();

        if (n1.isSpecial) {
          ctx.beginPath();
          ctx.arc(n1.x, n1.y, currentRadius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = pal.nodeGlow;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Update & Draw Synaptic Data Pulses
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const px = pulse.from.x + (pulse.to.x - pulse.from.x) * pulse.progress;
        const py = pulse.from.y + (pulse.to.y - pulse.from.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(px, py, pulse.size, 0, Math.PI * 2);
        ctx.fillStyle = pal.pulse;
        ctx.shadowColor = pal.nodeSpecial;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationId = requestAnimationFrame(updateAndDraw);
    }

    // Mouse Listeners
    window.addEventListener('mousemove', e => {
      const rect = background.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    window.addEventListener('blur', () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    });

    // Touch support for tablets & mobile
    window.addEventListener('touchmove', e => {
      if (e.touches.length > 0) {
        const rect = background.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      mouse.active = false;
    });

    // Performance & Lifecycle
    window.addEventListener('resize', resize, { passive: true });

    // Pause the animation when the page background is offscreen
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animationId) {
            animationId = requestAnimationFrame(updateAndDraw);
          } else if (!isVisible && animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        });
      }, { threshold: 0.1 });
      observer.observe(background);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isVisible = false;
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      } else {
        isVisible = true;
        if (!animationId) {
          animationId = requestAnimationFrame(updateAndDraw);
        }
      }
    });

    // Init
    resize();
    animationId = requestAnimationFrame(updateAndDraw);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNeuralBackground);
  } else {
    initNeuralBackground();
  }
})();
