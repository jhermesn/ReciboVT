import { template } from './htmlTemplate/template.js';

const STORAGE_KEYS = {
    empregador: 'recibo_empregador',
    empregado: 'recibo_empregado',
    valorDia: 'recibo_valorDia',
    diasTrabalhados: 'recibo_diasTrabalhados',
    mesNumerico: 'recibo_mesNumerico',
    ano: 'recibo_ano',
    localTrabalhado: 'recibo_local'
};

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

function carregarLocalStorage() {
    Object.keys(inputs).forEach((key) => {
        const savedValue = localStorage.getItem(STORAGE_KEYS[key]);
        if (savedValue) {
            inputs[key].value = savedValue;
        }
    });
}

window.addEventListener('load', carregarLocalStorage);

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

function obterNomeMes(mes) {
    const nomes = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return nomes[mes - 1] || '';
}

function diasNoMes(mes, ano) {
    return new Date(ano, mes, 0).getDate();
}

function gerarPDF() {
    const valorDia = parseFloat(inputs.valorDia.value);
    const diasTrabalhados = parseInt(inputs.diasTrabalhados.value, 10);
    const mesNumerico = parseInt(inputs.mesNumerico.value, 10);
    const ano = parseInt(inputs.ano.value, 10);
    const valorTotal = valorDia * diasTrabalhados;

    const info = {
        valorTotal,
        valorStr: 'R$ ' + valorTotal.toFixed(2).replace('.', ','),
        nomeMes: obterNomeMes(mesNumerico),
        empregado: inputs.empregado.value.trim(),
        empregador: inputs.empregador.value.trim(),
        mesNumerico,
        ano,
        localTrabalhado: inputs.localTrabalhado.value.trim()
    };

    if (
        !info.empregador ||
        !info.empregado ||
        !info.localTrabalhado ||
        isNaN(valorDia) ||
        isNaN(diasTrabalhados) ||
        isNaN(mesNumerico) ||
        isNaN(info.ano)
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

    // Always uses the HTML template approach
    const documentContent = template(info);
    const novaJanela = window.open('', '_blank');
    novaJanela.document.open();
    novaJanela.document.write(documentContent);
    novaJanela.document.close();
    novaJanela.onload = () => {
        novaJanela.print();
        novaJanela.onafterprint = () => {
            novaJanela.close();
        };
    };
}

btnGerarPdf.addEventListener('click', gerarPDF);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registrado:', reg.scope))
            .catch(err => console.error('Falha ao registrar Service Worker:', err));
    });
}
