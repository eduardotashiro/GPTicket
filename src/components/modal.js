import { applyTextToEditor } from "../utils/editorManager";
import "../styles/modal.css";

// ESTADO - Textos simulados por acción

const GENERATED_TEXTS = {
   expandir: "Texto expandido mockado...",
    resumir: "Texto resumido mockado...",
    simplificar: "Texto simplificado mockado...",
    corrigir: "Texto corrigido mockado...",
    "melhorar-tom:Profissional": "Texto profissional mockado...",
    "melhorar-tom:Casual": "Texto casual mockado...",
    "melhorar-tom:Amigável": "Texto amigável mockado...",
};

// EXPORTS PRINCIPALES

/**
 * Abre el modal con el resultado de la acción
 * @param {string} action - Tipo de acción (expand, summarize, etc)
 * @param {string} tone - Tono opcional (Profesional, Casual, Amistoso)
 */
export function openModal(action, tone) {
    const existing = document.querySelector(".ia-modal-overlay");
    if (existing) existing.remove();

    const key = tone ? `${action}:${tone}` : action;
    const generatedText = GENERATED_TEXTS[key] || `Texto para ${key}`;

    const overlay = createOverlay();
    const modal = createModal(generatedText, overlay);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Cierra al hacer clic fuera del modal
    overlay.onclick = (event) => {
        if (event.target === overlay) overlay.remove();
    };
}

// HELPERS - CREAR ESTRUCTURA

function createOverlay() {
    const overlay = document.createElement("div");
    overlay.classList.add("ia-modal-overlay");
    return overlay;
}

function createModal(generatedText, overlay) {
    const modal = document.createElement("div");
    modal.classList.add("ia-modal");

    const body = createBody(generatedText);
    const footer = createFooter(generatedText, body, overlay);

    modal.appendChild(body);
    modal.appendChild(footer);

    return modal;
}

function createBody(generatedText) {
    const body = document.createElement("div");
    body.classList.add("ia-modal-body");
    body.textContent = generatedText;
    return body;
}

function createFooter(generatedText, body, overlay) {
    const footer = document.createElement("div");
    footer.classList.add("ia-modal-footer");

    const discardBtn = createButton("Descartar");
    const regenerateBtn = createButton("Gerar novamente");
    const replaceBtn = createButton("Substituir texto", true);

    discardBtn.onclick = () => overlay.remove();

    regenerateBtn.onclick = () => {
        body.style.opacity = "0.4";
        setTimeout(() => {
            body.style.opacity = "1";
        }, 500);
    };

    replaceBtn.onclick = () => {
        applyTextToEditor(generatedText);
        overlay.remove();
    };

    footer.appendChild(discardBtn);
    footer.appendChild(regenerateBtn);
    footer.appendChild(replaceBtn);

    return footer;
}

// HELPERS - CREAR ELEMENTOS

/**
 * Crea un botón estilizado
 * @param {string} label - Texto del botón
 * @param {boolean} primary - Si es true, usa estilo primario (azul)
 * @returns {HTMLElement}
 */
function createButton(label, primary = false) {
    const button = document.createElement("button");
    button.textContent = label;
    button.classList.add("ia-modal-btn");

    if (primary) {
        button.classList.add("ia-modal-btn-primary");
    }

    return button;
}