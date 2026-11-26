// ============================================
// ARCHIVO JAVASCRIPT UNIFICADO
// Incluye: comparar.js + costos.js
// ============================================

// ============================================
// PARTE 1: LÓGICA DE COMPARAR (comparar.js)
// ============================================
document.addEventListener('click', function(e) {
  // 1. ABRIR MODAL Y CREAR LOS CONTROLES
  if (e.target && e.target.closest('#btn-comparar-precios')) {
    const modal = document.getElementById('modal-comparar-precios');
    if (modal) {
      modal.classList.add('visible');
      document.body.style.overflow = 'hidden';
      
      const container = document.getElementById('comparar-checkboxes');
      if (container) {
        container.innerHTML = ''; 
        
        // --- A. CREAR EL MENÚ DESPLEGABLE DE CATEGORÍA CON CHECKBOXES ---
        const divCat = document.createElement('div');
        divCat.style.cssText = 'position: relative; display: inline-block; margin-right: 10px;';
        
        const btnCat = document.createElement('button');
        btnCat.type = 'button';
        btnCat.innerHTML = 'Categorías <i class="fas fa-caret-down" style="margin-left:5px;"></i>';
        btnCat.style.cssText = 'background: white; border: 1px solid #cbd5e1; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.6rem; font-weight: 600; color: #334155; cursor: pointer; display: flex; align-items: center;';
        
        const dropdown = document.createElement('div');
        dropdown.style.cssText = 'display: none; position: absolute; top: 100%; left: 0; background: white; border: 1px solid #cbd5e1; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); padding: 0.5rem; z-index: 100; min-width: 180px; max-height: 200px; overflow-y: auto; margin-top: 4px;';
        
        const filas = document.querySelectorAll('#tbody-materiales tr');
        const categoriasUnicas = new Set();
        
        filas.forEach(tr => {
          if (tr.classList.contains('fila-agregar') || tr.classList.contains('fila-nueva-editable')) return;
          let tds = tr.querySelectorAll('td');
          if (tds.length > 6) {
            let catText = tds[6].innerText.trim();
            if (catText && catText !== '—') {
              categoriasUnicas.add(catText);
            }
          }
        });
        
        Array.from(categoriasUnicas).sort().forEach(cat => {
          const lbl = document.createElement('label');
          lbl.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; padding: 0.3rem; font-size: 0.6rem; font-weight: 600; color: #334155; cursor: pointer; border-radius: 4px;';
          lbl.onmouseover = () => lbl.style.background = '#f1f5f9';
          lbl.onmouseout = () => lbl.style.background = 'transparent';
          lbl.innerHTML = `<input type="checkbox" class="check-categoria" value="${cat}" style="accent-color: #f59e0b; width: 14px; height: 14px;"> ${cat}`;
          dropdown.appendChild(lbl);
        });

        btnCat.addEventListener('click', function(ev) {
          ev.stopPropagation();
          dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', function(ev) {
          if (dropdown.style.display === 'block' && !divCat.contains(ev.target)) {
            dropdown.style.display = 'none';
          }
        });

        divCat.appendChild(btnCat);
        divCat.appendChild(dropdown);
        container.appendChild(divCat);

        // --- B. CREAR LOS DEMÁS CHECKBOXES ---
        const columnas = [
          { key: 'lugar', label: 'Lugar' },
          { key: 'nombre', label: 'Nombre' },
          { key: 'especificacion', label: 'Especificación' },
          { key: 'marca', label: 'Marca' },
          { key: 'unidad', label: 'UND' },
          { key: 'cantidad', label: 'Cantidad' },
          { key: 'subtotal', label: 'Subtotal' },
          { key: 'porcentajeIVA', label: '%IVA' },
          { key: 'iva', label: 'IVA' },
          { key: 'precio', label: 'Precio' },
          { key: 'precioUnidad', label: 'Precio/Unidad' },
          { key: 'tarjeta', label: 'Tarjeta' },
          { key: 'condicion', label: 'Condición' },
          { key: 'cantidadCompra', label: 'Cantidad Compra' },
          { key: 'valorCompra', label: 'Valor Compra' },
          { key: 'evaluador', label: 'Evaluador' }
        ];
        
        columnas.forEach(col => {
          const lbl = document.createElement('label');
          lbl.style.cssText = 'display: inline-flex; align-items: center; gap: 0.2rem; font-size: 0.6rem; cursor: pointer; background: white; padding: 0.2rem 0.4rem; border-radius: 6px; border: 1px solid #cbd5e1; font-weight: 600; color: #334155; margin-right: 0.5px;';
          lbl.innerHTML = `<input type="checkbox" value="${col.key}" checked style="accent-color: #f59e0b; width: 14px; height: 14px;"> ${col.label}`;
          container.appendChild(lbl);
        });
      }
    }
  }

  // 2. GENERAR TABLA (CON ORDEN ALFABÉTICO)
  if (e.target && e.target.closest('#btn-generar-comparacion')) {
    const checkboxesCat = document.querySelectorAll('.check-categoria:checked');
    const filtroCategorias = Array.from(checkboxesCat).map(cb => cb.value);

    const checkboxes = document.querySelectorAll('#comparar-checkboxes input[type="checkbox"]:not(.check-categoria):checked');
    const columnasSeleccionadas = Array.from(checkboxes).map(cb => cb.value);

    if (columnasSeleccionadas.length === 0) {
      alert('Selecciona al menos una columna');
      return;
    }

    const contenedor = document.getElementById('contenedor-tabla-comparar');
    contenedor.style.display = 'block';
    
    let html = '<table style="width: 100%; border-collapse: collapse; font-size: 10px; text-align: center; background: white;">';
    html += '<thead style="background: #0b2a4a; color: white; position: sticky; top: 0; z-index: 10;"><tr>';
    
    let mostrarCategoria = filtroCategorias.length > 0;
    if (mostrarCategoria) {
      html += `<th style="padding: 0.6rem; border: 1px solid #1e4a6f; white-space: nowrap; min-width: 60px; width: 60px;">Categoría</th>`;
    }

    columnasSeleccionadas.forEach(col => {
      const nombreCol = {
        lugar: 'Lugar', nombre: 'Nombre', especificacion: 'Especificación', 
        marca: 'Marca', unidad: 'UND', cantidad: 'Cantidad', subtotal: 'Subtotal', 
        porcentajeIVA: '%IVA', iva: 'IVA', precio: 'Precio', precioUnidad: 'Precio/Unidad',
        tarjeta: 'Tarjeta', condicion: 'Condición', cantidadCompra: 'Cantidad Compra', valorCompra: 'Valor Compra', evaluador: 'Evaluador'
      }[col];
      let anchoCol = '50px';
      if (nombreCol === 'Nombre') anchoCol = '130px';
      if (nombreCol === 'Especificación') anchoCol = '90px';
      if (nombreCol === 'Lugar') anchoCol = '60px';
      if (nombreCol === 'Precio/Unidad') anchoCol = '2px';
      if (nombreCol === 'Categoría') anchoCol = '80px';
      if (nombreCol === 'UND') anchoCol = '2px';
      if (nombreCol === 'Cantidad') anchoCol = '2px';
      if (nombreCol === 'Tarjeta') anchoCol = '50px';
      if (nombreCol === 'Condición') anchoCol = '100px';
      if (nombreCol === 'Cantidad Compra') anchoCol = '20px';
      if (nombreCol === 'Valor Compra') anchoCol = '20px';
      if (nombreCol === 'Evaluador') anchoCol = '120px';
      
      let saltarLinea = (nombreCol === 'Cantidad Compra' || nombreCol === 'Valor Compra' || nombreCol === 'Evaluador') ? 'normal' : 'nowrap';
      
      html += `<th style="padding: 0.6rem; border: 1px solid #1e4a6f; white-space: ${saltarLinea}; min-width: ${anchoCol}; width: ${anchoCol};">${nombreCol}</th>`;
    });
    html += '</tr></thead><tbody>';

    let filas = document.querySelectorAll('#tbody-materiales tr');
    let datosFiltrados = [];

    filas.forEach(tr => {
      if (tr.classList.contains('fila-agregar') || tr.classList.contains('fila-nueva-editable')) return;
      let tds = tr.querySelectorAll('td');
      if (tds.length < 10) return;
      
      let catFila = tds[6].innerText.trim();
      if (filtroCategorias.length > 0 && !filtroCategorias.includes(catFila)) return;
      
      datosFiltrados.push({
        categoria: catFila,
        lugar: tds[4].innerText.trim(),
        tds: tds
      });
    });

    datosFiltrados.sort((a, b) => {
      if (a.categoria < b.categoria) return -1;
      if (a.categoria > b.categoria) return 1;
      if (a.lugar < b.lugar) return -1;
      if (a.lugar > b.lugar) return 1;
      return 0;
    });

    datosFiltrados.forEach(item => {
      let tds = item.tds;
      html += '<tr style="border-bottom: 1px solid #eef2f7; text-transform: uppercase; font-size: 9px;">';
      
      if (mostrarCategoria) {
        html += `<td style="padding: 0.5rem; border: 1px solid #eef2f7; color: #334155; font-weight: bold;">${item.categoria}</td>`;
      }

      columnasSeleccionadas.forEach(col => {
        let valor = '—';
        if (col === 'lugar') valor = tds[4].innerText;
        if (col === 'nombre') valor = tds[7].innerText;
        if (col === 'especificacion') valor = tds[8].innerText;
        if (col === 'marca') valor = tds[9].innerText;
        if (col === 'unidad') valor = tds[11].innerText;
        if (col === 'cantidad') valor = tds[12].innerText;
        if (col === 'subtotal') valor = tds[13].innerText;
        if (col === 'porcentajeIVA') valor = tds[14].innerText;
        if (col === 'iva') valor = tds[15].innerText;
        if (col === 'precio') valor = tds[16].innerText;
        if (col === 'precioUnidad') valor = tds[17].innerText;
        if (col === 'tarjeta' || col === 'condicion') {
          let lugarFila = tds[4].innerText.trim().toUpperCase();
          let filaProv = null;
          let filasProv = document.querySelectorAll('#tbody-proveedores tr');
          
          for (let i = 0; i < filasProv.length; i++) {
            let tdsProv = filasProv[i].querySelectorAll('td');
            if (tdsProv.length > 2 && tdsProv[2].innerText.trim().toUpperCase() === lugarFila) {
              filaProv = tdsProv;
              break;
            }
          }

          if (filaProv) {
            if (col === 'tarjeta') valor = filaProv[10] ? filaProv[10].innerText : '';
            if (col === 'condicion') valor = filaProv[11] ? filaProv[11].innerText : '';
          } else {
            valor = '';
          }
        }
        if (col === 'cantidadCompra') valor = tds[20] ? tds[20].innerText : '';
        if (col === 'valorCompra') valor = tds[21] ? tds[21].innerText : '';
     
        let precioUnitarioReal = 0;
        if (tds[17]) {
          let precioTexto = tds[17].innerText.replace(/[^0-9,.]/g, '').replace(/\./g, '').replace(',', '.');
          precioUnitarioReal = parseFloat(precioTexto) || 0;
        }

        if (col === 'cantidadCompra' || col === 'valorCompra') {
          let placeholder = col === 'cantidadCompra' ? '0' : '$0';
          let claseInput = col === 'cantidadCompra' ? 'input-cantidad-compra' : 'input-valor-compra';
          html += `<td style="padding: 0; border: 1px solid #eef2f7;"><input type="text" class="${claseInput}" data-precio="${precioUnitarioReal}" placeholder="${placeholder}" style="width: 100%; height: 100%; padding: 0.5rem; border: none; text-align: center; font-size: 9px; color: #334155; text-transform: uppercase; outline: none; background: transparent;"></td>`;
        } else if (col === 'evaluador') {
          html += `<td class="celda-evaluador" style="padding: 0.5rem; border: 1px solid #eef2f7; color: #16a34a; font-weight: bold; font-size: 9px;"></td>`;
        } else {
          html += `<td style="padding: 0.5rem; border: 1px solid #eef2f7; color: #334155;">${valor}</td>`;
        }
      });
      html += '</tr>';
    });

    if (datosFiltrados.length === 0) {
      html += `<tr><td colspan="${columnasSeleccionadas.length + (mostrarCategoria ? 1 : 0)}" style="padding: 1rem; text-align: center; color: #94a3b8;">No hay materiales que coincidan con la selección.</td></tr>`;
    }

    html += '</tbody></table>';
    contenedor.innerHTML = html;

    setTimeout(() => {
      const filasTabla = contenedor.querySelectorAll('tbody tr');

      function actualizarEvaluador() {
        let valores = [];
        
        filasTabla.forEach(fila => {
          const inputCantidad = fila.querySelector('.input-cantidad-compra');
          const inputValor = fila.querySelector('.input-valor-compra');
          const celdaEval = fila.querySelector('.celda-evaluador');
          
          if (inputCantidad && inputValor && celdaEval) {
            celdaEval.innerHTML = '';
            
            let cantidad = parseInt(inputCantidad.value.replace(/\D/g, '') || 0, 10);
            let precioBase = parseFloat(inputValor.getAttribute('data-precio') || 0);
            let total = cantidad * precioBase;

            if (total > 0) {
              valores.push({ total: total, celda: celdaEval });
            }
          }
        });

        if (valores.length > 0) {
          let menorTotal = Math.min(...valores.map(v => v.total));
          
          valores.forEach(v => {
            if (v.total === menorTotal) {
              v.celda.innerHTML = '<span style="background: #dcfce7; color: #16a34a; padding: 4px 8px; border-radius: 6px; border: 1px solid #86efac; font-size: 10px;">MEJOR PRECIO</span>';
            }
          });
        }
      }

      filasTabla.forEach(fila => {
        const inputCantidad = fila.querySelector('.input-cantidad-compra');
        const inputValor = fila.querySelector('.input-valor-compra');
        
        if (inputCantidad && inputValor) {
          inputCantidad.addEventListener('input', function() {
            let val = this.value.replace(/\D/g, '');
            if (val) this.value = parseInt(val, 10).toLocaleString('es-CO');
            
            let cantidad = parseInt(val || 0, 10);
            let precioBase = parseFloat(inputValor.getAttribute('data-precio') || 0);
            let total = cantidad * precioBase;
            
            if (total > 0) {
              inputValor.value = '$' + total.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
            } else {
              inputValor.value = '';
            }

            actualizarEvaluador(); 
          });
        }
      });
    }, 100);
  }

  // 3. EXPORTAR A EXCEL
  if (e.target && e.target.closest('#btn-exportar-excel')) {
    const contenedor = document.getElementById('contenedor-tabla-comparar');
    const tabla = contenedor.querySelector('table');
    if (!tabla) { alert('Primero debes generar la tabla.'); return; }
    
    const wb = XLSX.utils.table_to_book(tabla, { sheet: "Comparación" });
    XLSX.writeFile(wb, `Comparacion_${new Date().getTime()}.xlsx`);
  }

  // 4. EXPORTAR A PDF (CON COLORES EXACTOS)
  if (e.target && e.target.closest('#btn-exportar-pdf')) {
    const contenedor = document.getElementById('contenedor-tabla-comparar');
    const tabla = contenedor.querySelector('table');
    if (!tabla) { alert('Primero debes generar la tabla.'); return; }
    
    const ventana = window.open('', '', 'height=800,width=1200');
    ventana.document.write('<html><head><title>Comparación de Precios</title>');
    ventana.document.write('<style>');
    ventana.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
    ventana.document.write('table { width: 100%; border-collapse: collapse; text-align: center; -webkit-print-color-adjust: exact; print-color-adjust: exact; }');
    ventana.document.write('th { background-color: #0b2a4a !important; color: white !important; padding: 8px; border: 1px solid #1e4a6f; font-size: 10px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }');
    ventana.document.write('td { padding: 6px; border: 1px solid #ccc; text-transform: uppercase; font-size: 9px; color: #334155; }');
    ventana.document.write('</style></head><body>');
    ventana.document.write('<h2>Comparación de Precios</h2>');
    ventana.document.write(tabla.outerHTML); 
    ventana.document.write('</body></html>');
    ventana.document.close();
    
    setTimeout(() => { 
      ventana.print(); 
      ventana.close(); 
    }, 800);
  }
});

