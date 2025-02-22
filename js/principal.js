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

function dispositivoMovel() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

function gerarPDF() {
    const valorDia = parseFloat(entradas.valorDia.value)
    const diasTrab = parseInt(entradas.diasTrabalhados.value, 10)
    const mesNum = parseInt(entradas.mesNumerico.value, 10)
    const anoAtual = parseInt(entradas.ano.value, 10)
    const total = valorDia * diasTrab
    const informacoes = {
        total,
        totalStr: 'R$ ' + total.toFixed(2).replace('.', ','),
        mesNome: nomeDoMes(mesNum),
        empregado: entradas.empregado.value.trim(),
        empregador: entradas.empregador.value.trim(),
        mesNum,
        anoAtual,
        local: entradas.localTrabalhado.value.trim()
    }

    if (
        !informacoes.empregador ||
        !informacoes.empregado ||
        !informacoes.local ||
        isNaN(valorDia) ||
        isNaN(diasTrab) ||
        isNaN(mesNum) ||
        isNaN(anoAtual)
    ) {
        alert('Preencha todos os campos corretamente.')
        return
    }
    if (mesNum < 1 || mesNum > 12) {
        alert('Mês inválido.')
        return
    }
    if (anoAtual < 2000 || anoAtual > 2100) {
        alert('Ano fora do intervalo permitido (2000-2100).')
        return
    }
    if (diasTrab < 1 || diasTrab > diasNoMes(mesNum, anoAtual)) {
        alert('Número de dias trabalhados inválido para o mês informado.')
        return
    }

    if (dispositivoMovel()) {
        const { jsPDF } = window.jspdf
        const doc = new jsPDF('p', 'pt', 'a4')

        doc.html(gerarModelo(informacoes), {
            callback: (docFinal) => {
                docFinal.save('recibo-vale-transporte.pdf')
            },
            x: 10,
            y: 10,
            width: 600,
            windowWidth: 800
        })
    } else {
        const conteudo = gerarModelo(informacoes)
        const janelaNova = window.open('', '_blank')
        janelaNova.document.open()
        janelaNova.document.write(conteudo)
        janelaNova.document.close()
        janelaNova.onload = () => {
            janelaNova.print()
            janelaNova.onafterprint = () => {
                janelaNova.close()
            }
        }
    }
}

botaoGerarPdf.addEventListener('click', gerarPDF)

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
    })
}
