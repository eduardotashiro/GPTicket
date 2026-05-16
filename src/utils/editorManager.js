/**
 * Gerencia a aplicação de textos no editor (textarea, contenteditable, etc)
 */
import { getActiveContainer } from "./domUtils";

/**
 * Encontra o editor ativo na página
 * @returns {HTMLElement | null}
 */
function encontrarEditor() {
    // Tenta encontrar editor rich text (nota no Movidesk)
    // painel = contextual
    // editor = global
    const containerAtivo = getActiveContainer();

    if (!containerAtivo) return null;

    const editor = containerAtivo.querySelector(".fr-element[contenteditable='true']");
    const textarea = containerAtivo.querySelector("TEXTAREA");

    return editor || textarea || null;
}

/**
 * Aplica texto no editor, preservando assinatura se existir
 * @param {string} texto - Texto a inserir
 */
export function aplicarTextoNoEditor(texto) {
    const elemento = encontrarEditor();
    console.log("ELEMENTO:", elemento);
    if (!elemento) return;

    const editor = elemento.matches("[contenteditable='true']")
        ? elemento
        : null;

    const textarea = elemento.tagName === "TEXTAREA"
        ? elemento
        : null;


    if (editor) {
        // Editor rich text (HTML) 
        let htmlAssinatura = "";

        const assinatura = editor.querySelector(".signature");
        if (assinatura) {
            const anterior = assinatura.previousElementSibling;

            // Se houver um separador (--) antes da assinatura, preserva
            if (
                anterior &&
                anterior.tagName === "P" &&
                anterior.innerText.trim() === "--"
            ) {
                htmlAssinatura = anterior.outerHTML + assinatura.outerHTML;
            } else {
                htmlAssinatura = assinatura.outerHTML;
            }
        }

        // Insere novo texto + assinatura
        editor.innerHTML = texto.replace(/\n/g, "<br>") + htmlAssinatura; //talvez tirar no futuro

    } else if (textarea) {
        //Textarea simples (texto plano)
        textarea.value = texto;
    } else {
        // Fallback: copia pro clipboard 
        navigator.clipboard.writeText(texto);
        alert("Nenhum editor encontrado. Texto copiado para a área de transferência!");
    }
}

/**
 * Obtém o texto atual do editor
 * @returns {string}
 */
export function obterTextoDoEditor() {
    const elemento = encontrarEditor();

    if (!elemento) return "";

    const editor = elemento.classList.contains("fr-element")
        ? elemento
        : null;

    const textarea = elemento.tagName === "TEXTAREA"
        ? elemento
        : null;

    if (editor) {
        return editor.innerText;
    }

    if (textarea) {
        return textarea.value;
    }

    return "";
}

/**
 * Limpa o editor (remove todo conteúdo)
 */
export function limparEditor() {
    const elemento = encontrarEditor();

    if (!elemento) return;

    const editor = elemento.matches("[contenteditable='true']")
        ? elemento
        : null;

    const textarea = elemento.tagName === "TEXTAREA"
        ? elemento
        : null;

    if (editor) {
        editor.innerHTML = "";
    }

    if (textarea) {
        textarea.value = "";
    }
}