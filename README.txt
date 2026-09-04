SPRINT — Sistema de Precios v6

CAMBIOS VISUALES
- Se mantiene intacta la lógica y los cálculos de la versión v5.
- Se incorporó el logo PNG proporcionado por Sprint en la barra lateral.
- Color principal: #0871b8.
- Interfaz adaptada al mockup aprobado.
- CSS preparado para usar Bernoru en títulos y Knockout Featherweight en texto si esas fuentes están instaladas en el equipo.
- No se incluyen archivos de fuentes.

USO
1. Descomprimir la carpeta.
2. Abrir index.html en Chrome.
3. Los datos siguen guardándose en localStorage como en v5.

V7: Se quitaron los iconos de las secciones principales. Se mantienen los iconos de Configuración y Backup / Restaurar. No se modificó la lógica.

V8: Precio Final ARS/CRC pasa a llamarse Precio Cliente ARS/CRC. Se destaca sutilmente la columna Precio Cliente ARS. Sin cambios de lógica.

V9: Corregidos los encabezados exactos de la tabla a PRECIO CLIENTE ARS y PRECIO CLIENTE CRC. Sin cambios en cálculos.

V10 — JERSEYS DINÁMICOS
- Se aplicó a Jerseys la misma experiencia visual/lógica dinámica de Gorras.
- Variables por defecto del Excel: utilidad 40%, envío US$10, impuestos US$2, comisión US$2, USD→ARS 1498, USD→CRC 445.
- Subsecciones: Exclusive, Pro Core y Epic.
- Cada subsección tiene Opciones avanzadas propias con sus montos por rango.
- Con los valores por defecto se reproducen los Gastos y Precios de Venta del Excel.
- Las conversiones ARS y CRC son independientes.
- No se modificó la lógica de Gorras.

V11 — CORRECCIONES JERSEYS
- Impuestos por defecto corregidos a US$3 según Excel.
- Exclusive: proveedor 15–30 = US$30.20; 30–49 = US$25.20; 50–99 = US$22.80.
- Pro Core: proveedor Unidad = US$36.60; 10–49 = US$31.62; 50 unidades = US$20.50.
- Corregido Pro Core 10–49: gasto Excel US$44.62 y venta Excel US$62.468.
- Costos base dinámicos recalculados con variables por defecto de US$15 totales (10 envío + 3 impuesto + 2 comisión).
- Incluye migración de los valores erróneos guardados por v10.

V12 — VERIFICACIÓN COMPLETA DEL EXCEL DE JERSEYS
Fórmula verificada:
Gasto = Precio Unitario + Envío US$10 + Impuestos US$3 + Comisión US$2.
Precio Venta = Gasto × (1 + Utilidad 40%).
Colones = Precio Venta × 445.
Pesos = Precio Venta × 1498.

Valores verificados:
Exclusive:
- 15–30: proveedor 26.20, gasto 41.20, venta 57.68
- 30–49: proveedor 25.20, gasto 40.20, venta 56.28
- 50–99: proveedor 23.80, gasto 38.80, venta 54.32
- 100–200: sin precio

Pro Core:
- Unidad: proveedor 36.50, gasto 51.50, venta 72.10
- 10–49: proveedor 29.62, gasto 44.62, venta 62.468
- 50 unidades: proveedor 20.50, gasto 35.50, venta 49.70

Epic:
- 30–49: proveedor 16.52, gasto 31.52, venta 44.128
- 50–99: proveedor 15.80, gasto 30.80, venta 43.12
- 100–200: proveedor 15.00, gasto 30.00, venta 42.00

V13 — CORRECCIÓN DE DATOS GUARDADOS
- Se detectó que localStorage podía conservar costos base erróneos de versiones previas.
- Al abrir V13 por primera vez, se restablece únicamente la estructura de costos/rangos de Jerseys a los valores verificados del Excel.
- Se conservan los gastos variables actuales del usuario.
- Se agregó botón "Restablecer valores del Excel" dentro de Jerseys.
- Exclusive 15–30 queda: base 26.20 + 10 + 3 + 2 = gasto 41.20; venta 57.68.

V14 — JERSEYS VERIFICADOS DESDE CELDAS Y FÓRMULAS DEL NUMBERS
Valores exactos:
Exclusive: 26.20 / 25.20 / 23.80
Pro Core: 36.50 / 21.62 / 20.53
Epic: 16.52 / 15.86 / 15.09

