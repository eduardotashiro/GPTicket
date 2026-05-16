/**
 * Cria o botão com dropdown de ações (expandir, resumir, etc)
 */

import { getActiveContainer } from "../utils/domUtils";

/**
 * Callback que será executado quando usuário escolher uma ação
 * (será substituído por quem importa este módulo)
 */
let onAcaoSelecionada = null;

/**
 * Define o callback de ação
 * @param {Function} callback - Function(acao, tom?)
 */
export function definirCallbackAcao(callback) {
    onAcaoSelecionada = callback;
}

/**
 * Cria o botão IA com dropdown
 */
export function adicionarBotaoIA() {
    const containerAtivo = getActiveContainer();

    if (!containerAtivo) return;

    const alvo = containerAtivo.querySelector(".actions-buttons-square-container");

    if (!alvo) return;

    const botaoExiste = alvo.querySelector(".btn-ia-ticket");

    if (botaoExiste) return;

    // Wrapper relativo (anchor pro dropdown)
    const wrapper = document.createElement("div");
    wrapper.style.cssText = "position:relative;display:inline-block;";

    // Botão principal 
    const botao = document.createElement("button");

    botao.classList.add(
        "btn-mv",
        "btn-mv-gray-default",
        "action-buttons-square",
        "btn-ia-ticket"
    );


    botao.type = "button";
    botao.title = "Aprimorar texto com IA";
    botao.innerHTML = "✨";

    // Dropdown 
    const dropdown = document.createElement("div");
    dropdown.classList.add("ia-dropdown");
    dropdown.style.cssText = `
        display: none;
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 6px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        z-index: 9999;
        min-width: 220px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        padding: 4px 0;
    `;

    // Submenu do tom 
    const submenuTom = criarSubmenuTom(dropdown);

    // Itens simples 
    const itensSimples = [
        { label: "Expandir o texto", acao: "expandir" },
        { label: "Resumir texto", acao: "resumir" },
        { label: "Simplificar linguagem", acao: "simplificar" },
        { label: "Corrigir ortografia e gramática", acao: "corrigir" },
    ];

    // Monta os itens
    itensSimples.forEach((item, i) => {
        const btn = criarItemDropdown(item.label, () => {
            fecharDropdown();
            if (onAcaoSelecionada) onAcaoSelecionada(item.acao);
        });

        dropdown.appendChild(btn);

        // Injeta submenu "Melhorar o tom" após "Resumir"
        if (i === 1) dropdown.appendChild(submenuTom.wrapper);
    });

    //Toggle dropdown 
    botao.onclick = (e) => {
        e.stopPropagation();
        const aberto = dropdown.style.display === "block";
        dropdown.style.display = aberto ? "none" : "block";
        if (aberto) submenuTom.elemento.style.display = "none";
    };

    // Fecha ao clicar fora 
    document.addEventListener("click", (e) => {
        if (!wrapper.contains(e.target)) fecharDropdown();
    });

    function fecharDropdown() {
        dropdown.style.display = "none";
        submenuTom.elemento.style.display = "none";
    }

    // Monta estrutura 
    wrapper.appendChild(botao);
    wrapper.appendChild(dropdown);
    alvo.appendChild(wrapper);
}

function criarItemDropdown(label, onClique) {
    const btn = document.createElement("button");
    btn.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 9px 16px;
        cursor: pointer;
        color: #333;
        white-space: nowrap;
        background: #fff;
        border: none;
        width: 100%;
        text-align: left;
        font-size: 14px;
        font-family: Arial, sans-serif;
    `;
    btn.textContent = label;
    btn.onclick = onClique;

    // Hover
    btn.addEventListener("mouseenter", () => btn.style.background = "#f5f5f5");
    btn.addEventListener("mouseleave", () => btn.style.background = "#fff");

    return btn;
}

/**
 * Cria submenu de tons
 */
function criarSubmenuTom(dropdownPai) {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = "position:relative;";

    const itemTom = document.createElement("button");
    itemTom.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 9px 16px;
        cursor: pointer;
        color: #333;
        background: #fff;
        border: none;
        width: 100%;
        text-align: left;
        font-size: 14px;
        font-family: Arial, sans-serif;
    `;
    itemTom.innerHTML = `Melhorar o tom <span style="font-size:12px;color:#888;">▶</span>`;

    const submenu = document.createElement("div");
    submenu.style.cssText = `
        display: none;
        position: absolute;
        left: calc(100% + 2px);
        top: 0;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 6px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        z-index: 10000;
        min-width: 140px;
        padding: 4px 0;
        font-family: Arial, sans-serif;
        font-size: 14px;
    `;

    ["Profissional", "Casual", "Amigável"].forEach(tom => {
        const sub = criarItemDropdown(tom, (e) => {
            e.stopPropagation();
            if (onAcaoSelecionada) onAcaoSelecionada("melhorar-tom", tom);
        });
        submenu.appendChild(sub);
    });

    // Hover no item "Melhorar o tom"
    wrapper.addEventListener("mouseenter", () => submenu.style.display = "block");
    wrapper.addEventListener("mouseleave", () => submenu.style.display = "none");
    itemTom.addEventListener("mouseenter", () => itemTom.style.background = "#f5f5f5");
    itemTom.addEventListener("mouseleave", () => itemTom.style.background = "#fff");

    wrapper.appendChild(itemTom);
    wrapper.appendChild(submenu);

    return {
        wrapper,
        elemento: submenu,
    };
}