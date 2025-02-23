const recuperoCarrito = () => {

    if (miCarrito = JSON.parse(localStorage.getItem("carrito"))) {
        miCarrito.forEach(prod => {
            carrito.push(prod)

        });
        actualizarCarrito()
    }

}
function resetStock() {

    stockLibros.length = 0
}

function cargarStock() {

    resetStock()
    fetch("./json/data.json")
        .then((response) => response.json())
        .then((result) => {
            result.forEach((prod) => {
                stockLibros.push(prod)
            })
        })



}

const cargarProductos = async () => {

    const resp = await fetch("./json/data.json")
    const data = await resp.json()


    data.forEach((producto) => {


        stockLibros.push(producto)
        const div = document.createElement("div")
        div.classList.add("producto")
        div.classList.add("tipo-" + producto.tipo)
        div.innerHTML = `
    <img src=${producto.img} alt= "">
    <h3>${producto.titulo}</h3>
    <p>${producto.descripcion}</p>
    <p>Autor: ${producto.autor}</p>
    <p class="precio-producto">Precio:$ ${producto.precio}</p>
    <button id="agregar${producto.isbn}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
    `
        contenedorProductos.appendChild(div)
        const boton = document.getElementById(`agregar${producto.isbn}`)

        boton.addEventListener("click", () => {
            agregarAlCarrito(producto.isbn)
        })
    })
}

// botonVaciar.addEventListener("click", () => {
//     carrito.length = 0
//     actualizarCarrito()
//     localStorage.removeItem("carrito");
// })



const agregarAlCarrito = (prodId) => {

    carrito.some(prod => prod.isbn === prodId) ?
        carrito.map(prod => prod.isbn === prodId && prod.cantidad++) :
        carrito.push(stockLibros.find((prod) => prod.isbn === prodId))
    actualizarCarrito()
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: false,
    })
    Toast.fire({
        icon: 'success',
        title: 'Se agrego el producto al carrito'
    })

}

const eliminarDelCarrito = (prodId) => {

    const item = carrito.find((prod) => Number(prod.isbn) === prodId)
    const indice = carrito.indexOf(item)

    carrito.splice(indice, 1)
    localStorage.removeItem("carrito")
    actualizarCarrito()
    cargarStock()
    hideShowBtnModal()


}


const actualizarCarrito = () => {
    contenedorCarrito.innerHTML = ""

    carrito.forEach((prod) => {
        const div = document.createElement("div")
        div.className = ("productoEnCarrito")
        div.innerHTML = `
        <p>${prod.titulo}</p>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.isbn})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `
        contenedorCarrito.appendChild(div)
        localStorage.setItem("carrito", JSON.stringify(carrito))
    })
    contadorCarrito.innerText = countCarrito()
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0)
}

function countCarrito() {
    let totalItem = 0;

    carrito.forEach((prod) => {
        totalItem += prod.cantidad;
    });
    return totalItem;
}

const hideShowBtnModal = () => {
    if (carrito.length == 0) {

        botonVaciar.classList.remove('showProductoFlex')
        bontonFinalizar.classList.remove('showProductoFlex')
        botonVaciar.classList.add('hideProducto')
        bontonFinalizar.classList.add('hideProducto')
        // bontonFinalizar.classList.remove('showProductoFlex')
        // bontonFinalizar.classList.add('hideProducto')
    } else {
        botonVaciar.classList.remove('hideProducto')
        bontonFinalizar.classList.remove('hideProducto')
        botonVaciar.classList.add('showProductoFlex')
        bontonFinalizar.classList.add('showProductoFlex')
    }
}

botonVaciar.addEventListener("click", () => {
    Swal.fire({
        title: '¿Desea vaciar el carrito?',
        showCancelButton: true,
        icon: 'warning',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    }).then((result) => {

        if (result.isConfirmed) {
            Swal.fire('Se vacio el carrito', '', 'success')
            carrito.length = 0
            actualizarCarrito()
            localStorage.removeItem("carrito");
            cargarStock()
            botonVaciar.classList.remove('showProductoFlex')
            bontonFinalizar.classList.remove('showProductoFlex')
            botonVaciar.classList.add('hideProducto')
            bontonFinalizar.classList.add('hideProducto')
        }
    })
})

bontonFinalizar.addEventListener('click', () => {

    Swal.fire({
        title: 'Tu compra ha sido realizada.',
        text: 'Gracias por confiar en nosotros.',
        icon: 'success',
        confirmButtonText: 'OK',
    }).then((result) => {

        if (result.isConfirmed) {

            carrito.length = 0
            actualizarCarrito()
            cargarStock()
            localStorage.removeItem("carrito");
            contenedorModal.classList.toggle('modal-active')
        }

    })


})




// recuperoCarrito()
cargarProductos()