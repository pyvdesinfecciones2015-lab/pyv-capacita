/* PyV Capacita — contenidos de las capacitaciones de la empresa (IRL, IPER, PRRD, EPP, accidentes, PTS)
   y talleres asincrónicos del curso obligatorio.
   Fuentes: Matriz IPER 2026, PRRD 2026 v02, PTS de PyV, Procedimiento de accidentes y manual del facilitador
   del curso tipo (Res. Ex. 1117/2026), cuyas actividades presenciales se adaptaron a modalidad asincrónica. */
CONTENIDO.lecciones = {};
CONTENIDO.talleres = {};
CONTENIDO.quiz = {};
CONTENIDO.firmas = {};

function _riesgosCargo(cargo) { return (((window.PYV_IPER || {})[cargo]) || { riesgos: [] }).riesgos; }
function _nombreCargo(cargo) { var c = PLAN.cargo(cargo); return c ? c.nombre : cargo; }

/* =====================================================================
   TALLERES ASINCRÓNICOS DEL CURSO OBLIGATORIO
   (adaptan las actividades de las jornadas presenciales del manual del facilitador)
   ===================================================================== */
CONTENIDO.talleres['ds44.t1'] = {
  intro: 'Este taller reemplaza la actividad grupal "Seguro de la Ley 16.744 y procedimiento de denuncia". Lee el caso, responde con tus palabras y compara con la respuesta esperada.',
  partes: [
    { tipo: 'lectura', titulo: 'El caso de Juan', texto: 'Juan es operario de una empresa de servicios acuícolas. Un martes, cambiando flotadores en un módulo, se golpea fuerte la rodilla contra un pasillo. Le duele, pero no dice nada para no "complicar" a la cuadrilla y termina el turno. Tres días después la rodilla está hinchada; va a un consultorio y paga la atención. Como nadie denunció el accidente, pierde el acceso a las coberturas del seguro.\n\nEste es un caso simulado, pero situaciones así pasan en todas las empresas.' },
    { tipo: 'abierta', p: '¿Qué errores cometió Juan, y qué errores hubo a su alrededor?', min: 40,
      modelo: 'No avisó de inmediato a su supervisor. No fue atendido en el organismo administrador (en PyV, la ACHS). Nadie hizo la DIAT dentro de 24 horas. Sus compañeros tampoco avisaron. Pagó una atención que debía ser gratuita.' },
    { tipo: 'abierta', p: 'Si esto te pasa en PyV, ¿qué debes hacer paso a paso?', min: 40,
      modelo: 'Avisar de inmediato al Supervisor o al Patrón, aunque parezca leve. Recibir primeros auxilios y trasladarse al centro de la ACHS más cercano (urgencias ACHS 1404). La jefatura envía la DIAT dentro de 24 horas. Si la empresa no la hace, la puedes hacer tú, un familiar o un compañero.' },
    { tipo: 'escenario', casos: [{ titulo: 'El seguro de la Ley 16.744', pasos: [
      { p: '¿Cuál es el organismo administrador del seguro en PyV?', o: [
        { t: 'ACHS (Asociación Chilena de Seguridad).', ok: true, fb: 'Correcto. Entrega atención médica gratuita, subsidios, rehabilitación y prevención.' },
        { t: 'FONASA.', fb: 'FONASA es la salud común. Los accidentes del trabajo los cubre la ACHS.' },
        { t: 'La isapre de cada trabajador.', fb: 'Las isapres no cubren accidentes del trabajo: los cubre la ACHS.' }] },
      { p: '¿Qué prestaciones tienes si te accidentas trabajando?', o: [
        { t: 'Atención médica gratuita, subsidio mientras estás con licencia y rehabilitación o reeducación si la necesitas.', ok: true, fb: 'Correcto. Y si queda una secuela, indemnización o pensión según el grado de invalidez.' },
        { t: 'Solo la atención de urgencia.', fb: 'El seguro cubre la atención completa hasta el alta, más subsidios y rehabilitación.' }] },
      { p: 'La ACHS dice que tu caso no es laboral y no estás de acuerdo. ¿Qué puedes hacer?', o: [
        { t: 'Reclamar ante la Superintendencia de Seguridad Social (SUSESO).', ok: true, fb: 'Correcto. Prevención de Riesgos te puede orientar con el trámite.' },
        { t: 'Nada, la decisión es definitiva.', fb: 'Tienes derecho a reclamar ante la SUSESO.' }] }
    ] }] },
    { tipo: 'abierta', p: 'Reflexión final: ¿qué derecho o deber no conocías antes de este módulo?', min: 20,
      modelo: 'No hay respuesta única. Lo importante es que sepas que puedes detener tu trabajo ante un riesgo grave e inminente, que la atención por accidente es gratuita y que tienes un Delegado de SST (Gustavo Barriga) que te representa.' }
  ]
};

CONTENIDO.talleres['ds44.t2'] = {
  intro: 'Este taller reemplaza "MIPER grupal" y "Mapa de riesgos en grupos". Vas a evaluar riesgos reales de tu cargo con la misma regla de la Matriz IPER de PyV y a armar un mapa de riesgos de la embarcación.',
  partes: [
    { tipo: 'lectura', titulo: 'Cómo evalúa PyV un riesgo', texto: 'Cada riesgo se evalúa multiplicando la Probabilidad (P) por la Severidad (S).\n\nProbabilidad: Baja = 1 (rara vez, mensual), Media = 2 (varias veces, semanal), Alta = 4 (siempre o casi siempre, diario).\nSeveridad: Ligeramente dañino = 1 (lesiones superficiales), Dañino = 2 (laceraciones, quemaduras, esguinces), Extremadamente dañino = 4 (lesiones graves, amputaciones, muerte).\n\nResultado: 1 o 2 Tolerable · 4 Moderado · 8 Importante · 16 Intolerable. Con Importante o Intolerable no se comienza ni continúa el trabajo hasta reducir el riesgo.' },
    { tipo: 'vep', desdeIper: true, n: 2 },
    { tipo: 'abierta', p: 'Elige uno de los riesgos que evaluaste. ¿Qué medidas de control propones, empezando por la más eficaz?', min: 40,
      modelo: 'Primero eliminar o sustituir (por ejemplo, hacer la tarea desde la embarcación en vez de entrar al agua). Luego ingeniería (barandas, superficies antideslizantes, anclajes). Después lo administrativo (PTS, AST, charla, supervisión, pausas). Al final el EPP (chaleco, casco con barbiquejo, guantes).' },
    { tipo: 'emparejar', titulo: 'Mapa de riesgos de la embarcación', pares: [
      { a: 'Borde de cubierta sin baranda', b: 'Caída al agua' },
      { a: 'Zona bajo el brazo hidráulico', b: 'Golpe o aplastamiento por carga suspendida' },
      { a: 'Sala de máquinas', b: 'Ruido, quemaduras e incendio' },
      { a: 'Cocina con cilindro de GLP', b: 'Fuga de gas e incendio' },
      { a: 'Pasillo mojado del módulo', b: 'Caída al mismo nivel' },
      { a: 'Winche con cabo en tensión', b: 'Golpe por efecto látigo' }
    ] }
  ]
};

CONTENIDO.talleres['ds44.t3'] = {
  intro: 'Este taller reemplaza "Personas especialmente sensibles y medidas de control". Analiza los casos y propone medidas.',
  partes: [
    { tipo: 'lectura', titulo: 'Personas especialmente sensibles', texto: 'Son trabajadores que, por su condición, pueden sufrir más daño frente al mismo riesgo: por ejemplo, alguien que vuelve de una lesión, una trabajadora embarazada o en lactancia, una persona con una enfermedad crónica o con discapacidad. La empresa debe evaluar su puesto y aplicar ajustes razonables. La Matriz IPER de PyV tiene una columna para estas personas y otra para consideraciones sexogenéricas, como tallas reales de EPP y pausas térmicas.' },
    { tipo: 'lectura', titulo: 'Caso: Pedro', texto: 'Pedro es operario y vuelve de una licencia por una lesión lumbar. El turno de esta semana incluye cambio de flotadores y traslado de postes de 4 metros.' },
    { tipo: 'abierta', p: '¿Qué riesgos aumentan para Pedro en esta faena?', min: 30,
      modelo: 'La manipulación manual de cargas (postes, flotadores, zunchos) y las posturas forzadas pueden agravar su lesión lumbar. También el frío y la fatiga, que reducen la capacidad de reacción.' },
    { tipo: 'clasificar', titulo: 'Clasifica las medidas para el caso de Pedro', categorias: [{ id: 'eliminacion', nombre: 'Eliminación o sustitución' }, { id: 'ingenieria', nombre: 'Ingeniería' }, { id: 'administrativo', nombre: 'Administrativa' }, { id: 'epp', nombre: 'EPP' }],
      items: [
        { t: 'Mover los postes con el brazo hidráulico en vez de cargarlos a mano', c: 'ingenieria', fb: 'Es un medio mecánico que reduce la carga física.' },
        { t: 'Asignarle por un tiempo tareas sin levantamiento de cargas', c: 'eliminacion', fb: 'Se elimina su exposición al riesgo mientras se recupera.' },
        { t: 'Rotación de tareas y pausas, con evaluación TMERT/MMC del puesto', c: 'administrativo', fb: 'Organizar el trabajo es un control administrativo.' },
        { t: 'Guantes con buen agarre para manipular flotadores', c: 'epp', fb: 'Ayuda, pero es la última barrera.' },
        { t: 'Que el médico de la ACHS indique sus restricciones antes de reintegrarse', c: 'administrativo', fb: 'La vigilancia de salud orienta el ajuste razonable.' }
      ] },
    { tipo: 'lectura', titulo: 'Caso: Carla', texto: 'Carla es asistente administrativa y está embarazada. Una vez al mes acompaña a la encargada de prevención a una inspección en terreno que incluye navegación y tránsito por módulos.' },
    { tipo: 'abierta', p: '¿Qué ajuste razonable propondrías para Carla?', min: 30,
      modelo: 'Evaluar su puesto con prevención y su médico; evitar la navegación con mal tiempo y el tránsito por módulos (riesgo de caída al agua y golpes), reemplazándolo por revisión de registros o fotos; pausas y facilidades; chaleco salvavidas adecuado a su talla si igual embarca.' }
  ]
};

CONTENIDO.talleres['ds44.t4'] = {
  intro: 'Este taller reemplaza "Detectives de señalética" y el uso práctico de extintores. Tus respuestas a la última pregunta le llegan a Prevención de Riesgos.',
  partes: [
    { tipo: 'checklist', titulo: '¿Qué debe estar señalizado en tu lugar de trabajo?', msgFalta: 'Esto sí debe estar señalizado.', cierre: 'La señalética se revisa en las inspecciones. Si falta algo, avísale a Prevención.',
      items: [
        { t: 'Ubicación de extintores', ok: true }, { t: 'Uso obligatorio de chaleco salvavidas en cubierta', ok: true },
        { t: 'Salidas y vías de evacuación', ok: true }, { t: 'Riesgo eléctrico en tableros', ok: true },
        { t: 'Prohibido fumar cerca del combustible y del GLP', ok: true }, { t: 'Botiquín de primeros auxilios', ok: true },
        { t: 'Nombre de cada trabajador en su casillero', ok: false, fb: 'No es señalética de seguridad.' },
        { t: 'Horario de comidas', ok: false, fb: 'Es información útil, pero no es señalización de seguridad.' }
      ] },
    { tipo: 'escenario', casos: [{ titulo: 'Simulación: amago de incendio', pasos: [
      { p: 'Ves humo saliendo de un motor eléctrico en la cubierta. ¿Qué haces primero?', o: [
        { t: 'Dar la alarma a viva voz y avisar al Patrón.', ok: true, fb: 'Correcto. Luego se corta la energía y se usa el extintor si el fuego es incipiente.' },
        { t: 'Ir a buscar agua.', fb: 'Con equipos eléctricos el agua es peligrosa. Primero alarma y corte de energía.' }] },
      { p: 'Tomas el extintor PQS. ¿Dónde te ubicas?', o: [
        { t: 'Con el viento a la espalda y una salida asegurada detrás de mí.', ok: true, fb: 'Correcto. Así el polvo no vuelve hacia ti y puedes retirarte.' },
        { t: 'Lo más cerca posible del fuego, aunque quede encerrado.', fb: 'Nunca te quedes sin salida.' }] },
      { p: '¿Hacia dónde apuntas la boquilla?', o: [
        { t: 'A la base de las llamas, barriendo de lado a lado.', ok: true, fb: 'Correcto.' },
        { t: 'A la punta de las llamas.', fb: 'El fuego se apaga atacando la base.' }] }
    ] }] },
    { tipo: 'abierta', p: 'Mira tu lugar de trabajo (embarcación, módulo u oficina). ¿Qué señal, extintor o recurso de emergencia falta o está en mal estado?', min: 15, alApr: true,
      modelo: 'Gracias. Tu respuesta queda registrada para Prevención de Riesgos. Recuerda que también puedes avisar directamente a tu supervisor o al Delegado de SST.' }
  ]
};

/* =====================================================================
   IRL · LOS RIESGOS DE TU CARGO
   ===================================================================== */
CONTENIDO.lecciones['irl.l1'] = function (cargo) {
  var R = _riesgosCargo(cargo), top = R.filter(function (r) { return r.nivel >= 2; }).slice(0, 6);
  if (top.length < 3) top = R.slice(0, 6);
  var d = [{ t: 'Tu derecho a saber', x: 'El D.S. 44 obliga a ' + CONTENIDO.empresa.nombre + ' a informarte, antes de empezar y cada vez que cambie tu trabajo, los riesgos de tu cargo, las medidas para controlarlos y la forma correcta de trabajar.\n\nEsta cápsula sale de la Matriz IPER 2026 de la empresa para el cargo de ' + _nombreCargo(cargo) + '.',
    l: [(((window.PYV_IPER || {})[cargo] || {}).procesos || []).length ? 'Procesos donde participas: ' + ((window.PYV_IPER || {})[cargo].procesos || []).join(', ') : 'Trabajas en la oficina de Las Rosas 121, Puerto Aysén.'] }];
  top.forEach(function (r) {
    d.push({ t: r.riesgo + ' · ' + r.nivelTxt, x: 'Peligro: ' + (r.peligros[0] || ''), l: ['Puede causar: ' + (r.consecuencias[0] || '')].concat(
      [].concat(r.ingenieria.slice(0, 1), r.administrativo.slice(0, 2)).filter(Boolean).map(function (c) { return 'Control: ' + c; }),
      r.eppItems.length ? ['EPP: ' + r.eppItems.slice(0, 5).join(', ')] : []) });
  });
  d.push({ t: 'Tu rol en una emergencia', l: CONTENIDO.rolEmergencia[cargo] || [] });
  d.push({ t: 'Tus derechos', l: ['Detener tu trabajo y alejarte ante un riesgo grave e inminente, avisando de inmediato.', 'Recibir tu EPP gratis y su reposición cuando se deteriora.', 'Ser capacitado en los riesgos y procedimientos de tu trabajo.', 'Atención médica gratuita en la ACHS si te accidentas o enfermas por el trabajo.', 'Acudir al Delegado de SST, Gustavo Barriga Zúñiga, con cualquier problema de seguridad.'] });
  var procs = CONTENIDO.procedimientosDe(cargo);
  d.push({ t: 'Tus procedimientos', x: 'Estos documentos explican cómo hacer tu trabajo de forma segura. Cada uno tiene su propia capacitación en la plataforma.', l: procs.map(function (p) { return p.id + ' · ' + p.titulo; }) });
  return { diapositivas: d };
};
CONTENIDO.juegos['irl.j1'] = { intro: 'Une cada riesgo de tu cargo con lo que puede causar, según la Matriz IPER de PyV.', partes: [{ tipo: 'emparejar', desdeIper: true }] };
CONTENIDO.firmas['irl.f1'] = function (cargo) {
  var R = _riesgosCargo(cargo);
  return { texto: 'Declaro que ' + CONTENIDO.empresa.nombre + ' me informó, mediante esta capacitación, los riesgos de mi cargo de ' + _nombreCargo(cargo) + ' identificados en la Matriz IPER vigente, las medidas preventivas para controlarlos, los métodos de trabajo correctos, mi rol en emergencias y los procedimientos que me aplican y los protocolos de vigilancia a los que estoy expuesto, conforme al artículo 15 del D.S. N° 44/2024. Tuve la posibilidad de consultar mis dudas a Prevención de Riesgos.',
    lista: R.map(function (r) { return [r.riesgo + ' (' + r.nivelTxt + ')', [].concat(r.administrativo.slice(0, 1), r.eppItems.slice(0, 3)).join('; ')]; }).concat(
      _protocolosCargo(cargo).map(function (p) { return ['Protocolo: ' + p.nombre, 'Por: ' + p.riesgos.slice(0, 3).join(', ')]; })) };
};

