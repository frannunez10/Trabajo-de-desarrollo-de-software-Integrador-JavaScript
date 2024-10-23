let productos = [];
let carrito = {};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("agregarProductoBtn")?.addEventListener("click", () => {
        mostrarSeccion("agregarProducto");
    });

    document.getElementById("verMenuBtn")?.addEventListener("click", () => {
        mostrarSeccion("menuProductos");
        mostrarProductos("Todos");
    });

    document.getElementById("verCarritoBtn")?.addEventListener("click", () => {
        mostrarSeccion("carrito");
        mostrarCarrito();
    });

    document.getElementById("formProducto")?.addEventListener("submit", (e) => {
        e.preventDefault();
        agregarProducto();
    });

    document.getElementById("finalizarPedidoBtn")?.addEventListener("click", () => {
        document.getElementById("modalPedido").style.display = "flex";
    });

    document.getElementById("cerrarModalBtn")?.addEventListener("click", () => {
        document.getElementById("modalPedido").style.display = "none";
        carrito = {};
        actualizarContadorCarrito();
        mostrarCarrito();
    });

    // Event listeners para filtros
    document.querySelectorAll(".filtroBtn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".filtroBtn").forEach(b => b.classList.remove("activo"));
            e.target.classList.add("activo");
            mostrarProductos(e.target.dataset.categoria);
        });
    });

    document.getElementById("ordenarPrecio")?.addEventListener("change", (e) => {
        const categoriaActual = document.querySelector(".filtroBtn.activo").dataset.categoria;
        mostrarProductos(categoriaActual, e.target.value);
    });
});

function mostrarSeccion(seccion) {
    document.querySelectorAll(".seccion").forEach(sec => {
        sec.style.display = "none";
    });
    document.getElementById(seccion).style.display = "block";
}

function agregarProducto() {
    const nombre = document.getElementById("nombreProducto").value.trim();
    const imagen = document.getElementById("imagenProducto").value.trim();
    const precio = document.getElementById("precioProducto").value;
    const categoria = document.getElementById("categoriaProducto").value;

    if (!nombre || !imagen || !precio || !categoria) {
        alert("Por favor complete todos los campos");
        return;
    }

    productos.push({
        id: Date.now().toString(),
        nombre,
        imagen,
        precio: parseFloat(precio),
        categoria
    });

    document.getElementById("formProducto").reset();
    alert("Producto agregado correctamente");
}

function mostrarProductos(categoria, ordenPrecio = "") {
    const container = document.getElementById("productosContainer");
    if (!container) return;

    let productosFiltrados = categoria === "Todos" 
        ? [...productos]
        : productos.filter(p => p.categoria === categoria);

    if (ordenPrecio) {
        productosFiltrados.sort((a, b) => {
            return ordenPrecio === "menor" 
                ? a.precio - b.precio 
                : b.precio - a.precio;
        });
    }
    
    container.innerHTML = "";
    productosFiltrados.forEach(prod => {
        const cantidad = carrito[prod.id]?.cantidad || 0;
        const prodDiv = document.createElement("div");
        prodDiv.className = "producto";
        prodDiv.innerHTML = `
            <img src="${encodeURI(prod.imagen)}" alt="${encodeURI(prod.nombre)}">
            <h3>${prod.nombre}</h3>
            <p>$${prod.precio.toFixed(2)}</p>
            <div class="contador">
                <button onclick="disminuirCantidad('${prod.id}')">-</button>
                <span id="cantidad-${prod.id}">${cantidad}</span>
                <button onclick="aumentarCantidad('${prod.id}')">+</button>
            </div>
        `;
        container.appendChild(prodDiv);
    });
}

function actualizarCarrito(productId, incrementar) {
    const producto = productos.find(p => p.id === productId);
    if (!producto) return;

    if (!carrito[productId]) {
        carrito[productId] = {
            producto: producto,
            cantidad: 0
        };
    }

    if (incrementar) {
        carrito[productId].cantidad++;
    } else {
        carrito[productId].cantidad--;
        if (carrito[productId].cantidad <= 0) {
            delete carrito[productId];
        }
    }

    actualizarContadorCarrito();
}

function mostrarCarrito() {
    const carritoContainer = document.getElementById("carritoProductos");
    if (!carritoContainer) return;

    carritoContainer.innerHTML = "";
    let total = 0;

    Object.values(carrito).forEach(({producto, cantidad}) => {
        if (cantidad > 0) {
            const subtotal = producto.precio * cantidad;
            total += subtotal;
            
            const prodDiv = document.createElement("div");
            prodDiv.className = "producto";
            prodDiv.innerHTML = `
                <img src="${encodeURI(producto.imagen)}" alt="${encodeURI(producto.nombre)}">
                <h3>${producto.nombre}</h3>
                <p>Cantidad: ${cantidad}</p>
                <p>Precio unitario: $${producto.precio.toFixed(2)}</p>
                <p>Subtotal: $${subtotal.toFixed(2)}</p>
            `;
            carritoContainer.appendChild(prodDiv);
        }
    });

    document.getElementById("totalCarrito").innerText = `Total: $${total.toFixed(2)}`;
}

function actualizarContadorCarrito() {
    const totalItems = Object.values(carrito).reduce((sum, {cantidad}) => sum + cantidad, 0);
    document.getElementById("contadorCarrito").innerText = totalItems.toString();
}