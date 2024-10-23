function aumentarCantidad(index) {
    let cantidad = parseInt(document.getElementById(`cantidad-${index}`).innerText);
    document.getElementById(`cantidad-${index}`).innerText = cantidad + 1;
    actualizarCarrito(index, true);
}

function disminuirCantidad(index) {
    let cantidad = parseInt(document.getElementById(`cantidad-${index}`).innerText);
    if (cantidad > 0) {
        document.getElementById(`cantidad-${index}`).innerText = cantidad - 1;
        actualizarCarrito(index, false);
    }
}