/* ---------- IRL ampliada (3 horas) ---------- */
function _lista(a, n) { return (a || []).filter(Boolean).slice(0, n || 4); }
/* Protocolos y normas de vigilancia según los riesgos del cargo (hoja "Protocolos aplicables" de la Matriz IPER) */
var _PROTOCOLOS = [
  { re: /ruido/i, id: 'PREXOR', nombre: 'Protocolo de Exposición Ocupacional a Ruido (PREXOR, MINSAL)', l: ['Se mide la dosis de ruido de tu puesto (motores, compresores, equipos).', 'Si supera el criterio de acción, ingresas a vigilancia médica con audiometrías en la ACHS.', 'Protección auditiva obligatoria donde esté indicado.'] },
  { re: /radiaci.*no ionizantes/i, id: 'RUV', nombre: 'Guía Técnica de Radiación Ultravioleta de origen solar (MINSAL)', l: ['En el mar la radiación UV llega directa y reflejada en el agua, aun nublado.', 'Protector solar, ropa manga larga, legionario o gorro y lentes con filtro UV.', 'Revisa el índice UV del día; en soldadura la radiación del arco se controla con careta y ropa ignífuga.'] },
  { re: /fr[ií]o/i, id: 'FRIO', nombre: 'Guía ISP para la evaluación y control del riesgo por exposición a frío a la intemperie (Res. Ex. N° 4.142/2026)', l: ['Aplica a trabajo al aire libre con 10 °C o menos, considerando viento y lluvia.', 'Pausas de recuperación, ropa en capas, cambio de ropa mojada y vigilancia de signos de hipotermia.'] },
  { re: /exposici[oó]n a calor/i, id: 'CALOR', nombre: 'D.S. 594 · exposición a calor', l: ['Trabajo en caliente, sala de máquinas o trajes impermeables pueden sobrecalentarte.', 'Hidratación, pausas y ventilación.'] },
  { re: /vibraciones/i, id: 'VIB', nombre: 'D.S. 594 · exposición a vibraciones', l: ['Herramientas como esmeriles y equipos de raspado transmiten vibración a manos y brazos.', 'Tiempos de uso, mantención de equipos y guantes adecuados.'] },
  { re: /repetitivo/i, id: 'TMERT', nombre: 'Protocolo de vigilancia de trastornos musculoesqueléticos de extremidades superiores (TMERT-EESS, MINSAL)', l: ['Identifica tareas con movimientos repetidos de manos, muñecas y brazos.', 'Si el riesgo no es aceptable se aplican medidas: pausas, rotación, cambios en la tarea.'] },
  { re: /manipulaci[oó]n manual/i, id: 'MMC', nombre: 'Ley 20.949 y Guía técnica de Manejo Manual de Carga (MMC)', l: ['Peso máximo de 25 kg por persona; 20 kg para mujeres y menores de edad.', 'Usa ayudas mecánicas y levanta entre dos cuando corresponda.', 'Técnica: carga pegada al cuerpo, espalda recta, sin girar el tronco.'] },
  { re: /postural|postura|fatiga visual/i, id: 'ERGO', nombre: 'Evaluación ergonómica de sobrecarga postural (Guía técnica MINSAL / D.S. 594)', l: ['Posturas forzadas o mantenidas: tronco inclinado, en cuclillas, de pie o sentado por largo tiempo.', 'Pausas activas, alternar posturas y ajustar el puesto de trabajo.'] },
  { re: /dimensi[oó]n|exigencias psicol|carga de trabajo/i, id: 'CEAL', nombre: 'Protocolo de vigilancia de riesgos psicosociales en el trabajo · cuestionario CEAL-SM (SUSESO)', l: ['La empresa aplica el cuestionario CEAL-SM; tu participación es voluntaria y anónima.', 'Con los resultados se definen medidas sobre carga de trabajo, liderazgo y desarrollo.'] },
  { re: /violencia|acoso/i, id: 'KARIN', nombre: 'Ley 21.643 (Ley Karin) · prevención del acoso laboral, sexual y la violencia en el trabajo', l: ['La empresa tiene un protocolo de prevención y un canal de denuncia.', 'Puedes denunciar a la empresa o a la Dirección del Trabajo; la investigación es reservada.'] },
  { re: /aerosol|gases|vapores|qu[ií]mic|c[aá]ustic/i, id: 'QUIM', nombre: 'D.S. 594 · agentes químicos (límites permisibles) y Hojas de Datos de Seguridad', l: ['Desinfectantes, combustibles y humos de soldadura tienen límites de exposición.', 'Revisión de la HDS, ventilación y protección respiratoria cuando corresponda.'] },
  { re: /transmisi[oó]n|fluidos|biol[oó]gic/i, id: 'BIO', nombre: 'D.S. 594 · agentes biológicos (criterio ISP)', l: ['Contacto con residuos orgánicos, mortalidad, biofouling o fluidos corporales.', 'Guantes, higiene de manos y vacunas cuando corresponda.'] },
  { re: /altas presiones/i, id: 'BUCEO', nombre: 'Normativa de buceo de la Autoridad Marítima y PTS-006', l: ['Trabajo hiperbárico: tablas de descompresión, equipos certificados y supervisión de buceo.', 'Exámenes de salud compatibles con el buceo según la normativa.'] }
];
function _protocolosCargo(cargo) {
  var R = _riesgosCargo(cargo), out = [];
  _PROTOCOLOS.forEach(function (p) {
    var rs = R.filter(function (r) { return p.re.test(r.riesgo); }).map(function (r) { return r.riesgo; });
    if (rs.length) out.push({ id: p.id, nombre: p.nombre, l: p.l, riesgos: rs });
  });
  return out;
}
CONTENIDO.protocolosCargo = _protocolosCargo;
CONTENIDO.lecciones['irl.l2'] = function (cargo) {
  var R = _riesgosCargo(cargo).slice().sort(function (a, b) { return b.nivel - a.nivel; });
  var d = [{ t: 'Tus riesgos, uno por uno', x: 'La Matriz IPER 2026 identifica ' + R.length + ' riesgos para el cargo de ' + _nombreCargo(cargo) + '. En cada tarjeta verás:',
    l: ['Dónde aparece (tarea y peligro).', 'Qué te puede pasar.', 'Cómo se evalúa (Probabilidad × Severidad).', 'Qué controles existen y qué EPP usas.', 'Qué procedimiento lo regula.'],
    tip: 'Lee cada tarjeta con calma y piensa en un momento real de tu trabajo en que te pasa. Puedes usar el botón Escuchar.' }];
  R.forEach(function (r, i) {
    var ctrl = [].concat(
      _lista(r.eliminacion, 1).map(function (c) { return 'Eliminar: ' + c; }),
      _lista(r.ingenieria, 2).map(function (c) { return 'Ingeniería: ' + c; }),
      _lista(r.senalizacion, 1).map(function (c) { return 'Señalización: ' + c; }),
      _lista(r.administrativo, 3).map(function (c) { return 'Administrativo: ' + c; }));
    d.push({ t: (i + 1) + '. ' + r.riesgo + ' · ' + r.nivelTxt + (r.tipo ? ' (' + r.tipo + ')' : ''),
      x: 'Dónde aparece: ' + _lista(r.tareas, 2).join(' / ') + '.\nPeligro: ' + _lista(r.peligros, 2).join(' / ') + '.\nPuede causar: ' + _lista(r.consecuencias, 2).join(' / ') + '.',
      l: ['Evaluación: P ' + (r.p || '?') + ' × S ' + (r.s || '?') + ' = ' + ((r.p && r.s) ? r.p * r.s : '?') + ' → ' + r.nivelTxt].concat(ctrl,
        r.eppItems && r.eppItems.length ? ['EPP: ' + r.eppItems.slice(0, 6).join(', ')] : [],
        r.pts && r.pts.length ? ['Procedimiento: ' + _lista(r.pts, 2).join(', ')] : []) });
  });
  var P = _protocolosCargo(cargo);
  if (P.length) {
    d.push({ t: 'Protocolos y normas a los que estás expuesto', x: 'Según tus funciones, la Matriz IPER asocia tu cargo a estos protocolos de vigilancia y normas. Algunos implican mediciones en tu puesto o evaluaciones de salud en la ACHS.', l: P.map(function (p) { return p.nombre; }) });
    P.forEach(function (p) { d.push({ t: p.nombre, x: 'Riesgos de tu cargo que lo activan: ' + p.riesgos.join(', ') + '.', l: p.l }); });
  }
  d.push({ t: 'Lo importante', l: ['Los riesgos con nivel Importante o Intolerable no se aceptan: si sus controles no están, el trabajo no empieza.', 'Si ves un riesgo que no aparece aquí, avísalo: la Matriz se actualiza con lo que informan los trabajadores.', 'Tienes derecho a detener tu trabajo ante un riesgo grave e inminente.'] });
  return { diapositivas: d };
};
CONTENIDO.talleres['irl.t1'] = {
  intro: 'Este taller te ayuda a mirar tu propio puesto con la Matriz IPER en la mano. No hay respuestas únicas: lo que escribas queda registrado para Prevención de Riesgos y sirve para mejorar la Matriz.',
  partes: [
    { tipo: 'vep', desdeIper: true, n: 4 },
    { tipo: 'abierta', p: 'Elige la tarea de tu trabajo donde te sientes más expuesto. ¿Qué tarea es, qué te podría pasar y qué control usas hoy para evitarlo?', min: 60, alApr: true,
      modelo: 'Una buena respuesta nombra la tarea concreta (por ejemplo, pasar cabos desde el pasillo del módulo), el riesgo (caída al agua, atrapamiento de manos) y el control real que se aplica (chaleco puesto y abrochado, línea de vida, guantes, coordinación con el Patrón).' },
    { tipo: 'abierta', p: '¿Has visto un incidente o un "casi accidente" en tu trabajo? Cuéntalo sin nombres: qué pasó, por qué crees que pasó y qué habría que cambiar.', min: 40, alApr: true,
      modelo: 'Los casi accidentes son avisos gratuitos. Informarlos permite corregir antes de que alguien se lesione. Recuerda que también puedes informarlo a tu supervisor o al Delegado de SST.' },
    { tipo: 'abierta', p: '¿Qué riesgo de tu trabajo crees que falta en la Matriz IPER, o cuál crees que está mal evaluado?', min: 20, alApr: true,
      modelo: 'Gracias. Prevención de Riesgos revisa estas respuestas al actualizar la Matriz IPER.' }
  ]
};
CONTENIDO.lecciones['irl.l3'] = function (cargo) {
  var d = [
    { t: 'La jerarquía de controles', x: 'No todos los controles protegen igual. La Matriz IPER de PyV ordena las medidas de la más a la menos eficaz:', l: ['1. Eliminar el peligro.', '2. Sustituirlo por algo menos peligroso.', '3. Controles de ingeniería: barandas, protecciones, líneas de vida, resguardos.', '4. Señalización y advertencias.', '5. Controles administrativos: procedimientos, permisos de trabajo, AST, capacitación, pausas.', '6. EPP: la última barrera, cuando lo anterior no basta.'], tip: 'El EPP no reemplaza a los otros controles: los complementa.' },
    { t: 'Método de trabajo correcto', l: ['Antes de empezar: AST y permiso de trabajo cuando corresponde; revisar clima, equipos y EPP.', 'Durante: seguir los pasos del procedimiento; comunicación clara con el Patrón o Supervisor.', 'Al terminar: dejar orden y aseo, guardar equipos e informar fallas o incidentes.', 'Si algo cambia (clima, equipo, personal): se detiene y se vuelve a evaluar.'] },
    { t: 'Cuándo detener el trabajo', l: ['Viento, marejada o visibilidad fuera de lo permitido.', 'Falta un control crítico: chaleco, línea de vida, permiso, vigía, extintor.', 'Un equipo falla o no está certificado.', 'Alguien no está en condiciones físicas.', 'Cualquier riesgo grave e inminente: te alejas y avisas de inmediato.'] }];
  CONTENIDO.procedimientosDe(cargo).forEach(function (p) {
    var x = _PTS[p.id];
    if (!x) { d.push({ t: p.id + ' · ' + p.titulo, x: 'Procedimiento que aplica a tu cargo. Tiene su propia capacitación en la plataforma.' }); return; }
    var rol = (x.roles && x.roles[cargo]) || [];
    var claves = [].concat.apply([], (x.pasos || []).map(function (s) { return (s.l || []).slice(0, 2); })).slice(0, 5);
    d.push({ t: p.id + ' · ' + p.titulo, x: x.objetivo, l: [].concat(rol.length ? ['Tu responsabilidad: ' + rol.slice(0, 2).join(' ')] : [], claves.map(function (c) { return 'Paso clave: ' + c; }), (x.detener || []).slice(0, 2).map(function (c) { return 'Detener si: ' + c; })) });
  });
  d.push({ t: 'Tu parte', l: ['Conocer y aplicar los procedimientos de tu cargo.', 'Usar los controles que existen y no retirarlos.', 'Informar cuando un control no está o no sirve.', 'Cada procedimiento tiene su capacitación con certificado en "Procedimientos de tu cargo".'] });
  return { diapositivas: d };
};
CONTENIDO.juegos['irl.j2'] = CONTENIDO.juegos['ds44.j4'];
CONTENIDO.lecciones['irl.lw'] = function (cargo) {
  var cg = PLAN.cargo(cargo) || {}, I = (window.PYV_IPER || {})[cargo] || { riesgos: [], procesos: [] }, emp = CONTENIDO.empresa;
  var tareas = [];
  I.riesgos.forEach(function (r) { (r.tareas || []).forEach(function (t) { if (tareas.indexOf(t) < 0) tareas.push(t); }); });
  var faena = cg.area !== 'oficina';
  var d = [{ t: 'Dónde trabajas', x: faena ? 'Tu trabajo en ' + emp.nombre + ' se desarrolla principalmente en embarcaciones de apoyo y en los módulos, jaulas y pontones de los centros de cultivo de las empresas mandantes, en mar abierto o canales de la región de Aysén.' : 'Tu trabajo se desarrolla principalmente en la oficina de ' + emp.nombre + ', en Las Rosas 121, Puerto Aysén.',
    l: faena ? ['Embarcaciones de la empresa: ' + emp.embarcaciones.join(', ') + '.', 'Superficies mojadas, inestables y en movimiento por el oleaje.', 'Clima cambiante: viento, lluvia, frío y radiación UV incluso nublado.', 'Lugares aislados: la ayuda médica puede estar a horas de distancia.'] : ['Puestos con computador, escritorio y silla.', 'Bodega, archivo y espacios comunes.', 'Salidas de emergencia, extintores y punto de encuentro de la oficina.'] }];
  if ((I.procesos || []).length) d.push({ t: 'Los procesos donde participas', l: I.procesos });
  if (tareas.length) d.push({ t: 'Tus tareas según la Matriz IPER', x: 'Estas son las tareas registradas para el cargo de ' + _nombreCargo(cargo) + ':', l: tareas.slice(0, 12) });
  if (tareas.length > 12) d.push({ t: 'Más tareas de tu cargo', l: tareas.slice(12, 24) });
  d.push(faena ? { t: 'Ambiente de trabajo a bordo y en el centro', l: ['Cubiertas y pasillos de módulos resbaladizos: calzado antideslizante y manos libres al desplazarte.', 'Bordes sin baranda: chaleco salvavidas puesto y abrochado siempre.', 'Ruido de motores, compresores y equipos: protección auditiva donde esté indicado.', 'Frío y humedad: ropa adecuada y pausas para recuperar temperatura.', 'Espacios reducidos bajo flotadores y en sala de máquinas: ventilación y comunicación permanente.'] }
    : { t: 'Ambiente de trabajo en la oficina', l: ['Iluminación, temperatura y ventilación adecuadas.', 'Puesto ergonómico: pantalla a la altura de los ojos, pies apoyados, pausas activas.', 'Cables ordenados y enchufes sin sobrecarga.', 'Pasillos y salidas libres de cajas y archivos.'] });
  d.push(faena ? { t: 'Máquinas, equipos y herramientas', l: ['Motores, winches y pluma o grúa de la embarcación: solo los opera personal autorizado.', 'Cabos, grilletes, zunchos y flotadores: revisar su estado antes de usarlos; nunca pisar ni meter manos en el seno de un cabo en tensión.', 'Compresor e hidrolavadora: revisión previa, mangueras sin daños y operación según el procedimiento.', 'Equipos de corte y soldadura: con permiso de trabajo en caliente, extintor y vigía.', 'Herramientas manuales: en buen estado, amarradas cuando trabajas sobre el agua.', 'Todo equipo con falla se informa y se saca de uso.'] }
    : { t: 'Equipos y herramientas de oficina', l: ['Computadores, impresoras y equipos eléctricos en buen estado.', 'Cortacartón y tijeras: guardar con la hoja protegida.', 'Escaleras o pisos para alcanzar en altura: nunca usar sillas.', 'Hervidor y microondas: no dejarlos funcionando sin supervisión.'] });
  d.push({ t: 'Orden y aseo', x: 'El orden y el aseo son una medida de control en sí mismos: evitan caídas, golpes, incendios y pérdida de herramientas.', l: faena ? ['Cubierta despejada: cabos adujados, materiales estibados y amarrados.', 'Residuos en sus contenedores; no se tiran al mar.', 'Herramientas de vuelta en su lugar al terminar.', 'Derrames de combustible o aceite se limpian de inmediato.', 'Vías de escape y equipos de emergencia siempre accesibles.'] : ['Escritorio y pasillos despejados.', 'Archivos en estanterías firmes, lo pesado abajo.', 'Productos de aseo rotulados y guardados.', 'Salidas y extintores siempre libres.'] });
  d.push({ t: 'Servicios para ti', l: faena ? ['Agua potable y alimentación según la faena.', 'Servicios higiénicos y lugar para cambiarte en la embarcación o en el centro, según la mandante.', 'Botiquín y equipos de rescate a bordo.'] : ['Servicios higiénicos y comedor de la oficina.', 'Botiquín de primeros auxilios.', 'Agua potable.'] });
  return { diapositivas: d };
};
CONTENIDO.lecciones['irl.ls'] = function (cargo) {
  var R = _riesgosCargo(cargo).filter(function (r) { return /qu[ií]mic|gases|vapores|c[aá]ustic|aerosol/i.test(r.riesgo); });
  var d = [{ t: 'Productos peligrosos en PyV', x: 'En el trabajo se usan productos que pueden dañar tu salud si no se manejan bien.', l: ['Desinfectantes para limpieza y desinfección de estructuras (se preparan en dilución).', 'Combustibles: petróleo de las embarcaciones y bencina de compresores y equipos.', 'Gas licuado (GLP) para cocina a bordo.', 'Gases y humos de corte y soldadura.', 'Aceites, lubricantes y productos de aseo.'] },
    { t: 'La Hoja de Datos de Seguridad (HDS)', x: 'Cada producto químico tiene su HDS. Es obligatoria y debe estar disponible donde se usa el producto.', l: ['Dice qué peligros tiene el producto.', 'Qué EPP usar al manipularlo.', 'Cómo almacenarlo y qué no mezclar.', 'Qué hacer si te salpica, lo inhalas o lo tragas (primeros auxilios).', 'Qué hacer ante un derrame o incendio.'], tip: 'Tienes derecho a ver la HDS de cualquier producto que uses. Pídela a tu supervisor o a Prevención de Riesgos.' },
    { t: 'La etiqueta y los pictogramas (SGA)', x: 'Los envases llevan pictogramas con borde rojo en forma de rombo según el Sistema Globalmente Armonizado:', l: ['Llama: inflamable.', 'Corrosión (líquido sobre mano y metal): corrosivo, quema piel y ojos.', 'Calavera: tóxico agudo, puede matar en pequeñas cantidades.', 'Signo de exclamación: irritante o nocivo.', 'Silueta con estrella en el pecho: peligro grave para la salud a largo plazo.', 'Cilindro de gas: gas a presión.', 'Llama sobre círculo: comburente, aviva el fuego.', 'Pez y árbol: peligroso para el medio ambiente acuático.'] },
    { t: 'Reglas de oro', l: ['Usa solo productos rotulados; nunca en botellas de bebida.', 'Prepara las diluciones según la ficha técnica y la HDS, con EPP químico.', 'Nunca mezcles productos ni residuos.', 'Aplica a favor del viento y con distancia de los compañeros.', 'Guarda los productos cerrados, lejos de fuentes de calor y del GLP.', 'Lava tus implementos y tus manos al terminar.', 'Si te salpica: lava con abundante agua por 15 minutos y avisa de inmediato.'] }];
  R.forEach(function (r) { d.push({ t: 'En tu cargo: ' + r.riesgo, x: 'Peligro: ' + _lista(r.peligros, 2).join(' / ') + '.', l: [].concat(_lista(r.administrativo, 2).map(function (c) { return 'Control: ' + c; }), r.eppItems && r.eppItems.length ? ['EPP: ' + r.eppItems.slice(0, 6).join(', ')] : []) }); });
  if (!R.length) d.push({ t: 'En tu cargo', x: 'La Matriz IPER no registra exposición directa a sustancias peligrosas en tu cargo. Igual aplica lo anterior para productos de aseo y combustibles.' });
  return { diapositivas: d };
};
CONTENIDO.lecciones['irl.lf'] = function (cargo) {
  var r = _riesgosCargo(cargo).filter(function (x) { return /fr[ií]o/i.test(x.riesgo); })[0];
  var d = [{ t: 'Exposición a frío a la intemperie', x: 'El Instituto de Salud Pública actualizó en 2026 la Guía para la evaluación y control del riesgo por exposición a frío a la intemperie (Res. Ex. N° 4.142, 17-08-2026). Aplica a trabajos al aire libre con temperaturas iguales o inferiores a 10 °C, considerando además el viento y la lluvia.',
    l: ['En Aysén esta condición se da gran parte del año, en navegación, en cubierta y en los módulos.', 'El viento y la ropa mojada hacen que el cuerpo pierda calor mucho más rápido: la sensación térmica puede ser varios grados menor que la temperatura del termómetro.', 'El agua fría enfría el cuerpo mucho más rápido que el aire.'] }];
  if (r) d.push({ t: 'En tu cargo', x: 'La Matriz IPER evalúa la exposición a frío como ' + r.nivelTxt + ' para ' + _nombreCargo(cargo) + '.', l: ['Tareas: ' + _lista(r.tareas, 3).join(' / ') + '.'].concat(_lista(r.administrativo, 3).map(function (c) { return 'Control: ' + c; }), r.eppItems && r.eppItems.length ? ['EPP: ' + r.eppItems.slice(0, 8).join(', ')] : []) });
  else d.push({ t: 'En tu cargo', x: 'Tu trabajo es principalmente bajo techo. Igual te aplica cuando sales a terreno, visitas centros o navegas: usa la ropa de abrigo e impermeable que entrega la empresa.' });
  d.push({ t: 'Qué le hace el frío al cuerpo', l: ['Hipotermia: la temperatura del cuerpo baja. Empieza con tiritones fuertes, torpeza y cansancio; sigue con confusión, habla arrastrada y somnolencia. Es una emergencia.', 'Sabañones: enrojecimiento, picazón e inflamación de dedos, orejas y mejillas.', 'Pie de trinchera: pies mojados y fríos por horas; hormigueo, calambres, ampollas.', 'Congelamiento: con temperaturas bajo cero, la piel se pone blanca o gris, dura e insensible.', 'El frío también quita destreza: más riesgo de caídas, cortes y de soltar herramientas o cabos.'] },
    { t: 'Cómo te proteges', l: ['Ropa en tres capas: interior que saque la humedad (no algodón), intermedia que abrigue y exterior impermeable y cortaviento.', 'Cabeza, manos y pies protegidos: gorro, guantes y calzado impermeable.', 'Ropa mojada se cambia de inmediato: lleva ropa seca de recambio.', 'Pausas de recuperación en un lugar temperado (cabina o caseta) cuando el frío, el viento o la lluvia aprietan.', 'Bebidas calientes y alimentación suficiente; nada de alcohol.', 'Planificar la tarea según el pronóstico: viento, lluvia y temperatura se revisan antes de zarpar.', 'Vigilancia entre compañeros: si ves a alguien tiritando fuerte, torpe o confundido, se detiene y se le abriga.'] },
    { t: 'Si alguien presenta hipotermia', l: ['Avisa de inmediato al Supervisor o al Patrón.', 'Llévalo a un lugar abrigado y protegido del viento.', 'Quítale la ropa mojada y abrígalo con ropa seca y mantas, empezando por el tronco.', 'Si está consciente, dale bebidas tibias y dulces; nunca alcohol.', 'No le frotes la piel ni lo acerques directo a una fuente de calor.', 'Traslado a la ACHS (1404); en zona aislada se pide apoyo a la Autoridad Marítima (137).'] },
    { t: 'Tus derechos ante el frío', l: ['Recibir ropa de trabajo y EPP adecuados al frío, sin costo.', 'Pausas de recuperación cuando las condiciones lo exigen.', 'Detener la tarea si el frío, el viento o la lluvia la hacen insegura, avisando al Supervisor.', 'Informar si tu ropa o EPP de abrigo está dañado para que se reponga.'] });
  return { diapositivas: d };
};
CONTENIDO.juegos['irl.js'] = { intro: 'Une cada pictograma de peligro con lo que significa.', partes: [{ tipo: 'emparejar', pares: [
  { a: 'Llama', b: 'Inflamable: se enciende con facilidad' },
  { a: 'Líquido que corroe una mano y un metal', b: 'Corrosivo: quema piel y ojos' },
  { a: 'Calavera con tibias', b: 'Toxicidad aguda: puede matar en pequeñas cantidades' },
  { a: 'Signo de exclamación', b: 'Irritante o nocivo' },
  { a: 'Silueta humana con estrella en el pecho', b: 'Daño grave a la salud a largo plazo' },
  { a: 'Cilindro de gas', b: 'Gas a presión: puede explotar si se calienta' },
  { a: 'Pez y árbol muerto', b: 'Peligroso para el medio ambiente acuático' }] }] };

