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

V25 — PWA / IPAD
- Se agrego manifest.webmanifest para instalar Sprint Precios desde Safari en iPad.
- Se agregaron iconos 192, 512 y Apple Touch Icon con branding Sprint.
- Se agrego service-worker.js para cache offline una vez publicada por HTTPS y cargada al menos una vez.
- Se agregaron metadatos de iOS para abrir desde la pantalla de inicio como app independiente.
- No se modificaron formulas, precios, rangos, cotizadores ni PDF.
- IMPORTANTE: para instalarla correctamente como PWA en iPad debe servirse desde HTTPS; abrir index.html como archivo local no activa el service worker.
