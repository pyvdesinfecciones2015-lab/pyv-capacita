/* PyV Capacita — lógica del servidor.
   Este mismo archivo corre en Google Apps Script (Core.gs) y, en modo demostración, en el navegador.
   No usa servicios de Google directamente: todo pasa por "env" (ver Code.gs y api.js). */

var CORE = (function () {
  var SCHEMA = {
    Trabajadores: ['run', 'nombre', 'cargo', 'telefono', 'pinHash', 'token', 'ciclo', 'fechaRegistro', 'fechaInicio', 'fechaLimite',
      'estado', 'certCodigo', 'certFecha', 'certVence', 'carpetaId', 'consentimiento', 'ultimoAcceso'],
    Progreso: ['run', 'ciclo', 'item', 'estado', 'segundos', 'intentos', 'puntaje', 'fechaInicio', 'fechaTermino', 'suspend', 'detalle'],
    Eventos: ['fecha', 'run', 'ciclo', 'tipo', 'item', 'segundos', 'detalle', 'dispositivo'],
    Evaluaciones: ['fecha', 'run', 'ciclo', 'evaluacion', 'intento', 'puntaje', 'aprobado', 'respuestas'],
    Sesiones: ['id', 'codigo', 'fecha', 'horaInicio', 'horaTermino', 'tema', 'modalidad', 'lugar', 'facilitador', 'estado', 'evidencias', 'creada'],
    Asistencia: ['sesionId', 'run', 'nombre', 'ciclo', 'fecha', 'metodo', 'firmaArchivo'],
    Certificados: ['codigo', 'run', 'nombre', 'cargo', 'ciclo', 'fechaEmision', 'vence', 'horasProgramadas', 'segundosRegistrados', 'archivoId', 'archivoUrl', 'estado', 'curso', 'version'],
    Encuestas: ['fecha', 'run', 'ciclo', 'respuestas'],
    Firmas: ['fecha', 'run', 'nombre', 'cargo', 'curso', 'item', 'declaracion', 'firmaUrl', 'constanciaUrl'],
    CursosExtra: ['id', 'titulo', 'sub', 'cargos', 'horas', 'vigenciaMeses', 'firma', 'declaracion', 'documentoUrl', 'contenido', 'estado', 'creado', 'actualizado']
  };

  var CONFIG_DEFAULT = {
    EMPRESA: 'Servicios Acuícolas PyV Rain Vega SpA',
    RUT_EMPRESA: '76.705.768-7',
    ORGANISMO: 'ACHS',
    FACILITADOR_NOMBRE: 'Iza Sandoval Salgado',
    FACILITADOR_RUN: '',
    FACILITADOR_TITULO: 'Experta en Prevención de Riesgos',
    FACILITADOR_REGISTRO: '',
    REQUIERE_SESIONES: 'NO',
    SESIONES_REQUERIDAS: '2',
    HORAS_CURSO: '8',
    MIN_MINUTOS_DS44: '0',
    RL_NOMBRE: 'Pablo Rain Miranda',
    RL_RUN: '',
    RL_CARGO: 'Gerente General',
    FIRMA_APR_ID: '',
    FIRMA_RL_ID: '',
    URL_SITIO: ''
  };

  var MAX_SEG_POR_EVENTO = 150;   // un latido de tiempo nunca suma más de 2,5 min
  var TOLERANCIA_TIEMPO = 0.8;    // el servidor acepta 80% del mínimo (latidos perdidos)

  /* ---------- utilidades ---------- */
  function limpiarRun(run) { return String(run || '').replace(/[^0-9kK]/g, '').toUpperCase(); }
  function formatoRun(run) {
    var r = limpiarRun(run); if (r.length < 2) return r;
    var cuerpo = r.slice(0, -1), dv = r.slice(-1), out = '';
    while (cuerpo.length > 3) { out = '.' + cuerpo.slice(-3) + out; cuerpo = cuerpo.slice(0, -3); }
    return cuerpo + out + '-' + dv;
  }
  function runValido(run) {
    var r = limpiarRun(run); if (r.length < 8 || r.length > 9) return false;
    var cuerpo = r.slice(0, -1), dv = r.slice(-1), suma = 0, mul = 2;
    for (var i = cuerpo.length - 1; i >= 0; i--) { suma += parseInt(cuerpo[i], 10) * mul; mul = mul === 7 ? 2 : mul + 1; }
    var res = 11 - (suma % 11); var esp = res === 11 ? '0' : res === 10 ? 'K' : String(res);
    return esp === dv;
  }
  function runOculto(run) { var f = formatoRun(run); return f.replace(/^(\d{1,2})\.\d{3}/, '$1.***'); }
  function sha256(ascii) {
    function rr(v, a) { return (v >>> a) | (v << (32 - a)); }
    var mp = Math.pow, mw = mp(2, 32), result = '', words = [], blen = ascii.length * 8, hash = [], k = [], pc = 0, ic = {};
    ascii = unescape(encodeURIComponent(ascii));
    blen = ascii.length * 8;
    for (var c = 2; pc < 64; c++) { if (!ic[c]) { for (var i = 0; i < 313; i += c) ic[i] = c; hash[pc] = (mp(c, .5) * mw) | 0; k[pc++] = (mp(c, 1 / 3) * mw) | 0; } }
    hash = hash.slice(0, 8);
    ascii += '\x80'; while (ascii.length % 64 - 56) ascii += '\x00';
    for (i = 0; i < ascii.length; i++) { var j = ascii.charCodeAt(i); words[i >> 2] |= j << ((3 - i) % 4) * 8; }
    words[words.length] = ((blen / mw) | 0); words[words.length] = (blen);
    for (j = 0; j < words.length;) {
      var w = words.slice(j, j += 16), oh = hash; hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2], a = hash[0], e = hash[4];
        var t1 = hash[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & hash[5]) ^ ((~e) & hash[6])) + k[i] +
          (w[i] = (i < 16) ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
        var t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(t1 + t2) | 0].concat(hash); hash[4] = (hash[4] + t1) | 0;
      }
      for (i = 0; i < 8; i++) hash[i] = (hash[i] + oh[i]) | 0;
    }
    for (i = 0; i < 8; i++) for (j = 3; j + 1; j--) { var b = (hash[i] >> (j * 8)) & 255; result += ((b < 16) ? 0 : '') + b.toString(16); }
    return result;
  }
  function hashPin(run, pin) { return sha256('pyv-capacita|' + limpiarRun(run) + '|' + String(pin)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function num(v) { var n = Number(v); return isNaN(n) ? 0 : n; }
  function parse(s, def) { try { return s ? JSON.parse(s) : def; } catch (e) { return def; } }
  function sumarMeses(d, m) { var x = new Date(d.getTime()); x.setMonth(x.getMonth() + m); return x; }
  function horasTxt(seg) { seg = Math.round(num(seg)); var h = Math.floor(seg / 3600), m = Math.round((seg % 3600) / 60); return h + ' h ' + (m < 10 ? '0' : '') + m + ' min'; }
  function codigoCorto(env) { return env.uuid().replace(/-/g, '').slice(0, 10).toUpperCase(); }
  function cursoDe(item) { return String(item || '').split('.')[0]; }
  function aplica(c, cargo) { return c.cargos === '*' || c.cargos.indexOf(cargo) >= 0; }
  function logo() { return typeof LOGO_PYV !== 'undefined' ? LOGO_PYV : ''; }

  /* ---------- acceso a datos ---------- */
  function cfg(env) { var c = env.config(), o = {}; for (var k in CONFIG_DEFAULT) o[k] = (c[k] != null && c[k] !== '') ? c[k] : CONFIG_DEFAULT[k]; for (k in c) if (!(k in o)) o[k] = c[k]; return o; }
  function trabajador(env, run) { var r = limpiarRun(run), L = env.db.read('Trabajadores'); for (var i = 0; i < L.length; i++) if (limpiarRun(L[i].run) === r) return L[i]; return null; }
  function porToken(env, token) {
    if (!token) return null; var L = env.db.read('Trabajadores');
    for (var i = 0; i < L.length; i++) if (L[i].token && L[i].token === token) return L[i]; return null;
  }
  function progreso(env, t) {
    var out = {};
    env.db.read('Progreso').forEach(function (p) { if (limpiarRun(p.run) === limpiarRun(t.run) && PLAN.etapa(p.item)) out[p.item] = p; });
    return out;
  }
  function filaProgreso(env, t, item) {
    var P = progreso(env, t); if (P[item]) return P[item];
    var nueva = { run: t.run, ciclo: 1, item: item, estado: 'en_curso', segundos: 0, intentos: 0, puntaje: '', fechaInicio: env.fmt(env.now(), 'fechahora'), fechaTermino: '', suspend: '', detalle: '' };
    return env.db.append('Progreso', nueva);
  }
  function log(env, t, tipo, item, seg, detalle, disp) {
    env.db.append('Eventos', { fecha: env.fmt(env.now(), 'fechahora'), run: t ? t.run : '', ciclo: 1, tipo: tipo, item: item || '', segundos: seg || '', detalle: typeof detalle === 'string' ? detalle : JSON.stringify(detalle || ''), dispositivo: disp || '' });
  }
  function asistencias(env, t) {
    return env.db.read('Asistencia').filter(function (a) { return limpiarRun(a.run) === limpiarRun(t.run) && a.ciclo !== 'archivado'; });
  }
  function certDe(env, t, curso) {
    var L = env.db.read('Certificados');
    for (var i = L.length - 1; i >= 0; i--) {
      var c = L[i]; if (limpiarRun(c.run) !== limpiarRun(t.run)) continue;
      if ((c.curso || 'ds44') !== curso) continue;
      if (c.estado === 'anulado' || c.estado === 'reemplazado') continue;
      return c;
    }
    return null;
  }
  function vencido(env, c) { return !!(c && c.vence && env.parseFecha(c.vence) < env.now()); }

  /* ---------- reglas de cada curso ---------- */
  function duracionCurso(C, cur) { return cur.id === 'ds44' ? Math.round(num(C.HORAS_CURSO) * 60) : num(cur.duracionMin || (num(cur.horas) * 60)); }
  function requisitos(env, t, cursoId) {
    var C = cfg(env), cur = PLAN.curso(cursoId), P = progreso(env, t), faltan = [], hechos = 0, total = 0, seg = 0;
    var reqSes = cursoId === 'ds44' && C.REQUIERE_SESIONES === 'SI';
    cur.etapas.forEach(function (e) {
      if (e.tipo === 'sesiones' && !reqSes) return;
      total++;
      var ok = e.tipo === 'sesiones' ? asistencias(env, t).length >= num(C.SESIONES_REQUERIDAS) : (P[e.id] && P[e.id].estado === 'completado');
      if (ok) hechos++; else faltan.push(e.id);
      if (P[e.id]) seg += num(P[e.id].segundos);
    });
    /* El certificado declara la duración del programa: no se emite si el tiempo registrado es menor (evita contradicciones ante fiscalización). */
    var minMin = duracionCurso(C, cur), faltaTiempo = 0;
    if (minMin > 0 && seg < minMin * 60) faltaTiempo = Math.ceil((minMin * 60 - seg) / 60);
    var plazoV = false;
    if (cursoId === 'ds44' && t.fechaLimite && !certDe(env, t, 'ds44')) plazoV = env.parseFecha(t.fechaLimite) < env.now();
    return { curso: cursoId, total: total, hechos: hechos, faltan: faltan, segundos: seg, plazoVencido: plazoV, faltaTiempoMin: faltaTiempo, duracionMin: minMin,
      requiereSesiones: reqSes, sesionesRequeridas: num(C.SESIONES_REQUERIDAS), sesionesAsistidas: asistencias(env, t).length };
  }
  function perfil(env, t) {
    var P = progreso(env, t), prog = {}, C = cfg(env);
    for (var k in P) prog[k] = { estado: P[k].estado, segundos: num(P[k].segundos), intentos: num(P[k].intentos), puntaje: P[k].puntaje, suspend: P[k].suspend, detalle: parse(P[k].detalle, {}) };
    var cursos = {};
    PLAN.cursosDe(t.cargo).forEach(function (cur) {
      var R = requisitos(env, t, cur.id), c = certDe(env, t, cur.id);
      cursos[cur.id] = { requisitos: R, certificado: c ? { codigo: c.codigo, fechaEmision: c.fechaEmision, vence: c.vence, url: c.archivoUrl, vencido: vencido(env, c) } : null };
    });
    var ds = cursos.ds44 || {};
    return {
      run: formatoRun(t.run), nombre: t.nombre, cargo: t.cargo,
      fechaInicio: t.fechaInicio, fechaLimite: t.fechaLimite, estado: t.estado,
      progreso: prog, cursos: cursos, requisitos: ds.requisitos, certificado: ds.certificado,
      sesiones: asistencias(env, t).map(function (a) { return { sesionId: a.sesionId, fecha: a.fecha }; }),
      empresa: C.EMPRESA, facilitador: C.FACILITADOR_NOMBRE, extras: extrasPara(env, t.cargo)
    };
  }

  function constanciaHtml(C, titulo, cuerpo, pie) {
    return '<html><head><meta charset="utf-8"><style>body{font-family:Arial,Helvetica,sans-serif;color:#1b2a31;font-size:11pt;margin:36px}' +
      'h1{font-size:16pt;color:#0f3b4c;margin:0 0 4px}h2{font-size:12pt;color:#0f3b4c;margin:18px 0 6px}.emp{color:#555;font-size:9pt;margin-bottom:18px}' +
      'table{border-collapse:collapse;width:100%;font-size:9pt}td,th{border:1px solid #c9d3d7;padding:4px 6px;text-align:left;vertical-align:top}th{background:#e8eef0}' +
      '.pie{margin-top:24px;font-size:8.5pt;color:#555}.logo{float:right;width:64px;margin:0 0 8px 12px}.firma{height:90px;border-bottom:1px solid #333;margin-top:10px}</style></head><body>' +
      (logo() ? '<img class="logo" src="' + logo() + '" alt="">' : '') +
      '<div class="emp">' + esc(C.EMPRESA) + ' · RUT ' + esc(C.RUT_EMPRESA) + ' · Organismo administrador: ' + esc(C.ORGANISMO) + '</div>' +
      '<h1>' + esc(titulo) + '</h1>' + cuerpo + '<div class="pie">' + (pie || '') + '</div></body></html>';
  }

  function certificadoHtml(C, t, cert, qrDataUrl, seg) {
    var cargo = PLAN.cargo(t.cargo); cargo = cargo ? cargo.nombre : t.cargo;
    var cur = PLAN.curso(cert.curso || 'ds44') || PLAN.cursos[0];
    var esCert = cur.doc === 'certificado';
    var durTxt = PLAN.duracionTxt(duracionCurso(C, cur));
    var verif = (C.URL_SITIO ? C.URL_SITIO.replace(/\/$/, '') + '/verificar.html?c=' : 'Código: ') + cert.codigo;
    var esDif = cur.doc === 'difusion', mesesV = cur.vigenciaMeses || 12;
    var texto = esDif ? 'recibió la difusión semestral del Protocolo de prevención del acoso laboral, sexual y la violencia en el trabajo de la empresa y de sus canales de denuncia, conforme al artículo 211-A del Código del Trabajo (Ley N° 21.643), en modalidad e-learning asincrónica con evaluación de aprendizaje y constancia de recepción firmada.'
      : cur.id === 'ds44'
      ? 'aprobó el curso de Prevención de Riesgos Laborales conforme al artículo 16 del D.S. N° 44/2024 del Ministerio del Trabajo y Previsión Social y a la Guía Técnica aprobada por Resolución Exenta N° 1117/2026 de la Subsecretaría de Previsión Social.'
      : 'completó y aprobó la capacitación <b>' + esc(cur.titulo) + '</b> impartida por la empresa en modalidad e-learning asincrónica, con evaluación de aprendizaje.';
    return '<html><head><meta charset="utf-8"><style>' +
      '@page{size:A4 portrait;margin:0}body{margin:0;font-family:Arial,Helvetica,sans-serif;color:#1b2a31}' +
      '.hoja{border:10px solid #0f3b4c;margin:28px;padding:38px 44px;min-height:900px;position:relative}' +
      '.banda{height:8px;background:#f26b1d;margin:-38px -44px 30px}' +
      '.emp{font-size:10pt;color:#0f3b4c;font-weight:bold}.rut{font-size:9pt;color:#555}' +
      'h1{font-size:30pt;color:#0f3b4c;margin:40px 0 6px;letter-spacing:1px}.sub{font-size:12pt;color:#555;margin-bottom:34px;max-width:75%}' +
      '.nombre{font-size:24pt;font-weight:bold;margin:8px 0 2px}.runc{font-size:12pt;color:#333;margin-bottom:22px}' +
      'p{font-size:11.5pt;line-height:1.55}table{border-collapse:collapse;margin:16px 0;font-size:10.5pt}td{padding:4px 14px 4px 0;vertical-align:top}td.k{color:#555}' +
      'table.firmas{margin-top:30px;width:100%;border-collapse:separate;border-spacing:0}table.firmas td.firma{width:46%;vertical-align:top;font-size:9.5pt;padding:0}table.firmas td.sep{width:8%}.firma .img{height:64px;text-align:center}.firma .img img{max-height:62px;max-width:220px}.firma .linea{border-top:1px solid #1b2a31;padding-top:5px}' +
      '.qr{position:absolute;right:44px;bottom:40px;text-align:center;font-size:8pt;color:#555}.qr img{width:110px;height:110px}' +
      '.nota{font-size:8.5pt;color:#555;margin-top:30px;max-width:70%}' +
      '.logo{position:absolute;right:44px;top:44px;width:96px}' +
      '</style></head><body><div class="hoja"><div class="banda"></div>' +
      (logo() ? '<img class="logo" src="' + logo() + '" alt="">' : '') +
      '<div class="emp">' + esc(C.EMPRESA) + '</div><div class="rut">RUT ' + esc(C.RUT_EMPRESA) + ' · Organismo administrador Ley 16.744: ' + esc(C.ORGANISMO) + '</div>' +
      '<h1>' + (esDif ? 'Constancia de difusión' : esCert ? 'Certificado de capacitación' : 'Constancia de capacitación') + '</h1><div class="sub">' + esc(cur.titulo) + (cur.sub ? ' · ' + esc(cur.sub) : '') + '</div>' +
      '<p>Se certifica que</p><div class="nombre">' + esc(t.nombre) + '</div><div class="runc">RUN ' + esc(formatoRun(t.run)) + ' · ' + esc(cargo) + '</div>' +
      '<p>' + texto + '</p>' +
      '<table><tr><td class="k">Duración del programa</td><td>' + esc(durTxt) + '</td></tr>' +
      '<tr><td class="k">Modalidad</td><td>E-learning asincrónico con cápsulas, actividades prácticas, talleres y evaluación</td></tr>' +
      '<tr><td class="k">Tiempo registrado en plataforma</td><td>' + horasTxt(seg) + '</td></tr>' +
      '<tr><td class="k">Fecha de aprobación</td><td>' + esc(fechaCl(cert.fechaEmision)) + '</td></tr>' +
      '<tr><td class="k">Vigencia</td><td>' + (cert.vence ? (esDif ? mesesV + ' meses, hasta el ' + esc(fechaCl(cert.vence)) + ' (difusión semestral obligatoria)' : mesesV + ' meses, hasta el ' + esc(fechaCl(cert.vence)) + ', o antes si cambian el procedimiento o el cargo, o tras un accidente') : 'Hasta que cambien el procedimiento o el cargo, o tras un accidente') + '</td></tr>' +
      '<tr><td class="k">Contenidos</td><td>' + esc(cur.contenidos || '') + '</td></tr>' +
      (cert.version ? '<tr><td class="k">Documento base</td><td>' + esc(cur.titulo) + ' · versión ' + esc(cert.version) + '</td></tr>' : '') +
      '<tr><td class="k">Código de verificación</td><td><b>' + esc(cert.codigo) + '</b></td></tr></table>' +
      '<table class="firmas"><tr><td class="firma">' + firmaImg(C._firmaApr) + '<div class="linea"><b>' + esc(C.FACILITADOR_NOMBRE) + '</b><br>' + esc(C.FACILITADOR_TITULO) + (C.FACILITADOR_RUN ? '<br>RUN ' + esc(C.FACILITADOR_RUN) : '') + (C.FACILITADOR_REGISTRO ? '<br>Reg. SEREMI ' + esc(C.FACILITADOR_REGISTRO) : '') + '<br>Facilitadora · Prevención de Riesgos</div></td><td class="sep"></td>' +
      '<td class="firma">' + firmaImg(C._firmaRl) + '<div class="linea"><b>' + esc(C.RL_NOMBRE || 'Representante legal') + '</b>' + (C.RL_RUN ? '<br>RUN ' + esc(C.RL_RUN) : '') + '<br>' + esc(C.RL_CARGO ? C.RL_CARGO + ' · Representante legal' : 'Representante legal') + '<br>' + esc(C.EMPRESA) + '</div></td></tr></table>' +
      '<div class="nota">Registro de acceso, permanencia, avance y evaluaciones disponible en el expediente de capacitación de la empresa. Verificación: ' + esc(verif) + '</div>' +
      (qrDataUrl ? '<div class="qr"><img src="' + qrDataUrl + '"><br>Verificar</div>' : '') +
      '</div></body></html>';
  }

  function firmaImg(src) { return '<div class="img">' + (src && /^data:image\//.test(src) ? '<img src="' + src + '" alt="">' : '') + '</div>'; }
  function fechaCl(f) { var m = String(f || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? m[3] + '-' + m[2] + '-' + m[1] : String(f || ''); }
  /* Carga las imágenes de firma (guardadas en Drive) para incrustarlas en el PDF. */
  function conFirmas(env, C) {
    if (env.drive.leerImagen) { try { C._firmaApr = C.FIRMA_APR_ID ? env.drive.leerImagen(C.FIRMA_APR_ID) : ''; C._firmaRl = C.FIRMA_RL_ID ? env.drive.leerImagen(C.FIRMA_RL_ID) : ''; } catch (e) { } }
    return C;
  }
  function qr(texto) {
    try { var q = qrcode(0, 'M'); q.addData(texto); q.make(); return q.createDataURL(4, 2); } catch (e) { return ''; }
  }

  /* ---------- acciones del trabajador ---------- */
  var A = {};
  var SESION = { ok: false, error: 'sesion', mensaje: 'Tu sesión expiró. Ingresa de nuevo.' };

  A.registrar = function (env, b) {
    var run = limpiarRun(b.run);
    if (!runValido(run)) return { ok: false, error: 'El RUN no es válido. Revisa el dígito verificador.' };
    if (!b.nombre || String(b.nombre).trim().length < 5) return { ok: false, error: 'Escribe tu nombre completo.' };
    if (!PLAN.cargo(b.cargo)) return { ok: false, error: 'Elige tu cargo.' };
    if (!/^\d{4}$/.test(String(b.pin || ''))) return { ok: false, error: 'La clave debe tener 4 números.' };
    if (!b.consentimiento) return { ok: false, error: 'Debes aceptar el uso de tus datos para el registro de capacitación.' };
    if (trabajador(env, run)) return { ok: false, error: 'Este RUN ya está registrado. Ingresa con tu clave.' };
    var nombre = String(b.nombre).trim().replace(/\s+/g, ' ');
    var t = {
      run: formatoRun(run), nombre: nombre, cargo: b.cargo, telefono: String(b.telefono || '').trim(), pinHash: hashPin(run, b.pin),
      token: env.uuid(), ciclo: 1, fechaRegistro: env.fmt(env.now(), 'fechahora'), fechaInicio: '', fechaLimite: '', estado: 'registrado',
      certCodigo: '', certFecha: '', certVence: '', carpetaId: '', consentimiento: env.fmt(env.now(), 'fechahora') + ' — acepta tratamiento de datos para registro de capacitación (Ley 19.628 / 21.719)', ultimoAcceso: env.fmt(env.now(), 'fechahora')
    };
    t.carpetaId = env.drive.carpetaTrabajador(t.run, t.nombre);
    t = env.db.append('Trabajadores', t);
    log(env, t, 'registro', '', '', { cargo: t.cargo }, b.dispositivo);
    return { ok: true, token: t.token, perfil: perfil(env, t) };
  };

  A.ingresar = function (env, b) {
    var t = trabajador(env, b.run);
    if (!t || t.pinHash !== hashPin(b.run, b.pin)) return { ok: false, error: 'RUN o clave incorrectos.' };
    t.token = env.uuid(); t.ultimoAcceso = env.fmt(env.now(), 'fechahora'); env.db.update('Trabajadores', t);
    log(env, t, 'ingreso', '', '', '', b.dispositivo);
    return { ok: true, token: t.token, perfil: perfil(env, t) };
  };

  A.estado = function (env, b) {
    var t = porToken(env, b.token); if (!t) return SESION;
    return { ok: true, perfil: perfil(env, t) };
  };

  function marcarInicio(env, t) {
    if (!t.fechaInicio) {
      var ahora = env.now(), cur = PLAN.curso('ds44');
      t.fechaInicio = env.fmt(ahora, 'fecha'); t.fechaLimite = env.fmt(sumarMeses(ahora, cur.plazoMeses), 'fecha'); t.estado = 'en_curso';
      env.db.update('Trabajadores', t);
    }
  }

  function completar(env, t, p, item, extra) {
    if (p.estado === 'completado') return;
    p.estado = 'completado'; p.fechaTermino = env.fmt(env.now(), 'fechahora');
    if (extra) { var d = parse(p.detalle, {}); for (var k in extra) d[k] = extra[k]; p.detalle = JSON.stringify(d); }
    env.db.update('Progreso', p);
    log(env, t, 'completado', item, p.segundos, extra && extra.riesgos ? 'revisión de riesgos del cargo' : (extra || ''), '');
  }
  function tiempoOk(p, e) { return !e.minMin || num(p.segundos) >= e.minMin * 60 * TOLERANCIA_TIEMPO; }

  A.eventos = function (env, b) {
    var t = porToken(env, b.token); if (!t) return SESION;
    var res = [], C = cfg(env);
    (b.eventos || []).forEach(function (ev) {
      try { res.push(evento(env, t, ev, C, b.dispositivo)); } catch (e) { res.push({ ok: false, error: String(e && e.message || e) }); }
    });
    return { ok: true, resultados: res, perfil: perfil(env, t) };
  };

  function evento(env, t, ev, C, disp) {
    var e = PLAN.etapa(ev.item);
    if (!e) return { ok: false, error: 'etapa desconocida' };
    var p;
    switch (ev.tipo) {
      case 'inicio':
        if (e.curso === 'ds44' && (e.tipo === 'scorm' || e.tipo === 'manual')) marcarInicio(env, t);
        p = filaProgreso(env, t, ev.item); log(env, t, 'inicio', ev.item, '', ev.cuando || '', disp); return { ok: true };
      case 'tiempo':
        var s = Math.max(0, Math.min(MAX_SEG_POR_EVENTO, Math.round(num(ev.seg))));
        p = filaProgreso(env, t, ev.item); p.segundos = num(p.segundos) + s; env.db.update('Progreso', p);
        log(env, t, 'permanencia', ev.item, s, ev.cuando || '', disp); return { ok: true };
      case 'scorm':
        p = filaProgreso(env, t, ev.item);
        if (ev.suspend != null) p.suspend = String(ev.suspend).slice(0, 40000);
        var d = parse(p.detalle, {}), antes = d.scorm; if (ev.status) d.scorm = ev.status; if (ev.location != null) d.location = ev.location; p.detalle = JSON.stringify(d);
        env.db.update('Progreso', p);
        if (ev.status && ev.status !== antes) log(env, t, 'scorm', ev.item, '', 'estado: ' + ev.status, disp);
        return { ok: true };
      case 'completar':
        p = filaProgreso(env, t, ev.item);
        if (e.tipo === 'scorm') {
          var det = parse(p.detalle, {});
          if (['passed', 'completed'].indexOf(det.scorm) < 0) return { ok: false, error: 'La cápsula aún no registra término.' };
        }
        if (e.tipo === 'quiz' || e.tipo === 'firma') return { ok: false, error: 'Esta etapa se completa de otra forma.' };
        if (!tiempoOk(p, e)) return { ok: false, error: 'Tiempo de permanencia insuficiente.' };
        completar(env, t, p, ev.item, ev.detalle || null);
        if (e.tipo === 'manual') constancia(env, t, 'Constancia de entrega del Manual del participante',
          '<p>El trabajador declara haber recibido y descargado el <b>Manual del participante</b> del curso de Prevención de Riesgos Laborales antes de iniciar los módulos de contenido.</p>' +
          tablaTrabajador(t) + '<p>Fecha y hora de descarga: <b>' + esc(env.fmt(env.now(), 'fechahora')) + '</b></p>', 'Constancia_manual');
        if (e.tipo === 'pyv') constanciaPyv(env, t, ev.detalle || {});
        return { ok: true };
      case 'quiz':
        p = filaProgreso(env, t, ev.item);
        p.intentos = num(p.intentos) + 1;
        var pt = Math.max(0, Math.min(1, num(ev.puntaje)));
        if (p.puntaje === '' || pt > num(p.puntaje)) p.puntaje = pt;
        env.db.update('Progreso', p);
        var aprobado = pt >= PLAN.notaAprobacion;
        env.db.append('Evaluaciones', { fecha: env.fmt(env.now(), 'fechahora'), run: t.run, ciclo: 1, evaluacion: ev.item, intento: p.intentos, puntaje: pt, aprobado: aprobado ? 'SI' : 'NO', respuestas: JSON.stringify(ev.respuestas || []) });
        log(env, t, 'evaluacion', ev.item, '', 'intento ' + p.intentos + ': ' + Math.round(pt * 100) + '%', disp);
        if (aprobado) completar(env, t, p, ev.item, { puntaje: pt });
        return { ok: true, aprobado: aprobado };
      case 'juego':
      case 'taller':
        p = filaProgreso(env, t, ev.item);
        if (!tiempoOk(p, e)) return { ok: false, error: 'Tiempo de permanencia insuficiente.' };
        p.intentos = num(p.intentos) + 1; if (p.puntaje === '' || num(ev.puntaje) > num(p.puntaje)) p.puntaje = num(ev.puntaje);
        env.db.update('Progreso', p);
        if (ev.tipo === 'taller' || (ev.respuestas && ev.respuestas.length)) env.db.append('Evaluaciones', { fecha: env.fmt(env.now(), 'fechahora'), run: t.run, ciclo: 1, evaluacion: ev.item, intento: p.intentos, puntaje: num(ev.puntaje), aprobado: 'TALLER', respuestas: JSON.stringify(ev.respuestas || []).slice(0, 45000) });
        log(env, t, ev.tipo === 'taller' ? 'taller' : 'actividad', ev.item, '', 'resultado ' + Math.round(num(ev.puntaje) * 100) + '%', disp);
        completar(env, t, p, ev.item, { puntaje: num(ev.puntaje) });
        return { ok: true };
      case 'firma':
        p = filaProgreso(env, t, ev.item);
        if (p.estado === 'completado') return { ok: true };
        var cur = PLAN.curso(e.curso), R = requisitos(env, t, e.curso);
        var otras = R.faltan.filter(function (x) { return x !== ev.item; });
        if (otras.length) return { ok: false, error: 'Completa las etapas anteriores antes de firmar.' };
        var firmaUrl = '';
        try { if (!t.carpetaId) { t.carpetaId = env.drive.carpetaTrabajador(t.run, t.nombre); env.db.update('Trabajadores', t); } firmaUrl = env.drive.guardarImagen(t.carpetaId, 'Firma_' + e.id.replace('.', '_') + '_' + env.fmt(env.now(), 'archivo') + '.png', ev.firma).url; } catch (x) { }
        var decl = String(ev.declaracion || '').slice(0, 3000);
        var cons = constancia(env, t, cur.titulo + ' · constancia firmada',
          tablaTrabajador(t) + '<h2>Declaración</h2><p>' + esc(decl).replace(/\n/g, '<br>') + '</p>' +
          (ev.detalle && ev.detalle.lista ? '<h2>Contenido informado</h2><table><tr><th>Riesgo / punto</th><th>Detalle</th></tr>' + ev.detalle.lista.slice(0, 60).map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</table>' : '') +
          '<h2>Firma del trabajador</h2>' + (ev.firma && /^data:image\/png;base64,/.test(ev.firma) ? '<img src="' + ev.firma + '" style="height:110px;border-bottom:1px solid #333">' : '<div class="firma"></div>') +
          '<p>' + esc(t.nombre) + ' · RUN ' + esc(formatoRun(t.run)) + ' · Firmado en la plataforma el <b>' + esc(env.fmt(env.now(), 'fechahora')) + '</b></p>', 'Firma_' + e.curso.toUpperCase());
        env.db.append('Firmas', { fecha: env.fmt(env.now(), 'fechahora'), run: t.run, nombre: t.nombre, cargo: t.cargo, curso: e.curso, item: e.id, declaracion: decl, firmaUrl: firmaUrl, constanciaUrl: cons });
        completar(env, t, p, ev.item, { firmado: true });
        return { ok: true };
      case 'encuesta':
        p = filaProgreso(env, t, ev.item);
        env.db.append('Encuestas', { fecha: env.fmt(env.now(), 'fechahora'), run: t.run, ciclo: 1, respuestas: JSON.stringify(ev.respuestas || {}) });
        completar(env, t, p, ev.item, null); return { ok: true };
      default: return { ok: false, error: 'tipo de evento desconocido' };
    }
  }

  function tablaTrabajador(t) {
    var c = PLAN.cargo(t.cargo);
    return '<table><tr><th>Nombre</th><th>RUN</th><th>Cargo</th></tr><tr><td>' + esc(t.nombre) + '</td><td>' + esc(formatoRun(t.run)) + '</td><td>' + esc(c ? c.nombre : t.cargo) + '</td></tr></table>';
  }
  function constancia(env, t, titulo, cuerpo, archivo) {
    try {
      var C = cfg(env); if (!t.carpetaId) { t.carpetaId = env.drive.carpetaTrabajador(t.run, t.nombre); env.db.update('Trabajadores', t); }
      return env.drive.guardarPdf(t.carpetaId, archivo + '_' + env.fmt(env.now(), 'archivo') + '.pdf', constanciaHtml(C, titulo, cuerpo, 'Registro generado automáticamente por PyV Capacita.')).url || '';
    } catch (e) { log(env, t, 'error', '', '', 'constancia: ' + e, ''); return ''; }
  }
  function constanciaPyv(env, t, d) {
    var filas = (d.riesgos || []).slice(0, 60).map(function (r) { return '<tr><td>' + esc(r.riesgo) + '</td><td>' + esc(r.nivel) + '</td><td>' + esc(r.controles) + '</td></tr>'; }).join('');
    var pts = (d.pts || []).map(esc).join(', ');
    constancia(env, t, 'Constancia de información de riesgos del cargo (art. 15 D.S. 44)',
      '<p>El trabajador revisó en la plataforma la información de los riesgos de su cargo según la Matriz IPER vigente de la empresa, sus medidas de control, el plan de emergencia (PRRD) y los procedimientos de trabajo seguro aplicables.</p>' +
      tablaTrabajador(t) + '<h2>Riesgos revisados</h2><table><tr><th>Riesgo</th><th>Nivel</th><th>Controles principales</th></tr>' + filas + '</table>' +
      '<h2>Procedimientos informados</h2><p>' + (pts || '—') + '</p><p>Fecha y hora: <b>' + esc(env.fmt(env.now(), 'fechahora')) + '</b></p>', 'Constancia_riesgos_cargo');
  }

  A.asistencia = function (env, b) {
    var t = porToken(env, b.token); if (!t) return SESION;
    var cod = String(b.codigo || '').trim().toUpperCase(), S = env.db.read('Sesiones'), s = null;
    for (var i = 0; i < S.length; i++) if (String(S[i].codigo).toUpperCase() === cod && S[i].estado !== 'cerrada') s = S[i];
    if (!s) return { ok: false, error: 'Código de sesión no válido o sesión cerrada.' };
    var ya = asistencias(env, t).some(function (a) { return a.sesionId === s.id; });
    if (ya) return { ok: true, mensaje: 'Tu asistencia ya estaba registrada.', perfil: perfil(env, t) };
    var firma = '';
    if (b.firma) { try { firma = env.drive.guardarImagen(t.carpetaId, 'Firma_sesion_' + s.id + '.png', b.firma).url; } catch (e) { } }
    env.db.append('Asistencia', { sesionId: s.id, run: t.run, nombre: t.nombre, ciclo: 1, fecha: env.fmt(env.now(), 'fechahora'), metodo: 'código + firma en dispositivo', firmaArchivo: firma });
    log(env, t, 'asistencia', 'ds44.sesiones', '', 'sesión ' + s.id + ' (' + s.tema + ')', b.dispositivo);
    return { ok: true, mensaje: 'Asistencia registrada.', perfil: perfil(env, t) };
  };

  function urlVerif(C, codigo) { return (C.URL_SITIO ? C.URL_SITIO.replace(/\/$/, '') + '/verificar.html?c=' : 'PYV:') + codigo; }

  A.certificado = function (env, b) {
    var t = porToken(env, b.token); if (!t) return SESION;
    var cursoId = b.curso || 'ds44', cur = PLAN.curso(cursoId);
    if (!cur || !aplica(cur, t.cargo)) return { ok: false, error: 'Curso no disponible para tu cargo.' };
    var C = conFirmas(env, cfg(env)), R = requisitos(env, t, cursoId), c = certDe(env, t, cursoId);
    if (!c) {
      if (R.plazoVencido) return { ok: false, error: 'Se cumplió el plazo de ' + cur.plazoMeses + ' meses sin terminar el curso. Habla con la encargada de prevención para reiniciarlo.' };
      if (R.faltan.length) return { ok: false, error: 'Aún te faltan etapas por completar.', faltan: R.faltan };
      if (R.faltaTiempoMin) return { ok: false, faltaTiempo: R.faltaTiempoMin, error: 'Completaste todas las etapas, pero el programa dura ' + PLAN.duracionTxt(R.duracionMin) + ' y llevas ' + horasTxt(R.segundos) + ' registrados. Te faltan unos ' + R.faltaTiempoMin + ' minutos: repasa las cápsulas, lecturas y talleres del curso y vuelve aquí.' };
      var ahora = env.now(), prefijo = 'PYV-';
      c = { codigo: prefijo + codigoCorto(env), run: t.run, nombre: t.nombre, cargo: t.cargo, ciclo: 1, fechaEmision: env.fmt(ahora, 'fecha'),
        vence: cur.vigenciaMeses ? env.fmt(sumarMeses(ahora, cur.vigenciaMeses), 'fecha') : '', horasProgramadas: cursoId === 'ds44' ? C.HORAS_CURSO : cur.horas,
        segundosRegistrados: R.segundos, archivoId: '', archivoUrl: '', estado: 'vigente', curso: cursoId, version: C['VERSION_' + cursoId] || '' };
      var html = certificadoHtml(C, t, c, qr(urlVerif(C, c.codigo)), R.segundos);
      var f = env.drive.guardarPdf(t.carpetaId, (cur.doc === 'certificado' ? 'Certificado_' : cur.doc === 'difusion' ? 'Difusion_' : 'Constancia_') + cursoId.toUpperCase() + '_' + c.codigo + '.pdf', html);
      c.archivoId = f.id || ''; c.archivoUrl = f.url || '';
      env.db.append('Certificados', c);
      if (cursoId === 'ds44') { t.certCodigo = c.codigo; t.certFecha = c.fechaEmision; t.certVence = c.vence; t.estado = 'certificado'; env.db.update('Trabajadores', t); }
      var ev = env.db.read('Evaluaciones').filter(function (x) { return limpiarRun(x.run) === limpiarRun(t.run) && cursoDe(x.evaluacion) === cursoId; });
      var P = progreso(env, t);
      constancia(env, t, 'Registro individual · ' + cur.titulo,
        tablaTrabajador(t) + '<h2>Avance por etapa</h2><table><tr><th>Etapa</th><th>Estado</th><th>Tiempo</th><th>Inicio</th><th>Término</th></tr>' +
        cur.etapas.map(function (e) { var p = P[e.id] || {}; if (e.tipo === 'sesiones' && !R.requiereSesiones) return ''; return '<tr><td>' + esc(e.titulo) + '</td><td>' + esc(p.estado || (e.tipo === 'sesiones' ? (R.sesionesAsistidas + ' sesión(es)') : '—')) + '</td><td>' + (p.segundos ? horasTxt(p.segundos) : '') + '</td><td>' + esc(p.fechaInicio || '') + '</td><td>' + esc(p.fechaTermino || '') + '</td></tr>'; }).join('') +
        '</table><h2>Evaluaciones y talleres</h2><table><tr><th>Fecha</th><th>Actividad</th><th>Intento</th><th>Resultado</th></tr>' +
        ev.map(function (x) { var e = PLAN.etapa(x.evaluacion); return '<tr><td>' + esc(x.fecha) + '</td><td>' + esc(e ? e.titulo : x.evaluacion) + '</td><td>' + esc(x.intento) + '</td><td>' + (x.aprobado === 'TALLER' ? 'Taller entregado' : Math.round(num(x.puntaje) * 100) + '%') + '</td></tr>'; }).join('') +
        '</table><p>Tiempo total registrado: <b>' + horasTxt(R.segundos) + '</b> · Código ' + esc(c.codigo) + ' emitido el ' + esc(c.fechaEmision) + '.</p>', 'Registro_' + cursoId.toUpperCase());
      log(env, t, 'certificado', cursoId, '', c.codigo, b.dispositivo);
      c._html = html; c._base64 = f.base64 || '';
    } else {
      c._html = certificadoHtml(C, t, c, qr(urlVerif(C, c.codigo)), num(c.segundosRegistrados));
      c._base64 = env.drive.pdfBase64 ? env.drive.pdfBase64(c.archivoId) : '';
    }
    return { ok: true, certificado: { codigo: c.codigo, curso: cursoId, fechaEmision: c.fechaEmision, vence: c.vence, url: c.archivoUrl, html: c._html, pdf: c._base64 }, perfil: perfil(env, t) };
  };

  A.verificar = function (env, b) {
    var cod = String(b.codigo || '').trim().toUpperCase(), L = env.db.read('Certificados');
    for (var i = 0; i < L.length; i++) if (String(L[i].codigo).toUpperCase() === cod) {
      var c = L[i], cg = PLAN.cargo(c.cargo), C = cfg(env), cur = PLAN.curso(c.curso || 'ds44');
      var est = c.estado === 'anulado' ? 'anulado' : c.estado === 'reemplazado' ? 'reemplazado' : (vencido(env, c) ? 'vencido' : 'vigente');
      return { ok: true, certificado: { codigo: c.codigo, nombre: c.nombre, run: runOculto(c.run), cargo: cg ? cg.nombre : c.cargo, fechaEmision: c.fechaEmision, vence: c.vence, horas: c.horasProgramadas, estado: est, empresa: C.EMPRESA, curso: cur ? cur.titulo : '' } };
    }
    return { ok: false, error: 'No existe un certificado o constancia con ese código.' };
  };

  /* ---------- administración ---------- */
  function admin(env, b, soloAdmin) {
    var rol = b.adminToken ? env.cache.get('adm:' + b.adminToken) : null;
    if (!rol) return null; if (soloAdmin && rol !== 'admin') return null; return rol;
  }
  var NO_AUT = { ok: false, error: 'sesion', mensaje: 'Ingresa de nuevo al panel.' };

  A.adminIngresar = function (env, b) {
    var h = sha256('pyv-admin|' + String(b.clave || '')), c = env.config(), rol = null;
    if (c.ADMIN_CLAVE_HASH && h === c.ADMIN_CLAVE_HASH) rol = 'admin';
    else if (c.SUPERVISOR_CLAVE_HASH && h === c.SUPERVISOR_CLAVE_HASH) rol = 'supervisor';
    if (!rol) return { ok: false, error: 'Clave incorrecta.' };
    var tok = env.uuid(); env.cache.put('adm:' + tok, rol, 21600);
    return { ok: true, adminToken: tok, rol: rol };
  };

  A.adminResumen = function (env, b) {
    var rol = admin(env, b); if (!rol) return NO_AUT;
    var C = cfg(env), T = env.db.read('Trabajadores');
    var lista = T.map(function (t) {
      var P = progreso(env, t), cursos = {};
      PLAN.cursosDe(t.cargo).forEach(function (cur) {
        var R = requisitos(env, t, cur.id), c = certDe(env, t, cur.id), actual = null;
        for (var i = 0; i < cur.etapas.length; i++) if (R.faltan.indexOf(cur.etapas[i].id) >= 0) { actual = cur.etapas[i].titulo; break; }
        cursos[cur.id] = { hechos: R.hechos, total: R.total, avance: R.total ? R.hechos / R.total : 0, segundos: R.segundos, etapaActual: actual, plazoVencido: R.plazoVencido,
          iniciado: cur.etapas.some(function (e) { return !!P[e.id]; }),
          certificado: c ? { codigo: c.codigo, fecha: c.fechaEmision, vence: c.vence, url: c.archivoUrl, vencido: vencido(env, c), porVencer: !!(c.vence && (env.parseFecha(c.vence) - env.now()) < 60 * 86400000) } : null };
      });
      var ds = cursos.ds44;
      return {
        run: formatoRun(t.run), nombre: t.nombre, cargo: t.cargo, telefono: t.telefono, fechaRegistro: t.fechaRegistro, fechaInicio: t.fechaInicio, fechaLimite: t.fechaLimite,
        ultimoAcceso: t.ultimoAcceso, cursos: cursos, avance: ds.avance, hechos: ds.hechos, total: ds.total, segundos: ds.segundos, etapaActual: ds.etapaActual, plazoVencido: ds.plazoVencido,
        sesiones: asistencias(env, t).length, certificado: ds.certificado, carpeta: t.carpetaId ? env.drive.urlCarpeta(t.carpetaId) : '',
        progreso: rol === 'admin' ? Object.keys(P).map(function (k) { return { item: k, estado: P[k].estado, segundos: num(P[k].segundos), intentos: num(P[k].intentos), puntaje: P[k].puntaje }; }) : undefined
      };
    });
    var S = env.db.read('Sesiones').map(function (s) {
      var as = env.db.read('Asistencia').filter(function (a) { return a.sesionId === s.id; });
      return { id: s.id, codigo: rol === 'admin' ? s.codigo : '', fecha: s.fecha, horaInicio: s.horaInicio, horaTermino: s.horaTermino, tema: s.tema, modalidad: s.modalidad, lugar: s.lugar, facilitador: s.facilitador, estado: s.estado, asistentes: as.map(function (a) { return { run: formatoRun(a.run), nombre: a.nombre, fecha: a.fecha, metodo: a.metodo }; }), evidencias: parse(s.evidencias, []) };
    });
    var obs = rol === 'admin' ? env.db.read('Evaluaciones').filter(function (x) { return x.aprobado === 'TALLER'; }).map(function (x) {
      var t = trabajador(env, x.run), r = parse(x.respuestas, []);
      return { fecha: x.fecha, nombre: t ? t.nombre : x.run, cargo: t ? t.cargo : '', taller: x.evaluacion, respuestas: r.filter(function (q) { return q && q.abierta; }).map(function (q) { return { p: q.p, r: q.r }; }) };
    }).filter(function (o) { return o.respuestas.length; }).slice(-200) : [];
    var cOut = {}; for (var k in C) if (k.indexOf('HASH') < 0) cOut[k] = C[k];
    return { ok: true, rol: rol, trabajadores: lista, sesiones: S, talleres: obs, extras: rol === 'admin' ? extras(env, true).map(function (x) { delete x._row; return x; }) : [], config: rol === 'admin' ? cOut : { EMPRESA: C.EMPRESA, REQUIERE_SESIONES: C.REQUIERE_SESIONES }, raiz: env.drive.urlRaiz ? env.drive.urlRaiz() : '' };
  };

  A.adminSesionCrear = function (env, b) {
    if (!admin(env, b, true)) return NO_AUT;
    var C = cfg(env), id = 'S' + env.fmt(env.now(), 'archivo').replace(/[^0-9]/g, '').slice(2, 8) + '-' + codigoCorto(env).slice(0, 4);
    var s = { id: id, codigo: codigoCorto(env).slice(0, 6), fecha: b.fecha || env.fmt(env.now(), 'fecha'), horaInicio: b.horaInicio || '', horaTermino: b.horaTermino || '', tema: b.tema || 'Sesión', modalidad: b.modalidad || 'Presencial', lugar: b.lugar || '', facilitador: b.facilitador || C.FACILITADOR_NOMBRE, estado: 'abierta', evidencias: '[]', creada: env.fmt(env.now(), 'fechahora') };
    env.db.append('Sesiones', s);
    log(env, null, 'sesion_creada', 'ds44.sesiones', '', s.id + ' ' + s.tema, '');
    return { ok: true, sesion: s };
  };
  function sesionPorId(env, id) { var S = env.db.read('Sesiones'); for (var i = 0; i < S.length; i++) if (S[i].id === id) return S[i]; return null; }
  A.adminSesionEstado = function (env, b) {
    if (!admin(env, b, true)) return NO_AUT; var s = sesionPorId(env, b.sesionId); if (!s) return { ok: false, error: 'Sesión no encontrada.' };
    s.estado = b.estado === 'cerrada' ? 'cerrada' : 'abierta'; env.db.update('Sesiones', s); return { ok: true };
  };
  A.adminAsistencia = function (env, b) {
    if (!admin(env, b, true)) return NO_AUT; var s = sesionPorId(env, b.sesionId), t = trabajador(env, b.run);
    if (!s || !t) return { ok: false, error: 'Sesión o trabajador no encontrado.' };
    var existe = env.db.read('Asistencia').filter(function (a) { return a.sesionId === s.id && limpiarRun(a.run) === limpiarRun(t.run); })[0];
    if (b.presente && !existe) env.db.append('Asistencia', { sesionId: s.id, run: t.run, nombre: t.nombre, ciclo: 1, fecha: env.fmt(env.now(), 'fechahora'), metodo: 'registro manual de la facilitadora', firmaArchivo: '' });
    if (!b.presente && existe) env.db.remove('Asistencia', existe);
    log(env, t, 'asistencia_manual', 'ds44.sesiones', '', (b.presente ? 'presente ' : 'retira ') + s.id, '');
    return { ok: true };
  };
  A.adminEvidencia = function (env, b) {
    if (!admin(env, b, true)) return NO_AUT; var s = sesionPorId(env, b.sesionId); if (!s) return { ok: false, error: 'Sesión no encontrada.' };
    var f = env.drive.guardarEvidencia(s.id, b.nombre || ('evidencia_' + env.fmt(env.now(), 'archivo') + '.jpg'), b.dataUrl);
    var ev = parse(s.evidencias, []); ev.push({ nombre: b.nombre, url: f.url, fecha: env.fmt(env.now(), 'fechahora') }); s.evidencias = JSON.stringify(ev); env.db.update('Sesiones', s);
    return { ok: true, url: f.url };
  };
  A.adminResetPin = function (env, b) {
    if (!admin(env, b, true)) return NO_AUT; var t = trabajador(env, b.run); if (!t) return { ok: false, error: 'Trabajador no encontrado.' };
    if (!/^\d{4}$/.test(String(b.pin || ''))) return { ok: false, error: 'La clave debe tener 4 números.' };
    t.pinHash = hashPin(t.run, b.pin); t.token = ''; env.db.update('Trabajadores', t); log(env, t, 'clave_restablecida', '', '', 'por administradora', ''); return { ok: true };
  };
  /* Reinicia un curso: archiva su avance (queda en el registro con otro nombre) y deja el certificado anterior como reemplazado. */
  function reiniciarTrabajador(env, t, cursoId, motivo) {
    var sello = '~archivado_' + env.fmt(env.now(), 'archivo'), hubo = false;
    env.db.read('Progreso').forEach(function (p) { if (limpiarRun(p.run) === limpiarRun(t.run) && cursoDe(p.item) === cursoId && PLAN.etapa(p.item)) { p.item = p.item + sello; env.db.update('Progreso', p); hubo = true; } });
    env.db.read('Certificados').forEach(function (c) { if (limpiarRun(c.run) === limpiarRun(t.run) && (c.curso || 'ds44') === cursoId && c.estado === 'vigente') { c.estado = 'reemplazado'; env.db.update('Certificados', c); hubo = true; } });
    if (cursoId === 'ds44') {
      env.db.read('Asistencia').forEach(function (a) { if (limpiarRun(a.run) === limpiarRun(t.run) && a.ciclo !== 'archivado') { a.ciclo = 'archivado'; env.db.update('Asistencia', a); } });
      t.fechaInicio = ''; t.fechaLimite = ''; t.estado = 'registrado'; t.certCodigo = ''; t.certFecha = ''; t.certVence = ''; env.db.update('Trabajadores', t);
    }
    log(env, t, 'curso_reiniciado', cursoId, '', motivo || '', '');
    return hubo;
  }
  A.adminReiniciar = function (env, b) {
    if (!admin(env, b, true)) return NO_AUT; var t = trabajador(env, b.run); if (!t) return { ok: false, error: 'Trabajador no encontrado.' };
    reiniciarTrabajador(env, t, b.curso || 'ds44', b.motivo); return { ok: true };
  };
  /* Nueva versión de un documento: registra la versión vigente y pide la capacitación de nuevo a todos los que ya la habían iniciado o aprobado. */
  A.adminReiniciarCurso = function (env, b) {
    if (!admin(env, b, true)) return NO_AUT;
    var cur = PLAN.curso(b.curso); if (!cur) return { ok: false, error: 'Capacitación no encontrada.' };
    if (!String(b.motivo || '').trim()) return { ok: false, error: 'Indica el motivo (por ejemplo: nueva versión del PTS).' };
    if (b.version) env.setConfig('VERSION_' + cur.id, String(b.version).trim());
    var n = 0;
    env.db.read('Trabajadores').forEach(function (t) {
      if (t.estado === 'baja' || !aplica(cur, t.cargo)) return;
      var tieneAlgo = env.db.read('Progreso').some(function (p) { return limpiarRun(p.run) === limpiarRun(t.run) && cursoDe(p.item) === cur.id && PLAN.etapa(p.item); }) || !!certDe(env, t, cur.id);
      if (tieneAlgo && reiniciarTrabajador(env, t, cur.id, b.motivo + (b.version ? ' · versión ' + b.version : ''))) n++;
    });
    return { ok: true, reiniciados: n };
  };
  A.adminVersion = function (env, b) {
    if (!admin(env, b, true)) return NO_AUT;
    var cur = PLAN.curso(b.curso); if (!cur) return { ok: false, error: 'Capacitación no encontrada.' };
    env.setConfig('VERSION_' + cur.id, String(b.version || '').trim()); return { ok: true };
  };
  A.adminConfig = function (env, b) {
    if (!admin(env, b, true)) return NO_AUT;
    var permitidas = ['FACILITADOR_NOMBRE', 'FACILITADOR_RUN', 'FACILITADOR_TITULO', 'FACILITADOR_REGISTRO', 'REQUIERE_SESIONES', 'SESIONES_REQUERIDAS', 'HORAS_CURSO', 'MIN_MINUTOS_DS44', 'URL_SITIO', 'ORGANISMO', 'EMPRESA', 'RUT_EMPRESA', 'RL_NOMBRE', 'RL_RUN', 'RL_CARGO'];
    for (var k in (b.valores || {})) if (permitidas.indexOf(k) >= 0) env.setConfig(k, String(b.valores[k]));
    if (b.nuevaClaveAdmin) env.setConfig('ADMIN_CLAVE_HASH', sha256('pyv-admin|' + b.nuevaClaveAdmin));
    if (b.nuevaClaveSupervisor) env.setConfig('SUPERVISOR_CLAVE_HASH', sha256('pyv-admin|' + b.nuevaClaveSupervisor));
    return { ok: true };
  };

  A.adminFirma = function (env, b) {
    if (!admin(env, b, true)) return NO_AUT;
    var k = b.quien === 'rl' ? 'FIRMA_RL_ID' : 'FIRMA_APR_ID';
    if (!b.imagen) { env.setConfig(k, ''); return { ok: true }; }
    if (!/^data:image\/(png|jpeg);base64,/.test(String(b.imagen)) || String(b.imagen).length > 700000) return { ok: false, error: 'La firma debe ser una imagen PNG o JPG de menos de 500 KB.' };
    var id = env.drive.guardarFirma(k === 'FIRMA_RL_ID' ? 'Firma_representante_legal.png' : 'Firma_prevencion.png', b.imagen);
    env.setConfig(k, id);
    return { ok: true, id: id };
  };

  A.adminExpediente = function (env, b) {
    if (!admin(env, b, true)) return NO_AUT;
    var C = cfg(env), T = env.db.read('Trabajadores'), S = env.db.read('Sesiones'), As = env.db.read('Asistencia'), Ce = env.db.read('Certificados'), Fi = env.db.read('Firmas');
    var nombre = 'Expediente_capacitacion_' + env.fmt(env.now(), 'archivo');
    var carpeta = env.drive.nuevaCarpetaExpediente(nombre), ds = PLAN.curso('ds44'), reqSes = C.REQUIERE_SESIONES === 'SI';
    var mods = ds.modulos.filter(function (m) { return m.n >= 1 && m.n <= 8; }).map(function (m) { return '<li>' + esc(m.titulo) + '</li>'; }).join('');
    var talleres = ds.etapas.filter(function (e) { return e.tipo === 'taller'; }).map(function (e) { return '<li>' + esc(e.titulo) + '</li>'; }).join('');
    var filas = T.map(function (t) {
      var R = requisitos(env, t, 'ds44'), c = certDe(env, t, 'ds44'), cg = PLAN.cargo(t.cargo);
      return '<tr><td>' + esc(formatoRun(t.run)) + '</td><td>' + esc(t.nombre) + '</td><td>' + esc(cg ? cg.nombre : t.cargo) + '</td><td>' + esc(t.fechaInicio) + '</td><td>' + esc(c ? c.fechaEmision : '') + '</td><td>' + horasTxt(R.segundos) + '</td><td>' + R.hechos + '/' + R.total + '</td><td>' + (c ? 'Aprobado · ' + esc(c.codigo) + ' · vence ' + esc(c.vence) : (R.plazoVencido ? 'Plazo vencido' : 'En curso')) + '</td></tr>';
    }).join('');
    var otros = T.map(function (t) {
      return PLAN.cursosDe(t.cargo).filter(function (cur) { return cur.id !== 'ds44'; }).map(function (cur) {
        var R = requisitos(env, t, cur.id), c = certDe(env, t, cur.id);
        return '<tr><td>' + esc(t.nombre) + '</td><td>' + esc(cur.titulo) + '</td><td>' + R.hechos + '/' + R.total + '</td><td>' + horasTxt(R.segundos) + '</td><td>' + (c ? esc(c.codigo) + ' · ' + esc(c.fechaEmision) + (c.vence ? ' · vence ' + esc(c.vence) : '') : (R.hechos ? 'En curso' : 'Pendiente')) + '</td></tr>';
      }).join('');
    }).join('');
    var firmas = Fi.map(function (f) { var cur = PLAN.curso(f.curso); return '<tr><td>' + esc(f.fecha) + '</td><td>' + esc(f.nombre) + '</td><td>' + esc(cur ? cur.titulo : f.curso) + '</td><td>' + (f.constanciaUrl ? '<a href="' + esc(f.constanciaUrl) + '">PDF</a>' : '') + '</td></tr>'; }).join('');
    var ses = S.map(function (s) {
      var as = As.filter(function (a) { return a.sesionId === s.id; });
      return '<tr><td>' + esc(s.id) + '</td><td>' + esc(s.fecha) + ' ' + esc(s.horaInicio) + '–' + esc(s.horaTermino) + '</td><td>' + esc(s.tema) + '</td><td>' + esc(s.modalidad) + '</td><td>' + as.map(function (a) { return esc(a.nombre); }).join('<br>') + '</td></tr>';
    }).join('');
    var certs = Ce.map(function (c) { var cur = PLAN.curso(c.curso || 'ds44'); return '<tr><td>' + esc(c.codigo) + '</td><td>' + esc(c.nombre) + '</td><td>' + esc(cur ? cur.titulo : '') + '</td><td>' + esc(c.fechaEmision) + '</td><td>' + esc(c.vence || '—') + '</td><td>' + esc(c.estado) + '</td><td>' + (c.archivoUrl ? '<a href="' + esc(c.archivoUrl) + '">PDF</a>' : '') + '</td></tr>'; }).join('');
    var cuerpo = '<p>Expediente generado el <b>' + esc(env.fmt(env.now(), 'fechahora')) + '</b>.</p>' +
      '<h2>1. Curso obligatorio (art. 16 D.S. 44)</h2><p>' + esc(ds.titulo) + '. Duración: ' + esc(C.HORAS_CURSO) + ' horas cronológicas. Modalidad: e-learning asincrónico, con las cápsulas del curso tipo de la Subsecretaría de Previsión Social (formato SCORM), actividades prácticas y talleres asincrónicos adaptados a la realidad de la empresa' +
      (reqSes ? ', y ' + esc(C.SESIONES_REQUERIDAS) + ' sesiones sincrónicas con la facilitadora' : '') + '. Evaluación formativa al cierre de cada módulo con reintentos y retroalimentación; aprobación ' + Math.round(PLAN.notaAprobacion * 100) + '%. Plazo: ' + ds.plazoMeses + ' meses. Vigencia: ' + (ds.vigenciaMeses / 12) + ' años.</p>' +
      '<p>Módulos:</p><ul>' + mods + '</ul><p>Talleres asincrónicos (casos y ejercicios con respuesta escrita y retroalimentación):</p><ul>' + talleres + '</ul>' +
      '<p>Facilitadora: ' + esc(C.FACILITADOR_NOMBRE) + (C.FACILITADOR_RUN ? ' · RUN ' + esc(C.FACILITADOR_RUN) : '') + ' · ' + esc(C.FACILITADOR_TITULO) + (C.FACILITADOR_REGISTRO ? ' · Registro ' + esc(C.FACILITADOR_REGISTRO) : '') + '</p>' +
      '<h2>2. Nómina del curso obligatorio</h2><table><tr><th>RUN</th><th>Nombre</th><th>Cargo</th><th>Inicio</th><th>Término</th><th>Tiempo registrado</th><th>Etapas</th><th>Resultado</th></tr>' + filas + '</table>' +
      '<h2>3. Capacitaciones de la empresa (IRL, IPER, PRRD, EPP, accidentes y procedimientos)</h2><table><tr><th>Trabajador</th><th>Capacitación</th><th>Etapas</th><th>Tiempo</th><th>Resultado</th></tr>' + (otros || '<tr><td colspan="5">Sin registros</td></tr>') + '</table>' +
      '<h2>4. Constancias firmadas (IRL, EPP, procedimientos)</h2><table><tr><th>Fecha</th><th>Trabajador</th><th>Capacitación</th><th>Archivo</th></tr>' + (firmas || '<tr><td colspan="4">Sin firmas registradas</td></tr>') + '</table>' +
      (ses ? '<h2>5. Sesiones sincrónicas</h2><table><tr><th>ID</th><th>Fecha</th><th>Tema</th><th>Modalidad</th><th>Asistentes</th></tr>' + ses + '</table>' : '') +
      '<h2>' + (ses ? '6' : '5') + '. Certificados y constancias emitidos</h2><table><tr><th>Código</th><th>Nombre</th><th>Capacitación</th><th>Emisión</th><th>Vence</th><th>Estado</th><th>Archivo</th></tr>' + (certs || '<tr><td colspan="7">Sin registros</td></tr>') + '</table>' +
      '<p>El detalle de accesos, permanencia por etapa, intentos de evaluación y respuestas de talleres está en la planilla adjunta y en la carpeta individual de cada trabajador.</p>';
    var pdf = env.drive.guardarPdf(carpeta, '01_Programa_nomina_y_registros.pdf', constanciaHtml(C, 'Expediente de capacitación en prevención de riesgos', cuerpo, 'Conservar por al menos 5 años (Guía Técnica, punto 1.4).'));
    var copia = env.drive.copiarRegistro(carpeta, '02_Registro_detallado');
    log(env, null, 'expediente', '', '', nombre, '');
    return { ok: true, carpeta: env.drive.urlCarpeta(carpeta), pdf: pdf.url, registro: copia };
  };

  /* ---------- capacitaciones creadas desde el panel ---------- */
  function extras(env, todas) {
    var L = [];
    try { L = env.db.read('CursosExtra'); } catch (e) { return []; }
    return L.filter(function (x) { return todas || x.estado === 'publicado'; }).map(function (x) {
      return { id: x.id, titulo: x.titulo, sub: x.sub, cargos: x.cargos === '*' ? '*' : String(x.cargos || '').split(',').filter(Boolean), horas: num(x.horas) || 1,
        vigenciaMeses: num(x.vigenciaMeses), firma: x.firma === 'SI', declaracion: x.declaracion, documentoUrl: x.documentoUrl, contenido: parse(x.contenido, {}), estado: x.estado, actualizado: x.actualizado, _row: x._row };
    });
  }
  function cargarExtras(env) { extras(env).forEach(function (x) { PLAN.registrarExtra(x); }); }
  function extrasPara(env, cargo) { return extras(env).filter(function (x) { return x.cargos === '*' || x.cargos.indexOf(cargo) >= 0; }).map(function (x) { delete x._row; return x; }); }

  A.adminCursoGuardar = function (env, b) {
    if (!admin(env, b, true)) return NO_AUT;
    var x = b.curso || {};
    if (!x.titulo || String(x.titulo).trim().length < 4) return { ok: false, error: 'Escribe un título.' };
    var diap = (x.contenido && x.contenido.diapositivas) || [], preg = (x.contenido && x.contenido.preguntas) || [];
    if (!diap.length) return { ok: false, error: 'Agrega al menos una diapositiva.' };
    if (preg.length < 3) return { ok: false, error: 'Agrega al menos 3 preguntas.' };
    for (var i = 0; i < preg.length; i++) if (!preg[i].p || !preg[i].op || preg[i].op.length < 2 || !(preg[i].ok >= 1 && preg[i].ok <= preg[i].op.length)) return { ok: false, error: 'Revisa la pregunta ' + (i + 1) + ': necesita texto, alternativas y la correcta marcada.' };
    var L = env.db.read('CursosExtra'), fila = null, id = x.id;
    if (id) for (var j = 0; j < L.length; j++) if (L[j].id === id) fila = L[j];
    if (!id) id = 'x-' + String(x.titulo).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) + '-' + codigoCorto(env).slice(0, 4).toLowerCase();
    var o = { id: id, titulo: String(x.titulo).trim(), sub: String(x.sub || '').trim(), cargos: x.cargos === '*' ? '*' : (x.cargos || []).join(','), horas: num(x.horas) || 1,
      vigenciaMeses: num(x.vigenciaMeses), firma: x.firma ? 'SI' : 'NO', declaracion: String(x.declaracion || '').slice(0, 2000), documentoUrl: x.documentoUrl || (fila ? fila.documentoUrl : ''),
      contenido: JSON.stringify({ diapositivas: diap.slice(0, 40), preguntas: preg.slice(0, 40), n: Math.min(preg.length, num(x.contenido.n) || 6) }).slice(0, 48000),
      estado: x.estado === 'borrador' ? 'borrador' : 'publicado', creado: fila ? fila.creado : env.fmt(env.now(), 'fechahora'), actualizado: env.fmt(env.now(), 'fechahora') };
    if (fila) { o._row = fila._row; env.db.update('CursosExtra', o); } else env.db.append('CursosExtra', o);
    log(env, null, 'curso_guardado', id, '', o.estado + ' · ' + o.titulo, '');
    return { ok: true, id: id };
  };
  A.adminCursoDocumento = function (env, b) {
    if (!admin(env, b, true)) return NO_AUT;
    var f = env.drive.guardarDocumento(b.nombre || 'documento.pdf', b.dataUrl);
    return { ok: true, url: f.url };
  };

  function manejar(env, b) {
    b = b || {}; var fn = A[b.accion];
    cargarExtras(env);
    if (!fn) return { ok: false, error: 'Acción desconocida.' };
    return fn(env, b);
  }

  return { SCHEMA: SCHEMA, CONFIG_DEFAULT: CONFIG_DEFAULT, manejar: manejar, sha256: sha256, runValido: runValido, formatoRun: formatoRun, limpiarRun: limpiarRun, certificadoHtml: certificadoHtml };
})();
if (typeof module !== 'undefined') module.exports = CORE;
