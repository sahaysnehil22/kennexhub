(function () {
  "use strict";

  /* ---------- language toggle ---------- */
  var WA_TEXT = {
    en: "Hi Vulpis! I saw your site and I'd like to talk about a project.",
    es: "¡Hola Vulpis! Vi su sitio y quiero conversar sobre un proyecto."
  };
  var waLinks = Array.prototype.slice.call(document.querySelectorAll("a[data-wa]"));

  function waHrefFor(a, lang) {
    var custom = a.getAttribute("data-wa-" + lang);
    var text = encodeURIComponent(custom || WA_TEXT[lang] || WA_TEXT.en);
    return "https://wa.me/51931768257?text=" + text;
  }

  function setLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-en]").forEach(function (el) {
      var v = el.getAttribute("data-" + lang);
      if (v !== null) el.textContent = v;
    });
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
    waLinks.forEach(function (a) {
      a.href = waHrefFor(a, lang);
    });
    try { localStorage.setItem("vulpis-lang", lang); } catch (e) {}
  }

  document.querySelectorAll(".lang-toggle button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });

  var initial = "en";
  try { initial = localStorage.getItem("vulpis-lang") || localStorage.getItem("kennexhub-lang") || "en"; } catch (e) {}
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

  /* ---------- floating whatsapp: extend label after scroll ---------- */
  var waFloat = document.getElementById("wa-float");
  if (waFloat) {
    var onScroll = function () {
      waFloat.classList.toggle("show", window.scrollY > 420);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

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
