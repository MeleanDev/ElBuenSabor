document.addEventListener('DOMContentLoaded', function() {
    const productosContainer = document.getElementById('productos-container');
    const agregarProductoBtn = document.getElementById('agregar-producto');
    const facturaForm = document.getElementById('factura-form');
    const totalOutput = document.getElementById('total');

    // Función para eliminar un producto
    function eliminarProducto(event) {
        if (event.target.classList.contains('eliminar-producto')) {
            const producto = event.target.closest('.producto');
            producto.remove();
            actualizarTotal();
            actualizarOpciones();
        }
    }

    // Función para agregar un nuevo producto
    function agregarProducto() {
        const nuevoProducto = document.createElement('div');
        nuevoProducto.classList.add('producto', 'd-flex', 'align-items-center', 'mb-3');
        nuevoProducto.innerHTML = `
            <select class="form-control me-2 producto-select" name="producto[]" required>
                <option value="" disabled selected>Seleccione un producto</option>
                <option value="Croquetas caseras" data-precio="7.50">Croquetas caseras - 7,50€</option>
                <option value="Ensalada de la casa" data-precio="5.00">Ensalada de la casa - 5,00€</option>
                <option value="Pasta a la boloñesa" data-precio="8.00">Pasta a la boloñesa - 8,00€</option>
                <option value="Pizza de la casa" data-precio="10.00">Pizza de la casa - 10,00€</option>
                <option value="Hamburguesa de la casa" data-precio="9.00">Hamburguesa de la casa - 9,00€</option>
                <option value="Pollo asado" data-precio="12.00">Pollo asado - 12,00€</option>
                <option value="Pescado al horno" data-precio="15.00">Pescado al horno - 15,00€</option>
                <option value="Tarta de la casa" data-precio="6.00">Tarta de la casa - 6,00€</option>
                <option value="Helado de la casa" data-precio="4.50">Helado de la casa - 4,50€</option>
                <option value="Café solo" data-precio="2.00">Café solo - 2,00€</option>
            </select>
            <input type="number" class="form-control me-2" name="cantidad[]" value="1" min="1" placeholder="Cantidad" required>
            <input type="number" class="form-control me-2 precio" name="precio[]" placeholder="Precio Unitario" readonly required>
            <span class="subtotal ms-2">Subtotal: 0€</span>
            <button type="button" class="btn btn-danger btn-sm ms-2 eliminar-producto">Eliminar</button>
        `;
        productosContainer.appendChild(nuevoProducto);
        actualizarOpciones();
    }

    // Función para actualizar el total
    function actualizarTotal() {
        let total = 0;
        const productos = document.querySelectorAll('.producto');
        productos.forEach(producto => {
            const cantidad = producto.querySelector('input[name="cantidad[]"]').value;
            const precio = producto.querySelector('input[name="precio[]"]').value;
            const subtotal = cantidad * precio;
            producto.querySelector('.subtotal').textContent = `Subtotal: ${subtotal}€`;
            total += subtotal;
        });
        totalOutput.textContent = `${total}€`;
    }

    // Función para actualizar el precio cuando se selecciona un producto
    function actualizarPrecio(event) {
        if (event.target.classList.contains('producto-select')) {
            const select = event.target;
            const precio = select.options[select.selectedIndex].getAttribute('data-precio');
            const precioInput = select.closest('.producto').querySelector('input[name="precio[]"]');
            precioInput.value = precio;
            actualizarTotal();
            actualizarOpciones();
        }
    }

    // Función para actualizar las opciones de los selects
    function actualizarOpciones() {
        const selects = document.querySelectorAll('.producto-select');
        const seleccionados = Array.from(selects).map(select => select.value);

        selects.forEach(select => {
            const opciones = select.querySelectorAll('option');
            opciones.forEach(opcion => {
                if (seleccionados.includes(opcion.value) && opcion.value !== select.value) {
                    opcion.disabled = true;
                } else {
                    opcion.disabled = false;
                }
            });
        });
    }

    // Event listeners
    productosContainer.addEventListener('click', eliminarProducto);
    productosContainer.addEventListener('input', actualizarTotal);
    productosContainer.addEventListener('change', actualizarPrecio);
    agregarProductoBtn.addEventListener('click', agregarProducto);

    // Evento submit del formulario
    facturaForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar que al menos un producto esté seleccionado
        const productos = document.querySelectorAll('.producto-select');
        let productoSeleccionado = false;
        productos.forEach(select => {
            if (select.value) {
                productoSeleccionado = true;
            }
        });

        if (!productoSeleccionado) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Debe seleccionar al menos un producto antes de generar la factura.",
                showConfirmButton: true
            });
            return;
        }

        // Eliminar el modal de la factura anterior si existe
        const existingModal = document.getElementById('facturaModal');
        if (existingModal) {
            existingModal.remove();
        }

        const nombreCliente = document.getElementById('nombre').value;
        const direccionCliente = document.getElementById('direccion').value;
        const contactoCliente = document.getElementById('contacto').value;

        let total = 0;
        let facturaContent = '';
        productos.forEach((producto, index) => {
            const descripcion = producto.selectedOptions[0].textContent;
            const cantidad = parseInt(producto.closest('.producto').querySelector('input[name="cantidad[]"]').value);
            const precio = parseFloat(producto.closest('.producto').querySelector('input[name="precio[]"]').value);
            const subtotal = cantidad * precio;
            producto.closest('.producto').querySelector('.subtotal').textContent = `Subtotal: ${subtotal.toFixed(2)}€`;
            total += subtotal;

            facturaContent += `<tr>
                <td>${index + 1}</td>
                <td>${descripcion}</td>
                <td>${cantidad}</td>
                <td>${precio.toFixed(2)}€</td>
                <td>${subtotal.toFixed(2)}€</td>
            </tr>`;
        });

        totalOutput.textContent = `${total.toFixed(2)}€`;

        // Ventana emergente con la factura
        const facturaModal = document.createElement('div');
        facturaModal.innerHTML = `
            <div class="modal fade" id="facturaModal" tabindex="-1" aria-labelledby="facturaModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="facturaModalLabel">Factura</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <h5>Restaurante "El Buen Sabor"</h5>
                            <p><strong>Cliente:</strong> ${nombreCliente}</p>
                            <p><strong>Dirección:</strong> ${direccionCliente}</p>
                            <p><strong>Contacto:</strong> ${contactoCliente}</p>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Descripción</th>
                                        <th>Cantidad</th>
                                        <th>Precio Unitario</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${facturaContent}
                                </tbody>
                            </table>
                            <h5 class="text-end">Total: ${total.toFixed(2)}€</h5>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success" id="pagar-btn">Pagar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(facturaModal);
        const facturaBootstrapModal = new bootstrap.Modal(document.getElementById('facturaModal'));
        facturaBootstrapModal.show();

        // Botón de pago
        document.getElementById('pagar-btn').addEventListener('click', () => {
            facturaBootstrapModal.hide();
            Swal.fire({
                icon: "success",
                title: "Pago realizado con éxito",
                showConfirmButton: false,
                timer: 2500
            });
            facturaForm.reset();
            totalOutput.textContent = '0€';
            productosContainer.innerHTML = ''; // Limpia los productos
            agregarProducto(); // Agrega un producto vacío para empezar
        });
    });

    productosContainer.addEventListener('change', (e) => {
        if (e.target.name === 'cantidad[]' || e.target.name === 'precio[]') {
            const producto = e.target.closest('.producto');
            const cantidad = parseInt(producto.querySelector('input[name="cantidad[]"]').value);
            const precio = parseFloat(producto.querySelector('input[name="precio[]"]').value);
            const subtotal = cantidad * precio;
            producto.querySelector('.subtotal').textContent = `Subtotal: ${subtotal.toFixed(2)}€`;

            const productos = document.querySelectorAll('.producto');
            let total = 0;
            productos.forEach((producto) => {
                const subtotalProducto = parseFloat(
                    producto.querySelector('.subtotal').textContent.replace('Subtotal: ', '').replace('€', '')
                );
                total += subtotalProducto;
            });
            totalOutput.textContent = `${total.toFixed(2)}€`;
        }
    });
});