CONTENIDO.lecciones['irl.l4'] = function (cargo) {
  if (PLAN.area(cargo) === 'oficina') return { diapositivas: [
    { t: 'Emergencias en la oficina de Las Rosas 121', x: 'El PRRD 2026 identifica estas amenazas para la oficina:', l: (cargo !== 'auxiliar_aseo' ? ['Caída al agua desde el muelle o desde una embarcación atracada, en las visitas al muelle: grito de alarma, lanzar un aro y llamar al 137.'] : []).concat(['Sismo.', 'Incendio.', 'Emergencia médica o accidente.', 'Corte de energía eléctrica o de agua.', 'Asalto o robo.', 'Erupción volcánica o caída de ceniza.', 'Temporal con corte de servicios.', 'Tsunami o inundación por crecida del río Aysén, según lo indique la autoridad.']) },
    { t: 'Quién dirige y cómo se avisa', l: ['Dirige el encargado/a de oficina: da la alarma, ordena la evacuación y hace el recuento.', 'Quien detecta la emergencia avisa a viva voz y, si es necesario, llama directamente a Bomberos, SAMU o Carabineros.', 'Todo aviso dice: qué pasó, dónde (Las Rosas 121, Puerto Aysén), cuántas personas y si hay lesionados.', 'Solo alertas oficiales: SENAPRED, SHOA y SERNAGEOMIN.'] },
    { t: 'Qué hacer en cada caso', l: ['Sismo: agacharse, cubrirse y afirmarse lejos de ventanas, estanterías y del aire acondicionado; luego evacuar a la zona segura exterior.', 'Incendio: alarma a viva voz y Bomberos (132); extintor solo si el fuego es incipiente y hay salida asegurada.', 'Emergencia médica: primeros auxilios con el botiquín y llamar a la ACHS (1404) o al SAMU (131).', 'Asalto: no oponer resistencia; luego Carabineros (133) sin alterar el lugar.', 'Ceniza: permanecer adentro con puertas y ventanas cerradas.', 'Tsunami o inundación: si la autoridad ordena evacuar, ir a la zona segura que indique.'] },
    { t: 'Tu rol como ' + _nombreCargo(cargo), l: CONTENIDO.rolEmergencia[cargo] || [] },
    { t: 'Números que debes conocer', l: ['ACHS urgencias: 1404.', 'SAMU: 131 · Bomberos: 132 · Carabineros: 133.', 'Prevención de Riesgos PyV: ' + (window.CONFIG && CONFIG.SOPORTE || '') + '.'] }] };
  var base = (CONTENIDO.lecciones['prrd.l1'] && CONTENIDO.lecciones['prrd.l1'].diapositivas) || [];
  return { diapositivas: base.concat([{ t: 'Tu rol como ' + _nombreCargo(cargo), l: CONTENIDO.rolEmergencia[cargo] || [] },
    { t: 'Números que debes conocer', l: ['ACHS urgencias: 1404.', 'Autoridad Marítima: 137.', 'SAMU: 131 · Bomberos: 132 · Carabineros: 133.', 'Prevención de Riesgos PyV: ' + (window.CONFIG && CONFIG.SOPORTE || '') + '.'] }]) };
};
CONTENIDO.juegos['irl.j3'] = CONTENIDO.juegos['ds44.j5'];
CONTENIDO.lecciones['irl.l5'] = function () {
  var a = (CONTENIDO.lecciones['epp.l1'] && CONTENIDO.lecciones['epp.l1'].diapositivas) || [];
  var b = (CONTENIDO.lecciones['acc.l1'] && CONTENIDO.lecciones['acc.l1'].diapositivas) || [];
  return { diapositivas: a.concat(b) };
};
CONTENIDO.juegos['irl.j4'] = CONTENIDO.juegos['ds44.j1'];
CONTENIDO.talleres['irl.t2'] = {
  intro: 'Para cerrar, escribe tu compromiso. Queda registrado junto a tu firma de recepción de la IRL.',
  partes: [
    { tipo: 'abierta', p: 'Nombra los 3 riesgos de tu cargo que consideras más importantes y, para cada uno, la medida que vas a aplicar siempre.', min: 80, alApr: true,
      modelo: 'Ejemplo: 1) Caída al agua: chaleco puesto y abrochado en todo momento sobre cubierta y módulos. 2) Atrapamiento con cabos: nunca poner manos ni pies en el seno del cabo y coordinar con el Patrón. 3) Hipotermia: ropa adecuada y pausas para recuperar temperatura.' },
    { tipo: 'abierta', p: '¿A quién avisas, y cómo, si ves una condición insegura o te accidentas?', min: 30,
      modelo: 'Al Supervisor o al Patrón de inmediato, aunque parezca leve. Si te accidentas: primeros auxilios, traslado a la ACHS y la jefatura envía la DIAT dentro de 24 horas. También puedes acudir al Delegado de SST.' }
  ]
};

/* =====================================================================
   CÓMO LEER LA MATRIZ IPER
   ===================================================================== */
CONTENIDO.lecciones['iper.l1'] = { diapositivas: [
  { t: '¿Qué es la Matriz IPER?', x: 'Es la herramienta que exige el D.S. 44 para Identificar Peligros y Evaluar Riesgos de cada tarea. La de PyV fue actualizada en 2026, elaborada por Prevención de Riesgos y aprobada por la Gerencia General.', l: ['Cubre los procesos de apertura, mantención y cierre de centros, cambio de zunchos y flotadores, limpieza y desinfección con buzos, izajes, corte y soldadura y la gestión administrativa.', 'Se revisa cuando cambian las tareas, los equipos o después de un accidente.'] },
  { t: 'Cómo se lee una fila', x: 'Cada fila sigue el mismo orden:', l: ['Proceso → Puesto de trabajo → Tarea', 'Peligro: la fuente del daño', 'Riesgo: lo que puede pasar', 'Consecuencias: el daño posible', 'Evaluación P × S y nivel', 'Medidas de control y procedimiento', 'Riesgo residual: cómo queda después de controlar'], tip: 'Ejemplo real: Apertura de centro · Tripulante · Traslado de personal y materiales · Trabajo sobre embarcación o muelle · Caídas al agua · Inmersión, hipotermia, asfixia.' },
  { t: 'Peligro no es lo mismo que riesgo', l: ['Peligro: un borde de cubierta sin baranda, un cabo en tensión, el frío.', 'Riesgo: la posibilidad de que ese peligro te dañe: caer al agua, recibir un latigazo, sufrir hipotermia.', 'El riesgo depende de cuántas veces te expones y de qué tan grave sería el daño.'] },
  { t: 'Probabilidad × Severidad', l: ['Probabilidad Baja = 1: rara vez, frecuencia mensual.', 'Probabilidad Media = 2: varias veces, frecuencia semanal.', 'Probabilidad Alta = 4: siempre o casi siempre, diario.', 'Severidad 1: ligeramente dañino (cortes, molestias).', 'Severidad 2: dañino (laceraciones, quemaduras, esguinces).', 'Severidad 4: extremadamente dañino (amputaciones, lesiones graves, muerte).'], tip: 'VEP = P × S. Ejemplo: caída al agua con P = 2 y S = 4 da 8.' },
  { t: 'Qué significa cada nivel', l: ['1 o 2 · Tolerable: no requiere mejorar la acción preventiva.', '4 · Moderado: hay que hacer esfuerzos para reducirlo.', '8 · Importante: no se debe comenzar ni continuar el trabajo hasta reducir el riesgo.', '16 · Intolerable: no se comienza ni continúa hasta reducirlo; si no es posible, el trabajo se prohíbe.'] },
  { t: 'Riesgos que se miden con protocolos', x: 'Algunos riesgos de salud no se evalúan con P × S sino con protocolos del Ministerio de Salud:', l: ['Ruido de motores y compresores: PREXOR.', 'Radiación UV en el mar: Guía técnica de radiación UV.', 'Frío: D.S. 594 y criterio ISP.', 'Desinfectantes y químicos: D.S. 594 y su hoja de seguridad (HDS).', 'Posturas y cargas: TMERT y MMC.', 'Carga de trabajo y liderazgo: cuestionario CEAL-SM.', 'Violencia y acoso: protocolo Ley Karin.'] },
  { t: 'La jerarquía de controles', l: ['Eliminación: sacar el peligro.', 'Sustitución: cambiarlo por algo menos peligroso.', 'Ingeniería: barandas, anclajes, superficies antideslizantes.', 'Señalización y advertencia.', 'Administrativos: PTS, AST, capacitación, supervisión, pausas.', 'EPP: chaleco, casco con barbiquejo, guantes. Es la última barrera.'] },
  { t: 'Riesgo residual y personas', l: ['Después de aplicar los controles se evalúa de nuevo: es el riesgo residual. Una caída al agua evaluada en 8 puede quedar en 4 con barandas, PTS y chaleco.', 'La matriz tiene columnas para personas especialmente sensibles y consideraciones sexogenéricas: EPP de la talla real, pausas térmicas, prevención de acoso.', 'Si ves un peligro que no está en la matriz, avísale a Prevención: así se actualiza.'] }
] };
CONTENIDO.talleres['iper.t1'] = {
  intro: 'Evalúa riesgos reales de tu cargo con la regla P × S de PyV y compara con lo que dice la matriz.',
  partes: [
    { tipo: 'vep', desdeIper: true, n: 3 },
    { tipo: 'abierta', p: 'Piensa en una tarea tuya que no esté en la matriz o que haya cambiado. ¿Qué peligro tiene y qué control propones?', min: 30, alApr: true,
      modelo: 'Gracias. Tu aporte queda registrado para Prevención de Riesgos y sirve para actualizar la Matriz IPER.' }
  ]
};
CONTENIDO.quiz.iper = { n: 6, preguntas: [
  { p: '¿Cuál es la diferencia entre peligro y riesgo?', op: ['Son lo mismo', 'El peligro es la fuente del daño; el riesgo es la posibilidad de que ese daño ocurra y su gravedad', 'El riesgo es la fuente; el peligro es la consecuencia', 'El peligro solo existe en el mar'], ok: 2, fbOk: 'Correcto.', fbNo: 'Peligro: la fuente (un borde sin baranda). Riesgo: la posibilidad y gravedad del daño (caer al agua).' },
  { p: 'Una tarea tiene Probabilidad Media (2) y Severidad Extremadamente dañina (4). ¿Qué nivel tiene?', op: ['Tolerable', 'Moderado', 'Importante', 'Intolerable'], ok: 3, fbOk: 'Correcto: 2 × 4 = 8, Importante.', fbNo: '2 × 4 = 8: nivel Importante.' },
  { p: '¿Qué indica un riesgo Importante en la matriz de PyV?', op: ['Se puede trabajar sin cambios', 'No se debe comenzar ni continuar el trabajo hasta reducir el riesgo', 'Solo hay que usar EPP', 'Hay que avisar a fin de mes'], ok: 2, fbOk: 'Correcto.', fbNo: 'Con nivel Importante no se comienza ni continúa hasta reducir el riesgo.' },
  { p: '¿Con qué protocolo se evalúa la exposición al ruido de motores y compresores?', op: ['CEAL-SM', 'PREXOR', 'TMERT', 'Ley Karin'], ok: 2, fbOk: 'Correcto.', fbNo: 'El ruido ocupacional se evalúa con el protocolo PREXOR.' },
  { p: '¿Qué medida es un control de ingeniería?', op: ['Chaleco salvavidas', 'Charla de seguridad', 'Baranda en la embarcación', 'Letrero de advertencia'], ok: 3, fbOk: 'Correcto.', fbNo: 'La baranda es un cambio físico: control de ingeniería.' },
  { p: '¿Qué es el riesgo residual?', op: ['El riesgo antes de evaluar', 'El riesgo que queda después de aplicar los controles', 'Un riesgo que no se puede medir', 'El riesgo de otra empresa'], ok: 2, fbOk: 'Correcto.', fbNo: 'Es el nivel que queda después de aplicar las medidas de control.' },
  { p: 'Ves un peligro nuevo que no está en la matriz. ¿Qué haces?', op: ['Nada', 'Aviso a Prevención o a mi supervisor para actualizarla', 'Lo anoto para mí', 'Espero a la próxima auditoría'], ok: 2, fbOk: 'Correcto.', fbNo: 'Avisar permite actualizar la matriz y los controles.' }
] };

/* =====================================================================
   EMERGENCIAS Y DESASTRES (PRRD)
   ===================================================================== */
CONTENIDO.lecciones['prrd.l1'] = { diapositivas: [
  { t: 'El plan de emergencias de PyV', x: 'El Plan para la Reducción del Riesgo de Desastres (PRRD) 2026 sigue la guía de ONEMI/SENAPRED. Aplica a todo el personal, incluso al contratado por faena y a las visitas.', l: ['Oficina de Las Rosas 121, Puerto Aysén.', 'Navegación, fondeo y permanencia a bordo en canales y fiordos de Aysén.', 'Centros de cultivo en apertura o armado.', 'Centros operacionales o en mantención.'] },
  { t: 'Las amenazas prioritarias', l: ['Hombre al agua.', 'Emergencia médica o accidente grave en zona aislada.', 'Temporal, viento y marejada.', 'Incendio a bordo o en faena (trabajo en caliente, GLP).', 'Vía de agua, hundimiento y abandono.', 'Colisión o abordaje.', 'Sismo y tsunami, incluidos los deslizamientos en fiordos.'] },
  { t: '¿Quién dirige?', l: ['A bordo, en navegación y fondeo: el Patrón, según el zafarrancho.', 'En módulos y jaulas: el Supervisor de faena.', 'En la oficina: el encargado/a de oficina.', 'Desde tierra: Operaciones coordina apoyos (mecánico, remolque, lancha).', 'La Gerencia dispone recursos; Prevención coordina el plan.'], tip: 'La respuesta inmediata no espera autorización: quien está a cargo actúa para proteger a las personas.' },
  { t: 'Cómo se avisa', l: ['Quien detecta → Patrón, Supervisor o encargado/a → Operaciones y Gerencia → empresa mandante.', 'Todo aviso dice: embarcación, posición GPS, tipo de emergencia, número de personas y lesionados, y apoyo requerido.', 'Medios: VHF (canal 16 para socorro), celular y Starlink.', 'Solo alertas oficiales: SENAPRED, SHOA, Autoridad Marítima y SERNAGEOMIN. No se actúa por rumores.'] },
  { t: 'El método ACCEDER', x: 'Cada plan de respuesta del PRRD sigue siete pasos:', l: ['A · Alerta y alarma', 'C · Comunicación', 'C · Coordinación', 'E · Evaluación preliminar', 'D · Decisiones', 'E · Evaluación complementaria', 'R · Readecuación del plan'] },
  { t: 'Sismo y tsunami', l: ['Si el sismo hace difícil mantenerse en pie, se aplica el plan de tsunami de inmediato, sin esperar alerta oficial.', 'En módulos: repliegue a la embarcación y salida hacia aguas profundas.', 'Navegando: alejarse de la costa hacia más de 150 m de profundidad; no entrar a puertos ni bahías.', 'En fiordos un deslizamiento puede generar olas sin aviso (Aysén, abril de 2007).', 'Se vuelve solo cuando la autoridad cancela la alerta: pueden llegar varias olas.'] },
  { t: 'Recursos y zafarranchos', l: ['Cada embarcación tiene chalecos (8 a 9), aros con rabiza, balsa para 10 personas, extintores, botiquín y bombas de achique.', 'Señal de abandono: seis pitazos largos y seguidos. Solo la ordena el Patrón.', 'Antes de zarpar se completa el checklist de inicio de turno.', 'Se practica al menos un zafarrancho por turno y embarcación: hombre al agua, incendio, abandono, vía de agua.'] },
  { t: 'En la oficina', l: ['Sismo: agacharse, cubrirse y afirmarse lejos de ventanas, estanterías y del aire acondicionado; luego evacuar a la zona segura exterior.', 'Incendio: alarma a viva voz, Bomberos (132); extintor solo si el fuego es incipiente y hay salida asegurada.', 'Asalto: no oponer resistencia; luego Carabineros (133) sin alterar el lugar.', 'Corte de luz o agua: si no se puede trabajar seguro, se suspende la jornada.'] },
  { t: 'Números de emergencia', l: CONTENIDO.directorio.slice(0, 10).map(function (d) { return d.n + ': ' + d.t; }) }
] };
CONTENIDO.juegos['prrd.j1'] = CONTENIDO.juegos['ds44.j5'];
CONTENIDO.juegos['prrd.j2'] = CONTENIDO.juegos['ds44.pyv_j'];
CONTENIDO.juegos['prrd.j2_oficina'] = CONTENIDO.juegos['ds44.pyv_j_oficina'];
CONTENIDO.quiz.prrd = { n: 6, preguntas: [
  { p: 'Al comunicar una emergencia desde la embarcación, ¿qué datos se entregan?', op: ['Solo el nombre del Patrón', 'Embarcación, posición GPS, tipo de emergencia, personas y lesionados, y apoyo requerido', 'La hora de zarpe', 'El nombre del centro y nada más'], ok: 2, fbOk: 'Correcto.', fbNo: 'Embarcación, posición GPS, tipo de emergencia, número de personas y lesionados, y apoyo requerido.' },
  { p: '¿Qué significa la primera "A" del método ACCEDER?', op: ['Abandono', 'Alerta y alarma', 'Ayuda externa', 'Autorización'], ok: 2, fbOk: 'Correcto.', fbNo: 'A = Alerta y alarma.' },
  { p: 'En un trabajo en módulos, ¿quién lidera la respuesta inicial?', op: ['El Patrón', 'El Supervisor de faena', 'La mandante', 'Cualquiera'], ok: 2, fbOk: 'Correcto, coordinando con el Patrón.', fbNo: 'En módulos y jaulas lidera el Supervisor de faena.' },
  { p: '¿Cuál es la señal de abandono de la embarcación?', op: ['Tres pitazos cortos', 'Seis pitazos largos y seguidos', 'Sirena continua', 'Luces intermitentes'], ok: 2, fbOk: 'Correcto.', fbNo: 'Seis pitazos largos y seguidos.' },
  { p: 'Navegando recibes alerta oficial de tsunami. ¿Qué indica el plan?', op: ['Entrar al puerto más cercano', 'Ir a aguas profundas y no entrar a puertos ni bahías', 'Fondear junto a la costa', 'Apagar motores'], ok: 2, fbOk: 'Correcto.', fbNo: 'Se navega hacia aguas profundas (más de 150 m) y no se entra a puertos ni bahías.' },
  { p: 'Te llega por WhatsApp un mensaje sin fuente que dice que viene un tsunami. ¿Qué haces?', op: ['Evacuar de inmediato', 'Verificar en las fuentes oficiales (SENAPRED, SHOA, Autoridad Marítima)', 'Reenviarlo a todos', 'Ignorar cualquier alerta'], ok: 2, fbOk: 'Correcto. La excepción es un sismo que impide mantenerse en pie: ahí se actúa de inmediato.', fbNo: 'No se actúa por rumores: se verifica en fuentes oficiales.' },
  { p: '¿Cuándo se puede volver a la costa después de una alerta de tsunami?', op: ['Después de la primera ola', 'Cuando la autoridad cancela la alerta', 'A la hora', 'Cuando el mar se ve tranquilo'], ok: 2, fbOk: 'Correcto.', fbNo: 'Solo cuando la autoridad cancela la alerta.' }
] };

/* =====================================================================
   EPP (PTS-001)
   ===================================================================== */
CONTENIDO.lecciones['epp.l1'] = { documento: 'pts/PTS-001.pdf', diapositivas: [
  { t: 'El EPP en PyV', x: 'El procedimiento PTS-001 ordena la gestión del EPP en 8 etapas, según la Guía del ISP.', l: ['1 Selección según la Matriz IPER', '2 Compra de EPP certificado', '3 Recepción y entrega con registro', '4 Uso', '5 Mantención', '6 Reposición', '7 Disposición final', '8 Supervisión y control'], tip: 'El EPP es siempre la última medida: no reemplaza a las barandas, los procedimientos ni la supervisión.' },
  { t: 'Categorías de EPP', l: ['Categoría I: riesgos mínimos, diseño simple (por ejemplo, guantes de trabajo liviano).', 'Categoría II: riesgos que no son mínimos ni mortales.', 'Categoría III: riesgos graves o mortales: chaleco salvavidas, arnés, protección auditiva, respiradores. Requieren certificación obligatoria.', 'Todo EPP comprado debe tener certificado del ISP o estar en su registro de fabricantes e importadores.'] },
  { t: 'Cuando recibes tu EPP', l: ['El Supervisor completa el formulario de entrega con el motivo.', 'Recibes el EPP con el folleto del fabricante.', 'Te capacitan al menos 1 hora en uso, ajuste, mantención y reposición (esta capacitación).', 'Se verifica que te quede bien, en tu talla real.', 'Firmas el formulario de entrega.'], tip: 'El EPP es gratis. La empresa no puede descontarte el costo de un EPP gastado por uso normal.' },
  { t: 'Cómo se usa', l: ['Todo el tiempo que estés expuesto al riesgo.', 'Revísalo antes de cada uso.', 'Úsalo solo para lo que fue entregado.', 'No compartas EPP personal: lentes, mascarillas, guantes, cascos.', 'Si usas varios a la vez, verifica que sean compatibles.', 'No modifiques ni desarmes ningún EPP.'], tip: 'No usar el EPP: primera vez amonestación verbal, segunda escrita, y luego sanciones del Reglamento Interno.' },
  { t: 'Cómo se cuida', l: ['Límpialo y guárdalo en un lugar limpio y seco, lejos del sol directo, del calor y de químicos.', 'Los EPP compartidos se limpian y desinfectan después de cada uso.', 'La revisión mayor de arneses, filtros y correas la gestiona Prevención según el fabricante.'] },
  { t: 'Cuándo se repone', l: ['Desgaste o deterioro visible.', 'Falla: hebillas, costuras, filtros obstruidos.', 'Fecha de vencimiento cumplida.', 'Contacto con químicos o material biológico.', 'Pérdida justificada.', 'Cambio de cargo.', 'Fin de la vida útil indicada por el fabricante.'], tip: 'El chaleco salvavidas se repone si tiene cortes, quemaduras, costuras dañadas, perdió flotabilidad o le falta el silbato. El arnés que detuvo una caída se retira de inmediato.' },
  { t: 'Disposición final y control', l: ['El EPP dado de baja se inutiliza (cortado, perforado o marcado "BAJA").', 'Está prohibido donarlo, revenderlo o usarlo en la casa.', 'El contaminado con químicos o material biológico va a contenedores especiales.', 'Prevención y el Delegado de SST inspeccionan el uso y el estado; los supervisores lo controlan a diario.'] }
] };
CONTENIDO.juegos['epp.j1'] = { intro: 'Según el PTS-001, decide si cada EPP sigue en uso o se repone.', partes: [{ tipo: 'clasificar',
  categorias: [{ id: 'usa', nombre: 'Sigue en uso' }, { id: 'repone', nombre: 'Se repone' }],
  items: [
    { t: 'Casco con una fisura en la parte de arriba', c: 'repone', fb: 'Las fisuras reducen su resistencia al impacto.' },
    { t: 'Chaleco salvavidas con una costura abierta', c: 'repone', fb: 'Una costura dañada puede fallar en el agua.' },
    { t: 'Guantes de maniobra limpios, sin cortes y con buen agarre', c: 'usa', fb: 'Están en buen estado.' },
    { t: 'Arnés que detuvo una caída la semana pasada', c: 'repone', fb: 'Un arnés que detuvo una caída se retira de inmediato y se evalúa según el fabricante.' },
    { t: 'Lentes con rayaduras que dificultan ver', c: 'repone', fb: 'Si afectan la visión, se reponen.' },
    { t: 'Chaleco salvavidas mojado, lavado y sin daños', c: 'usa', fb: 'Mojarse es normal; lo importante es que esté íntegro.' },
    { t: 'Botas de seguridad con la suela lisa', c: 'repone', fb: 'Una suela gastada no evita resbalones en cubierta.' },
    { t: 'Filtro del respirador con el que cuesta respirar', c: 'repone', fb: 'Está saturado.' },
    { t: 'Bloqueador solar vencido', c: 'repone', fb: 'Caducidad: se repone.' }
  ] }] };