Fórmula exacta:
Gasto = Precio Unitario + Envío(10) + Impuestos(3) + Comisión(2)
Precio Venta = Gasto + Gasto*Utilidad(0.40)
CRC = Precio Venta * 445
ARS = Precio Venta * 1498

Opciones avanzadas ahora usa Precio Unitario Proveedor como fuente directa del cálculo,
igual que la hoja Numbers. Se elimina el campo interno duplicado de costo base.

V15 — COTIZADOR POR SUBCATEGORÍA
- Gorras: Personalizadas y Diseños Sprint tienen cotizador dentro de la pantalla activa.
- Jerseys: Exclusive, Pro Core y Epic tienen cotizador dentro de la pantalla activa.
- El usuario ingresa cantidad y el sistema selecciona automáticamente el rango correspondiente.
- Muestra Cantidad, Rango aplicado, Precio unitario ARS y Monto total ARS.
- El precio unitario usa el mismo precio dinámico ya calculado por la categoría.
- Cambios en utilidad, envío, impuestos, comisión o tipo de cambio recalculan también la cotización.
- Cantidades fuera de los rangos configurados muestran “Consultar”.

V16 — GENERAR COTIZACIÓN / PDF
- Botón Generar cotización en Gorras y Jerseys.
- Solicita Cliente y Fecha.
- Carga automáticamente producto/subcategoría, cantidad, rango, precio unitario y total.
- Calcula automáticamente seña 50% y saldo 50%.
- Vista previa profesional con logo Sprint y título COTIZACIÓN.
- Incluye condiciones de compra indicadas por el usuario y cierre ¡Gracias!
- Botón Imprimir / Guardar PDF usa el diálogo nativo de impresión de Chrome.
- No se modifican fórmulas de precios.

V17 — COLOR DE MARCA
- Se reemplazó el azul anterior por #0a1172 en toda la interfaz.
- Se actualizaron fondos, botones, títulos, tablas, resaltados, cotizador y documento de cotización.
- No se modificó ninguna fórmula ni funcionalidad.

V18 — NUEVO AZUL PRINCIPAL
- Color principal cambiado de #0a1172 a #073B5C.
- Aplicado a navegación, botones, títulos, tablas, cotizador y cotización imprimible.
- No se modificaron cálculos, datos ni funcionamiento.

V19 — MODIFICACIÓN EXCLUSIVA DEL PDF
- Se agregó el sello Cotización Oficial al pie de la cotización.
- Se agregó una marca de agua SPRINT grande y gris muy claro usando el logo real para conservar su tipografía.
- No se modificó ninguna otra parte de la app, ni cálculos, ni interfaz general, ni cotizadores.

V20 — SOLO PDF
- Se rehizo únicamente la plantilla de cotización imprimible para seguir la referencia aprobada.
- Encabezado blanco con logo Sprint azul, título Cotización y número visual.
- Bloque Cliente/Fecha.
- Bloque Detalle de la cotización con producto, subcategoría, cantidad, rango, tipos de cambio, utilidad y moneda.
- Tabla de concepto/cantidad/precio unitario/total.
- Caja de subtotal, seña, saldo y total.
- Información de compra, Gracias, marca de agua Sprint y sello oficial sin fondo.
- El sello fue procesado para tener transparencia real.
- No se modificó la lógica, cálculos, categorías, rangos, cotizador ni ninguna otra interfaz.

V21 — CORRECCIONES SOLO EN COTIZACIÓN/PDF
- Se quitaron tipo de cambio ARS/CRC y utilidad de la información visible al cliente.
- Se quitó el número de cotización.
- El detalle derecho ahora muestra únicamente precio unitario, total, seña y saldo.
- Se corrigió el botón Cerrar vista previa y se agregó Escape como salida adicional.
- Los botones de preview permanecen visibles en la parte inferior de la pantalla.
- Se unificó la geometría de preview e impresión: el PDF escala la misma hoja visual a A4.
- No se modificaron cálculos, precios, rangos, categorías ni otras pantallas.

V22 — SOLO COTIZACIÓN/PDF
- Se quitó "Rango aplicado" de la información visible al cliente en el PDF.
- La vista previa ahora usa dimensiones físicas A4 (210 × 297 mm).
- La impresión usa exactamente las mismas dimensiones, espaciados y posiciones.
- Se eliminó el escalado diferente que producía diferencias entre preview y PDF.
- No se modificaron cálculos, precios, rangos internos, categorías ni el resto de la app.

