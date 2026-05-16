/**
 * Cria e gerencia o modal que aparece quando usuário seleciona uma ação
 * (expandir, resumir, simplificar, etc)
 */

import { aplicarTextoNoEditor } from "../utils/editorManager"

const TEXTOS_GERADOS = {
    expandir: "Texto expandido mockado...",
    resumir: "Texto resumido mockado...",
    simplificar: "Texto simplificado mockado...",
    corrigir: "Texto corrigido mockado...",
    "melhorar-tom:Profissional": "Texto profissional mockado...",
    "melhorar-tom:Casual": "Texto casual mockado...",
    "melhorar-tom:Amigável": "Texto amigável mockado...",
};

/**
 * Abre o modal com o resultado da ação
 * @param {string} acao - Tipo de ação (expandir, resumir, etc)
 * @param {string} tom - Tom opcional (Profissional, Casual, Amigável)
 */
export function abrirModal(acao, tom) {

    const antigo = document.querySelector("#ia-modal-overlay");
    if (antigo) antigo.remove();

    // Busca o texto gerado
    const chave = tom ? `${acao}:${tom}` : acao;
    const textoGerado = TEXTOS_GERADOS[chave] || `Texto para ${chave}`;

    // Overlay (fundo escuro) 
    const overlay = document.createElement("div");
    overlay.id = "ia-modal-overlay";
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Modal 
    const modal = document.createElement("div");
    modal.style.cssText = `
        width: 580px;
        max-width: 92vw;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        font-family: Arial;
        display: flex;
        flex-direction: column;
    `;

    // Corpo do modal 
    const corpo = document.createElement("div");
    corpo.style.cssText = `
        padding: 28px;
        white-space: pre-wrap;
        font-size: 14px;
        line-height: 1.6;
        color: #222;
        max-height: 60vh;
        overflow: auto;
        flex: 1;
    `;
    corpo.textContent = textoGerado;

    // Rodapé com botões
    const rodape = document.createElement("div");
    rodape.style.cssText = `
        padding: 16px 24px;
        border-top: 1px solid #eee;
        display: flex;
        gap: 10px;
        justify-content: center;
    `;

    // Botões
    const descartar = criarBotao("Descartar");
    const gerar = criarBotao("Gerar novamente");
    const substituir = criarBotao("Substituir texto", true);

    descartar.onclick = () => overlay.remove();

    gerar.onclick = () => {
        corpo.style.opacity = "0.4";
        setTimeout(() => {
            corpo.style.opacity = "1";
        }, 500);
    };

    substituir.onclick = () => {
        aplicarTextoNoEditor(textoGerado);
        overlay.remove();
    };

    rodape.appendChild(descartar);
    rodape.appendChild(gerar);
    rodape.appendChild(substituir);

    //  Monta modal 
    modal.appendChild(corpo);
    modal.appendChild(rodape);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Fecha ao clicar fora
    overlay.onclick = (e) => {
        if (e.target === overlay) overlay.remove();
    };
}

/**
 * Cria um botão estilizado
 * @param {string} label
 * @param {boolean} primario - Se true, usa estilo primário (azul)
 * @returns {HTMLElement}
 */
function criarBotao(label, primario = false) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.style.cssText = `
        padding: 8px 16px;
        border-radius: 6px;
        border: 1px solid #ddd;
        background: #fff;
        color: #333;
        cursor: pointer;
        font-size: 14px;
        font-family: Arial;
        transition: all 0.2s;
    `;

    if (primario) {
        btn.style.background = "#3b82f6";
        btn.style.color = "#fff";
        btn.style.borderColor = "#3b82f6";
    }

    // Hover
    btn.addEventListener("mouseenter", () => {
        if (primario) {
            btn.style.background = "#2563eb";
        } else {
            btn.style.background = "#f5f5f5";
        }
    });

    btn.addEventListener("mouseleave", () => {
        if (primario) {
            btn.style.background = "#3b82f6";
        } else {
            btn.style.background = "#fff";
        }
    });

    return btn;
}