CONTENIDO.talleres['epp.t1'] = {
  intro: 'Toma tu propio EPP y revísalo pieza por pieza. Lo que marques como "requiere cambio" y tu comentario final le llegan a Prevención de Riesgos.',
  partes: [
    { tipo: 'registro', titulo: 'Autoinspección de mi EPP', opciones: ['Bien', 'Requiere cambio', 'No uso'], items: [
      'Casco: sin fisuras, con barbiquejo y suspensión en buen estado',
      'Chaleco salvavidas: cintas, hebillas, costuras y silbato',
      'Guantes: sin cortes ni perforaciones, con buen agarre',
      'Calzado de seguridad: suela con relieve, puntera cubierta, sin cortes',
      'Ropa impermeable o térmica: sin roturas',
      'Lentes o careta: sin rayas que dificulten la visión',
      'Protección auditiva: almohadillas o tapones limpios y flexibles',
      'Arnés y cabo de vida: cintas, costuras y mosquetones sin daño'] },
    { tipo: 'abierta', p: '¿Qué EPP necesitas reponer, o cuál no te queda bien por talla o ajuste?', min: 5, alApr: true,
      modelo: 'Gracias. Tu respuesta queda registrada para Prevención de Riesgos, que gestionará la reposición.' }
  ]
};
CONTENIDO.quiz.epp = { n: 6, preguntas: [
  { p: '¿Qué lugar ocupa el EPP en la jerarquía de controles?', op: ['La primera medida', 'La última barrera, cuando el riesgo no se pudo eliminar ni controlar', 'Reemplaza a las barandas', 'Es opcional'], ok: 2, fbOk: 'Correcto.', fbNo: 'El EPP es siempre la última medida.' },
  { p: '¿Quién paga el EPP gastado por uso normal?', op: ['El trabajador', 'La empresa: está prohibido descontarlo', 'Se divide en partes iguales', 'El Delegado'], ok: 2, fbOk: 'Correcto.', fbNo: 'El EPP es gratuito y no se puede descontar por deterioro normal.' },
  { p: '¿Cuál de estos EPP es de Categoría III?', op: ['Gorro de lana', 'Chaleco salvavidas', 'Overol de algodón', 'Delantal'], ok: 2, fbOk: 'Correcto: protege de un riesgo mortal.', fbNo: 'El chaleco salvavidas es Categoría III: riesgo grave o mortal.' },
  { p: 'Un arnés detuvo una caída. ¿Qué se hace?', op: ['Se sigue usando si se ve bien', 'Se retira de inmediato y se evalúa según el fabricante', 'Se lava y se guarda', 'Se presta a otro'], ok: 2, fbOk: 'Correcto.', fbNo: 'Se retira de servicio de inmediato.' },
  { p: '¿Qué se hace con un EPP dado de baja?', op: ['Se regala', 'Se inutiliza (cortado, perforado o marcado BAJA)', 'Se lleva a la casa', 'Se vende'], ok: 2, fbOk: 'Correcto.', fbNo: 'Se inutiliza para que nadie lo vuelva a usar.' },
  { p: '¿Puedes compartir tus guantes o tu mascarilla con un compañero?', op: ['Sí, siempre', 'No, el EPP personal no se comparte', 'Solo los viernes', 'Solo si está limpio a la vista'], ok: 2, fbOk: 'Correcto.', fbNo: 'El EPP personal no se comparte por razones de higiene.' }
] };
CONTENIDO.firmas['epp.f1'] = function () { return { texto: 'Declaro haber recibido la capacitación de ' + CONTENIDO.empresa.nombre + ' sobre el uso correcto, ajuste, mantención, criterios de reposición y disposición final de mis elementos de protección personal, según el procedimiento PTS-001 y el D.S. N° 44/2024. Me comprometo a usarlos durante toda la exposición al riesgo y a avisar de inmediato cualquier daño o pérdida.' }; };

/* =====================================================================
   QUÉ HACER ANTE UN ACCIDENTE
   ===================================================================== */
CONTENIDO.lecciones['acc.l1'] = { documento: 'pts/PA-ACCIDENTES.pdf', diapositivas: [
  { t: '¿Qué es un accidente del trabajo?', l: ['Toda lesión que sufres a causa o con ocasión del trabajo y que te produce incapacidad o muerte (Ley 16.744).', 'También el accidente de trayecto: el que ocurre en el camino directo entre tu casa y el trabajo.', 'El organismo administrador de PyV es la ACHS: atención gratuita, subsidios y rehabilitación.'], tip: 'Avisa siempre, aunque parezca leve. Una lesión que no se denuncia puede quedar sin cobertura.' },
  { t: 'Leve, grave o fatal', l: ['Leve: no requiere hospitalización ni deja secuelas que impidan volver al trabajo.', 'Grave: obliga a reanimar o a rescatar; caída de más de 1,8 m; afecta a más de un trabajador; puede causar muerte o invalidez; o ocurre con riesgo inminente para la vida.', 'Fatal: produce la muerte, inmediata o como consecuencia directa del accidente.'] },
  { t: 'Accidente leve: los pasos', l: ['Primeros auxilios en el lugar.', 'Traslado al centro de la ACHS más cercano si la lesión lo amerita.', 'La jefatura envía la DIAT a la ACHS dentro de 24 horas.', 'Registro interno del accidente.', 'Seguimiento médico hasta el alta y la reincorporación.'] },
  { t: 'Accidente grave', l: ['Suspender de inmediato la faena y acordonar el área.', 'Notificar de inmediato a la Inspección del Trabajo y a la SEREMI de Salud (600 42 000 22).', 'Primeros auxilios y traslado; en zona aislada se pide apoyo a la Autoridad Marítima (137).', 'DIAT marcada como grave dentro de 24 horas.', 'La faena solo se reanuda con autorización escrita de la autoridad.', 'Investigación con árbol de causas en un máximo de 30 días.'] },
  { t: 'Accidente fatal', l: ['Suspender y acordonar; no alterar la escena.', 'Llamar a Carabineros (133) y SAMU (131).', 'Notificar de inmediato a la Inspección del Trabajo y SEREMI (600 42 000 22).', 'Correo a accidentes@suseso.cl con el asunto #FATAL.', 'DIAT marcada como fatal dentro de 24 horas.', 'Investigación y reanudación solo con autorización escrita.'] },
  { t: 'La denuncia (DIAT)', l: ['La hace la empresa dentro de 24 horas.', 'Si la empresa no la hace, puede hacerla el propio trabajador, un familiar, un compañero o el médico tratante.', 'Si la ACHS rechaza tu caso como laboral y no estás de acuerdo, puedes reclamar ante la SUSESO.'] },
  { t: 'La investigación (PTS-018)', l: ['Busca causas, no culpables.', 'Se reconstruye lo que pasó con un relato y un árbol de causas.', 'Las medidas inmediatas se aplican en un máximo de 24 horas.', 'El Delegado de SST participa.', 'El informe se guarda al menos 5 años a disposición de la autoridad.', 'Después de un accidente grave o fatal se revisa la Matriz IPER.'] },
  { t: 'Tu parte', l: ['Avisar de inmediato a tu Supervisor o Patrón cualquier accidente y también los cuasi accidentes (lo que pudo pasar).', 'No mover nada del lugar si fue grave o fatal.', 'Contar con honestidad lo que pasó en la investigación: sirve para que no le pase a otro.'] }
] };
CONTENIDO.juegos['acc.j1'] = { intro: 'Clasifica cada situación según el procedimiento de accidentes de PyV. Después ordena los pasos de un accidente leve.', partes: [
  { tipo: 'clasificar', categorias: [{ id: 'leve', nombre: 'Leve' }, { id: 'grave', nombre: 'Grave' }, { id: 'fatal', nombre: 'Fatal' }], items: [
    { t: 'Corte en un dedo; lo curan en la ACHS y vuelve a trabajar', c: 'leve', fb: 'No requiere hospitalización ni deja secuelas.' },
    { t: 'Un operario cae desde una baranda de 2 metros al pasillo', c: 'grave', fb: 'Caída de más de 1,8 metros: grave.' },
    { t: 'Un compañero cae al agua y hay que rescatarlo', c: 'grave', fb: 'Si obliga a rescate, es grave.' },
    { t: 'Dos operarios golpeados por una misma carga', c: 'grave', fb: 'Involucra a más de un trabajador: grave.' },
    { t: 'Esguince de tobillo al bajar al muelle', c: 'leve', fb: 'Leve si no requiere hospitalización.' },
    { t: 'Un buzo sale inconsciente y hay que reanimarlo', c: 'grave', fb: 'Si obliga a maniobras de reanimación, es grave.' },
    { t: 'Un trabajador fallece tras ser golpeado por el brazo hidráulico', c: 'fatal', fb: 'Fatal: se suspende, no se altera la escena y se notifica de inmediato.' }
  ] },
  { tipo: 'ordenar', enunciado: 'Ordena los pasos ante un accidente leve.', items: ['Primeros auxilios y traslado a la ACHS', 'La jefatura envía la DIAT dentro de 24 horas', 'Registro interno del accidente', 'Seguimiento médico hasta el alta', 'Reincorporación al trabajo'], fb: 'Así lo establece el procedimiento de accidentes de PyV.' }
] };
CONTENIDO.quiz.acc = { n: 6, preguntas: [
  { p: '¿En qué plazo se envía la DIAT a la ACHS?', op: ['24 horas', '5 días', '30 días', 'Solo si hay licencia'], ok: 1, fbOk: 'Correcto.', fbNo: 'Dentro de 24 horas desde que se conoce el accidente.' },
  { p: 'Un trabajador cae desde 2,5 metros. ¿Cómo se clasifica?', op: ['Leve', 'Grave', 'De trayecto', 'No es accidente'], ok: 2, fbOk: 'Correcto: más de 1,8 m.', fbNo: 'Una caída de más de 1,8 metros es accidente grave.' },
  { p: 'Ante un accidente grave, ¿qué se hace con la faena?', op: ['Se sigue trabajando', 'Se suspende de inmediato y se acordona el área', 'Se termina rápido', 'Se cambia de turno'], ok: 2, fbOk: 'Correcto.', fbNo: 'Se suspende y acordona; se reanuda solo con autorización escrita.' },
  { p: 'Si la empresa no hace la DIAT, ¿quién puede hacerla?', op: ['Nadie', 'El trabajador, un familiar, un compañero o el médico tratante', 'Solo la Gerencia', 'Solo la mandante'], ok: 2, fbOk: 'Correcto.', fbNo: 'Puede hacerla el propio trabajador, un familiar, un compañero o el médico.' },
  { p: '¿Qué busca la investigación de un accidente?', op: ['Un culpable para sancionar', 'Las causas, para que no se repita', 'Cerrar el caso rápido', 'Bajar las estadísticas'], ok: 2, fbOk: 'Correcto.', fbNo: 'Busca causas, no culpables, y define medidas para que no se repita.' },
  { p: 'Te caes en el trayecto directo de tu casa al trabajo. ¿Qué es?', op: ['Un accidente común', 'Un accidente de trayecto, cubierto por la Ley 16.744', 'No se cubre', 'Solo si vas en auto de la empresa'], ok: 2, fbOk: 'Correcto.', fbNo: 'Es un accidente de trayecto, con cobertura de la Ley 16.744.' },
  { p: 'Ves que casi le cae un grillete en la cabeza a un compañero, pero no le pasa nada. ¿Qué haces?', op: ['Nada, no pasó nada', 'Lo reporto como cuasi accidente', 'Me río', 'Lo cuento solo si pregunta alguien'], ok: 2, fbOk: 'Correcto. Los cuasi accidentes avisan lo que puede pasar.', fbNo: 'Se reporta como cuasi accidente: es la oportunidad de corregir antes de que alguien se lesione.' }
] };

/* =====================================================================
   PROCEDIMIENTOS DE TRABAJO SEGURO
   ===================================================================== */
