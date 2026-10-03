/*
 * Kifaru Roasters — site behaviour
 * Depends on Bootstrap 5.3 bundle and AOS (both loaded before this file).
 */
(function () {
  "use strict";

  var CONTACT_EMAIL = "info@kifaruroasters.org";
  var WHATSAPP_NUMBER = "256782639188";

  /* Navbar: solid background after scrolling or when the mobile menu is open */
  var navbar = document.querySelector(".navbar-kf");
  function updateNavbar() {
    if (!navbar) return;
    navbar.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  document.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  var navCollapse = document.getElementById("mainNav");
  if (navbar && navCollapse) {
    navCollapse.addEventListener("show.bs.collapse", function () { navbar.classList.add("is-open"); });
    navCollapse.addEventListener("hidden.bs.collapse", function () { navbar.classList.remove("is-open"); });
    navCollapse.querySelectorAll("a[href*='#']").forEach(function (link) {
      link.addEventListener("click", function () {
        var instance = bootstrap.Collapse.getInstance(navCollapse);
        if (instance) instance.hide();
      });
    });
  }

  /* Back to top button */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    document.addEventListener("scroll", function () {
      backToTop.classList.toggle("is-visible", window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Current year in footer */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Scroll animations */
  if (window.AOS) {
    AOS.init({ duration: 650, easing: "ease-out", once: true, offset: 60 });
  }

  /*
   * Contact form.
   * The site is static (no server), so the form opens the visitor's email app
   * or WhatsApp with the message pre-filled instead of posting to a backend.
   */
  var form = document.getElementById("contactForm");
  if (!form) return;

  var topicSelect = form.querySelector("#topic");
  var params = new URLSearchParams(window.location.search);
  if (topicSelect && params.get("topic")) {
    var wanted = params.get("topic");
    Array.prototype.forEach.call(topicSelect.options, function (opt) {
      if (opt.value === wanted) topicSelect.value = wanted;
    });
  }

  function composeMessage() {
    var data = new FormData(form);
    var topicLabel = topicSelect.options[topicSelect.selectedIndex].text;
    var subject = "[" + topicLabel + "] " + (data.get("subject") || "Website enquiry");
    var body =
      data.get("message") + "\n\n" +
      "— " + data.get("name") + "\n" +
      data.get("email") +
      (data.get("phone") ? "\n" + data.get("phone") : "");
    return { subject: subject, body: body };
  }

  function validate() {
    form.classList.add("was-validated");
    return form.checkValidity();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;
    var msg = composeMessage();
    window.location.href = "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(msg.subject) +
      "&body=" + encodeURIComponent(msg.body);
    var note = document.getElementById("formNote");
    if (note) note.classList.remove("d-none");
  });

  var whatsappBtn = document.getElementById("sendWhatsApp");
  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", function () {
      if (!validate()) return;
      var msg = composeMessage();
      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" +
        encodeURIComponent(msg.subject + "\n\n" + msg.body), "_blank", "noopener");
    });
  }
})();
