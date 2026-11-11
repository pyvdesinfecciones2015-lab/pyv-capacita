/* PyV Capacita — aplicación del trabajador */
(function () {
  'use strict';
  var S = { token: null, perfil: null, vista: 'ruta', etapa: null, scormReal: {} };
  var app = document.getElementById('app');

  /* ---------- utilidades ---------- */
  function h(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function toast(t, ms) { var el = $('#toast'); el.textContent = t; el.classList.remove('oculto'); clearTimeout(toast._t); toast._t = setTimeout(function () { el.classList.add('oculto'); }, ms || 3200); }
  function mins(seg) { return Math.floor((seg || 0) / 60); }
  function hTxt(seg) { seg = Math.round(seg || 0); var hh = Math.floor(seg / 3600), mm = Math.floor((seg % 3600) / 60); return hh ? hh + ' h ' + mm + ' min' : mm + ' min'; }
  function fechaTxt(f) { if (!f) return ''; var m = String(f).match(/(\d{4})-(\d{2})-(\d{2})/); return m ? m[3] + '-' + m[2] + '-' + m[1] : f; }
  function barajar(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var ICONOS = {
    manual: '<path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z M17 20V7" fill="none" stroke="currentColor" stroke-width="2"/>',
    scorm: '<path d="M8 6l10 6-10 6z" fill="currentColor"/>',
    juego: '<path d="M7 9h10a4 4 0 0 1 0 8H7a4 4 0 0 1 0-8zM8 11v4M6 13h4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="12.5" r="1.2" fill="currentColor"/><circle cx="18" cy="14.5" r="1.2" fill="currentColor"/>',
    quiz: '<path d="M9 9a3 3 0 1 1 4 2.8c-.8.4-1 1-1 1.7V15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="18.5" r="1.3" fill="currentColor"/>',
    pyv: '<path d="M3 15h18l-3 4H6zM12 4v11M12 5l6 7h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    sesiones: '<circle cx="8" cy="9" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="9" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 19c0-3 2.5-5 5-5s5 2 5 5M11 19c0-3 2.5-5 5-5s5 2 5 5" fill="none" stroke="currentColor" stroke-width="2"/>',
    encuesta: '<path d="M5 5h14v10H9l-4 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    hecho: '<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
    flecha: '<path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    atras: '<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    leccion: '<rect x="3" y="5" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="2"/>',
    taller: '<path d="M14 4l6 6-9 9H5v-6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 6l6 6" stroke="currentColor" stroke-width="2"/>',
    firma: '<path d="M3 17c3-4 5-9 7-9s-1 9 2 9 3-5 5-5 2 3 4 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 21h18" stroke="currentColor" stroke-width="2"/>',
    cert: '<circle cx="12" cy="9" r="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 13l-2 8 5-3 5 3-2-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    candado: '<rect x="6" y="11" width="12" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 11V8a3 3 0 0 1 6 0v3" fill="none" stroke="currentColor" stroke-width="2"/>'
  };
  function ic(n, s) { return '<svg width="' + (s || 22) + '" height="' + (s || 22) + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONOS[n] || '') + '</svg>'; }

  /* ---------- estado local (avance sin conexión) ---------- */
  function claveLocal() { return 'pyv_local_' + (S.perfil ? S.perfil.run : ''); }
  function local() { return SRV.ls(claveLocal()) || {}; }
  function setLocal(item, datos) { var L = local(); L[item] = L[item] || {}; for (var k in datos) L[item][k] = datos[k]; SRV.ls(claveLocal(), L); }
  function prog(item) {
    var sv = (S.perfil && S.perfil.progreso[item]) || {}, lc = local()[item] || {};
    var det = sv.detalle || {};
    return {
      estado: (sv.estado === 'completado' || lc.estado === 'completado') ? 'completado' : ((sv.estado || lc.estado) ? 'en_curso' : ''),
      segundos: S.revision ? 1e7 : (sv.segundos || 0) + SRV.segundosPendientes(item) + (Tiempo.item === item ? Tiempo.acc : 0),
      scorm: lc.scorm || det.scorm || '', suspend: lc.suspend != null ? lc.suspend : (sv.suspend || ''), location: lc.location != null ? lc.location : (det.location || ''),
      intentos: Math.max(sv.intentos || 0, lc.intentos || 0), puntaje: sv.puntaje
    };
  }
  function hecho(item) { return prog(item).estado === 'completado'; }
  function reqDs44() { return (S.perfil && S.perfil.cursos && S.perfil.cursos.ds44 && S.perfil.cursos.ds44.requisitos) || { requiereSesiones: false, sesionesRequeridas: 2 }; }
  function etapasVisibles(cursoId) {
    var cur = PLAN.curso(cursoId || S.curso); if (!cur) return [];
    var req = reqDs44().requiereSesiones;
    return cur.etapas.filter(function (e) { return e.tipo !== 'sesiones' || req; });
  }
  function disponible(e) {
    if (S.revision) return true;
    var L = etapasVisibles(e.curso);
    if (L[0] && L[0].id === e.id) return true;
    if (e.tipo === 'sesiones') return hecho('ds44.manual');
    for (var i = 0; i < L.length && L[i].id !== e.id; i++) { if (L[i].tipo === 'sesiones') continue; if (!hecho(L[i].id)) return false; }
    return true;
  }
  function sesionesOk() { var R = reqDs44(); return !R.requiereSesiones || (S.perfil.sesiones || []).length >= R.sesionesRequeridas; }
  function completo(cursoId) { return etapasVisibles(cursoId).every(function (e) { return e.tipo === 'sesiones' ? sesionesOk() : hecho(e.id); }); }
  function etapaActual(cursoId) { var L = etapasVisibles(cursoId); for (var i = 0; i < L.length; i++) { var e = L[i]; if (e.tipo === 'sesiones') continue; if (!hecho(e.id)) return e; } return null; }
  function avanceCurso(cursoId) { var L = etapasVisibles(cursoId); var n = L.filter(function (e) { return e.tipo === 'sesiones' ? sesionesOk() : hecho(e.id); }).length; return { n: n, total: L.length }; }
  function certDe(cursoId) { var c = S.perfil.cursos && S.perfil.cursos[cursoId]; return c ? c.certificado : null; }
  function aplicarExtras() {
    ((S.perfil && S.perfil.extras) || []).forEach(function (x) {
      PLAN.registrarExtra(x);
      CONTENIDO.lecciones[x.id + '.l1'] = { documento: x.documentoUrl, diapositivas: (x.contenido && x.contenido.diapositivas) || [] };
      CONTENIDO.quiz[x.id] = { n: (x.contenido && x.contenido.n) || 6, preguntas: (x.contenido && x.contenido.preguntas) || [] };
      CONTENIDO.firmas[x.id + '.f1'] = { texto: x.declaracion || ('Declaro haber completado la capacitación ' + x.titulo + ' y comprender su contenido.') };
    });
  }

  /* ---------- tiempo de permanencia real ---------- */
  var Tiempo = { item: null, acc: 0, activo: Date.now(), limite: 180000 };
  Tiempo.iniciar = function (item, esScorm) { Tiempo.detener(); Tiempo.item = item; Tiempo.acc = 0; Tiempo.activo = Date.now(); Tiempo.limite = esScorm ? 300000 : 180000; SRV.encolar({ tipo: 'inicio', item: item }); };
  Tiempo.volcar = function () { if (Tiempo.item && Tiempo.acc > 0) { var s = Tiempo.acc; while (s > 0) { var c = Math.min(120, s); SRV.encolar({ tipo: 'tiempo', item: Tiempo.item, seg: c }); s -= c; } Tiempo.acc = 0; } };
  Tiempo.detener = function () { Tiempo.volcar(); Tiempo.item = null; SRV.enviar(S.token); };
  Tiempo.actividad = function () { Tiempo.activo = Date.now(); };
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (ev) { document.addEventListener(ev, Tiempo.actividad, { passive: true, capture: true }); });
  var ultVolcado = Date.now();
  setInterval(function () {
    if (!Tiempo.item) return;
    if (document.visibilityState === 'visible' && Date.now() - Tiempo.activo < Tiempo.limite) Tiempo.acc += 5;
    if (Date.now() - ultVolcado > 150000) { ultVolcado = Date.now(); Tiempo.volcar(); SRV.enviar(S.token); }
    if (typeof Tiempo.onTick === 'function') Tiempo.onTick();
  }, 5000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') { Tiempo.volcar(); SRV.enviar(S.token); } });
  setInterval(function () { SRV.enviar(S.token); }, 30000);
  window.addEventListener('online', function () { red(); SRV.enviar(S.token); });
  window.addEventListener('offline', red);
  function red() {
    var el = $('#red'), n = SRV.pendientes();
    if (!S.token || S.revision) { el.classList.add('oculto'); return; }
    el.classList.remove('oculto');
    if (!navigator.onLine && !SRV.demo) { el.textContent = 'Sin señal'; el.classList.add('off'); }
    else if (n > 0) { el.textContent = 'Guardando'; el.classList.remove('off'); }
    else { el.textContent = 'Guardado'; el.classList.remove('off'); }
  }
  SRV.onCambio(function (r) {
    if (r && r.perfil) { S.perfil = r.perfil; aplicarExtras(); limpiarLocalConfirmado(); }
    if (r && r.sesionExpirada) { salir(true); return; }
    red();
  });
  function limpiarLocalConfirmado() {
    var L = local(), cambio = false;
    for (var k in L) { var sv = S.perfil.progreso[k]; if (sv && sv.estado === 'completado' && L[k].estado === 'completado') { delete L[k].estado; cambio = true; } }
    if (cambio) SRV.ls(claveLocal(), L);
  }

  /* ---------- sesión ---------- */
  function guardarSesion() { SRV.ls('pyv_sesion', { token: S.token, perfil: S.perfil }); }
  function salir(expirada) {
    Tiempo.detener(); SRV.ls('pyv_sesion', null); S.token = null; S.perfil = null;
    $('#btn-salir').classList.add('oculto'); red(); vistaIngreso(expirada ? 'Tu sesión expiró. Ingresa de nuevo con tu RUN y clave.' : '');
  }
  $('#btn-salir').addEventListener('click', function () { if (!SRV.demo && SRV.pendientes() && !confirm('Hay avances sin enviar todavía. Si sales ahora podrían perderse. ¿Salir igual?')) return; salir(); });

  function iniciarSesion(r) {
    S.token = r.token; S.perfil = r.perfil; aplicarExtras(); guardarSesion();
    $('#btn-salir').classList.remove('oculto'); red(); ir('cursos');
  }

  /* ---------- navegación ---------- */
  function ir(vista, etapaId) {
    if (S.vista !== vista || S.etapa !== etapaId) Tiempo.detener();
    S.vista = vista; S.etapa = etapaId || null; Tiempo.onTick = null;
    window.scrollTo(0, 0);
    if (vista === 'cursos') return vistaCursos();
    if (vista === 'ruta') { if (etapaId) S.curso = etapaId; return PLAN.curso(S.curso) ? vistaRuta() : vistaCursos(); }
    if (vista === 'certificado') { if (etapaId) S.curso = etapaId; return vistaCertificado(); }
    var e = PLAN.etapa(etapaId);
    if (!e) return vistaCursos();
    S.curso = e.curso;
    ({ manual: vistaManual, scorm: vistaScorm, juego: vistaJuego, quiz: vistaQuiz, pyv: vistaPyv, sesiones: vistaSesiones, encuesta: vistaEncuesta, taller: vistaTaller, leccion: vistaLeccion, firma: vistaFirma })[e.tipo](e);
  }
  function encabezadoEtapa(e) {
    var cur = PLAN.curso(e.curso), m = cur.modulos ? cur.modulos.filter(function (x) { return x.n === e.modulo; })[0] : null;
    return '<button class="volver" type="button" data-volver>' + ic('atras', 18) + 'Volver al curso</button>' +
      '<div class="etiqueta-mod">' + h(m ? m.titulo : cur.titulo) + '</div><h1>' + h(PLAN.tituloEtapa(e, S.perfil.cargo)) + '</h1>';
  }
  function enlazarVolver() { $$('[data-volver]').forEach(function (b) { b.addEventListener('click', function () { ir('ruta', S.curso); }); }); }

  /* ---------- ingreso y registro ---------- */
  function vistaIngreso(msg) {
    S.vista = 'ingreso';
    var grupo = function (areas, et) { return '<optgroup label="' + et + '">' + PLAN.cargos.filter(function (c) { return areas.indexOf(c.area) >= 0; }).map(function (c) { return '<option value="' + c.id + '">' + h(c.nombre) + '</option>'; }).join('') + '</optgroup>'; };
    var opciones = grupo(['faena'], 'Embarcaciones y faena') + grupo(['mixto', 'oficina'], 'Gerencia y oficina');
    app.innerHTML =
      '<section class="portada"><h1>Capacitación en prevención de riesgos</h1><p>Curso de 8 horas del D.S. 44 para el personal de ' + h(CONTENIDO.empresa.nombre) + '. Avanza desde tu celular, a tu ritmo, aunque se corte la señal.</p>' +
      '<svg class="olas" viewBox="0 0 400 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40 C 50 20, 100 60, 150 40 S 250 20, 300 40 S 380 55, 400 38 V70 H0z" fill="#E9EFF1"/><path d="M0 52 C 60 38, 110 66, 170 52 S 280 38, 340 52 S 390 60, 400 50" fill="none" stroke="#F26B1D" stroke-width="3"/></svg></section>' +
      '<section class="tarjeta">' +
      '<img class="logo-ingreso" src="img/logo_pyv.png" alt="Servicios Acuícolas PyV">' +
      '<div class="pestanas" role="tablist"><button type="button" class="act" data-tab="ingresar">Ya me registré</button><button type="button" data-tab="registrar">Primera vez</button></div>' +
      (msg ? '<div class="aviso info">' + h(msg) + '</div>' : '') +
      '<form id="f-ingresar" autocomplete="on">' +
      '<label class="campo">RUN<input type="text" name="run" inputmode="text" autocomplete="username" placeholder="12.345.678-9" required></label>' +
      '<label class="campo">Clave de 4 números<input class="pin" type="password" name="pin" inputmode="numeric" maxlength="4" pattern="\\d{4}" autocomplete="current-password" required></label>' +
      '<div class="msg"></div><button class="btn btn-pri btn-bloque" type="submit">Entrar</button>' +
      '<p class="peq suave" style="margin-top:12px">¿Olvidaste tu clave? Pídele a la encargada de prevención que la restablezca.</p></form>' +
      '<form id="f-registrar" class="oculto" autocomplete="on">' +
      '<label class="campo">Nombre completo<input type="text" name="nombre" autocomplete="name" required></label>' +
      '<label class="campo">RUN<span class="ayuda">Con dígito verificador. Queda asociado a tu certificado.</span><input type="text" name="run" autocomplete="username" placeholder="12.345.678-9" required></label>' +
      '<label class="campo">Cargo<select name="cargo" required><option value="">Elige tu cargo</option>' + opciones + '</select></label>' +
      '<label class="campo">Celular (opcional)<span class="ayuda">Para recordarte si te falta terminar.</span><input type="tel" name="telefono" autocomplete="tel" placeholder="+56 9 ..."></label>' +
      '<label class="campo">Crea una clave de 4 números<input class="pin" type="password" name="pin" inputmode="numeric" maxlength="4" pattern="\\d{4}" autocomplete="new-password" required></label>' +
      '<label class="campo">Repite la clave<input class="pin" type="password" name="pin2" inputmode="numeric" maxlength="4" pattern="\\d{4}" autocomplete="new-password" required></label>' +
      '<label class="check"><input type="checkbox" name="consentimiento" required><span>Acepto que ' + h(CONTENIDO.empresa.corto) + ' registre mis datos, accesos, tiempos y evaluaciones de este curso para acreditar mi capacitación ante la autoridad. Mis datos no se usan para otro fin.</span></label>' +
      '<div class="msg"></div><button class="btn btn-pri btn-bloque" type="submit">Crear mi cuenta</button></form>' +
      '</section><p class="pie">Ayuda: Prevención de Riesgos ' + h(CONFIG.SOPORTE) + '</p>';
    $$('.pestanas button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.pestanas button').forEach(function (x) { x.classList.toggle('act', x === b); });
        $('#f-ingresar').classList.toggle('oculto', b.dataset.tab !== 'ingresar');
        $('#f-registrar').classList.toggle('oculto', b.dataset.tab !== 'registrar');
      });
    });
    function enviarForm(form, accion, datos) {
      var msg = $('.msg', form), btn = $('button[type=submit]', form);
      if (!navigator.onLine && !SRV.demo) { msg.innerHTML = '<div class="aviso error">Necesitas señal para entrar la primera vez. Después puedes avanzar sin señal.</div>'; return; }
      btn.disabled = true; msg.innerHTML = '';
      SRV.llamar(accion, datos).then(function (r) {
        btn.disabled = false;
        if (r.ok) iniciarSesion(r); else msg.innerHTML = '<div class="aviso error">' + h(r.error || r.mensaje) + '</div>';
      }).catch(function () { btn.disabled = false; msg.innerHTML = '<div class="aviso error">No se pudo conectar. Revisa tu señal e inténtalo de nuevo.</div>'; });
    }
    $('#f-ingresar').addEventListener('submit', function (ev) {
      ev.preventDefault(); var f = ev.target;
      enviarForm(f, 'ingresar', { run: f.run.value, pin: f.pin.value });
    });
    $('#f-registrar').addEventListener('submit', function (ev) {
      ev.preventDefault(); var f = ev.target, msg = $('.msg', f);
      if (!CORE.runValido(f.run.value)) { msg.innerHTML = '<div class="aviso error">El RUN no es válido. Revisa el dígito verificador.</div>'; return; }
      if (f.pin.value !== f.pin2.value) { msg.innerHTML = '<div class="aviso error">Las claves no coinciden.</div>'; return; }
      enviarForm(f, 'registrar', { nombre: f.nombre.value, run: f.run.value, cargo: f.cargo.value, telefono: f.telefono.value, pin: f.pin.value, consentimiento: f.consentimiento.checked });
    });
  }

  /* ---------- ruta del curso ---------- */
  function vistaRuta() {
    var P = S.perfil, cur = PLAN.curso(S.curso), L = etapasVisibles(cur.id), cert = certDe(cur.id), esDs = cur.id === 'ds44';
    var av = avanceCurso(cur.id), total = av.total, n = av.n;
    var seg = L.reduce(function (s, e) { return s + prog(e.id).segundos; }, 0);
    var actual = etapaActual(cur.id);
    var rq = (P.cursos && P.cursos[cur.id] && P.cursos[cur.id].requisitos) || {}, durMin = rq.duracionMin || cur.duracionMin || 0;
    var chips = S.revision ? '<span class="chip">Duración del programa <b>' + h(PLAN.duracionTxt(durMin)) + '</b></span><span class="chip alerta">Modo revisión: todas las etapas abiertas</span>' : '<span class="chip">Tiempo registrado <b>' + hTxt(seg) + '</b>' + (durMin ? ' de ' + h(PLAN.duracionTxt(durMin).replace(' cronológicas', '').replace(' cronológica', '')) : '') + '</span>';
    if (esDs && P.fechaLimite && !cert) {
      var dias = Math.ceil((new Date(P.fechaLimite + 'T23:59:59') - new Date()) / 86400000);
      chips += '<span class="chip' + (dias < 0 ? ' peligro' : dias <= 21 ? ' alerta' : '') + '">' + (dias < 0 ? 'Plazo vencido' : 'Plazo hasta <b>' + fechaTxt(P.fechaLimite) + '</b>') + '</span>';
    }
    if (cert) chips += '<span class="chip' + (cert.vencido ? ' peligro' : '') + '">' + (cert.vencido ? 'Certificado vencido' : 'Certificado' + (cert.vence ? ' vigente hasta <b>' + fechaTxt(cert.vence) + '</b>' : ' vigente')) + '</span>';
    var html = '<button class="volver" type="button" data-inicio>' + ic('atras', 18) + 'Mis cursos</button><div class="encabezado"><div class="quien"><h1>' + h(cur.titulo) + '</h1><div class="suave">' + h(cur.sub || '') + '</div><div class="chips">' + chips + '</div></div></div>' +
      (cur.documentoUrl ? '<p><a href="' + h(cur.documentoUrl) + '" target="_blank" rel="noopener">Ver el documento de esta capacitación</a></p>' : '') +
      '<div class="medidor"><div class="medidor-barra"><i style="width:' + Math.round(n / total * 100) + '%"></i></div><div class="medidor-txt"><span>' + n + ' de ' + total + ' etapas</span><span>' + Math.round(n / total * 100) + '%</span></div></div>';
    if (esDs && reqDs44().plazoVencido) html += '<div class="aviso error">Se cumplieron los 3 meses sin terminar el curso. Habla con la encargada de prevención para reiniciarlo.</div>';
    html += '<div class="derrotero">';
    var modAnt = -1;
    L.forEach(function (e) {
      if (e.modulo !== modAnt) { modAnt = e.modulo; var m = cur.modulos ? cur.modulos.filter(function (x) { return x.n === e.modulo; })[0] : { titulo: 'Etapas' }; html += '<div class="tramo"><h3>' + h(m.titulo) + '</h3></div>'; }
      var p = prog(e.id), ok = e.tipo === 'sesiones' ? sesionesOk() : p.estado === 'completado', disp = disponible(e);
      var esActual = actual && actual.id === e.id;
      var meta = '';
      if (e.tipo === 'scorm') meta = ok ? 'Completada · ' + hTxt(p.segundos) : (p.segundos ? hTxt(p.segundos) + ' de ' + e.minMin + ' min mínimo' : 'Cápsula oficial · ' + e.minMin + ' min mínimo');
      else if (e.tipo === 'quiz') meta = ok ? 'Aprobada' + (p.puntaje !== '' && p.puntaje != null ? ' · ' + Math.round(p.puntaje * 100) + '%' : '') : (p.intentos ? p.intentos + ' intento(s) · puedes repetirla' : 'Evaluación formativa');
      else if (e.tipo === 'juego') meta = ok ? 'Actividad completada' : 'Actividad práctica';
      else if (e.tipo === 'sesiones') meta = (P.sesiones || []).length + ' de ' + reqDs44().sesionesRequeridas + ' sesiones registradas';
      else if (e.tipo === 'taller') meta = ok ? 'Taller entregado' : 'Taller práctico · ' + e.minMin + ' min mínimo';
      else if (e.tipo === 'leccion') meta = ok ? 'Vista · ' + hTxt(p.segundos) : 'Cápsula · ' + e.minMin + ' min mínimo';
      else if (e.tipo === 'firma') meta = ok ? 'Firmada' : 'Firma con tu dedo';
      else if (e.tipo === 'manual') meta = ok ? 'Descargado' : 'Descárgalo antes de empezar';
      else if (e.tipo === 'pyv') meta = ok ? 'Revisado' : 'Riesgos, procedimientos y emergencias de tu cargo';
      else if (e.tipo === 'encuesta') meta = ok ? 'Respondida' : '2 minutos';
      if (S.revision) meta = ({ scorm: 'Cápsula oficial', quiz: 'Evaluación', juego: 'Actividad práctica', taller: 'Taller práctico', leccion: 'Cápsula', firma: 'Firma del trabajador', manual: 'Manual del participante', pyv: 'Riesgos de su cargo', encuesta: 'Encuesta', sesiones: 'Sesiones presenciales' })[e.tipo] + (e.minMin ? ' · ' + e.minMin + ' min mínimo' : '') + (ok ? ' · revisada' : '');
      var cls = 'etapa' + (ok ? ' hecha' : '') + (esActual ? ' actual' : '') + (!disp ? ' bloq' : '');
      html += '<button type="button" class="' + cls + '" data-etapa="' + e.id + '"' + (!disp ? ' aria-disabled="true"' : '') + '>' +
        '<span class="boya">' + (ok ? '<svg width="14" height="14" viewBox="0 0 24 24" style="color:#fff">' + ICONOS.hecho + '</svg>' : '') + '</span>' +
        '<span class="ic">' + ic(disp ? e.tipo : 'candado') + '</span><span class="tx"><span class="tt">' + h(PLAN.tituloEtapa(e, P.cargo)) + '</span><span class="mt">' + h(meta) + '</span></span>' +
        (disp ? '<span class="ir">' + ic('flecha', 18) + '</span>' : '') + '</button>';
    });
    var fin = completo(cur.id), vig = cur.vigenciaMeses ? (cur.vigenciaMeses % 12 === 0 ? (cur.vigenciaMeses / 12) + (cur.vigenciaMeses === 12 ? ' año' : ' años') : cur.vigenciaMeses + ' meses') : '';
    html += '<div class="puerto"><h2>' + (cert && !cert.vencido ? 'Capacitación aprobada' : 'Certificado') + '</h2>' +
      (cert && !cert.vencido ? '<p>Código ' + h(cert.codigo) + (cert.vence ? ' · vigente hasta ' + fechaTxt(cert.vence) : '') + '.</p><button class="btn btn-pri" type="button" data-cert>Ver mi certificado</button>'
        : cert && cert.vencido ? '<p>Tu certificado anterior (' + h(cert.codigo) + ') venció el ' + fechaTxt(cert.vence) + '. Pide a prevención de riesgos que reinicie esta capacitación para renovarlo.</p>'
        : fin && durMin && seg < durMin * 60 ? '<p>Completaste todas las etapas. El programa dura <b>' + h(PLAN.duracionTxt(durMin)) + '</b> y llevas ' + hTxt(seg) + ' registrados: te faltan unos <b>' + Math.ceil((durMin * 60 - seg) / 60) + ' minutos</b>. Repasa las cápsulas, lecturas y talleres; el tiempo se suma solo mientras estás activo en la pantalla.</p>'
        : fin ? '<p>Completaste todas las etapas. Ya puedes emitir tu certificado.</p><button class="btn btn-pri" type="button" data-cert>Emitir mi certificado</button>'
          : '<p>Se emite al completar todas las etapas' + (esDs && reqDs44().requiereSesiones ? ' y las sesiones' : '') + '. Queda guardado con tu RUN' + (vig ? ' y vale ' + vig : '') + '.</p>') + '</div>';
    html += '</div><p class="pie">' + h(CONTENIDO.empresa.nombre) + ' · Facilitadora: ' + h(P.facilitador || CONTENIDO.empresa.apr) + '</p>';
    app.innerHTML = html;
    $$('[data-etapa]').forEach(function (b) {
      b.addEventListener('click', function () { var e = PLAN.etapa(b.dataset.etapa); if (!disponible(e)) { toast('Completa primero las etapas anteriores.'); return; } ir(e.tipo, e.id); });
    });
    var bc = $('[data-cert]'); if (bc) bc.addEventListener('click', function () { ir('certificado', cur.id); });
    $('[data-inicio]').addEventListener('click', function () { ir('cursos'); });
  }

  /* ---------- mis cursos ---------- */
  function vistaCursos() {
    S.vista = 'cursos';
    var P = S.perfil, cargo = PLAN.cargo(P.cargo), cursos = PLAN.cursosDe(P.cargo);
    function tarjeta(cur) {
      var av = avanceCurso(cur.id), cert = certDe(cur.id), pct = av.total ? Math.round(av.n / av.total * 100) : 0;
      var estado = cert && !cert.vencido ? '<span class="chip ok-chip">Aprobado' + (cert.vence ? ' · vence ' + fechaTxt(cert.vence) : '') + '</span>'
        : cert && cert.vencido ? '<span class="chip peligro">Vencido · repetir</span>'
          : av.n ? '<span class="chip alerta">En curso · ' + pct + '%</span>' : '<span class="chip">Pendiente</span>';
      return '<button type="button" class="curso" data-curso="' + h(cur.id) + '"><span class="curso-ic">' + ic(cert && !cert.vencido ? 'cert' : (cur.pts ? 'manual' : cur.id === 'ds44' ? 'scorm' : 'leccion')) + '</span><span class="tx"><span class="tt">' + h(cur.titulo) + '</span><span class="mt">' + h(cur.sub || '') + '</span>' +
        '<span class="medidor-barra mini-barra"><i style="width:' + pct + '%"></i></span>' + estado + '</span><span class="ir">' + ic('flecha', 18) + '</span></button>';
    }
    var oblig = cursos.filter(function (c) { return c.obligatorio; }), otros = cursos.filter(function (c) { return !c.obligatorio && !c.pts && !c.extra; }), pts = cursos.filter(function (c) { return c.pts; }), extra = cursos.filter(function (c) { return c.extra; });
    var aprob = cursos.filter(function (c) { var x = certDe(c.id); return x && !x.vencido; }).length;
    app.innerHTML = '<div class="encabezado"><div class="quien"><div class="suave peq">' + (S.revision ? 'Así lo ve el cargo' : 'Hola,') + '</div><h1>' + h(S.revision ? (cargo ? cargo.nombre : '') : P.nombre.split(' ')[0]) + '</h1><div class="suave">' + h(cargo ? cargo.nombre : '') + ' · ' + h(P.run) + '</div>' +
      '<div class="chips"><span class="chip">Aprobadas <b>' + aprob + ' de ' + cursos.length + '</b></span></div></div></div>' +
      '<h2 class="seccion">Obligatorias</h2>' + oblig.map(tarjeta).join('') +
      (otros.length ? '<h2 class="seccion">Capacitaciones de PyV</h2>' + otros.map(tarjeta).join('') : '') +
      (pts.length ? '<h2 class="seccion">Procedimientos de tu cargo</h2>' + pts.map(tarjeta).join('') : '') +
      (extra.length ? '<h2 class="seccion">Nuevas capacitaciones</h2>' + extra.map(tarjeta).join('') : '') +
      '<p class="pie">' + h(CONTENIDO.empresa.nombre) + ' · Facilitadora: ' + h(P.facilitador || CONTENIDO.empresa.apr) + '</p>';
    $$('[data-curso]').forEach(function (b) { b.addEventListener('click', function () { S.curso = b.dataset.curso; ir('ruta', b.dataset.curso); }); });
  }

  /* ---------- manual ---------- */
  function vistaManual(e) {
    var ok = hecho(e.id);
    app.innerHTML = encabezadoEtapa(e) + '<section class="tarjeta">' +
      '<p>Antes de empezar los módulos debes descargar el <b>Manual del participante</b>. Tiene todos los contenidos del curso para que los consultes cuando quieras, incluso sin señal.</p>' +
      '<a class="btn btn-sec btn-bloque" href="' + h(CONFIG.MANUAL) + '" target="_blank" rel="noopener" download id="dl-manual">Descargar manual (PDF, 11 MB)</a>' +
      (ok ? '<div class="aviso ok">Ya registraste la descarga del manual.</div><button class="btn btn-pri btn-bloque" type="button" data-volver>Continuar</button>' :
        '<label class="check" id="ck-manual-l"><input type="checkbox" id="ck-manual" disabled><span>Descargué y recibí el Manual del participante.</span></label>' +
        '<button class="btn btn-pri btn-bloque" type="button" id="ok-manual" disabled>Confirmar y continuar</button>') + '</section>';
    enlazarVolver(); Tiempo.iniciar(e.id);
    if (ok) return;
    $('#dl-manual').addEventListener('click', function () { $('#ck-manual').disabled = false; setLocal(e.id, { descargado: Date.now() }); });
    if (local()[e.id] && local()[e.id].descargado) $('#ck-manual').disabled = false;
    $('#ck-manual').addEventListener('change', function () { $('#ok-manual').disabled = !this.checked; });
    $('#ok-manual').addEventListener('click', function () {
      Tiempo.volcar(); SRV.encolar({ tipo: 'completar', item: e.id }); setLocal(e.id, { estado: 'completado' }); SRV.enviar(S.token); toast('Manual registrado.'); ir('ruta');
    });
  }

  /* ---------- cápsulas SCORM ---------- */
  function vistaScorm(e) {
    var p = prog(e.id), ok = p.estado === 'completado';
    var termino = ['passed', 'completed'].indexOf(p.scorm) >= 0, faltaMin = Math.max(0, e.minMin - mins(p.segundos));
    var estado = ok ? '<div class="aviso ok">Cápsula completada. Puedes volver a verla cuando quieras.</div>' :
      termino && faltaMin > 0 ? '<div class="aviso info">Llegaste al final, pero el registro de permanencia indica ' + mins(p.segundos) + ' de ' + e.minMin + ' minutos. Vuelve a revisarla con calma: se completará al alcanzar el mínimo.</div>' :
        p.segundos ? '<div class="aviso info">Llevas ' + hTxt(p.segundos) + '. Al abrirla puedes continuar donde quedaste.</div>' : '';
    app.innerHTML = encabezadoEtapa(e) + '<section class="tarjeta"><p>Cápsula oficial del curso tipo de la Subsecretaría de Previsión Social, con narración y actividades. Usa audífonos o sube el volumen.</p>' +
      '<div class="chips"><span class="chip">Mínimo de permanencia <b>' + e.minMin + ' min</b></span><span class="chip">Registrado <b>' + hTxt(p.segundos) + '</b></span></div>' + estado +
      '<button class="btn btn-pri btn-bloque" type="button" id="abrir" style="margin-top:14px">' + (ok ? 'Volver a ver la cápsula' : p.segundos ? 'Continuar la cápsula' : 'Abrir la cápsula') + '</button>' +
      '<p class="peq suave" style="margin-top:12px">El tiempo solo se cuenta mientras la cápsula está abierta en pantalla y la estás usando. Si dejas el celular, se pausa.</p></section>' +
      (ok ? '' : '<p class="peq suave">Cuando termines, la ruta desbloquea la actividad práctica y la evaluación del módulo.</p>');
    enlazarVolver();
    $('#abrir').addEventListener('click', function () { abrirReproductor(e); });
  }

  var SC = null;
  function revisarTerminoScorm(e) {
    var p = prog(e.id);
    if (p.estado !== 'completado' && ['passed', 'completed'].indexOf(p.scorm) >= 0 && p.segundos >= e.minMin * 60) {
      Tiempo.volcar(); SRV.encolar({ tipo: 'completar', item: e.id }); setLocal(e.id, { estado: 'completado' }); SRV.enviar(S.token);
      toast('Cápsula completada. Se desbloqueó la actividad práctica.', 4500);
      return true;
    }
    return false;
  }
  function existeScorm(carpeta) {
    if (!SRV.demo) return Promise.resolve(true);
    if (S.scormReal[carpeta] != null) return Promise.resolve(S.scormReal[carpeta]);
    return fetch(CONFIG.SCORM_BASE + carpeta + '/index_lms.html', { method: 'HEAD' }).then(function (r) { return (S.scormReal[carpeta] = r.ok); }).catch(function () { return (S.scormReal[carpeta] = false); });
  }
  function abrirReproductor(e) {
    var p = prog(e.id);
    SC = { e: e, vals: { 'cmi.core.lesson_status': p.scorm || 'not attempted', 'cmi.suspend_data': p.suspend || '', 'cmi.core.lesson_location': p.location || '' }, pend: false };
    var div = document.createElement('div'); div.className = 'reproductor';
    div.innerHTML = '<div class="rp-barra"><button class="btn-barra" type="button" id="rp-cerrar">Cerrar</button><div class="tt">' + h(e.titulo) + '<span class="tm" id="rp-tm"></span></div></div><div id="rp-cuerpo" style="flex:1;display:flex"></div>';
    document.body.appendChild(div); document.body.style.overflow = 'hidden';
    Tiempo.iniciar(e.id, true);
    function pintarTm() { var q = prog(e.id); var t = $('#rp-tm'); if (t) t.textContent = 'Registrado ' + mins(q.segundos) + ' de ' + e.minMin + ' min mínimo'; }
    pintarTm(); Tiempo.onTick = function () { pintarTm(); revisarTerminoScorm(e); };
    existeScorm(e.carpeta).then(function (real) {
      var cuerpo = $('#rp-cuerpo');
      if (real) {
        var fr = document.createElement('iframe'); fr.src = CONFIG.SCORM_BASE + e.carpeta + '/index_lms.html'; fr.title = e.titulo; fr.allow = 'autoplay; fullscreen';
        fr.addEventListener('load', function () {
          try { ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { fr.contentWindow.document.addEventListener(ev, Tiempo.actividad, { passive: true, capture: true }); }); } catch (x) { }
        });
        cuerpo.appendChild(fr);
      } else {
        cuerpo.innerHTML = '<div class="demo-scorm"><h2 style="color:#fff">Cápsula oficial ' + h(e.carpeta.toUpperCase()) + '</h2><p style="color:#cfe0e6;max-width:40ch">En la plataforma instalada aquí se reproduce la cápsula SCORM de la Subsecretaría, con audio y actividades. En esta demostración puedes simular su término.</p>' +
          '<button class="btn btn-pri" type="button" id="sim">Simular cápsula completa</button></div>';
        $('#sim').addEventListener('click', function () {
          var falta = Math.max(0, e.minMin * 60 - prog(e.id).segundos); while (falta > 0) { var c = Math.min(120, falta); SRV.encolar({ tipo: 'tiempo', item: e.id, seg: c }); falta -= c; }
          window.API.LMSSetValue('cmi.core.lesson_status', 'passed'); window.API.LMSCommit(''); revisarTerminoScorm(e); cerrar();
        });
      }
    });
    function cerrar() {
      enviarScorm(true); Tiempo.detener(); revisarTerminoScorm(e);
      div.remove(); document.body.style.overflow = ''; SC = null; vistaScorm(e);
    }
    $('#rp-cerrar').addEventListener('click', cerrar);
  }
  var tScorm = null;
  function enviarScorm(ya) {
    if (!SC || !SC.pend) return; clearTimeout(tScorm);
    var f = function () {
      if (!SC) return; SC.pend = false;
      SRV.encolar({ tipo: 'scorm', item: SC.e.id, status: SC.vals['cmi.core.lesson_status'], suspend: SC.vals['cmi.suspend_data'], location: SC.vals['cmi.core.lesson_location'] });
    };
    if (ya) f(); else tScorm = setTimeout(f, 4000);
  }
  window.API = {
    LMSInitialize: function () { return 'true'; },
    LMSFinish: function () { enviarScorm(true); SRV.enviar(S.token); return 'true'; },
    LMSGetValue: function (k) {
      if (!SC) return '';
      if (k in SC.vals) return SC.vals[k];
      if (k === 'cmi.core.student_name') { var n = S.perfil.nombre.split(' '); return (n.slice(1).join(' ') || n[0]) + ', ' + n[0]; }
      if (k === 'cmi.core.student_id') return S.perfil.run;
      if (k === 'cmi.core.entry') return SC.vals['cmi.suspend_data'] ? 'resume' : 'ab-initio';
      if (k === 'cmi.core.lesson_mode') return 'normal';
      if (k === 'cmi.core.credit') return 'credit';
      if (k === 'cmi.launch_data') return '';
      return '';
    },
    LMSSetValue: function (k, v) {
      if (!SC) return 'false'; Tiempo.actividad();
      SC.vals[k] = String(v);
      if (k === 'cmi.core.lesson_status' || k === 'cmi.suspend_data' || k === 'cmi.core.lesson_location') {
        var d = {}; if (k === 'cmi.core.lesson_status') d.scorm = String(v); if (k === 'cmi.suspend_data') d.suspend = String(v); if (k === 'cmi.core.lesson_location') d.location = String(v);
        setLocal(SC.e.id, d); SC.pend = true; enviarScorm(k === 'cmi.core.lesson_status');
        if (k === 'cmi.core.lesson_status') revisarTerminoScorm(SC.e);
      }
      return 'true';
    },
    LMSCommit: function () { enviarScorm(true); return 'true'; },
    LMSGetLastError: function () { return '0'; }, LMSGetErrorString: function () { return ''; }, LMSGetDiagnostic: function () { return ''; }
  };

  /* ---------- actividades prácticas ---------- */
  function defJuego(e) {
    var area = PLAN.area(S.perfil.cargo), fuente = e.tipo === 'taller' ? CONTENIDO.talleres : CONTENIDO.juegos;
    var d = (area === 'oficina' && fuente[e.id + '_oficina']) || fuente[e.id];
    return typeof d === 'function' ? d(S.perfil.cargo) : d;
  }
  function vistaJuego(e) {
    var area = PLAN.area(S.perfil.cargo), def = defJuego(e), esTaller = e.tipo === 'taller';
    app.innerHTML = encabezadoEtapa(e) + '<p>' + h(def.intro) + '</p>' + (esTaller ? '<div class="chips" style="margin-bottom:12px"><span class="chip">Taller asincrónico · mínimo <b>' + e.minMin + ' min</b></span></div>' : '') + '<section id="juego"></section>';
    enlazarVolver(); Tiempo.iniciar(e.id);
    JUEGOS.jugar($('#juego'), def, { cargo: S.perfil.cargo, area: area }, function (puntaje, detalle) {
      var resp = [];
      (detalle || []).forEach(function (d) { if (d && d.abierta) resp.push(d); });
      function entregar() {
        Tiempo.volcar();
        SRV.encolar({ tipo: esTaller ? 'taller' : 'juego', item: e.id, puntaje: puntaje, respuestas: resp }); setLocal(e.id, { estado: 'completado' }); SRV.enviar(S.token);
        $('#juego').insertAdjacentHTML('beforeend', '<section class="tarjeta resultado"><div class="cifra">' + Math.round(puntaje * 100) + '%</div><p>' + (esTaller ? 'Taller entregado. Tus respuestas quedaron registradas.' : 'Actividad completada. Lo importante es lo que aprendiste en cada respuesta.') + '</p>' +
          '<div class="fila-btn">' + (esTaller ? '' : '<button class="btn btn-sec" type="button" id="rep">Jugar de nuevo</button>') + '<button class="btn btn-pri" type="button" data-volver>Seguir</button></div></section>');
        enlazarVolver(); var rp = $('#rep'); if (rp) rp.addEventListener('click', function () { vistaJuego(e); });
        var r = $('#juego .resultado'); r.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (!e.minMin || prog(e.id).segundos >= e.minMin * 60) return entregar();
      $('#juego').insertAdjacentHTML('beforeend', '<section class="tarjeta" id="espera"><p>Terminaste las actividades. Para entregar el taller necesitas al menos ' + e.minMin + ' minutos de trabajo: revisa tus respuestas y la retroalimentación mientras tanto.</p><p class="peq suave" id="falta"></p><button class="btn btn-pri btn-bloque" type="button" id="entregar" disabled>Entregar taller</button></section>');
      var t = function () { var f = Math.max(0, e.minMin * 60 - prog(e.id).segundos), b = $('#entregar'); if (!b) return; $('#falta').textContent = f ? 'Faltan ' + Math.ceil(f / 60) + ' min de permanencia.' : 'Listo para entregar.'; b.disabled = f > 0; };
      t(); Tiempo.onTick = t;
      $('#entregar').addEventListener('click', function () { Tiempo.onTick = null; $('#espera').remove(); entregar(); });
    });
  }
  var vistaTaller = vistaJuego;

  /* ---------- cápsulas de PyV (lecciones) ---------- */
  function vistaLeccion(e) {
    var def = CONTENIDO.lecciones[e.id]; if (typeof def === 'function') def = def(S.perfil.cargo);
    if (def && def.cargar) {
      app.innerHTML = encabezadoEtapa(e) + '<section class="tarjeta"><p>Cargando el contenido…</p></section>'; enlazarVolver();
      var sc = document.createElement('script'); sc.src = def.cargar + '?v=' + (PLAN.version || '');
      sc.onload = function () { if (S.etapa === e.id) vistaLeccion(e); };
      sc.onerror = function () { app.innerHTML = encabezadoEtapa(e) + '<section class="tarjeta"><div class="aviso error">No se pudo cargar el contenido. Revisa tu señal e inténtalo de nuevo.</div><button class="btn btn-pri btn-bloque" type="button" data-volver>Volver al curso</button></section>'; enlazarVolver(); };
      document.head.appendChild(sc); return;
    }
    var D = (def && def.diapositivas) || [], k = 0, visto = {}, ok = hecho(e.id), voz = window.speechSynthesis;
    /* retoma en la última diapositiva vista (por trabajador y cápsula) */
    var claveMarca = 'pyv_marca_' + (S.perfil && S.perfil.run || '') + '_' + e.id, marca = SRV.ls(claveMarca) || {};
    if (!ok && marca.k > 0 && marca.k < D.length) { k = marca.k; (marca.v || []).forEach(function (j) { if (j < D.length) visto[j] = 1; }); }
    function guardarMarca() { if (!ok) SRV.ls(claveMarca, { k: k, v: Object.keys(visto).map(Number) }); }
    Tiempo.iniciar(e.id);
    function texto(d) { return [d.t, d.x || ''].concat(d.l || [], (d.riesgos || []).map(function (r) { return r.t + '. ' + r.f.map(function (x) { return x[0] + ': ' + x[1]; }).join('. '); }), d.tip ? [d.tip] : []).join('. '); }
    function pintar() {
      var d = D[k] || { t: 'Sin contenido' }; visto[k] = 1; guardarMarca();
      var falta = Math.max(0, e.minMin * 60 - prog(e.id).segundos), todas = Object.keys(visto).length >= D.length;
      app.innerHTML = encabezadoEtapa(e) + '<section class="tarjeta diapo"><div class="contador">' + (k + 1) + ' de ' + D.length + (marca.k > 0 && !ok && k === marca.k ? ' · retomas donde quedaste' : '') + '</div><h2>' + h(d.t) + '</h2>' +
        (d.x ? String(d.x).split(/\n\n+/).map(function (p) { return '<p>' + h(p).replace(/\n/g, '<br>') + '</p>'; }).join('') : '') +
        (d.l && d.l.length ? '<ul class="diapo-l">' + d.l.map(function (x) { return '<li>' + h(x) + '</li>'; }).join('') + '</ul>' : '') +
        (d.riesgos ? d.riesgos.map(function (r) { var nv = String(r.nivel || '').toLowerCase(); return '<div class="mz-r"><h3>' + h(r.t) + (r.nivel ? ' <span class="mz-n ' + (/intoler|importante|alto/.test(nv) ? 'n3' : /moderado|medio|protocolo/.test(nv) ? 'n2' : 'n1') + '">' + h(r.nivel) + '</span>' : '') + '</h3><dl>' + r.f.map(function (x) { return '<dt>' + h(x[0]) + '</dt><dd>' + h(x[1]) + '</dd>'; }).join('') + '</dl></div>'; }).join('') : '') +
        (d.tip ? '<div class="aviso info">' + h(d.tip) + '</div>' : '') +
        '<div class="puntos">' + D.map(function (_, j) { return '<i class="' + (j === k ? 'act' : visto[j] ? 'vis' : '') + '"></i>'; }).join('') + '</div>' +
        '<div class="fila-btn"><button class="btn btn-sec" type="button" id="ant"' + (k === 0 ? ' disabled' : '') + '>Anterior</button>' +
        (k < D.length - 1 ? '<button class="btn btn-pri" type="button" id="sig">Siguiente</button>' : '<button class="btn btn-pri" type="button" id="fin"' + (ok || (todas && !falta) ? '' : ' disabled') + '>' + (ok ? 'Volver al curso' : 'Terminar cápsula') + '</button>') + '</div>' +
        (voz ? '<button class="btn btn-ter" type="button" id="oir">Escuchar esta diapositiva</button>' : '') +
        (def.documento ? ' <a class="btn btn-ter" href="' + h(def.documento) + '" target="_blank" rel="noopener">Ver documento completo</a>' : '') +
        (k === D.length - 1 && !ok ? '<p class="peq suave" id="falta">' + (falta ? 'Faltan ' + Math.ceil(falta / 60) + ' min de permanencia para terminar. Puedes volver a revisar las diapositivas.' : '') + '</p>' : '') + '</section>';
      enlazarVolver();
      if ($('#ant')) $('#ant').onclick = function () { if (voz) voz.cancel(); k--; pintar(); };
      if ($('#sig')) $('#sig').onclick = function () { if (voz) voz.cancel(); k++; pintar(); window.scrollTo(0, 0); };
      if ($('#oir')) $('#oir').onclick = function () { voz.cancel(); var u = new SpeechSynthesisUtterance(texto(d)); u.lang = 'es-CL'; u.rate = 0.95; voz.speak(u); Tiempo.actividad(); };
      if ($('#fin')) $('#fin').onclick = function () {
        if (voz) voz.cancel();
        if (!ok) { Tiempo.volcar(); SRV.encolar({ tipo: 'completar', item: e.id }); setLocal(e.id, { estado: 'completado' }); SRV.enviar(S.token); toast('Cápsula completada.'); }
        ir('ruta', e.curso);
      };
      Tiempo.onTick = function () {
        var f = Math.max(0, e.minMin * 60 - prog(e.id).segundos), b = $('#fin'), t = $('#falta');
        if (t) t.textContent = f ? 'Faltan ' + Math.ceil(f / 60) + ' min de permanencia para terminar. Puedes volver a revisar las diapositivas.' : '';
        if (b && !ok) b.disabled = !(Object.keys(visto).length >= D.length && !f);
      };
    }
    pintar();
  }

  /* ---------- firma ---------- */
  function vistaFirma(e) {
    var def = CONTENIDO.firmas[e.id]; if (typeof def === 'function') def = def(S.perfil.cargo); def = def || { texto: 'Declaro haber completado esta capacitación.' };
    var ok = hecho(e.id), P = S.perfil;
    app.innerHTML = encabezadoEtapa(e) + (ok ? '<div class="aviso ok">Ya firmaste esta capacitación.</div><button class="btn btn-pri btn-bloque" type="button" data-volver>Volver al curso</button>' :
      '<section class="tarjeta"><h2>Declaración</h2><p>' + h(def.texto) + '</p>' +
      (def.lista && def.lista.length ? '<details><summary class="btn btn-ter">Ver el detalle que firmas (' + def.lista.length + ')</summary><ul>' + def.lista.map(function (r) { return '<li><b>' + h(r[0]) + '</b>: ' + h(r[1]) + '</li>'; }).join('') + '</ul></details>' : '') +
      '<p class="peq">' + h(P.nombre) + ' · RUN ' + h(P.run) + '</p>' +
      '<label class="campo" style="margin-bottom:6px">Tu firma</label><canvas class="firma-caja" id="firma" aria-label="Espacio para firmar con el dedo"></canvas>' +
      '<button type="button" class="btn btn-ter" id="borrar">Borrar firma</button>' +
      '<label class="check"><input type="checkbox" id="acepto"><span>Leí la declaración y la firmo.</span></label><div id="msg-f"></div>' +
      '<button class="btn btn-pri btn-bloque" type="button" id="firmar">Firmar</button></section>');
    enlazarVolver(); if (ok) return;
    var cv = $('#firma'), ctx = cv.getContext('2d'), firmado = false, dib = false;
    var r0 = cv.getBoundingClientRect(); cv.width = r0.width * 2; cv.height = r0.height * 2; ctx.scale(2, 2); ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.strokeStyle = '#16262D';
    function pos(ev) { var r = cv.getBoundingClientRect(); return [ev.clientX - r.left, ev.clientY - r.top]; }
    cv.addEventListener('pointerdown', function (ev) { dib = true; firmado = true; var p = pos(ev); ctx.beginPath(); ctx.moveTo(p[0], p[1]); cv.setPointerCapture(ev.pointerId); });
    cv.addEventListener('pointermove', function (ev) { if (!dib) return; var p = pos(ev); ctx.lineTo(p[0], p[1]); ctx.stroke(); });
    cv.addEventListener('pointerup', function () { dib = false; });
    $('#borrar').onclick = function () { ctx.clearRect(0, 0, cv.width, cv.height); firmado = false; };
    $('#firmar').onclick = function () {
      if (!firmado) { $('#msg-f').innerHTML = '<div class="aviso error">Firma con tu dedo en el recuadro.</div>'; return; }
      if (!$('#acepto').checked) { $('#msg-f').innerHTML = '<div class="aviso error">Marca que leíste la declaración.</div>'; return; }
      SRV.encolar({ tipo: 'firma', item: e.id, firma: cv.toDataURL('image/png'), declaracion: def.texto, detalle: def.lista ? { lista: def.lista.slice(0, 60) } : null });
      setLocal(e.id, { estado: 'completado' }); SRV.enviar(S.token); toast('Firma registrada.'); ir('ruta', e.curso);
    };
  }

  /* ---------- evaluaciones formativas ---------- */
  function preguntasDe(e) {
    if (e.banco === 'pyv') {
      var Q = CONTENIDO.quizPyv, pc = (Q.porCargo[S.perfil.cargo] || []).slice(), area = PLAN.area(S.perfil.cargo);
      var com = Q.comunes.filter(function (q) { return !q.area || q.area === area || (area === 'mixto' && q.area === 'faena'); });
      return pc.concat(barajar(com).slice(0, Math.max(4, 7 - pc.length)));
    }
    var B = CONTENIDO.quizOficial[e.banco] || CONTENIDO.quiz[e.banco] || { preguntas: [] };
    return barajar(B.preguntas).slice(0, Math.min(B.n || 5, B.preguntas.length));
  }
  function vistaQuiz(e) {
    var p = prog(e.id), ok = p.estado === 'completado';
    app.innerHTML = encabezadoEtapa(e) + '<section class="tarjeta"><p>Evaluación formativa: al responder verás si acertaste y por qué. Necesitas ' + Math.round(PLAN.notaAprobacion * 100) + '% para avanzar y puedes repetirla las veces que necesites.</p>' +
      (ok ? '<div class="aviso ok">Ya la aprobaste. Puedes practicarla de nuevo si quieres.</div>' : p.intentos ? '<div class="aviso info">Llevas ' + p.intentos + ' intento(s). Repasa la retroalimentación y vuelve a intentarlo.</div>' : '') +
      '<button class="btn btn-pri btn-bloque" type="button" id="comenzar">' + (p.intentos ? 'Intentar de nuevo' : 'Comenzar') + '</button></section>';
    enlazarVolver();
    $('#comenzar').addEventListener('click', function () { correrQuiz(e); });
  }
  function correrQuiz(e) {
    var preguntas = preguntasDe(e).map(function (q) {
      var ops = q.op.map(function (t, i) { return { t: t, ok: (i + 1) === q.ok }; });
      return { p: q.p, ops: barajar(ops), fbOk: q.fbOk, fbNo: q.fbNo };
    });
    var i = 0, buenas = 0, resp = [];
    Tiempo.iniciar(e.id);
    function pintar() {
      var q = preguntas[i];
      app.innerHTML = encabezadoEtapa(e) + '<section class="tarjeta"><div class="progreso-q">Pregunta ' + (i + 1) + ' de ' + preguntas.length + '</div>' +
        '<div class="pregunta">' + h(q.p) + '</div><div id="ops">' + q.ops.map(function (o, j) { return '<button type="button" class="opcion" data-j="' + j + '"><span class="letra">' + 'ABCD'[j] + '</span><span>' + h(o.t) + '</span></button>'; }).join('') + '</div>' +
        '<div id="retro"></div><button class="btn btn-pri btn-bloque" type="button" id="resp" disabled>Responder</button></section>';
      enlazarVolver();
      var sel = -1;
      $$('.opcion').forEach(function (b) { b.addEventListener('click', function () { if (b.disabled) return; sel = +b.dataset.j; $$('.opcion').forEach(function (x) { x.classList.toggle('sel', x === b); }); $('#resp').disabled = false; }); });
      $('#resp').addEventListener('click', function () {
        if (this.dataset.sig) { i++; if (i < preguntas.length) pintar(); else terminar(); return; }
        var correcta = q.ops[sel].ok; if (correcta) buenas++;
        resp.push({ p: q.p.slice(0, 90), r: q.ops[sel].t.slice(0, 90), ok: correcta });
        $$('.opcion').forEach(function (x, j) { x.disabled = true; if (q.ops[j].ok) x.classList.add('ok'); else if (j === sel) x.classList.add('no'); x.classList.remove('sel'); });
        $('#retro').innerHTML = '<div class="retro ' + (correcta ? 'ok' : 'no') + '"><b>' + (correcta ? 'Correcto.' : 'No es la mejor respuesta.') + '</b>' + h(correcta ? q.fbOk : q.fbNo) + '</div>';
        this.textContent = i + 1 < preguntas.length ? 'Siguiente pregunta' : 'Ver resultado'; this.dataset.sig = '1';
        this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
    function terminar() {
      var pt = buenas / preguntas.length, aprobado = pt >= PLAN.notaAprobacion;
      Tiempo.volcar();
      SRV.encolar({ tipo: 'quiz', item: e.id, puntaje: pt, respuestas: resp });
      var it = prog(e.id).intentos + 1; setLocal(e.id, aprobado ? { estado: 'completado', intentos: it } : { intentos: it });
      SRV.enviar(S.token);
      app.innerHTML = encabezadoEtapa(e) + '<section class="tarjeta resultado"><div class="cifra">' + buenas + '/' + preguntas.length + '</div>' +
        (aprobado ? '<h2>Evaluación aprobada</h2><p>Lograste ' + Math.round(pt * 100) + '%. Sigue con la próxima etapa.</p>' : '<h2>Vamos de nuevo</h2><p>Lograste ' + Math.round(pt * 100) + '% y necesitas ' + Math.round(PLAN.notaAprobacion * 100) + '%. Revisa la retroalimentación o el manual e inténtalo otra vez.</p>') +
        '<div class="fila-btn">' + (aprobado ? '' : '<button class="btn btn-sec" type="button" id="otra">Intentar de nuevo</button>') + '<button class="btn btn-pri" type="button" data-volver>' + (aprobado ? 'Seguir' : 'Volver al curso') + '</button></div></section>';
      enlazarVolver(); var o = $('#otra'); if (o) o.addEventListener('click', function () { correrQuiz(e); });
    }
    pintar();
  }

  /* ---------- A bordo con PyV ---------- */
  function vistaPyv(e) {
    var cargo = S.perfil.cargo, C = PLAN.cargo(cargo), data = (window.PYV_IPER || {})[cargo] || { riesgos: [], procesos: [] };
    var R = data.riesgos, top = R.filter(function (r) { return r.nivel >= 2; }).slice(0, 8);
    var procs = CONTENIDO.procedimientosDe(cargo), ok = hecho(e.id), leidos = local()[e.id] && local()[e.id].leidos || {};
    function riesgoHtml(r) {
      var ctl = [].concat(r.ingenieria.slice(0, 1), r.administrativo.slice(0, 2), r.senalizacion.slice(0, 1)).filter(Boolean);
      return '<div class="riesgo n' + r.nivel + '"><h4>' + h(r.riesgo) + '<span class="nivel">' + h(r.nivelTxt) + '</span></h4>' +
        '<div class="peq suave">' + h(r.tareas.slice(0, 2).join(' · ')) + '</div><dl>' +
        '<dt>Peligro</dt><dd>' + h(r.peligros[0] || '') + '</dd><dt>Puede causar</dt><dd>' + h(r.consecuencias[0] || '') + '</dd>' +
        (ctl.length ? '<dt>Cómo se controla</dt><dd>' + ctl.map(h).join('<br>') + '</dd>' : '') + '</dl>' +
        (r.eppItems.length ? '<div class="epp">' + r.eppItems.slice(0, 7).map(function (x) { return '<span>' + h(x) + '</span>'; }).join('') + '</div>' : '') + '</div>';
    }
    app.innerHTML = encabezadoEtapa(e) +
      '<p>Lo que aplica a tu trabajo como <b>' + h(C.nombre) + '</b>, según la Matriz IPER, el Plan de Reducción del Riesgo de Desastres y los procedimientos de ' + h(CONTENIDO.empresa.corto) + '.</p>' +
      '<section class="tarjeta"><h2>Tu rol en una emergencia</h2><ul class="roles">' + (CONTENIDO.rolEmergencia[cargo] || []).map(function (x) { return '<li>' + h(x) + '</li>'; }).join('') + '</ul>' +
      (PLAN.area(cargo) === 'oficina' ? '<p class="peq suave">Oficina Las Rosas 121, Puerto Aysén. Si la oficina queda en zona de inundación por tsunami, se evacúa a pie a la zona segura indicada por SENAPRED.</p></section>' : '<p class="peq suave">Señal de abandono: seis pitazos largos y seguidos, chaleco puesto y al punto de reunión de tu embarcación.</p></section>') +
      '<section class="tarjeta"><h2>Los riesgos de tu cargo</h2><p class="peq suave">De la Matriz IPER 2026 (' + (data.procesos || []).length + ' procesos donde participas). Primero los de mayor nivel.</p>' +
      top.map(riesgoHtml).join('') +
      (R.length > top.length ? '<details><summary class="btn btn-ter">Ver los ' + R.length + ' riesgos evaluados</summary>' + R.filter(function (r) { return top.indexOf(r) < 0; }).map(riesgoHtml).join('') + '</details>' : '') + '</section>' +
      '<section class="tarjeta"><h2>Tus procedimientos</h2><p class="peq suave">Lee los puntos clave de cada uno y márcalo. Puedes abrir el documento completo.</p>' +
      procs.map(function (p) {
        return '<div class="proc' + (leidos[p.id] || ok ? ' leido' : '') + '" data-proc="' + p.id + '"><h4>' + h(p.id) + ' · ' + h(p.titulo) + '</h4><ul>' + p.claves.map(function (c) { return '<li>' + h(c) + '</li>'; }).join('') + '</ul>' +
          '<a href="' + h(p.archivo) + '" target="_blank" rel="noopener">Abrir el procedimiento completo</a>' +
          '<label class="check"><input type="checkbox" data-leido="' + p.id + '"' + (leidos[p.id] || ok ? ' checked' : '') + (ok ? ' disabled' : '') + '><span>Leí los puntos clave</span></label></div>';
      }).join('') + '</section>' +
      '<section class="tarjeta"><h2>Números de emergencia</h2><div class="directorio">' + CONTENIDO.directorio.map(function (d) { return '<div>' + h(d.n) + '</div><div>' + (/^[+\d]/.test(d.t) ? '<a href="tel:' + h(d.t.replace(/\s/g, '')) + '">' + h(d.t) + '</a>' : '<b>' + h(d.t) + '</b>') + '</div>'; }).join('') + '</div></section>' +
      (ok ? '<div class="aviso ok">Ya confirmaste la revisión de esta información.</div><button class="btn btn-pri btn-bloque" type="button" data-volver>Seguir</button>' :
        '<section class="tarjeta"><label class="check"><input type="checkbox" id="decl"><span>Declaro que revisé los riesgos de mi cargo, sus medidas de control, mi rol en emergencias y los procedimientos indicados.</span></label><div id="msg-pyv"></div>' +
        '<button class="btn btn-pri btn-bloque" type="button" id="conf-pyv">Confirmar revisión</button></section>');
    enlazarVolver(); Tiempo.iniciar(e.id);
    if (ok) return;
    $$('[data-leido]').forEach(function (c) {
      c.addEventListener('change', function () { var L = local()[e.id] && local()[e.id].leidos || {}; L[c.dataset.leido] = c.checked; setLocal(e.id, { leidos: L }); c.closest('.proc').classList.toggle('leido', c.checked); });
    });
    $('#conf-pyv').addEventListener('click', function () {
      var falt = $$('[data-leido]').filter(function (c) { return !c.checked; });
      if (falt.length) { $('#msg-pyv').innerHTML = '<div class="aviso error">Te falta marcar ' + falt.length + ' procedimiento(s).</div>'; falt[0].closest('.proc').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      if (!$('#decl').checked) { $('#msg-pyv').innerHTML = '<div class="aviso error">Marca la declaración para confirmar.</div>'; return; }
      Tiempo.volcar();
      var det = { riesgos: R.slice(0, 40).map(function (r) { return { riesgo: r.riesgo, nivel: r.nivelTxt, controles: [].concat(r.administrativo.slice(0, 1), r.eppItems.slice(0, 3)).join('; ') }; }), pts: procs.map(function (p) { return p.id + ' ' + p.titulo; }) };
      if (prog(e.id).segundos < e.minMin * 60) { $('#msg-pyv').innerHTML = '<div class="aviso info">Tómate unos minutos más para revisar la información: llevas ' + mins(prog(e.id).segundos) + ' de ' + e.minMin + ' min.</div>'; return; }
      SRV.encolar({ tipo: 'completar', item: e.id, detalle: det }); setLocal(e.id, { estado: 'completado' }); SRV.enviar(S.token);
      toast('Revisión registrada.'); ir('ruta');
    });
  }

  /* ---------- sesiones prácticas ---------- */
  function vistaSesiones(e) {
    var P = S.perfil, R = reqDs44(), lista = P.sesiones || [];
    app.innerHTML = encabezadoEtapa(e) +
      '<section class="tarjeta"><p>El curso incluye ' + R.sesionesRequeridas + ' sesiones prácticas con la facilitadora: casos de PyV, trabajo en grupo y práctica con extintores. Pueden ser presenciales o en línea con la tripulación reunida.</p>' +
      '<div class="chips"><span class="chip">Registradas <b>' + lista.length + ' de ' + R.sesionesRequeridas + '</b></span></div>' +
      (lista.length ? '<ul>' + lista.map(function (s) { return '<li>Sesión ' + h(s.sesionId) + ' · ' + h(s.fecha) + '</li>'; }).join('') + '</ul>' : '') + '</section>' +
      '<section class="tarjeta"><h2>Registrar mi asistencia</h2><p class="peq">La facilitadora te dará un código al inicio de la sesión.</p>' +
      '<label class="campo">Código de la sesión<input type="text" id="cod" maxlength="8" autocapitalize="characters" style="text-transform:uppercase;letter-spacing:4px"></label>' +
      '<label class="campo" style="margin-bottom:6px">Tu firma</label><canvas class="firma-caja" id="firma" aria-label="Espacio para firmar con el dedo"></canvas>' +
      '<button type="button" class="btn btn-ter" id="borrar">Borrar firma</button><div id="msg-s"></div>' +
      '<button class="btn btn-pri btn-bloque" type="button" id="reg">Registrar asistencia</button></section>';
    enlazarVolver();
    var cv = $('#firma'), ctx = cv.getContext('2d'), firmado = false, dib = false;
    function ajustar() { var r = cv.getBoundingClientRect(); cv.width = r.width * 2; cv.height = r.height * 2; ctx.scale(2, 2); ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.strokeStyle = '#16262D'; }
    ajustar();
    function pos(ev) { var r = cv.getBoundingClientRect(); return [ev.clientX - r.left, ev.clientY - r.top]; }
    cv.addEventListener('pointerdown', function (ev) { dib = true; firmado = true; var p = pos(ev); ctx.beginPath(); ctx.moveTo(p[0], p[1]); cv.setPointerCapture(ev.pointerId); });
    cv.addEventListener('pointermove', function (ev) { if (!dib) return; var p = pos(ev); ctx.lineTo(p[0], p[1]); ctx.stroke(); });
    cv.addEventListener('pointerup', function () { dib = false; });
    $('#borrar').addEventListener('click', function () { ctx.clearRect(0, 0, cv.width, cv.height); firmado = false; });
    $('#reg').addEventListener('click', function () {
      var cod = $('#cod').value.trim(), msg = $('#msg-s');
      if (!cod) { msg.innerHTML = '<div class="aviso error">Escribe el código de la sesión.</div>'; return; }
      if (!firmado) { msg.innerHTML = '<div class="aviso error">Firma con tu dedo en el recuadro.</div>'; return; }
      if (!navigator.onLine && !SRV.demo) { msg.innerHTML = '<div class="aviso error">Necesitas señal para registrar la asistencia.</div>'; return; }
      this.disabled = true; var btn = this;
      SRV.llamar('asistencia', { token: S.token, codigo: cod, firma: cv.toDataURL('image/png') }).then(function (r) {
        btn.disabled = false;
        if (r.ok) { S.perfil = r.perfil; guardarSesion(); toast(r.mensaje || 'Asistencia registrada.'); vistaSesiones(e); }
        else msg.innerHTML = '<div class="aviso error">' + h(r.error || r.mensaje) + '</div>';
      }).catch(function () { btn.disabled = false; msg.innerHTML = '<div class="aviso error">No se pudo conectar. Inténtalo de nuevo.</div>'; });
    });
  }

  /* ---------- encuesta ---------- */
  function vistaEncuesta(e) {
    var ok = hecho(e.id), resp = {};
    app.innerHTML = encabezadoEtapa(e) + (ok ? '<div class="aviso ok">Gracias, ya respondiste la encuesta.</div><button class="btn btn-pri btn-bloque" type="button" data-volver>Seguir</button>' :
      '<section class="tarjeta"><p>Tu opinión es anónima para la evaluación del curso y nos ayuda a mejorarlo. De 1 (muy en desacuerdo) a 5 (muy de acuerdo).</p>' +
      CONTENIDO.encuesta.map(function (q) {
        if (q.tipo === 'texto') return '<label class="campo">' + h(q.p) + '<textarea rows="3" data-q="' + q.id + '"></textarea></label>';
        return '<div class="campo" style="font-weight:600">' + h(q.p) + '</div><div class="escala" data-esc="' + q.id + '">' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" data-v="' + n + '">' + n + '</button>'; }).join('') + '</div><div class="escala-leyenda"><span>Muy en desacuerdo</span><span>Muy de acuerdo</span></div>';
      }).join('') + '<div id="msg-e"></div><button class="btn btn-pri btn-bloque" type="button" id="env-e">Enviar encuesta</button></section>');
    enlazarVolver(); if (ok) return; Tiempo.iniciar(e.id);
    $$('[data-esc]').forEach(function (g) { $$('button', g).forEach(function (b) { b.addEventListener('click', function () { resp[g.dataset.esc] = +b.dataset.v; $$('button', g).forEach(function (x) { x.classList.toggle('sel', x === b); }); }); }); });
    $('#env-e').addEventListener('click', function () {
      var faltan = CONTENIDO.encuesta.filter(function (q) { return q.tipo === 'escala' && !resp[q.id]; });
      if (faltan.length) { $('#msg-e').innerHTML = '<div class="aviso error">Responde todas las preguntas con nota.</div>'; return; }
      $$('[data-q]').forEach(function (t) { resp[t.dataset.q] = t.value.slice(0, 600); });
      Tiempo.volcar(); SRV.encolar({ tipo: 'encuesta', item: e.id, respuestas: resp }); setLocal(e.id, { estado: 'completado' }); SRV.enviar(S.token);
      toast('Encuesta enviada. ¡Gracias!'); ir('ruta');
    });
  }

  /* ---------- certificado ---------- */
  function vistaCertificado() {
    var cur = PLAN.curso(S.curso);
    if (S.revision) { app.innerHTML = '<button class="volver" type="button" data-volver>' + ic('atras', 18) + 'Volver al curso</button><h1>Certificado</h1><section class="tarjeta"><div class="aviso info">En modo revisión no se emiten certificados. El trabajador lo emite al completar todas las etapas y el tiempo mínimo de ' + h(PLAN.duracionTxt(cur.duracionMin || 0)) + '.</div></section>'; enlazarVolver(); return; }
    app.innerHTML = '<button class="volver" type="button" data-volver>' + ic('atras', 18) + 'Volver al curso</button><h1>Mi certificado</h1><p class="suave">' + h(cur.titulo) + '</p><section class="tarjeta" id="cert"><div class="cargando">Preparando tu certificado…</div></section>';
    enlazarVolver();
    if (!navigator.onLine && !SRV.demo) { $('#cert').innerHTML = '<div class="aviso error">Necesitas señal para emitir o descargar el certificado.</div>'; return; }
    SRV.enviar(S.token).then(function () { return SRV.llamar('certificado', { token: S.token, curso: cur.id }); }).then(function (r) {
      if (!r.ok) {
        var falt = (r.faltan || []).map(function (id) { var e = PLAN.etapa(id); return '<li>' + h(e ? e.titulo : id) + '</li>'; }).join('');
        $('#cert').innerHTML = '<div class="aviso error">' + h(r.error || r.mensaje) + '</div>' + (falt ? '<p>Te falta:</p><ul>' + falt + '</ul>' : '') + '<p class="peq suave">Si completaste todo sin señal, espera a que se guarde tu avance y vuelve a intentarlo.</p>';
        return;
      }
      S.perfil = r.perfil; aplicarExtras(); guardarSesion();
      var c = r.certificado;
      $('#cert').innerHTML = '<p>Código <b>' + h(c.codigo) + '</b> · emitido el ' + fechaTxt(c.fechaEmision) + (c.vence ? ' · vigente hasta ' + fechaTxt(c.vence) : '') + '.</p>' +
        '<div class="cert-caja" id="cert-caja"><iframe id="cert-fr" title="Vista del certificado"></iframe></div>' +
        '<div class="fila-btn">' + (c.pdf ? '<a class="btn btn-pri" download="Certificado_' + h(c.codigo) + '.pdf" href="data:application/pdf;base64,' + c.pdf + '">Descargar PDF</a>' : '') +
        (SRV.demo ? '' : '<button class="btn ' + (c.pdf ? 'btn-sec' : 'btn-pri') + '" type="button" id="imp">Imprimir o guardar como PDF</button>') + '</div>' + (SRV.demo ? '<p class="peq suave">En la plataforma instalada el certificado se descarga en PDF y queda guardado en la carpeta del trabajador en Drive.</p>' : '') +
        (SRV.demo ? '' : '<p class="peq suave">El certificado queda guardado en el registro de la empresa y se puede verificar con su código QR.</p>');
      $('#cert-fr').srcdoc = c.html;
      var escalar = function () { var caja = $('#cert-caja'); if (!caja) return; var k = caja.clientWidth / 820; $('#cert-fr').style.transform = 'scale(' + k + ')'; caja.style.height = Math.round(1075 * k) + 'px'; };
      escalar(); window.addEventListener('resize', escalar);
      if ($('#imp')) $('#imp').addEventListener('click', function () { var w = $('#cert-fr').contentWindow; w.focus(); w.print(); });
    }).catch(function () { $('#cert').innerHTML = '<div class="aviso error">No se pudo conectar. Inténtalo de nuevo en un momento.</div>'; });
  }

  /* ---------- arranque ---------- */
  if (SRV.demo) $('#demo-banda').classList.remove('oculto');
  var revCargo = (location.search.match(/[?&]revision=([^&]+)/) || [])[1], revOk = SRV.ls('pyv_revision');
  if (revCargo) revCargo = decodeURIComponent(revCargo);
  if (revCargo && PLAN.cargo(revCargo) && revOk && Date.now() - revOk.t < 12 * 3600000) {
    S.revision = true; S.token = 'revision';
    ['encolar', 'enviar', 'llamar'].forEach(function (k) { SRV[k] = function () { return Promise.resolve({ ok: false, error: 'Modo revisión: no se registra nada.' }); }; });
    SRV.ls('pyv_local_REVISION', null);
    Object.keys(localStorage).forEach(function (k) { if (k.indexOf('pyv_marca_REVISION') === 0) localStorage.removeItem(k); });
    S.perfil = { nombre: 'Modo revisión', run: 'REVISION', cargo: revCargo, progreso: {}, cursos: {}, sesiones: [], facilitador: CONTENIDO.empresa.apr,
      extras: (revOk.extras || []).filter(function (x) { return x.cargos === '*' || (x.cargos || []).indexOf(revCargo) >= 0; }) };
    aplicarExtras();
    var banda = document.createElement('div'); banda.className = 'rev-banda';
    banda.innerHTML = '<b>Modo revisión</b> · viendo como <select id="rev-cargo" aria-label="Cargo">' + PLAN.cargos.map(function (c) { return '<option value="' + h(c.id) + '"' + (c.id === revCargo ? ' selected' : '') + '>' + h(c.nombre) + '</option>'; }).join('') + '</select> · no se registra nada <button type="button" id="rev-salir">Cerrar</button>';
    document.body.insertBefore(banda, document.body.firstChild);
    $('#rev-cargo').addEventListener('change', function () { location.search = '?revision=' + encodeURIComponent(this.value); });
    $('#rev-salir').addEventListener('click', function () { window.close(); setTimeout(function () { location.href = 'admin.html'; }, 200); });
    ir('cursos');
    return;
  }
  var ses = SRV.ls('pyv_sesion');
  if (ses && ses.token) {
    S.token = ses.token; S.perfil = ses.perfil; aplicarExtras(); $('#btn-salir').classList.remove('oculto'); red(); ir('cursos');
    if (navigator.onLine || SRV.demo) SRV.llamar('estado', { token: S.token }).then(function (r) {
      if (r.ok) { S.perfil = r.perfil; aplicarExtras(); limpiarLocalConfirmado(); guardarSesion(); if (S.vista === 'ruta') vistaRuta(); else if (S.vista === 'cursos') vistaCursos(); SRV.enviar(S.token); }
      else if (r.error === 'sesion') salir(true);
    }).catch(function () { });
  } else vistaIngreso();
  SRV.onCambio(function (r) { if (r && r.perfil) { guardarSesion(); if (S.vista === 'ruta') vistaRuta(); else if (S.vista === 'cursos') vistaCursos(); } });
})();
