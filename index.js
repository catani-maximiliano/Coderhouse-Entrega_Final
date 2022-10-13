//variables
//botones
const ingresar = document.getElementById("ingresar");
const mostrarPlatos = document.getElementById("mostrar");
const ordenarPrecio = document.getElementById("ordenarPrecio");
const ordenarProducto = document.getElementById("ordenarProducto");
const filtrarPlato = document.getElementById("filtrarPlato");
const filtrarPais = document.getElementById("filtrarPais");
const resetear = document.querySelector("#resetear");
const elemento = document.querySelector("#tabla");
const listaPlatos = document.getElementById("tabla");
let nuevoPlato = [];

const emailRegister = document.getElementById("emailRegister");
const contraseñaRegistro = document.getElementById("contraseñaRegistro");
const contraseñaRegistroCon = document.getElementById("contraseñaRegistroCon");
let usuarioExistente = "";
const regexEmail =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

let platoJson = []; //variable donde guardo el objeto traido desde json

let tablaContent;
let tablaContentPrecio;
let tablaContentProducto;
let tablaContentFiltroPais;
let tablaContentFiltroPlato;
let ordenadosPrecio = [];
let ordenadosProducto = [];

let usuarioConectado = false;
sessionStorage.setItem("usuarioConectado", JSON.stringify(usuarioConectado));
let usuarioConectadoJson = JSON.parse(
  sessionStorage.getItem("usuarioConectado")
);



class comidas {
  constructor(nombre, ingredientes, pais, precio) {
    this.nombre = nombre;
    this.ingredientes = ingredientes;
    this.pais = pais;
    this.precio = precio;
  }
}
class usuario {
  constructor(email, contraseña) {
    this.email = email;
    this.contraseña = contraseña;
  }
}


//funcionalidad de los botones
ingresar.onclick = function (e) {
  ingreso();
};
mostrarPlatos.onclick = function (e) {
  mostrarPlato();
};
ordenarPrecio.onclick = function (e) {
  ordenPrecio();
};
ordenarProducto.onclick = function (e) {
  ordenProducto();
};
filtrarPlato.onclick = function (e) {
  filtradoPlato();
};
filtrarPais.onclick = function (e) {
  filtradoPais();
};
resetear.addEventListener("click", () => {
  reset();
});
registro.onclick = function (e) {
  Register();
};

/* api de marvel
const marvel={
  render: () => {
    const urlAPI='https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=83eaf95d88f5e5719aa60d9b4f0c95a8&hash=3a6d9f99d0f9be229c93321256b5f322';
    const container = document.querySelector("contenedor");
    let contentHTML='';

    fetch(urlAPI)
    .then(res =>res.json())
    .then((json)=>{
      console.log(json, 'RES.JSON');


 for (const hero of json.data.results) {
  console.log( hero.name );
        let urlHero = hero.urls[0].url
        document.getElementById("contenedor").innerHTML +=`
        <div class="col-md-4">
        <a href="${urlHero}" target="_blank">
          <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}"class="img-thumbnail">
        </a>
        <h3 class="title">${hero.name}</h3>
      </div>
        `;
      }
    })
  }
};
marvel.render();*/
let favoritosTemporal=[]

