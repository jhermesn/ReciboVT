function gerarRecibo(info) {
    return `
    <div class="recibo">
      <h1>RECIBO</h1>
      <h2>Entrega de Vale-Transporte</h2>
      <p><strong>Empregador(a):</strong> ${info.empregador}</p>
      <p><strong>Empregado(a):</strong> ${info.empregado}</p>
      <p>Recebi ${info.totalStr} de Vale-transporte, referente ao mês de ${info.mesNome}, pelo que firmo o presente.</p>
      <div class="assinatura">
        <p>Assinatura do Empregado</p>
      </div>
      <div class="rodape">
        <p>${info.local}</p>
        <p>01/${String(info.mesNum).padStart(2, '0')}/${info.anoAtual}</p>
      </div>
    </div>
  `
}

function gerarModelo(info) {
    return `
    <div class="paginaA4">
      ${gerarRecibo(info)}
      ${gerarRecibo(info)}
    </div>
  `
}

export { gerarRecibo, gerarModelo }