V23 — CORRECCIÓN PDF / PREVIEW
- Se mantiene una única composición A4 para vista previa e impresión.
- Se fuerzan en impresión las mismas dos columnas de Cliente/Fecha.
- Se mantienen las dos columnas del detalle de la cotización.
- Se conserva exactamente la estructura de tabla, totales, información, sello y marca de agua.
- Al imprimir solamente se ocultan los controles de la vista previa.
- No se modificaron cálculos, precios, categorías, rangos ni otras pantallas.

V24 — COTIZACIONES EN ARS O CRC
- En los cotizadores de Gorras y Jerseys se agregó selector de moneda.
- Opciones: Pesos argentinos (ARS) y Colones costarricenses (CRC).
- Precio unitario y total de la cotización cambian según la moneda seleccionada.
- Generar cotización conserva la moneda elegida.
- Vista previa e impresión/PDF muestran la misma moneda, símbolo y totales.
- La seña y el saldo se calculan en la moneda seleccionada.
- No se modificaron las fórmulas base, rangos ni los cálculos de precios existentes.

V26 — PRO CORE
- Primer rango: 1 - 9 unidades.
- El cotizador aplica ese precio automáticamente a cantidades de 1 a 9.
- Sin cambios de precios ni fórmulas.

V27 — MIGRACIÓN AUTOMÁTICA PRO CORE
- Cambia automáticamente el rango guardado "Unidad" a "1 - 9".
- Mantiene intactos precios, costos, tipos de cambio y demás configuraciones.
- El cotizador Pro Core usa el primer rango para cantidades de 1 a 9.
- Caché PWA incrementada a v27 para la versión de iPad.

V28 — CORRECCIÓN DEFINITIVA PRO CORE
- Se corrigió la migración para usar la propiedad real data.jerseys.lineas.
- Pro Core cambia automáticamente de "Unidad" a "1 - 9".
- El cotizador mantiene 1–9 para el primer rango.
- No se modifican precios, costos ni demás configuraciones.
- Caché PWA actualizada a v28.

V29 — VARIABLES TEMPORALES + SEÑA EDITABLE
- Los gastos variables (utilidad, envío, impuestos, comisión y tipos de cambio) ya no se guardan.
- Al salir de Gorras o Jerseys hacia otra pestaña, vuelven automáticamente a los valores por defecto.
- Los costos y opciones avanzadas continúan guardándose normalmente.
- En Generar Cotización la seña inicia en 50%.
- Se muestra porcentaje de seña, monto editable y saldo restante.
- Solo se edita el monto de seña; el porcentaje se calcula automáticamente.
- Vista previa y PDF usan el porcentaje/monto de seña elegido.
- El texto de condiciones también refleja el porcentaje real de seña.
- Caché PWA actualizada a v29.

V30 — PDF DE PRECIOS POR RANGO
- Botón "Imprimir rango de precio" debajo del cotizador.
- Disponible en todas las subcategorías actuales de Gorras y Jerseys.
- Usa la moneda seleccionada en el cotizador.
- Incluye todos los rangos y su precio unitario.
- Sin cliente, fecha, seña ni saldo.
- Incluye explicación de compra, sello, marca de agua y formato Sprint.
- No modifica cálculos ni precios.
- Caché PWA v30.

V31 — MONEDA AL IMPRIMIR RANGOS
- Al tocar "Imprimir rango de precio" se abre una selección de moneda.
- Opciones: Pesos argentinos (ARS) o Colones (CRC).
- El PDF de rangos se genera con la moneda elegida en ese momento.
- Ya no depende de la moneda seleccionada en el cotizador.
- No se modificaron precios ni fórmulas.
- Caché PWA actualizada a v31.

V32 — CALZAS
- Sección Calzas implementada con la misma estructura funcional de Jerseys.
- Subcategorías: Calza corta Pro Core y Calza corta Pro Core con pad elastic interface.
- Valores base tomados del archivo Precios_calzas_sprint.numbers:
  Pro Core: proveedor US$40,60; gasto US$55,60; venta US$77,84.
  Pro Core + Elastic Interface: proveedor US$50,60; gasto US$65,60; venta US$91,84.
  Utilidad 40%, envío US$10, impuestos US$3, comisión US$2, USD→CRC 445, USD→ARS 1.498.
- Gastos variables temporales, opciones avanzadas, cotizador ARS/CRC, seña editable,
  PDF de cotización y PDF de precios por rango con selector ARS/CRC.
- Caché PWA v32.

