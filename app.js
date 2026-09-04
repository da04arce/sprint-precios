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
    variables:{utilidadPct:40,envioUSD:6,impuestoPct:21,comisionPct:5,usdArs:1498,usdCrc:445},
    activeType:'exclusive',
    lineas:[
      {id:'exclusive',name:'Jersey Exclusive',rows:[
        {rango:'15 - 30',unitUSD:26.2,declaredUSD:5,excelGastoUSD:36.12,excelVentaUSD:50.568},
        {rango:'30 - 49',unitUSD:25.2,declaredUSD:5,excelGastoUSD:35.07,excelVentaUSD:49.098},
        {rango:'50 - 99',unitUSD:23.8,declaredUSD:5,excelGastoUSD:33.6,excelVentaUSD:47.04},
        {rango:'100 - 200',unitUSD:null,declaredUSD:null,excelGastoUSD:null,excelVentaUSD:null}
      ]},
      {id:'procore',name:'Jersey Pro Core',rows:[
        {rango:'Unidad',unitUSD:36.5,declaredUSD:5,envioOverrideUSD:39,addRatesToBase:true,excelGastoUSD:88.788,excelVentaUSD:124.3032},
        {rango:'2 - 5',unitUSD:36.5,declaredUSD:5,envioOverrideUSD:15,addRatesToBase:true,excelGastoUSD:58.548,excelVentaUSD:81.9672},
        {rango:'6 - 9',unitUSD:36.5,declaredUSD:5,envioOverrideUSD:10,addRatesToBase:true,excelGastoUSD:52.248,excelVentaUSD:73.1472},
        {rango:'10 - 49',unitUSD:21.62,declaredUSD:5,excelGastoUSD:31.311,excelVentaUSD:43.8354},
        {rango:'50 unidades',unitUSD:20.53,declaredUSD:5,excelGastoUSD:30.1665,excelVentaUSD:42.2331}
      ]},
      {id:'epic',name:'Jersey Epic',rows:[
        {rango:'30 - 49',unitUSD:16.52,declaredUSD:5,excelGastoUSD:25.956,excelVentaUSD:36.3384},
        {rango:'50 - 99',unitUSD:15.86,declaredUSD:5,excelGastoUSD:25.263,excelVentaUSD:35.3682},
        {rango:'100 - 200',unitUSD:15.09,declaredUSD:5,excelGastoUSD:24.4545,excelVentaUSD:34.2363}
      ]}
    ]
  },
  calzas:{
    variables:{utilidadPct:35,envioUSD:39,impuestoPct:21,comisionPct:5,usdArs:1498,usdCrc:445},
    activeType:'procore',
    lineas:[
      {id:'procore',name:'Calza corta Pro Core',rows:[
        {rango:'Unidad',unitUSD:40.6,declaredUSD:5,excelGastoUSD:92.82,excelVentaUSD:125.307}
      ]},
      {id:'procore-elastic',name:'Calza corta Pro Core con pad elastic interface',rows:[
        {rango:'Unidad',unitUSD:50.6,declaredUSD:5,excelGastoUSD:103.32,excelVentaUSD:139.482}
      ]}
    ]
  },
  conjuntos:{
    variables:{utilidadPct:35,envioUSD:39,impuestoPct:21,comisionPct:5,usdArs:1498,usdCrc:445},
    activeType:'procore',
    lineas:[
      {id:'procore',name:'Conjunto Pro Core',rows:[
        {rango:'Unidad',unitUSD:77.1,declaredUSD:10,excelGastoUSD:132.195,excelVentaUSD:178.46325}
      ]},
      {id:'procore-elastic',name:'Conjunto Pro Core con pad elastic interface',rows:[
        {rango:'Unidad',unitUSD:87.1,declaredUSD:10,excelGastoUSD:142.695,excelVentaUSD:192.63825}
      ]}
    ]
  },
  placeholders:{accesorios:[]}
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
  if(!d.calzas) d.calzas=clone(defaults.calzas);
  if(!d.calzas.variables) d.calzas.variables=clone(defaults.calzas.variables);
  if(!d.calzas.activeType) d.calzas.activeType='procore';
  if(!d.conjuntos) d.conjuntos=clone(defaults.conjuntos);
  if(!d.conjuntos.variables) d.conjuntos.variables=clone(defaults.conjuntos.variables);
  if(!d.conjuntos.activeType) d.conjuntos.activeType='procore';

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

  // Los gastos variables siempre comienzan con los valores originales del Excel.
  d.gorras.variables=clone(defaults.gorras.variables);
  d.jerseys.variables=clone(defaults.jerseys.variables);
  d.calzas.variables=clone(defaults.calzas.variables);
  d.conjuntos.variables=clone(defaults.conjuntos.variables);

  return d;
}
function mergeDeep(target,source){if(!source||typeof source!=='object')return target;Object.keys(source).forEach(k=>{if(source[k]&&typeof source[k]==='object'&&!Array.isArray(source[k])&&target[k]&&typeof target[k]==='object'&&!Array.isArray(target[k]))mergeDeep(target[k],source[k]);else target[k]=source[k]});return target}
function save(){
  // Los gastos variables son valores de simulación: nunca se persisten.
  // El resto de la información (costos avanzados, rangos, etc.) sí se guarda.
  const persisted=clone(data);
  if(persisted.gorras) persisted.gorras.variables=clone(defaults.gorras.variables);
  if(persisted.jerseys) persisted.jerseys.variables=clone(defaults.jerseys.variables);
  if(persisted.calzas) persisted.calzas.variables=clone(defaults.calzas.variables);
  if(persisted.conjuntos) persisted.conjuntos.variables=clone(defaults.conjuntos.variables);
  localStorage.setItem(STORAGE,JSON.stringify(persisted));
  const e=document.getElementById('saveState');
  if(e){e.textContent='Guardado ✓';setTimeout(()=>e.textContent='Datos guardados en este navegador',1000)}
}



function migrateV36Pricing(){
  try{
    if(data && data._migrationV36PricingDone) return;

    const jerseyActive=(data.jerseys&&data.jerseys.activeType)||'exclusive';
    const calzaActive=(data.calzas&&data.calzas.activeType)||'procore';
    const conjuntoActive=(data.conjuntos&&data.conjuntos.activeType)||'procore';

    data.jerseys=clone(defaults.jerseys);
    data.calzas=clone(defaults.calzas);
    data.conjuntos=clone(defaults.conjuntos);

    data.jerseys.activeType=jerseyActive;
    data.calzas.activeType=calzaActive;
    data.conjuntos.activeType=conjuntoActive;

    data._migrationV36PricingDone=true;
    save();
  }catch(err){
    console.warn('Migración v36 precios:',err);
  }
}
migrateV36Pricing();

