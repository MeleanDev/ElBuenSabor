const productosContainer = document.getElementById('productos-container');
const agregarProductoBtn = document.getElementById('agregar-producto');
const facturaForm = document.getElementById('factura-form');
const totalOutput = document.getElementById('total');

agregarProductoBtn.addEventListener('click', () => {
    const productoDiv = document.createElement('div');
    productoDiv.classList.add('producto', 'd-flex', 'align-items-center', 'mb-3');
    productoDiv.innerHTML = `
        <input type="text" class="form-control me-2" name="descripcion[]" placeholder="Descripción" required>
        <input type="number" class="form-control me-2" name="cantidad[]" value="1" min="1" placeholder="Cantidad" required>
        <input type="number" class="form-control me-2" name="precio[]" placeholder="Precio Unitario" required>
        <span class="subtotal ms-2">Subtotal: 0€</span>
    `;
    productosContainer.appendChild(productoDiv);
});

facturaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const productos = document.querySelectorAll('.producto');
    let total = 0;
    let facturaContent = '';
    productos.forEach((producto, index) => {
        const descripcion = producto.querySelector('input[name="descripcion[]"]').value;
        const cantidad = parseInt(producto.querySelector('input[name="cantidad[]"]').value);
        const precio = parseFloat(producto.querySelector('input[name="precio[]"]').value);
        const subtotal = cantidad * precio;
        producto.querySelector('.subtotal').textContent = `Subtotal: ${subtotal.toFixed(2)}€`;
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