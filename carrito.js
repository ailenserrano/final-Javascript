//JQuery AJAX
$(document).ready(function () {
  obtenerDatos();
});

let datosRecibidos = [];
let carrito = [];

//GET
function obtenerDatos() {
  const URLGET = "https://api.itbook.store/1.0/new";
  $.get(URLGET).done(function (resultado, estado) {
    console.log("API " + estado);
    if (estado == "success") {
      datosRecibidos = resultado.books;
      datosRecibidos.forEach((prod) => {
        $(".productos").append(`<li class="col-sm-4 list-group-item">
        <h6>${prod.title}</h3>
        <img src="${prod.image}" width="150vh" height="150vh">
        <p>ID: ${prod.isbn13}</p>
        <h4>${prod.price}</p>
        <button class="btn btn-danger" id='btn${prod.isbn13}'>COMPRAR</button>
    </li>`);
        $(`#btn${prod.isbn13}`).on("click", function () {
          agregarACarrito(prod);
        });
      });
    }
  });
}

class ProductoCarrito {
  constructor(objProd) {
    this.isbn13 = objProd.isbn13;
    this.title = objProd.title;
    this.price = objProd.price;
    this.cantidad = 1;
  }
}

function agregarACarrito(productoNuevo) {
  let encontrado = carrito.find((p) => p.isbn13 == productoNuevo.isbn13);
  console.log(encontrado);
  if (encontrado == undefined) {
    let prodACarrito = new ProductoCarrito(productoNuevo);
    carrito.push(prodACarrito);
    console.log(carrito);
    Swal.fire(
      "Nuevo producto agregado al carro",
      productoNuevo.title,
      "success"
    );

    $("#tablabody").append(`
            <tr id='fila${prodACarrito.isbn13}'>
            <td> ${prodACarrito.isbn13} </td>
            <td> ${prodACarrito.title}</td>
            <td id='${prodACarrito.isbn13}'> ${prodACarrito.cantidad}</td>
            <td> ${prodACarrito.price}</td>`);
  } else {
    //pido al carro la posicion del producto
    let posicion = carrito.findIndex((p) => p.isbn13 == productoNuevo.isbn13);
    console.log(posicion);
    carrito[posicion].cantidad += 1;
    $(`#${productoNuevo.isbn13}`).html(carrito[posicion].cantidad);
  }
  $("#gastoTotal").html(`Total: $ ${calcularTotal()}
  <button class="btn btn-danger" id='botonFinalizar'>Finalizar compra</button>`);
  finalizarCompra();
}

function guardar() {
  localStorage.setItem(carrito, JSON.stringify);
}

function calcularTotal() {
  let suma = 0;
  for (const elemento of carrito) {
    suma = suma + elemento.price.slice(1) * elemento.cantidad;
  }
  return suma;
}

function finalizarCompra() {
  $(`#botonFinalizar`).on("click", function () {
    Swal.fire({
      title: "¿Quieres finalizar la compra?",
      showCancelButton: true,
      confirmButtonText: "Finalizar",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("¡A pagar!", "", "success");
      }
    });
  });
}

//SUSCRIPCION
function suscribir() {
  $("#suscripcion").append(`
    <h4>Suscribete a nuestro newsletter mensual</h4>
    <form id="miFormulario">
    <input type="email" placeholder="Ingresa aqui tu email">
    <button type="submit" class="btn btn-warning">Suscribete ahora</button>
    </form>`);
  //EVENTO
  $("#miFormulario").submit(function (e) {
    e.preventDefault();
    Swal.fire("¡Gracias por suscribirte!", $("#email").val(), "success");
    $("#suscripcion").empty();
  });
}

suscribir();