// ============================================
// PARTE 2: LÓGICA DE COSTOS (costos.js)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
  // 1. Lógica para Descargar el PDF
  const btnDescargarPdf = document.getElementById('btn-descargar-pdf');
  if (btnDescargarPdf) {
    btnDescargarPdf.addEventListener('click', function() {
      const elemento = document.getElementById('area-comprobante');
      
      if (!document.getElementById('comp-fecha').value) {
        alert('Por favor, selecciona al menos una fecha antes de descargar.');
        return;
      }

      const opt = {
        margin:       0.5,
        filename:     `Comprobante_${new Date().getTime()}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(elemento).save();
    });
  }

  // 2. Lógica para Guardar en el sistema (Supabase)
  const btnGuardar = document.getElementById('btn-guardar-comprobante');
  if (btnGuardar) {
    btnGuardar.addEventListener('click', async function() {
      const btn = this;
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GUARDANDO...';
      btn.disabled = true;

      const datosComprobante = {
        contrato: document.getElementById('comp-contrato').value,
        acronimo: document.getElementById('comp-acronimo').value,
        concepto: document.getElementById('comp-concepto').value,
        fecha: document.getElementById('comp-fecha').value,
        hora: document.getElementById('comp-hora').value,
        pagador: document.getElementById('comp-pagador').value,
        forma_pago: document.getElementById('comp-forma-pago').value,
        valor: document.getElementById('comp-valor').value,
        comentario: document.getElementById('comp-comentario').value
      };

      try {
        // Aquí va tu código de Supabase (ejemplo):
        // await supabaseClient.from('comprobantes').insert([datosComprobante]);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (typeof showToast === 'function') {
          showToast('Comprobante guardado exitosamente');
        } else {
          alert('Comprobante guardado exitosamente');
        }
      } catch (error) {
        alert('Error al guardar: ' + error.message);
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }

  // 3. Llenar el select de beneficiarios con los proveedores
  const selectBeneficiario = document.getElementById('comp-beneficiario');
  if (selectBeneficiario && typeof proveedores !== 'undefined') {
    proveedores.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.lugar;
      opt.text = p.lugar;
      selectBeneficiario.appendChild(opt);
    });
  }
});