async function apiRespuesta() {
  let app_id = "5d3a5e8f";
  let app_key = "61c7b7bd4ec183a6f7c871979335e3dd";
  let buscadorReceta = document.getElementById("buscadorReceta").value;
  let urlAPI = `https://api.edamam.com/api/recipes/v2?type=public&q=${buscadorReceta}&app_id=${app_id}&app_key=%20${app_key}`;
  let response = await fetch(urlAPI);
  let data = await response.json();
  console.log(data.hits);

  document.getElementById("contenedor").innerHTML = "";
  for (const receta of data.hits) {
    let health = [];
    let l = receta.recipe.healthLabels.length;
    let punto = "&#9679";

    for (let index = 0; index < l; index++) {
      health.push(receta.recipe.healthLabels[index] + "  ");
    }
    health = health.toString();
    health = health.replace(/,/g, punto);

//variable donde se aloje los datos temporales sobre cada tarjeta de receta, para que al añadir a favoritos

    favoritosTemporal.push({
      label: receta.recipe.label,
      image: receta.recipe.images.REGULAR.url,
      healthLabels: health,
      tipic: receta.recipe.cuisineType,
      calories: receta.recipe.calories.toFixed(0),
      url: receta.recipe.url,
      Protein: receta.recipe.digest[0].total.toFixed(1),
      Fat: receta.recipe.digest[1].total.toFixed(1),
      Carb: receta.recipe.digest[2].total.toFixed(1),
      Cholesterol:receta.recipe.digest[3].total.toFixed(1),
      Sodium: receta.recipe.digest[4].total.toFixed(1),
      Calcium: receta.recipe.digest[5].total.toFixed(1),
      Magnesium: receta.recipe.digest[6].total.toFixed(1),
      Potassium: receta.recipe.digest[7].total.toFixed(1),
      Iron: receta.recipe.digest[8].total.toFixed(1)
    })
console.log(favoritosTemporal);


    document.getElementById("contenedor").innerHTML += `
    <div class="col-md-8 mx-auto my-1 rounded" id="recetas">
    <div class="card  box-shadow">
      <div class="card-body ">

        <div class="d-flex flex-nowrap row">
          <div class="m-1 col-md-4 ">
            <img class="card-img"
              data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail" alt=""
              src="${receta.recipe.images.REGULAR.url}" data-holder-rendered="true"
              style="height: 200px; width:100%; display: block;">
          </div>
          <div class="col-md-8 m-1 d-flex col">
            <div>
              <div class="d-flex  align-items-center mt-3 ">
                <h2 class="card-title">${receta.recipe.label}</h2>
                <div >
                <button type="button"  onclick='favoritos("${receta.recipe.label}")'
                class="btn btn-warning text-dark">favorito</button>
                <button type="button"  onclick='eliminarFavorito("${receta.recipe.label}")'
                class="btn btn-warning text-dark">eliminar</button>
                </div>
              </div>
              <p class="card-text" id="">&#9679;${health}</p>
            </div>
          </div>
        </div>
        <div class="d-flex col-md-12 d-flex justify-content-between align-content-center row my-2 mx-auto ">
          <div class="col-md-4 d-flex justify-content-center mx-auto row">
            <small class="text-muted">comida tipica: ${receta.recipe.cuisineType}</small>
            <div class="">
              <h5>${receta.recipe.calories.toFixed(0)} Kcal</h5>
          </div>
          <button type="button" class="btn btn-primary btn-lg"><a href="${receta.recipe.url}" target="_blank" style="text-decoration:none; color:white">Ir al Sitio</a></button>
        </div>
          <div class="col-md-4">
            <ul class="list-unstyled ">
              <li class="d-flex justify-content-between "> <span>&#128308; Protein</span> <span>${receta.recipe.digest[0].total.toFixed(1)} g</span> </li>
              <li class="d-flex justify-content-between "> <span>&#128994; Fat</span> <span>${receta.recipe.digest[1].total.toFixed(1)} g</span> </li>
              <li class="d-flex justify-content-between "> <span>	&#128993; Carb</span> <span>${receta.recipe.digest[2].total.toFixed(1)} g</span> </li>
            </ul>
          </div>
          <div class="col-md-4">
            <ul class="list-unstyled ">
              <li class="d-flex justify-content-between "> <span>Cholesterol</span> <span>${receta.recipe.digest[3].total.toFixed(1)} mg</span> </li>
              <li class="d-flex justify-content-between "> <span>Sodium</span> <span>${receta.recipe.digest[4].total.toFixed(1)} mg</span> </li>
              <li class="d-flex justify-content-between "> <span>Calcium</span> <span>${receta.recipe.digest[5].total.toFixed(1)} mg</span> </li>
              <li class="d-flex justify-content-between "> <span>Magnesium</span> <span>${receta.recipe.digest[6].total.toFixed(1)} mg</span> </li>
              <li class="d-flex justify-content-between "> <span>Potassium</span> <span>${receta.recipe.digest[7].total.toFixed(1)} mg</span> </li>
              <li class="d-flex justify-content-between "> <span>Iron</span> <span>${receta.recipe.digest[8].total.toFixed(1)} mg</span> </li>
            </ul>
          </div>
        </div>


      </div>
    </div>
  </div>`;
  }
}

    let favoritoNuevo=[];
    let favoritoJson=JSON.parse(localStorage.getItem("favorito"));

