/**
 * Gerencia a aplicação de textos no editor (contenteditable)
 */
import { getActiveContainer } from "./domUtils";

/**
 * Encuentra el editor activo en la página
 * @returns {HTMLElement | null}
 */
function findEditor() {
    const containerAtivo = getActiveContainer();
    if (!containerAtivo) return null;

    return containerAtivo.querySelector(".fr-element[contenteditable='true']");
}

/**
 * Aplica texto no editor, preservando assinatura se existir
 * @param {string} texto - Texto a inserir
 */
export function aplicarTextoNoEditor(texto) {
    const editor = findEditor();
    if (!editor) {
        navigator.clipboard.writeText(texto);
        alert("Editor não encontrado. Texto copiado!");
        return;
    }

    let htmlAssinatura = "";
    const assinatura = editor.querySelector(".signature");

    if (assinatura) {
        const anterior = assinatura.previousElementSibling;
        if (anterior?.innerText.trim() === "--") {
            htmlAssinatura = anterior.outerHTML + assinatura.outerHTML;
        } else {
            htmlAssinatura = assinatura.outerHTML;
        }
    }

    editor.innerHTML = texto.replace(/\n/g, "<br>") + htmlAssinatura;
}

/**
 * Obtém o texto atual do editor
 * @returns {string}
 */
export function obterTextoDoEditor() {
    const editor = findEditor();
    return editor?.innerText || "";
}

/**
 * Limpa o editor (remove todo conteúdo)
 */
export function limparEditor() {
    const editor = findEditor();
    if (editor) {
        editor.innerHTML = "";
    }
}