import { Icons } from "./SVGIcons";

/**
 * Copiar texto al clipboard con feedback visual  
 * @param {string} text - Texto para copiar
 * @param {HTMLElement} button - Botón que activa la acción.
 */
const FEEDBACK_DURATION = 1500;
const SUCCESS_COLOR = "#31b34e";

export async function copyToClipboard(text, button) {
    try {
        if (!button) return;
        await navigator.clipboard.writeText(text);

        const originalIcon = button.innerHTML;
        const originalColor = button.style.color;

        button.innerHTML = Icons.check();
        button.style.color = SUCCESS_COLOR;

        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.style.color = originalColor;
        }, FEEDBACK_DURATION);

    } catch (error) {
        console.error(error);
    }
}

/**
 * Copia múltiplas linhas (com quebras de linha)
 * @param {string[]} lines - Array de strings
 * @param {HTMLElement} button - Botão que dispara a ação
 */
export function copyLines(lines, button) {
    copyToClipboard(lines.join("\n"), button);
}