function favoritos(a){
  favoritoJson=JSON.parse(localStorage.getItem("favorito"));
  const indexF = favoritoJson.findIndex(i => i.label === a)
  const index = favoritosTemporal.findIndex(i => i.label === a);
console.log(index);
  
  if (indexF > -1) {
    // si está, lo quitamos
    eliminarFavorito(favoritosTemporal[index]);
  } else {
    // si no está, lo añadimos
    favoritoJson.push(favoritosTemporal[index]);
    localStorage.setItem("favorito", JSON.stringify(favoritoJson));
  }

}
function eliminarFavorito(a){
  favoritoJson= JSON.parse(localStorage.getItem("favorito"));
  fav = favoritoJson.filter(f => f.label !== a);
  localStorage.setItem("favorito", JSON.stringify(fav));
}

//funciones
function ver(mostrar) {
  let infoMostrar = "Mostrar los Platos guardados en el LocalStorage";
  let infoOrdenarPrecio = "Ordenar todos los platos por Precio";
  let infoOrdenarProducto = "Ordenar todos los platos por Producto";
  let infofiltrarPlato = "busqueda de platos por su nombre";
  let infofiltrarPais = "busqueda de platos por su pais de origen";
  let inforesetear = "Limpiar Tabla pero no borra los datos del local storage";

  //implementacion de Tostify para los Botones
  if (mostrar == "infoMostrar") {
    Toastify({
      text: infoMostrar,
      className: "info",
      stopOnFocus: true,
      gravity: "top",
      position: "right",
    }).showToast();
  } else if (mostrar == "infoOrdenarPrecio") {
    Toastify({
      text: infoOrdenarPrecio,
      className: "info",
      gravity: "top",
      position: "right",
    }).showToast();
  } else if (mostrar == "infoOrdenarProducto") {
    Toastify({
      text: infoOrdenarProducto,
      className: "info",
      gravity: "top",
      position: "right",
    }).showToast();
  } else if (mostrar == "infofiltrarPlato") {
    Toastify({
      text: infofiltrarPlato,
      className: "info",
      gravity: "top",
      position: "right",
    }).showToast();
  } else if (mostrar == "infofiltrarPais") {
    Toastify({
      text: infofiltrarPais,
      className: "info",
      gravity: "top",
      position: "right",
    }).showToast();
  } else if (mostrar == "inforesetear") {
    Toastify({
      text: inforesetear,
      className: "info",
      gravity: "top",
      position: "right",
    }).showToast();
  }
}

