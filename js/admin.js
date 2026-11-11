/* PyV Capacita — panel de la encargada de prevención y de supervisores */
(function () {
  'use strict';
  var A = { tok: null, rol: null, datos: null, tab: 'trabajadores', filtro: { q: '', cargo: '', estado: '', curso: 'ds44' } };
  var app = document.getElementById('app'), dlg = document.getElementById('dlg');
  function h(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.remove('oculto'); clearTimeout(toast._t); toast._t = setTimeout(function () { el.classList.add('oculto'); }, 3500); }
  function hTxt(seg) { seg = Math.round(seg || 0); var hh = Math.floor(seg / 3600), mm = Math.floor((seg % 3600) / 60); return hh + ' h ' + (mm < 10 ? '0' : '') + mm; }
  function fecha(f) { if (!f) return '—'; var m = String(f).match(/(\d{4})-(\d{2})-(\d{2})/); return m ? m[3] + '-' + m[2] + '-' + m[1] : f; }
  function cargoN(id) { var c = PLAN.cargo(id); return c ? c.nombre : id; }
  function llamar(acc, b) { b = b || {}; b.adminToken = A.tok; return SRV.llamar(acc, b).then(function (r) { if (!r.ok && r.error === 'sesion') { salir(); throw new Error('sesion'); } return r; }); }

  function salir() { A.tok = null; try { sessionStorage.removeItem('pyv_adm'); } catch (e) { } $('#btn-salir').classList.add('oculto'); ingreso(); }
  $('#btn-salir').addEventListener('click', salir);

  function ingreso(msg) {
    app.innerHTML = '<section class="tarjeta" style="max-width:420px;margin:30px auto"><h1>Panel de capacitación</h1><p class="suave">Para la encargada de prevención y los supervisores.</p>' +
      (msg ? '<div class="aviso error">' + h(msg) + '</div>' : '') +
      '<form id="f"><label class="campo">Clave<input type="password" name="clave" autocomplete="current-password" required></label><button class="btn btn-pri btn-bloque" type="submit">Entrar</button></form></section>';
    $('#f').addEventListener('submit', function (ev) {
      ev.preventDefault(); var b = $('button', ev.target); b.disabled = true;
      SRV.llamar('adminIngresar', { clave: ev.target.clave.value }).then(function (r) {
        b.disabled = false; if (!r.ok) return ingreso(r.error);
        A.tok = r.adminToken; A.rol = r.rol; try { sessionStorage.setItem('pyv_adm', JSON.stringify({ tok: A.tok, rol: A.rol })); } catch (e) { }
        $('#btn-salir').classList.remove('oculto'); cargar();
      }).catch(function () { b.disabled = false; ingreso('No se pudo conectar con el servidor.'); });
    });
  }

  function cargar() {
    app.innerHTML = '<div class="cargando">Cargando registros…</div>';
    llamar('adminResumen').then(function (r) { A.datos = r; A.rol = r.rol; (r.extras || []).forEach(function (x) { if (x.estado === 'publicado') PLAN.registrarExtra(x); }); pintar(); }).catch(function (e) { if (e.message !== 'sesion') app.innerHTML = '<div class="aviso error">No se pudieron cargar los datos.</div>'; });
  }

  function cdc(t) { return t.cursos && t.cursos[A.filtro.curso]; }
  function estadoDe(t) {
    var c = cdc(t); if (!c) return 'no_aplica';
    if (c.certificado) return c.certificado.vencido ? 'cert_vencido' : c.certificado.porVencer ? 'por_vencer' : 'certificado';
    if (c.plazoVencido) return 'vencido';
    if (!c.iniciado) return 'sin_iniciar';
    return 'en_curso';
  }
  var ESTADOS = { sin_iniciar: 'Sin iniciar', en_curso: 'En curso', vencido: 'Plazo vencido', certificado: 'Certificado', por_vencer: 'Certificado por vencer', cert_vencido: 'Certificado vencido', no_aplica: 'No aplica al cargo' };

  function pintar() {
    var D = A.datos, T = D.trabajadores.filter(function (t) { return estadoDe(t) !== 'no_aplica'; });
    var cuenta = { total: T.length, certificado: 0, en_curso: 0, vencido: 0, sin_iniciar: 0, por_vencer: 0, cert_vencido: 0, no_aplica: 0 };
    T.forEach(function (t) { cuenta[estadoDe(t)]++; });
    cuenta.vencido += cuenta.cert_vencido;
    var tabs = [['trabajadores', 'Avance'], ['sesiones', 'Sesiones']];
    if (A.rol === 'admin') tabs.push(['reporte', 'Reporte mensual'], ['revision', 'Modo revisión'], ['capacitaciones', 'Crear capacitación'], ['talleres', 'Respuestas'], ['expediente', 'Fiscalización'], ['config', 'Configuración']);
    var cursoSel = '<label class="campo" style="margin-bottom:12px">Capacitación<select id="fcur">' + PLAN.cursos.map(function (c) { return '<option value="' + c.id + '"' + (A.filtro.curso === c.id ? ' selected' : '') + '>' + h(c.titulo) + '</option>'; }).join('') + '</select></label>';
    app.innerHTML = cursoSel + '<div class="kpis">' +
      '<div class="kpi"><b>' + cuenta.total + '</b><span>Deben hacerla</span></div>' +
      '<div class="kpi"><b>' + (cuenta.certificado + cuenta.por_vencer) + '</b><span>Certificados vigentes</span></div>' +
      '<div class="kpi"><b>' + cuenta.en_curso + '</b><span>En curso</span></div>' +
      '<div class="kpi"><b>' + cuenta.sin_iniciar + '</b><span>Sin iniciar</span></div>' +
      '<div class="kpi"><b>' + (cuenta.vencido + cuenta.por_vencer) + '</b><span>Requieren atención</span></div></div>' +
      '<div class="pestanas" role="tablist">' + tabs.map(function (t) { return '<button type="button" data-tab="' + t[0] + '" class="' + (A.tab === t[0] ? 'act' : '') + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<div id="vista"></div>' + (D.raiz ? '<p class="pie"><a href="' + h(D.raiz) + '" target="_blank" rel="noopener">Abrir la carpeta de respaldo en Google Drive</a></p>' : '');
    $$('[data-tab]').forEach(function (b) { b.addEventListener('click', function () { A.tab = b.dataset.tab; pintar(); }); });
    $('#fcur').addEventListener('change', function () { A.filtro.curso = this.value; A.filtro.estado = ''; pintar(); });
    ({ trabajadores: vTrabajadores, sesiones: vSesiones, expediente: vExpediente, config: vConfig, capacitaciones: vCapacitaciones, talleres: vRespuestas, revision: vRevision, reporte: vReporte })[A.tab]();
  }



  /* ---------- reporte mensual de cumplimiento por trabajador ---------- */
  function estCurso(c) {
    if (!c) return '';
    if (c.certificado && !c.certificado.vencido) return c.certificado.porVencer ? 'por_vencer' : 'vigente';
    if (c.certificado && c.certificado.vencido) return 'vencido';
    if (c.plazoVencido) return 'vencido';
    return c.iniciado ? 'en_curso' : 'pendiente';
  }
  var EST_TXT = { vigente: 'Vigente', por_vencer: 'Por vencer', vencido: 'Vencido', en_curso: 'En curso', pendiente: 'Pendiente' };
  function fCl(f) { var m = String(f || '').match(/(\d{4})-(\d{2})-(\d{2})/); return m ? m[3] + '-' + m[2] + '-' + m[1] : (f || ''); }
  function datosReporte(mes) {
    var T = A.datos.trabajadores.slice().sort(function (a, b) { return String(a.nombre).localeCompare(String(b.nombre)); });
    return T.map(function (t) {
      var cs = PLAN.cursosDe(t.cargo), n = { vigente: 0, por_vencer: 0, vencido: 0, en_curso: 0, pendiente: 0 }, mesN = 0, det = [];
      cs.forEach(function (cur) {
        var c = t.cursos && t.cursos[cur.id], e = estCurso(c) || 'pendiente'; n[e]++;
        if (c && c.certificado && String(c.certificado.fecha || '').slice(0, 7) === mes) mesN++;
        det.push({ id: cur.id, titulo: cur.titulo, estado: e, vence: c && c.certificado ? c.certificado.vence : '', fecha: c && c.certificado ? c.certificado.fecha : '', avance: c ? Math.round((c.avance || 0) * 100) : 0 });
      });
      var k = t.cursos && t.cursos.karin, ke = estCurso(k);
      var req = cs.length, ok = n.vigente + n.por_vencer;
      return { t: t, cargo: (PLAN.cargo(t.cargo) || {}).nombre || t.cargo, req: req, ok: ok, n: n, pct: req ? Math.round(ok / req * 100) : 0, mesN: mesN, karin: ke, karinVence: k && k.certificado ? k.certificado.vence : '', det: det };
    });
  }
  function vReporte() {
    var hoy = new Date(), mes = A.repMes || (hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2));
    var R = datosReporte(mes), tot = R.length;
    var glob = R.reduce(function (s, r) { return s + r.req; }, 0), okG = R.reduce(function (s, r) { return s + r.ok; }, 0);
    var kOk = R.filter(function (r) { return r.karin === 'vigente' || r.karin === 'por_vencer'; }).length;
    var emit = R.reduce(function (s, r) { return s + r.mesN; }, 0), venc = R.reduce(function (s, r) { return s + r.n.vencido; }, 0), pv = R.reduce(function (s, r) { return s + r.n.por_vencer; }, 0);
    var al = function (p) { return p >= 100 ? 'ok-chip' : p >= 70 ? 'alerta' : 'peligro'; };
    $('#vista').innerHTML = '<section class="tarjeta"><h2>Reporte mensual de cumplimiento</h2>' +
      '<p class="suave">Estado de las capacitaciones exigidas a cada trabajador según su cargo, al día de hoy, y certificados emitidos en el mes elegido. Incluye la difusión semestral de la Ley Karin.</p>' +
      '<div class="fila-btn"><label class="campo" style="max-width:220px">Mes del reporte<input type="month" id="rep-mes" value="' + mes + '"></label></div>' +
      '<div class="kpis">' +
      '<div class="kpi"><b>' + (glob ? Math.round(okG / glob * 100) : 0) + '%</b><span>Cumplimiento general</span></div>' +
      '<div class="kpi"><b>' + kOk + ' de ' + tot + '</b><span>Ley Karin semestral al día</span></div>' +
      '<div class="kpi"><b>' + emit + '</b><span>Certificados emitidos en el mes</span></div>' +
      '<div class="kpi"><b>' + pv + '</b><span>Por vencer (60 días)</span></div>' +
      '<div class="kpi"><b>' + venc + '</b><span>Vencidos</span></div></div>' +
      '<div class="fila-btn"><button class="btn btn-pri" type="button" id="rep-pdf">Imprimir o guardar PDF</button><button class="btn btn-sec" type="button" id="rep-csv">Descargar Excel (CSV)</button></div>' +
      (tot ? '<div class="tabla-scroll"><table class="tabla"><thead><tr><th>Trabajador</th><th>Cargo</th><th>Exigidas</th><th>Vigentes</th><th>En curso</th><th>Pendientes</th><th>Vencidas</th><th>Cumplimiento</th><th>Ley Karin</th><th>Emitidos en el mes</th></tr></thead><tbody>' +
        R.map(function (r) { return '<tr><td><b>' + h(r.t.nombre) + '</b><br><span class="peq suave">' + h(r.t.run) + '</span></td><td>' + h(r.cargo) + '</td><td>' + r.req + '</td><td>' + r.ok + '</td><td>' + r.n.en_curso + '</td><td>' + r.n.pendiente + '</td><td>' + r.n.vencido + '</td><td><span class="chip ' + al(r.pct) + '">' + r.pct + '%</span></td><td>' + (r.karin === 'vigente' || r.karin === 'por_vencer' ? 'Al día hasta ' + fCl(r.karinVence) : '<span class="chip peligro">' + (r.karin === 'vencido' ? 'Vencida' : 'Pendiente') + '</span>') + '</td><td>' + r.mesN + '</td></tr>'; }).join('') +
        '</tbody></table></div>' : '<p class="suave">Aún no hay trabajadores registrados.</p>') + '</section>';
    $('#rep-mes').addEventListener('change', function () { A.repMes = this.value; vReporte(); });
    $('#rep-csv').addEventListener('click', function () { csvReporte(R, mes); });
    $('#rep-pdf').addEventListener('click', function () { pdfReporte(R, mes); });
  }
  function nombreMes(mes) { var M = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'], p = mes.split('-'); return M[+p[1] - 1] + ' de ' + p[0]; }
  function csvReporte(R, mes) {
    var cursos = PLAN.cursos.slice(), q = function (v) { v = String(v == null ? '' : v); return /[";\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var L = [['Reporte de cumplimiento de capacitaciones', (A.datos.config || {}).EMPRESA || '', 'Mes: ' + nombreMes(mes), 'Generado: ' + fCl(new Date().toISOString().slice(0, 10))],
      ['Trabajador', 'RUN', 'Cargo', 'Exigidas', 'Vigentes', 'En curso', 'Pendientes', 'Vencidas', 'Cumplimiento %', 'Ley Karin', 'Ley Karin vigente hasta', 'Emitidos en el mes'].concat(cursos.map(function (c) { return c.titulo; }))];
    R.forEach(function (r) {
      var porId = {}; r.det.forEach(function (d) { porId[d.id] = d; });
      L.push([r.t.nombre, r.t.run, r.cargo, r.req, r.ok, r.n.en_curso, r.n.pendiente, r.n.vencido, r.pct, EST_TXT[r.karin] || 'Pendiente', fCl(r.karinVence), r.mesN].concat(cursos.map(function (c) { var d = porId[c.id]; return d ? EST_TXT[d.estado] + (d.vence ? ' (vence ' + fCl(d.vence) + ')' : '') : 'No aplica'; })));
    });
    var blob = new Blob(['﻿' + L.map(function (f) { return f.map(q).join(';'); }).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'Reporte_cumplimiento_PyV_' + mes + '.csv'; document.body.appendChild(a); a.click(); a.remove();
  }
  function pdfReporte(R, mes) {
    var C = A.datos.config || {}, glob = R.reduce(function (s, r) { return s + r.req; }, 0), okG = R.reduce(function (s, r) { return s + r.ok; }, 0);
    var kOk = R.filter(function (r) { return r.karin === 'vigente' || r.karin === 'por_vencer'; }).length;
    var col = { vigente: '#1d5e33', por_vencer: '#7a4b00', vencido: '#9b1c1c', en_curso: '#0f3b4c', pendiente: '#555' };
    var html = '<!doctype html><html><head><meta charset="utf-8"><title>Reporte de cumplimiento ' + h(nombreMes(mes)) + '</title><style>' +
      '@page{size:A4 landscape;margin:12mm}body{font-family:Arial,Helvetica,sans-serif;color:#1b2a31;font-size:9.5pt}h1{font-size:16pt;color:#0f3b4c;margin:0}h2{font-size:11pt;color:#0f3b4c;margin:18px 0 6px}.cab{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #f26b1d;padding-bottom:8px;margin-bottom:10px}.cab img{height:56px}' +
      'table{border-collapse:collapse;width:100%;margin-top:6px}th,td{border:1px solid #cfd8dc;padding:4px 6px;text-align:left;vertical-align:top}th{background:#0f3b4c;color:#fff;font-weight:normal}.k{display:inline-block;margin-right:18px}.k b{font-size:13pt;color:#0f3b4c}.trab{page-break-inside:avoid}.firma{margin-top:40px;width:260px;border-top:1px solid #1b2a31;padding-top:4px}' +
      '</style></head><body><div class="cab"><div><h1>Reporte mensual de cumplimiento de capacitaciones</h1><div>' + h(C.EMPRESA || '') + (C.RUT_EMPRESA ? ' · RUT ' + h(C.RUT_EMPRESA) : '') + '</div><div>Mes: <b>' + h(nombreMes(mes)) + '</b> · Estado al ' + fCl(new Date().toISOString().slice(0, 10)) + '</div></div>' + (window.LOGO_PYV ? '<img src="' + LOGO_PYV + '">' : '') + '</div>' +
      '<div><span class="k"><b>' + R.length + '</b> trabajadores</span><span class="k"><b>' + (glob ? Math.round(okG / glob * 100) : 0) + '%</b> cumplimiento general</span><span class="k"><b>' + kOk + ' de ' + R.length + '</b> con Ley Karin semestral al día</span><span class="k"><b>' + R.reduce(function (s, r) { return s + r.mesN; }, 0) + '</b> certificados emitidos en el mes</span></div>' +
      '<h2>Resumen por trabajador</h2><table><tr><th>Trabajador</th><th>RUN</th><th>Cargo</th><th>Exigidas</th><th>Vigentes</th><th>En curso</th><th>Pendientes</th><th>Vencidas</th><th>Cumplimiento</th><th>Ley Karin</th><th>Emitidos en el mes</th></tr>' +
      R.map(function (r) { return '<tr><td>' + h(r.t.nombre) + '</td><td>' + h(r.t.run) + '</td><td>' + h(r.cargo) + '</td><td>' + r.req + '</td><td>' + r.ok + '</td><td>' + r.n.en_curso + '</td><td>' + r.n.pendiente + '</td><td>' + r.n.vencido + '</td><td><b>' + r.pct + '%</b></td><td>' + (r.karin === 'vigente' || r.karin === 'por_vencer' ? 'Al día hasta ' + fCl(r.karinVence) : (r.karin === 'vencido' ? 'Vencida' : 'Pendiente')) + '</td><td>' + r.mesN + '</td></tr>'; }).join('') + '</table>' +
      '<h2>Detalle por trabajador</h2>' + R.map(function (r) {
        return '<div class="trab"><p style="margin:12px 0 2px"><b>' + h(r.t.nombre) + '</b> · ' + h(r.t.run) + ' · ' + h(r.cargo) + ' · cumplimiento ' + r.pct + '%</p><table><tr><th>Capacitación</th><th>Estado</th><th>Avance</th><th>Fecha de aprobación</th><th>Vence</th></tr>' +
          r.det.map(function (d) { return '<tr><td>' + h(d.titulo) + '</td><td style="color:' + col[d.estado] + '"><b>' + EST_TXT[d.estado] + '</b></td><td>' + d.avance + '%</td><td>' + fCl(d.fecha) + '</td><td>' + fCl(d.vence) + '</td></tr>'; }).join('') + '</table></div>';
      }).join('') +
      '<div class="firma"><b>' + h(C.FACILITADOR_NOMBRE || '') + '</b><br>' + h(C.FACILITADOR_TITULO || 'Prevención de Riesgos') + '</div>' +
      '<script>window.onload=function(){setTimeout(function(){window.print();},300);};<\/script></body></html>';
    var w = window.open('', '_blank'); if (!w) { toast('Permite las ventanas emergentes para imprimir el reporte.'); return; }
    w.document.open(); w.document.write(html); w.document.close();
  }
  /* ---------- modo revisión: ver la plataforma como cada cargo ---------- */
  function vRevision() {
    var C = PLAN.cargos;
    $('#vista').innerHTML = '<section class="tarjeta"><h2>Modo revisión</h2>' +
      '<p class="suave">Elige un cargo para ver la plataforma tal como la ve ese trabajador: sus cursos, cada etapa, los riesgos de su Matriz IPER, los juegos, talleres y evaluaciones. En este modo todas las etapas están abiertas, no hay tiempos mínimos y <b>no se registra nada</b>: ni avance, ni respuestas, ni certificados.</p>' +
      '<p class="suave">Se abre en una pestaña nueva. Para tus propias capacitaciones como prevencionista sigue usando tu sesión de trabajadora.</p>' +
      '<div class="rev-grid">' + C.map(function (c) { var n = PLAN.cursosDe(c.id).length; return '<button type="button" class="btn btn-sec rev-cargo" data-rev="' + h(c.id) + '"><b>' + h(c.nombre) + '</b><span>' + n + ' capacitaciones · ' + h(c.area) + '</span></button>'; }).join('') + '</div></section>';
    $$('[data-rev]').forEach(function (b) {
      b.addEventListener('click', function () {
        try { localStorage.setItem('pyv_revision', JSON.stringify({ t: Date.now(), extras: (A.datos.extras || []).filter(function (x) { return x.estado === 'publicado'; }) })); } catch (e) { }
        window.open('index.html?revision=' + encodeURIComponent(b.dataset.rev), '_blank', 'noopener');
      });
    });
  }
  /* ---------- trabajadores ---------- */
  /* ---------- versión vigente del documento y recapacitación masiva ---------- */
  function afectados() { return A.datos.trabajadores.filter(function (t) { var c = cdc(t); return c && (c.certificado || c.iniciado || c.hechos > 0); }); }
  function cajaVersion() {
    var cur = PLAN.curso(A.filtro.curso), ver = (A.datos.config || {})['VERSION_' + A.filtro.curso] || '', n = afectados().length;
    return '<section class="tarjeta"><h2>Documento vigente y actualización</h2>' +
      '<p class="suave">Versión del documento en que se basa «' + h(cur ? cur.titulo : '') + '». Se imprime en cada certificado nuevo.</p>' +
      '<div class="fila-btn"><input type="text" id="ver-v" placeholder="Ej.: 03 o Rev. 2026-11" value="' + h(ver) + '" style="max-width:220px"><button class="btn btn-sec" type="button" id="ver-g">Guardar versión</button></div>' +
      '<h3>¿Cambió el documento?</h3><p class="suave">Pide esta capacitación de nuevo a todos los que ya la iniciaron o aprobaron (' + n + ' trabajador' + (n === 1 ? '' : 'es') + '). Su avance y certificado anterior quedan archivados en el historial; deberán hacerla otra vez con el documento nuevo.</p>' +
      '<div class="grid2"><label class="campo">Nueva versión<input type="text" id="re-v" placeholder="Ej.: 04"></label><label class="campo">Motivo<input type="text" id="re-m" placeholder="Ej.: actualización del PTS por cambio de método"></label></div>' +
      '<div class="fila-btn"><button class="btn btn-pri" type="button" id="re-1"' + (n ? '' : ' disabled') + '>Recapacitar a todos</button></div><div id="re-c"></div></section>';
  }
  function enlazarVersion() {
    $('#ver-g').addEventListener('click', function () { llamar('adminVersion', { curso: A.filtro.curso, version: $('#ver-v').value }).then(function (r) { toast(r.ok ? 'Versión guardada.' : r.error); if (r.ok) cargar(); }); });
    $('#re-1').addEventListener('click', function () {
      var m = $('#re-m').value.trim(), v = $('#re-v').value.trim(), n = afectados().length;
      if (!m) { toast('Escribe el motivo.'); $('#re-m').focus(); return; }
      $('#re-c').innerHTML = '<div class="aviso alerta">Se pedirá de nuevo la capacitación a <b>' + n + '</b> trabajador' + (n === 1 ? '' : 'es') + (v ? ' con la versión <b>' + h(v) + '</b>' : '') + '. ¿Confirmas?</div><div class="fila-btn"><button class="btn btn-pri" type="button" id="re-si">Sí, recapacitar</button><button class="btn btn-sec" type="button" id="re-no">Cancelar</button></div>';
      $('#re-no').onclick = function () { $('#re-c').innerHTML = ''; };
      $('#re-si').onclick = function () {
        this.disabled = true; this.textContent = 'Procesando…';
        llamar('adminReiniciarCurso', { curso: A.filtro.curso, motivo: m, version: v }).then(function (r) { toast(r.ok ? 'Listo: ' + r.reiniciados + ' trabajador(es) deben hacer la capacitación de nuevo.' : r.error); if (r.ok) cargar(); });
      };
    });
  }
  function vTrabajadores() {
    var v = $('#vista'), F = A.filtro;
    v.innerHTML = '<div class="filtros"><input type="text" id="q" placeholder="Buscar por nombre o RUN" value="' + h(F.q) + '">' +
      '<select id="fc"><option value="">Todos los cargos</option>' + PLAN.cargos.map(function (c) { return '<option value="' + c.id + '"' + (F.cargo === c.id ? ' selected' : '') + '>' + h(c.nombre) + '</option>'; }).join('') + '</select>' +
      '<select id="fe"><option value="">Todos los estados</option>' + Object.keys(ESTADOS).map(function (k) { return '<option value="' + k + '"' + (F.estado === k ? ' selected' : '') + '>' + ESTADOS[k] + '</option>'; }).join('') + '</select></div>' +
      '<div class="tabla-scroll" id="tab"></div><div class="fila-btn"><button class="btn btn-sec" type="button" id="csv">Descargar nómina (CSV)</button><button class="btn btn-sec" type="button" id="rec">Actualizar</button></div>' +
      (A.rol === 'admin' ? cajaVersion() : '');
    function filas() {
      var q = F.q.toLowerCase().replace(/[.\-]/g, '');
      return A.datos.trabajadores.filter(function (t) {
        if (estadoDe(t) === 'no_aplica') return false;
        if (F.cargo && t.cargo !== F.cargo) return false; if (F.estado && estadoDe(t) !== F.estado) return false;
        if (q && (t.nombre.toLowerCase().indexOf(q) < 0 && t.run.replace(/[.\-]/g, '').toLowerCase().indexOf(q) < 0)) return false; return true;
      });
    }
    function tabla() {
      var L = filas();
      $('#tab').innerHTML = L.length ? '<table class="tabla"><thead><tr><th>Trabajador</th><th>Avance</th><th>Tiempo</th><th>Plazo / certificado</th><th>Acciones</th></tr></thead><tbody>' + L.map(function (t) {
        var c = cdc(t), est = estadoDe(t), wa = t.telefono ? 'https://wa.me/' + t.telefono.replace(/[^\d]/g, '') + '?text=' + encodeURIComponent('Hola ' + t.nombre.split(' ')[0] + ', te recuerdo avanzar en el curso de prevención de riesgos en PyV Capacita. ' + 'Te falta: ' + (PLAN.curso(A.filtro.curso) || {}).titulo + (c.etapaActual ? ' (vas en ' + c.etapaActual + ')' : '') + '.') : '';
        return '<tr><td><b>' + h(t.nombre) + '</b><br><span class="suave peq">' + h(t.run) + ' · ' + h(cargoN(t.cargo)) + '</span></td>' +
          '<td>' + c.hechos + ' de ' + c.total + '<div class="mini"><i style="width:' + Math.round(c.avance * 100) + '%"></i></div><span class="suave peq">' + h(c.etapaActual || (c.certificado ? 'Terminado' : '')) + '</span></td>' +
          '<td>' + hTxt(c.segundos) + '</td>' +
          '<td>' + (c.certificado ? '<span class="chip' + (c.certificado.vencido ? ' peligro' : c.certificado.porVencer ? ' alerta' : '') + '">' + h(c.certificado.codigo) + '</span><br><span class="suave peq">' + (c.certificado.vence ? (c.certificado.vencido ? 'Venció ' : 'Vence ') + fecha(c.certificado.vence) : 'Sin vencimiento') + '</span>'
            : (A.filtro.curso === 'ds44' && t.fechaLimite) ? '<span class="chip' + (t.plazoVencido ? ' peligro' : '') + '">' + (t.plazoVencido ? 'Vencido ' : 'Hasta ') + fecha(t.fechaLimite) + '</span>' : '<span class="suave peq">' + (c.iniciado ? 'En curso' : 'Sin iniciar') + '</span>') + '</td>' +
          '<td><div class="acciones">' + (A.rol === 'admin' ? '<button type="button" data-det="' + h(t.run) + '">Detalle</button>' : '') +
          (wa ? '<a href="' + h(wa) + '" target="_blank" rel="noopener">WhatsApp</a>' : '') + (t.carpeta ? '<a href="' + h(t.carpeta) + '" target="_blank" rel="noopener">Carpeta</a>' : '') +
          (c.certificado && c.certificado.url ? '<a href="' + h(c.certificado.url) + '" target="_blank" rel="noopener">Certificado</a>' : '') + '</div></td></tr>';
      }).join('') + '</tbody></table>' : '<div class="tarjeta">No hay trabajadores con ese filtro. Comparte el enlace de la plataforma para que se registren.</div>';
      $$('[data-det]').forEach(function (b) { b.addEventListener('click', function () { detalle(b.dataset.det); }); });
    }
    tabla();
    $('#q').addEventListener('input', function () { F.q = this.value; tabla(); });
    $('#fc').addEventListener('change', function () { F.cargo = this.value; tabla(); });
    $('#fe').addEventListener('change', function () { F.estado = this.value; tabla(); });
    $('#rec').addEventListener('click', cargar);
    if (A.rol === 'admin') enlazarVersion();
    $('#csv').addEventListener('click', function () {
      var cab = ['RUN', 'Nombre', 'Cargo', 'Teléfono', 'Registro', 'Inicio', 'Plazo', 'Etapas', 'Tiempo (min)', 'Sesiones', 'Estado', 'Certificado', 'Emisión', 'Vence'];
      var rows = filas().map(function (t) { var c = cdc(t); return [t.run, t.nombre, cargoN(t.cargo), t.telefono, t.fechaRegistro, t.fechaInicio, t.fechaLimite, c.hechos + '/' + c.total, Math.round(c.segundos / 60), t.sesiones, ESTADOS[estadoDe(t)], c.certificado ? c.certificado.codigo : '', c.certificado ? c.certificado.fecha : '', c.certificado ? c.certificado.vence : '']; });
      var csv = '﻿' + [cab].concat(rows).map(function (r) { return r.map(function (x) { x = String(x == null ? '' : x); return /[;"\n]/.test(x) ? '"' + x.replace(/"/g, '""') + '"' : x; }).join(';'); }).join('\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'nomina_' + A.filtro.curso + '.csv'; a.click();
    });
  }

  function detalle(run) {
    var t = A.datos.trabajadores.filter(function (x) { return x.run === run; })[0]; if (!t) return;
    var P = {}; (t.progreso || []).forEach(function (p) { P[p.item] = p; });
    dlg.innerHTML = '<h2>' + h(t.nombre) + '</h2><p class="suave">' + h(t.run) + ' · ' + h(cargoN(t.cargo)) + ' · ciclo ' + t.ciclo + ' · último acceso ' + h(t.ultimoAcceso || '—') + '</p>' +
      '<p><b>' + h((PLAN.curso(A.filtro.curso) || {}).titulo) + '</b></p><ul class="det-lista">' + (PLAN.curso(A.filtro.curso) || { etapas: [] }).etapas.map(function (e) {
        var p = P[e.id]; var txt = e.tipo === 'sesiones' ? t.sesiones + ' registrada(s)' : !p ? '—' : (p.estado === 'completado' ? 'Completado' : 'En curso') + (p.segundos ? ' · ' + Math.round(p.segundos / 60) + ' min' : '') + (p.intentos ? ' · ' + p.intentos + ' intento(s)' : '') + (p.puntaje !== '' && p.puntaje != null ? ' · ' + Math.round(p.puntaje * 100) + '%' : '');
        return '<li><span>' + h(e.titulo) + '</span><span class="suave">' + h(txt) + '</span></li>';
      }).join('') + '</ul>' +
      '<h3 style="margin-top:16px">Restablecer clave</h3><div class="filtros"><input type="text" id="npin" inputmode="numeric" maxlength="4" placeholder="Nueva clave de 4 números"><button class="btn btn-sec" type="button" id="bpin">Restablecer</button></div>' +
      '<h3>Reiniciar esta capacitación</h3><p class="peq suave">Úsalo si venció el plazo, para la recapacitación o si cambió el procedimiento. El historial anterior se conserva en el registro.</p>' +
      '<div class="filtros"><input type="text" id="mot" placeholder="Motivo (obligatorio)"><button class="btn btn-sec" type="button" id="brei">Reiniciar</button></div>' +
      '<div class="fila-btn"><button class="btn btn-pri" type="button" id="cerrar">Cerrar</button></div>';
    dlg.showModal();
    $('#cerrar', dlg).onclick = function () { dlg.close(); };
    $('#bpin', dlg).onclick = function () {
      llamar('adminResetPin', { run: t.run, pin: $('#npin', dlg).value }).then(function (r) { toast(r.ok ? 'Clave restablecida. Avísale al trabajador.' : r.error); });
    };
    $('#brei', dlg).onclick = function () {
      var m = $('#mot', dlg).value.trim(); if (!m) { toast('Escribe el motivo del reinicio.'); return; }
      llamar('adminReiniciar', { run: t.run, motivo: m, curso: A.filtro.curso }).then(function (r) { if (r.ok) { dlg.close(); toast('Curso reiniciado.'); cargar(); } else toast(r.error); });
    };
  }

  /* ---------- sesiones ---------- */
  var TEMAS = ['Sesión 1 · Marco normativo, derechos, factores de riesgo y efectos en la salud', 'Sesión 2 · Medidas de control, señalización, extintores y plan de emergencia', 'Sesión de recuperación'];
  function vSesiones() {
    var v = $('#vista'), S = A.datos.sesiones.slice().reverse(), adm = A.rol === 'admin';
    var hoy = new Date(), f = hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + hoy.getDate()).slice(-2);
    v.innerHTML = (adm ? '<section class="tarjeta"><h2>Nueva sesión</h2><p class="peq suave">Al crearla se genera un código. Los trabajadores lo ingresan en su celular y firman su asistencia.</p><form id="fs"><div class="grid2">' +
      '<label class="campo">Fecha<input type="date" name="fecha" value="' + f + '" required></label>' +
      '<label class="campo">Tema<select name="tema">' + TEMAS.map(function (t) { return '<option>' + h(t) + '</option>'; }).join('') + '</select></label>' +
      '<label class="campo">Hora de inicio<input type="time" name="horaInicio" value="09:00"></label><label class="campo">Hora de término<input type="time" name="horaTermino" value="11:00"></label>' +
      '<label class="campo">Modalidad<select name="modalidad"><option>Presencial</option><option>Telemática sincrónica</option><option>Grupo reunido en faena con facilitadora en línea</option></select></label>' +
      '<label class="campo">Lugar o embarcación<input type="text" name="lugar" placeholder="Ej.: L/M La Minga, centro ..."></label></div>' +
      '<button class="btn btn-pri" type="submit">Crear sesión y generar código</button></form></section>' : '') +
      (S.length ? S.map(function (s) {
        var presentes = {}; s.asistentes.forEach(function (a) { presentes[a.run] = 1; });
        var otros = A.datos.trabajadores.filter(function (t) { return !presentes[t.run]; });
        return '<section class="tarjeta"><div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:space-between"><div><h3>' + h(s.tema) + '</h3><div class="suave">' + fecha(s.fecha) + ' · ' + h(s.horaInicio) + '–' + h(s.horaTermino) + ' · ' + h(s.modalidad) + (s.lugar ? ' · ' + h(s.lugar) : '') + '</div><div class="suave peq">Facilitadora: ' + h(s.facilitador) + ' · ' + h(s.id) + '</div></div>' +
          (adm ? '<div style="text-align:right"><div class="codigo-ses">' + h(s.codigo) + '</div><span class="chip' + (s.estado === 'cerrada' ? '' : ' alerta') + '">' + (s.estado === 'cerrada' ? 'Cerrada' : 'Abierta para registrar') + '</span></div>' : '') + '</div>' +
          '<h4 style="margin:14px 0 6px">Asistentes (' + s.asistentes.length + ')</h4>' + (s.asistentes.length ? '<ul class="det-lista">' + s.asistentes.map(function (a) { return '<li><span>' + h(a.nombre) + ' <span class="suave peq">' + h(a.run) + '</span></span><span class="suave peq">' + h(a.metodo) + (adm ? ' · <button type="button" class="btn-ter" style="min-height:0;padding:0" data-quitar="' + h(a.run) + '" data-s="' + h(s.id) + '">quitar</button>' : '') + '</span></li>'; }).join('') + '</ul>' : '<p class="suave peq">Aún nadie registra asistencia.</p>') +
          (adm ? '<div class="filtros" style="margin-top:10px"><select data-agr="' + h(s.id) + '"><option value="">Agregar asistente manualmente…</option>' + otros.map(function (t) { return '<option value="' + h(t.run) + '">' + h(t.nombre) + '</option>'; }).join('') + '</select>' +
            '<label class="btn btn-sec" style="flex:0 0 auto">Subir foto de evidencia<input type="file" accept="image/*" data-ev="' + h(s.id) + '" class="sr"></label>' +
            '<button type="button" class="btn btn-sec" style="flex:0 0 auto" data-estado="' + h(s.id) + '" data-v="' + (s.estado === 'cerrada' ? 'abierta' : 'cerrada') + '">' + (s.estado === 'cerrada' ? 'Reabrir' : 'Cerrar registro') + '</button></div>' : '') +
          (s.evidencias.length ? '<p class="peq">Evidencias: ' + s.evidencias.map(function (e, i) { return e.url ? '<a href="' + h(e.url) + '" target="_blank" rel="noopener">foto ' + (i + 1) + '</a>' : 'foto ' + (i + 1); }).join(', ') + '</p>' : '') + '</section>';
      }).join('') : '<div class="tarjeta">Todavía no hay sesiones.</div>');
    if (!adm) return;
    $('#fs').addEventListener('submit', function (ev) {
      ev.preventDefault(); var fm = ev.target, b = $('button', fm); b.disabled = true;
      llamar('adminSesionCrear', { fecha: fm.fecha.value, tema: fm.tema.value, horaInicio: fm.horaInicio.value, horaTermino: fm.horaTermino.value, modalidad: fm.modalidad.value, lugar: fm.lugar.value })
        .then(function (r) { b.disabled = false; if (r.ok) { toast('Sesión creada. Código: ' + r.sesion.codigo); cargar(); } else toast(r.error); });
    });
    $$('[data-agr]').forEach(function (s) { s.addEventListener('change', function () { if (!s.value) return; llamar('adminAsistencia', { sesionId: s.dataset.agr, run: s.value, presente: true }).then(function () { cargar(); }); }); });
    $$('[data-quitar]').forEach(function (b) { b.addEventListener('click', function () { if (confirm('¿Quitar esta asistencia?')) llamar('adminAsistencia', { sesionId: b.dataset.s, run: b.dataset.quitar, presente: false }).then(function () { cargar(); }); }); });
    $$('[data-estado]').forEach(function (b) { b.addEventListener('click', function () { llamar('adminSesionEstado', { sesionId: b.dataset.estado, estado: b.dataset.v }).then(function () { cargar(); }); }); });
    $$('[data-ev]').forEach(function (inp) {
      inp.addEventListener('change', function () {
        var f = inp.files[0]; if (!f) return; toast('Subiendo foto…');
        reducir(f, 1600).then(function (url) { return llamar('adminEvidencia', { sesionId: inp.dataset.ev, nombre: f.name.replace(/\.[^.]+$/, '') + '.jpg', dataUrl: url }); })
          .then(function (r) { toast(r.ok ? 'Foto guardada en Drive.' : r.error); cargar(); });
      });
    });
  }
  function reducir(file, max) {
    return new Promise(function (ok, mal) {
      var img = new Image(), u = URL.createObjectURL(file);
      img.onload = function () { var k = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u); ok(c.toDataURL('image/jpeg', 0.82)); };
      img.onerror = mal; img.src = u;
    });
  }

  /* ---------- respuestas de talleres ---------- */
  function vRespuestas() {
    var L = (A.datos.talleres || []).slice().reverse();
    $('#vista').innerHTML = '<section class="tarjeta"><h2>Respuestas de los talleres</h2><p class="peq suave">Lo que escriben los trabajadores en los talleres: observaciones de señalética y recursos de emergencia, EPP que necesitan reponer, tareas que faltan en la matriz y sus análisis de casos.</p>' +
      (L.length ? L.map(function (o) { var e = PLAN.etapa(o.taller); return '<div class="proc"><b>' + h(o.nombre) + '</b> <span class="suave peq">' + h(cargoN(o.cargo)) + ' · ' + h(o.fecha) + ' · ' + h(e ? e.titulo : o.taller) + '</span>' + o.respuestas.map(function (r) { return '<p class="peq" style="margin:8px 0 0"><span class="suave">' + h(r.p) + '</span><br>' + h(r.r) + '</p>'; }).join('') + '</div>'; }).join('') : '<p>Todavía no hay respuestas.</p>') + '</section>';
  }

  /* ---------- crear capacitaciones ---------- */
  function vCapacitaciones() {
    var X = A.datos.extras || [];
    $('#vista').innerHTML = '<section class="tarjeta"><h2>Crear capacitación</h2><p>Para un documento nuevo (procedimiento, instructivo, charla, protocolo): súbelo, escribe la cápsula y las preguntas, elige los cargos y publica. Aparece de inmediato en los celulares de esos cargos, con evaluación, firma opcional y certificado.</p>' +
      '<button class="btn btn-pri" type="button" id="nueva">Nueva capacitación</button></section>' +
      (X.length ? '<section class="tarjeta"><h3>Creadas</h3>' + X.map(function (x, i) { return '<div class="proc"><b>' + h(x.titulo) + '</b> <span class="chip' + (x.estado === 'publicado' ? ' ok-chip' : '') + '">' + (x.estado === 'publicado' ? 'Publicada' : 'Borrador') + '</span><br><span class="suave peq">' + (x.cargos === '*' ? 'Todos los cargos' : x.cargos.map(cargoN).join(', ')) + ' · actualizada ' + h(x.actualizado) + '</span><div class="acciones" style="margin-top:6px"><button type="button" data-ed="' + i + '">Editar</button>' + (x.documentoUrl ? '<a href="' + h(x.documentoUrl) + '" target="_blank" rel="noopener">Documento</a>' : '') + '</div></div>'; }).join('') + '</section>' : '');
    $('#nueva').onclick = function () { editor(null); };
    $$('[data-ed]').forEach(function (b) { b.onclick = function () { editor(X[+b.dataset.ed]); }; });
  }
  function editor(x) {
    x = x || { titulo: '', sub: '', cargos: [], horas: 1, vigenciaMeses: 12, firma: true, declaracion: '', documentoUrl: '', contenido: { diapositivas: [{ t: '', x: '' }], preguntas: [{ p: '', op: ['', '', '', ''], ok: 1 }] } };
    var C = x.contenido || {}, diap = (C.diapositivas || []).map(function (d) { return { t: d.t, x: [d.x || ''].concat((d.l || []).map(function (l) { return '- ' + l; })).filter(Boolean).join('\n') }; }), preg = C.preguntas || [];
    var v = $('#vista');
    function pintarEd() {
      v.innerHTML = '<section class="tarjeta"><button class="volver" type="button" id="cancelar">Volver</button><h2>' + (x.id ? 'Editar' : 'Nueva') + ' capacitación</h2>' +
        '<label class="campo">Título<input type="text" id="e-tit" value="' + h(x.titulo) + '" placeholder="Ej.: PTS-022 Manejo de redes"></label>' +
        '<label class="campo">Descripción corta<input type="text" id="e-sub" value="' + h(x.sub) + '" placeholder="Ej.: Procedimiento de trabajo seguro"></label>' +
        '<div class="grid2"><label class="campo">Horas del programa<input type="text" id="e-hor" inputmode="decimal" value="' + h(x.horas) + '"></label><label class="campo">Vigencia del certificado (meses, 0 = sin vencimiento)<input type="text" id="e-vig" inputmode="numeric" value="' + h(x.vigenciaMeses) + '"></label></div>' +
        '<div class="campo">Documento (PDF o Word)' + (x.documentoUrl ? ' · <a href="' + h(x.documentoUrl) + '" target="_blank" rel="noopener">ver actual</a>' : '') + '<input type="file" id="e-doc" accept=".pdf,.doc,.docx" style="margin-top:6px"></div>' +
        '<div class="campo">Cargos<label class="check"><input type="checkbox" id="e-todos"' + (x.cargos === '*' ? ' checked' : '') + '><span>Todos los cargos</span></label><div class="grid2">' + PLAN.cargos.map(function (c) { return '<label class="check" style="margin:4px 0"><input type="checkbox" data-cargo="' + c.id + '"' + (x.cargos !== '*' && x.cargos.indexOf(c.id) >= 0 ? ' checked' : '') + '><span>' + h(c.nombre) + '</span></label>'; }).join('') + '</div></div>' +
        '<h3>Cápsula: diapositivas</h3><p class="peq suave">Una idea por diapositiva. Las líneas que empiezan con guion se muestran como lista.</p><div id="e-diap">' +
        diap.map(function (d, i) { return '<div class="proc"><label class="campo">Diapositiva ' + (i + 1) + ' · título<input type="text" data-dt="' + i + '" value="' + h(d.t) + '"></label><label class="campo">Texto<textarea data-dx="' + i + '" rows="4">' + h(d.x) + '</textarea></label>' + (diap.length > 1 ? '<button class="btn btn-ter" type="button" data-dq="' + i + '">Quitar</button>' : '') + '</div>'; }).join('') +
        '</div><button class="btn btn-sec" type="button" id="e-mas-d">Agregar diapositiva</button>' +
        '<h3 style="margin-top:18px">Evaluación</h3><p class="peq suave">Mínimo 3 preguntas. Marca la alternativa correcta. Se aprueba con 70% y se puede repetir.</p><div id="e-preg">' +
        preg.map(function (q, i) { return '<div class="proc"><label class="campo">Pregunta ' + (i + 1) + '<input type="text" data-pp="' + i + '" value="' + h(q.p) + '"></label>' + [0, 1, 2, 3].map(function (j) { return '<label class="check" style="margin:4px 0"><input type="radio" name="ok' + i + '" data-pok="' + i + '" value="' + (j + 1) + '"' + (q.ok === j + 1 ? ' checked' : '') + '><input type="text" data-po="' + i + '-' + j + '" value="' + h((q.op || [])[j] || '') + '" placeholder="Alternativa ' + 'ABCD'[j] + '" style="margin:0"></label>'; }).join('') + (preg.length > 1 ? '<button class="btn btn-ter" type="button" data-pq="' + i + '">Quitar</button>' : '') + '</div>'; }).join('') +
        '</div><button class="btn btn-sec" type="button" id="e-mas-p">Agregar pregunta</button>' +
        '<h3 style="margin-top:18px">Firma</h3><label class="check"><input type="checkbox" id="e-firma"' + (x.firma ? ' checked' : '') + '><span>Pedir firma del trabajador al final</span></label>' +
        '<label class="campo">Texto de la declaración<textarea id="e-decl" rows="3" placeholder="Declaro que recibí, leí y comprendí...">' + h(x.declaracion) + '</textarea></label>' +
        '<div id="e-msg"></div><div class="fila-btn"><button class="btn btn-sec" type="button" id="e-borr">Guardar borrador</button><button class="btn btn-pri" type="button" id="e-pub">Publicar</button></div></section>';
      $('#cancelar').onclick = vCapacitaciones;
      $('#e-mas-d').onclick = function () { leer(); diap.push({ t: '', x: '' }); pintarEd(); };
      $('#e-mas-p').onclick = function () { leer(); preg.push({ p: '', op: ['', '', '', ''], ok: 1 }); pintarEd(); };
      $$('[data-dq]').forEach(function (b) { b.onclick = function () { leer(); diap.splice(+b.dataset.dq, 1); pintarEd(); }; });
      $$('[data-pq]').forEach(function (b) { b.onclick = function () { leer(); preg.splice(+b.dataset.pq, 1); pintarEd(); }; });
      $('#e-borr').onclick = function () { guardar('borrador'); };
      $('#e-pub').onclick = function () { guardar('publicado'); };
    }
    function leer() {
      x.titulo = $('#e-tit').value; x.sub = $('#e-sub').value; x.horas = $('#e-hor').value; x.vigenciaMeses = $('#e-vig').value;
      x.cargos = $('#e-todos').checked ? '*' : $$('[data-cargo]').filter(function (c) { return c.checked; }).map(function (c) { return c.dataset.cargo; });
      x.firma = $('#e-firma').checked; x.declaracion = $('#e-decl').value;
      diap = diap.map(function (d, i) { return { t: $('[data-dt="' + i + '"]').value, x: $('[data-dx="' + i + '"]').value }; });
      preg = preg.map(function (q, i) { var ok = $$('[data-pok="' + i + '"]').filter(function (r) { return r.checked; })[0]; return { p: $('[data-pp="' + i + '"]').value, op: [0, 1, 2, 3].map(function (j) { return $('[data-po="' + i + '-' + j + '"]').value.trim(); }), ok: ok ? +ok.value : 0 }; });
    }
    function guardar(estado) {
      leer();
      var msg = $('#e-msg');
      if (x.cargos !== '*' && !x.cargos.length) { msg.innerHTML = '<div class="aviso error">Elige al menos un cargo.</div>'; return; }
      var D = diap.filter(function (d) { return d.t.trim() || d.x.trim(); }).map(function (d) {
        var lineas = d.x.split('\n'), l = lineas.filter(function (s) { return /^\s*[-•]/.test(s); }).map(function (s) { return s.replace(/^\s*[-•]\s*/, ''); }), txt = lineas.filter(function (s) { return !/^\s*[-•]/.test(s); }).join('\n').trim();
        return { t: d.t.trim() || 'Diapositiva', x: txt, l: l };
      });
      var Q = preg.filter(function (q) { return q.p.trim(); }).map(function (q) {
        var ops = [], ok = 0; q.op.forEach(function (o, j) { if (o) { ops.push(o); if (q.ok === j + 1) ok = ops.length; } });
        return { p: q.p.trim(), op: ops, ok: ok, fbOk: 'Correcto.', fbNo: ok ? 'La respuesta correcta es: ' + ops[ok - 1] + '.' : '' };
      });
      var bad = Q.filter(function (q) { return q.op.length < 2 || !q.ok; })[0];
      if (bad) { msg.innerHTML = '<div class="aviso error">La pregunta "' + h(bad.p) + '" necesita al menos 2 alternativas y la correcta marcada.</div>'; return; }
      var envio = function (url) {
        msg.innerHTML = '<div class="aviso info">Guardando…</div>';
        llamar('adminCursoGuardar', { curso: { id: x.id, titulo: x.titulo, sub: x.sub, cargos: x.cargos, horas: x.horas, vigenciaMeses: x.vigenciaMeses, firma: x.firma, declaracion: x.declaracion, documentoUrl: url || x.documentoUrl, estado: estado, contenido: { diapositivas: D, preguntas: Q, n: Math.min(Q.length, 8) } } })
          .then(function (r) { if (r.ok) { toast(estado === 'publicado' ? 'Capacitación publicada.' : 'Borrador guardado.'); cargar(); A.tab = 'capacitaciones'; } else msg.innerHTML = '<div class="aviso error">' + h(r.error) + '</div>'; });
      };
      var f = $('#e-doc').files[0];
      if (!f) return envio('');
      if (f.size > 20e6) { msg.innerHTML = '<div class="aviso error">El documento pesa más de 20 MB. Comprímelo o súbelo en PDF.</div>'; return; }
      msg.innerHTML = '<div class="aviso info">Subiendo documento…</div>';
      var fr = new FileReader(); fr.onload = function () { llamar('adminCursoDocumento', { nombre: f.name, dataUrl: fr.result }).then(function (r) { if (r.ok) envio(r.url); else msg.innerHTML = '<div class="aviso error">' + h(r.error) + '</div>'; }); }; fr.readAsDataURL(f);
    }
    pintarEd();
  }

  /* ---------- expediente ---------- */
  function vExpediente() {
    $('#vista').innerHTML = '<section class="tarjeta"><h2>Expediente para fiscalización</h2><p>Genera en tu Google Drive una carpeta con fecha que contiene:</p><ul>' +
      '<li>PDF con el programa, la facilitadora, la nómina con RUN, fechas, tiempo registrado, sesiones y resultado de cada trabajador, y los certificados emitidos (punto 6.2.1 de la Guía Técnica).</li>' +
      '<li>Una copia congelada de la planilla de registro con todos los accesos, tiempos e intentos de evaluación.</li></ul>' +
      '<p class="peq suave">Cada trabajador además tiene su carpeta con la constancia del manual, la constancia de información de riesgos, sus firmas de asistencia, su registro individual y su certificado. Conserva todo al menos 5 años.</p>' +
      '<button class="btn btn-pri" type="button" id="gen">Generar expediente ahora</button><div id="res"></div></section>';
    $('#gen').addEventListener('click', function () {
      var b = this; b.disabled = true; b.textContent = 'Generando…';
      llamar('adminExpediente').then(function (r) {
        b.disabled = false; b.textContent = 'Generar expediente ahora';
        $('#res').innerHTML = r.ok ? '<div class="aviso ok">Expediente generado.' + (r.carpeta && r.carpeta !== 'file://' ? ' <a href="' + h(r.carpeta) + '" target="_blank" rel="noopener">Abrir carpeta</a>' : ' (en modo demostración no se crean archivos)') + '</div>' : '<div class="aviso error">' + h(r.error) + '</div>';
      });
    });
  }

  /* ---------- configuración ---------- */
  function cajaFirma(q, titulo, id) {
    return '<div class="campo"><b>' + h(titulo) + '</b><span class="ayuda" style="display:block;margin-bottom:6px">' + (id ? 'Firma guardada ✓ (dibuja otra para reemplazarla)' : 'Aún sin firma') + '</span>' +
      '<canvas id="fz-' + q + '" width="600" height="200" style="width:100%;max-width:420px;aspect-ratio:3/1;border:1px dashed #9fb3bb;border-radius:8px;background:#fff;touch-action:none"></canvas>' +
      '<div class="fila-btn"><button class="btn btn-sec" type="button" id="fl-' + q + '">Borrar</button><label class="btn btn-sec">Subir imagen<input type="file" accept="image/png,image/jpeg" id="fa-' + q + '" hidden></label><button class="btn btn-pri" type="button" id="fg-' + q + '">Guardar firma</button>' +
      (id ? '<button class="btn btn-sec" type="button" id="fq-' + q + '">Quitar</button>' : '') + '</div></div>';
  }
  function vConfig() {
    var C = A.datos.config;
    function campo(k, et, ayuda) { return '<label class="campo">' + et + (ayuda ? '<span class="ayuda">' + ayuda + '</span>' : '') + '<input type="text" name="' + k + '" value="' + h(C[k] || '') + '"></label>'; }
    $('#vista').innerHTML = '<section class="tarjeta"><h2>Datos del curso y del certificado</h2><form id="fc"><div class="grid2">' +
      campo('FACILITADOR_NOMBRE', 'Nombre de la facilitadora') + campo('FACILITADOR_RUN', 'RUN de la facilitadora') +
      campo('FACILITADOR_TITULO', 'Título profesional') + campo('FACILITADOR_REGISTRO', 'N° de registro SEREMI', 'Opcional') +
      campo('EMPRESA', 'Empresa') + campo('RUT_EMPRESA', 'RUT de la empresa') + campo('ORGANISMO', 'Organismo administrador') + campo('HORAS_CURSO', 'Horas del curso obligatorio', 'También es el tiempo mínimo que el trabajador debe tener registrado para certificar.') +
      campo('RL_NOMBRE', 'Nombre del representante legal') + campo('RL_RUN', 'RUN del representante legal') + campo('RL_CARGO', 'Cargo del representante legal') +
      '<label class="campo">¿Exigir sesiones prácticas para certificar?<span class="ayuda">Por defecto el curso es 100% asincrónico (las actividades presenciales están adaptadas como talleres). Activa esto solo si quieres sumar sesiones en vivo.</span><select name="REQUIERE_SESIONES"><option value="SI"' + (C.REQUIERE_SESIONES === 'SI' ? ' selected' : '') + '>Sí</option><option value="NO"' + (C.REQUIERE_SESIONES === 'NO' ? ' selected' : '') + '>No</option></select></label>' +
      campo('SESIONES_REQUERIDAS', 'Número de sesiones requeridas') +
      campo('URL_SITIO', 'Dirección del sitio', 'Se usa en el QR de verificación del certificado. Ej.: https://pyv-capacita.github.io') + '</div>' +
      '<h3>Cambiar claves</h3><div class="grid2"><label class="campo">Nueva clave de administración<input type="password" name="adm" autocomplete="new-password"></label><label class="campo">Nueva clave de supervisores<input type="password" name="sup" autocomplete="new-password"></label></div>' +
      '<button class="btn btn-pri" type="submit">Guardar configuración</button></form></section>' +
      '<section class="tarjeta"><h2>Firmas del certificado</h2><p class="suave">Firma con el dedo o el mouse en el recuadro, o sube una foto de la firma sobre papel blanco. Se imprime sobre la línea de firma de todos los certificados que se emitan desde ahora.</p><div class="grid2">' +
      cajaFirma('apr', 'Prevención de riesgos (' + (C.FACILITADOR_NOMBRE || 'facilitadora') + ')', C.FIRMA_APR_ID) +
      cajaFirma('rl', 'Representante legal (' + (C.RL_NOMBRE || 'sin nombre') + ')', C.FIRMA_RL_ID) + '</div></section>';
    ['apr', 'rl'].forEach(function (q) {
      var cv = $('#fz-' + q), cx = cv.getContext('2d'), dib = false, hay = false;
      cx.lineWidth = 2.6; cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.strokeStyle = '#10243a';
      function pos(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; }
      cv.addEventListener('pointerdown', function (e) { dib = true; hay = true; cv.setPointerCapture(e.pointerId); var p = pos(e); cx.beginPath(); cx.moveTo(p[0], p[1]); e.preventDefault(); });
      cv.addEventListener('pointermove', function (e) { if (!dib) return; var p = pos(e); cx.lineTo(p[0], p[1]); cx.stroke(); e.preventDefault(); });
      cv.addEventListener('pointerup', function () { dib = false; });
      $('#fl-' + q).addEventListener('click', function () { cx.clearRect(0, 0, cv.width, cv.height); hay = false; });
      $('#fa-' + q).addEventListener('change', function (e) {
        var file = e.target.files[0]; if (!file) return;
        var img = new Image(); img.onload = function () {
          cx.clearRect(0, 0, cv.width, cv.height); var k = Math.min(cv.width / img.width, cv.height / img.height);
          cx.drawImage(img, (cv.width - img.width * k) / 2, (cv.height - img.height * k) / 2, img.width * k, img.height * k);
          // fondo blanco → transparente, para que no tape la línea
          var d = cx.getImageData(0, 0, cv.width, cv.height); for (var i = 0; i < d.data.length; i += 4) { if (d.data[i] > 200 && d.data[i + 1] > 200 && d.data[i + 2] > 200) d.data[i + 3] = 0; } cx.putImageData(d, 0, 0);
          hay = true;
        }; img.src = URL.createObjectURL(file);
      });
      $('#fg-' + q).addEventListener('click', function () {
        if (!hay) { toast('Primero firma o sube la imagen.'); return; }
        llamar('adminFirma', { quien: q, imagen: cv.toDataURL('image/png') }).then(function (r) { toast(r.ok ? 'Firma guardada.' : r.error); if (r.ok) cargar(); });
      });
      var bq = $('#fq-' + q); if (bq) bq.addEventListener('click', function () { llamar('adminFirma', { quien: q, imagen: '' }).then(function (r) { toast(r.ok ? 'Firma quitada.' : r.error); if (r.ok) cargar(); }); });
    });
    $('#fc').addEventListener('submit', function (ev) {
      ev.preventDefault(); var f = ev.target, val = {};
      ['FACILITADOR_NOMBRE', 'FACILITADOR_RUN', 'FACILITADOR_TITULO', 'FACILITADOR_REGISTRO', 'EMPRESA', 'RUT_EMPRESA', 'ORGANISMO', 'HORAS_CURSO', 'REQUIERE_SESIONES', 'SESIONES_REQUERIDAS', 'URL_SITIO', 'RL_NOMBRE', 'RL_RUN', 'RL_CARGO'].forEach(function (k) { val[k] = f[k].value.trim(); });
      llamar('adminConfig', { valores: val, nuevaClaveAdmin: f.adm.value || undefined, nuevaClaveSupervisor: f.sup.value || undefined }).then(function (r) { toast(r.ok ? 'Configuración guardada.' : r.error); if (r.ok) cargar(); });
    });
  }

  if (SRV.demo) $('#demo-banda').classList.remove('oculto');
  var s = null; try { s = JSON.parse(sessionStorage.getItem('pyv_adm')); } catch (e) { }
  if (s && s.tok) { A.tok = s.tok; A.rol = s.rol; $('#btn-salir').classList.remove('oculto'); cargar(); } else ingreso();
})();
