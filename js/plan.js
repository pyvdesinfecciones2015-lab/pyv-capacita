/* PyV Capacita — catálogo de cursos (compartido entre la app y el servidor).
   Si cambias algo aquí, pega el mismo contenido en Plan.gs del Apps Script. */
var PLAN = {
  version: '2026.11c',
  notaAprobacion: 0.7,

  /* area: faena (embarcación y módulos), oficina (Las Rosas 121) o mixto (oficina y visitas a faena) */
  cargos: [
    { id: 'patron', nombre: 'Patrón de nave', area: 'faena' },
    { id: 'motorista', nombre: 'Motorista', area: 'faena' },
    { id: 'tripulante', nombre: 'Tripulante', area: 'faena' },
    { id: 'supervisor', nombre: 'Supervisor de faena', area: 'faena' },
    { id: 'soldador', nombre: 'Soldador', area: 'faena' },
    { id: 'operario', nombre: 'Operario', area: 'faena' },
    { id: 'operario_agua', nombre: 'Operario en agua', area: 'faena' },
    { id: 'buzo', nombre: 'Buzo', area: 'faena' },
    { id: 'buzo_supervisor', nombre: 'Buzo supervisor', area: 'faena' },
    { id: 'gerente_general', nombre: 'Gerente general', area: 'mixto' },
    { id: 'jefe_operaciones', nombre: 'Jefe de operaciones', area: 'mixto' },
    { id: 'prevencion', nombre: 'Prevención de riesgos', area: 'mixto' },
    { id: 'jefe_finanzas', nombre: 'Jefe de finanzas', area: 'oficina' },
    { id: 'asistente_admin', nombre: 'Asistente administrativo', area: 'oficina' },
    { id: 'auxiliar_aseo', nombre: 'Auxiliar de aseo', area: 'oficina' }
  ],

  /* Cursos. doc: 'certificado' o 'constancia'. vigenciaMeses: 0 = sin vencimiento. plazoMeses: 0 = sin plazo.
     Etapas: manual | scorm | juego | quiz | pyv | taller | leccion | firma | encuesta | sesiones.
     minMin = minutos mínimos de permanencia real para dar la etapa por completada. */
  cursos: [
    { id: 'ds44', titulo: 'Curso obligatorio de prevención de riesgos', sub: 'Art. 16 D.S. 44 · 8 horas · Res. Ex. 1117/2026', obligatorio: true,
      horas: 8, duracionMin: 480, doc: 'certificado', vigenciaMeses: 12, plazoMeses: 3, cargos: '*',
      contenidos: 'Derechos y obligaciones (Ley 16.744 y D.S. 44) · Identificación de peligros y MIPER · Efectos en la salud · Medidas de control · Emergencias y desastres · Señalización · Incendios y extintores · Riesgos del cargo en PyV · Talleres prácticos',
      modulos: [
        { n: 0, titulo: 'Inicio' }, { n: 1, titulo: 'Módulo 1 · Derechos y obligaciones' }, { n: 2, titulo: 'Módulo 2 · Identificación de peligros' },
        { n: 3, titulo: 'Módulo 3 · Efectos en la salud' }, { n: 4, titulo: 'Módulo 4 · Medidas de control' }, { n: 5, titulo: 'Módulo 5 · Emergencias y desastres' },
        { n: 6, titulo: 'Módulo 6 · Señalización' }, { n: 7, titulo: 'Módulo 7 · Incendios y extintores' }, { n: 8, titulo: 'A bordo con PyV' }, { n: 9, titulo: 'Cierre del curso' }],
      etapas: [
        { id: 'manual', tipo: 'manual', titulo: 'Manual del participante', modulo: 0 },
        { id: 'm0', tipo: 'scorm', titulo: 'Bienvenida al curso', modulo: 0, carpeta: 'm0', minMin: 5 },
        { id: 'm1', tipo: 'scorm', titulo: 'Derechos, obligaciones y Ley 16.744', modulo: 1, carpeta: 'm1', minMin: 28 },
        { id: 'j1', tipo: 'juego', titulo: '¿Derecho u obligación?', modulo: 1 },
        { id: 't1', tipo: 'taller', titulo: 'Taller: el caso de Juan', modulo: 1, minMin: 20 },
        { id: 'q1', tipo: 'quiz', titulo: 'Evaluación módulo 1', modulo: 1, banco: 'm1' },
        { id: 'm2', tipo: 'scorm', titulo: 'Peligros y evaluación de riesgos', modulo: 2, carpeta: 'm2', minMin: 16 },
        { id: 'j2', tipo: 'juego', titulo: 'Encuentra el peligro a bordo', modulo: 2 },
        { id: 't2', tipo: 'taller', titulo: 'Taller: tu propia MIPER y mapa de riesgos', modulo: 2, minMin: 25 },
        { id: 'q2', tipo: 'quiz', titulo: 'Evaluación módulo 2', modulo: 2, banco: 'm2' },
        { id: 'm3', tipo: 'scorm', titulo: 'Efectos en la salud y enfermedades profesionales', modulo: 3, carpeta: 'm3', minMin: 18 },
        { id: 'j3', tipo: 'juego', titulo: 'Peligro y efecto', modulo: 3 },
        { id: 'q3', tipo: 'quiz', titulo: 'Evaluación módulo 3', modulo: 3, banco: 'm3' },
        { id: 'm4', tipo: 'scorm', titulo: 'Medidas de control', modulo: 4, carpeta: 'm4', minMin: 20 },
        { id: 'j4', tipo: 'juego', titulo: 'Ordena los controles', modulo: 4 },
        { id: 't3', tipo: 'taller', titulo: 'Taller: personas especialmente sensibles', modulo: 4, minMin: 20 },
        { id: 'q4', tipo: 'quiz', titulo: 'Evaluación módulo 4', modulo: 4, banco: 'm4' },
        { id: 'm5', tipo: 'scorm', titulo: 'Emergencias, catástrofes y desastres', modulo: 5, carpeta: 'm5', minMin: 11 },
        { id: 'j5', tipo: 'juego', titulo: '¿Qué haces? Emergencias PyV', modulo: 5 },
        { id: 'q5', tipo: 'quiz', titulo: 'Evaluación módulo 5', modulo: 5, banco: 'm5' },
        { id: 'm6', tipo: 'scorm', titulo: 'Señalización de seguridad', modulo: 6, carpeta: 'm6', minMin: 13 },
        { id: 'j6', tipo: 'juego', titulo: 'Lee la señal', modulo: 6 },
        { id: 'q6', tipo: 'quiz', titulo: 'Evaluación módulo 6', modulo: 6, banco: 'm6' },
        { id: 'm7', tipo: 'scorm', titulo: 'Prevención de incendios y extintores', modulo: 7, carpeta: 'm7', minMin: 11 },
        { id: 'j7', tipo: 'juego', titulo: 'El extintor correcto', modulo: 7 },
        { id: 't4', tipo: 'taller', titulo: 'Taller: detectives de seguridad', modulo: 7, minMin: 20 },
        { id: 'q7', tipo: 'quiz', titulo: 'Evaluación módulo 7', modulo: 7, banco: 'm7' },
        { id: 'pyv', tipo: 'pyv', titulo: 'A bordo con PyV: tu cargo', modulo: 8, minMin: 8 },
        { id: 'pyv_j', tipo: 'juego', titulo: 'Chequeo antes de zarpar', tituloOficina: 'La oficina preparada para emergencias', modulo: 8 },
        { id: 'pyv_q', tipo: 'quiz', titulo: 'Evaluación A bordo con PyV', modulo: 8, banco: 'pyv' },
        { id: 'final', tipo: 'quiz', titulo: 'Evaluación final', modulo: 9, banco: 'final' },
        { id: 'sesiones', tipo: 'sesiones', titulo: 'Sesiones con la facilitadora', modulo: 9 },
        { id: 'encuesta', tipo: 'encuesta', titulo: 'Encuesta de satisfacción', modulo: 9 }
      ] },

    { id: 'irl', titulo: 'Los riesgos de tu cargo (IRL)', sub: 'Obligación de informar · art. 15 D.S. 44', obligatorio: true,
      horas: 3, duracionMin: 180, doc: 'certificado', vigenciaMeses: 12, plazoMeses: 0, cargos: '*',
      contenidos: 'Características del lugar de trabajo, equipos y orden y aseo · Riesgos del cargo según la Matriz IPER · Evaluación P × S · Jerarquía de controles y métodos de trabajo correctos · Procedimientos del cargo · Productos y sustancias peligrosas (HDS y SGA) · Exposición a frío a la intemperie (Guía ISP 2026) · Rol en emergencias (PRRD) · EPP · Procedimiento ante accidentes · Derechos y obligaciones',
      etapas: [
        { id: 'l1', tipo: 'leccion', titulo: 'Cápsula 1: tu derecho a saber', minMin: 10 },
        { id: 'lw', tipo: 'leccion', titulo: 'Cápsula 2: tu lugar de trabajo', minMin: 15 },
        { id: 'l2', tipo: 'leccion', titulo: 'Cápsula 3: cada riesgo de tu cargo, uno por uno', minMin: 25 },
        { id: 'j1', tipo: 'juego', titulo: 'Riesgo y consecuencia' },
        { id: 't1', tipo: 'taller', titulo: 'Taller: los riesgos de mi puesto', minMin: 20 },
        { id: 'l3', tipo: 'leccion', titulo: 'Cápsula 4: cómo se controlan y cómo trabajar bien', minMin: 25 },
        { id: 'j2', tipo: 'juego', titulo: 'Ordena los controles' },
        { id: 'ls', tipo: 'leccion', titulo: 'Cápsula 5: productos y sustancias peligrosas', minMin: 10 },
        { id: 'lf', tipo: 'leccion', titulo: 'Cápsula 6: exposición a frío', minMin: 10 },
        { id: 'js', tipo: 'juego', titulo: 'Pictogramas de peligro' },
        { id: 'l4', tipo: 'leccion', titulo: 'Cápsula 7: emergencias en PyV y tu rol', minMin: 15 },
        { id: 'j3', tipo: 'juego', titulo: '¿Qué hago si…? Emergencias' },
        { id: 'l5', tipo: 'leccion', titulo: 'Cápsula 8: tu EPP y qué hacer ante un accidente', minMin: 15 },
        { id: 'j4', tipo: 'juego', titulo: 'Derechos y obligaciones' },
        { id: 't2', tipo: 'taller', titulo: 'Taller final: mi compromiso de seguridad', minMin: 10 },
        { id: 'q1', tipo: 'quiz', titulo: 'Evaluación', banco: 'pyv' },
        { id: 'f1', tipo: 'firma', titulo: 'Firma de recepción de la IRL' }
      ] },

    { id: 'iper', titulo: 'Matriz IPER de PyV: conócela y participa', sub: 'Tu matriz completa, cómo se lee y cómo proponer cambios',
      horas: 2, duracionMin: 120, doc: 'certificado', vigenciaMeses: 12, plazoMeses: 0, cargos: '*',
      contenidos: 'Matriz IPER completa del cargo, tarea por tarea · Participación en su actualización · Estructura de la Matriz IPER · Peligro y riesgo · Evaluación P × S y niveles · Protocolos MINSAL e ISP · Jerarquía de controles · Riesgo residual · La matriz de los procesos y tareas del cargo',
      etapas: [
        { id: 'l1', tipo: 'leccion', titulo: 'Cápsula 1: cómo se lee la matriz', minMin: 10 },
        { id: 'j2', tipo: 'juego', titulo: '¿Peligro o riesgo?' },
        { id: 'l2', tipo: 'leccion', titulo: 'Cápsula 2: evaluar, controlar y el riesgo residual', minMin: 10 },
        { id: 'j1', tipo: 'juego', titulo: 'Clasifica y ordena los controles' },
        { id: 'lp', tipo: 'leccion', titulo: 'Cápsula 3: tus procesos y tareas en la matriz', minMin: 10 },
        { id: 'lm', tipo: 'leccion', titulo: 'Cápsula 4: tu Matriz IPER completa, tarea por tarea', minMin: 25 },
        { id: 't1', tipo: 'taller', titulo: 'Taller: evalúa tres riesgos reales', minMin: 12 },
        { id: 't2', tipo: 'taller', titulo: 'Taller: lee una fila completa de la matriz', minMin: 15 },
        { id: 't3', tipo: 'taller', titulo: 'Taller: ¿qué falta o qué cambiarías en tu matriz?', minMin: 12 },
        { id: 'q1', tipo: 'quiz', titulo: 'Evaluación', banco: 'iper' }
      ] },

    { id: 'prrd', titulo: 'Emergencias y desastres en PyV', sub: 'Plan para la Reducción del Riesgo de Desastres 2026',
      horas: 1, duracionMin: 60, doc: 'certificado', vigenciaMeses: 12, plazoMeses: 0, cargos: '*',
      contenidos: 'Amenazas por escenario · Organización y roles · Alerta y comunicación · Planes de respuesta ACCEDER · Tsunami y sismo en fiordos · Directorio',
      etapas: [
        { id: 'l1', tipo: 'leccion', titulo: 'Cápsula 1: el plan de emergencias de PyV', minMin: 8 },
        { id: 'l2', tipo: 'leccion', titulo: 'Cápsula 2: los planes de respuesta paso a paso', minMin: 12 },
        { id: 'j1', tipo: 'juego', titulo: '¿Qué haces? Situaciones del plan' },
        { id: 'l3', tipo: 'leccion', titulo: 'Cápsula 3: tu rol, recursos y comunicaciones', minMin: 8 },
        { id: 'j2', tipo: 'juego', titulo: 'Chequeo de recursos de emergencia' },
        { id: 't1', tipo: 'taller', titulo: 'Taller: simulacro de escritorio', minMin: 12 },
        { id: 'q1', tipo: 'quiz', titulo: 'Evaluación', banco: 'prrd' }
      ] },

    { id: 'epp', titulo: 'EPP: uso, cuidado y reposición', sub: 'PTS-001 · capacitación mínima de 1 hora',
      horas: 1, duracionMin: 60, doc: 'certificado', vigenciaMeses: 12, plazoMeses: 0, cargos: '*',
      contenidos: 'Gestión del EPP en 8 etapas · EPP según los riesgos del cargo (Matriz IPER) · Uso, ajuste y cuidado · Criterios de reposición · Disposición final',
      etapas: [
        { id: 'l1', tipo: 'leccion', titulo: 'Cápsula 1: tu EPP de principio a fin', minMin: 10 },
        { id: 'l2', tipo: 'leccion', titulo: 'Cápsula 2: el EPP de cada riesgo de tu cargo', minMin: 10 },
        { id: 'j2', tipo: 'juego', titulo: '¿Qué EPP para cada riesgo?' },
        { id: 'l3', tipo: 'leccion', titulo: 'Cápsula 3: cómo se usa, ajusta y cuida', minMin: 8 },
        { id: 'j1', tipo: 'juego', titulo: '¿Sirve o se repone?' },
        { id: 't1', tipo: 'taller', titulo: 'Taller: inspecciona tu propio EPP', minMin: 15 },
        { id: 'q1', tipo: 'quiz', titulo: 'Evaluación', banco: 'epp' },
        { id: 'f1', tipo: 'firma', titulo: 'Firma de la capacitación en EPP' }
      ] },

    { id: 'acc', titulo: 'Qué hacer ante un accidente', sub: 'Procedimiento de accidentes y PTS-018',
      horas: 1, duracionMin: 60, doc: 'certificado', vigenciaMeses: 12, plazoMeses: 0, cargos: '*',
      contenidos: 'Accidente leve, grave y fatal · Denuncia DIAT · Suspensión y notificación · Investigación con árbol de causas · Accidente de trayecto',
      etapas: [
        { id: 'l1', tipo: 'leccion', titulo: 'Cápsula 1: paso a paso ante un accidente', minMin: 8 },
        { id: 'j1', tipo: 'juego', titulo: '¿Leve, grave o fatal?' },
        { id: 'l2', tipo: 'leccion', titulo: 'Cápsula 2: la DIAT, el trayecto y tus derechos en la ACHS', minMin: 8 },
        { id: 'j2', tipo: 'juego', titulo: 'Ordena el accidente grave' },
        { id: 'l3', tipo: 'leccion', titulo: 'Cápsula 3: investigar para que no se repita (PTS-018)', minMin: 10 },
        { id: 't1', tipo: 'taller', titulo: 'Taller: investiga un accidente', minMin: 15 },
        { id: 'q1', tipo: 'quiz', titulo: 'Evaluación', banco: 'acc' }
      ] }
  ]
};

