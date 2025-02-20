/**
 * @param {info} info - conjunto de dados
 */
function jsPDF(info) {
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
  
    const textoRecebi = `Recebi ${info.valorStr} de Vale-transporte, referente ao mês de ${info.nomeMes} pelo que firmo o presente.`;
  
    // Gera duas vias do recibo
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
      textoLinha(`Empregador(a): ${info.empregador}`);
      textoLinha(`Empregado(a): ${info.empregado}`);
  
      doc.setFont('Helvetica', 'normal');
      const linhasTexto = doc.splitTextToSize(textoRecebi, largura - 2 * margemEsquerda);
      textoLinha(linhasTexto);
      posY += linhaDupla;
  
      textoCentralizado('________________________________________________________________');
      textoCentralizado('Assinatura do Empregado');
      posY += linhaDupla;
  
      doc.text(info.localTrabalhado, largura / 2, posY, { align: 'center' });
      posY += linhaSimples;
      doc.text(`01/${String(info.mesNumerico).padStart(2, '0')}/${info.ano}`, largura / 2, posY, { align: 'center' });
      posY += linhaDupla;
  
      if (i === 0) {
        // Espaço extra entre um recibo e outro
        posY += linhaDupla;
      }
    }
  
    doc.save(`recibo-vale-transporte-${info.empregado}-${String(info.mesNumerico).padStart(2, '0')}-${info.ano}.pdf`);
  };
  
  export { jsPDF }; 