var _PTS = {
  'PTS-003': {
    objetivo: 'Ejecutar los trabajos de corte y soldadura en centros de cultivo y embarcaciones de forma segura, controlada y conforme al D.S. 44 y las normas marítimas.',
    alcance: ['Soldadores, supervisores de faena y personal de apoyo.', 'Pasillos, módulos, jaulas y estructuras metálicas.', 'Embarcaciones de apoyo y plataformas flotantes.'],
    roles: { soldador: ['Cumplir el PTS y el Permiso de Trabajo en Caliente (PTC).', 'Usar todo el tiempo el EPP completo y en buen estado.', 'Inspeccionar su equipo antes de empezar y reportar fallas.', 'Mantener el área ordenada y sin inflamables.'], supervisor: ['Emitir y firmar el PTC antes de empezar.', 'Inspeccionar el área y controlar la zona caliente.', 'Suspender la faena ante riesgo inminente.', 'Coordinar la respuesta ante emergencias.'], _: ['Preparar el área y asistir al soldador respetando las medidas de seguridad.', 'Actuar como vigía o apoyo si te lo asignan.', 'Mantenerte fuera del alcance de chispas y proyecciones.'] },
    epp: ['Careta o casco de soldar', 'Guantes ignífugos', 'Ropa de algodón o ignífuga', 'Protección respiratoria si aplica', 'Protector auditivo y facial', 'Calzado de seguridad', 'Arnés y línea de vida en altura'],
    pasos: [{ t: 'Antes de soldar', l: ['Validar el Permiso de Trabajo en Caliente.', 'Inspeccionar el área: inflamables, riesgo eléctrico, lluvia y viento.', 'Retirar o cubrir inflamables en un radio de 10 metros.', 'Delimitar la zona caliente y asegurar ventilación.', 'Extintor PQS de 6 kg o más y botiquín disponibles.', 'Revisar cables, conexiones y conexión a tierra de la soldadora.'] },
      { t: 'Durante y después', l: ['EPP completo; piezas en superficie estable y sujeta.', 'Pantallas para contener chispas y radiación.', 'Al terminar: apagar y desconectar, esperar que se enfríe, retirar residuos.', 'Inspección final de posibles fuentes de ignición y cierre del PTC.'] }],
    detener: ['Humedad en las conexiones.', 'Lluvia intensa o viento que comprometa la estabilidad.', 'Falla de un EPP crítico.', 'Incendio que no se controla de inmediato: evacuar.'],
    orden: ['Validar el Permiso de Trabajo en Caliente', 'Retirar inflamables a 10 metros y delimitar la zona caliente', 'Verificar extintor PQS y conexión a tierra', 'Soldar con EPP completo y pantallas', 'Apagar, dejar enfriar e inspeccionar fuentes de ignición', 'Cerrar el PTC y registrar en bitácora'],
    quiz: [
      { p: '¿Qué documento autoriza cada trabajo de corte o soldadura?', op: ['La orden de compra', 'El Permiso de Trabajo en Caliente', 'La guía de despacho', 'Ninguno'], ok: 2 },
      { p: '¿En qué radio se retiran o protegen los materiales inflamables?', op: ['1 metro', '3 metros', '10 metros', '50 metros'], ok: 3 },
      { p: '¿Qué extintor exige el procedimiento en el puesto de soldadura?', op: ['Uno de agua', 'PQS de al menos 6 kg', 'Ninguno', 'Uno de cocina'], ok: 2 },
      { p: '¿Cuándo se suspende el trabajo?', op: ['Nunca', 'Con humedad en conexiones, lluvia o viento fuerte, o falla del EPP crítico', 'Solo si lo pide la mandante', 'Al terminar el turno'], ok: 2 },
      { p: 'Terminada la soldadura, ¿qué se hace antes de cerrar el PTC?', op: ['Irse de inmediato', 'Dejar enfriar las piezas e inspeccionar posibles fuentes de ignición', 'Mojar todo con agua', 'Nada'], ok: 2 }
    ] },
  'PTS-004': {
    objetivo: 'Realizar en forma segura las faenas de apertura y armado de centros de cultivo, en estructuras flotantes, con herramientas, izajes, navegación y soldadura.',
    alcance: ['Instalación de cerco perimetral y lobera.', 'Montaje de pajareras, yugos, postes de 3 y 4 m y sus bases.', 'Reticulado e instalación de boyas cabeceras.', 'Armado de atracaderos y barandas.', 'Costura y tensado de redes; cabos estructurales.', 'Navegación auxiliar asociada.'],
    roles: { supervisor: ['Planificar y controlar la faena.', 'Verificar mar y clima antes de empezar.', 'Autorizar el inicio y suspender si hace falta.', 'Hacer la charla pre-turno y revisar listas de chequeo y EPP.'], patron: ['Conducir la embarcación según las condiciones de mar.', 'Verificar elementos de seguridad náutica: extintores, bengalas, radio, salvavidas.', 'Suspender la navegación si no hay condiciones mínimas.', 'Mantener comunicación con el supervisor.'], motorista: ['Apoyar la navegación segura y la operación de la embarcación.', 'Informar al Patrón cualquier anomalía de motor o equipos.'], tripulante: ['Apoyar la navegación del bote auxiliar.', 'Coordinar maniobras de posicionamiento con el Patrón.', 'Supervisar el izaje de materiales desde o hacia la embarcación.'], soldador: ['Soldar yugos y barandas con aislamiento eléctrico y entorno seco.', 'Usar herramientas autorizadas y en buen estado.'], _: ['Instalar cerco, postes, yugos, cabos y pajareras bajo supervisión directa.', 'Usar correctamente el EPP.', 'Reportar condiciones inseguras o estructuras deterioradas.'] },
    epp: ['Casco con barbiquejo', 'Guantes', 'Gafas de seguridad', 'Arnés y línea de vida', 'Chaleco salvavidas en todo momento', 'Botas con punta de acero', 'Ropa de trabajo resistente', 'Protector auditivo'],
    pasos: [{ t: 'Inicio', l: ['Reunión de coordinación: tareas y roles.', 'Inspección de equipos y herramientas.', 'Charla de seguridad y AST.'] },
      { t: 'Ejecución', l: ['Bases para postes niveladas y fijadas.', 'Postes de 3 m (cerco) y 4 m (pajarera) con grúa, asegurados y fijados con yugos.', 'Pajareras montadas, fijadas y tensadas con el brazo hidráulico.', 'Boyas cabeceras reticuladas con cabos de 32 mm.', 'Costura de perimetral a lobera sin espacios.', 'Barandas en las áreas designadas.', 'Al final: inspección, limpieza e informe de la jornada.'] }],
    detener: ['Mar, viento o visibilidad que impidan trabajar seguro.', 'Estructuras o equipos en mal estado.', 'Falta de embarcación de apoyo junto a la cuadrilla.'],
    orden: ['Reunión de coordinación y AST', 'Inspección de equipos y herramientas', 'Colocación de bases para postes', 'Instalación de postes y yugos', 'Montaje y tensado de pajareras', 'Inspección final y limpieza del área'],
    quiz: [
      { p: '¿Cuándo se usa el chaleco salvavidas durante la apertura?', op: ['Solo al navegar', 'En todo momento', 'Solo si llueve', 'Nunca sobre los módulos'], ok: 2 },
      { p: '¿Para qué se usan los postes de 4 metros?', op: ['Cerco perimetral', 'Mallas pajareras', 'Barandas', 'Atracaderos'], ok: 2 },
      { p: '¿Quién autoriza el inicio y la suspensión de los trabajos?', op: ['Cualquier operario', 'El Supervisor de faena', 'La mandante', 'El soldador'], ok: 2 },
      { p: '¿Qué se hace antes de empezar la jornada?', op: ['Nada', 'Reunión de coordinación, inspección de equipos y charla de seguridad', 'Solo cargar combustible', 'Revisar el celular'], ok: 2 }
    ] },
  'PTS-005': {
    objetivo: 'Mantener balsas jaulas y módulos de centros de cultivo reduciendo al mínimo los riesgos de estas tareas.',
    alcance: ['Cambio de zunchos, pasadores y perticas.', 'Instalación de flotadores, barandas y tapas butilo.', 'Armado y desarmado de jaulas.', 'Soldadura de pines y yugos.', 'Tensado de pajareras y cerco; costura de cerco o faldones.', 'Resanado de pasillos.'],
    roles: { supervisor: ['Asegurar que se siga el PTS, inspeccionar y capacitar.'], soldador: ['Soldar yugos y barandas con prácticas seguras.'], tripulante: ['Transporte y apoyo logístico en la faena.'], patron: ['Transporte y apoyo logístico en la faena.'], _: ['Cumplir las normas de seguridad, usar el EPP y reportar riesgos.'] },
    epp: ['Casco con barbiquejo y protector facial', 'Guantes de protección y anticorte', 'Gafas o careta de soldar', 'Arnés', 'Chaleco salvavidas', 'Botas con punta de acero', 'Protector auditivo', 'Rodilleras para el resanado', 'Mascarilla con filtro para pintura y soldadura'],
    pasos: [{ t: 'Preparación', l: ['Revisar el plan y asignar tareas según competencias.', 'Verificar clima y mar antes de embarcar.', 'AST con todo el equipo.', 'EPP completo y herramientas en buen estado.', 'Medios de rescate disponibles: aro, cuerda y botiquín.'] },
      { t: 'Ejecución y cierre', l: ['Posicionarse estable sobre el pasillo con chaleco puesto.', 'Sujetar las piezas para que no caigan al agua.', 'Detener ante condiciones inseguras o cambio de clima.', 'Retirar herramientas y desechos; no dejar materiales sueltos.', 'Reportar EPP dañado y registrar hallazgos.'] }],
    detener: ['Condición insegura en la estructura.', 'Cambio en las condiciones climáticas.', 'Falta de medios de rescate.'],
    orden: ['Revisar el plan y asignar tareas', 'Verificar clima y mar', 'Realizar el AST con todo el equipo', 'Ejecutar la tarea estable y con chaleco', 'Retirar herramientas y desechos', 'Registrar el reporte y los hallazgos'],
    quiz: [
      { p: '¿Para qué sirve una tapa butilo?', op: ['Para tapar boyas', 'Cubre las uniones del pasillo e impide caer al agua', 'Para soldar', 'Para guardar herramientas'], ok: 2 },
      { p: 'Antes de iniciar la mantención, ¿qué medios de rescate deben estar disponibles?', op: ['Ninguno', 'Aro salvavidas, cuerda de rescate y botiquín', 'Solo el celular', 'Una escalera'], ok: 2 },
      { p: 'Al retirar un pasador, ¿qué cuidado se tiene?', op: ['Tirarlo al agua', 'Sujetar la pieza para evitar que caiga al agua', 'Golpearlo fuerte', 'Dejarlo en el pasillo'], ok: 2 },
      { p: '¿Qué EPP adicional se usa en el resanado de pasillos?', op: ['Rodilleras', 'Aletas', 'Careta de soldar', 'Ninguno'], ok: 1 }
    ] },
  'PTS-006': {
    objetivo: 'Ejecutar el raspado subacuático, la limpieza con hidrolavadora y la desinfección de estructuras acuícolas con una metodología segura y fiscalizable.',
    alcance: ['Raspado subacuático manual con espátulas por buzo, hasta 3 m aprox.', 'Limpieza externa con hidrolavadora bencinera desde superficie.', 'Desinfección con productos autorizados: Seamarine Eco, Germisan 15, Tonalim Aqua, Clorodos Plus.'],
    roles: { buzo_supervisor: ['Es la autoridad técnica de seguridad: evalúa condiciones, autoriza la inmersión y define STOP WORK.', 'No bucea mientras supervisa.', 'Verifica la bandera Alfa antes de autorizar el ingreso.'], buzo: ['Ejecuta el raspado por sectores, sin ubicarse bajo elementos con riesgo de atrapamiento.', 'Mantiene comunicación y detiene ante condiciones inseguras.'], supervisor: ['Coordina con la mandante.', 'Hace el hidrolavado y prepara y aplica el desinfectante con EPP químico.', 'Emite el reporte de faena y el certificado de desinfección.'], _: ['Asistente de buzo: arma y vigila el sistema de aire, controla manguera y línea de vida y apoya el ingreso y la salida.', 'Solo entra al agua en emergencia y por instrucción del Supervisor de Buceo.'] },
    epp: ['Equipo de buceo certificado (buzo)', 'Guantes', 'Protección ocular o facial para hidrolavado', 'Ropa impermeable', 'Protección química para desinfectantes', 'Calzado antideslizante', 'Chaleco salvavidas en cubierta'],
    pasos: [{ t: 'Antes de la inmersión', l: ['Charla operativa y AST del día.', 'Profundidad dentro del rango del servicio (máx. 3 m aprox.).', 'Bandera Alfa izada en lugar visible.', 'Compresor estable y ventilado; prueba funcional con el buzo respirando en superficie.', 'Línea de vida independiente de la manguera naranja.'] },
      { t: 'Inmersión, limpieza y cierre', l: ['Ingreso controlado; el asistente maneja manguera y línea sin tirones.', 'Raspado por sectores con control de aire estable.', 'Hidrolavado con zona segura por proyección y rebote.', 'Salida controlada y evaluación del buzo: fatiga, frío, molestias.', 'Desinfectante diluido según ficha técnica, con EPP químico.', 'Residuos según la mandante; apagado seguro y registros.'] }],
    detener: ['Variación o corte del aire; olor o sabor extraño.', 'Falta de la bandera Alfa.', 'Enredo de manguera o línea de vida.', 'Corriente u oleaje que impida el control.', 'Síntomas del buzo: mareo, dificultad para respirar, dolor, fatiga marcada, hipotermia.', 'Derrame de combustible o riesgo de incendio en equipos bencineros.'],
    orden: ['Charla operativa y AST del día', 'Izar la bandera Alfa', 'Armar y probar el sistema de aire', 'Instalar la línea de vida independiente', 'Ingreso controlado y raspado por sectores', 'Salida y evaluación post inmersión'],
    quiz: [
      { p: '¿Quién autoriza cada inmersión y puede declarar STOP WORK?', op: ['El buzo', 'El Supervisor de Buceo', 'La mandante', 'El Patrón'], ok: 2 },
      { p: '¿Qué pasa si no está izada la bandera Alfa?', op: ['Se bucea igual', 'No hay inmersión: es STOP WORK', 'Se avisa por radio', 'Se pone después'], ok: 2 },
      { p: 'El buzo siente sabor extraño en el aire. ¿Qué corresponde?', op: ['Terminar el sector', 'Salida inmediata', 'Respirar más lento', 'Cambiar de espátula'], ok: 2 },
      { p: '¿Cómo debe ser la línea de vida?', op: ['La misma manguera de aire', 'Independiente de la manguera de aire', 'Opcional', 'De cualquier cabo'], ok: 2 },
      { p: '¿Cómo se prepara el desinfectante?', op: ['Mezclando varios productos', 'Según la ficha técnica y la HDS, con EPP químico', 'Al ojo', 'Sin guantes'], ok: 2 }
    ] },
  'PTS-007': {
    objetivo: 'Instalar, cambiar o modificar zunchos y flotadores y raspar flotadores en la superficie del mar, sin inmersión, controlando sus riesgos.',
    alcance: ['Faenas en superficie del agua y bajo pasillos que no impliquen sumergirse.', 'Lo que requiera sumergirse lo hacen buzos con su propio procedimiento.'],
    roles: { operario_agua: ['Estar acreditado y haber recibido las instrucciones de la tarea.', 'Nunca sumergirse por completo: la cabeza siempre sobre el agua.', 'Inspeccionar su equipo y dejar registro en el AST.', 'Avisar de inmediato si no está en condiciones físicas.'], supervisor: ['Estar presente en todo momento: planificar, guiar, controlar y corregir.', 'Activar el plan de contingencias ante una emergencia.'], _: ['Asistente: apoyar desde el pasillo, entregar materiales y vigilar al operario en el agua.', 'Notificar cualquier condición de riesgo al supervisor.'] },
    epp: ['En el agua: traje seco o neopreno, botín, aletas, guantes, chaleco salvavidas, casco con barbiquejo, antiparras, arnés y cabos de sujeción', 'En el pasillo: zapatos de seguridad, overol, casco con barbiquejo, guantes, chaleco salvavidas, rodilleras'],
    pasos: [{ t: 'Antes de empezar', l: ['Coordinar con Operaciones o el encargado del centro.', 'Permiso de trabajo firmado por todo el equipo y AST: clima, equipos, sujeción de herramientas, salud y competencias, líneas de vida y anclajes.', 'Delimitar el área con conos u otros dispositivos.', 'Instalar escalera para entrar y salir del agua.'] },
      { t: 'En el agua', l: ['Entrar por la escalera, supervisado por el asistente.', 'Arnés con dos cabos de vida (máx. 3 m) anclados a la línea de vida.', 'Al cambiar de posición: anclar el segundo cabo antes de soltar el primero.', 'Máximo 2 horas en la mañana y 2 en la tarde, con pausas.', 'Lonas o quiñes bajo los flotadores para recoger los residuos del raspado.', 'Salir por la escalera y retirar residuos, herramientas y materiales.'] }],
    detener: ['Operario sin condiciones físicas o con frío intenso.', 'Clima o mar que impidan trabajar seguro.', 'Falla en arnés, cabo de vida o anclaje.'],
    orden: ['Coordinar con el centro y firmar el permiso de trabajo', 'Realizar el AST e instalar la escalera', 'Ponerse el arnés y anclar el cabo de vida', 'Entrar al agua supervisado', 'Trabajar siempre anclado con dos cabos', 'Salir por la escalera y retirar residuos'],
    quiz: [
      { p: '¿Cuánto tiempo máximo puede trabajar un operario dentro del agua?', op: ['4 horas seguidas', '2 horas en la mañana y 2 en la tarde', 'Todo el turno', '1 hora'], ok: 2 },
      { p: 'Al cambiar de posición bajo el pasillo, ¿cómo se usan los cabos de vida?', op: ['Se sueltan los dos', 'Se ancla el segundo antes de soltar el primero', 'Se usa uno solo', 'No se usan'], ok: 2 },
      { p: '¿Puede el operario sumergirse por completo?', op: ['Sí', 'No, la cabeza siempre sobre el agua', 'Solo con antiparras', 'Hasta 1 metro'], ok: 2 },
      { p: '¿Cuál es el largo máximo del cabo de vida?', op: ['1 metro', '3 metros', '10 metros', 'No tiene límite'], ok: 2 },
      { p: '¿Para qué se ponen lonas o quiñes bajo los flotadores?', op: ['Para flotar', 'Para recoger los residuos del raspado y no contaminar', 'Para sentarse', 'Para marcar el área'], ok: 2 }
    ] },
  'PTS-009': {
    objetivo: 'Raspar pontones, flotadores y estructuras sumergidas con buzos, controlando los riesgos y la contaminación cruzada.',
    alcance: ['Raspado y limpieza de artefactos navales con buzos y personal de superficie.', 'Limpieza con o sin recuperación de restos orgánicos.', 'Limpieza de cubiertas, bodegas y pontones con hidrolavadora.'],
    roles: { buzo_supervisor: ['Coordinar la jornada, aplicar la IPER y liderar el AST.', 'Controlar la bitácora de inmersiones y autorizar cada descenso.', 'No ser buzo activo durante la faena.'], buzo: ['Participar en la identificación de peligros.', 'Hacer la verificación cruzada de equipos antes de cada inmersión.', 'Notificar cualquier condición insegura.'], supervisor: ['Asegurar que se siga el procedimiento y hacer inspecciones.'], _: ['Personal de superficie: cumplir las normas, usar el EPP y reportar incidentes.'] },
    epp: ['Botas de goma o zapatos de seguridad', 'Overol o ropa de trabajo', 'Traje de agua', 'Traje blanco', 'Máscara con filtros', 'Guantes de nitrilo', 'Antiparras', 'Buzos: traje de buceo, máscara, cinturón, aletas, guantes y casco'],
    pasos: [{ t: 'Planificación', l: ['Revisar el pronóstico y el estado del mar.', 'Evaluación IPER específica y AST del día con firmas.', 'Chequeo de salud del personal, en especial de los buzos.', 'Verificar equipos, EPP y permisos.'] },
      { t: 'Raspado', l: ['Lonas para contener residuos y bins rotulados para residuos orgánicos.', 'Raspado manual con espátulas de toda estructura que estuvo en el agua.', 'Equipo: buzo, supervisor de buceo y asistente.', 'Cubiertas y pontones: solo con hidrolavadora.', 'Desinfectar herramientas entre usos (barrera sanitaria).'] }],
    detener: ['Condiciones climáticas extremas.', 'Falla del equipo de buceo o del suministro de aire.', 'Condición insegura informada por cualquier integrante.'],
    orden: ['Revisar pronóstico y estado del mar', 'Evaluación IPER y AST con firmas', 'Chequeo de salud de los buzos', 'Instalar lonas y bins rotulados', 'Raspar por sectores con espátulas', 'Desinfectar herramientas y retirar residuos'],
    quiz: [
      { p: '¿Puede el Supervisor de Buceo ser buzo activo durante la faena?', op: ['Sí', 'No', 'Solo en emergencias planificadas', 'Solo los lunes'], ok: 2 },
      { p: '¿Qué se verifica antes de cada inmersión?', op: ['Nada', 'Verificación cruzada de los equipos de buceo', 'Solo el combustible', 'El horario'], ok: 2 },
      { p: '¿Para qué sirve desinfectar las herramientas entre usos?', op: ['Para que brillen', 'Para evitar la contaminación cruzada entre áreas', 'No sirve', 'Para que pesen menos'], ok: 2 },
      { p: '¿Cómo se limpian las cubiertas de módulos y pontones?', op: ['Con espátula bajo el agua', 'Con hidrolavadora', 'Con cloro puro', 'No se limpian'], ok: 2 }
    ] },
  'PTS-010': {
    objetivo: 'Cerrar un centro de cultivo protegiendo a los trabajadores durante el desarme y retiro de sus estructuras.',
    alcance: ['Retiro de cerco perimetral, pajareras, postes de 3 y 4 m, bases y yugos.', 'Retiro de atracaderos, reticulado de boyas cabeceras y barandas.', 'Descostura de perimetral a lobera.'],
    roles: { supervisor: ['Planificar y controlar el desarme y autorizar o suspender la faena.'], soldador: ['Cortes y trabajos en caliente con el PTC y prácticas seguras.'], patron: ['Conducción segura de la embarcación y apoyo al izaje.'], motorista: ['Apoyo a la operación de la embarcación.'], tripulante: ['Apoyo en maniobras e izaje de materiales.'], _: ['Desarmar bajo supervisión, usar el EPP y reportar condiciones inseguras.'] },
    epp: ['Casco', 'Guantes', 'Gafas de seguridad', 'Arnés de seguridad y línea de vida', 'Chaleco salvavidas en todo momento', 'Botas con punta de acero', 'Ropa de trabajo resistente', 'Protector auditivo'],
    pasos: [{ t: 'Inicio', l: ['Reunión de coordinación y asignación de roles.', 'Inspección de equipos y herramientas.'] },
      { t: 'Desarme', l: ['Retirar la malla perimetral desanclando los postes y enrollándola.', 'Desmontar postes con grúa, retirar yugos y asegurar lo que queda en pie.', 'Desanclar y retirar vientos sin dejar estructuras con riesgo de caída.', 'Desanclar boyas cabeceras y enrollar los cabos.', 'Retirar barandas y almacenarlas.', 'Inspección final, limpieza e informe.'] }],
    detener: ['Estructuras inestables.', 'Mar o viento que impidan trabajar seguro.', 'Equipos de izaje con fallas.'],
    orden: ['Reunión de coordinación y roles', 'Inspección de equipos y herramientas', 'Retiro de la malla perimetral', 'Desarme de postes y yugos', 'Retiro de boyas, cabos y barandas', 'Inspección final, limpieza e informe'],
    quiz: [
      { p: 'Al desarmar postes y yugos, ¿qué se asegura?', op: ['Nada', 'La estabilidad de las estructuras que quedan', 'La pintura', 'El horario'], ok: 2 },
      { p: '¿Cuándo se usa el chaleco salvavidas en el cierre?', op: ['En todo momento', 'Solo al navegar', 'Nunca', 'Solo si llueve'], ok: 1 },
      { p: '¿Qué se hace con los vientos de los postes?', op: ['Se cortan en tensión', 'Se desanclan y retiran sin dejar estructuras con riesgo de caída', 'Se dejan', 'Se tiran al mar'], ok: 2 },
      { p: '¿Qué se revisa al empezar la jornada?', op: ['El estado de equipos y herramientas', 'Las redes sociales', 'Nada', 'Solo la comida'], ok: 1 }
    ] },
  'PTS-012': {
    objetivo: 'Controlar el riesgo de caída desde altura en mantención, inspección, armado, reparación u operación en estructuras flotantes, embarcaciones y centros.',
    alcance: ['Todo trabajo con riesgo de caída de altura en faenas de PyV.'],
    roles: { supervisor: ['Evaluar el área, validar EPP y anclajes y supervisar directamente toda la tarea.'], patron: ['No hacer maniobras de atraque o desatraque mientras hay trabajo en altura.', 'Mantener comunicación con el equipo.'], prevencion: ['Capacitar, inspeccionar y asegurar el kit de rescate.'], jefe_operaciones: ['Proveer equipos certificados y coordinar los recursos.'], _: ['Usar el EPP conectado a la línea de vida o anclaje certificado.', 'Reportar de inmediato incidentes y condiciones adversas.', 'Suspender ante cambios de clima o inseguridad.'] },
    epp: ['Arnés de cuerpo completo', 'Línea de vida o cabo con absorbedor', 'Casco con barbiquejo', 'Guantes', 'Calzado antideslizante', 'Chaleco salvavidas sobre estructuras flotantes'],
    pasos: [{ t: 'Requisitos mínimos', l: ['Viento menor a 40 km/h.', 'Iluminación de al menos 300 lux.', 'Estructuras validadas con checklist.', 'Anclajes de 5.000 lb (22,2 kN) o certificados.', 'Supervisión directa durante toda la tarea.', 'Personal capacitado y con ficha médica vigente.'] },
      { t: 'Antes, durante y después', l: ['Antes: clima, área, anclajes, EPP, AST de altura y zona de caída de objetos delimitada.', 'Durante: siempre conectado, herramientas amarradas, comunicación constante.', 'Después: retirar equipos, inspeccionar y guardar el EPP, registrar observaciones.'] }],
    detener: ['Baja visibilidad: niebla espesa, lluvia intensa u oscuridad.', 'Maniobras de atraque o desatraque simultáneas.', 'Cambio súbito del clima.', 'EPP vencido o deteriorado.', 'Techumbres o pasillos frágiles sin evaluación.'],
    orden: ['Verificar clima, viento y visibilidad', 'Evaluar el área y los puntos de anclaje', 'Revisar el EPP y completar el AST de altura', 'Delimitar la zona de caída de objetos', 'Trabajar siempre conectado y con herramientas amarradas', 'Retirar equipos e inspeccionar el EPP'],
    quiz: [
      { p: '¿Con qué viento máximo se autoriza el trabajo en altura?', op: ['Menos de 40 km/h', 'Menos de 80 km/h', 'No importa', 'Menos de 100 km/h'], ok: 1 },
      { p: '¿Se puede trabajar en altura mientras la embarcación atraca?', op: ['Sí', 'No, está estrictamente prohibido', 'Solo si es rápido', 'Solo con casco'], ok: 2 },
      { p: '¿Qué pasa con un arnés que detuvo una caída?', op: ['Se sigue usando', 'Se retira de servicio de inmediato', 'Se lava', 'Se presta'], ok: 2 },
      { p: '¿Qué hay que tener disponible en faenas alejadas?', op: ['Un kit de rescate', 'Una radio de música', 'Nada', 'Solo agua'], ok: 1 },
      { p: '¿Cómo se trabaja con las herramientas en altura?', op: ['Sueltas en el bolsillo', 'Aseguradas con eslingas o cinturón porta-herramientas', 'En la mano sin amarrar', 'En el suelo'], ok: 2 }
    ] },
  'PTS-017': {
    objetivo: 'Izar y mover cargas con la grúa o brazo hidráulico y el winche de las embarcaciones según su capacidad certificada, las condiciones del mar y el clima.',
    alcance: ['Supervisor de faena, operador de grúa o winche, eslingador (rigger), tripulantes y operarios de apoyo.', 'Grúas HIAB 080 (Juan Eduardo), Bonfiglioli Z6400 (Yessica I), FASSI F95B (La Minga) y Palfinger PK 13.501 (Don Santiago).'],
    roles: { supervisor: ['Planificar, coordinar y autorizar la maniobra.', 'Definir la zona de exclusión y evaluar la línea de tensión.'], patron: ['Mantener la embarcación estable, sin desplazamiento durante el izaje.', 'Operar el equipo según el fabricante y su tabla de carga, si te corresponde.'], _: ['Mantener el área despejada y respetar la zona de exclusión.', 'No entrar en la línea de tensión.', 'No intervenir en la maniobra sin autorización.', 'Cualquier trabajador puede detener la maniobra si ve un riesgo.'] },
    epp: ['Casco con barbiquejo', 'Chaleco salvavidas en cubierta', 'Guantes antideslizantes y anticorte', 'Calzado de seguridad', 'Lentes de seguridad', 'Arnés si hay riesgo de caída'],
    pasos: [{ t: 'Antes del izaje', l: ['Evaluar clima y mar.', 'Conocer el peso de la carga y verificar que no supere la carga segura (SWL) según el alcance.', 'Definir el punto de izaje según el centro de gravedad.', 'Delimitar la zona de exclusión; AST y charla de coordinación.', 'Inspeccionar brazo, mangueras, controles, eslingas y grilletes. Con cualquier anomalía, no se inicia.'] },
      { t: 'Durante y al terminar', l: ['Levantar lento, progresivo y vertical, sin tirones.', 'Nunca pasar la carga sobre personas.', 'Usar cuerdas guía y patecas para evitar roces.', 'Al terminar: bajar controlado, liberar accesorios, retraer el brazo y registrar en bitácora.'] }],
    detener: ['Pérdida de control de la carga.', 'Condiciones climáticas adversas.', 'Fallas del equipo o ruido anormal.', 'Problemas de comunicación.', 'Comportamiento irregular del cable o cabo.'],
    orden: ['Evaluar clima, mar y peso de la carga', 'Delimitar la zona de exclusión y hacer el AST', 'Inspeccionar el equipo y los accesorios', 'Asegurar la carga y confirmar comunicación', 'Izar lento y controlado sin pasar sobre personas', 'Retraer el brazo y registrar en bitácora'],
    quiz: [
      { p: '¿Qué está prohibido durante cualquier izaje?', op: ['Usar casco', 'Pasar la carga sobre personas', 'Comunicarse por radio', 'Usar cuerdas guía'], ok: 2 },
      { p: '¿Qué es la línea de tensión?', op: ['Un cable eléctrico', 'La zona donde un cable en tensión puede golpear si se corta (efecto látigo)', 'La fila para embarcar', 'La línea de vida'], ok: 2 },
      { p: 'En la inspección previa detectas una eslinga cortada. ¿Qué haces?', op: ['La uso con cuidado', 'No se inicia la faena hasta reemplazarla', 'La amarro', 'La doy vuelta'], ok: 2 },
      { p: '¿Quién puede detener una maniobra si ve un riesgo?', op: ['Solo el supervisor', 'Cualquier trabajador', 'Solo el operador', 'Nadie'], ok: 2 },
      { p: '¿Con qué condiciones no se iza?', op: ['Vientos fuertes, marejada o visibilidad reducida', 'Día soleado', 'Con poca carga', 'En la mañana'], ok: 1 }
    ] },
  'PTS-021': {
    objetivo: 'Instalar, retirar y mantener bases, postes, arcos pajareros, yugos, cabos y redes pajareras de forma planificada, coordinada y controlada.',
    alcance: ['Manipulación manual de estructuras y trabajo sobre plataformas flotantes.', 'Trabajo en altura y cabos bajo tensión.', 'Uso de brazo hidráulico y winche.'],
    roles: { supervisor: ['Coordinar con el centro, hacer el AST y definir líneas de fuego y zonas de exclusión.', 'Verificar la dotación necesaria para cada etapa.', 'Suspender cuando las condiciones no permitan trabajar seguro.'], tripulante: ['Operador del brazo hidráulico o winche: operar solo con coordinación del supervisor o señalero y sin personas expuestas.'], _: ['Identificar y controlar las líneas de fuego.', 'Informar cualquier deterioro de bases, postes, yugos, cabos o grilletes.', 'Detener la maniobra ante pérdida de comunicación o condición insegura.'] },
    epp: ['Casco con barbiquejo', 'Guantes', 'Calzado de seguridad', 'Chaleco salvavidas o flotación personal', 'Arnés y protección contra caídas en altura'],
    pasos: [{ t: 'Antes de empezar', l: ['Coordinar con el responsable del centro e identificar jaula, módulo y sector.', 'AST con los trabajadores; revisar EPP, herramientas y accesorios.', 'Despejar cabos, mangueras y herramientas; definir un sector de acopio.', 'Identificar líneas de fuego y zonas de exclusión.', 'Verificar la dotación y las condiciones del mar y el clima.'] },
      { t: 'Arcos y cabos', l: ['El arco pajarero se levanta a mano con mínimo 4 trabajadores.', 'Las manos nunca entre el poste y la base.', 'Nadie bajo un arco, poste o yugo en movimiento.', 'No intervenir grilletes, pastecas ni cabos mientras están en tensión.', 'Mientras alguien esté conectado al cabo superior, nadie lo suelta ni modifica.'] }],
    detener: ['Viento, lluvia u oleaje que afecten la estabilidad.', 'Movimiento excesivo de las estructuras flotantes.', 'Visibilidad reducida.', 'Pérdida de comunicación o rotura de un accesorio.'],
    orden: ['Coordinar con el centro y hacer el AST', 'Despejar el área y definir el acopio', 'Identificar líneas de fuego y zonas de exclusión', 'Verificar la dotación mínima', 'Levantar el arco entre al menos 4 trabajadores', 'Revisión final y orden del área'],
    quiz: [
      { p: '¿Cuántos trabajadores se necesitan como mínimo para levantar a mano un arco pajarero?', op: ['2', '3', '4', '6'], ok: 3 },
      { p: '¿Qué está prohibido hacer con un cabo en tensión?', op: ['Mirarlo', 'Cortarlo o intervenir sus conexiones', 'Señalizarlo', 'Alejarse'], ok: 2 },
      { p: 'Un arco empieza a perder estabilidad. ¿Qué haces?', op: ['Lo sujeto con el cuerpo', 'Me alejo de la línea de fuego y aviso', 'Lo empujo', 'Me subo a la baranda'], ok: 2 },
      { p: '¿Dónde no deben ir nunca las manos al posicionar un poste?', op: ['En los guantes', 'Entre el poste y la base', 'En la baranda', 'En el bolsillo'], ok: 2 }
    ] },
  'PTS-022': {
    objetivo: 'Operar las embarcaciones de PyV de forma segura durante la navegación, el traslado de personal y materiales, el atraque y amarre, el apoyo a la faena y la permanencia a bordo durante el turno 14 x 14.',
    alcance: ['Inicio de turno, embarque, carga y estiba.', 'Zarpe, navegación, fondeo y pernocte en boya.', 'Atraque, amarre y traslado entre embarcación y módulos.', 'Brazo hidráulico, sala de máquinas, combustible y habitabilidad con GLP.'],
    roles: {
      supervisor: ['Eres el responsable de aplicar el PTS-022: firmas el checklist de inicio de turno con el Patrón y diriges el AST.', 'Verificas el EPP y llevas el recuento del personal en módulos.', 'Coordinas con el Patrón las maniobras de apoyo y suspendes la faena ante condiciones inseguras.', 'Completas el reporte de faena y el registro de hallazgos.'],
      patron: ['Decides el zarpe, la ruta, el fondeo y la suspensión de la navegación.', 'Completas el checklist de inicio de turno e informas a la dotación su puesto en el zafarrancho.', 'Diriges el atraque, el amarre y la estiba, y autorizas cada traslado de personas o carga.', 'Diriges las emergencias a bordo y eres el único que ordena el abandono.'],
      motorista: ['Revisas motor, aceite, refrigerante, combustible, baterías y achique antes de zarpar.', 'Solo tú o quien designe el Patrón entra a la sala de máquinas, con protección auditiva.', 'Cargas combustible con el motor detenido, sin fuentes de ignición y con extintor a mano.', 'Informas al Patrón cualquier falla, ruido o alarma.'],
      tripulante: ['Preparas cabos y defensas y apoyas el atraque, amarre y fondeo.', 'Eres vigía durante la navegación: avisas embarcaciones, boyas, objetos o cambios del tiempo.', 'Estibas y trincas la carga y mantienes la cubierta despejada.', 'Cumples tu puesto en el zafarrancho.'],
      asistente_admin: ['Visitas el muelle y subes a las embarcaciones atracadas para inspeccionarlas; no navegas.', 'Subes solo con la embarcación atracada y amarrada, con autorización del Patrón, de a uno y sin saltar.', 'Llevas chaleco salvavidas en el muelle y a bordo, y te mantienes lejos del borde, de los cabos y de las maniobras.', 'No subes con mal tiempo ni durante maniobras de carga o amarre.'],
      _: ['Llevas el chaleco salvavidas puesto en cubierta, en la navegación, en las maniobras y en los traslados.', 'Durante la navegación permaneces sentado o afirmado donde indique el Patrón.', 'Cruzas a los módulos solo con la embarcación amarrada, de a uno y con las manos libres.', 'Conoces tu puesto en el zafarrancho y dónde están chalecos, aros, balsa y extintores.'] },
    epp: ['Chaleco salvavidas', 'Calzado de seguridad antideslizante', 'Ropa de agua y ropa térmica en capas', 'Casco con barbiquejo en maniobras de carga e izaje', 'Guantes para cabos', 'Lentes con filtro UV y bloqueador solar', 'Protección auditiva en sala de máquinas'],
    pasos: [
      { t: 'Inicio de turno', l: ['Revisar pronóstico, avisos de mal tiempo y estado de puerto.', 'Completar el checklist de inicio de turno (Anexo G del PRRD) y firmarlo Patrón y Supervisor.', 'Si falla un elemento crítico, no se zarpa hasta corregirlo.', 'Informar a la dotación su puesto en el zafarrancho y la nómina a Operaciones.'] },
      { t: 'Embarque, carga y zarpe', l: ['Embarcar con chaleco y una mano libre para afirmarse.', 'Cargar respetando la capacidad, distribuir el peso y trincar la carga.', 'Combustibles, GLP y químicos en su lugar, lejos del calor.', 'Zarpar solo con toda la dotación a bordo, con chaleco y fuera de zonas de riesgo.'] },
      { t: 'Navegación', l: ['Velocidad según el mar, la visibilidad y el tráfico.', 'Vigía atento y escucha en VHF.', 'Personal sentado o afirmado; nadie en la proa ni en bordas sin baranda.', 'Si el tiempo empeora: reducir velocidad, buscar abrigo o regresar.'] },
      { t: 'Atraque, amarre y traslado', l: ['Aproximación a la velocidad mínima de gobierno, con defensas.', 'Los cabos se lanzan; nadie salta ni pone el cuerpo entre la embarcación y la estructura.', 'El Patrón confirma que la embarcación quedó firme antes de mover personas o carga.', 'Cruce de a uno, con chaleco y manos libres; las herramientas se pasan aparte.'] },
      { t: 'Apoyo, retorno y permanencia a bordo', l: ['Embarcación en posición segura con aro y bichero disponibles.', 'Recuento antes del retorno; pernocte en la boya o fondeo indicado.', 'Cocina a GLP solo con ventilación y vigilancia; válvula cerrada al terminar.', 'Respetar el descanso, cambiar la ropa mojada y mantener despejados salidas y equipos de emergencia.'] }],
    detener: ['Puerto cerrado o aviso de mal tiempo de la Autoridad Marítima.', 'Viento, oleaje o visibilidad que el Patrón evalúe como inseguros.', 'Falla de VHF, gobierno, motor, achique o equipos de salvamento.', 'Personas sin chaleco salvavidas o sin el EPP necesario.', 'Sismo que dificulte mantenerse en pie o alerta de tsunami.'],
    orden: ['Revisar pronóstico y estado de puerto', 'Completar y firmar el checklist de inicio de turno', 'Embarcar, cargar y trincar la carga', 'Zarpar con toda la dotación con chaleco', 'Navegar con vigía y escucha VHF', 'Atracar, amarrar y confirmar que la embarcación quedó firme', 'Trasladar al personal de a uno a los módulos'],
    quiz: [
      { p: '¿Qué pasa si en el checklist de inicio de turno falla el VHF o falta un chaleco?', op: ['Se zarpa igual y se arregla después', 'La embarcación no zarpa hasta corregirlo', 'Lo decide cada tripulante', 'Se avisa al final del turno'], ok: 2 },
      { p: 'Al atracar a un módulo, ¿cómo se pasa el cabo?', op: ['Saltando al módulo con el cabo', 'Se lanza el cabo, sin saltar ni poner el cuerpo entre la embarcación y la estructura', 'Se empuja el módulo con el pie', 'Se espera a tocar la estructura y se salta'], ok: 2 },
      { p: '¿Cuándo puedes cruzar de la embarcación a un módulo?', op: ['Apenas la embarcación se acerca', 'Cuando está amarrada y el Patrón lo autoriza, de a uno y con chaleco', 'Cuando quieras si llevas chaleco', 'Solo de noche'], ok: 2 },
      { p: '¿Cuál es la señal de abandono de la embarcación y quién la ordena?', op: ['Tres pitazos cortos, cualquier tripulante', 'Seis pitazos largos y seguidos, solo el Patrón', 'Una sirena continua, el Supervisor', 'Un aviso por radio, Operaciones'], ok: 2 },
      { p: 'La Autoridad Marítima declara puerto cerrado. ¿Qué se hace?', op: ['Se zarpa con precaución', 'No se zarpa', 'Se zarpa si el centro está cerca', 'Lo decide la mandante'], ok: 2 },
      { p: '¿Cómo se usa la cocina a GLP a bordo?', op: ['Encendida toda la noche para calefaccionar', 'Con ventilación, bajo vigilancia, con el cilindro sujeto y la válvula cerrada al terminar', 'Solo con las ventanas cerradas', 'Da igual mientras no haya olor'], ok: 2 }
    ] }
};
_PTS['PTS-022'].roles.jefe_finanzas = _PTS['PTS-022'].roles.asistente_admin;

