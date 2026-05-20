import { getActiveContainer } from "../utils/domUtils";
import "../styles/button.css";

/**
 * Callback executado quando o usuário escolhe uma ação
 */
let onAcaoSelecionada = null;

/**
 * Define callback externo
 */
export function definirCallbackAcao(callback) {
    onAcaoSelecionada = callback;
}

/**
 * Cria botão IA
 */
export function adicionarBotaoIA() {
    const containerAtivo = getActiveContainer();
    if (!containerAtivo) return;

    const alvo = containerAtivo.querySelector(".actions-buttons-square-container");
    if (!alvo) return;

    const botaoExiste = alvo.querySelector(".btn-ia-ticket");
    if (botaoExiste) return;

    // Wrapper
    const wrapper = document.createElement("div");
    wrapper.classList.add("ia-wrapper");

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

    // Submenu
    const submenuTom = criarSubmenuTom();

    // Ações
    const itensSimples = [
        { label: "Expandir o texto", acao: "expandir" },
        { label: "Resumir texto", acao: "resumir" },
        { label: "Simplificar linguagem", acao: "simplificar" },
        { label: "Corrigir ortografia e gramática", acao: "corrigir" },
    ];

    // Cria itens
    itensSimples.forEach((item, i) => {

        const btn = criarItemDropdown(item.label, () => {
            fecharDropdown();

            if (onAcaoSelecionada) {
                onAcaoSelecionada(item.acao);
            }
        });

        dropdown.appendChild(btn);

        // Injeta submenu após "Resumir texto"
        if (i === 1) {
            dropdown.appendChild(submenuTom.wrapper);
        }
    });

    // Toggle dropdown
    botao.onclick = (e) => {
        e.stopPropagation();

        dropdown.classList.toggle("ativo");

        // Fecha submenu ao fechar dropdown
        if (!dropdown.classList.contains("ativo")) {
            submenuTom.elemento.classList.remove("ativo");
        }
    };

    // Fecha ao clicar fora
    document.addEventListener("click", (e) => {

        if (!wrapper.contains(e.target)) {
            fecharDropdown();
        }
    });

    // Fecha tudo
    function fecharDropdown() {
        dropdown.classList.remove("ativo");
        submenuTom.elemento.classList.remove("ativo");
    }

    // Monta estrutura
    wrapper.appendChild(botao);
    wrapper.appendChild(dropdown);

    alvo.appendChild(wrapper);
}

/**
 * Cria item do dropdown
 */
function criarItemDropdown(label, onClique) {

    const btn = document.createElement("button");

    btn.classList.add("ia-dropdown-item");

    btn.textContent = label;

    btn.onclick = onClique;

    return btn;
}

/**
 * Cria submenu de tom
 */
function criarSubmenuTom() {

    const wrapper = document.createElement("div");
    wrapper.classList.add("ia-submenu-wrapper");

    // Botão principal
    const itemTom = document.createElement("button");

    itemTom.classList.add("ia-dropdown-item");

    itemTom.innerHTML = `
        Melhorar o tom
        <span class="ia-seta">▶</span>
    `;

    // Submenu
    const submenu = document.createElement("div");
    submenu.classList.add("ia-submenu");

    // Tons
    ["Profissional", "Casual", "Amigável"].forEach((tom) => {

        const sub = criarItemDropdown(tom, (e) => {

            e.stopPropagation();

            if (onAcaoSelecionada) {
                onAcaoSelecionada("melhorar-tom", tom);
            }
        });

        submenu.appendChild(sub);
    });

    // Hover abre submenu
    wrapper.addEventListener("mouseenter", () => {
        submenu.classList.add("ativo");
    });

    // Hover sai submenu
    wrapper.addEventListener("mouseleave", () => {
        submenu.classList.remove("ativo");
    });

    wrapper.appendChild(itemTom);
    wrapper.appendChild(submenu);

    return {
        wrapper,
        elemento: submenu,
    };
}