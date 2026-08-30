(function (global) {
  "use strict";

  var STORAGE_KEY = "portfolio-sound-enabled";

  var COOLDOWNS = {
    click: 120,
    navigate: 250,
    langSwitch: 200,
    success: 200,
    error: 200
  };

  var ctx = null;
  var masterGain = null;
  var enabled = true;
  var unlocked = false;
  var lastPlayed = {};
  var masterVolume = 0.18;

  var CLICK_SELECTOR = ".site-nav-v2 a, .contact-chip-v2, .cover-action-card";

  function getStoredEnabled() {
    try {
      var stored = global.localStorage.getItem(STORAGE_KEY);
      if (stored !== null) return stored === "true";
    } catch (e) { /* ignore */ }
    return true;
  }

  function ensureCtx() {
    try {
      if (!ctx || ctx.state === "closed") {
        ctx = new (global.AudioContext || global.webkitAudioContext)();
        masterGain = ctx.createGain();
        masterGain.gain.value = enabled ? masterVolume : 0;
        masterGain.connect(ctx.destination);
        unlocked = true;
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    } catch (e) {
      return null;
    }
  }

  function dest() {
    ensureCtx();
    return masterGain;
  }

  function setEnabled(v) {
    enabled = v;
    if (masterGain) masterGain.gain.value = v ? masterVolume : 0;
  }

  function playClick(node) {
    var t = ctx.currentTime;
    var len = 0.025;
    var buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 6) * 0.18;
    var src = ctx.createBufferSource();
    var g = ctx.createGain();
    var f = ctx.createBiquadFilter();
    src.buffer = buf;
    f.type = "bandpass";
    f.frequency.value = 2200;
    f.Q.value = 1.2;
    g.gain.value = 0.14;
    src.connect(f); f.connect(g); g.connect(node);
    src.start(t); src.stop(t + len);
  }

  function playNavigate(node) {
    var t = ctx.currentTime;
    var len = 0.07;
    var buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++) {
      var p = i / d.length;
      d[i] = (Math.random() * 2 - 1) * Math.sin(p * Math.PI) * (1 - p) * 0.1;
    }
    var src = ctx.createBufferSource();
    var g = ctx.createGain();
    var f = ctx.createBiquadFilter();
    src.buffer = buf;
    f.type = "lowpass";
    f.frequency.value = 600;
    g.gain.value = 0.13;
    src.connect(f); f.connect(g); g.connect(node);
    src.start(t); src.stop(t + len);
  }

  function playLangSwitch(node) {
    var t = ctx.currentTime;
    var len = 0.028;
    var buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 5) * 0.16;
    var src = ctx.createBufferSource();
    var g = ctx.createGain();
    var f = ctx.createBiquadFilter();
    src.buffer = buf;
    f.type = "highpass";
    f.frequency.value = 3000;
    g.gain.value = 0.10;
    src.connect(f); f.connect(g); g.connect(node);
    src.start(t); src.stop(t + len);
  }

  function playCoverStart(node) {
    var t = ctx.currentTime;
    var len = 0.06;
    var buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++) {
      var p = i / d.length;
      d[i] = (Math.random() * 2 - 1) * Math.sin(p * Math.PI) * (1 - p) * 0.08;
    }
    var src = ctx.createBufferSource();
    var g = ctx.createGain();
    var f = ctx.createBiquadFilter();
    src.buffer = buf;
    f.type = "lowpass";
    f.frequency.value = 500;
    g.gain.value = 0.10;
    src.connect(f); f.connect(g); g.connect(node);
    src.start(t); src.stop(t + len);
  }

  function play(name) {
    if (!enabled || !unlocked) return;
    var now = Date.now();
    if (now - (lastPlayed[name] || 0) < (COOLDOWNS[name] || 0)) return;
    lastPlayed[name] = now;
    var c = ctx || ensureCtx();
    var node = dest();
    if (!c || !node) return;
    switch (name) {
      case "click":
      case "success":
      case "error": playClick(node); break;
      case "navigate": playNavigate(node); break;
      case "langSwitch": playLangSwitch(node); break;
    }
  }

  function coverStart() {
    if (!enabled || !unlocked) return;
    var c = ctx || ensureCtx();
    var node = dest();
    if (!c || !node) return;
    playCoverStart(node);
  }

  function unlock() {
    if (unlocked) return;
    ensureCtx();
  }

  var soundEnabled = getStoredEnabled();
  var soundOn = soundEnabled;
  enabled = soundEnabled;

  function toggle() {
    soundOn = !soundOn;
    try { global.localStorage.setItem(STORAGE_KEY, String(soundOn)); } catch (e) { /* ignore */ }
    setEnabled(soundOn);
  }

  global.PortfolioSound = {
    play: play,
    unlock: unlock,
    coverStart: coverStart,
    toggle: toggle,
    isEnabled: function () { return enabled; },
    setMotionEnabled: function (motionOn) { setEnabled(soundOn && motionOn); }
  };

  var handledFirst = false;
  function handleFirstInteraction() {
    if (!handledFirst) {
      handledFirst = true;
      unlock();
    }
  }
  document.addEventListener("pointerdown", handleFirstInteraction, { once: true, capture: true });
  document.addEventListener("keydown", handleFirstInteraction, { once: true, capture: true });

  document.addEventListener("click", function (e) {
    if (!enabled) return;
    var target = e.target && e.target.closest ? e.target.closest(CLICK_SELECTOR) : null;
    if (target) play("click");
  }, { passive: true });

  /* Keep sound state in sync with the motion preference applied at runtime (set by app.js). */
  global.PortfolioSound._setSoundOn = function (v) { soundOn = v; };
})(window);
