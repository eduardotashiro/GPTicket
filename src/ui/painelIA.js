/**
 * painelIA.js
 * Crea el panel de análisis de IA con datos simulados.
 * Incluye: intención, satisfacción, churn,  resumen y sugerencias.
 */

import { copyToClipboard, copyLines } from "../utils/clipboardUtils";
import { icons } from "../utils/svgIcons";
import { applyTextToEditor } from "../utils/editorManager";
import { getActiveContainer } from "../utils/domUtils";
/**
 * Función de devolución de llamada que se ejecutará cuando el usuario haga clic en "Usar sugerencia".
 */
let onUsarSugestao = null;

/**
 * Define o callback de uso da sugestão
 * @param {Function} callback
 */
export function definirCallbackSugestao(callback) {
    onUsarSugestao = callback;
}

/**
 * Datos simulados (en el futuro provendrán de la API)
 */
const dadosPadroes = {
    intencao: "Cliente questiona ausência de repasse financeiro e solicita prazo para regularização.",
    resumo: [
        "Cliente relata que o repasse financeiro acordado não foi realizado no prazo",
        "Valor do repasse pendente não foi especificado, aguarda confirmação do financeiro",
        "Cliente solicita posicionamento urgente sobre data de pagamento",
    ],
    sugestao: "Prezado cliente,\nAgradecemos o contato bla bla bla bla ",
};

/**
 * Cria o painel de análise IA
 * @param {Object} dados - Dados customizados (opcional)
 */
export function adicionarPainelIA(dados = {}) {
    const containerAtivo = getActiveContainer();
    if (!containerAtivo) return;

    const alvo = containerAtivo.querySelector(".row.action-buttons");
    if (!alvo) return;

    // Evite la duplicación.
    if (alvo.parentElement.querySelector(".painel-ia")) return;

    // Merge datos (custom + padrão)
    const dadosFinais = { ...dadosPadroes, ...dados };

    // Itens do resumo como HTML 
    const itensResumo = dadosFinais.resumo.map(item =>
        `<li style="display:flex;gap:8px;margin-bottom:8px;line-height:1.4;">
            <span style="color:#888;flex-shrink:0;">•</span>${item}
        </li>`
    ).join("");

    // Cria o painel 
    const painel = document.createElement("div");
    painel.className = "painel-ia";
    painel.innerHTML = `
        <div style="margin-top:10px;border:1px solid #ddd;background:#fff;border-radius:6px;font-family:Arial;">

            <!-- HEADER -->
            <div style="padding:10px 14px;display:flex;justify-content:space-between;align-items:center;color:#6c4cff;font-weight:bold;font-size:14px;">
                <span>✨ Análise gerada por IA</span>
                <button id="toggle-ia" style="border:none;background:none;color:#6c4cff;cursor:pointer;font-weight:bold;display:flex;align-items:center;gap:6px;font-size:13px;">
                    ${icons.closedEye()}
                    ${icons.openEye()}
                    <span id="texto-toggle">Ver análise</span>
                </button>
            </div>

            <!-- WRAPPER COLAPSÁVEL -->
            <div id="wrapper-colapsavel" style="max-height:0;overflow:hidden;transition:max-height 0.4s ease,opacity 0.3s ease;opacity:0;">

                <!-- GRID 2 COLUNAS -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 12px 12px 12px;">

                    <!-- CARD CLIENTE -->
                    <div style="border:1px solid #e0e0e0;border-radius:8px;padding:14px;">
                        <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#555;font-weight:600;margin-bottom:12px;">
                            ${icons.user()}
                            Cliente
                        </div>
                    
                        <!-- Intenção -->
                        <div style="display:flex;gap:10px;margin-bottom:10px;font-size:13px;align-items:flex-start;">
                            <span style="color:#999;width:90px;flex-shrink:0;padding-top:2px;">Intenção</span>
                            <div style="display:flex;align-items:flex-start;gap:6px;flex:1;">
                                <span id="texto-intencao" style="color:#222;font-weight:600;line-height:1.4;flex:1;">${dadosFinais.intencao}</span>
                                <button id="btn-copiar-intencao" style="border:none;background:none;cursor:pointer;color:#aaa;padding:2px;flex-shrink:0;" title="Copiar">${icons.copy()}</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- CARD RESUMO -->
                    <div style="border:1px solid #e0e0e0;border-radius:8px;padding:14px;">
                        <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#555;font-weight:600;margin-bottom:12px;">
                            ${icons.list()}
                            Resumo da solicitação
                            <div style="margin-left:auto;display:flex;gap:6px;">
                                <button id="btn-refresh-resumo" style="border:none;background:none;cursor:pointer;color:#aaa;padding:2px;" title="Atualizar">${icons.refresh()}</button>
                                <button id="btn-copiar-resumo" style="border:none;background:none;cursor:pointer;color:#aaa;padding:2px;" title="Copiar resumo">${icons.copy()}</button>
                            </div>
                        </div>
                        <ul style="list-style:none;padding:0;margin:0;font-size:13px;color:#333;">
                            ${itensResumo}
                        </ul>
                    </div>

                </div>

                <!-- CARD SUGESTÃO DE RESPOSTA -->
                <div style="border:1px solid #e0e0e0;border-radius:8px;padding:14px;margin:0 12px 12px 12px;">
                    <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#555;font-weight:600;margin-bottom:10px;">
                        ${icons.message()}
                        Sugestão de resposta
                        <div style="margin-left:auto;display:flex;gap:6px;">
                            <button id="btn-refresh-sugestao" style="border:none;background:none;cursor:pointer;color:#aaa;padding:2px;" title="Atualizar">${icons.refresh()}</button>
                            <button id="btn-copiar-sugestao" style="border:none;background:none;cursor:pointer;color:#aaa;padding:2px;" title="Copiar sugestão">${icons.copy()}</button>
                            <button id="btn-enviar-sugestao" style="border:none;background:none;cursor:pointer;color:#aaa;padding:2px;" title="Usar sugestão">${icons.send()}</button>
                        </div>
                    </div>
                    <p id="texto-sugestao" style="margin:0;font-size:13px;color:#333;line-height:1.5;">${dadosFinais.sugestao}</p>
                </div>

            </div>

            <!-- CAMPO DE PERGUNTA -->
            <div style="padding:0 12px 12px 12px;">
                <input type="text" placeholder="Fazer pergunta para IA sobre esse ticket..."
                    style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:13px;box-sizing:border-box;outline:none;"/>
            </div>

        </div>
    `;

    alvo.insertAdjacentElement("afterend", painel);

    // Event listeners 
    anexarEventosDoPainel(painel, dadosFinais);
}

