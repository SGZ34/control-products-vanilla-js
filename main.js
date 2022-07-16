$(document).ready(function () {
  let productos = [];
  let formulario = document.getElementById("form-productos");
  let state = false;

  obtenerLocalStorage();

  function obtenerLocalStorage() {
    productos = JSON.parse(localStorage.getItem("productos"));
    if (!productos) {
      localStorage.setItem(
        "productos",
        JSON.stringify([
          { id: 1, nombre: "producto de prueba", precio: 2000 },
          { id: 2, nombre: "producto de prueba 2", precio: 4000 },
        ])
      );
      productos = JSON.parse(localStorage.getItem("productos"));
    }
    $("#table").html("");
    productos.map((p) => {
      $("#table").html(
        $("#table").html() +
          `
            <tr id="${p.id}">
                <td>${p.id}</td>
                <td>${p.nombre}</td>
                <td>${p.precio}</td>
                <td>
                    <button class="btn btn-warning text-white btn-editar" idProducto="${p.id}">Editar</button>
                    <button class="btn btn-danger btn-eliminar" idProducto="${p.id}">Eliminar</button>
                </td>
            </tr>
        `
      );
    });
  }
  function guardarLocalStorage() {
    localStorage.setItem("productos", JSON.stringify(productos));
    obtenerLocalStorage();
  }

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = $("#id").val();
    const nombre = $("#nombre").val();
    const precio = parseInt($("#precio").val());
    const objeto = { id, nombre, precio };
    if (!state) {
      AgregarProducto(objeto);
    } else {
      editarProducto(objeto);
    }
  });

  function AgregarProducto({ id, nombre, precio }) {
    const producto = productos.find((p) => p.id == id);

    if (producto || id == "") {
      alertify.set("notifier", "position", "top-right");
      alertify.error("Ha ocurrido un error, vuelve a intentarlo");
    } else {
      productos = [...productos, { id, nombre, precio }];
      alertify.set("notifier", "position", "top-right");
      alertify.success("Producto agregado satisfactoriamente");
      guardarLocalStorage();
    }
  }

  $(document).on("click", ".btn-editar", function () {
    let element = $(this)[0].parentElement.parentElement;
    let id = $(element).attr("id");

    let producto = productos.find((p) => p.id == id);

    $("#id").val(producto.id).attr("readonly", true);
    $("#nombre").val(producto.nombre);
    $("#precio").val(producto.precio);
    state = true;
    $("#title-form").html("Editar producto");
  });

  function editarProducto({ id, nombre, precio }) {
    const producto = productos.find((p) => p.id == id);
    if (!producto) {
      alertify.set("notifier", "position", "top-right");
      alertify.error("Ha ocurrido un error, vuelve a intentarlo");
    } else {
      productos = productos.map((p) => {
        if (p.id == id) {
          p.nombre = nombre;
          p.precio = precio;
        }
        return p;
      });
      alertify.set("notifier", "position", "top-right");
      alertify.success("Producto editado satisfactoriamente");
      state = false;
      $("#id").val("").attr("readonly", state);
      formulario.reset();
      $("#title-form").html("Agregar producto");
      guardarLocalStorage();
    }
  }

  $(document).on("click", ".btn-eliminar", function () {
    let element = $(this)[0].parentElement.parentElement;
    let id = $(element).attr("id");

    productos = productos.filter((p) => p.id != id);
    guardarLocalStorage();
  });
});
