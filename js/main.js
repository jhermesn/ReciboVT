const STORAGE_KEYS={empregador:'recibo_empregador',empregado:'recibo_empregado',valorDia:'recibo_valorDia',diasTrabalhados:'recibo_diasTrabalhados',mesNumerico:'recibo_mesNumerico',ano:'recibo_ano'}
const empregadorInput=document.getElementById('empregador')
const empregadoInput=document.getElementById('empregado')
const valorDiaInput=document.getElementById('valorDia')
const diasTrabalhadosInput=document.getElementById('diasTrabalhados')
const mesNumericoInput=document.getElementById('mesNumerico')
const anoInput=document.getElementById('ano')
const btnGerarPdf=document.getElementById('btnGerarPdf')
function carregarLocalStorage(){
    if(localStorage.getItem(STORAGE_KEYS.empregador)){empregadorInput.value=localStorage.getItem(STORAGE_KEYS.empregador)}
    if(localStorage.getItem(STORAGE_KEYS.empregado)){empregadoInput.value=localStorage.getItem(STORAGE_KEYS.empregado)}
    if(localStorage.getItem(STORAGE_KEYS.valorDia)){valorDiaInput.value=localStorage.getItem(STORAGE_KEYS.valorDia)}
    if(localStorage.getItem(STORAGE_KEYS.diasTrabalhados)){diasTrabalhadosInput.value=localStorage.getItem(STORAGE_KEYS.diasTrabalhados)}
    if(localStorage.getItem(STORAGE_KEYS.mesNumerico)){mesNumericoInput.value=localStorage.getItem(STORAGE_KEYS.mesNumerico)}
    if(localStorage.getItem(STORAGE_KEYS.ano)){anoInput.value=localStorage.getItem(STORAGE_KEYS.ano)}}
window.addEventListener('load',carregarLocalStorage)
;[empregadorInput,empregadoInput,valorDiaInput,diasTrabalhadosInput,mesNumericoInput,anoInput].forEach(e=>{
    e.addEventListener('change',()=>{
        localStorage.setItem(STORAGE_KEYS.empregador,empregadorInput.value.trim())
        localStorage.setItem(STORAGE_KEYS.empregado,empregadoInput.value.trim())
        localStorage.setItem(STORAGE_KEYS.valorDia,valorDiaInput.value.trim())
        localStorage.setItem(STORAGE_KEYS.diasTrabalhados,diasTrabalhadosInput.value.trim())
        localStorage.setItem(STORAGE_KEYS.mesNumerico,mesNumericoInput.value.trim())
        localStorage.setItem(STORAGE_KEYS.ano,anoInput.value.trim())
    })})
function obterNomeMes(m){const a=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];return a[m-1]||''}
function diasNoMes(m,a){return new Date(a,m,0).getDate()}
function gerarPDF(){
    const empregador=empregadorInput.value.trim()
    const empregado=empregadoInput.value.trim()
    const valorDia=parseFloat(valorDiaInput.value)
    const diasTrabalhados=parseInt(diasTrabalhadosInput.value,10)
    const mesNumerico=parseInt(mesNumericoInput.value,10)
    const ano=parseInt(anoInput.value,10)
    if(!empregador||!empregado||isNaN(valorDia)||isNaN(diasTrabalhados)||isNaN(mesNumerico)||isNaN(ano)){alert("Preencha todos os campos corretamente.");return}
    if(mesNumerico<1||mesNumerico>12){alert("Mês inválido.");return}
    if(ano<2000||ano>2100){alert("Ano fora do intervalo permitido (2000-2100).");return}
    if(diasTrabalhados<1||diasTrabalhados>diasNoMes(mesNumerico,ano)){alert("Número de dias trabalhados inválido para o mês informado.");return}
    const valorTotal=valorDia*diasTrabalhados
    const valorStr="R$ "+valorTotal.toFixed(2).replace('.',',')
    const nomeMes=obterNomeMes(mesNumerico)
    const{jsPDF}=window.jspdf
    const doc=new jsPDF({orientation:'portrait',unit:'pt',format:'a4'})
    const w=doc.internal.pageSize.getWidth()
    const ml=50
    let y=60
    const ls=20
    const ss=35
    function tL(t){if(typeof t==='string'){doc.text(t,ml,y);y+=ls}else{t.forEach(l=>{doc.text(l,ml,y);y+=ls})}}
    function tC(txt,f=14,s="normal"){doc.setFontSize(f);doc.setFont("Helvetica",s);doc.text(txt,w/2,y,{align:"center"});y+=ls}
    const textoRecebi=`Recebi ${valorStr} de Vale-transporte, referente ao mês de ${nomeMes} pelo que firmo o presente.`
    for(let i=0;i<2;i++){
        doc.setFontSize(24)
        doc.setFont("Helvetica","bold")
        doc.text("RECIBO",w/2,y,{align:"center"})
        y+=ss
        doc.setFontSize(16)
        doc.setFont("Helvetica","bold")
        doc.text("Entrega de Vale-Transporte",w/2,y,{align:"center"})
        y+=ss
        doc.setFontSize(14)
        doc.setFont("Helvetica","bold")
        tL(`Empregador(a): ${empregador}`)
        tL(`Empregado(a): ${empregado}`)
        doc.setFont("Helvetica","normal")
        const lines=doc.splitTextToSize(textoRecebi,w-2*ml)
        tL(lines)
        y+=ss
        tC("________________________________________")
        tC("Assinatura do Empregado")
        y+=ss
        doc.text("Ananindeua, Pará",w/2,y,{align:"center"})
        y+=ls
        doc.text(`01/${String(mesNumerico).padStart(2,'0')}/${ano}`,w/2,y,{align:"center"})
        y+=ss
        if(i===0){y+=ss}}
    doc.save(`recibo-vale-transporte-${empregado}-${String(mesNumerico).padStart(2,'0')}-${ano}.pdf`)}
btnGerarPdf.addEventListener('click',gerarPDF)
if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/service-worker.js').then(r=>console.log('Service Worker registrado',r.scope)).catch(e=>console.error('Falha ao registrar',e))})}
