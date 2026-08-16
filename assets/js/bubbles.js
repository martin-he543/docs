(function () {
  "use strict";

  // Floating, gooey bubble background - loosely inspired by the interactive
  // blob animation on https://henrikkvamme.no. Two stacked canvases: a
  // blurred + alpha-thresholded "goo" layer that makes overlapping bubbles
  // merge into blobs, and a crisp "shine" layer drawn on top for glossy
  // specular highlights (the shine layer must stay outside the goo filter or
  // the blur/threshold would smear the highlights into the blob).

  var STORAGE_KEY = "bubbles-enabled";
  var HUES = [212, 258, 152, 340, 32, 190, 280]; // blue, violet, green, pink, amber, cyan, purple

  var gooCanvas, shineCanvas, gooCtx, shineCtx, toggle;
  var bubbles = [];
  var width = 0, height = 0, dpr = 1;
  var mouse = { x: -9999, y: -9999, active: false };
  var running = false;
  var rafId = null;
  var lastT = null;

  function rand(min, max) { return min + Math.random() * (max - min); }

  function bubbleCount() {
    var area = window.innerWidth * window.innerHeight;
    return Math.max(10, Math.min(26, Math.round(area / 55000)));
  }

  function makeBubble() {
    var r = rand(18, 58);
    return {
      x: rand(0, width),
      y: rand(0, height),
      r: r,
      hue: HUES[Math.floor(Math.random() * HUES.length)],
      sat: rand(55, 75),
      light: rand(55, 68),
      alpha: rand(0.5, 0.8),
      vx: rand(-6, 6),
      vy: -rand(10, 26),
      phase: rand(0, Math.PI * 2),
      phaseSpeed: rand(0.4, 0.9),
      driftAmp: rand(10, 28)
    };
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    [gooCanvas, shineCanvas].forEach(function (c) {
      c.width = width * dpr;
      c.height = height * dpr;
      c.style.width = width + "px";
      c.style.height = height + "px";
    });
    gooCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    shineCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seedBubbles() {
    var count = bubbleCount();
    bubbles = [];
    for (var i = 0; i < count; i++) bubbles.push(makeBubble());
  }

  function step(dt, t) {
    var repelRadius = 130;
    for (var i = 0; i < bubbles.length; i++) {
      var b = bubbles[i];

      if (mouse.active) {
        var dx = b.x - mouse.x;
        var dy = b.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < repelRadius) {
          var force = (1 - dist / repelRadius) * 90;
          b.vx += (dx / dist) * force * dt;
          b.vy += (dy / dist) * force * dt;
        }
      }

      // gentle drift back toward a calm float, so mouse pushes decay away
      b.vx += (0 - b.vx) * 0.6 * dt;
      b.x += b.vx * dt + Math.sin(t * b.phaseSpeed + b.phase) * b.driftAmp * dt;
      b.y += b.vy * dt;

      if (b.x < -b.r) b.x = width + b.r;
      if (b.x > width + b.r) b.x = -b.r;
      if (b.y < -b.r * 2) {
        b.y = height + b.r;
        b.x = rand(0, width);
        b.vy = -rand(10, 26);
      }
    }
  }

  function draw() {
    gooCtx.clearRect(0, 0, width, height);
    shineCtx.clearRect(0, 0, width, height);

    for (var i = 0; i < bubbles.length; i++) {
      var b = bubbles[i];

      gooCtx.beginPath();
      gooCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      gooCtx.fillStyle = "hsla(" + b.hue + ", " + b.sat + "%, " + b.light + "%, " + b.alpha + ")";
      gooCtx.fill();

      var hx = b.x - b.r * 0.32;
      var hy = b.y - b.r * 0.38;
      var hr = b.r * 0.55;
      var grad = shineCtx.createRadialGradient(hx, hy, 0, hx, hy, hr);
      grad.addColorStop(0, "rgba(255,255,255,0.55)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      shineCtx.beginPath();
      shineCtx.arc(hx, hy, hr, 0, Math.PI * 2);
      shineCtx.fillStyle = grad;
      shineCtx.fill();
    }
  }

  function frame(t) {
    if (!running) return;
    if (lastT === null) lastT = t;
    var dt = Math.min((t - lastT) / 1000, 0.05);
    lastT = t;
    step(dt, t / 1000);
    draw();
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    lastT = null;
    rafId = requestAnimationFrame(frame);
    gooCanvas.classList.add("is-active");
    shineCanvas.classList.add("is-active");
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    gooCanvas.classList.remove("is-active");
    shineCanvas.classList.remove("is-active");
    gooCtx.clearRect(0, 0, width, height);
    shineCtx.clearRect(0, 0, width, height);
  }

  function setEnabled(enabled, persist) {
    if (toggle) {
      toggle.classList.toggle("is-on", enabled);
      toggle.setAttribute("aria-checked", enabled ? "true" : "false");
    }
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0"); } catch (e) {}
    }
    if (enabled) start(); else stop();
  }

  function initialEnabled() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (stored === "1") return true;
    if (stored === "0") return false;
    var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return !reducedMotion;
  }

  function init() {
    gooCanvas = document.getElementById("bubbles-goo");
    shineCanvas = document.getElementById("bubbles-shine");
    toggle = document.getElementById("bubbles-toggle");
    if (!gooCanvas || !shineCanvas) return;

    gooCtx = gooCanvas.getContext("2d");
    shineCtx = shineCanvas.getContext("2d");

    resize();
    seedBubbles();

    window.addEventListener("resize", function () {
      resize();
      seedBubbles();
    });

    window.addEventListener("mousemove", function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });
    window.addEventListener("mouseleave", function () { mouse.active = false; });
    window.addEventListener(
      "touchmove",
      function (e) {
        if (!e.touches || !e.touches.length) return;
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      },
      { passive: true }
    );

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (toggle && toggle.classList.contains("is-on")) start();
    });

    if (toggle) {
      toggle.addEventListener("click", function () {
        setEnabled(!toggle.classList.contains("is-on"), true);
      });
      toggle.addEventListener("keydown", function (e) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggle.click();
        }
      });
    }

    setEnabled(initialEnabled(), false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
