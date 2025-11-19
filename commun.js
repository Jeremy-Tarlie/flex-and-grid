/**
 * Initialisation au chargement de la page
 * - Initialise le bouton retour en haut
 * - Initialise le menu de navigation
 */
document.addEventListener("DOMContentLoaded", function () {
    // Initialise le bouton retour en haut
    initBackToTop();
  
    // Initialise le menu de navigation
    initNavigation();
  });
  
  /**
   * Fonctionnalité du bouton retour en haut
   */
  function initBackToTop() {
    const backToTopBtn = document.getElementById("back-to-top");
    if (!backToTopBtn) return;
  
    // Affiche/masque le bouton selon la position du scroll
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });
  
    // Scroll vers le haut au clic
    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
  
  /**
   * Initialise le menu de navigation latéral
   */
  function initNavigation() {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelectorAll(".nav-link");
    
    // Crée l'overlay pour mobile
    const overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);
  
    // Toggle du menu sur mobile
    if (menuToggle) {
      menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("active");
        menuToggle.classList.toggle("active");
      });
    }
  
    // Ferme le menu quand on clique sur l'overlay
    overlay.addEventListener("click", function () {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
      if (menuToggle) {
        menuToggle.classList.remove("active");
      }
    });
  
    // Ferme le menu quand on clique sur un lien (mobile)
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 1024) {
          sidebar.classList.remove("open");
          overlay.classList.remove("active");
          if (menuToggle) {
            menuToggle.classList.remove("active");
          }
        }  
      });
    });
  }
  
  