function migrateV34Conjuntos(){
  try{
    if(data && data._migrationV34ConjuntosDone) return;

    if(data && data.conjuntos){
      if(data.conjuntos.variables){
        const v=data.conjuntos.variables;
        if(Number(v.envioUSD)===10) v.envioUSD=20;
        if(Number(v.impuestoUSD)===3) v.impuestoUSD=6;
        if(Number(v.comisionUSD)===2) v.comisionUSD=4;
      }

      if(Array.isArray(data.conjuntos.lineas)){
        const pro=data.conjuntos.lineas.find(l=>l.id==='procore');
        const elastic=data.conjuntos.lineas.find(l=>l.id==='procore-elastic');

        if(pro && pro.rows && pro.rows[0]){
          if(Number(pro.rows[0].excelGastoUSD)===92.1) pro.rows[0].excelGastoUSD=107.1;
          if(Number(pro.rows[0].excelVentaUSD)===128.94) pro.rows[0].excelVentaUSD=149.94;
        }

        if(elastic && elastic.rows && elastic.rows[0]){
          if(Number(elastic.rows[0].excelGastoUSD)===102.1) elastic.rows[0].excelGastoUSD=117.1;
          if(Number(elastic.rows[0].excelVentaUSD)===142.94) elastic.rows[0].excelVentaUSD=163.94;
        }
      }
    }

    data._migrationV34ConjuntosDone=true;
    save();
  }catch(err){
    console.warn('Migración v34 Conjuntos:',err);
  }
}
migrateV34Conjuntos();

function migrateV28(){
  try{
    if(data && data._migrationV28Done) return;

    const lines=data && data.jerseys && data.jerseys.lineas;
    if(Array.isArray(lines)){
      const pro=lines.find(line=>line.id==='procore');
      if(pro && Array.isArray(pro.rows) && pro.rows[0]){
        const old=String(pro.rows[0].rango||'').trim().toLowerCase();
        if(old==='unidad' || old==='1 unidad'){
          pro.rows[0].rango='1 - 9';
        }
      }
    }

    data._migrationV28Done=true;
    save();
  }catch(err){
    console.warn('Migración v28:',err);
  }
}
migrateV28();

