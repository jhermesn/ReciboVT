# Gerador de Recibo de Vale-Transporte

Este projeto gera um **recibo de vale-transporte** baseado no [modelo oficial do GOV.BR](https://www.gov.br/esocial/pt-br/empregador-domestico/modelos-de-documentos/modelo-recibo-vale-transporte.doc) (eSocial). A aplicação está disponível em: [jhermesn.dev/ReciboVT](https://jhermesn.dev/ReciboVT).

---

## Tabela de Conteúdos
1. [Visão Geral](#visão-geral)
2. [Características Principais](#características-principais)
3. [Como Usar](#como-usar)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Tecnologias Utilizadas](#tecnologias-utilizadas)
6. [Referências](#referências)
7. [Contribuidores](#contribuidores)

---

## Visão Geral
Este projeto facilita a geração de **recibos de vale-transporte**, permitindo o preenchimento de dados como empregador, empregado, valor por dia, número de dias trabalhados e período do recebimento. Após a validação, é gerado um arquivo PDF com duas vias do recibo na **mesma folha**, visando sustentabilidade e economia de papel.

---

## Características Principais
- **Baseado no Modelo do GOV.BR**: Segue o modelo disponibilizado pelo eSocial para empregadores domésticos.  
- **Preenchimento de Campos**: Empregador, empregado, valor diário, dias trabalhados, mês e ano.  
- **Validação Básica**: Verifica se os valores estão dentro de faixas plausíveis (mês entre 1 e 12, ano entre 2000 e 2100, etc.).  
- **Duas Vias na Mesma Folha**: As duas vias do recibo são geradas na mesma página para reduzir desperdício de papel.  
- **Persistência Local**: Os campos preenchidos são armazenados em _localStorage_, evitando retrabalho ao recarregar a página.  
- **Exportação em PDF**: Gera e faz download do PDF utilizando a biblioteca [jsPDF](https://github.com/parallax/jsPDF).

---

## Como Rodar Localmente
1. **Clonar o repositório**:
   ```bash
   git clone https://github.com/jhermesn/ReciboVT.git
   ```
2. **Instalar ou atualizar dependências**:
    - O projeto usa apenas [jsPDF](https://github.com/parallax/jsPDF) via CDN, portanto não há necessidade de instalação local.

3. **Abrir o arquivo `index.html`** no navegador:
    - Preencha os campos de *Empregador(a)*, *Empregado(a)*, *Valor (R$) por dia*, *Dias trabalhados*, *Mês* e *Ano*.
    - Clique em **Gerar PDF**.
    - O recibo será criado e baixado automaticamente no formato PDF.

---

## Tecnologias Utilizadas
- **HTML5 e CSS3**: Marcação e estilos.
- **JavaScript**: Lógica de front-end para validação e persistência (_localStorage_).
- **[jsPDF](https://github.com/parallax/jsPDF)**: Geração e download de arquivos PDF.
- **[Modelo do GOV.BR](https://www.gov.br/esocial/pt-br/empregador-domestico/modelos-de-documentos/modelo-recibo-vale-transporte.doc)** para criação do recibo.

---

## Referências
- **eSocial (GOV.BR)**: [Modelo Oficial de Recibo de Vale-Transporte](https://www.gov.br/esocial/pt-br/empregador-domestico/modelos-de-documentos/modelo-recibo-vale-transporte.doc)
- **jsPDF**: [Parallax / jsPDF](https://github.com/parallax/jsPDF)

---  

## Contribuidores (Muito obrigado! ⭐)
- [Matheus William Freire](https://github.com/MatKerbino)

---

© 2025 [Jorge Hermes](https://jhermesn.dev) - Disponível em [Gerador de Recibo de Vale-Transporte](https://jhermesn.dev/ReciboVT).