function anexarEventosDoPainel(painel, dados) {
    const btnCopiarIntencao = painel.querySelector("#btn-copiar-intencao");
    const btnCopiarResumo = painel.querySelector("#btn-copiar-resumo");
    const btnRefreshResumo = painel.querySelector("#btn-refresh-resumo");
    const btnCopiarSugestao = painel.querySelector("#btn-copiar-sugestao");
    const btnRefreshSugestao = painel.querySelector("#btn-refresh-sugestao");
    const btnEnviarSugestao = painel.querySelector("#btn-enviar-sugestao");


    if (btnCopiarIntencao) {
        btnCopiarIntencao.onclick = () => copyToClipboard(dados.intencao, btnCopiarIntencao);
    }

    if (btnCopiarResumo) {
        btnCopiarResumo.onclick = () => copyLines(dados.resumo, btnCopiarResumo);
    }


    if (btnRefreshResumo) {
        btnRefreshResumo.onclick = () => aplicarAnimacaoRotacao(btnRefreshResumo);
    }

    if (btnCopiarSugestao) {
        btnCopiarSugestao.onclick = () => copyToClipboard(dados.sugestao, btnCopiarSugestao);
    }

    if (btnRefreshSugestao) {
        btnRefreshSugestao.onclick = () => aplicarAnimacaoRotacao(btnRefreshSugestao);
    }

    if (btnEnviarSugestao) {
        btnEnviarSugestao.onclick = () => {
            applyTextToEditor(dados.sugestao);
            if (onUsarSugestao) onUsarSugestao();
        };
    }

    // Toggle ocultar/mostrar
    const toggle = painel.querySelector("#toggle-ia");
    const wrapper = painel.querySelector("#wrapper-colapsavel");
    const iconeAberto = painel.querySelector("#icon-open-eye");
    const iconeFechado = painel.querySelector("#icon-closed-eye");
    const textoToggle = painel.querySelector("#texto-toggle");

    let visivel = false;

    if (toggle) {
        toggle.onclick = () => {
            visivel = !visivel;

            if (visivel) {
                wrapper.style.transition = "max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease";
                wrapper.style.maxHeight = "500px";
                wrapper.style.opacity = "1";
                if (iconeAberto) iconeAberto.style.display = "block";
                if (iconeFechado) iconeFechado.style.display = "none";
                if (textoToggle) textoToggle.textContent = "Ocultar análise";
            } else {
                wrapper.style.transition = "max-height 0.4s ease, opacity 0.3s ease";
                wrapper.style.maxHeight = "0";
                wrapper.style.opacity = "0";
                if (iconeAberto) iconeAberto.style.display = "none";
                if (iconeFechado) iconeFechado.style.display = "block";
                if (textoToggle) textoToggle.textContent = "Ver análise";
            }
        };
    }
}

function aplicarAnimacaoRotacao(botao) {
    botao.style.transition = "transform 0.6s ease";
    botao.style.transform = "rotate(360deg)";
    setTimeout(() => {
        botao.style.transition = "";
        botao.style.transform = "";
    }, 600);
}