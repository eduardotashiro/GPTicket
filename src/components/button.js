import { getActiveContainer } from "../utils/domUtils";
import "../styles/button.css";


// ESTADO / CALLBACKS

let onActionSelected = null;

export function defineActionCallback(callback) {
    onActionSelected = callback;
}

// EXPORTS PRINCIPALES

export function addAIButton() {
    const activeContainer = getActiveContainer();
    if (!activeContainer) return;

    const target = activeContainer.querySelector(".actions-buttons-square-container");
    if (!target) return;

    if (target.querySelector(".btn-ia-ticket")) return;

    const wrapper = createWrapper();
    const button = createMainButton();
    const dropdown = createDropdownMenu();
    const toneSubmenu = createToneSubmenu();

    dropdown.appendChild(toneSubmenu.wrapper);

    setupButtonEvents(button, dropdown, toneSubmenu);
    setupDocumentEvents(wrapper, dropdown, toneSubmenu);

    wrapper.appendChild(button);
    wrapper.appendChild(dropdown);
    target.appendChild(wrapper);
}

// HELPERS - CREAR ELEMENTOS

function createWrapper() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("ia-wrapper");
    return wrapper;
}

function createMainButton() {
    const button = document.createElement("button");
    button.classList.add(
        "btn-mv",
        "btn-mv-gray-default",
        "action-buttons-square",
        "btn-ia-ticket"
    );
    button.type = "button";
    button.title = "Aprimorar texto com IA";
    button.innerHTML = "✨";
    return button;
}

function createDropdownItem(label, onClick) {
    const button = document.createElement("button");
    button.classList.add("ia-dropdown-item");
    button.textContent = label;
    button.onclick = onClick;
    return button;
}

// HELPERS - CREAR MENÚS

function createDropdownMenu() {
    const dropdown = document.createElement("div");
    dropdown.classList.add("ia-dropdown");

    const actions = [
        { label: "Expandir o texto", action: "expandir" },
        { label: "Resumir texto", action: "resumir" },
        { label: "Simplificar linguagem", action: "simplificar" },
        { label: "Corrigir ortografia e gramática", action: "corrigir" },
    ];

    actions.forEach((item) => {  
        const btn = createDropdownItem(item.label, () => {
            if (onActionSelected) {
                onActionSelected(item.action);
            }
        });
        dropdown.appendChild(btn);
    });

    return dropdown;
}

function createToneSubmenu() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("ia-submenu-wrapper");

    const toneButton = createDropdownItem("Mejorar el tono", () => {});
    toneButton.innerHTML = `
        Melhorar o tom
        <span class="ia-seta">▶</span>
    `;

    const submenu = document.createElement("div");
    submenu.classList.add("ia-submenu");

    const tones = ["Profissional", "Casual", "Amigável"];
    tones.forEach((tone) => {
        const toneItem = createDropdownItem(tone, (event) => {
            event.stopPropagation();
            if (onActionSelected) {
                onActionSelected("melhorar-tom", tone);
            }
        });
        submenu.appendChild(toneItem);
    });

    setupToneSubmenuEvents(wrapper, submenu);

    wrapper.appendChild(toneButton);
    wrapper.appendChild(submenu);

    return { wrapper, element: submenu };
}

// EVENTOS

function setupButtonEvents(button, dropdown, toneSubmenu) {
    button.onclick = (event) => {
        event.stopPropagation();
        dropdown.classList.toggle("ativo");

        if (!dropdown.classList.contains("ativo")) {
            toneSubmenu.element.classList.remove("ativo");
        }
    };
}

function setupToneSubmenuEvents(wrapper, submenu) {
    wrapper.addEventListener("mouseenter", () => {
        submenu.classList.add("ativo");
    });

    wrapper.addEventListener("mouseleave", () => {
        submenu.classList.remove("ativo");
    });
}

function setupDocumentEvents(wrapper, dropdown, toneSubmenu) {
    document.addEventListener("click", (event) => {
        if (!wrapper.contains(event.target)) {
            closeAllMenus(dropdown, toneSubmenu);
        }
    });
}

// UTILITARIOS

function closeAllMenus(dropdown, toneSubmenu) {
    dropdown.classList.remove("ativo");
    toneSubmenu.element.classList.remove("ativo");
}
