import { getActiveContainer } from "./domUtils";

/***
 * Encuentra el editor activo en la página
 * @returns {HTMLElement | null}
 */
function findEditor() {
    const activeContainer = getActiveContainer();
    if (!activeContainer) return null;
    return activeContainer.querySelector(".fr-element[contenteditable='true']");
}

/***
 * Aplica el texto al editor, conservando las firmas si existen
 * @param {string} texto - Texto a inserir
 */
export function applyTextToEditor(text) {
    const editor = findEditor();
    if (!editor) {
        navigator.clipboard.writeText(text);
        alert("Editor não encontrado. Texto copiado!");
        return;
    }

    let signatureHTML = "";
    const signature = editor.querySelector(".signature");

    if (signature) {
        const separator = signature.previousElementSibling;
        if (separator?.innerText.trim() === "--") {
            signatureHTML = separator.outerHTML + signature.outerHTML;
        } else {
            signatureHTML = signature.outerHTML;
        }
    }

    editor.innerHTML = text.replace(/\n/g, "<br>") + signatureHTML;
}
