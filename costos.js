document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Lógica para Descargar el PDF
    const btnDescargarPdf = document.getElementById('btn-descargar-pdf');
    if (btnDescargarPdf) {
        btnDescargarPdf.addEventListener('click', function() {
            const elemento = document.getElementById('area-comprobante');
            
            // Validar que al menos haya una fecha escrita
            if (!document.getElementById('comp-fecha').value) {
                alert('Por favor, selecciona al menos una fecha antes de descargar.');
                return;
            }

            // Configuración para que el PDF quede perfecto
            const opt = {
                margin:       0.5,
                filename:     `Comprobante_${new Date().getTime()}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true }, // useCORS permite cargar el logo
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            // Generar y guardar el PDF
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

            // Recopilar los datos del formulario
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
                
                // Simulamos la demora de guardado
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

    // 3. Llenar el select de beneficiarios con los proveedores (si la variable existe en el sistema)
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