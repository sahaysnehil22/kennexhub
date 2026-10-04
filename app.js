(function () {
  "use strict";

  /* ---------- language toggle ---------- */
  var WA_TEXT = {
    en: "Hi KennexHub! I saw your portfolio and I'd like to talk about a project.",
    es: "¡Hola KennexHub! Vi su portafolio y quiero conversar sobre un proyecto."
  };
  var waLinks = [
    document.getElementById("nav-wa"),
    document.getElementById("hero-wa"),
    document.getElementById("contact-wa")
  ];

  function setLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-en]").forEach(function (el) {
      var v = el.getAttribute("data-" + lang);
      if (v !== null) el.textContent = v;
    });
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
    var text = encodeURIComponent(WA_TEXT[lang] || WA_TEXT.en);
    waLinks.forEach(function (a) {
      if (a) a.href = "https://wa.me/51931768257?text=" + text;
    });
    try { localStorage.setItem("kennexhub-lang", lang); } catch (e) {}
  }

  document.querySelectorAll(".lang-toggle button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });

  var initial = "en";
  try { initial = localStorage.getItem("kennexhub-lang") || "en"; } catch (e) {}
  if (initial !== "en" && initial !== "es") initial = "en";
  setLang(initial);

  /* ---------- mobile menu ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var links = document.querySelector(".nav .links");
  if (menuBtn && links) {
    menuBtn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var io = null;
  function revealAll() {
    revealEls.forEach(function (el) { el.classList.add("in"); });
    if (io) io.disconnect();
  }
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealAll();
  }
  /* anchor jumps skip the scroll animation — reveal everything so no gaps stay blank */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function () { setTimeout(revealAll, 60); });
  });
  if (window.location.hash) revealAll();

  /* ---------- video lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var video = document.getElementById("lightbox-video");
  function openVideo(src) {
    video.src = src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    video.play().catch(function () {});
  }
  function closeVideo() {
    video.pause();
    video.removeAttribute("src");
    video.load();
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  document.querySelectorAll(".play-btn").forEach(function (b) {
    b.addEventListener("click", function () { openVideo(b.getAttribute("data-video")); });
  });
  lightbox.querySelectorAll("[data-close]").forEach(function (el) {
    el.addEventListener("click", closeVideo);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("open")) closeVideo();
  });
})();