Object.keys(_PTS).forEach(function (cod) {
  var P = _PTS[cod], id = cod.toLowerCase(), proc = CONTENIDO.procedimientos.filter(function (x) { return x.id === cod; })[0] || { claves: [], archivo: '' };
  CONTENIDO.lecciones[id + '.l1'] = function (cargo) {
    var rol = P.roles[cargo] || P.roles._ || [];
    return { documento: proc.archivo, diapositivas: [
      { t: 'Para qué sirve el ' + cod, x: P.objetivo, l: P.alcance },
      { t: 'Tu rol como ' + _nombreCargo(cargo), l: rol.concat(P.roles[cargo] && P.roles._ ? [] : []) },
      { t: 'EPP obligatorio', l: P.epp, tip: 'Revísalo antes de usarlo. Si está dañado, avisa y pide reposición.' }
    ].concat(P.pasos.map(function (s) { return { t: 'Paso a paso: ' + s.t.toLowerCase(), l: s.l }; }), [
      { t: 'Detén el trabajo si…', l: P.detener, tip: 'Cualquier trabajador puede detener una tarea ante un riesgo grave e inminente, avisando de inmediato.' },
      { t: 'Puntos clave', l: proc.claves.length ? proc.claves : P.detener }
    ]) };
  };
  CONTENIDO.lecciones[id + '.ld'] = function (cargo) {
    var d = [{ t: 'Quién participa en el ' + cod, x: 'Un procedimiento funciona cuando cada persona sabe qué le toca. Estas son las responsabilidades de cada cargo en esta tarea:' }];
    Object.keys(P.roles).filter(function (k) { return k !== '_'; }).forEach(function (k) {
      d.push({ t: (k === cargo ? 'Tú: ' : '') + _nombreCargo(k), l: P.roles[k], tip: k === cargo ? 'Esta es tu parte. Si no puedes cumplir alguno de estos puntos, avisa antes de empezar.' : undefined });
    });
    d.push({ t: 'Coordinación antes de empezar', l: ['Charla y AST con todo el equipo: tareas, riesgos, controles y señales de comunicación.', 'Permiso de trabajo firmado cuando la tarea lo exige (trabajo en caliente, altura, izaje, buceo).', 'Revisión de clima, equipos, EPP y condiciones del área.', 'Cada persona confirma que entendió su rol y que está en condiciones de trabajar.'] });
    if (proc.archivo) d.push({ t: 'Lee el documento completo', x: 'Abre el ' + cod + ' con el botón «Ver documento completo» y revisa con calma: alcance, definiciones, responsabilidades, desarrollo de la tarea y registros.', l: ['Fíjate en los pasos que te tocan a ti.', 'Busca los criterios para detener el trabajo.', 'Anota tus dudas para consultarlas a tu Supervisor o a Prevención de Riesgos.'], tip: 'El tiempo que pasas leyendo el documento con la cápsula abierta cuenta para tu registro.' });
    d.push({ t: 'Registros del procedimiento', l: ['AST o análisis seguro de trabajo de la jornada.', 'Permiso de trabajo cuando corresponde.', 'Checklist de equipos y EPP.', 'Registro de capacitación y de entrega de EPP.', 'Reporte de incidentes y condiciones inseguras.'] });
    return { documento: proc.archivo, diapositivas: d };
  };
  CONTENIDO.lecciones[id + '.lr'] = function (cargo) {
    var todos = _riesgosCargo(cargo), R = todos.filter(function (r) { return (r.pts || []).some(function (x) { return String(x).toUpperCase().indexOf(cod) >= 0; }); });
    if (R.length < 3) R = todos.filter(function (r) { return r.nivel >= 2; });
    R = R.slice().sort(function (a, b) { return b.nivel - a.nivel; }).slice(0, 14);
    var d = [{ t: 'Los riesgos de esta tarea', x: 'Según la Matriz IPER 2026 de PyV, al trabajar con el ' + cod + ' como ' + _nombreCargo(cargo) + ' te expones a estos riesgos. Para cada uno verás qué lo provoca, qué puede causar y cómo se controla.' }];
    R.forEach(function (r, i) {
      d.push({ t: (i + 1) + '. ' + r.riesgo + ' · ' + r.nivelTxt, x: 'Peligro: ' + _lista(r.peligros, 2).join(' / ') + '.\nPuede causar: ' + _lista(r.consecuencias, 1).join('') + '.',
        l: [].concat(_lista(r.ingenieria, 1).map(function (c) { return 'Ingeniería: ' + c; }), _lista(r.administrativo, 2).map(function (c) { return 'Administrativo: ' + c; }), r.eppItems && r.eppItems.length ? ['EPP: ' + r.eppItems.slice(0, 6).join(', ')] : []) });
    });
    d.push({ t: 'Recuerda', l: ['Los controles funcionan solo si están todos: si falta uno, la tarea no empieza.', 'Si ves un riesgo que no está en esta lista, avísalo: la Matriz se actualiza con lo que informan los trabajadores.'] });
    return { diapositivas: d };
  };
  CONTENIDO.juegos[id + '.j2'] = { intro: 'Durante el ' + cod + ' pasan cosas. Decide en cada caso si detienes el trabajo y avisas, o si puedes continuar.', partes: [{ tipo: 'clasificar',
    categorias: [{ id: 'det', nombre: 'Detengo y aviso' }, { id: 'sig', nombre: 'Puedo continuar' }],
    items: P.detener.slice(0, 5).map(function (x) { return { t: x.charAt(0).toUpperCase() + x.slice(1), c: 'det', fb: 'Es un criterio de detención del ' + cod + ': se detiene, se avisa y solo se reanuda cuando se corrige.' }; }).concat(
      [].concat.apply([], P.pasos.map(function (st) { return st.l.slice(0, 1); })).slice(0, 4).map(function (x) { return { t: 'Se cumple: ' + x.charAt(0).toLowerCase() + x.slice(1), c: 'sig', fb: 'Es parte normal del procedimiento: si se cumple, la tarea sigue.' }; })) }] };
  CONTENIDO.talleres[id + '.t1'] = function (cargo) {
    var paso = P.pasos[Math.min(1, P.pasos.length - 1)], det = P.detener[0] || 'falta un control crítico';
    return { intro: 'Aplica el ' + cod + ' a situaciones reales. Tus respuestas quedan registradas para Prevención de Riesgos.', partes: [
      { tipo: 'abierta', p: 'En la etapa «' + paso.t + '», ¿qué podría salir mal y qué haces tú para evitarlo, en tu rol de ' + _nombreCargo(cargo) + '?', min: 60, alApr: true,
        modelo: 'Una buena respuesta nombra un paso concreto (por ejemplo: ' + (paso.l[0] || '') + '), el riesgo si no se cumple y la acción que te corresponde: verificar, avisar o detener.' },
      { tipo: 'abierta', p: 'Estás en la faena y ocurre esto: «' + det + '». ¿Qué haces, a quién avisas y cuándo se puede reanudar el trabajo?', min: 50, alApr: true,
        modelo: 'Se detiene la tarea de inmediato, se avisa al Supervisor (y al Patrón si es a bordo), se corrige la condición y solo se reanuda cuando el Supervisor confirma que los controles están en su lugar.' },
      { tipo: 'vep', desdeIper: true, n: 2 },
      { tipo: 'abierta', p: '¿Qué parte del ' + cod + ' cuesta más cumplir en la práctica y qué propondrías para mejorarla?', min: 30, alApr: true,
        modelo: 'Gracias. Prevención de Riesgos revisa estas respuestas al actualizar el procedimiento.' }
    ] };
  };
  CONTENIDO.juegos[id + '.j1'] = { intro: 'Ordena los pasos principales del ' + cod + ', del primero al último.', partes: [{ tipo: 'ordenar', enunciado: 'Secuencia del ' + cod, items: P.orden, fb: 'Revisa el procedimiento completo si tuviste dudas.' }] };
  CONTENIDO.quiz[id] = { n: P.quiz.length, preguntas: P.quiz.map(function (q) { return { p: q.p, op: q.op, ok: q.ok, fbOk: 'Correcto.', fbNo: 'La respuesta correcta es: ' + q.op[q.ok - 1] + '.' }; }) };
  CONTENIDO.firmas[id + '.f1'] = function (cargo) {
    return { texto: 'Declaro que recibí, leí y comprendí el procedimiento ' + cod + ' de ' + CONTENIDO.empresa.nombre + ', sus riesgos, medidas de control, EPP y criterios de detención, y que me comprometo a cumplirlo en mi cargo de ' + _nombreCargo(cargo) + '.',
      lista: P.detener.map(function (d) { return ['Detener si', d]; }) };
  };
});

/* =====================================================================
   AMPLIACIÓN: MATRIZ IPER (90 min), PRRD, EPP Y ACCIDENTES (60 min)
   ===================================================================== */
