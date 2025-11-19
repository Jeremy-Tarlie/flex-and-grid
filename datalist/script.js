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
 * - Initialise le scroll spy pour la navigation
 * - Initialise les exemples interactifs
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

  // Récupère tous les liens de navigation
  const navLinks = document.querySelectorAll(".nav-link");

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
        if (
          targetId === currentActive ||
          (targetId === "top" && !currentActive)
        ) {
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
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement =
          document.getElementById(targetId) || document.querySelector(href);

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

  // Script pour l'exemple range
  const rangeInput = document.getElementById("range-input");
  const rangeValue = document.getElementById("range-value");
  if (rangeInput && rangeValue) {
    rangeInput.addEventListener("input", function () {
      rangeValue.textContent = this.value;
    });
  }

  // Script pour la recherche dynamique (exemple 9)
  const dynamicApiInput = document.getElementById("dynamic-api-input");
  const dynamicApiList = document.getElementById("dynamic-api-list");

  if (dynamicApiInput && dynamicApiList) {
    let searchTimeout;
    const cities = [
      "Paris",
      "Lyon",
      "Marseille",
      "Toulouse",
      "Nice",
      "Nantes",
      "Strasbourg",
      "Montpellier",
      "Bordeaux",
      "Lille",
      "Rennes",
      "Reims",
      "Le Havre",
      "Saint-Étienne",
      "Toulon",
      "Grenoble",
      "Dijon",
      "Angers",
      "Nîmes",
      "Villeurbanne",
    ];

    dynamicApiInput.addEventListener("input", function (e) {
      clearTimeout(searchTimeout);
      const searchTerm = e.target.value.toLowerCase();

      searchTimeout = setTimeout(() => {
        dynamicApiList.innerHTML = "";

        if (searchTerm.length >= 2) {
          const filtered = cities.filter((city) =>
            city.toLowerCase().includes(searchTerm)
          );

          filtered.forEach((city) => {
            const option = document.createElement("option");
            option.value = city;
            dynamicApiList.appendChild(option);
          });
        }
      }, 300);
    });
  }

  // Script pour le select searchable
  const input = document.getElementById("searchable-select-input");
  const select = document.getElementById("searchable-select");
  const dropdown = document.getElementById("searchable-dropdown");

  if (input && select && dropdown) {
    const options = Array.from(select.options);

    // Afficher le dropdown au focus
    input.addEventListener("focus", function () {
      filterOptions();
      dropdown.style.display = "block";
    });

    // Filtrer les options lors de la saisie
    input.addEventListener("input", filterOptions);

    // Fermer le dropdown si on clique en dehors
    document.addEventListener("click", function (e) {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });

    function filterOptions() {
      const searchTerm = input.value.toLowerCase();
      const filtered = options.filter((opt) =>
        opt.text.toLowerCase().includes(searchTerm)
      );

      dropdown.innerHTML = "";

      filtered.forEach((option) => {
        if (option.value === "") return; // Ignorer l'option vide

        const div = document.createElement("div");
        div.textContent = option.text;
        div.style.padding = "10px";
        div.style.cursor = "pointer";
        div.style.borderBottom = "1px solid #e5e7eb";

        div.addEventListener("mouseenter", function () {
          this.style.backgroundColor = "#f3f4f6";
        });

        div.addEventListener("mouseleave", function () {
          this.style.backgroundColor = "white";
        });

        div.addEventListener("click", function () {
          input.value = option.text;
          select.value = option.value;
          dropdown.style.display = "none";
        });

        dropdown.appendChild(div);
      });

      if (
        filtered.length === 0 ||
        (filtered.length === 1 && filtered[0].value === "")
      ) {
        const noResults = document.createElement("div");
        noResults.textContent = "Aucun résultat";
        noResults.style.padding = "10px";
        noResults.style.color = "#6b7280";
        dropdown.appendChild(noResults);
      }
    }
  }
});
