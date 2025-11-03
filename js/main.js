document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (menuToggle && nav) {
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

  const summaryButton = document.querySelector('[data-action="add-summary"]');
  const summaryList = document.getElementById("summary-list");
  const summaryTemplate = document.getElementById("summary-template");

  if (summaryButton && summaryList && summaryTemplate) {
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

  const noticeButton = document.querySelector('[data-action="add-notice"]');
  const noticeBoard = document.getElementById("notice-board");
  const noticeTemplate = document.getElementById("notice-template");

  if (noticeButton && noticeBoard && noticeTemplate) {
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
});