CONTENIDO.juegos['iper.j1'] = CONTENIDO.juegos['ds44.j4'];
CONTENIDO.juegos['iper.j2'] = function (cargo) {
  var R = _riesgosCargo(cargo).slice(0, 12), it = [];
  R.slice(0, 5).forEach(function (r) { if (r.peligros[0]) it.push({ t: r.peligros[0], c: 'pel', fb: 'Es un peligro: la fuente o condición que puede causar daño.' }); });
  R.slice(0, 5).forEach(function (r) { it.push({ t: r.riesgo, c: 'rie', fb: 'Es un riesgo: la posibilidad de que el peligro te dañe (lo que puede pasar).' }); });
  return { intro: 'En la matriz, el peligro es la fuente del daño y el riesgo es lo que puede pasar. Clasifica estos textos reales de la Matriz IPER de tu cargo.', partes: [{ tipo: 'clasificar',
    categorias: [{ id: 'pel', nombre: 'Peligro' }, { id: 'rie', nombre: 'Riesgo' }], items: it }] };
};
CONTENIDO.lecciones['iper.l2'] = { diapositivas: [
  { t: 'Probabilidad (P)', x: '¿Qué tan seguido puede ocurrir?', l: ['Baja = 1: rara vez, mensual o menos.', 'Media = 2: varias veces, semanal.', 'Alta = 4: siempre o casi siempre, diario.'] },
  { t: 'Severidad (S)', x: '¿Qué tan grave sería el daño?', l: ['Ligeramente dañino = 1: lesiones superficiales, molestias.', 'Dañino = 2: laceraciones, quemaduras, esguinces, fracturas menores.', 'Extremadamente dañino = 4: lesiones graves, amputaciones, muerte.'] },
  { t: 'El nivel de riesgo: P × S', l: ['1 o 2 · Tolerable: se mantienen los controles.', '4 · Moderado: hay que reducirlo en un plazo definido.', '8 · Importante: no se empieza ni continúa hasta reducirlo.', '16 · Intolerable: no se empieza; si no se puede reducir, el trabajo se prohíbe.'], tip: 'Ejemplo: caída al agua en traslado, P 2 × S 4 = 8 Importante. Por eso el chaleco es obligatorio y no se transita por bordas sin baranda.' },
  { t: 'Riesgos que se evalúan con protocolo', x: 'Los riesgos de higiene, ergonómicos y psicosociales no se evalúan con P × S sino con su protocolo o guía:', l: ['Ruido: PREXOR.', 'Radiación UV de origen solar: guía técnica MINSAL.', 'Frío a la intemperie: Guía ISP 2026 (10 °C o menos con viento y lluvia).', 'Movimientos repetitivos: TMERT-EESS. Manejo manual de carga: Ley 20.949 y guía MMC.', 'Psicosociales: cuestionario CEAL-SM. Violencia y acoso: Ley Karin.', 'Químicos y biológicos: D.S. 594 y HDS.'] },
  { t: 'La jerarquía de controles', l: ['1. Eliminación: quitar el peligro.', '2. Sustitución: cambiarlo por algo menos peligroso.', '3. Ingeniería: barandas, resguardos, líneas de vida, ventilación.', '4. Señalización y advertencias.', '5. Administrativos: procedimientos, permisos, AST, capacitación, pausas.', '6. EPP: la última barrera.'], tip: 'La matriz de PyV tiene una columna para cada tipo de control. Si una columna dice «No aplica», el control descansa en las siguientes.' },
  { t: 'El riesgo residual', x: 'Es el riesgo que queda después de aplicar los controles. La matriz lo vuelve a evaluar con P × S.', l: ['Si el residual sigue Importante o Intolerable, los controles no bastan y se agregan medidas.', 'El residual solo es real si los controles se cumplen todos los días.', 'Por eso tú eres parte del control: si falta uno, la tarea no empieza.'] },
  { t: 'Cuándo se actualiza la matriz', l: ['Cuando cambian las tareas, los equipos, los lugares o los productos.', 'Después de un accidente o incidente relevante.', 'Cuando cambia la normativa (por ejemplo, la guía de frío del ISP de 2026).', 'Cuando los trabajadores informan riesgos nuevos.', 'Cada cambio queda en la hoja «Control de cambios».'] }
] };
CONTENIDO.lecciones['iper.lp'] = function (cargo) {
  var I = (window.PYV_IPER || {})[cargo] || { riesgos: [], procesos: [] }, d = [];
  d.push({ t: 'Tu cargo en la matriz', x: 'La Matriz IPER 2026 tiene ' + I.riesgos.length + ' riesgos para ' + _nombreCargo(cargo) + ', distribuidos en estos procesos:', l: (I.procesos || []).length ? I.procesos : ['Gestión administrativa y preventiva'] });
  (I.procesos || []).forEach(function (pr) {
    var R = I.riesgos.filter(function (r) { return (r.procesos || []).indexOf(pr) >= 0; }).sort(function (a, b) { return b.nivel - a.nivel; });
    var tareas = []; R.forEach(function (r) { (r.tareas || []).forEach(function (t) { if (tareas.indexOf(t) < 0) tareas.push(t); }); });
    d.push({ t: 'Proceso: ' + pr, x: 'Tareas de tu cargo en este proceso:', l: tareas.slice(0, 8) });
    d.push({ t: pr + ': riesgos principales', l: R.slice(0, 6).map(function (r) { return r.riesgo + ' · ' + r.nivelTxt + ' → ' + ([].concat(r.ingenieria, r.administrativo)[0] || 'ver controles'); }) });
  });
  d.push({ t: 'Cómo buscar tu tarea en la matriz', l: ['Filtra la columna «Puesto de trabajo» por tu cargo.', 'Busca tu tarea en la columna «Tarea».', 'Lee de izquierda a derecha: peligro, riesgo, consecuencias, evaluación, controles, EPP, procedimiento y riesgo residual.', 'Pide la matriz a Prevención de Riesgos: es un documento que tienes derecho a conocer.'] });
  return { diapositivas: d };
};
CONTENIDO.talleres['iper.t2'] = function (cargo) {
  var R = _riesgosCargo(cargo).filter(function (r) { return r.p && r.s; }); var r = R[0] || _riesgosCargo(cargo)[0] || { riesgo: '', peligros: [''], tareas: [''], consecuencias: [''], administrativo: [], eppItems: [] };
  return { intro: 'Vas a leer una fila real de la Matriz IPER de tu cargo y analizarla como lo haría el equipo de prevención.', partes: [
    { tipo: 'lectura', titulo: 'La fila', texto: 'Tarea: ' + (r.tareas[0] || '') + '\nPeligro: ' + (r.peligros[0] || '') + '\nRiesgo: ' + r.riesgo + '\nConsecuencias: ' + (r.consecuencias[0] || '') + (r.p ? '\nEvaluación: P ' + r.p + ' × S ' + r.s + ' = ' + (r.p * r.s) + ' (' + r.nivelTxt + ')' : '') + '\nControles: ' + [].concat(r.ingenieria, r.administrativo).slice(0, 3).join(' / ') + '\nEPP: ' + (r.eppItems || []).slice(0, 5).join(', ') },
    { tipo: 'abierta', p: '¿Por qué crees que la probabilidad y la severidad quedaron así? ¿Estás de acuerdo con lo que ves en tu trabajo real?', min: 50, alApr: true, modelo: 'Lo importante es contrastar la matriz con la realidad: si la tarea se hace más seguido o con más peligro del registrado, la evaluación debe revisarse.' },
    { tipo: 'abierta', p: '¿Qué control falta o no siempre se cumple en esta tarea? Propón una medida y di en qué nivel de la jerarquía está.', min: 50, alApr: true, modelo: 'Una buena propuesta prioriza eliminar o aislar el peligro (ingeniería) antes que depender solo de instrucciones o del EPP.' },
    { tipo: 'vep', desdeIper: true, n: 2 }
  ] };
};

CONTENIDO.lecciones['prrd.l2'] = { diapositivas: [
  { t: 'Emergencia médica o accidente grave', l: ['Alerta: avisar de inmediato al Supervisor, Patrón o encargado de oficina; detener la actividad y pedir apoyo en primeros auxilios.', 'Comunicación: Operaciones y Gerencia; ACHS 1404; en zona aislada, Autoridad Marítima 137 para la evacuación; en oficina, SAMU 131.', 'Coordinación: el Supervisor controla la faena, el Patrón mantiene la embarcación lista y entrega coordenadas.', 'Evaluar: conciencia, respiración, hemorragias, hipotermia, posición GPS y clima.', 'Decidir: atención en sitio o evacuación; derivación al Hospital de Puerto Aysén o ACHS Aysén.'] },
  { t: 'Hombre al agua', l: ['Quien ve la caída grita «¡Hombre al agua por babor/estribor!», no lo pierde de vista, lo señala y lanza un aro.', 'El Patrón activa el zafarrancho y marca la posición en el GPS; el Supervisor detiene los trabajos.', 'Nadie se lanza al agua sin chaleco y línea de vida.', 'Tras recuperarlo: conciencia, respiración, lesiones y tiempo en el agua (hipotermia).', 'Si no se recupera de inmediato: Autoridad Marítima por VHF canal 16 o 137 con la posición.'] },
  { t: 'Incendio a bordo', l: ['Quien detecte humo, fuego, olor anormal o fuga de GLP alerta al Patrón y a la dotación.', 'Se activa el zafarrancho de incendio: cierre de combustible y GLP, corte eléctrico, combate con extintores.', 'Incendio incipiente: combate inicial sin exponerse innecesariamente.', 'Incendio no controlable: se prepara el abandono, que solo ordena el Patrón.'] },
  { t: 'Incendio en faena (trabajo en caliente)', l: ['El soldador corta el equipo de inmediato; el vigía actúa con el extintor PQS.', 'Se retira a las personas del área y se avisa al Supervisor.', 'Se revisa el área al menos 30 minutos después de terminar el trabajo en caliente.'] },
  { t: 'Vía de agua, colisión o varada', l: ['Quien detecte ingreso de agua, escora anormal o falla de achique avisa al Patrón.', 'El Patrón dirige, el motorista interviene dentro de sus competencias y el Supervisor controla a la cuadrilla.', 'Ante riesgo para las personas: Autoridad Marítima con posición GPS.', 'Se activan los planes asociados: emergencia médica, incendio, derrame o abandono.'] },
  { t: 'Abandono de la embarcación', l: ['Es la última medida, cuando quedarse a bordo deja de ser seguro.', 'Señal: seis pitazos largos y seguidos. Solo la ordena el Patrón.', 'Todos con chaleco salvavidas al puesto de reunión; se prepara la balsa o el bote de servicio.', 'Llamada de socorro por VHF canal 16 o 137 con la posición.'] },
  { t: 'Temporal, viento y marejada', l: ['La gestión es preventiva: Patrón y Supervisor revisan pronósticos y avisos de la Autoridad Marítima antes y durante la jornada.', 'El Supervisor tiene autoridad para suspender la faena; el Patrón decide sobre la navegación.', 'Puerto cerrado o aviso de mal tiempo: no se zarpa.'] },
  { t: 'Sismo y tsunami', l: ['Si el sismo hace difícil mantenerse en pie: plan de tsunami de inmediato, sin esperar alerta.', 'En módulos: repliegue a la embarcación y salida a aguas profundas.', 'Navegando: alejarse de la costa a más de 150 m de profundidad; no entrar a puertos ni bahías.', 'En fiordos, un deslizamiento puede generar olas sin aviso.'] }
] };
CONTENIDO.lecciones['prrd.l3'] = function (cargo) {
  return { diapositivas: [
    { t: 'Tu rol como ' + _nombreCargo(cargo), l: CONTENIDO.rolEmergencia[cargo] || [] },
    { t: 'El método ACCEDER', x: 'Todos los planes de respuesta siguen los mismos pasos:', l: ['A · Alerta y alarma', 'C · Comunicación', 'C · Coordinación', 'E · Evaluación preliminar', 'D · Decisiones', 'E · Evaluación complementaria', 'R · Readecuación del plan'] },
    { t: 'Cómo se avisa', l: ['Quien detecta → Patrón, Supervisor o encargado → Operaciones y Gerencia → mandante.', 'Todo aviso dice: embarcación, posición GPS, tipo de emergencia, número de personas y lesionados, apoyo requerido.', 'Medios: VHF canal 16, celular y Starlink.', 'Solo alertas oficiales: SENAPRED, SHOA, Autoridad Marítima, SERNAGEOMIN.'] },
    { t: 'Recursos a bordo', l: ['Chalecos salvavidas (8 a 9 por embarcación), aros con rabiza y balsa para 10 personas.', 'Extintores, botiquín y bombas de achique.', 'Checklist de inicio de turno antes de zarpar.', 'Al menos un zafarrancho por turno y embarcación.'] },
    { t: 'Números de emergencia', l: (CONTENIDO.directorio || []).map(function (d) { return d.n + ': ' + d.t; }) }
  ] };
};
CONTENIDO.talleres['prrd.t1'] = function (cargo) {
  var ofi = PLAN.area(cargo) === 'oficina';
  return { intro: 'Simulacro de escritorio: lee cada situación y responde qué harías tú, según tu rol en el PRRD. Tus respuestas quedan registradas para Prevención de Riesgos.', partes: ofi ? [
    { tipo: 'lectura', titulo: 'Situación 1', texto: 'Son las 11:00 en la oficina de Las Rosas 121. Un sismo fuerte hace difícil mantenerse en pie y se corta la luz.' },
    { tipo: 'abierta', p: '¿Qué haces durante el sismo y después? ¿Dónde está la zona segura y a quién avisas?', min: 60, alApr: true, modelo: 'Agacharse, cubrirse y afirmarse lejos de ventanas y estanterías; terminado el movimiento, evacuar a la zona segura exterior, recontar a las personas y seguir solo alertas oficiales (SENAPRED, SHOA).' },
    { tipo: 'lectura', titulo: 'Situación 2', texto: 'Una embarcación llama por teléfono: un tripulante se lesionó en un centro alejado y necesitan apoyo.' },
    { tipo: 'abierta', p: '¿Qué datos pides y a quién informas?', min: 50, alApr: true, modelo: 'Embarcación, posición GPS, tipo de lesión, estado del lesionado, número de personas y apoyo requerido; informar a Operaciones, Gerencia y Prevención (ACHS 1404, Autoridad Marítima 137 si hay que evacuar).' }
  ] : [
    { tipo: 'lectura', titulo: 'Situación 1', texto: 'Regresan navegando a las 16:00 con viento fuerte. Un compañero que soltaba un cabo en la borda cae al agua por estribor.' },
    { tipo: 'abierta', p: 'Describe lo que haces en los primeros 2 minutos, según tu rol.', min: 70, alApr: true, modelo: 'Gritar «¡Hombre al agua por estribor!», no perderlo de vista y señalarlo, lanzar un aro; el Patrón activa el zafarrancho y marca el GPS; nadie se lanza sin chaleco y línea de vida; tras recuperarlo, abrigarlo y evaluar hipotermia.' },
    { tipo: 'lectura', titulo: 'Situación 2', texto: 'Trabajan en un módulo y sienten un sismo que hace difícil mantenerse en pie. No hay alerta oficial todavía.' },
    { tipo: 'abierta', p: '¿Qué hace la cuadrilla y hacia dónde va la embarcación?', min: 60, alApr: true, modelo: 'Se aplica el plan de tsunami de inmediato: repliegue a la embarcación, recuento y salida a aguas profundas (más de 150 m), sin entrar a puertos ni bahías; volver solo cuando la autoridad levante la alerta.' },
    { tipo: 'registro', titulo: 'Recursos de emergencia de tu embarcación', opciones: ['Lo sé', 'No estoy seguro'], items: ['Dónde están los chalecos salvavidas', 'Dónde están los aros y la balsa', 'Dónde están los extintores y cuál usar', 'Dónde está el botiquín', 'Cuál es la señal de abandono', 'Cuál es el punto de reunión a bordo'] }
  ] };
};

CONTENIDO.lecciones['epp.l2'] = function (cargo) {
  var R = _riesgosCargo(cargo).filter(function (r) { return r.eppItems && r.eppItems.length; }).sort(function (a, b) { return b.nivel - a.nivel; }).slice(0, 14);
  return { diapositivas: [{ t: 'Cada EPP tiene un porqué', x: 'Tu EPP sale de la Matriz IPER: cada elemento protege de un riesgo concreto de tu cargo de ' + _nombreCargo(cargo) + '.' }].concat(
    R.map(function (r) { return { t: r.riesgo, x: 'Puede causar: ' + _lista(r.consecuencias, 1).join('') + '.', l: r.eppItems.slice(0, 7).map(function (e) { return 'EPP: ' + e; }) }; }),
    [{ t: 'Recuerda', l: ['El EPP es la última barrera: no reemplaza los otros controles.', 'Usa el EPP certificado que entrega la empresa, no uno propio.', 'Si un EPP te incomoda o no te queda, avisa: hay otras tallas o modelos.'] }]) };
};
CONTENIDO.juegos['epp.j2'] = function (cargo) {
  var usados = {}, pares = [];
  _riesgosCargo(cargo).sort(function (a, b) { return b.nivel - a.nivel; }).forEach(function (r) {
    var e = (r.eppItems || []).filter(function (x) { return !usados[x.toLowerCase()]; })[0];
    if (e && pares.length < 6) { usados[e.toLowerCase()] = 1; pares.push({ a: r.riesgo, b: e }); }
  });
  return { intro: 'Une cada riesgo de tu cargo con un EPP que lo controla, según la Matriz IPER.', partes: [{ tipo: 'emparejar', pares: pares }] };
};
CONTENIDO.lecciones['epp.l3'] = { documento: 'pts/PTS-001.pdf', diapositivas: [
  { t: 'Chaleco salvavidas', l: ['Siempre puesto y abrochado sobre cubierta, muelles y módulos.', 'Revisa cierres, correas, cámara o flotación, silbato y luz.', 'Los autoinflables se revisan según el fabricante (cartucho y fecha).', 'No se usa como cojín ni se deja al sol o la lluvia.'] },
  { t: 'Casco, protección ocular y auditiva', l: ['Casco con barbiquejo ajustado; sin golpes, grietas ni decoloración.', 'Lentes o antiparras limpios y sin rayas que impidan ver.', 'Protector auditivo bien insertado o fonos bien sellados; se usa todo el tiempo de exposición.'] },
  { t: 'Guantes, calzado y ropa', l: ['Guantes adecuados al riesgo: cabos, químicos, soldadura o frío.', 'Calzado de seguridad antideslizante e impermeable, con suela en buen estado.', 'Ropa térmica e impermeable en capas; ropa ignífuga para trabajo en caliente.'] },
  { t: 'Protección respiratoria y química', l: ['Respirador con el filtro indicado por la HDS del producto o para humos metálicos.', 'Prueba de ajuste cada vez: sin barba en la zona de sellado.', 'Filtros reemplazados según el fabricante o cuando cuesta respirar.', 'EPP químico lavado y guardado separado de la ropa personal.'] },
  { t: 'Arnés y equipos anticaída', l: ['Inspección antes de cada uso: correas, costuras, hebillas, mosquetones y absorbedor.', 'Un arnés que soportó una caída se retira de uso.', 'Siempre anclado a un punto o línea de vida resistente.'] },
  { t: 'Cuidado y reposición', l: ['Limpiar y secar después de usar; guardar lejos del sol, combustibles y químicos.', 'Revisar antes de cada jornada.', 'Pedir reposición apenas se deteriora: es gratis y queda registrado.', 'El EPP dañado se entrega para su disposición final; no se repara de forma casera.'] }
] };

CONTENIDO.lecciones['acc.l2'] = { diapositivas: [
  { t: 'La DIAT', x: 'La Denuncia Individual de Accidente del Trabajo informa el accidente a la ACHS.', l: ['La hace la jefatura directa o el supervisor dentro de 24 horas desde que se conoce el accidente.', 'Si la empresa no la hace, pueden hacerla el propio trabajador, un familiar, un compañero, el Comité Paritario o el médico tratante.', 'Sin denuncia, la atención puede no quedar cubierta por el seguro.'] },
  { t: 'Accidente de trayecto', l: ['Es el que ocurre en el trayecto directo de ida o regreso entre la casa y el trabajo (Ley 16.744).', 'Se acredita con parte de Carabineros, testigos, certificado de atención u otros medios.', 'Avisa a tu jefatura y acude a la ACHS; la denuncia se hace igual que un accidente del trabajo.'] },
  { t: 'Tus derechos en la ACHS', l: ['Atención médica gratuita hasta la recuperación completa: consultas, exámenes, hospitalización, medicamentos, rehabilitación.', 'Subsidio por incapacidad temporal mientras dura el reposo.', 'Indemnización o pensión si queda una incapacidad permanente.', 'Si la ACHS califica tu caso como no laboral y no estás de acuerdo, puedes reclamar ante la SUSESO.'] },
  { t: 'Accidente grave y fatal: lo que hace la empresa', l: ['Suspende de inmediato la faena y acordona el área.', 'Notifica de inmediato a la Inspección del Trabajo y a la SEREMI de Salud, y avisa a la ACHS.', 'Envía la DIAT marcada como grave o fatal dentro de 24 horas.', 'Solo reanuda con autorización escrita de la autoridad.', 'Investiga con árbol de causas en un máximo de 30 días.'] }
] };
CONTENIDO.juegos['acc.j2'] = { intro: 'Ordena lo que se hace ante un accidente grave, del primer paso al último.', partes: [{ tipo: 'ordenar', enunciado: 'Accidente grave', items: ['Primeros auxilios y traslado del lesionado', 'Suspender la faena y acordonar el área', 'Notificar de inmediato a la Inspección del Trabajo y SEREMI de Salud', 'Enviar la DIAT marcada como grave dentro de 24 horas', 'Investigar con árbol de causas (máximo 30 días)', 'Reanudar solo con autorización escrita de la autoridad'], fb: 'Primero las personas; luego suspender, notificar, denunciar e investigar.' }] };
CONTENIDO.lecciones['acc.l3'] = { diapositivas: [
  { t: 'Para qué se investiga', x: 'La investigación busca causas, no culpables. Su objetivo es que el accidente no se repita.', l: ['Se investigan los accidentes y también los incidentes o casi accidentes relevantes.', 'Participan la jefatura, Prevención de Riesgos, el Delegado de SST y los involucrados.'] },
  { t: 'Los hechos', l: ['Se reconstruye lo que pasó: quién, qué, dónde, cuándo, cómo.', 'Se entrevista al accidentado y a los testigos por separado.', 'Se toman fotos, se revisan equipos, EPP, permisos y AST.', 'Solo hechos comprobados, sin opiniones ni juicios.'] },
  { t: 'El árbol de causas', x: 'Se parte del daño y se pregunta «¿qué fue necesario para que esto ocurriera?» hasta llegar a las causas de fondo.', l: ['Causas inmediatas: actos y condiciones (no usar línea de vida, baranda suelta).', 'Causas básicas: factores personales y del trabajo (falta de capacitación, mantención, supervisión, planificación).', 'Cada causa debe tener al menos una medida.'] },
  { t: 'Medidas y seguimiento', l: ['Medidas inmediatas dentro de 24 horas.', 'Medidas correctivas con responsable y plazo.', 'Se revisa la Matriz IPER y el procedimiento afectado.', 'El informe se guarda al menos 5 años a disposición de la autoridad.', 'Se comparten las lecciones aprendidas con todo el personal.'] }
] };
CONTENIDO.talleres['acc.t1'] = { intro: 'Investiga un caso simulado como lo haría el equipo. Tus respuestas quedan registradas para Prevención de Riesgos.', partes: [
  { tipo: 'lectura', titulo: 'El caso', texto: 'Durante el cierre de un centro, un tripulante pasaba un cabo desde el pasillo del módulo a la embarcación. El pasillo estaba mojado y sin baranda en ese tramo, porque ya se había retirado. Llevaba el chaleco puesto pero sin abrochar. Al tirar del cabo resbaló y cayó al agua. Fue recuperado en 3 minutos con hipotermia leve.\n\nEse día se había atrasado la faena por el clima y no se hizo la charla de inicio. Es un caso simulado.' },
  { tipo: 'abierta', p: '¿Cuáles fueron las causas inmediatas (actos y condiciones)?', min: 50, alApr: true, modelo: 'Pasillo mojado sin baranda; chaleco sin abrochar; tirar del cabo desde el borde sin línea de vida.' },
  { tipo: 'abierta', p: '¿Cuáles fueron las causas básicas (por qué existían esas condiciones)?', min: 50, alApr: true, modelo: 'Se retiraron las barandas sin reemplazar la protección; no se hizo la charla ni el AST por el atraso; presión por el clima y el plazo; falta de supervisión del uso correcto del chaleco.' },
  { tipo: 'abierta', p: 'Propón tres medidas, una de ellas de ingeniería, con responsable.', min: 60, alApr: true, modelo: 'Línea de vida provisoria al retirar barandas (ingeniería, Supervisor); AST obligatorio aunque haya atraso (administrativo, Supervisor); verificación de chalecos abrochados antes de cada maniobra (Patrón).' },
  { tipo: 'abierta', p: '¿Qué hubiera pasado sin chaleco? ¿Qué dice esto del valor del EPP?', min: 30, modelo: 'Sin chaleco la caída pudo ser fatal por el frío y el oleaje: el EPP salvó la vida, pero solo es la última barrera; las causas de fondo deben corregirse igual.' }
] };