function ingreso() {
  let nombre = document.getElementById("formNombre").value;
  let ingredientes = document.getElementById("formIngredientes").value;
  let pais = document.getElementById("formPais").value;
  let precio = document.getElementById("formPrecio").value;

  if (usuarioConectadoJson === true) {
    nuevoPlato.push(new comidas(nombre, ingredientes, pais, precio));

    //guardado del plato en el localStorage.
    localStorage.setItem("plato", JSON.stringify(nuevoPlato));
    //en platoJson guardo el objeto del localstorage y luego la variable platoJson la utilizo para el resto de funciones.
    platoJson = JSON.parse(localStorage.getItem("plato"));

    document.getElementById("formNombre").value = "";
    document.getElementById("formIngredientes").value = "";
    document.getElementById("formPais").value = "";
    document.getElementById("formPrecio").value = "";

    //implementacion de Tostify para el ingreso de un plato
    Toastify({
      text: "Se guardo Correctamente",
      className: "info",
      stopOnFocus: true,
      gravity: "top",
      position: "center",
      style: { background: "green" },
    }).showToast();
  } else {
    Swal.fire("Para continuar debe Iniciar Sesión");
    function mostrar() {
      // simulamos el click del mouse en el boton del formulario
      document.getElementById("boton-ingresar").click();
    }
    setTimeout(mostrar, 1000);
  }
}

function mostrarPlato() {
  if (usuarioConectadoJson === true) {
   // reset();
    for (let i of favoritoJson) {
      document.getElementById("contenedor").innerHTML += `
      <div class="col-md-8 mx-auto my-1 rounded" id="recetas">
      <div class="card  box-shadow">
        <div class="card-body ">
  
          <div class="d-flex flex-nowrap row">
            <div class="m-1 col-md-4 ">
              <img class="card-img"
                data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail" alt=""
                src="${i.image}" data-holder-rendered="true"
                style="height: 200px; width:100%; display: block;">
            </div>
            <div class="col-md-8 m-1 d-flex col">
              <div>
                <div class="d-flex  align-items-center mt-3 ">
                  <h2 class="card-title">${i.label}</h2>
                  <div >
                  <button type="button"  onclick='favoritos("${i.label}")'
                  class="btn btn-warning text-dark">favorito</button>
                  </div>
                </div>
                <p class="card-text" id="">&#9679;${i.healthLabels}</p>
              </div>
            </div>
          </div>
          <div class="d-flex col-md-12 d-flex justify-content-between align-content-center row my-2 mx-auto ">
            <div class="col-md-4 d-flex justify-content-center mx-auto row">
              <small class="text-muted">comida tipica: ${i.tipic[0]}</small>
              <div class="">
                <h5>${i.calories} Kcal</h5>
            </div>
            <button type="button" class="btn btn-primary btn-lg"><a href="${i.url}" target="_blank" style="text-decoration:none; color:white">Ir al Sitio</a></button>
          </div>
            <div class="col-md-4">
              <ul class="list-unstyled ">
                <li class="d-flex justify-content-between "> <span>&#128308; Protein</span> <span>${i.Protein} g</span> </li>
                <li class="d-flex justify-content-between "> <span>&#128994; Fat</span> <span>${i.Fat} g</span> </li>
                <li class="d-flex justify-content-between "> <span>	&#128993; Carb</span> <span>${i.Carb} g</span> </li>
              </ul>
            </div>
            <div class="col-md-4">
              <ul class="list-unstyled ">
                <li class="d-flex justify-content-between "> <span>Cholesterol</span> <span>${i.Cholesterol} mg</span> </li>
                <li class="d-flex justify-content-between "> <span>Sodium</span> <span>${i.Sodium} mg</span> </li>
                <li class="d-flex justify-content-between "> <span>Calcium</span> <span>${i.Calcium} mg</span> </li>
                <li class="d-flex justify-content-between "> <span>Magnesium</span> <span>${i.Magnesium} mg</span> </li>
                <li class="d-flex justify-content-between "> <span>Potassium</span> <span>${i.Potassium} mg</span> </li>
                <li class="d-flex justify-content-between "> <span>Iron</span> <span>${i.Iron} mg</span> </li>
              </ul>
            </div>
          </div>
  
  
        </div>
      </div>
    </div>`;
      
      /*tablaContent += `
    <tr>
      <td>${item.nombre}</td>
      <td>${item.ingredientes}</td>
      <td>${item.pais}</td>
      <td>${item.precio}</td>
    </td>`;*/
    }
    //listaPlatos.innerHTML += tablaContent;
  } else {
    Swal.fire("Para continuar debe Iniciar Sesión");
    function mostrar() {
      // simulamos el click del mouse en el boton del formulario
      document.getElementById("boton-ingresar").click();
    }
    setTimeout(mostrar, 1000);
  }
}