/* Un curso por cada procedimiento de trabajo seguro */
(function () {
  var P = [
    ['PTS-003', 'Corte y soldadura', ['soldador', 'supervisor', 'operario', 'tripulante', 'prevencion']],
    ['PTS-004', 'Apertura de centros de cultivo', ['supervisor', 'operario', 'tripulante', 'patron', 'motorista', 'soldador', 'prevencion', 'jefe_operaciones']],
    ['PTS-005', 'Mantención de centros de cultivo', ['supervisor', 'operario', 'tripulante', 'soldador', 'prevencion', 'jefe_operaciones']],
    ['PTS-006', 'Limpieza y desinfección', ['buzo', 'buzo_supervisor', 'supervisor', 'operario', 'tripulante', 'prevencion', 'jefe_operaciones']],
    ['PTS-007', 'Cambio de zunchos y flotadores', ['operario_agua', 'operario', 'supervisor', 'tripulante', 'patron', 'prevencion', 'jefe_operaciones']],
    ['PTS-009', 'Raspado de estructuras flotantes', ['buzo', 'buzo_supervisor', 'supervisor', 'operario', 'prevencion']],
    ['PTS-010', 'Cierre de centros de cultivo', ['supervisor', 'operario', 'tripulante', 'patron', 'motorista', 'soldador', 'prevencion', 'jefe_operaciones']],
    ['PTS-012', 'Trabajo en altura', ['supervisor', 'operario', 'soldador', 'tripulante', 'patron', 'buzo', 'prevencion', 'jefe_operaciones']],
    ['PTS-017', 'Izaje y movimiento de cargas', ['patron', 'motorista', 'tripulante', 'operario', 'supervisor', 'prevencion', 'jefe_operaciones']],
    ['PTS-021', 'Instalación y retiro de pajareras', ['supervisor', 'operario', 'tripulante', 'prevencion']],
    ['PTS-022', 'Navegación y apoyo con embarcaciones', ['patron', 'motorista', 'tripulante', 'supervisor', 'operario', 'operario_agua', 'soldador', 'buzo', 'buzo_supervisor', 'prevencion', 'jefe_operaciones', 'gerente_general', 'asistente_admin', 'jefe_finanzas']]
  ];
  P.forEach(function (p) {
    var id = p[0].toLowerCase();
    PLAN.cursos.push({ id: id, titulo: p[0] + ' · ' + p[1], sub: 'Procedimiento de trabajo seguro', pts: p[0],
      horas: 1, duracionMin: 60, doc: 'certificado', vigenciaMeses: 12, plazoMeses: 0, cargos: p[2],
      contenidos: 'Objetivo y alcance · Responsabilidades por cargo · EPP · Secuencia de trabajo · Riesgos de la tarea según la Matriz IPER · Criterios de detención · Taller de casos · Puntos clave del ' + p[0],
      etapas: [
        { id: 'l1', tipo: 'leccion', titulo: 'Cápsula 1: el procedimiento paso a paso', minMin: 8 },
        { id: 'ld', tipo: 'leccion', titulo: 'Cápsula 2: quién hace qué y el documento completo', minMin: 12 },
        { id: 'j1', tipo: 'juego', titulo: 'Ordena la secuencia' },
        { id: 'lr', tipo: 'leccion', titulo: 'Cápsula 3: los riesgos de esta tarea (Matriz IPER)', minMin: 12 },
        { id: 'j2', tipo: 'juego', titulo: '¿Detengo o continúo?' },
        { id: 't1', tipo: 'taller', titulo: 'Taller: casos del procedimiento', minMin: 12 },
        { id: 'q1', tipo: 'quiz', titulo: 'Evaluación', banco: id },
        { id: 'f1', tipo: 'firma', titulo: 'Firma: recibí y comprendí el ' + p[0] }
      ] });
  });
})();