/* =====================================================================
   MATRIZ IPER COMPLETA DEL CARGO Y TALLER DE PARTICIPACIÓN
   ===================================================================== */
CONTENIDO.lecciones['iper.lm'] = function (cargo) {
  var M = window.PYV_MATRIZ;
  if (!M) return { cargar: 'js/pyv_matriz.js', diapositivas: [{ t: 'Cargando tu matriz…', x: 'Un momento, estamos trayendo la Matriz IPER de tu cargo.' }] };
  var idx = M.cargos[cargo] || [], porTarea = {}, orden = [];
  idx.forEach(function (i) {
    var f = M.filas[i], k = f[0] + '||' + f[1];
    if (!porTarea[k]) { porTarea[k] = []; orden.push(k); }
    porTarea[k].push(f);
  });
  var d = [{ t: 'Esta es tu Matriz IPER', x: 'La Matriz IPER 2026 de PyV tiene ' + idx.length + ' filas que corresponden a tu cargo de ' + _nombreCargo(cargo) + ', en ' + orden.length + ' tareas. A continuación verás cada tarea con todos sus riesgos, tal como están en la matriz.\n\nEn cada riesgo lee: el peligro, lo que te puede pasar, cómo se evaluó, los controles que deben existir, tu EPP, el procedimiento y el riesgo que queda después de los controles.',
    tip: 'Mientras la recorres, piensa: ¿falta alguna tarea que haces?, ¿falta algún peligro?, ¿algún control no se cumple en la realidad? Al final hay un taller para que lo informes.' }];
  orden.forEach(function (k, n) {
    var F = porTarea[k];
    d.push({ t: (n + 1) + '. ' + F[0][1], x: 'Proceso: ' + F[0][0] + ' · ' + F.length + (F.length === 1 ? ' riesgo' : ' riesgos'),
      riesgos: F.map(function (f) {
        var nv = (f[11] || '').trim(); nv = nv.charAt(0).toUpperCase() + nv.slice(1).toLowerCase();
        return { t: f[4] + ' (' + f[2].toLowerCase() + ')', nivel: nv, f: [['Peligro', f[3]]].concat(f[5] ? [['Te puede pasar', f[5]]] : [], [['Evaluación inicial', f[6]]],
          f[7].map(function (c) { var i = c.indexOf(': '); return ['Control · ' + c.slice(0, i).toLowerCase(), c.slice(i + 2)]; }),
          f[8] ? [['EPP', f[8]]] : [], f[9] ? [['Procedimiento', f[9]]] : [], f[10] ? [['Riesgo residual', f[10]]] : []) };
      }) });
  });
  d.push({ t: 'Tu matriz es un documento vivo', l: ['Se actualiza cuando cambian las tareas, los equipos o los productos, después de un accidente y cuando cambia la normativa.', 'Tú conoces tu trabajo mejor que nadie: si algo falta o no se cumple, infórmalo a tu Supervisor, al Delegado de SST o a Prevención de Riesgos.', 'En el siguiente taller puedes dejar tus observaciones; llegan directamente a Prevención de Riesgos.', 'Puedes pedir la matriz completa de la empresa cuando quieras: es tu derecho conocerla.'] });
  return { documento: 'docs/Matriz_IPER_PYV_2026_v04.xlsx', diapositivas: d };
};
CONTENIDO.talleres['iper.t3'] = function (cargo) {
  return { intro: 'Ya conoces tu Matriz IPER completa. Ahora ayúdanos a mejorarla: tus respuestas llegan a Prevención de Riesgos y se revisan para la próxima actualización. No hay respuestas buenas o malas; si todo está bien, también sirve que lo digas.', partes: [
    { tipo: 'abierta', p: '¿Hay alguna tarea que haces en tu trabajo y que no aparece en tu matriz? Descríbela brevemente.', min: 10, alApr: true, modelo: 'Gracias. Prevención revisará si esa tarea debe agregarse a la matriz con sus riesgos y controles.' },
    { tipo: 'abierta', p: '¿Hay algún peligro o riesgo de tus tareas que no esté identificado o que creas que está mal evaluado (más o menos grave de lo que es)? ¿Cuál y por qué?', min: 20, alApr: true, modelo: 'Gracias. Un riesgo mal evaluado puede dejar controles insuficientes; tu observación se revisará con la matriz.' },
    { tipo: 'abierta', p: '¿Algún control o EPP de tu matriz no existe o no se cumple en la práctica? ¿Dónde y qué pasa?', min: 20, alApr: true, modelo: 'Gracias. Si un control no se cumple, el riesgo real es mayor al de la matriz: se revisará con tu jefatura.' },
    { tipo: 'abierta', p: '¿Qué medida propones para trabajar más seguro en tu cargo?', min: 20, alApr: true, modelo: 'Gracias por tu propuesta. Las mejores ideas vienen de quienes hacen el trabajo.' }
  ] };
};

/* =====================================================================
   LEY KARIN: DIFUSIÓN SEMESTRAL (art. 211-A Código del Trabajo, Ley N° 21.643)
   Los canales internos se ajustan en CONTENIDO.karin según el Protocolo vigente de PyV.
   ===================================================================== */
CONTENIDO.karin = {
  canalInterno: 'Por escrito o en forma verbal ante la Gerencia General de PyV o la persona designada en el Protocolo de prevención. Si la denuncia es verbal, se deja constancia en un acta que la persona denunciante firma.',
  canalDT: 'Directamente ante la Inspección del Trabajo, de forma presencial o en www.dt.gob.cl.',
  documento: ''
};
CONTENIDO.lecciones['karin.l1'] = { diapositivas: [
  { t: 'Ley Karin (Ley N° 21.643)', x: 'Desde agosto de 2024 todas las empresas deben prevenir, investigar y sancionar el acoso laboral, el acoso sexual y la violencia en el trabajo. La ley lleva el nombre de Karin Salgado, técnica en enfermería que falleció tras sufrir acoso laboral en su trabajo.', l: ['La empresa debe tener un protocolo de prevención y un procedimiento de investigación.', 'Cada seis meses debe informar a todos los trabajadores los canales de denuncia: esta difusión es esa obligación.', 'El trabajo debe ser un espacio libre de violencia, con respeto a la dignidad de todas las personas.'] },
  { t: 'Acoso laboral', x: 'Toda conducta que constituya agresión u hostigamiento, ejercida por el empleador o por uno o más trabajadores en contra de otro trabajador, y que tenga como resultado menoscabo, maltrato o humillación, o que amenace o perjudique su situación laboral o sus oportunidades de empleo.', l: ['Basta que ocurra una sola vez: no necesita ser repetida en el tiempo.', 'Ejemplos: gritos o insultos, burlas por la apariencia o el origen, aislar a alguien del grupo a propósito, dar tareas humillantes o imposibles, amenazas de despido sin motivo.'] },
  { t: 'Acoso sexual', x: 'Cuando una persona realiza, en forma indebida y por cualquier medio, requerimientos de carácter sexual no consentidos por quien los recibe, que amenacen o perjudiquen su situación laboral o sus oportunidades en el empleo.', l: ['Ejemplos: comentarios o bromas sexuales insistentes, mensajes o imágenes de contenido sexual, tocaciones no deseadas, insinuaciones a cambio de beneficios.', 'Puede ocurrir entre compañeros, de una jefatura o hacia una jefatura, y también por WhatsApp o redes sociales.'] },
  { t: 'Violencia en el trabajo ejercida por terceros', x: 'Conductas que afecten a las personas trabajadoras con ocasión de la prestación de servicios, por parte de clientes, proveedores, usuarios u otras personas ajenas a la empresa.', l: ['En PyV: personal de la empresa mandante, de otros contratistas o de proveedores en centros de cultivo, muelles u oficina.', 'Ejemplos: insultos o amenazas de personal externo, agresiones físicas, intimidación.'] },
  { t: 'Lo que no es acoso', l: ['Una instrucción de trabajo dada con respeto, aunque no nos guste.', 'Una corrección o una evaluación del desempeño fundada y respetuosa.', 'Un desacuerdo puntual entre compañeros que se conversa y se resuelve.', 'Igual, si una situación te afecta, puedes pedir orientación: es mejor consultar que callar.'] }
] };
CONTENIDO.juegos['karin.j1'] = { intro: 'Lee cada situación y clasifícala según la Ley Karin.', partes: [{ tipo: 'clasificar',
  categorias: [{ id: 'laboral', nombre: 'Acoso laboral' }, { id: 'sexual', nombre: 'Acoso sexual' }, { id: 'terceros', nombre: 'Violencia de terceros' }, { id: 'no', nombre: 'No es acoso' }], items: [
    { t: 'En el turno a bordo, un compañero se burla a diario del acento de otro frente a todos', c: 'laboral', fb: 'Hostigamiento que humilla: acoso laboral.' },
    { t: 'Un supervisor deja sin turno a un trabajador después de que este rechazó sus insinuaciones', c: 'sexual', fb: 'Requerimiento sexual no consentido que perjudica su situación laboral.' },
    { t: 'Personal de otra empresa en el centro insulta y amenaza a la cuadrilla de PyV', c: 'terceros', fb: 'Violencia ejercida por personas ajenas a PyV.' },
    { t: 'El Patrón ordena con respeto ponerse el chaleco antes de salir a cubierta', c: 'no', fb: 'Es una instrucción de seguridad legítima.' },
    { t: 'Envían por WhatsApp imágenes sexuales a una compañera que pidió que no lo hicieran', c: 'sexual', fb: 'Requerimiento de carácter sexual no consentido, por cualquier medio.' },
    { t: 'Al grupo le dicen que no le hablen ni le pasen herramientas a un compañero', c: 'laboral', fb: 'Aislar deliberadamente es una forma de hostigamiento.' },
    { t: 'La jefatura revisa con el trabajador un error en el registro y le explica cómo corregirlo', c: 'no', fb: 'Corrección fundada y respetuosa: no es acoso.' },
    { t: 'Un proveedor empuja y grita a la asistente en la oficina', c: 'terceros', fb: 'Agresión de una persona externa durante el trabajo.' }
  ] }] };
CONTENIDO.lecciones['karin.l2'] = { diapositivas: [
  { t: 'El protocolo de prevención de PyV', x: 'PyV tiene un protocolo de prevención del acoso laboral, sexual y la violencia en el trabajo que forma parte del Reglamento Interno. Sus objetivos:', l: ['Identificar los factores de riesgo y gestionarlos (la Matriz IPER los incluye para todos los cargos).', 'Informar y capacitar a todas las personas trabajadoras.', 'Recibir, investigar y sancionar las denuncias con reserva y sin represalias.', 'Evaluar los riesgos psicosociales con el cuestionario CEAL-SM.'] },
  { t: 'Factores de riesgo en nuestro trabajo', l: ['Turnos 14 x 14 con convivencia a bordo en espacios reducidos.', 'Trabajo en zonas aisladas, lejos de la jefatura y de redes de apoyo.', 'Presión por plazos, clima y coordinación con la mandante y otros contratistas.', 'Grupos de trabajo pequeños donde un conflicto escala rápido.', 'Comunicación por WhatsApp y redes, también fuera del horario.'] },
  { t: 'Medidas de prevención', l: ['Trato respetuoso como regla para todos, sin importar el cargo.', 'Convivencia a bordo según el Reglamento Interno: descanso, turnos de cocina y orden acordados.', 'Jefaturas que corrigen en privado y con respeto.', 'Cero tolerancia a bromas o comentarios sexuales, racistas u ofensivos.', 'Si ves una situación de acoso, no la normalices: apoya a la persona e infórmala.'] },
  { t: 'Tus derechos y deberes', l: ['Derecho a trabajar en un ambiente libre de violencia y acoso.', 'Derecho a denunciar, a que se investigue con reserva y a no sufrir represalias por denunciar o declarar como testigo.', 'Derecho a atención psicológica temprana a través de la ACHS.', 'Deber de tratar con respeto a compañeros, jefaturas y personas externas.', 'Deber de colaborar con la investigación y decir la verdad.'] }
] };
CONTENIDO.lecciones['karin.l3'] = function () {
  var K = CONTENIDO.karin;
  return { documento: K.documento || '', diapositivas: [
    { t: 'Dónde denunciar', x: 'Puedes elegir cualquiera de estos canales:', l: ['Dentro de la empresa: ' + K.canalInterno, 'Fuera de la empresa: ' + K.canalDT], tip: 'Esta información se entrega cada seis meses a todos los trabajadores, como exige el artículo 211-A del Código del Trabajo.' },
    { t: 'Qué debe contener la denuncia', l: ['Quién denuncia y a quién se denuncia (nombre y cargo, si lo conoces).', 'Qué pasó, dónde y cuándo, con el mayor detalle posible.', 'Si hubo testigos o existen pruebas (mensajes, fotos, audios).', 'No necesitas tener todas las pruebas: basta con relatar los hechos.'] },
    { t: 'Qué pasa después de denunciar', l: ['De inmediato: la empresa adopta medidas de resguardo, como separar los espacios de trabajo o cambiar los turnos, y deriva a atención psicológica temprana en la ACHS.', 'Dentro de 3 días hábiles: la empresa decide si investiga internamente o envía la denuncia a la Inspección del Trabajo, e informa a la Inspección.', 'Hasta 30 días: dura la investigación; ambas partes son escuchadas y pueden presentar pruebas.', 'Al terminar: el informe se remite a la Inspección del Trabajo, y la empresa aplica las medidas y sanciones dentro de los 15 días siguientes.'] },
    { t: 'Tu protección', l: ['La investigación es reservada: se protege la identidad, la privacidad y la honra de todas las personas involucradas.', 'Está prohibido tomar represalias contra quien denuncia o declara como testigo.', 'Las medidas de resguardo no pueden perjudicar a la persona denunciante.', 'Si la situación te afecta emocionalmente, puedes pedir atención psicológica en la ACHS.'] }
  ] };
};
CONTENIDO.juegos['karin.j2'] = { intro: 'Ordena lo que ocurre desde que se presenta una denuncia.', partes: [{ tipo: 'ordenar', enunciado: 'Procedimiento de denuncia', items: ['La persona presenta la denuncia por escrito o verbal (con acta)', 'La empresa adopta medidas de resguardo y deriva a atención psicológica temprana', 'Dentro de 3 días hábiles se decide investigar internamente o derivar a la Inspección del Trabajo', 'Se investiga con reserva, escuchando a ambas partes (hasta 30 días)', 'Se envía el informe a la Inspección del Trabajo', 'La empresa aplica medidas y sanciones dentro de 15 días'], fb: 'Primero la denuncia y el resguardo; luego investigación, informe y medidas.' }] };
CONTENIDO.talleres['karin.t1'] = function (cargo) {
  var ofi = PLAN.area(cargo) === 'oficina';
  return { intro: 'Lee cada caso y responde qué harías. Tus respuestas son reservadas y solo las ve Prevención de Riesgos.', partes: [
    { tipo: 'lectura', titulo: 'Caso 1', texto: ofi ? 'En la oficina, un compañero comenta cada día el físico de una colega y le envía mensajes fuera del horario. Ella le pidió que parara y él dice que es una broma.' : 'En el día 6 del turno a bordo, dos tripulantes empiezan a burlarse de un compañero nuevo: lo dejan fuera de la cocina, esconden su ropa de agua y lo graban para subirlo a un grupo.' },
    { tipo: 'abierta', p: '¿Qué tipo de conducta es y qué harías tú si fueras testigo?', min: 40, alApr: true, modelo: ofi ? 'Es acoso sexual: requerimientos de carácter sexual no consentidos, por cualquier medio. Como testigo puedes apoyar a la colega, no reírte de la "broma" y orientarla a denunciar; también puedes informar la situación.' : 'Es acoso laboral: hostigamiento que humilla y aísla. Como testigo no participes ni lo normalices, apoya al compañero e informa al Supervisor o por los canales de denuncia.' },
    { tipo: 'lectura', titulo: 'Caso 2', texto: 'Una persona de otra empresa en el muelle grita e insulta a un trabajador de PyV porque la maniobra se atrasó, y lo amenaza con "hacerlo echar".' },
    { tipo: 'abierta', p: '¿Cómo se llama esta situación según la ley y qué debería hacer el trabajador?', min: 40, alApr: true, modelo: 'Es violencia en el trabajo ejercida por terceros. Debe alejarse si hay riesgo, informar a su jefatura y puede denunciar por los canales internos o ante la Inspección del Trabajo; la empresa debe adoptar medidas para protegerlo.' },
    { tipo: 'abierta', p: '¿Qué medida propones para mejorar la convivencia y el buen trato en tu lugar de trabajo?', min: 20, alApr: true, modelo: 'Gracias. Tus propuestas ayudan a actualizar el protocolo de prevención.' }
  ] };
};
CONTENIDO.quiz.karin = { n: 6, preguntas: [
  { p: '¿Cada cuánto debe la empresa informar los canales de denuncia de la Ley Karin?', op: ['Una vez al ingresar', 'Cada seis meses', 'Cada dos años', 'Solo si hay una denuncia'], ok: 2, fbOk: 'Correcto: es una difusión semestral obligatoria.', fbNo: 'El artículo 211-A del Código del Trabajo exige informarlos semestralmente.' },
  { p: 'Para que exista acoso laboral, ¿la conducta debe repetirse?', op: ['Sí, al menos tres veces', 'No, basta que ocurra una vez', 'Solo si dura un mes', 'Solo si la hace una jefatura'], ok: 2, fbOk: 'Correcto.', fbNo: 'Con la Ley Karin basta una sola conducta que produzca menoscabo, maltrato o humillación.' },
  { p: '¿Dónde puedes presentar una denuncia?', op: ['Solo ante Carabineros', 'Ante la empresa o directamente ante la Inspección del Trabajo', 'Solo ante la mandante', 'Solo por escrito al Gerente'], ok: 2, fbOk: 'Correcto: puedes elegir el canal.', fbNo: 'Puedes denunciar dentro de la empresa o directamente ante la Inspección del Trabajo.' },
  { p: '¿Qué hace la empresa de inmediato al recibir una denuncia?', op: ['Despide al denunciado', 'Adopta medidas de resguardo y deriva a atención psicológica temprana', 'Espera el fin de la investigación', 'Pide que lo resuelvan entre ellos'], ok: 2, fbOk: 'Correcto.', fbNo: 'Las medidas de resguardo y la atención psicológica temprana se activan de inmediato.' },
  { p: 'Un trabajador declara como testigo en una investigación. ¿Lo pueden castigar por eso?', op: ['Sí, si el denunciado es su jefe', 'No, están prohibidas las represalias', 'Solo si declara algo falso', 'Depende del cargo'], ok: 2, fbOk: 'Correcto.', fbNo: 'Están prohibidas las represalias contra quien denuncia o declara.' },
  { p: 'Personal de una empresa externa insulta y amenaza a un trabajador de PyV en el centro. ¿Qué es?', op: ['Un conflicto sin importancia', 'Violencia en el trabajo ejercida por terceros', 'Acoso sexual', 'Nada, porque no es de PyV'], ok: 2, fbOk: 'Correcto.', fbNo: 'La ley protege también frente a la violencia de personas ajenas a la empresa.' },
  { p: '¿Cuánto dura como máximo la investigación?', op: ['5 días', '30 días', '6 meses', 'No tiene plazo'], ok: 2, fbOk: 'Correcto.', fbNo: 'La investigación debe terminar en un plazo de 30 días.' },
  { p: 'Un compañero envía bromas sexuales por WhatsApp a una colega que le pidió parar. ¿Qué es?', op: ['Libertad de expresión', 'Acoso sexual', 'Acoso laboral', 'No es acoso porque es fuera del trabajo'], ok: 2, fbOk: 'Correcto: puede ser por cualquier medio.', fbNo: 'Son requerimientos de carácter sexual no consentidos, por cualquier medio.' }
] };
CONTENIDO.firmas['karin.f1'] = function () { return { texto: 'Declaro haber recibido la difusión semestral del Protocolo de prevención del acoso laboral, sexual y la violencia en el trabajo de ' + CONTENIDO.empresa.nombre + ', conforme al artículo 211-A del Código del Trabajo (Ley N° 21.643), y conocer los canales para presentar una denuncia: ' + CONTENIDO.karin.canalInterno + ' ' + CONTENIDO.karin.canalDT }; };
