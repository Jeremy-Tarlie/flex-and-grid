/**
 * Fonction principale pour copier le code d'un bloc
 * @param {HTMLElement} button - Le bouton de copie cliqué
 */
function copyCode(button) {
    // Cherche le bloc de code dans le parent (structure standard)
    const codeBlock = button.parentElement.querySelector("pre code");
    
    if (!codeBlock) {
      // Fallback : cherche le bloc de code suivant (structure alternative)
      const codeBlock2 = button.nextElementSibling;
      if (codeBlock2 && codeBlock2.tagName === "PRE") {
        const code = codeBlock2.querySelector("code").textContent;
        copyToClipboard(code, button);
        return;
      }
      return;
    }
    
    // Extrait le texte du code et le copie
    const code = codeBlock.textContent;
    copyToClipboard(code, button);
  }

  /**
   * Copie du texte dans le presse-papier avec fallback pour anciens navigateurs
   * @param {string} text - Le texte à copier
   * @param {HTMLElement} button - Le bouton pour afficher le feedback
   */
  function copyToClipboard(text, button) {
    // Méthode moderne : API Clipboard (navigateurs récents)
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Succès : affiche un feedback visuel
        const originalText = button.textContent;
        button.textContent = "✅ Copié!";
        button.classList.add("copied");

        // Remet le texte original après 2 secondes
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove("copied");
        }, 2000);
      })
      .catch((err) => {
        // Erreur : fallback pour anciens navigateurs
        console.error("Erreur lors de la copie:", err);
        
        // Méthode de fallback : crée un textarea invisible
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
          // Utilise l'ancienne API execCommand
          document.execCommand("copy");
          button.textContent = "✅ Copié!";
          button.classList.add("copied");
          setTimeout(() => {
            button.textContent = "📋 Copier";
            button.classList.remove("copied");
          }, 2000);
        } catch (e) {
          // Si même le fallback échoue
          button.textContent = "❌ Erreur";
          setTimeout(() => {
            button.textContent = "📋 Copier";
          }, 2000);
        }
        
        // Nettoie le textarea temporaire
        document.body.removeChild(textarea);
      });
  }

  /**
   * Initialisation au chargement de la page
   * - Ajoute les boutons de copie sur tous les blocs de code
   * - Initialise la recherche
   * - Initialise le bouton retour en haut
   * - Initialise le menu de navigation
   */
  document.addEventListener("DOMContentLoaded", function () {
    // Ajoute les boutons de copie sur tous les blocs de code
    const allPreCode = document.querySelectorAll("pre code");
    allPreCode.forEach((preCode) => {
      const pre = preCode.parentElement;
      // Vérifie si le bloc n'a pas déjà un wrapper avec bouton
      if (
        !pre.parentElement ||
        !pre.parentElement.classList.contains("code-block")
      ) {
        // Crée le wrapper et le bouton
        const wrapper = document.createElement("div");
        wrapper.className = "code-block";
        const button = document.createElement("button");
        button.className = "copy-btn";
        button.textContent = "📋 Copier";
        button.setAttribute("aria-label", "Copier le code");
        button.onclick = function () {
          copyCode(this);
        };
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(button);
        wrapper.appendChild(pre);
      }
    });

    

    // Scroll spy - met en surbrillance le lien actif
    const sections = document.querySelectorAll("section[id], article[id]");
    
    function updateActiveLink() {
      const scrollPos = window.pageYOffset + 200;
      let currentActive = null;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          currentActive = sectionId;
        }
      });

      // Met à jour les liens actifs
      navLinks.forEach((link) => {
        link.classList.remove("active");
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          const targetId = href.substring(1);
          if (targetId === currentActive || (targetId === "top" && !currentActive)) {
            link.classList.add("active");
          }
        }
      });
    }

    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink(); // Appel initial

    // Smooth scroll pour les liens d'ancrage
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href.startsWith("#")) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId) || document.querySelector(href);
          
          if (targetElement) {
            const offsetTop = targetElement.offsetTop - 20;
            window.scrollTo({
              top: offsetTop,
              behavior: "smooth",
            });
          }
        }
      });
    });
  });