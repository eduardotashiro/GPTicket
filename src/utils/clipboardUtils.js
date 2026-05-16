import { icons } from "./svgIcons";

const FEEDBACK_DURATION = 1500;
const SUCCESS_COLOR = "#31b34e";

/***
 * Copia texto al portapapeles con feedback visual
 * @param {string} text - Texto a copiar
 * @param {HTMLElement} button - Botón que dispara la acción
 */

export async function copyToClipboard(text, button) {
    try {
        if (!button) return;
        await navigator.clipboard.writeText(text);

        const originalIcon = button.innerHTML;
        const originalColor = button.style.color;

        button.innerHTML = icons.check();
        button.style.color = SUCCESS_COLOR;

        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.style.color = originalColor;
        }, FEEDBACK_DURATION);

    } catch (error) {
        console.error(error);
    }
}

/***
 * Copia múltiples líneas (con saltos de línea)
 * @param {string[]} lines - Array de strings
 * @param {HTMLElement} button - Botón que dispara la acción
 */
export function copyLines(lines, button) {
    copyToClipboard(lines.join("\n"), button);
}