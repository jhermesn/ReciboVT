function gerarRecibo(info) {
    return `
    <div class="recibo">
      <h1>RECIBO</h1>
      <h2>Entrega de Vale-Transporte</h2>
      <p><strong>Empregador(a):</strong> ${info.empregador}</p>
      <p><strong>Empregado(a):</strong> ${info.empregado}</p>
      <p>Recebi ${info.totalStr} de Vale-transporte, referente ao mês de ${info.mesNome} pelo que firmo o presente.</p>
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
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Recibo Vale-Transporte</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          background: #f7f7f7;
          color: #000000;
        }
        .container {
          max-width: 650px;
          margin: 0 auto;
        }
        .recibo {
          background: #fff;
          border: 1px solid #000;
          padding: 20px;
          margin-bottom: 40px;
        }
        .recibo h1 {
          text-align: center;
          font-size: 24px;
          margin-bottom: 10px;
        }
        .recibo h2 {
          text-align: center;
          font-size: 18px;
          margin-bottom: 20px;
        }
        .recibo p {
          font-size: 16px;
          margin: 8px 0;
        }
        .recibo p strong {
          display: inline-block;
          width: 120px;
        }
        .assinatura {
          margin-top: 30px;
          display: flex;
          justify-content: center;
        }
        .assinatura p {
          border-top: 1px solid #000;
          padding-top: 5px;
          width: 300px;
          text-align: center;
        }
        .rodape {
          margin-top: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${gerarRecibo(info)}
        ${gerarRecibo(info)}
      </div>
    </body>
    </html>
  `
}

export { gerarModelo }