function ordenPrecio() {
  if (usuarioConectadoJson === true) {
    reset();

    ordenadosPrecio = platoJson.map((elemento) => elemento);
    ordenadosPrecio.sort(function (a, b) {
      return a.precio - b.precio;
    });

    for (let item1 of ordenadosPrecio) {
      tablaContentPrecio += `
      <tr>
        <td>${item1.nombre}</td>
        <td>${item1.ingredientes}</td>
        <td>${item1.pais}</td>
        <td>${item1.precio}</td>
      </td>
    `;
    }
    listaPlatos.innerHTML += tablaContentPrecio;
  } else {
    Swal.fire("Para continuar debe Iniciar Sesión");
    function mostrar() {
      // simulamos el click del mouse en el boton del formulario
      document.getElementById("boton-ingresar").click();
    }
    setTimeout(mostrar, 1000);
  }
}

function ordenProducto() {
  if (usuarioConectadoJson === true) {
    reset();
    ordenadosProducto = platoJson.map((elemento) => elemento);
    ordenadosProducto.sort(function (a, b) {
      //funcion Optimizada
      a.nombre > b.nombre ? 1 : -1;
      return 0;
    });

    for (let item1 of ordenadosProducto) {
      tablaContentProducto += `
      <tr>
        <td>${item1.nombre}</td>
        <td>${item1.ingredientes}</td>
        <td>${item1.pais}</td>
        <td>${item1.precio}</td>
      </td>
    `;
    }
    listaPlatos.innerHTML += tablaContentProducto;
  } else {
    Swal.fire("Para continuar debe Iniciar Sesión");
    function mostrar() {
      // simulamos el click del mouse en el boton del formulario
      document.getElementById("boton-ingresar").click();
    }
    setTimeout(mostrar, 1000);
  }
}

function filtradoPlato() {
  if (usuarioConectadoJson === true) {
    reset();
    let platoF = prompt("ingrese el nombre del plato que quiere buscar");
    let platoFiltrado = platoJson.filter((plato) => plato.nombre == platoF);

    for (let plato of platoFiltrado) {
      tablaContentFiltroPlato += `
    <tr>
      <td>${plato.nombre}</td>
      <td>${plato.ingredientes}</td>
      <td>${plato.pais}</td>
      <td>${plato.precio}</td>
    </td>
  `;
    }
    listaPlatos.innerHTML += tablaContentFiltroPlato;
  } else {
    Swal.fire("Para continuar debe Iniciar Sesión");
    function mostrar() {
      // simulamos el click del mouse en el boton del formulario
      document.getElementById("boton-ingresar").click();
    }
    setTimeout(mostrar, 1000);
  }
}

function filtradoPais() {
  if (usuarioConectadoJson === true) {
    reset();
    let platoA = prompt(
      "ingrese el pais de origen del plato que quiere buscar"
    );
    let paisFiltrado = platoJson.filter((plato) => plato.pais == platoA);

    for (let plato of paisFiltrado) {
      tablaContentFiltroPais += `
    <tr>
       <td>${plato.nombre}</td>
       <td>${plato.ingredientes}</td>
       <td>${plato.pais}</td>
       <td>${plato.precio}</td>
    </tr>
   `;
    }
    listaPlatos.innerHTML += tablaContentFiltroPais;
  } else {
    Swal.fire("Para continuar debe Iniciar Sesión");
    function mostrar() {
      // simulamos el click del mouse en el boton del formulario
      document.getElementById("boton-ingresar").click();
    }
    setTimeout(mostrar, 1000);
  }
}