/* índices y ayudas */
PLAN.etapas = [];
PLAN.cursos.forEach(function (c) {
  c.etapas.forEach(function (e) { e.curso = c.id; e.local = e.id; e.id = c.id + '.' + e.id; if (e.modulo == null) e.modulo = 0; PLAN.etapas.push(e); });
});
PLAN.duracionTxt = function (min) {
  min = Math.round(+min || 0);
  if (min < 60) return min + ' minutos';
  var h = Math.floor(min / 60), m = min % 60;
  return h + (h === 1 ? ' hora' : ' horas') + (m ? ' ' + m + ' minutos' : '') + ' cronológica' + (h === 1 && !m ? '' : 's');
};
PLAN.curso = function (id) { for (var i = 0; i < PLAN.cursos.length; i++) if (PLAN.cursos[i].id === id) return PLAN.cursos[i]; return null; };
PLAN.etapa = function (id) { for (var i = 0; i < PLAN.etapas.length; i++) if (PLAN.etapas[i].id === id) return PLAN.etapas[i]; return null; };
PLAN.cargo = function (id) { for (var i = 0; i < PLAN.cargos.length; i++) if (PLAN.cargos[i].id === id) return PLAN.cargos[i]; return null; };
PLAN.area = function (cargo) { var c = PLAN.cargo(cargo); return c ? c.area : 'faena'; };
PLAN.tituloEtapa = function (e, cargo) { return (e.tituloOficina && PLAN.area(cargo) === 'oficina') ? e.tituloOficina : e.titulo; };
PLAN.cursosDe = function (cargo) { return PLAN.cursos.filter(function (c) { return c.cargos === '*' || c.cargos.indexOf(cargo) >= 0; }); };
if (typeof module !== 'undefined') module.exports = PLAN;

