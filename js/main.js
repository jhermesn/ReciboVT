const STORAGE_KEYS = {
    empregador: 'recibo_empregador',
    empregado: 'recibo_empregado',
    valorDia: 'recibo_valorDia',
    diasTrabalhados: 'recibo_diasTrabalhados',
    mesNumerico: 'recibo_mesNumerico',
    ano: 'recibo_ano',
    localTrabalhado: 'recibo_local'
};

const empregadorInput = document.getElementById('empregador');
const empregadoInput = document.getElementById('empregado');
const valorDiaInput = document.getElementById('valorDia');
const diasTrabalhadosInput = document.getElementById('diasTrabalhados');
const mesNumericoInput = document.getElementById('mesNumerico');
const anoInput = document.getElementById('ano');
const localTrabalhadoInput = document.getElementById('localTrabalhado');
const btnGerarPdf = document.getElementById('btnGerarPdf');

function carregarLocalStorage() {
    if (localStorage.getItem(STORAGE_KEYS.empregador)) {
        empregadorInput.value = localStorage.getItem(STORAGE_KEYS.empregador);
    }
    if (localStorage.getItem(STORAGE_KEYS.empregado)) {
        empregadoInput.value = localStorage.getItem(STORAGE_KEYS.empregado);
    }
    if (localStorage.getItem(STORAGE_KEYS.valorDia)) {
        valorDiaInput.value = localStorage.getItem(STORAGE_KEYS.valorDia);
    }
    if (localStorage.getItem(STORAGE_KEYS.diasTrabalhados)) {
        diasTrabalhadosInput.value = localStorage.getItem(STORAGE_KEYS.diasTrabalhados);
    }
    if (localStorage.getItem(STORAGE_KEYS.mesNumerico)) {
        mesNumericoInput.value = localStorage.getItem(STORAGE_KEYS.mesNumerico);
    }
    if (localStorage.getItem(STORAGE_KEYS.ano)) {
        anoInput.value = localStorage.getItem(STORAGE_KEYS.ano);
    }
    if (localStorage.getItem(STORAGE_KEYS.localTrabalhado)) {
        localTrabalhadoInput.value = localStorage.getItem(STORAGE_KEYS.localTrabalhado);
    }
}

window.addEventListener('load', carregarLocalStorage);

[
    empregadorInput,
    empregadoInput,
    valorDiaInput,
    diasTrabalhadosInput,
    mesNumericoInput,
    anoInput,
    localTrabalhadoInput
].forEach(input => {
    input.addEventListener('change', () => {
        localStorage.setItem(STORAGE_KEYS.empregador, empregadorInput.value.trim());
        localStorage.setItem(STORAGE_KEYS.empregado, empregadoInput.value.trim());
        localStorage.setItem(STORAGE_KEYS.valorDia, valorDiaInput.value.trim());
        localStorage.setItem(STORAGE_KEYS.diasTrabalhados, diasTrabalhadosInput.value.trim());
        localStorage.setItem(STORAGE_KEYS.mesNumerico, mesNumericoInput.value.trim());
        localStorage.setItem(STORAGE_KEYS.ano, anoInput.value.trim());
        localStorage.setItem(STORAGE_KEYS.localTrabalhado, localTrabalhadoInput.value.trim());
    });
});

function obterNomeMes(mes) {
    const nomes = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];
    return nomes[mes - 1] || '';
}

function diasNoMes(mes, ano) {
    return new Date(ano, mes, 0).getDate();
}

function gerarPDF() {
    const empregador = empregadorInput.value.trim();
    const empregado = empregadoInput.value.trim();
    const valorDia = parseFloat(valorDiaInput.value);
    const diasTrabalhados = parseInt(diasTrabalhadosInput.value, 10);
    const mesNumerico = parseInt(mesNumericoInput.value, 10);
    const ano = parseInt(anoInput.value, 10);
    const localTrabalhado = localTrabalhadoInput.value.trim();

    if (
        !empregador || !empregado || !localTrabalhado ||
        isNaN(valorDia) || isNaN(diasTrabalhados) ||
        isNaN(mesNumerico) || isNaN(ano)
    ) {
        alert("Preencha todos os campos corretamente.");
        return;
    }
    if (mesNumerico < 1 || mesNumerico > 12) {
        alert("Mês inválido.");
        return;
    }
    if (ano < 2000 || ano > 2100) {
        alert("Ano fora do intervalo permitido (2000-2100).");
        return;
    }
    if (diasTrabalhados < 1 || diasTrabalhados > diasNoMes(mesNumerico, ano)) {
        alert("Número de dias trabalhados inválido para o mês informado.");
        return;
    }

    const valorTotal = valorDia * diasTrabalhados;
    const valorStr = "R$ " + valorTotal.toFixed(2).replace('.', ',');
    const nomeMes = obterNomeMes(mesNumerico);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const largura = doc.internal.pageSize.getWidth();
    const margemEsquerda = 50;
    let posY = 60;
    const linhaSimples = 20;
    const linhaDupla = 35;

    function textoLinha(texto) {
        if (typeof texto === 'string') {
            doc.text(texto, margemEsquerda, posY);
            posY += linhaSimples;
        } else {
            texto.forEach(l => {
                doc.text(l, margemEsquerda, posY);
                posY += linhaSimples;
            });
        }
    }

    function textoCentralizado(txt, tamanhoFonte = 14, estilo = "normal") {
        doc.setFontSize(tamanhoFonte);
        doc.setFont("Helvetica", estilo);
        doc.text(txt, largura / 2, posY, { align: "center" });
        posY += linhaSimples;
    }

    const textoRecebi = `Recebi ${valorStr} de Vale-transporte, referente ao mês de ${nomeMes} pelo que firmo o presente.`;

    for (let i = 0; i < 2; i++) {
        doc.setFontSize(24);
        doc.setFont("Helvetica", "bold");
        doc.text("RECIBO", largura / 2, posY, { align: "center" });
        posY += linhaDupla;

        doc.setFontSize(16);
        doc.setFont("Helvetica", "bold");
        doc.text("Entrega de Vale-Transporte", largura / 2, posY, { align: "center" });
        posY += linhaDupla;

        doc.setFontSize(14);
        doc.setFont("Helvetica", "bold");
        textoLinha(`Empregador(a): ${empregador}`);
        textoLinha(`Empregado(a): ${empregado}`);

        doc.setFont("Helvetica", "normal");
        const linhasTexto = doc.splitTextToSize(textoRecebi, largura - 2 * margemEsquerda);
        textoLinha(linhasTexto);
        posY += linhaDupla;

        textoCentralizado("________________________________________");
        textoCentralizado("Assinatura do Empregado");
        posY += linhaDupla;

        doc.text(localTrabalhado, largura / 2, posY, { align: "center" });
        posY += linhaSimples;
        doc.text(`01/${String(mesNumerico).padStart(2, '0')}/${ano}`, largura / 2, posY, { align: "center" });
        posY += linhaDupla;

        if (i === 0) {
            posY += linhaDupla;
        }
    }

    doc.save(`recibo-vale-transporte-${empregado}-${String(mesNumerico).padStart(2, '0')}-${ano}.pdf`);
}

btnGerarPdf.addEventListener('click', gerarPDF);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(r => console.log('Service Worker registrado', r.scope))
            .catch(e => console.error('Falha ao registrar', e));
    });
}
