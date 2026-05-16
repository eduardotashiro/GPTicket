/**
 * scoreCirculo.js
 * Componente que renderiza um círculo de score com arco proporcional
 * 
 * Usa SVG stroke-dasharray + dashoffset para desenhar um arco
 * Circunferência = 2 * π * r
 */

/**
 * Gera um SVG de score circular
 * @param {number} valor - Valor atual (ex: 7)
 * @param {number} max - Valor máximo (ex: 10)
 * @param {string} cor - Cor do arco (ex: "#ef4444")
 * @returns {string} SVG HTML
 */
export function criarScoreCirculo(valor, max, cor) {
    const raio = 9;
    const circunferencia = 2 * Math.PI * raio;
    const porcentagem = valor / max;
    const dashoffset = circunferencia * (1 - porcentagem);

    return `
        <svg viewBox="0 0 24 24" style="width:22px;height:22px;transform:rotate(-90deg);">
            <!-- Círculo de fundo (cinza) -->
            <circle cx="12" cy="12" r="${raio}" fill="none" stroke="#e5e7eb" stroke-width="2.5"/>
            <!-- Arco colorido proporcional ao valor -->
            <circle cx="12" cy="12" r="${raio}" fill="none" stroke="${cor}" stroke-width="2.5"
                stroke-dasharray="${circunferencia}"
                stroke-dashoffset="${dashoffset}"
                stroke-linecap="round"/>
        </svg>
    `;
}

/**
 * Define a cor baseado no valor (escala de satisfação/risco)
 * @param {number} valor - Valor de 0 a 10
 * @param {boolean} isChurn - Se é risco de churn (inverte a lógica)
 * @returns {string} Cor em hex
 */

export function obterCorScore(valor, isChurn = false) {
    if (isChurn) {
        if (valor <= 3) return "#22c55e";  
        if (valor <= 6) return "#f97316";  
        return "#ef4444";                  
    } else {
        if (valor >= 7) return "#f5a623";  
        if (valor >= 4) return "#f97316";  
        return "#ef4444";                  
    }
}