function reset() {
  if (usuarioConectadoJson === true) {
    elemento.innerHTML = `
  <table id="tabla" class="w-75 m-5 table table-bordered table-striped table-dark">
  <tr>
      <th>Plato</th>
      <th>ingredientes</th>
      <th>pais de origen</th>
      <th>Precio</th>
  </tr>
  </table>`;

    tablaContent = ``;
    tablaContentPrecio = ``;
    tablaContentProducto = ``;
    tablaContentFiltroPais = ``;
    tablaContentFiltroPlato = ``;
  } else {
    Swal.fire("Para continuar debe Iniciar Sesión");
    function mostrar() {
      // simulamos el click del mouse en el boton del formulario
      document.getElementById("boton-ingresar").click();
    }
    setTimeout(mostrar, 1000);
  }
}

let usuarioExistenteRegistro = "";
let usuarioJson = [];
usuarioJson = JSON.parse(localStorage.getItem("usuario"));
/*
function Login() {
  if (usuarioConectadoJson === false) {
    //buscar si existe usuario y contraseña y pasar por variable para validarlo.
    //validacion de mail y contraseña dentro del localstorage.
    let usuarioExistenteSesion = "";
    let emailSesion = document.getElementById("emailSesion").value;
    let contraseñaSesion = document.getElementById("contraseñaSesion").value;
    for (let i = 0; i < usuarioJson.length; i++) {
      if (usuarioJson[i].email == emailSesion && usuarioJson[i].contraseña == contraseñaSesion){
        usuarioExistenteSesion = usuarioJson[i].email;}}

    if (emailSesion !== usuarioExistenteSesion) {
      Swal.fire("Usuario o contraseña incorrectas");
      return;
    } else {
      //pasar a usuario como conectado y guardarlo en el sessionStorage.
      usuarioConectado = true;
      sessionStorage.setItem("usuarioConectado",JSON.stringify(usuarioConectado));
      usuarioConectadoJson = JSON.parse(sessionStorage.getItem("usuarioConectado"));

      //ocultar botones registro y login, y visibilizar el boton cerrar sesion.
      document.getElementById("boton-ingresar").className = "d-none";
      document.getElementById("boton-registrar").className = "d-none";
      document.getElementById("boton-cerrar-sesion").className =
        "d-block btn btn-primary text-dark";
      Swal.fire("ingresaste Correctamente");
      function cerrarBoton(){
        // simulamos el click del mouse en el boton del formulario
        document.getElementById("boton-cerrar-login").click();
      }
      setTimeout(cerrarBoton, 1000);
    }
  }
}*/

function Login() {
  let usuarioExistenteSesion = "";
  const emailSesion = document.getElementById("emailSesion").value;
  const contraseñaSesion = document.getElementById("contraseñaSesion").value;
  if (!usuarioConectadoJson) {
    //buscar si existe usuario y contraseña y pasar por variable para validarlo.
    //validacion de mail y contraseña dentro del localstorage.
    usuarioFind = usuarioJson.find((usuario) => usuario.email == emailSesion);
    console.log(usuarioFind, emailSesion);

    if (usuarioFind.contraseña === contraseñaSesion) {
      usuarioExistenteSesion = usuarioFind.email;
    } else {
      Swal.fire("Usuario o contraseña incorrectas");
      return;
    }
  }

  console.log(usuarioExistenteSesion);
  if (emailSesion === usuarioExistenteSesion) {
    //pasar a usuario como conectado y guardarlo en el sessionStorage.
    usuarioConectado = true;
    sessionStorage.setItem(
      "usuarioConectado",
      JSON.stringify(usuarioConectado)
    );
    usuarioConectadoJson = JSON.parse(
      sessionStorage.getItem("usuarioConectado")
    );
  }
  //ocultar botones registro y login, y visibilizar el boton cerrar sesion.
  document.getElementById("boton-ingresar").className = "d-none";
  document.getElementById("boton-registrar").className = "d-none";
  document.getElementById("boton-cerrar-sesion").className =
    "d-block btn btn-primary text-dark";
   Swal.fire("ingresaste Correctamente");
  function cerrarBoton() {
    // simulamos el click del mouse en el boton del formulario
    document.getElementById("boton-cerrar-login").click();
  }
  setTimeout(cerrarBoton, 1000);
}

