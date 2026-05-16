/**
 * Devuelve el contenedor activo en función de la pestaña/tkt seleccionado
 * @returns {HTMLElement | null}
 */

export function getActiveContainer() {
    const activeTab = document.querySelector(".tab-li.active a");
    if (!activeTab) return null;

    const paneId = activeTab.getAttribute("href");
    if (!paneId) return null;

    const activePane = document.querySelector(paneId);
    if (!activePane) return null;

    return activePane;
}

