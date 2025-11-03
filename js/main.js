const NAV_ITEMS = [
  { key: "inicio", href: "index.html", label: "Inicio" },
  { key: "calendario", href: "calendario.html", label: "Calendario" },
  { key: "resumen", href: "resumen-de-clases.html", label: "Resumen de clases" },
  { key: "archivos", href: "archivos.html", label: "Archivos" },
  { key: "avisos", href: "avisos.html", label: "Avisos" },
];

class AppHeader extends HTMLElement {
  static get observedAttributes() {
    return ["active"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
    }
  }

  render() {
    const active = this.getAttribute("active") || "inicio";
    const navLinks = NAV_ITEMS.map((item) => {
      const aria = item.key === active ? ' aria-current="page"' : "";
      return `<li><a href="${item.href}"${aria}>${item.label}</a></li>`;
    }).join("\n");

    this.innerHTML = `
      <header class="site-header">
        <div class="logo-area">
          <span class="logo">Francés EOI 2025</span>
          <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav">
            <span class="sr-only">Abrir menú</span>
            ☰
          </button>
        </div>
        <nav id="main-nav" class="site-nav">
          <ul>
            ${navLinks}
          </ul>
        </nav>
      </header>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const menuToggle = this.querySelector(".menu-toggle");
    const nav = this.querySelector(".site-nav");

    if (!menuToggle || !nav) {
      return;
    }

    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
}

customElements.define("app-header", AppHeader);

class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <p>Hecho con cariño para la clase de francés A1 · 2025</p>
      </footer>
    `;
  }
}

customElements.define("app-footer", AppFooter);

document.addEventListener("DOMContentLoaded", () => {
  setupSummaryInteractions();
  setupNoticeBoardInteractions();
});

function setupSummaryInteractions() {
  const summaryButton = document.querySelector('[data-action="add-summary"]');
  const summaryList = document.getElementById("summary-list");
  const summaryTemplate = document.getElementById("summary-template");

  if (!summaryButton || !summaryList || !summaryTemplate) {
    return;
  }

  summaryButton.addEventListener("click", () => {
    const title = prompt("Título del resumen (ej. Clase 3 · 29 enero):");
    if (!title) {
      return;
    }

    const pointsInput = prompt(
      "Escribe los puntos clave separados por comas (ej. Saludos, Números, Tarea)."
    );

    const clone = summaryTemplate.content.cloneNode(true);
    const card = clone.querySelector(".summary-card");
    const heading = card.querySelector("h2");
    const list = card.querySelector("ul");

    heading.textContent = title.trim();
    list.innerHTML = "";

    if (pointsInput) {
      pointsInput.split(",").forEach((point) => {
        const text = point.trim();
        if (!text) {
          return;
        }
        const item = document.createElement("li");
        item.textContent = text;
        list.appendChild(item);
      });
    } else {
      const item = document.createElement("li");
      item.textContent = "Escribe aquí el punto importante.";
      list.appendChild(item);
    }

    summaryList.prepend(card);
  });
}

function setupNoticeBoardInteractions() {
  const noticeButton = document.querySelector('[data-action="add-notice"]');
  const noticeBoard = document.getElementById("notice-board");
  const noticeTemplate = document.getElementById("notice-template");

  if (!noticeButton || !noticeBoard || !noticeTemplate) {
    return;
  }

  noticeButton.addEventListener("click", () => {
    const title = prompt("Título del aviso (ej. Cambio de aula):");
    if (!title) {
      return;
    }

    const message = prompt("Mensaje del aviso:");
    const clone = noticeTemplate.content.cloneNode(true);
    const card = clone.querySelector(".notice-card");
    const heading = card.querySelector("h2");
    const text = card.querySelector("p");

    heading.textContent = title.trim();
    text.textContent = message ? message.trim() : "Añade el mensaje del aviso aquí.";

    noticeBoard.prepend(card);
  });
}