let emailReg = document.getElementById("emailRegister").value;
let contraseñaReg = document.getElementById("contraseñaRegistro").value;
let contraseñaRegCon = document.getElementById("contraseñaRegistroCon").value;
let usuarioNuevo = [];
//la funcion para registrar usuarios mediante localstorage
function Register() {

  usuarioConectado = false;

  emailReg = document.getElementById("emailRegister").value;
  contraseñaReg = document.getElementById("contraseñaRegistro").value;
  contraseñaRegCon = document.getElementById("contraseñaRegistroCon").value;
  //busca en el localStorage si existe el mail ingresado. intente con filter pero no pude hacer que sea igual un valor a la busqueda.
  
    for (let i = 0; i < usuarioJson.length; i++) {
      if (usuarioJson[i].email == emailReg)

      usuarioExistenteRegistro=usuarioJson[i].email;
      console.log(usuarioExistenteRegistro);
    }
  if(usuarioExistenteRegistro==emailReg){
            Swal.fire("Este mail ya esta registrado!!!");
            return;
  }

  //validaciones para el registro de usuario
  if (emailReg === "" || contraseñaReg === "" || contraseñaRegCon === "") {
    Swal.fire("los campos no pueden estar vacios");
    return;
  }
  if (emailReg !== "" && !regexEmail.test(emailReg)) {
    Swal.fire("debes escribir una direccion de corrreo valida");
    return;
  }
  if (contraseñaReg !== contraseñaRegCon) {
    Swal.fire("las contraseñas deben coincidir");
    return;
  }
  if (contraseñaReg.length < 6) {
    Swal.fire("la contraseña debe ser mayor a 6 digitos");
    return;
  } else {

    usuarioConectado = false;
    sessionStorage.setItem("usuarioConectado",JSON.stringify(usuarioConectado));
    usuarioConectadoJson = JSON.parse(sessionStorage.getItem("usuarioConectado"));
    let usuarioX={email:emailReg, contraseña:contraseñaReg };
    usuarioNuevo.push(usuarioX);
    //guardado del usuario en el localStorage.
    localStorage.setItem("usuario", JSON.stringify(usuarioNuevo));
    //en usuarioJson guardo el objeto del localstorage y luego la variable usuarioJson la utilizo para el resto de funciones.
    usuarioJson = JSON.parse(localStorage.getItem("usuario"));

    Swal.fire("Registrado con exito");

    //cree funcion mostrar y clickbutton para poder cerrar el modal registro y abrir el login simultaneamente.
    function mostrar() {
      // simulamos el click del mouse en el boton del formulario
      document.getElementById("boton-ingresar").click();
    }
    setTimeout(mostrar, 1300);
    function clickbutton() {
      // simulamos el click del mouse en el boton del formulario
      document.getElementById("boton-cerrar-registro").click();
    }
    setTimeout(clickbutton, 1000);
    return;
  }
}

function CerrarSesion() {
  //ocultar boton cerrar sesion, y visibilizar los botones login y registro.
  document.getElementById("boton-ingresar").className =
    "d-inline btn btn-primary text-dark";
  document.getElementById("boton-registrar").className =
    "d-inline btn btn-primary text-dark";
  document.getElementById("boton-cerrar-sesion").className = "d-none";
  Swal.fire("Sesión Cerrada Correctamente");
  //mediante variable desconectando el usuario
  usuarioConectado = false;
  sessionStorage.setItem("usuarioConectado", JSON.stringify(usuarioConectado));
  usuarioConectadoJson = JSON.parse(sessionStorage.getItem("usuarioConectado"));
}

