(function () {
  "use strict";

  // Vanilla WebGL port of the hero metaballs on https://henrikkvamme.no
  // (https://github.com/henrikkvamme/portfolio — apps/web/src/components/metaball.tsx).
  // Ray-marched spheres, exponential smooth-min (join/break), and a spring-followed
  // cursor trail. Misses are transparent so the page theme shows through.

  var STORAGE_KEY = "bubbles-enabled";
  var TRAIL_LENGTH = 15;
  var TRAIL_SHIFT_INTERVAL_S = 0.03;
  var SPRING_STIFFNESS = 80;
  var SPRING_DAMPING = 7;
  var MAX_LAG_DISTANCE = 0.4;
  var MAX_DT_S = 1 / 30;

  var VERT = [
    "attribute vec3 position;",
    "void main() {",
    "  gl_Position = vec4(position, 1.0);",
    "}"
  ].join("\n");

  var FRAG = [
    "precision highp float;",
    "",
    "const int TRAIL_LENGTH = 15;",
    "const float EPS = 1e-4;",
    "const int ITR = 16;",
    "",
    "uniform float uTime;",
    "uniform float uLight;",
    "uniform vec2 uResolution;",
    "uniform vec2 uPointerTrail[TRAIL_LENGTH];",
    "",
    "vec3 normalizedToShader(float x, float y, float z) {",
    "  float aspectRatio = uResolution.x / uResolution.y;",
    "  return vec3((x * 2.0 - 1.0) * aspectRatio, y * 2.0 - 1.0, z);",
    "}",
    "",
    "float rnd3D(vec3 p) {",
    "  return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453123);",
    "}",
    "",
    "float noise3D(vec3 p) {",
    "  vec3 i = floor(p);",
    "  vec3 f = fract(p);",
    "  float a000 = rnd3D(i);",
    "  float a100 = rnd3D(i + vec3(1.0, 0.0, 0.0));",
    "  float a010 = rnd3D(i + vec3(0.0, 1.0, 0.0));",
    "  float a110 = rnd3D(i + vec3(1.0, 1.0, 0.0));",
    "  float a001 = rnd3D(i + vec3(0.0, 0.0, 1.0));",
    "  float a101 = rnd3D(i + vec3(1.0, 0.0, 1.0));",
    "  float a011 = rnd3D(i + vec3(0.0, 1.0, 1.0));",
    "  float a111 = rnd3D(i + vec3(1.0, 1.0, 1.0));",
    "  vec3 u = f * f * (3.0 - 2.0 * f);",
    "  float k0 = a000;",
    "  float k1 = a100 - a000;",
    "  float k2 = a010 - a000;",
    "  float k3 = a001 - a000;",
    "  float k4 = a000 - a100 - a010 + a110;",
    "  float k5 = a000 - a010 - a001 + a011;",
    "  float k6 = a000 - a100 - a001 + a101;",
    "  float k7 = -a000 + a100 + a010 - a110 + a001 - a101 - a011 + a111;",
    "  return k0 + k1 * u.x + k2 * u.y + k3 * u.z + k4 * u.x * u.y + k5 * u.y * u.z + k6 * u.z * u.x + k7 * u.x * u.y * u.z;",
    "}",
    "",
    "const vec3 origin = vec3(0.0, 0.0, 1.0);",
    "const vec3 cDir = vec3(0.0, 0.0, -1.0);",
    "const vec3 cUp = vec3(0.0, 1.0, 0.0);",
    "const vec3 cSide = vec3(1.0, 0.0, 0.0);",
    "const float SIZE = 0.35;",
    "const float TRAIL_SIZE = 0.18;",
    "",
    "float smoothMin(float a, float b, float k) {",
    "  float h = exp(-k * a) + exp(-k * b);",
    "  return -log(h) / k;",
    "}",
    "",
    "float sdSphere(vec3 p, float s) {",
    "  return length(p) - s;",
    "}",
    "",
    "float map(vec3 p) {",
    "  float baseRadius = 4.5e-2 * TRAIL_SIZE;",
    "  float radius = baseRadius * float(TRAIL_LENGTH);",
    "  float k = 7.0;",
    "  float d = 1e5;",
    "  for (int i = 0; i < TRAIL_LENGTH; i++) {",
    "    float fi = float(i);",
    "    vec2 trail = uPointerTrail[i];",
    "    float sphere = sdSphere(p - vec3(trail, 0.0), radius - baseRadius * fi);",
    "    d = smoothMin(d, sphere, k);",
    "  }",
    "  vec3 fp1 = normalizedToShader(0.85 + sin(uTime * 0.3) * 0.1, 0.8 + cos(uTime * 0.2) * 0.1, sin(uTime * 0.1) * 0.2);",
    "  d = smoothMin(d, sdSphere(p - fp1, (0.3 + 0.05 * sin(uTime * 0.7)) * SIZE), k);",
    "  vec3 fp2 = normalizedToShader(0.15 + cos(uTime * 0.4) * 0.08, 0.3 + sin(uTime * 0.35) * 0.15, cos(uTime * 0.15) * 0.2);",
    "  d = smoothMin(d, sdSphere(p - fp2, (0.25 + 0.06 * cos(uTime * 0.5)) * SIZE), k);",
    "  vec3 fp3 = normalizedToShader(0.4 + sin(uTime * 0.25) * 0.15, 0.9 + cos(uTime * 0.4) * 0.08, sin(uTime * 0.2) * 0.15);",
    "  d = smoothMin(d, sdSphere(p - fp3, (0.35 + 0.05 * sin(uTime * 0.9)) * SIZE), k);",
    "  vec3 fp4 = normalizedToShader(0.75 + cos(uTime * 0.5) * 0.12, 0.2 + sin(uTime * 0.3) * 0.1, cos(uTime * 0.12) * 0.25);",
    "  d = smoothMin(d, sdSphere(p - fp4, (0.28 + 0.06 * cos(uTime * 0.6)) * SIZE), k);",
    "  vec3 fp5 = normalizedToShader(0.5 + sin(uTime * 0.8) * 0.2, 0.5 + cos(uTime * 0.6) * 0.2, sin(uTime * 0.4) * 0.2);",
    "  d = smoothMin(d, sdSphere(p - fp5, (0.38 + 0.04 * sin(uTime * 1.1)) * SIZE), k);",
    "  vec3 fp6 = normalizedToShader(0.25 + cos(uTime * 0.35) * 0.1, 0.15 + sin(uTime * 0.45) * 0.1, cos(uTime * 0.18) * 0.2);",
    "  d = smoothMin(d, sdSphere(p - fp6, (0.27 + 0.06 * cos(uTime * 0.8)) * SIZE), k);",
    "  return d;",
    "}",
    "",
    "vec3 generateNormal(vec3 p) {",
    "  const vec2 e = vec2(1.0, -1.0);",
    "  return normalize(",
    "    e.xyy * map(p + e.xyy * EPS) +",
    "    e.yyx * map(p + e.yyx * EPS) +",
    "    e.yxy * map(p + e.yxy * EPS) +",
    "    e.xxx * map(p + e.xxx * EPS)",
    "  );",
    "}",
    "",
    "vec3 dropletColor(vec3 normal, vec3 rayDir) {",
    "  vec3 reflectDir = reflect(rayDir, normal);",
    "  float n0 = noise3D(reflectDir * 2.0 + uTime);",
    "  float n1 = noise3D(reflectDir * 2.0 - uTime);",
    "  vec3 c0 = vec3(0.1765, 0.1255, 0.2275) * n0;",
    "  vec3 c1 = vec3(0.4118, 0.4118, 0.4157) * n1;",
    "  return (c0 + c1) * 2.3;",
    "}",
    "",
    "void main() {",
    "  vec2 p = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);",
    "  vec3 ray = origin + cSide * p.x + cUp * p.y;",
    "  vec3 rayDirection = cDir;",
    "  float dist = 0.0;",
    "  for (int i = 0; i < ITR; ++i) {",
    "    dist = map(ray);",
    "    ray += rayDirection * dist;",
    "    if (dist < EPS) break;",
    "  }",
    "  vec3 color = vec3(0.0);",
    "  bool hit = dist < EPS;",
    "  if (hit) {",
    "    vec3 normal = generateNormal(ray);",
    "    color = dropletColor(normal, rayDirection);",
    "    vec3 c2 = color * color;",
    "    vec3 c4 = c2 * c2;",
    "    vec3 crushed = c4 * c2 * color;",
    "    float fresnel = 1.0 - max(dot(normal, -rayDirection), 0.0);",
    "    float rim = pow(fresnel, 2.5);",
    "    // Deep violet fill — difference with white homepage copy → yellow-green.",
    "    vec3 darkColor = mix(vec3(0.14, 0.05, 0.20), crushed, 0.28);",
    "    darkColor += vec3(0.65, 0.6, 0.85) * rim * 0.55;",
    "    // Dusty lilac fill — difference with white copy → muted olive (light analog).",
    "    vec3 lightColor = mix(vec3(0.60, 0.54, 0.70), color, 0.35);",
    "    lightColor += vec3(0.55, 0.50, 0.75) * rim * 0.45;",
    "    gl_FragColor = vec4(mix(darkColor, lightColor, uLight), 1.0);",
    "  } else {",
    "    gl_FragColor = vec4(0.0);",
    "  }",
    "}"
  ].join("\n");

  var canvas, gl, toggle, program;
  var locTime, locLight, locRes, locTrail;
  var lightTheme = 0;
  var running = false;
  var rafId = null;
  var lastT = null;
  var trailAccum = 0;
  var dpr = 1;

  var viewport = { x: 0, y: 0 };
  var target = { x: 0, y: 0 };
  var leader = { x: 0, y: 0 };
  var velocity = { x: 0, y: 0 };
  var trail = [];
  var trailFlat = new Float32Array(TRAIL_LENGTH * 2);

  function compile(type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  function linkProgram() {
    var vs = compile(gl.VERTEX_SHADER, VERT);
    var fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "position");
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      gl.deleteProgram(prog);
      return null;
    }
    return prog;
  }

  function viewportToShader(clientX, clientY, out) {
    var min = Math.min(viewport.x, viewport.y) || 1;
    out.x = (clientX * 2 - viewport.x) / min;
    out.y = (viewport.y - clientY * 2) / min;
  }

  function resize() {
    viewport.x = window.innerWidth;
    viewport.y = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.round(viewport.x * dpr));
    canvas.height = Math.max(1, Math.round(viewport.y * dpr));
    canvas.style.width = viewport.x + "px";
    canvas.style.height = viewport.y + "px";
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function step(dt) {
    var fx = SPRING_STIFFNESS * (target.x - leader.x) - SPRING_DAMPING * velocity.x;
    var fy = SPRING_STIFFNESS * (target.y - leader.y) - SPRING_DAMPING * velocity.y;
    velocity.x += fx * dt;
    velocity.y += fy * dt;
    leader.x += velocity.x * dt;
    leader.y += velocity.y * dt;

    var dx = target.x - leader.x;
    var dy = target.y - leader.y;
    var distSq = dx * dx + dy * dy;
    var maxSq = MAX_LAG_DISTANCE * MAX_LAG_DISTANCE;
    if (distSq > maxSq) {
      var dist = Math.sqrt(distSq);
      var drag = (dist - MAX_LAG_DISTANCE) / dist;
      leader.x += dx * drag;
      leader.y += dy * drag;
    }

    trailAccum += dt;
    while (trailAccum >= TRAIL_SHIFT_INTERVAL_S) {
      trailAccum -= TRAIL_SHIFT_INTERVAL_S;
      for (var i = TRAIL_LENGTH - 1; i > 0; i--) {
        trail[i].x = trail[i - 1].x;
        trail[i].y = trail[i - 1].y;
      }
      trail[0].x = leader.x;
      trail[0].y = leader.y;
    }
  }

  function draw(time) {
    for (var i = 0; i < TRAIL_LENGTH; i++) {
      trailFlat[i * 2] = trail[i].x;
      trailFlat[i * 2 + 1] = trail[i].y;
    }
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform1f(locTime, time);
    gl.uniform1f(locLight, lightTheme);
    gl.uniform2f(locRes, canvas.width, canvas.height);
    gl.uniform2fv(locTrail, trailFlat);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function frame(t) {
    if (!running) return;
    if (lastT === null) lastT = t;
    var dt = Math.min((t - lastT) / 1000, MAX_DT_S);
    lastT = t;
    step(dt);
    draw(t / 1000);
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running || !program) return;
    running = true;
    lastT = null;
    canvas.classList.add("is-active");
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    canvas.classList.remove("is-active");
    if (gl) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
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
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return !reduced;
  }

  function init() {
    canvas = document.getElementById("bubbles");
    toggle = document.getElementById("bubbles-toggle");
    if (!canvas) return;

    gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!gl) return;

    program = linkProgram();
    if (!program) return;

    locTime = gl.getUniformLocation(program, "uTime");
    locLight = gl.getUniformLocation(program, "uLight");
    locRes = gl.getUniformLocation(program, "uResolution");
    locTrail = gl.getUniformLocation(program, "uPointerTrail[0]");

    function syncTheme() {
      lightTheme = document.documentElement.getAttribute("data-theme") === "light" ? 1 : 0;
    }
    syncTheme();
    var themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 0,
       3, -1, 0,
      -1,  3, 0
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    for (var i = 0; i < TRAIL_LENGTH; i++) trail.push({ x: 0, y: 0 });

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", function (e) {
      viewportToShader(e.clientX, e.clientY, target);
    });

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