function num(v,d=2){if(v===null||v===undefined||v==='')return '—';return Number(v).toLocaleString('es-AR',{minimumFractionDigits:d,maximumFractionDigits:d})}
function ars(v){return v==null?'—':'$ '+num(v,0)} function usd(v){return v==null?'—':'US$ '+num(v,2)} function crc(v){return v==null?'—':'₡ '+num(v,0)} function pct(v){return num(v,1)+'%'}
function setPath(path,value){const parts=path.split('.');let o=data;for(let i=0;i<parts.length-1;i++)o=o[parts[i]];o[parts[parts.length-1]]=value===''?null:Number(value)}
function field(label,path,value,suffix=''){return `<div class="field"><label>${label}${suffix?' ('+suffix+')':''}</label><input type="number" step="any" value="${value??''}" data-path="${path}"></div>`}
function bindInputs(){
  document.querySelectorAll('[data-path]').forEach(el=>{
    el.addEventListener('input',e=>{
      const path=e.target.dataset.path;
      setPath(path,e.target.value);
      const isTransientVariable=path.startsWith('gorras.variables.')||path.startsWith('jerseys.variables.')||path.startsWith('calzas.variables.')||path.startsWith('conjuntos.variables.');
      if(!isTransientVariable) save();
      // No reconstruimos el formulario mientras se escribe: así el cursor permanece donde el usuario lo dejó.
      if(currentView==='gorras') refreshGorrasComputed();
      if(currentView==='gorrasAdvanced') refreshAdvancedComputed();
      if(currentView==='jerseys') refreshJerseysComputed();
      if(currentView==='calzas') refreshCalzasComputed();
      if(currentView==='conjuntos') refreshConjuntosComputed();
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
 const g=data.gorras,v=g.variables,t=g.tipos[typeKey];
 let costARS=null,costUSDForCRC=null,origin='';

 if(['unidad','2-3','4-9'].includes(rangeKey)){
   costARS=productionBase()+(Number(t.designByRange[rangeKey])||0);
   origin='Producción Sprint';
   // CRC se mantiene independiente de USD→ARS editable, como en la lógica original.
   costUSDForCRC=costARS/EXCEL_USD_ARS_REFERENCE;
 }else if(['10-30','30-100'].includes(rangeKey)){
   const productUSD=(Number(g.china.productUSD[rangeKey])||0);
   const fixedARS=(Number(g.china.disenoARS)||0)+(Number(v.envioARS)||0)+(Number(v.impuestoARS)||0)+(Number(v.comisionARS)||0);
   costARS=productUSD*(Number(v.usdArs)||0)+fixedARS;
   origin='Producción China';
   costUSDForCRC=productUSD+(fixedARS/EXCEL_USD_ARS_REFERENCE);
 }else{
   return {consult:true};
 }

 const utilityFactor=1+(Number(v.utilidadPct)||0)/100;
 const calculatedFinalARS=costARS*utilityFactor;
 const excelFinalARS=Number(t.excelFinal[rangeKey]);

 const dv=defaults.gorras.variables;

 // El precio redondeado del Excel es el precio estándar solo si los
 // gastos variables relevantes están en sus valores originales.
 // Al modificar cualquiera de ellos, ARS vuelve a calcularse.
 const usesDefaultVariables=
   Number(v.utilidadPct)===Number(dv.utilidadPct) &&
   Number(v.envioARS)===Number(dv.envioARS) &&
   Number(v.impuestoARS)===Number(dv.impuestoARS) &&
   Number(v.comisionARS)===Number(dv.comisionARS) &&
   Number(v.usdArs)===Number(dv.usdArs);

 const finalARS=(usesDefaultVariables && Number.isFinite(excelFinalARS))
   ? excelFinalARS
   : Math.round(calculatedFinalARS);

 const finalCRC=costUSDForCRC*utilityFactor*(Number(v.usdCrc)||0);

 return {
   costARS,
   finalARS,
   finalCRC,
   origin,
   excel:t.excelFinal[rangeKey],
   calculatedFinalARS
 };
}
function dashboard(){return `<h1>Resumen de precios</h1><p class="lead">Sistema interno Sprint. Gorras, Jerseys, Calzas y Conjuntos usan motores dinámicos de precios.</p><div class="grid grid-3"><div class="card"><div class="kpi-label">Gorras</div><div class="kpi-value">Dinámico</div><p class="subtle">Variables y rangos recalculados en vivo.</p><button class="btn small go" data-go="gorras">Abrir Gorras</button></div><div class="card"><div class="kpi-label">Jerseys</div><div class="kpi-value">Dinámico</div><p class="subtle">Exclusive, Pro Core y Epic con rangos recalculados en vivo.</p><button class="btn small go" data-go="jerseys">Abrir Jerseys</button></div><div class="card"><div class="kpi-label">Calzas</div><div class="kpi-value">Dinámico</div><p class="subtle">Pro Core y Pro Core con pad Elastic Interface.</p><button class="btn small go" data-go="calzas">Abrir Calzas</button></div></div>`}
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
    if(q>=2 && q<=5) return 1;
    if(q>=6 && q<=9) return 2;
    if(q>=10 && q<=49) return 3;
    if(q===50) return 4;
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


function supplierImportCalc(row,v){
  if(row.unitUSD==null) return {consult:true};

  const taxRate=(Number(v.impuestoPct)||0)/100;
  const commissionRate=(Number(v.comisionPct)||0)/100;
  const shipping=row.envioOverrideUSD!=null?Number(row.envioOverrideUSD):(Number(v.envioUSD)||0);
  const declared=Number(row.declaredUSD)||0;

  // Replica la lógica de los Excel nuevos.
  const baseGasto=Number(row.unitUSD)+shipping+(row.addRatesToBase?(taxRate+commissionRate):0);
  const costUSD=baseGasto+(baseGasto*commissionRate)+((declared+shipping)*taxRate);
  const finalUSD=costUSD*(1+(Number(v.utilidadPct)||0)/100);

  return {
    baseGasto,
    shipping,
    declared,
    costUSD,
    finalUSD,
    finalARS:finalUSD*(Number(v.usdArs)||0),
    finalCRC:finalUSD*(Number(v.usdCrc)||0)
  };
}

function calzaRangeForQuantity(line,q){
  q=Number(q)||0;
  if(q>=1) return 0;
  return null;
}
function calzaLineById(id){
  return data.calzas.lineas.find(l=>l.id===id)||data.calzas.lineas[0];
}
function calzaCalc(row){
  return supplierImportCalc(row,data.calzas.variables);
}


function conjuntoRangeForQuantity(line,q){
  q=Number(q)||0;
  if(q>=1) return 0;
  return null;
}
function conjuntoLineById(id){
  return data.conjuntos.lineas.find(l=>l.id===id)||data.conjuntos.lineas[0];
}
function conjuntoCalc(row){
  return supplierImportCalc(row,data.conjuntos.variables);
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
  </div>
  <div class="range-print-action">
    <button class="btn ghost" id="${kind}PrintRangesBtn">Imprimir rango de precio</button>
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


function getGorraRangePriceRows(currency){
  const type=data.gorras.activeType;
  const ranges=[
    {key:'unidad',label:'Unidad'},
    {key:'2-3',label:'2 - 3 unidades'},
    {key:'4-9',label:'4 - 9 unidades'},
    {key:'10-30',label:'10 - 30 unidades'},
    {key:'30-100',label:'30 - 100 unidades'},
    {key:'100+',label:'Más de 100 unidades'}
  ];
  return {
    product:type==='personalizadas'?'Gorra Personalizada':'Diseños Sprint',
    currency,
    rows:ranges.map(r=>{
      const c=gorrasCalc(type,r.key);
      if(c.consult) return {range:r.label,consult:true};
      return {range:r.label,price:currency==='CRC'?c.finalCRC:c.finalARS,consult:false};
    })
  };
}
function getJerseyRangePriceRows(currency){
  const line=jerseyLineById(data.jerseys.activeType);
  return {
    product:line.name,
    currency,
    rows:line.rows.map(row=>{
      const c=jerseyCalc(row);
      if(c.consult) return {range:row.rango,consult:true};
      return {range:row.rango,price:currency==='CRC'?c.finalCRC:c.finalARS,consult:false};
    })
  };
}
function getCalzaRangePriceRows(currency){
  const line=calzaLineById(data.calzas.activeType);
  return {
    product:line.name,
    currency,
    rows:line.rows.map(row=>{
      const c=calzaCalc(row);
      if(c.consult) return {range:row.rango,consult:true};
      return {range:row.rango,price:currency==='CRC'?c.finalCRC:c.finalARS,consult:false};
    })
  };
}
function getConjuntoRangePriceRows(currency){
  const line=conjuntoLineById(data.conjuntos.activeType);
  return {
    product:line.name,
    currency,
    rows:line.rows.map(row=>{
      const c=conjuntoCalc(row);
      if(c.consult) return {range:row.rango,consult:true};
      return {range:row.rango,price:currency==='CRC'?c.finalCRC:c.finalARS,consult:false};
    })
  };
}
function getRangePriceData(kind,currency){
  if(kind==='gorras') return getGorraRangePriceRows(currency);
  if(kind==='calzas') return getCalzaRangePriceRows(currency);
  if(kind==='conjuntos') return getConjuntoRangePriceRows(currency);
  return getJerseyRangePriceRows(currency);
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
    product:data.gorras.activeType==='personalizadas'?'Gorra Personalizada':'Diseño Sprint',
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

function getCurrentCalzaQuoteData(){
  const input=document.getElementById('calzasQuoteQty');
  if(!input) return null;
  const q=Math.floor(Number(input.value)||0);
  if(q<=0) return null;
  const line=calzaLineById(data.calzas.activeType);
  const index=calzaRangeForQuantity(line,q);
  if(index===null) return null;
  const row=line.rows[index],c=calzaCalc(row);
  if(c.consult) return null;
  const currency=quoteCurrency('calzas');
  return {
    category:'Calzas',
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


function getCurrentConjuntoQuoteData(){
  const input=document.getElementById('conjuntosQuoteQty');
  if(!input) return null;
  const q=Math.floor(Number(input.value)||0);
  if(q<=0) return null;
  const line=conjuntoLineById(data.conjuntos.activeType);
  const index=conjuntoRangeForQuantity(line,q);
  if(index===null) return null;
  const row=line.rows[index],c=conjuntoCalc(row);
  if(c.consult) return null;
  const currency=quoteCurrency('conjuntos');
  return {
    category:'Conjuntos',product:line.name,quantity:q,range:row.rango,currency,
    unitARS:c.finalARS,totalARS:c.finalARS*q,unitCRC:c.finalCRC,totalCRC:c.finalCRC*q
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
  const q=kind==='gorras'?getCurrentGorraQuoteData():(kind==='calzas'?getCurrentCalzaQuoteData():(kind==='conjuntos'?getCurrentConjuntoQuoteData():getCurrentJerseyQuoteData()));
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

      <div class="quote-deposit-section">
        <div class="section-title">Seña</div>
        <p class="subtle quote-deposit-help">Por defecto se solicita el 50%. Si acordás una seña diferente con el cliente, modificá únicamente el monto y el porcentaje se calculará automáticamente.</p>
        <div class="quote-deposit-grid">
          <div class="field">
            <label>Porcentaje de seña</label>
            <input id="quoteDepositPercent" type="text" value="50%" readonly>
          </div>
          <div class="field">
            <label>Monto de seña (${q.currency})</label>
            <input id="quoteDepositAmount" type="number" min="0" step="any">
          </div>
          <div class="field">
            <label>Saldo restante</label>
            <input id="quoteDepositBalance" type="text" readonly>
          </div>
        </div>
      </div>

      <div class="actions right">
        <button class="btn ghost" id="quotePreviewBtn">Vista previa</button>
        <button class="btn" id="quotePrintBtn">Imprimir / Guardar PDF</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const quoteTotal=q.currency==='CRC'?q.totalCRC:q.totalARS;
  const depositInput=document.getElementById('quoteDepositAmount');
  const depositPercent=document.getElementById('quoteDepositPercent');
  const depositBalance=document.getElementById('quoteDepositBalance');

  const updateDeposit=()=>{
    let amount=Number(depositInput.value);
    if(!Number.isFinite(amount)) amount=0;
    amount=Math.max(0,Math.min(quoteTotal,amount));
    const percent=quoteTotal>0?(amount/quoteTotal)*100:0;
    const balance=quoteTotal-amount;
    depositPercent.value=num(percent,2).replace(',00','')+'%';
    depositBalance.value=moneyByCurrency(balance,q.currency);
    activeQuoteDraft.depositAmount=amount;
    activeQuoteDraft.depositPercent=percent;
  };

  const defaultDeposit=quoteTotal*0.5;
  depositInput.value=Number(defaultDeposit.toFixed(2));
  activeQuoteDraft.depositAmount=defaultDeposit;
  activeQuoteDraft.depositPercent=50;
  updateDeposit();

  depositInput.addEventListener('input',updateDeposit);

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
  let deposit=Number(q.depositAmount);
  if(!Number.isFinite(deposit)) deposit=totalQuote*0.5;
  deposit=Math.max(0,Math.min(totalQuote,deposit));
  const depositPercent=totalQuote>0?(deposit/totalQuote)*100:0;
  const balance=totalQuote-deposit;
  const balancePercent=Math.max(0,100-depositPercent);
  const depositPctLabel=num(depositPercent,2).replace(',00','')+'%';
  const balancePctLabel=num(balancePercent,2).replace(',00','')+'%';
  const quoteMoney=(value)=>moneyByCurrency(value,quoteCurrencyCode);

  let printView=document.getElementById('printQuote');
  if(printView) printView.remove();

  printView=document.createElement('section');
  printView.id='printQuote';
  printView.className='print-quote';
  const subcategory=q.product.replace(/^Jersey\s+/,'').replace(/^Gorra\s+/,'').replace(/^Calza\s+/,'').replace(/^Conjunto\s+/,'');

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
            <div><span>Seña para comenzar (${depositPctLabel}):</span><strong>${quoteMoney(deposit)}</strong></div>
            <div><span>Saldo restante (${balancePctLabel}):</span><strong>${quoteMoney(balance)}</strong></div>
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
          <div><span>Seña ${depositPctLabel}:</span><strong>${quoteMoney(deposit)}</strong></div>
          <div><span>Saldo ${balancePctLabel}:</span><strong>${quoteMoney(balance)}</strong></div>
          <div class="print-v20-total-main"><span>Total (${quoteCurrencyCode}):</span><strong>${quoteMoney(totalQuote)}</strong></div>
        </div>
      </section>

      <section class="print-v20-info">
        <div class="print-v20-info-title"><span class="print-v20-info-dot">i</span> Información de la compra</div>
        <p>Comenzamos a trabajar en tu diseño con una seña del ${depositPctLabel} del monto, puedes hacer los cambios de diseño que requieras sin costos adicionales :).</p>
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



function chooseRangePrintCurrency(kind){
  const existing=document.getElementById('rangeCurrencyModal');
  if(existing) existing.remove();

  const modal=document.createElement('div');
  modal.id='rangeCurrencyModal';
  modal.className='quote-modal';
  modal.innerHTML=`
    <div class="quote-modal-card range-currency-modal-card">
      <div class="quote-modal-head">
        <div>
          <h2>Imprimir rango de precio</h2>
          <p>Elegí la moneda que querés usar en el archivo.</p>
        </div>
        <button class="quote-close" id="rangeCurrencyClose" aria-label="Cerrar">×</button>
      </div>

      <div class="range-currency-options">
        <button class="range-currency-option" data-range-currency="ARS">
          <span class="range-currency-code">ARS</span>
          <strong>Pesos argentinos</strong>
        </button>
        <button class="range-currency-option" data-range-currency="CRC">
          <span class="range-currency-code">CRC</span>
          <strong>Colones</strong>
        </button>
      </div>
    </div>`;

  document.body.appendChild(modal);

  const close=()=>modal.remove();
  document.getElementById('rangeCurrencyClose').onclick=close;
  modal.addEventListener('click',e=>{if(e.target===modal) close()});

  modal.querySelectorAll('[data-range-currency]').forEach(btn=>{
    btn.onclick=()=>{
      const currency=btn.dataset.rangeCurrency;
      modal.remove();
      renderRangePriceSheet(kind,currency);
    };
  });
}

function renderRangePriceSheet(kind,currency){
  const d=getRangePriceData(kind,currency);
  if(!d) return;

  const old=document.getElementById('printQuote');
  if(old) old.remove();

  const printView=document.createElement('section');
  printView.id='printQuote';
  printView.className='print-quote';

  const rowsHtml=d.rows.map(row=>`
    <tr>
      <td>${row.range}</td>
      <td>${row.consult?'<span class="range-sheet-consult">Consultar</span>':moneyByCurrency(row.price,d.currency)}</td>
    </tr>`).join('');

  printView.innerHTML=`
    <div class="print-quote-page print-v20 range-sheet-v30">
      <img src="sprint-logo-pdf.png" alt="" class="print-v20-watermark" aria-hidden="true">

      <header class="print-v20-header range-sheet-header">
        <img src="sprint-logo-pdf.png" alt="Sprint" class="print-v20-logo">
        <div class="print-v20-title-wrap">
          <div class="print-v20-title range-sheet-title">Precios ${d.product}</div>
          <div class="print-v20-title-line"></div>
        </div>
      </header>

      <section class="range-sheet-intro">
        <div class="range-sheet-product">${d.product}</div>
        <div class="range-sheet-currency">Precios expresados en <strong>${d.currency}</strong></div>
      </section>

      <section class="range-sheet-table-wrap">
        <table class="range-sheet-table">
          <thead><tr><th>Rango de cantidad</th><th>Precio unitario (${d.currency})</th></tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </section>

      <section class="print-v20-info range-sheet-info">
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
  const close=document.getElementById('closePrintPreview');
  if(close) close.onclick=()=>printView.remove();
  const print=document.getElementById('doPrintQuote');
  if(print) print.onclick=()=>window.print();

  const esc=(e)=>{
    if(e.key==='Escape'){
      printView.remove();
      document.removeEventListener('keydown',esc);
    }
  };
  document.addEventListener('keydown',esc);
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


function refreshCalzasQuote(){
  const input=document.getElementById('calzasQuoteQty');
  const body=document.getElementById('calzasQuoteBody');
  if(!input||!body) return;
  const currency=quoteCurrency('calzas');
  updateQuoteHeaders('calzas',currency);
  const q=Math.floor(Number(input.value)||0);
  if(q<=0){
    body.innerHTML=`<tr><td colspan="4" class="quote-empty">Ingresá una cantidad para calcular la cotización.</td></tr>`;
    return;
  }
  const line=calzaLineById(data.calzas.activeType);
  const index=calzaRangeForQuantity(line,q);
  if(index===null){
    body.innerHTML=`<tr><td>${q}</td><td>Fuera de rango</td><td><span class="consult-pill">Consultar</span></td><td>—</td></tr>`;
    return;
  }
  const row=line.rows[index],c=calzaCalc(row);
  if(c.consult){
    body.innerHTML=`<tr><td>${q}</td><td>${row.rango}</td><td><span class="consult-pill">Consultar</span></td><td>—</td></tr>`;
    return;
  }
  const unit=currency==='CRC'?c.finalCRC:c.finalARS;
  body.innerHTML=`<tr><td><strong>${q}</strong></td><td>${row.rango}</td><td class="quote-unit">${moneyByCurrency(unit,currency)}</td><td class="quote-total">${moneyByCurrency(unit*q,currency)}</td></tr>`;
}


function refreshConjuntosQuote(){
  const input=document.getElementById('conjuntosQuoteQty');
  const body=document.getElementById('conjuntosQuoteBody');
  if(!input||!body) return;
  const currency=quoteCurrency('conjuntos');
  updateQuoteHeaders('conjuntos',currency);
  const q=Math.floor(Number(input.value)||0);
  if(q<=0){body.innerHTML=`<tr><td colspan="4" class="quote-empty">Ingresá una cantidad para calcular la cotización.</td></tr>`;return;}
  const line=conjuntoLineById(data.conjuntos.activeType);
  const index=conjuntoRangeForQuantity(line,q);
  if(index===null){body.innerHTML=`<tr><td>${q}</td><td>Fuera de rango</td><td><span class="consult-pill">Consultar</span></td><td>—</td></tr>`;return;}
  const row=line.rows[index],c=conjuntoCalc(row);
  if(c.consult){body.innerHTML=`<tr><td>${q}</td><td>${row.rango}</td><td><span class="consult-pill">Consultar</span></td><td>—</td></tr>`;return;}
  const unit=currency==='CRC'?c.finalCRC:c.finalARS;
  body.innerHTML=`<tr><td><strong>${q}</strong></td><td>${row.rango}</td><td class="quote-unit">${moneyByCurrency(unit,currency)}</td><td class="quote-total">${moneyByCurrency(unit*q,currency)}</td></tr>`;
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
  return supplierImportCalc(row,data.jerseys.variables);
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
    ${variableCard('Envío base','jerseys.variables.envioUSD',v.envioUSD,'USD / jersey','Excel: US$ 6')}
    ${variableCard('Impuestos','jerseys.variables.impuestoPct',v.impuestoPct,'%','Excel: 21%')}
    ${variableCard('Comisión','jerseys.variables.comisionPct',v.comisionPct,'%','Excel: 5%')}
    ${variableCard('USD → ARS','jerseys.variables.usdArs',v.usdArs,'ARS / USD','Excel: 1.498')}
    ${variableCard('USD → CRC','jerseys.variables.usdCrc',v.usdCrc,'CRC / USD','Excel: 445')}
  </div>
  <div class="section-bar"><div><h2>Precios por rango</h2><p>Seleccioná el tipo de jersey para ver sus rangos y precios recalculados.</p></div><div class="segmented">${tabs}</div></div>
  <div class="table-wrap price-range-table"><table><thead><tr><th>Rango</th><th>Gasto total USD</th><th>Precio cliente ARS</th><th>Precio cliente CRC</th></tr></thead><tbody id="jerseyPriceBody">${rows}</tbody></table></div>
  <div class="info"><strong>Lógica usada:</strong> cada rango usa su Precio Unitario Proveedor del Excel. Al precio base se incorpora el envío; comisión e impuestos se calculan porcentualmente según el Excel y luego se aplica la Utilidad. El resultado en USD se convierte de forma independiente a ARS y CRC usando cada tipo de cambio.</div>
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
      <td>${r.declaredUSD==null?'—':usd(r.declaredUSD)}</td>
      <td>${c.consult?'—':usd(c.shipping)}</td>
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
    <div class="table-wrap"><table class="editable-table"><thead><tr><th>Rango</th><th>Precio unitario proveedor</th><th>Valor declarado</th><th>Envío aplicado</th><th>Gasto Excel</th><th>Venta Excel</th><th>Gasto dinámico actual</th></tr></thead><tbody>${body}</tbody></table></div>
  </div>
  <div class="info"><strong>Fórmula verificada en el Excel:</strong> el gasto parte del precio unitario + envío. La comisión se aplica como porcentaje sobre ese gasto y el impuesto como porcentaje sobre el valor declarado + envío. Luego se aplica la utilidad. Los tipos de cambio convierten el precio final a ARS y CRC.</div>`;
}

function calzaPriceRow(lineId,index){
  const line=calzaLineById(lineId),row=line.rows[index],c=calzaCalc(row);
  if(c.consult) return `<tr><td><strong>${row.rango}</strong><div class="range-origin">Cotización especial</div></td><td>—</td><td><span class="consult-pill">Consultar</span></td><td>—</td></tr>`;
  return `<tr><td><strong>${row.rango}</strong><div class="range-origin">${line.name}</div></td><td class="money-cost">${usd(c.costUSD)}</td><td class="money-final">${ars(c.finalARS)}</td><td class="money-crc">${crc(c.finalCRC)}</td></tr>`;
}
function refreshCalzasComputed(){
  const body=document.getElementById('calzaPriceBody');
  if(!body) return;
  const line=calzaLineById(data.calzas.activeType);
  body.innerHTML=line.rows.map((_,i)=>calzaPriceRow(line.id,i)).join('');
  refreshCalzasQuote();
}
function refreshCalzaAdvancedComputed(){
  const line=calzaLineById(data.calzas.activeType);
  line.rows.forEach((row,i)=>{
    const el=document.getElementById(`calzaComputed-${i}`);
    if(el){
      const c=calzaCalc(row);
      el.textContent=c.consult?'—':usd(c.costUSD);
    }
  });
}
function calzas(){
  const c=data.calzas,v=c.variables,line=calzaLineById(c.activeType);
  const tabs=c.lineas.map(l=>`<button class="segment ${l.id===c.activeType?'active':''}" data-calza-type="${l.id}">${l.name.replace('Calza corta ','')}</button>`).join('');
  const rows=line.rows.map((_,i)=>calzaPriceRow(line.id,i)).join('');
  return `<div class="between"><div><h1>Calzas</h1><p class="lead">Precios dinámicos según los criterios del archivo de precios de Calzas.</p></div><div class="actions"><button class="btn secondary" id="resetCalzaExcelBtn">Restablecer valores del Excel</button><button class="btn ghost" id="calzaAdvancedBtn">Opciones avanzadas · ${line.name.replace('Calza corta ','')}</button></div></div>
  <div class="section-bar"><div><h2>Gastos variables</h2><p>Modificá estos valores y los precios se recalculan al instante.</p></div></div>
  <div class="variable-grid">
    ${variableCard('Utilidad','calzas.variables.utilidadPct',v.utilidadPct,'%','Excel: 35%')}
    ${variableCard('Envío','calzas.variables.envioUSD',v.envioUSD,'USD / calza','Excel: US$ 39')}
    ${variableCard('Impuestos','calzas.variables.impuestoPct',v.impuestoPct,'%','Excel: 21%')}
    ${variableCard('Comisión','calzas.variables.comisionPct',v.comisionPct,'%','Excel: 5%')}
    ${variableCard('USD → ARS','calzas.variables.usdArs',v.usdArs,'ARS / USD','Excel: 1.498')}
    ${variableCard('USD → CRC','calzas.variables.usdCrc',v.usdCrc,'CRC / USD','Excel: 445')}
  </div>
  <div class="section-bar"><div><h2>Precios por rango</h2><p>Seleccioná el tipo de calza para ver sus precios recalculados.</p></div><div class="segmented">${tabs}</div></div>
  <div class="table-wrap price-range-table"><table><thead><tr><th>Rango</th><th>Gasto total USD</th><th>Precio cliente ARS</th><th>Precio cliente CRC</th></tr></thead><tbody id="calzaPriceBody">${rows}</tbody></table></div>
  <div class="info"><strong>Lógica usada:</strong> se usa el Precio Unitario Proveedor del Excel. Al precio base se incorpora el envío; comisión e impuestos se calculan porcentualmente según el Excel y luego se aplica la Utilidad. El resultado en USD se convierte de forma independiente a ARS y CRC usando cada tipo de cambio.</div>
  ${quoteSection('calzas')}`;
}
function calzaAdvanced(){
  const c=data.calzas,line=calzaLineById(c.activeType);
  const lineIndex=c.lineas.indexOf(line);
  const body=line.rows.map((r,i)=>{
    const calc=calzaCalc(r);
    return `<tr>
      <td><strong>${r.rango}</strong></td>
      <td><input type="number" step="any" value="${r.unitUSD??''}" data-path="calzas.lineas.${lineIndex}.rows.${i}.unitUSD"></td>
      <td>${r.declaredUSD==null?'—':usd(r.declaredUSD)}</td>
      <td>${calc.consult?'—':usd(calc.shipping)}</td>
      <td>${r.excelGastoUSD==null?'—':usd(r.excelGastoUSD)}</td>
      <td>${r.excelVentaUSD==null?'—':usd(r.excelVentaUSD)}</td>
      <td id="calzaComputed-${i}">${calc.consult?'—':usd(calc.costUSD)}</td>
    </tr>`;
  }).join('');
  return `<div class="backline"><button class="btn secondary" id="backCalzas">← Volver a Calzas</button></div>
  <h1>Opciones avanzadas — ${line.name}</h1>
  <p class="lead">El Precio Unitario Proveedor es el valor base del Excel para cada tipo de calza y alimenta directamente el cálculo.</p>
  <div class="card">
    <div class="section-title">Costos</div>
    <div class="table-wrap"><table class="editable-table"><thead><tr><th>Rango</th><th>Precio unitario proveedor</th><th>Valor declarado</th><th>Envío aplicado</th><th>Gasto Excel</th><th>Venta Excel</th><th>Gasto dinámico actual</th></tr></thead><tbody>${body}</tbody></table></div>
  </div>
  <div class="info"><strong>Fórmula verificada en el Excel:</strong> el gasto parte del precio unitario + envío. La comisión se aplica como porcentaje sobre ese gasto y el impuesto como porcentaje sobre el valor declarado + envío. Luego se aplica la utilidad. Los tipos de cambio convierten el precio final a ARS y CRC.</div>`;
}


function conjuntoPriceRow(lineId,index){
  const line=conjuntoLineById(lineId),row=line.rows[index],c=conjuntoCalc(row);
  if(c.consult) return `<tr><td><strong>${row.rango}</strong><div class="range-origin">Cotización especial</div></td><td>—</td><td><span class="consult-pill">Consultar</span></td><td>—</td></tr>`;
  return `<tr><td><strong>${row.rango}</strong><div class="range-origin">${line.name}</div></td><td class="money-cost">${usd(c.costUSD)}</td><td class="money-final">${ars(c.finalARS)}</td><td class="money-crc">${crc(c.finalCRC)}</td></tr>`;
}
function refreshConjuntosComputed(){
  const body=document.getElementById('conjuntoPriceBody');
  if(!body) return;
  const line=conjuntoLineById(data.conjuntos.activeType);
  body.innerHTML=line.rows.map((_,i)=>conjuntoPriceRow(line.id,i)).join('');
  refreshConjuntosQuote();
}
function refreshConjuntoAdvancedComputed(){
  const line=conjuntoLineById(data.conjuntos.activeType);
  line.rows.forEach((row,i)=>{
    const el=document.getElementById(`conjuntoComputed-${i}`);
    if(el){const c=conjuntoCalc(row);el.textContent=c.consult?'—':usd(c.costUSD);}
  });
}
function conjuntos(){
  const c=data.conjuntos,v=c.variables,line=conjuntoLineById(c.activeType);
  const tabs=c.lineas.map(l=>`<button class="segment ${l.id===c.activeType?'active':''}" data-conjunto-type="${l.id}">${l.name.replace('Conjunto ','')}</button>`).join('');
  const rows=line.rows.map((_,i)=>conjuntoPriceRow(line.id,i)).join('');
  return `<div class="between"><div><h1>Conjuntos</h1><p class="lead">Precios dinámicos según los criterios del archivo de precios de Conjuntos.</p></div><div class="actions"><button class="btn secondary" id="resetConjuntoExcelBtn">Restablecer valores del Excel</button><button class="btn ghost" id="conjuntoAdvancedBtn">Opciones avanzadas · ${line.name.replace('Conjunto ','')}</button></div></div>
  <div class="section-bar"><div><h2>Gastos variables</h2><p>Modificá estos valores y los precios se recalculan al instante.</p></div></div>
  <div class="variable-grid">
    ${variableCard('Utilidad','conjuntos.variables.utilidadPct',v.utilidadPct,'%','Excel: 35%')}
    ${variableCard('Envío','conjuntos.variables.envioUSD',v.envioUSD,'USD / conjunto','Excel: US$ 39')}
    ${variableCard('Impuestos','conjuntos.variables.impuestoPct',v.impuestoPct,'%','Excel: 21%')}
    ${variableCard('Comisión','conjuntos.variables.comisionPct',v.comisionPct,'%','Excel: 5%')}
    ${variableCard('USD → ARS','conjuntos.variables.usdArs',v.usdArs,'ARS / USD','Excel: 1.498')}
    ${variableCard('USD → CRC','conjuntos.variables.usdCrc',v.usdCrc,'CRC / USD','Excel: 445')}
  </div>
  <div class="section-bar"><div><h2>Precios por rango</h2><p>Seleccioná el tipo de conjunto para ver sus precios recalculados.</p></div><div class="segmented">${tabs}</div></div>
  <div class="table-wrap price-range-table"><table><thead><tr><th>Rango</th><th>Gasto total USD</th><th>Precio cliente ARS</th><th>Precio cliente CRC</th></tr></thead><tbody id="conjuntoPriceBody">${rows}</tbody></table></div>
  <div class="info"><strong>Lógica usada:</strong> se usa el Precio Unitario Proveedor del Excel. Al precio base se incorpora el envío; comisión e impuestos se calculan porcentualmente según el Excel y luego se aplica la Utilidad. El resultado en USD se convierte de forma independiente a ARS y CRC usando cada tipo de cambio.</div>
  ${quoteSection('conjuntos')}`;
}
function conjuntoAdvanced(){
  const c=data.conjuntos,line=conjuntoLineById(c.activeType),lineIndex=c.lineas.indexOf(line);
  const body=line.rows.map((r,i)=>{
    const calc=conjuntoCalc(r);
    return `<tr><td><strong>${r.rango}</strong></td><td><input type="number" step="any" value="${r.unitUSD??''}" data-path="conjuntos.lineas.${lineIndex}.rows.${i}.unitUSD"></td><td>${r.declaredUSD==null?'—':usd(r.declaredUSD)}</td><td>${calc.consult?'—':usd(calc.shipping)}</td><td>${r.excelGastoUSD==null?'—':usd(r.excelGastoUSD)}</td><td>${r.excelVentaUSD==null?'—':usd(r.excelVentaUSD)}</td><td id="conjuntoComputed-${i}">${calc.consult?'—':usd(calc.costUSD)}</td></tr>`;
  }).join('');
  return `<div class="backline"><button class="btn secondary" id="backConjuntos">← Volver a Conjuntos</button></div>
  <h1>Opciones avanzadas — ${line.name}</h1>
  <p class="lead">El Precio Unitario Proveedor es el valor base del Excel para cada tipo de conjunto y alimenta directamente el cálculo.</p>
  <div class="card"><div class="section-title">Costos</div><div class="table-wrap"><table class="editable-table"><thead><tr><th>Rango</th><th>Precio unitario proveedor</th><th>Valor declarado</th><th>Envío aplicado</th><th>Gasto Excel</th><th>Venta Excel</th><th>Gasto dinámico actual</th></tr></thead><tbody>${body}</tbody></table></div></div>
  <div class="info"><strong>Fórmula verificada en el Excel:</strong> el gasto parte del precio unitario + envío. La comisión se aplica como porcentaje sobre ese gasto y el impuesto como porcentaje sobre el valor declarado + envío. Luego se aplica la utilidad. Los tipos de cambio convierten el precio final a ARS y CRC.</div>`;
}

function placeholder(name){return `<h1>${name}</h1><p class="lead">Categoría preparada para incorporar su estructura de costos.</p><div class="placeholder"><h2>${name}</h2><p>Todavía no tiene precios cargados.</p></div>`}
function config(){return `<h1>Configuración general</h1><p class="lead">Los gastos variables de cada producto se administran directamente en su pestaña para evitar mezclar fórmulas entre categorías.</p><div class="info">Gorras, Jerseys, Calzas y Conjuntos ya tienen configuración dinámica propia. Accesorios se agregará cuando carguemos su estructura de costos.</div>`}
function backup(){return `<h1>Backup</h1><p class="lead">Exportá o recuperá todos los datos guardados en este navegador.</p><div class="grid grid-2"><div class="card"><div class="section-title">Exportar</div><button id="exportBtn" class="btn">Exportar datos</button></div><div class="card"><div class="section-title">Importar</div><input id="importFile" type="file" accept="application/json"><div style="height:10px"></div><button id="importBtn" class="btn secondary">Importar backup</button></div></div><div style="height:16px"></div><div class="card"><div class="section-title">Restablecer</div><button id="resetBtn" class="btn danger">Restablecer valores del Excel</button></div>`}
function render(){const app=document.getElementById('app');if(currentView==='dashboard')app.innerHTML=dashboard();else if(currentView==='gorras')app.innerHTML=gorras();else if(currentView==='gorrasAdvanced')app.innerHTML=gorrasAdvanced();else if(currentView==='jerseys')app.innerHTML=jerseys();else if(currentView==='jerseyAdvanced')app.innerHTML=jerseyAdvanced();else if(currentView==='calzas')app.innerHTML=calzas();else if(currentView==='calzaAdvanced')app.innerHTML=calzaAdvanced();else if(currentView==='conjuntos')app.innerHTML=conjuntos();else if(currentView==='conjuntoAdvanced')app.innerHTML=conjuntoAdvanced();else if(currentView==='accesorios')app.innerHTML=placeholder('Accesorios');else if(currentView==='config')app.innerHTML=config();else app.innerHTML=backup();bindInputs();bindSpecial()}
function go(v){
  const gorrasViews=['gorras','gorrasAdvanced'];
  const jerseyViews=['jerseys','jerseyAdvanced'];
  const calzaViews=['calzas','calzaAdvanced'];
  const conjuntoViews=['conjuntos','conjuntoAdvanced'];

  if(gorrasViews.includes(currentView) && !gorrasViews.includes(v)){
    data.gorras.variables=clone(defaults.gorras.variables);
  }
  if(jerseyViews.includes(currentView) && !jerseyViews.includes(v)){
    data.jerseys.variables=clone(defaults.jerseys.variables);
  }
  if(calzaViews.includes(currentView) && !calzaViews.includes(v)){
    data.calzas.variables=clone(defaults.calzas.variables);
  }
  if(conjuntoViews.includes(currentView) && !conjuntoViews.includes(v)){
    data.conjuntos.variables=clone(defaults.conjuntos.variables);
  }

  currentView=v;
  document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  render();
}
function bindSpecial(){
  document.querySelectorAll('.go').forEach(b=>b.onclick=()=>go(b.dataset.go));
  document.querySelectorAll('[data-type]').forEach(b=>b.onclick=()=>{data.gorras.activeType=b.dataset.type;save();render()});
  document.querySelectorAll('[data-jersey-type]').forEach(b=>b.onclick=()=>{data.jerseys.activeType=b.dataset.jerseyType;save();render()});
  document.querySelectorAll('[data-calza-type]').forEach(b=>b.onclick=()=>{data.calzas.activeType=b.dataset.calzaType;save();render()});
  document.querySelectorAll('[data-conjunto-type]').forEach(b=>b.onclick=()=>{data.conjuntos.activeType=b.dataset.conjuntoType;save();render()});

  const adv=document.getElementById('advancedBtn');if(adv)adv.onclick=()=>go('gorrasAdvanced');
  const back=document.getElementById('backGorras');if(back)back.onclick=()=>go('gorras');

  const jAdv=document.getElementById('jerseyAdvancedBtn');if(jAdv)jAdv.onclick=()=>go('jerseyAdvanced');
  const backJ=document.getElementById('backJerseys');if(backJ)backJ.onclick=()=>go('jerseys');
  const cAdv=document.getElementById('calzaAdvancedBtn');if(cAdv)cAdv.onclick=()=>go('calzaAdvanced');
  const backC=document.getElementById('backCalzas');if(backC)backC.onclick=()=>go('calzas');
  const coAdv=document.getElementById('conjuntoAdvancedBtn');if(coAdv)coAdv.onclick=()=>go('conjuntoAdvanced');
  const backCo=document.getElementById('backConjuntos');if(backCo)backCo.onclick=()=>go('conjuntos');
  const gQuote=document.getElementById('gorrasQuoteQty');if(gQuote)gQuote.addEventListener('input',refreshGorrasQuote);
  const jQuote=document.getElementById('jerseysQuoteQty');if(jQuote)jQuote.addEventListener('input',refreshJerseysQuote);
  const cQuote=document.getElementById('calzasQuoteQty');if(cQuote)cQuote.addEventListener('input',refreshCalzasQuote);
  const coQuote=document.getElementById('conjuntosQuoteQty');if(coQuote)coQuote.addEventListener('input',refreshConjuntosQuote);
  const gCurrency=document.getElementById('gorrasQuoteCurrency');if(gCurrency)gCurrency.addEventListener('change',refreshGorrasQuote);
  const jCurrency=document.getElementById('jerseysQuoteCurrency');if(jCurrency)jCurrency.addEventListener('change',refreshJerseysQuote);
  const cCurrency=document.getElementById('calzasQuoteCurrency');if(cCurrency)cCurrency.addEventListener('change',refreshCalzasQuote);
  const coCurrency=document.getElementById('conjuntosQuoteCurrency');if(coCurrency)coCurrency.addEventListener('change',refreshConjuntosQuote);
  const gGen=document.getElementById('gorrasGenerateQuoteBtn');if(gGen)gGen.onclick=()=>openQuoteModal('gorras');
  const jGen=document.getElementById('jerseysGenerateQuoteBtn');if(jGen)jGen.onclick=()=>openQuoteModal('jerseys');
  const cGen=document.getElementById('calzasGenerateQuoteBtn');if(cGen)cGen.onclick=()=>openQuoteModal('calzas');
  const coGen=document.getElementById('conjuntosGenerateQuoteBtn');if(coGen)coGen.onclick=()=>openQuoteModal('conjuntos');
  const gRanges=document.getElementById('gorrasPrintRangesBtn');if(gRanges)gRanges.onclick=()=>chooseRangePrintCurrency('gorras');
  const jRanges=document.getElementById('jerseysPrintRangesBtn');if(jRanges)jRanges.onclick=()=>chooseRangePrintCurrency('jerseys');
  const cRanges=document.getElementById('calzasPrintRangesBtn');if(cRanges)cRanges.onclick=()=>chooseRangePrintCurrency('calzas');
  const coRanges=document.getElementById('conjuntosPrintRangesBtn');if(coRanges)coRanges.onclick=()=>chooseRangePrintCurrency('conjuntos');

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

  const resetC=document.getElementById('resetCalzaExcelBtn');if(resetC)resetC.onclick=()=>{
    const vars=clone(data.calzas.variables);
    const active=data.calzas.activeType;
    data.calzas=clone(defaults.calzas);
    data.calzas.variables=vars;
    data.calzas.activeType=active;
    save();
    render();
  };

  const resetCo=document.getElementById('resetConjuntoExcelBtn');if(resetCo)resetCo.onclick=()=>{
    const vars=clone(data.conjuntos.variables);
    const active=data.conjuntos.activeType;
    data.conjuntos=clone(defaults.conjuntos);
    data.conjuntos.variables=vars;
    data.conjuntos.activeType=active;
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
