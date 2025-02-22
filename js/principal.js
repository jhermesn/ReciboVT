import { gerarModelo } from './htmlModelo/modeloHtml.js'

const CHAVES = {
    empregador: 'recibo_empregador',
    empregado: 'recibo_empregado',
    valorDia: 'recibo_valorDia',
    diasTrabalhados: 'recibo_diasTrabalhados',
    mesNumerico: 'recibo_mesNumerico',
    ano: 'recibo_ano',
    localTrabalhado: 'recibo_local'
}

const entradas = {
    empregador: document.getElementById('empregador'),
    empregado: document.getElementById('empregado'),
    valorDia: document.getElementById('valorDia'),
    diasTrabalhados: document.getElementById('diasTrabalhados'),
    mesNumerico: document.getElementById('mesNumerico'),
    ano: document.getElementById('ano'),
    localTrabalhado: document.getElementById('localTrabalhado')
}

const botaoGerarPdf = document.getElementById('botaoGerarPdf')
const areaParaGerar = document.getElementById('areaParaGerar')

function carregarArmazenamento() {
    Object.keys(entradas).forEach(chave => {
        const valor = localStorage.getItem(CHAVES[chave])
        if (valor) {
            entradas[chave].value = valor
        }
    })
}

window.addEventListener('load', carregarArmazenamento)

Object.values(entradas).forEach(campo => {
    campo.addEventListener('change', () => {
        localStorage.setItem(CHAVES.empregador, entradas.empregador.value.trim())
        localStorage.setItem(CHAVES.empregado, entradas.empregado.value.trim())
        localStorage.setItem(CHAVES.valorDia, entradas.valorDia.value.trim())
        localStorage.setItem(CHAVES.diasTrabalhados, entradas.diasTrabalhados.value.trim())
        localStorage.setItem(CHAVES.mesNumerico, entradas.mesNumerico.value.trim())
        localStorage.setItem(CHAVES.ano, entradas.ano.value.trim())
        localStorage.setItem(CHAVES.localTrabalhado, entradas.localTrabalhado.value.trim())
    })
})

function nomeDoMes(mes) {
    const nomes = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ]
    return nomes[mes - 1] || ''
}

function diasNoMes(mes, ano) {
    return new Date(ano, mes, 0).getDate()
}

function dadosRecibo() {
    const valorDia = parseFloat(entradas.valorDia.value)
    const diasTrab = parseInt(entradas.diasTrabalhados.value, 10)
    const mesNum = parseInt(entradas.mesNumerico.value, 10)
    const anoAtual = parseInt(entradas.ano.value, 10)
    const total = valorDia * diasTrab
    return {
        total,
        totalStr: 'R$ ' + total.toFixed(2).replace('.', ','),
        mesNome: nomeDoMes(mesNum),
        empregado: entradas.empregado.value.trim(),
        empregador: entradas.empregador.value.trim(),
        mesNum,
        anoAtual,
        local: entradas.localTrabalhado.value.trim()
    }
}

function validar(d) {
    if (!d.empregador || !d.empregado || !d.local || isNaN(d.total) || isNaN(d.mesNum) || isNaN(d.anoAtual)) {
        return false
    }
    if (d.mesNum < 1 || d.mesNum > 12) {
        return false
    }
    if (d.anoAtual < 2000 || d.anoAtual > 2100) {
        return false
    }
    if (d.total <= 0 || entradas.diasTrabalhados.value < 1 || entradas.diasTrabalhados.value > diasNoMes(d.mesNum, d.anoAtual)) {
        return false
    }
    return true
}

function gerarPDF() {
    const info = dadosRecibo()
    if (!validar(info)) {
        alert('Preencha todos os campos corretamente.')
        return
    }
    areaParaGerar.innerHTML = gerarModelo(info)

    const { jsPDF } = window.jspdf
    const doc = new jsPDF('p', 'pt', 'a4')
    html2canvas(areaParaGerar, {
        backgroundColor: '#ffffff',
        scale: 3
    }).then(canvas => {
        const larguraPagina = doc.internal.pageSize.getWidth()
        const alturaPagina = doc.internal.pageSize.getHeight()
        const imgData = canvas.toDataURL('image/png')
        doc.addImage(imgData, 'PNG', 0, 0, larguraPagina, alturaPagina)
        doc.save(`recibo-vale-transporte-${info.empregado}-${String(info.mesNum).padStart(2, '0')}-${info.anoAtual}.pdf`)
    })
}

botaoGerarPdf.addEventListener('click', gerarPDF)

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/ReciboVT/service-worker.js', { scope: '/ReciboVT/' })
    })
}
