(function(){
const STORAGE='sprint_precios_v3';
const EXCEL_USD_ARS_REFERENCE=1488; // referencia fija del Excel para convertir costos ARS a CRC sin depender del USD→ARS editable
const defaults={appDataVersion:14,
  gorras:{
    variables:{utilidadPct:50,envioARS:5700,impuestoARS:1500,comisionARS:1000,usdArs:1488,usdCrc:445},
    produccion:{tela:1000,visera:250,luz:500,costurera:12000,otros:500,hojas:1000,tinta:600},
    tipos:{
      personalizadas:{name:'Personalizadas',designByRange:{unidad:10000,'2-3':7000,'4-9':2000},excelFinal:{unidad:39000,'2-3':35000,'4-9':27000,'10-30':25000,'30-100':20000}},
      disenos:{name:'Diseños Sprint',designByRange:{unidad:7000,'2-3':4000,'4-9':2000},excelFinal:{unidad:35000,'2-3':30000,'4-9':27000,'10-30':25000,'30-100':20000}}
    },
    china:{disenoARS:0,productUSD:{'10-30':6,'30-100':4.2}},
    activeType:'personalizadas'
  },
  settings:{ars:1498,crc:445},
  jerseys:{
    variables:{utilidadPct:40,envioUSD:10,impuestoUSD:3,comisionUSD:2,usdArs:1498,usdCrc:445},
    activeType:'exclusive',
    lineas:[
      {id:'exclusive',name:'Jersey Exclusive',rows:[
        {rango:'15 - 30',unitUSD:26.2,excelGastoUSD:41.2,excelVentaUSD:57.68},
        {rango:'30 - 49',unitUSD:25.2,excelGastoUSD:40.2,excelVentaUSD:56.28},
        {rango:'50 - 99',unitUSD:23.8,excelGastoUSD:38.8,excelVentaUSD:54.32},
        {rango:'100 - 200',unitUSD:null,excelGastoUSD:null,excelVentaUSD:null}
      ]},
      {id:'procore',name:'Jersey Pro Core',rows:[
        {rango:'Unidad',unitUSD:36.5,excelGastoUSD:51.5,excelVentaUSD:72.1},
        {rango:'10 - 49',unitUSD:21.62,excelGastoUSD:36.62,excelVentaUSD:51.268},
        {rango:'50 unidades',unitUSD:20.53,excelGastoUSD:35.53,excelVentaUSD:49.742}
      ]},
      {id:'epic',name:'Jersey Epic',rows:[
        {rango:'30 - 49',unitUSD:16.52,excelGastoUSD:31.52,excelVentaUSD:44.128},
        {rango:'50 - 99',unitUSD:15.86,excelGastoUSD:30.86,excelVentaUSD:43.204},
        {rango:'100 - 200',unitUSD:15.09,excelGastoUSD:30.09,excelVentaUSD:42.126}
      ]}
    ]
  },
  placeholders:{calzas:[],conjuntos:[],accesorios:[]}
};
let data=load();let currentView='dashboard';
function clone(o){return JSON.parse(JSON.stringify(o))}
function load(){
  try{
    const s=localStorage.getItem(STORAGE);
    const loaded=s?mergeDeep(clone(defaults),JSON.parse(s)):clone(defaults);
    return normalizeData(loaded);
  }catch(e){return clone(defaults)}
}
function normalizeData(d){
  if(!d.jerseys) d.jerseys=clone(defaults.jerseys);
  if(!d.jerseys.variables) d.jerseys.variables=clone(defaults.jerseys.variables);
  if(!d.jerseys.activeType) d.jerseys.activeType='exclusive';

  const previousVersion=Number(d.appDataVersion||0);

  if(previousVersion<14){
    // Preservar solo los gastos variables que el usuario pueda haber personalizado.
    const currentVariables=clone(d.jerseys.variables||{});
    const currentActive=d.jerseys.activeType||'exclusive';

    // Restablecer todas las filas de Jersey a los valores exactos verificados del Excel.
    d.jerseys=clone(defaults.jerseys);
    d.jerseys.variables=mergeDeep(clone(defaults.jerseys.variables),currentVariables);
    d.jerseys.activeType=currentActive;

    // El Excel usa US$3 de impuestos. Corregir el antiguo default erróneo si persiste.
    if(Number(d.jerseys.variables.impuestoUSD)===2) d.jerseys.variables.impuestoUSD=3;

    d.appDataVersion=14;
  } else {
    d.appDataVersion=14;
  }

  return d;
}
function mergeDeep(target,source){if(!source||typeof source!=='object')return target;Object.keys(source).forEach(k=>{if(source[k]&&typeof source[k]==='object'&&!Array.isArray(source[k])&&target[k]&&typeof target[k]==='object'&&!Array.isArray(target[k]))mergeDeep(target[k],source[k]);else target[k]=source[k]});return target}
function save(){localStorage.setItem(STORAGE,JSON.stringify(data));const e=document.getElementById('saveState');if(e){e.textContent='Guardado ✓';setTimeout(()=>e.textContent='Datos guardados en este navegador',1000)}}
function num(v,d=2){if(v===null||v===undefined||v==='')return '—';return Number(v).toLocaleString('es-AR',{minimumFractionDigits:d,maximumFractionDigits:d})}
function ars(v){return v==null?'—':'$ '+num(v,0)} function usd(v){return v==null?'—':'US$ '+num(v,2)} function crc(v){return v==null?'—':'₡ '+num(v,0)} function pct(v){return num(v,1)+'%'}
function setPath(path,value){const parts=path.split('.');let o=data;for(let i=0;i<parts.length-1;i++)o=o[parts[i]];o[parts[parts.length-1]]=value===''?null:Number(value)}
function field(label,path,value,suffix=''){return `<div class="field"><label>${label}${suffix?' ('+suffix+')':''}</label><input type="number" step="any" value="${value??''}" data-path="${path}"></div>`}
function bindInputs(){
  document.querySelectorAll('[data-path]').forEach(el=>{
    el.addEventListener('input',e=>{
      setPath(e.target.dataset.path,e.target.value);
      save();
      // No reconstruimos el formulario mientras se escribe: así el cursor permanece donde el usuario lo dejó.
      if(currentView==='gorras') refreshGorrasComputed();
      if(currentView==='gorrasAdvanced') refreshAdvancedComputed();
      if(currentView==='jerseys') refreshJerseysComputed();
      if(currentView==='jerseyAdvanced') refreshJerseyAdvancedComputed();
    });
  });
}
function refreshGorrasComputed(){
  const body=document.getElementById('gorrasPriceBody');
  if(!body) return;
  const type=data.gorras.activeType;
  body.innerHTML=priceRow(type,'unidad','Unidad')+priceRow(type,'2-3','2 – 3 unidades')+priceRow(type,'4-9','4 – 9 unidades')+priceRow(type,'10-30','10 – 30 unidades')+priceRow(type,'30-100','30 – 100 unidades')+priceRow(type,'100+','Más de 100');
  refreshGorrasQuote();
}
function refreshAdvancedComputed(){
  const total=document.getElementById('productionBaseTotal');
  if(total) total.textContent=ars(productionBase());
}
function productionBase(){const p=data.gorras.produccion;return ['tela','visera','luz','costurera','otros','hojas','tinta'].reduce((a,k)=>a+(Number(p[k])||0),0)}
function gorrasCalc(typeKey,rangeKey){
 const g=data.gorras,v=g.variables,t=g.tipos[typeKey];let costARS=null,costUSDForCRC=null,origin='';
 if(['unidad','2-3','4-9'].includes(rangeKey)){
   costARS=productionBase()+(Number(t.designByRange[rangeKey])||0);origin='Producción Sprint';
   // Para CRC usamos una base USD independiente del tipo USD→ARS editable.
   costUSDForCRC=costARS/EXCEL_USD_ARS_REFERENCE;
 }else if(['10-30','30-100'].includes(rangeKey)){
   const productUSD=(Number(g.china.productUSD[rangeKey])||0);
   const fixedARS=(Number(g.china.disenoARS)||0)+(Number(v.envioARS)||0)+(Number(v.impuestoARS)||0)+(Number(v.comisionARS)||0);
   costARS=productUSD*(Number(v.usdArs)||0)+fixedARS;origin='Producción China';
   // La columna CRC usa el costo del producto en USD + los cargos ARS convertidos con la referencia original del Excel.
   costUSDForCRC=productUSD+(fixedARS/EXCEL_USD_ARS_REFERENCE);
 }else return {consult:true};
 const utilityFactor=1+(Number(v.utilidadPct)||0)/100;
 const finalARS=costARS*utilityFactor;
 const finalCRC=costUSDForCRC*utilityFactor*(Number(v.usdCrc)||0);
 return {costARS,finalARS,finalCRC,origin,excel:t.excelFinal[rangeKey]};
}
function dashboard(){return `<h1>Resumen de precios</h1><p class="lead">Sistema interno Sprint. Gorras y Jerseys usan motores dinámicos de precios.</p><div class="grid grid-3"><div class="card"><div class="kpi-label">Gorras</div><div class="kpi-value">Dinámico</div><p class="subtle">Variables y rangos recalculados en vivo.</p><button class="btn small go" data-go="gorras">Abrir Gorras</button></div><div class="card"><div class="kpi-label">Jerseys</div><div class="kpi-value">Dinámico</div><p class="subtle">Exclusive, Pro Core y Epic con rangos recalculados en vivo.</p><button class="btn small go" data-go="jerseys">Abrir Jerseys</button></div><div class="card"><div class="kpi-label">Próximos</div><div class="actions"><span class="tag">Calzas</span><span class="tag">Conjuntos</span><span class="tag">Accesorios</span></div></div></div>`}
function variableCard(label,path,value,suffix,help=''){return `<div class="card variable-card compact-variable"><label>${label}</label><input type="number" step="any" value="${value??''}" data-path="${path}">${help?`<div class="price-meta">${help}</div>`:''}<div class="price-meta">${suffix}</div></div>`}
function priceRow(typeKey,key,label){const c=gorrasCalc(typeKey,key);if(c.consult)return `<tr><td><strong>${label}</strong><div class="range-origin">Cotización especial</div></td><td>—</td><td><span class="consult-pill">Consultar</span></td><td>—</td></tr>`;return `<tr><td><strong>${label}</strong><div class="range-origin">${c.origin}</div></td><td class="money-cost">${ars(c.costARS)}</td><td class="money-final">${ars(c.finalARS)}</td><td class="money-crc">${crc(c.finalCRC)}</td></tr>`}
function gorraRangeForQuantity(q){
  q=Number(q)||0;
  if(q===1) return {key:'unidad',label:'Unidad'};
  if(q>=2 && q<=3) return {key:'2-3',label:'2 – 3 unidades'};
  if(q>=4 && q<=9) return {key:'4-9',label:'4 – 9 unidades'};
  if(q>=10 && q<=30) return {key:'10-30',label:'10 – 30 unidades'};
  if(q>=31 && q<=100) return {key:'30-100',label:'30 – 100 unidades'};
  return null;
}
function jerseyRangeForQuantity(line,q){
  q=Number(q)||0;
  if(line.id==='exclusive'){
    if(q>=15 && q<=30) return 0;
    if(q>=31 && q<=49) return 1;
    if(q>=50 && q<=99) return 2;
    return null;
  }
  if(line.id==='procore'){
    if(q===1) return 0;
    if(q>=10 && q<=49) return 1;
    if(q===50) return 2;
    return null;
  }
  if(line.id==='epic'){
    if(q>=30 && q<=49) return 0;
    if(q>=50 && q<=99) return 1;
    if(q>=100 && q<=200) return 2;
    return null;
  }
  return null;
}
function quoteSection(kind){
  return `<div class="section-bar quote-section-head"><div><h2>Cotización</h2><p>Ingresá una cantidad, elegí la moneda y el sistema aplicará automáticamente el precio del rango correspondiente.</p></div><button class="btn" id="${kind}GenerateQuoteBtn">Generar cotización</button></div>
  <div class="quote-panel quote-panel-v24">
    <div class="quote-controls">
      <div class="quote-input-wrap">
        <label for="${kind}QuoteQty">Cantidad de productos</label>
        <input id="${kind}QuoteQty" class="quote-qty" type="number" min="1" step="1" placeholder="Ej. 25">
      </div>
      <div class="quote-currency-wrap">
        <label for="${kind}QuoteCurrency">Moneda de cotización</label>
        <select id="${kind}QuoteCurrency" class="quote-currency">
          <option value="ARS">Pesos argentinos (ARS)</option>
          <option value="CRC">Colones (CRC)</option>
        </select>
      </div>
    </div>
    <div class="table-wrap quote-table-wrap">
      <table class="quote-table">
        <thead><tr><th>Cantidad</th><th>Rango aplicado</th><th id="${kind}QuoteUnitHead">Precio unitario ARS</th><th id="${kind}QuoteTotalHead">Monto total ARS</th></tr></thead>
        <tbody id="${kind}QuoteBody"><tr><td colspan="4" class="quote-empty">Ingresá una cantidad para calcular la cotización.</td></tr></tbody>
      </table>
    </div>
  </div>`;
}

let activeQuoteDraft=null;


function quoteCurrency(kind){
  return document.getElementById(`${kind}QuoteCurrency`)?.value || 'ARS';
}
function moneyByCurrency(value,currency){
  return currency==='CRC' ? crc(value) : ars(value);
}
function updateQuoteHeaders(kind,currency){
  const unit=document.getElementById(`${kind}QuoteUnitHead`);
  const total=document.getElementById(`${kind}QuoteTotalHead`);
  if(unit) unit.textContent=`Precio unitario ${currency}`;
  if(total) total.textContent=`Monto total ${currency}`;
}

function getCurrentGorraQuoteData(){
  const input=document.getElementById('gorrasQuoteQty');
  if(!input) return null;
  const q=Math.floor(Number(input.value)||0);
  if(q<=0) return null;
  const range=gorraRangeForQuantity(q);
  if(!range) return null;
  const c=gorrasCalc(data.gorras.activeType,range.key);
  if(c.consult) return null;
  const currency=quoteCurrency('gorras');
  return {
    category:'Gorras',
    product:data.gorras.activeType==='personalizada'?'Gorra Personalizada':'Diseño Sprint',
    quantity:q,
    range:range.label,
    currency,
    unitARS:c.finalARS,
    totalARS:c.finalARS*q,
    unitCRC:c.finalCRC,
    totalCRC:c.finalCRC*q
  };
}
function getCurrentJerseyQuoteData(){
  const input=document.getElementById('jerseysQuoteQty');
  if(!input) return null;
  const q=Math.floor(Number(input.value)||0);
  if(q<=0) return null;
  const line=jerseyLineById(data.jerseys.activeType);
  const index=jerseyRangeForQuantity(line,q);
  if(index===null) return null;
  const row=line.rows[index],c=jerseyCalc(row);
  if(c.consult) return null;
  const currency=quoteCurrency('jerseys');
  return {
    category:'Jerseys',
    product:line.name,
    quantity:q,
    range:row.rango,
    currency,
    unitARS:c.finalARS,
    totalARS:c.finalARS*q,
    unitCRC:c.finalCRC,
    totalCRC:c.finalCRC*q
  };
}
function localTodayISO(){
  const d=new Date();
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,'0');
  const day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function formatDateAR(iso){
  if(!iso) return '';
  const [y,m,d]=iso.split('-');
  return `${d}/${m}/${y}`;
}
function openQuoteModal(kind){
  const q=kind==='gorras'?getCurrentGorraQuoteData():getCurrentJerseyQuoteData();
  if(!q){
    alert('Ingresá una cantidad que corresponda a un rango con precio automático antes de generar la cotización.');
    return;
  }
  activeQuoteDraft=q;
  const existing=document.getElementById('quoteModal');
  if(existing) existing.remove();

  const modal=document.createElement('div');
  modal.id='quoteModal';
  modal.className='quote-modal';
  modal.innerHTML=`
    <div class="quote-modal-card">
      <div class="quote-modal-head">
        <div>
          <h2>Generar cotización</h2>
          <p>Completá los datos del cliente. Los datos de la compra se cargan automáticamente.</p>
        </div>
        <button class="quote-close" id="quoteCloseBtn" aria-label="Cerrar">×</button>
      </div>
      <div class="quote-form-grid">
        <div class="field">
          <label>Cliente</label>
          <input id="quoteClient" type="text" placeholder="Nombre del cliente">
        </div>
        <div class="field">
          <label>Fecha</label>
          <input id="quoteDate" type="date" value="${localTodayISO()}">
        </div>
      </div>
      <div class="quote-modal-summary">
        <div><span>Producto</span><strong>${q.product}</strong></div>
        <div><span>Cantidad</span><strong>${q.quantity}</strong></div>
        <div><span>Rango</span><strong>${q.range}</strong></div>
        <div><span>Moneda</span><strong>${q.currency}</strong></div>
        <div><span>Precio unitario</span><strong>${moneyByCurrency(q.currency==='CRC'?q.unitCRC:q.unitARS,q.currency)}</strong></div>
        <div><span>Total</span><strong>${moneyByCurrency(q.currency==='CRC'?q.totalCRC:q.totalARS,q.currency)}</strong></div>
      </div>
      <div class="actions right">
        <button class="btn ghost" id="quotePreviewBtn">Vista previa</button>
        <button class="btn" id="quotePrintBtn">Imprimir / Guardar PDF</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  document.getElementById('quoteCloseBtn').onclick=()=>modal.remove();
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove()});
  document.getElementById('quotePreviewBtn').onclick=()=>renderPrintableQuote(false);
  document.getElementById('quotePrintBtn').onclick=()=>renderPrintableQuote(true);
}
function renderPrintableQuote(autoPrint){
  if(!activeQuoteDraft) return;
  const client=(document.getElementById('quoteClient')?.value||'').trim();
  const date=document.getElementById('quoteDate')?.value||localTodayISO();
  if(!client){
    alert('Completá el nombre del cliente.');
    document.getElementById('quoteClient')?.focus();
    return;
  }
  const q=activeQuoteDraft;
  const quoteCurrencyCode=q.currency||'ARS';
  const unitQuote=quoteCurrencyCode==='CRC'?q.unitCRC:q.unitARS;
  const totalQuote=quoteCurrencyCode==='CRC'?q.totalCRC:q.totalARS;
  const deposit=totalQuote*0.5;
  const balance=totalQuote-deposit;
  const quoteMoney=(value)=>moneyByCurrency(value,quoteCurrencyCode);

  let printView=document.getElementById('printQuote');
  if(printView) printView.remove();

  printView=document.createElement('section');
  printView.id='printQuote';
  printView.className='print-quote';
  const subcategory=q.product.replace(/^Jersey\s+/,'').replace(/^Gorra\s+/,'');

  printView.innerHTML=`
    <div class="print-quote-page print-v20">
      <img src="sprint-logo-pdf.png" alt="" class="print-v20-watermark" aria-hidden="true">

      <header class="print-v20-header">
        <img src="sprint-logo-pdf.png" alt="Sprint" class="print-v20-logo">
        <div class="print-v20-title-wrap">
          <div class="print-v20-title">Cotización</div>
          <div class="print-v20-title-line"></div>
        </div>
      </header>

      <section class="print-v20-clientbar">
        <div class="print-v20-clientcell">
          <div class="print-v20-icon">●</div>
          <div>
            <span>Cliente:</span>
            <strong>${client}</strong>
          </div>
        </div>
        <div class="print-v20-clientcell">
          <div class="print-v20-icon">▦</div>
          <div>
            <span>Fecha:</span>
            <strong>${formatDateAR(date)}</strong>
          </div>
        </div>
      </section>

      <section class="print-v20-detail">
        <div class="print-v20-sectionbar">Detalle de la cotización</div>
        <div class="print-v20-detail-grid">
          <div class="print-v20-detail-col">
            <div><span>Producto:</span><strong>${q.product}</strong></div>
            <div><span>Subcategoría:</span><strong>${subcategory}</strong></div>
            <div><span>Cantidad:</span><strong>${q.quantity} unidades</strong></div>
          </div>
          <div class="print-v20-detail-col print-v20-detail-right print-v21-client-detail">
            <div><span>Moneda:</span><strong>${quoteCurrencyCode}</strong></div>
            <div><span>Precio unitario:</span><strong>${quoteMoney(unitQuote)}</strong></div>
            <div><span>Total:</span><strong>${quoteMoney(totalQuote)}</strong></div>
            <div><span>Seña para comenzar:</span><strong>${quoteMoney(deposit)}</strong></div>
            <div><span>Saldo restante:</span><strong>${quoteMoney(balance)}</strong></div>
          </div>
        </div>
      </section>

      <section class="print-v20-items">
        <table>
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Cantidad</th>
              <th>Precio unitario (${quoteCurrencyCode})</th>
              <th>Total (${quoteCurrencyCode})</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${q.product}</td>
              <td>${q.quantity}</td>
              <td>${quoteMoney(unitQuote)}</td>
              <td>${quoteMoney(totalQuote)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="print-v20-totals-wrap">
        <div class="print-v20-totals">
          <div><span>Subtotal (${quoteCurrencyCode}):</span><strong>${quoteMoney(totalQuote)}</strong></div>
          <div><span>Seña 50%:</span><strong>${quoteMoney(deposit)}</strong></div>
          <div><span>Saldo 50%:</span><strong>${quoteMoney(balance)}</strong></div>
          <div class="print-v20-total-main"><span>Total (${quoteCurrencyCode}):</span><strong>${quoteMoney(totalQuote)}</strong></div>
        </div>
      </section>

      <section class="print-v20-info">
        <div class="print-v20-info-title"><span class="print-v20-info-dot">i</span> Información de la compra</div>
        <p>Comenzamos a trabajar en tu diseño con una seña del 50% del monto, puedes hacer los cambios de diseño que requieras sin costos adicionales :).</p>
        <p>Una vez que confirmes el diseño se manda a producción, en este periodo ya no se pueden realizar cambios en el diseño.</p>
        <p><strong>El tiempo aproximado de entrega es de 4 semanas.</strong></p>
        <div class="print-v20-thanks">¡Gracias!</div>
      </section>

      <img src="cotizacion-oficial-transparente.png" alt="Cotización Oficial Sprint" class="print-v20-stamp">

      <footer class="print-v20-footer">
        <div>@sprint_argentina</div>
        <div>Sprint Argentina</div>
      </footer>

      <div class="print-preview-actions no-print">
        <button class="btn ghost" id="closePrintPreview">Cerrar vista previa</button>
        <button class="btn" id="doPrintQuote">Imprimir / Guardar PDF</button>
      </div>
    </div>`;

  document.body.appendChild(printView);
  document.getElementById('quoteModal')?.remove();

  const closePreview=document.getElementById('closePrintPreview');
  if(closePreview) closePreview.onclick=()=>printView.remove();

  const doPrint=document.getElementById('doPrintQuote');
  if(doPrint) doPrint.onclick=()=>window.print();

  const closeOnEscape=(e)=>{
    if(e.key==='Escape'){
      printView.remove();
      document.removeEventListener('keydown',closeOnEscape);
    }
  };
  document.addEventListener('keydown',closeOnEscape);

  if(autoPrint){
    setTimeout(()=>window.print(),180);
  }
}

function refreshGorrasQuote(){
  const input=document.getElementById('gorrasQuoteQty');
  const body=document.getElementById('gorrasQuoteBody');
  if(!input||!body) return;
  const currency=quoteCurrency('gorras');
  updateQuoteHeaders('gorras',currency);
  const q=Math.floor(Number(input.value)||0);
  if(q<=0){
    body.innerHTML=`<tr><td colspan="4" class="quote-empty">Ingresá una cantidad para calcular la cotización.</td></tr>`;
    return;
  }
  const range=gorraRangeForQuantity(q);
  if(!range){
    body.innerHTML=`<tr><td>${q}</td><td>Fuera de rangos automáticos</td><td><span class="consult-pill">Consultar</span></td><td>—</td></tr>`;
    return;
  }
  const c=gorrasCalc(data.gorras.activeType,range.key);
  if(c.consult){
    body.innerHTML=`<tr><td>${q}</td><td>${range.label}</td><td><span class="consult-pill">Consultar</span></td><td>—</td></tr>`;
    return;
  }
  const unit=currency==='CRC'?c.finalCRC:c.finalARS;
  const total=unit*q;
  body.innerHTML=`<tr><td><strong>${q}</strong></td><td>${range.label}</td><td class="quote-unit">${moneyByCurrency(unit,currency)}</td><td class="quote-total">${moneyByCurrency(total,currency)}</td></tr>`;
}
function refreshJerseysQuote(){
  const input=document.getElementById('jerseysQuoteQty');
  const body=document.getElementById('jerseysQuoteBody');
  if(!input||!body) return;
  const currency=quoteCurrency('jerseys');
  updateQuoteHeaders('jerseys',currency);
  const q=Math.floor(Number(input.value)||0);
  if(q<=0){
    body.innerHTML=`<tr><td colspan="4" class="quote-empty">Ingresá una cantidad para calcular la cotización.</td></tr>`;
    return;
  }
  const line=jerseyLineById(data.jerseys.activeType);
  const index=jerseyRangeForQuantity(line,q);
  if(index===null){
    body.innerHTML=`<tr><td>${q}</td><td>Fuera de rangos de ${line.name}</td><td><span class="consult-pill">Consultar</span></td><td>—</td></tr>`;
    return;
  }
  const row=line.rows[index],c=jerseyCalc(row);
  if(c.consult){
    body.innerHTML=`<tr><td>${q}</td><td>${row.rango}</td><td><span class="consult-pill">Consultar</span></td><td>—</td></tr>`;
    return;
  }
  const unit=currency==='CRC'?c.finalCRC:c.finalARS;
  const total=unit*q;
  body.innerHTML=`<tr><td><strong>${q}</strong></td><td>${row.rango}</td><td class="quote-unit">${moneyByCurrency(unit,currency)}</td><td class="quote-total">${moneyByCurrency(total,currency)}</td></tr>`;
}

function gorras(){
 const g=data.gorras,v=g.variables,type=g.activeType;
 return `<div class="between"><div><h1>Gorras</h1><p class="lead">Precios finales recalculados con la misma lógica del archivo de Gorras.</p></div><button class="btn ghost" id="advancedBtn">Opciones avanzadas</button></div>
 <div class="section-bar"><div><h2>Gastos variables</h2><p>Estos valores recalculan todos los rangos al instante.</p></div></div>
 <div class="variable-grid">
  ${variableCard('Utilidad','gorras.variables.utilidadPct',v.utilidadPct,'%','Excel: 50%')}
  ${variableCard('Envío','gorras.variables.envioARS',v.envioARS,'ARS / gorra','Excel: $5.700')}
  ${variableCard('Impuestos','gorras.variables.impuestoARS',v.impuestoARS,'ARS / gorra','Excel: $1.500')}
  ${variableCard('Comisión','gorras.variables.comisionARS',v.comisionARS,'ARS / gorra','Excel: $1.000')}
  ${variableCard('USD → ARS','gorras.variables.usdArs',v.usdArs,'ARS / USD','Excel: 1.488')}
  ${variableCard('USD → CRC','gorras.variables.usdCrc',v.usdCrc,'CRC / USD','Conversión a colones')}
 </div>
 <div class="section-bar"><div><h2>Precios finales por rango</h2><p>Compará el gasto total y el precio final en ARS y CRC. Cada tipo de cambio afecta únicamente a su moneda.</p></div><div class="segmented"><button class="segment ${type==='personalizadas'?'active':''}" data-type="personalizadas">Personalizadas</button><button class="segment ${type==='disenos'?'active':''}" data-type="disenos">Diseños Sprint</button></div></div>
 <div class="table-wrap price-range-table"><table><thead><tr><th>Rango</th><th>Gasto total ARS</th><th>Precio cliente ARS</th><th>Precio cliente CRC</th></tr></thead><tbody id="gorrasPriceBody">
  ${priceRow(type,'unidad','Unidad')}${priceRow(type,'2-3','2 – 3 unidades')}${priceRow(type,'4-9','4 – 9 unidades')}${priceRow(type,'10-30','10 – 30 unidades')}${priceRow(type,'30-100','30 – 100 unidades')}${priceRow(type,'100+','Más de 100')}
 </tbody></table></div>
 <div class="info"><strong>Lógica usada:</strong> en Unidad, 2–3 y 4–9 se usan los gastos de producción Sprint + diseño/mano de obra del rango. En 10–30 y 30–100 se usa producto USD × tipo de cambio + envío + impuesto + comisión. Al costo resultante se le aplica la utilidad.</div>
 ${quoteSection('gorras')}`
}
function gorrasAdvanced(){
 const g=data.gorras,p=g.produccion,v=g.variables;
 const prodRows=[['Tela','tela'],['Visera','visera'],['Luz','luz'],['Costurera','costurera'],['Otros materiales','otros'],['Hojas de sublimar','hojas'],['Tinta','tinta']].map(([l,k])=>`<tr><td>${l}</td><td><input type="number" step="any" value="${p[k]}" data-path="gorras.produccion.${k}"></td></tr>`).join('');
 function designTable(typeKey){const t=g.tipos[typeKey];return `<div class="card"><div class="section-title">Diseño y mano de obra — ${t.name}</div><div class="table-wrap"><table class="editable-table"><thead><tr><th>Rango</th><th>Costo ARS</th><th>Referencia final Excel</th></tr></thead><tbody><tr><td>Unidad</td><td><input type="number" value="${t.designByRange.unidad}" data-path="gorras.tipos.${typeKey}.designByRange.unidad"></td><td>${ars(t.excelFinal.unidad)}</td></tr><tr><td>2 – 3</td><td><input type="number" value="${t.designByRange['2-3']}" data-path="gorras.tipos.${typeKey}.designByRange.2-3"></td><td>${ars(t.excelFinal['2-3'])}</td></tr><tr><td>4 – 9</td><td><input type="number" value="${t.designByRange['4-9']}" data-path="gorras.tipos.${typeKey}.designByRange.4-9"></td><td>${ars(t.excelFinal['4-9'])}</td></tr></tbody></table></div></div>`}
 return `<div class="backline"><button class="btn secondary" id="backGorras">← Volver a Gorras</button></div><h1>Opciones avanzadas — Gorras</h1><p class="lead">Costos que normalmente cambian poco. Si los editás, los precios finales también se recalculan.</p>
 <div class="grid grid-2"><div class="card"><div class="section-title">Gastos de producción Sprint</div><div class="table-wrap"><table class="editable-table"><thead><tr><th>Concepto</th><th>ARS</th></tr></thead><tbody>${prodRows}</tbody></table></div><div class="divider"></div><div class="between"><span class="subtle">Base de producción sin diseño</span><span class="advanced-total" id="productionBaseTotal">${ars(productionBase())}</span></div></div>
 <div class="card"><div class="section-title">Producción China</div>${field('Diseño adicional','gorras.china.disenoARS',g.china.disenoARS,'ARS')}${field('Producto 10–30','gorras.china.productUSD.10-30',g.china.productUSD['10-30'],'USD')}${field('Producto 30–100','gorras.china.productUSD.30-100',g.china.productUSD['30-100'],'USD')}<div class="formula">Costo China = Producto USD × USD→ARS + Diseño + Envío + Impuesto + Comisión\nPrecio final = Costo China × (1 + Utilidad)</div><div class="notice">En el Excel: Producto 10–30 = US$ 6, Producto 30–100 = US$ 4,20. Envío, impuesto y comisión se editan en la pantalla principal porque son gastos variables.</div></div></div>
 <div style="height:16px"></div><div class="grid grid-2">${designTable('personalizadas')}${designTable('disenos')}</div>
 <div class="info"><strong>Base extraída del Excel:</strong> Tela $1.000, Visera $250, Luz $500, Costurera $12.000, Otros materiales $500, Hojas $1.000 y Tinta $600. La suma sin diseño es ${ars(productionBase())}.</div>`
}
function jerseyLineById(id){return data.jerseys.lineas.find(l=>l.id===id)||data.jerseys.lineas[0]}
function jerseyCalc(row){
  if(row.unitUSD==null) return {consult:true};
  const v=data.jerseys.variables;
  const costUSD=(Number(row.unitUSD)||0)+(Number(v.envioUSD)||0)+(Number(v.impuestoUSD)||0)+(Number(v.comisionUSD)||0);
  const finalUSD=costUSD*(1+(Number(v.utilidadPct)||0)/100);
  return {
    costUSD,
    finalUSD,
    finalARS:finalUSD*(Number(v.usdArs)||0),
    finalCRC:finalUSD*(Number(v.usdCrc)||0)
  };
}
function jerseyPriceRow(lineId,index){
  const line=jerseyLineById(lineId),row=line.rows[index],c=jerseyCalc(row);
  if(c.consult) return `<tr><td><strong>${row.rango}</strong><div class="range-origin">Cotización especial</div></td><td>—</td><td><span class="consult-pill">Consultar</span></td><td>—</td></tr>`;
  return `<tr><td><strong>${row.rango}</strong><div class="range-origin">${line.name}</div></td><td class="money-cost">${usd(c.costUSD)}</td><td class="money-final">${ars(c.finalARS)}</td><td class="money-crc">${crc(c.finalCRC)}</td></tr>`;
}
function refreshJerseysComputed(){
  const body=document.getElementById('jerseyPriceBody');
  if(!body) return;
  const line=jerseyLineById(data.jerseys.activeType);
  body.innerHTML=line.rows.map((_,i)=>jerseyPriceRow(line.id,i)).join('');
  refreshJerseysQuote();
}
function refreshJerseyAdvancedComputed(){
  const line=jerseyLineById(data.jerseys.activeType);
  line.rows.forEach((row,i)=>{
    const el=document.getElementById(`jerseyComputed-${i}`);
    if(el){
      const c=jerseyCalc(row);
      el.textContent=c.consult?'—':usd(c.costUSD);
    }
  });
}
function jerseys(){
  const j=data.jerseys,v=j.variables,line=jerseyLineById(j.activeType);
  const tabs=j.lineas.map(l=>`<button class="segment ${l.id===j.activeType?'active':''}" data-jersey-type="${l.id}">${l.name.replace('Jersey ','')}</button>`).join('');
  const rows=line.rows.map((_,i)=>jerseyPriceRow(line.id,i)).join('');
  return `<div class="between"><div><h1>Jerseys</h1><p class="lead">Precios dinámicos según los criterios del archivo de precios de Jerseys.</p></div><div class="actions"><button class="btn secondary" id="resetJerseyExcelBtn">Restablecer valores del Excel</button><button class="btn ghost" id="jerseyAdvancedBtn">Opciones avanzadas · ${line.name.replace('Jersey ','')}</button></div></div>
  <div class="section-bar"><div><h2>Gastos variables</h2><p>Modificá estos valores y todos los rangos se recalculan al instante.</p></div></div>
  <div class="variable-grid">
    ${variableCard('Utilidad','jerseys.variables.utilidadPct',v.utilidadPct,'%','Excel: 40%')}
    ${variableCard('Envío','jerseys.variables.envioUSD',v.envioUSD,'USD / jersey','Excel: US$ 10')}
    ${variableCard('Impuestos','jerseys.variables.impuestoUSD',v.impuestoUSD,'USD / jersey','Excel: US$ 3')}
    ${variableCard('Comisión','jerseys.variables.comisionUSD',v.comisionUSD,'USD / jersey','Excel: US$ 2')}
    ${variableCard('USD → ARS','jerseys.variables.usdArs',v.usdArs,'ARS / USD','Excel: 1.498')}
    ${variableCard('USD → CRC','jerseys.variables.usdCrc',v.usdCrc,'CRC / USD','Excel: 445')}
  </div>
  <div class="section-bar"><div><h2>Precios por rango</h2><p>Seleccioná el tipo de jersey para ver sus rangos y precios recalculados.</p></div><div class="segmented">${tabs}</div></div>
  <div class="table-wrap price-range-table"><table><thead><tr><th>Rango</th><th>Gasto total USD</th><th>Precio cliente ARS</th><th>Precio cliente CRC</th></tr></thead><tbody id="jerseyPriceBody">${rows}</tbody></table></div>
  <div class="info"><strong>Lógica usada:</strong> cada rango usa su Precio Unitario Proveedor del Excel. A ese valor se suman Envío + Impuestos + Comisión; luego se aplica la Utilidad. El resultado en USD se convierte de forma independiente a ARS y CRC usando cada tipo de cambio.</div>
  ${quoteSection('jerseys')}`;
}
function jerseyAdvanced(){
  const j=data.jerseys,line=jerseyLineById(j.activeType);
  const lineIndex=j.lineas.indexOf(line);
  const body=line.rows.map((r,i)=>{
    const c=jerseyCalc(r);
    return `<tr>
      <td><strong>${r.rango}</strong></td>
      <td><input type="number" step="any" value="${r.unitUSD??''}" data-path="jerseys.lineas.${lineIndex}.rows.${i}.unitUSD"></td>
      <td>${r.excelGastoUSD==null?'—':usd(r.excelGastoUSD)}</td>
      <td>${r.excelVentaUSD==null?'—':usd(r.excelVentaUSD)}</td>
      <td id="jerseyComputed-${i}">${c.consult?'—':usd(c.costUSD)}</td>
    </tr>`;
  }).join('');
  return `<div class="backline"><button class="btn secondary" id="backJerseys">← Volver a Jerseys</button></div>
  <h1>Opciones avanzadas — ${line.name}</h1>
  <p class="lead">El Precio Unitario Proveedor es el valor base del Excel para cada rango y alimenta directamente el cálculo.</p>
  <div class="card">
    <div class="section-title">Costos por rango</div>
    <div class="table-wrap"><table class="editable-table"><thead><tr><th>Rango</th><th>Precio unitario proveedor</th><th>Gasto Excel</th><th>Venta Excel</th><th>Gasto dinámico actual</th></tr></thead><tbody>${body}</tbody></table></div>
  </div>
  <div class="info"><strong>Fórmula verificada en el Excel:</strong> Precio Unitario + Envío + Impuestos + Comisión = Gasto. Luego: Gasto × (1 + Utilidad) = Precio de Venta. Los tipos de cambio se aplican al precio de venta para obtener ARS y CRC.</div>`;
}
function placeholder(name){return `<h1>${name}</h1><p class="lead">Categoría preparada para incorporar su estructura de costos.</p><div class="placeholder"><h2>${name}</h2><p>Todavía no tiene precios cargados.</p></div>`}
function config(){return `<h1>Configuración general</h1><p class="lead">Los gastos variables de cada producto se administran directamente en su pestaña para evitar mezclar fórmulas entre categorías.</p><div class="info">Gorras y Jerseys ya tienen configuración dinámica propia. Calzas, Conjuntos y Accesorios se agregarán cuando carguemos sus estructuras de costos.</div>`}
function backup(){return `<h1>Backup</h1><p class="lead">Exportá o recuperá todos los datos guardados en este navegador.</p><div class="grid grid-2"><div class="card"><div class="section-title">Exportar</div><button id="exportBtn" class="btn">Exportar datos</button></div><div class="card"><div class="section-title">Importar</div><input id="importFile" type="file" accept="application/json"><div style="height:10px"></div><button id="importBtn" class="btn secondary">Importar backup</button></div></div><div style="height:16px"></div><div class="card"><div class="section-title">Restablecer</div><button id="resetBtn" class="btn danger">Restablecer valores del Excel</button></div>`}
function render(){const app=document.getElementById('app');if(currentView==='dashboard')app.innerHTML=dashboard();else if(currentView==='gorras')app.innerHTML=gorras();else if(currentView==='gorrasAdvanced')app.innerHTML=gorrasAdvanced();else if(currentView==='jerseys')app.innerHTML=jerseys();else if(currentView==='jerseyAdvanced')app.innerHTML=jerseyAdvanced();else if(currentView==='calzas')app.innerHTML=placeholder('Calzas');else if(currentView==='conjuntos')app.innerHTML=placeholder('Conjuntos');else if(currentView==='accesorios')app.innerHTML=placeholder('Accesorios');else if(currentView==='config')app.innerHTML=config();else app.innerHTML=backup();bindInputs();bindSpecial()}
function go(v){currentView=v;document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===v));render()}
function bindSpecial(){
  document.querySelectorAll('.go').forEach(b=>b.onclick=()=>go(b.dataset.go));
  document.querySelectorAll('[data-type]').forEach(b=>b.onclick=()=>{data.gorras.activeType=b.dataset.type;save();render()});
  document.querySelectorAll('[data-jersey-type]').forEach(b=>b.onclick=()=>{data.jerseys.activeType=b.dataset.jerseyType;save();render()});

  const adv=document.getElementById('advancedBtn');if(adv)adv.onclick=()=>go('gorrasAdvanced');
  const back=document.getElementById('backGorras');if(back)back.onclick=()=>go('gorras');

  const jAdv=document.getElementById('jerseyAdvancedBtn');if(jAdv)jAdv.onclick=()=>go('jerseyAdvanced');
  const backJ=document.getElementById('backJerseys');if(backJ)backJ.onclick=()=>go('jerseys');
  const gQuote=document.getElementById('gorrasQuoteQty');if(gQuote)gQuote.addEventListener('input',refreshGorrasQuote);
  const jQuote=document.getElementById('jerseysQuoteQty');if(jQuote)jQuote.addEventListener('input',refreshJerseysQuote);
  const gCurrency=document.getElementById('gorrasQuoteCurrency');if(gCurrency)gCurrency.addEventListener('change',refreshGorrasQuote);
  const jCurrency=document.getElementById('jerseysQuoteCurrency');if(jCurrency)jCurrency.addEventListener('change',refreshJerseysQuote);
  const gGen=document.getElementById('gorrasGenerateQuoteBtn');if(gGen)gGen.onclick=()=>openQuoteModal('gorras');
  const jGen=document.getElementById('jerseysGenerateQuoteBtn');if(jGen)jGen.onclick=()=>openQuoteModal('jerseys');

  const resetJ=document.getElementById('resetJerseyExcelBtn');if(resetJ)resetJ.onclick=()=>{
    const vars=clone(data.jerseys.variables);
    const active=data.jerseys.activeType;
    data.jerseys=clone(defaults.jerseys);
    data.jerseys.variables=vars;
    data.jerseys.activeType=active;
    data.appDataVersion=14;
    save();
    render();
  };

  const exp=document.getElementById('exportBtn');if(exp)exp.onclick=()=>{
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='sprint-precios-backup.json';a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000)
  };
  const imp=document.getElementById('importBtn');if(imp)imp.onclick=()=>{
    const f=document.getElementById('importFile').files[0];if(!f)return alert('Seleccioná un archivo JSON');
    const r=new FileReader();r.onload=()=>{
      try{data=normalizeData(mergeDeep(clone(defaults),JSON.parse(r.result)));save();render();alert('Backup importado')}
      catch(e){alert('Archivo no válido')}
    };r.readAsText(f)
  };
  const reset=document.getElementById('resetBtn');if(reset)reset.onclick=()=>{
    if(confirm('¿Restablecer los valores iniciales?')){data=clone(defaults);save();render()}
  }
}
document.querySelectorAll('.nav').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));render();
})();