/* Capacitaciones creadas desde el panel (se guardan en la hoja CursosExtra). */
PLAN.registrarExtra = function (x) {
  var viejo = PLAN.curso(x.id);
  if (viejo) { PLAN.cursos.splice(PLAN.cursos.indexOf(viejo), 1); PLAN.etapas = PLAN.etapas.filter(function (e) { return e.curso !== x.id; }); }
  var c = { id: x.id, titulo: x.titulo, sub: x.sub || 'Capacitación de la empresa', extra: true, horas: x.horas || 1, duracionMin: Math.max(60, Math.round((parseFloat(String(x.horas || 1).replace(',', '.')) || 1) * 60)), doc: 'certificado', vigenciaMeses: +x.vigenciaMeses || 12, plazoMeses: 0,
    cargos: x.cargos, contenidos: x.sub || x.titulo, documentoUrl: x.documentoUrl || '',
    etapas: [{ id: 'l1', tipo: 'leccion', titulo: 'Cápsula', minMin: Math.max(2, Math.min(20, ((x.contenido && x.contenido.diapositivas) || []).length)) },
      { id: 'q1', tipo: 'quiz', titulo: 'Evaluación', banco: x.id }] };
  if (x.firma) c.etapas.push({ id: 'f1', tipo: 'firma', titulo: 'Firma de la capacitación' });
  c.etapas.forEach(function (e) { e.curso = c.id; e.local = e.id; e.id = c.id + '.' + e.id; e.modulo = 0; PLAN.etapas.push(e); });
  PLAN.cursos.push(c);
  return c;
};