V33 — CONJUNTOS
- Sección Conjuntos implementada con la misma lógica funcional de Jerseys y Calzas.
- Subcategorías del archivo: Conjunto Pro Core y Conjunto Pro Core con pad elastic interface.
- Valores del archivo: proveedor US$77,10 / US$87,10; gasto US$92,10 / US$102,10; venta US$128,94 / US$142,94.
- Utilidad 40%, envío US$10, impuestos US$3, comisión US$2, USD→CRC 445, USD→ARS 1.498.
- Incluye gastos variables temporales, opciones avanzadas, cotizador ARS/CRC, seña editable,
  PDF de cotización y PDF de precios con selector ARS/CRC.
- Caché PWA v33.

V34 — ACTUALIZACIÓN CONJUNTOS
Fuente: Precios_conjuntos_sprint(1).numbers

Valores exactos:
- Utilidad: 40%
- Envío: US$20
- Impuestos: US$6
- Comisión por pago: US$4
- USD→CRC: 445
- USD→ARS: 1498

Conjunto Pro Core:
- Precio unitario: US$77,10
- Gasto: US$107,10
- Precio Venta: US$149,94

Conjunto Pro Core con pad elastic interface:
- Precio unitario: US$87,10
- Gasto: US$117,10
- Precio Venta: US$163,94

Se mantiene toda la funcionalidad existente de Conjuntos.
Caché PWA actualizada a v34.

V35 — PRECIOS FINALES REDONDEADOS DE GORRAS
- La columna Precio Cliente ARS de Gorras usa ahora los valores de "Precio final"
  del archivo Precios gorras Sprint(3).numbers.
- Personalizadas:
  Unidad $39.000
  2-3 $35.000
  4-9 $27.000
  10-30 $25.000
  30-100 $20.000
- La cotización ARS y los PDFs de Gorras toman esos mismos precios finales.
- Se conserva el resto de la lógica y las demás secciones sin cambios.
- Caché PWA actualizada a v35.

V36 — ACTUALIZACIÓN JERSEYS / CALZAS / CONJUNTOS
Fuentes:
- Precios_Jersey_Sprint(4).numbers
- Precios_calzas_sprint(2).numbers
- Precios_conjuntos_sprint(3).numbers

Jerseys:
- Utilidad 40%, envío base US$6, impuesto 21%, comisión 5%, declarado US$5.
- Exclusive: precios proveedor 26.20 / 25.20 / 23.80.
- Pro Core: nuevos rangos Unidad, 2-5, 6-9, 10-49 y 50 unidades.
- Envíos Pro Core según Excel: US$39 / 15 / 10 / 6 / 6.
- Epic actualizado con la nueva fórmula porcentual.

Calzas:
- Utilidad 35%, envío US$39, impuesto 21%, comisión 5%, declarado US$5.
- Pro Core: gasto 92.82, venta 125.307.
- Elastic Interface: gasto 103.32, venta 139.482.

Conjuntos:
- Utilidad 35%, envío US$39, impuesto 21%, comisión 5%, declarado US$10.
- Pro Core: gasto 132.195, venta 178.46325.
- Elastic Interface: gasto 142.695, venta 192.63825.

Los 15 casos con precio fueron verificados matemáticamente contra los valores calculados de los archivos.
Caché PWA actualizada a v36.

V37 — CORRECCIÓN PRECIOS DINÁMICOS DE GORRAS
- Los precios finales redondeados del Excel siguen siendo los valores ARS por defecto.
- Si cambia utilidad, envío, impuestos, comisión o USD→ARS, el precio cliente ARS se recalcula dinámicamente.
- Los precios ARS dinámicos se redondean al peso entero.
- CRC mantiene su cálculo dinámico.
- No se modificaron Jerseys, Calzas ni Conjuntos.
- Caché PWA actualizada a v37.

V38 — REPARACIÓN GORRAS
- Se restauró el motor correcto de Gorras.
- Unidad, 2-3 y 4-9 vuelven a usar Producción Sprint + costo de diseño del rango.
- 10-30 y 30-100 vuelven a usar Producción China + gastos variables.
- Con valores por defecto se muestran los precios finales redondeados del Excel.
- Si cambia utilidad, envío, impuestos, comisión o USD→ARS, el precio ARS se recalcula dinámicamente.
- CRC continúa recalculándose dinámicamente.
- Jerseys, Calzas y Conjuntos no se modificaron.
- Caché PWA actualizada a v38.
