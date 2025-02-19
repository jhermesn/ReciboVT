// Constantes para chaves de armazenamento
const STORAGE_KEYS = {
    empregador: 'recibo_empregador',
    empregado: 'recibo_empregado',
    valorDia: 'recibo_valorDia',
    diasTrabalhados: 'recibo_diasTrabalhados',
    mesNumerico: 'recibo_mesNumerico',
    ano: 'recibo_ano',
    localTrabalhado: 'recibo_local'
};

// Referências aos elementos de entrada
const inputs = {
    empregador: document.getElementById('empregador'),
    empregado: document.getElementById('empregado'),
    valorDia: document.getElementById('valorDia'),
    diasTrabalhados: document.getElementById('diasTrabalhados'),
    mesNumerico: document.getElementById('mesNumerico'),
    ano: document.getElementById('ano'),
    localTrabalhado: document.getElementById('localTrabalhado')
};
const btnGerarPdf = document.getElementById('btnGerarPdf');

/**
 * Carrega os dados salvos no Local Storage.
 */
const carregarLocalStorage = () => {
    Object.keys(inputs).forEach((key) => {
        const savedValue = localStorage.getItem(STORAGE_KEYS[key]);
        if (savedValue) {
            inputs[key].value = savedValue;
        }
    });
};

window.addEventListener('load', carregarLocalStorage);

/**
 * Atualiza o Local Storage sempre que um campo for alterado.
 */
Object.values(inputs).forEach((input) => {
    input.addEventListener('change', () => {
        localStorage.setItem(STORAGE_KEYS.empregador, inputs.empregador.value.trim());
        localStorage.setItem(STORAGE_KEYS.empregado, inputs.empregado.value.trim());
        localStorage.setItem(STORAGE_KEYS.valorDia, inputs.valorDia.value.trim());
        localStorage.setItem(STORAGE_KEYS.diasTrabalhados, inputs.diasTrabalhados.value.trim());
        localStorage.setItem(STORAGE_KEYS.mesNumerico, inputs.mesNumerico.value.trim());
        localStorage.setItem(STORAGE_KEYS.ano, inputs.ano.value.trim());
        localStorage.setItem(STORAGE_KEYS.localTrabalhado, inputs.localTrabalhado.value.trim());
    });
});

/**
 * Retorna o nome do mês em português.
 * @param {number} mes - Número do mês (1-12).
 * @returns {string} Nome do mês.
 */
const obterNomeMes = (mes) => {
    const nomes = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return nomes[mes - 1] || '';
};

/**
 * Calcula o número de dias no mês para um dado ano.
 * @param {number} mes - Mês (1-12).
 * @param {number} ano - Ano.
 * @returns {number} Quantidade de dias.
 */
const diasNoMes = (mes, ano) => new Date(ano, mes, 0).getDate();

/**
 * Gera o PDF do recibo utilizando a biblioteca jsPDF.
 */
const gerarPDF = () => {
    const empregador = inputs.empregador.value.trim();
    const empregado = inputs.empregado.value.trim();
    const valorDia = parseFloat(inputs.valorDia.value);
    const diasTrabalhados = parseInt(inputs.diasTrabalhados.value, 10);
    const mesNumerico = parseInt(inputs.mesNumerico.value, 10);
    const ano = parseInt(inputs.ano.value, 10);
    const localTrabalhado = inputs.localTrabalhado.value.trim();

    // Validação dos campos
    if (
        !empregador || !empregado || !localTrabalhado ||
        isNaN(valorDia) || isNaN(diasTrabalhados) ||
        isNaN(mesNumerico) || isNaN(ano)
    ) {
        alert('Preencha todos os campos corretamente.');
        return;
    }
    if (mesNumerico < 1 || mesNumerico > 12) {
        alert('Mês inválido.');
        return;
    }
    if (ano < 2000 || ano > 2100) {
        alert('Ano fora do intervalo permitido (2000-2100).');
        return;
    }
    if (diasTrabalhados < 1 || diasTrabalhados > diasNoMes(mesNumerico, ano)) {
        alert('Número de dias trabalhados inválido para o mês informado.');
        return;
    }

    const valorTotal = valorDia * diasTrabalhados;
    const valorStr = 'R$ ' + valorTotal.toFixed(2).replace('.', ',');
    const nomeMes = obterNomeMes(mesNumerico);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const largura = doc.internal.pageSize.getWidth();
    const margemEsquerda = 50;
    let posY = 60;
    const linhaSimples = 20;
    const linhaDupla = 35;

    /**
     * Escreve uma ou mais linhas de texto na posição atual.
     * @param {string|string[]} texto - Texto ou array de textos.
     */
    const textoLinha = (texto) => {
        if (typeof texto === 'string') {
            doc.text(texto, margemEsquerda, posY);
            posY += linhaSimples;
        } else if (Array.isArray(texto)) {
            texto.forEach((linha) => {
                doc.text(linha, margemEsquerda, posY);
                posY += linhaSimples;
            });
        }
    };

    /**
     * Escreve um texto centralizado.
     * @param {string} txt - Texto a ser centralizado.
     * @param {number} [tamanhoFonte=14] - Tamanho da fonte.
     * @param {string} [estilo="normal"] - Estilo da fonte.
     */
    const textoCentralizado = (txt, tamanhoFonte = 14, estilo = 'normal') => {
        doc.setFontSize(tamanhoFonte);
        doc.setFont('Helvetica', estilo);
        doc.text(txt, largura / 2, posY, { align: 'center' });
        posY += linhaSimples;
    };

    const textoRecebi = `Recebi ${valorStr} de Vale-transporte, referente ao mês de ${nomeMes} pelo que firmo o presente.`;

    // Gerar duas vias do recibo
    for (let i = 0; i < 2; i++) {
        doc.setFontSize(24);
        doc.setFont('Helvetica', 'bold');
        doc.text('RECIBO', largura / 2, posY, { align: 'center' });
        posY += linhaDupla;

        doc.setFontSize(16);
        doc.setFont('Helvetica', 'bold');
        doc.text('Entrega de Vale-Transporte', largura / 2, posY, { align: 'center' });
        posY += linhaDupla;

        doc.setFontSize(14);
        doc.setFont('Helvetica', 'bold');
        textoLinha(`Empregador(a): ${empregador}`);
        textoLinha(`Empregado(a): ${empregado}`);

        doc.setFont('Helvetica', 'normal');
        const linhasTexto = doc.splitTextToSize(textoRecebi, largura - 2 * margemEsquerda);
        textoLinha(linhasTexto);
        posY += linhaDupla;

        textoCentralizado('________________________________________');
        textoCentralizado('Assinatura do Empregado');
        posY += linhaDupla;

        doc.text(localTrabalhado, largura / 2, posY, { align: 'center' });
        posY += linhaSimples;
        doc.text(`01/${String(mesNumerico).padStart(2, '0')}/${ano}`, largura / 2, posY, { align: 'center' });
        posY += linhaDupla;

        if (i === 0) {
            posY += linhaDupla;
        }
    }

    doc.save(`recibo-vale-transporte-${empregado}-${String(mesNumerico).padStart(2, '0')}-${ano}.pdf`);
};

btnGerarPdf.addEventListener('click', gerarPDF);

// Registro do Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) =>
                console.log('Service Worker registrado com escopo:', registration.scope)
            )
            .catch((error) =>
                console.error('Falha ao registrar o Service Worker:', error)
            );
    });
}
