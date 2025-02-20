import { template } from "./template/template";

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
 * Gera o PDF do recibo.
 */
const gerarPDF = () => {
    // Extração dos valores dos inputs
    const valorDia = parseFloat(inputs.valorDia.value);
    const diasTrabalhados = parseInt(inputs.diasTrabalhados.value, 10);
    const mesNumerico = parseInt(inputs.mesNumerico.value, 10);
    const ano = parseInt(inputs.ano.value, 10);

    // Cálculo do valor total
    const valorTotal = valorDia * diasTrabalhados;

    // Criação do objeto de informações
    const info = {
        valorTotal: valorTotal,
        valorStr: 'R$ ' + valorTotal.toFixed(2).replace('.', ','),
        nomeMes: obterNomeMes(mesNumerico),
        empregado: inputs.empregado.value.trim(),
        empregador: inputs.empregador.value.trim(),
        ano: ano,
        localTrabalhado: inputs.localTrabalhado.value.trim()
    };

    const style = 0;

    // Validação dos campos
    if (
        !info.empregador || !info.empregado || !info.localTrabalhado ||
        isNaN(valorDia) || isNaN(diasTrabalhados) ||
        isNaN(mesNumerico) || isNaN(info.ano)
    ) {
        alert('Preencha todos os campos corretamente.');
        return;
    }
    if (mesNumerico < 1 || mesNumerico > 12) {
        alert('Mês inválido.');
        return;
    }
    if (info.ano < 2000 || info.ano > 2100) {
        alert('Ano fora do intervalo permitido (2000-2100).');
        return;
    }
    if (diasTrabalhados < 1 || diasTrabalhados > diasNoMes(mesNumerico, info.ano)) {
        alert('Número de dias trabalhados inválido para o mês informado.');
        return;
    }

    // Gera o documento HTML utilizando o template
    const documentContent = template(info, style);
    var novaJanela = window.open('', '_blank');
    novaJanela.document.open();
    novaJanela.document.write(documentContent);
    novaJanela.document.close();

    // Após o carregamento, abre a caixa de impressão e fecha a janela
    novaJanela.onload = function() {
        novaJanela.print();
        novaJanela.onafterprint = function() {
            novaJanela.close();
        };
    };
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
