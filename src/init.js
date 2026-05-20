/**
 * Arquivo principal que orquestra tudo:
 * - Cria o botão IA
 * - Cria o painel de análise
 * - Conecta ao modal
 * - Detecta mudanças de página (SPA) e recarrega
 */

import { adicionarBotaoIA, definirCallbackAcao } from "./components/button";
import { adicionarPainelIA, definirCallbackSugestao } from "./components/panel";
import { abrirModal } from "./components/modal";

// ═══════════════════════════════════════
// INICIALIZAÇÃO PRINCIPAL
// ═══════════════════════════════════════

/**
 * Função principal: inicializa todos os componentes
 */
function iniciarGPTicket() {
    console.log("[GPTicket] Inicializando...");

    // Define o callback do botão: quando usuário clica numa ação, abre modal
    definirCallbackAcao((acao, tom) => {
        console.log("[GPTicket] Ação selecionada:", acao, tom);
        abrirModal(acao, tom);
    });

    // Define o callback do painel: quando usuário clica em "Usar sugestão"
    definirCallbackSugestao(() => {
        console.log("[GPTicket] Sugestão aplicada ao editor");
    });

    // Cria os componentes
    adicionarBotaoIA();
    adicionarPainelIA();

    console.log("[GPTicket] Inicialização concluída");
}

// ═══════════════════════════════════════
// DETECÇÃO DE MUDANÇAS (SPA)
// ═══════════════════════════════════════

/**
 * Detecta quando a URL muda (navegação em SPA)
 * Se detectar mudança, recarrega os componentes
 */
let ultimaUrl = location.href;

const intervaloSPA = setInterval(() => {
    if (location.href !== ultimaUrl) {
        ultimaUrl = location.href;
        console.log("[GPTicket] URL mudou, reinicializando...");

        // Aguarda um pouco para o DOM ser atualizado
        setTimeout(() => {
            iniciarGPTicket();
        }, 800);
    }
}, 500);

iniciarGPTicket();

// Log de sucesso
console.log("[GPTicket] Extension carregada com sucesso ✨");