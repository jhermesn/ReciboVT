function template (info, styles) {
    const page = 
    
    `
    <!DOCTYPE html>
    <html lang="pt-BR">
        <head>
        <meta charset="UTF-8">
        <title>Recibo Vale-Transporte</title>
        <style>
            body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background: #f7f7f7;
            }
            .container {
            max-width: 650px;
            margin: 0 auto;
            }
            .receipt {
            background: #fff;
            border: 1px solid #000;
            padding: 20px;
            margin-bottom: 40px;
            }
            .receipt h1 {
            text-align: center;
            font-size: 24px;
            margin-bottom: 10px;
            }
            .receipt h2 {
            text-align: center;
            font-size: 18px;
            margin-bottom: 20px;
            }
            .receipt p {
            font-size: 16px;
            margin: 8px 0;
            }
            .receipt p strong {
            display: inline-block;
            width: 150px;
            }
            .signature {
            margin-top: 30px;
            text-align: left;
            }
            .signature p {
            border-top: 1px solid #000;
            padding-top: 5px;
            width: 300px;
            }
            .footer {
            margin-top: 20px;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <!-- Primeiro Recibo -->
            <div class="receipt">
            <h1>RECIBO</h1>
            <h2>Entrega de Vale-Transporte</h2>
            <p><strong>Empregador(a):</strong> ${info.Empregador}</p>
            <p><strong>Empregado(a):</strong> ${info.Empregado}</p>
            <p>Recebi ${info.valorStr} de Vale-transporte, referente ao mês de ${info.nomeMes} pelo que firmo o presente.</p>
            <div class="signature">
                <p>________________________________________'</p>
                <p>Assinatura do Empregado</p>
            </div>
            <div class="footer">
                <p>${info.localTrabalhado}</p>
                <p>01/${String(info.mesNumerico).padStart(2, '0')}/${info.ano}</p>
            </div>
            </div>
        </div>
        </body>
    </html>
    `   
    
    return page;
}

export {template};



