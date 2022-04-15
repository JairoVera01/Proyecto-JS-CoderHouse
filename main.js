const catalogoProductos = document.getElementById('catalogoProductos');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
/* Accedemos al contenido de la plantilla */
const plantillaCatalogo = document.getElementById('template-card').content;
const plantillaFooter = document.getElementById('template-footer').content;
const plantillaCarrito = document.getElementById('template-carrito').content;
let nombreUsuario = document.getElementById("nombreUsuario");
let usuarioAnterior = document.getElementById("usuarioAnterior");

const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener('DOMContentLoaded',()=>{
    fecthData();
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"));
        pintarCarritoDeCompras();
    }
})
/* Capturamos todo lo del div.catalogoProductos, asi evitamos capturar boton por boton */
catalogoProductos.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => { btnAumentarDisminuir(e) })

/* Capturamos datos */
const fecthData = async () => {  
    try {
        const res = await fetch('./productos.json');
        const data = await res.json(); 
        obtenerCatalogo(data);
        // console.log(data);
    } catch (error) {
        console.log(error);
    }
}

const obtenerCatalogo = data =>{
    // console.log(data);
    /* Recorrer JSON */
    data.forEach(producto => {
        /* Pintamos datos de JSON al HTML */
        plantillaCatalogo.getElementById("nombreProductos").textContent = producto.nombre;
        plantillaCatalogo.getElementById("precioProductos").textContent = producto.precio;
        plantillaCatalogo.getElementById("imgProducto").setAttribute("src", producto.urlImg);
        plantillaCatalogo.getElementById("btnComprar").dataset.id = producto.id;
        const clone = plantillaCatalogo.cloneNode(true);
        fragment.appendChild(clone);
    })
    catalogoProductos.appendChild(fragment);
}

const addCarrito = e =>{
    // console.log(e.target);
    // /* Capturamos True False , segun la clase que contenga */
    // console.log(e.target.classList.contains('btn-dark'));
    if(e.target.classList.contains('btn-dark')){
        // console.log(e.target.parentElement);
        setCarrito(e.target.parentElement);
    } 
    /* Detenemos cualquier otro evento de los items */
    e.stopPropagation();
}


const  setCarrito = objeto =>{
    /* Capturamos el "addcarrito" */
    // console.log(objeto);
    const producto = {
        id: objeto.querySelector(".btnComprarProducto").dataset.id,
        title: objeto.querySelector(".nameProducts").textContent,
        precio: objeto.querySelector(".precioProdcuto").textContent,
        cantidad : 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        /* Accedemos al elemento que se repite para aumentar solo la cantidad y no todo el producto en el objeto "carrito"  */
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    carrito[producto.id] = {...producto};
    pintarCarritoDeCompras();
    localStorage.setItem("carrito", JSON.stringify(carrito));
} 

const pintarCarritoDeCompras = () =>{
    console.log(carrito);
    items.innerHTML = '';
    Object.values(carrito).forEach(producto => {
        plantillaCarrito.querySelector('th').textContent = producto.id;
        plantillaCarrito.querySelectorAll('td')[0].textContent = producto.title;
        plantillaCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        plantillaCarrito.querySelector(".btn-info").dataset.id = producto.id;
        plantillaCarrito.getElementById("Total").textContent = producto.cantidad * producto.precio;
        const clone = plantillaCarrito.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment);
    pintarFooter();
}

const pintarFooter = () =>{
    footer.innerHTML = '';
    if(Object.keys(carrito).length === 0){
        footer.innerHTML =   
        `<th scope="row" colspan="5">SU CARRITO ESTA VACIO!!</th>`;    
        return 
    }
    /* Con object.values se puede usar funcionalidades de un array */
    const totalCantidadProductos = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0);
    const sumaPrecioProductos = Object.values(carrito).reduce((acc, {cantidad,precio}) => acc + cantidad * precio ,0);
    plantillaFooter.getElementById("totalProductos").textContent = totalCantidadProductos;
    plantillaFooter.getElementById("totalPrecios").textContent = "S/." +sumaPrecioProductos;
    const clone = plantillaFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);
    
    const btnLimpiarCarrito = document.getElementById("vaciar-carrito");
    btnLimpiarCarrito.addEventListener("click",()=>{
        carrito = {};
        pintarCarritoDeCompras();
    }) 
}

/* Capturamos el añadir y eleminar productos */
const btnAumentarDisminuir = e => { 
    /*Aumentar */
    if (e.target.classList.contains("btnAñadir")){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto};
        pintarCarritoDeCompras();
    }
    /* Disminuir */
    // if (e.target.classList.contains('btnDisminuir')) {
    //     const producto = carrito[e.target.dataset.id]
    //     producto.cantidad--
    //     if (producto.cantidad === 0) {
    //         delete carrito[e.target.dataset.id]
    //     } else {
    //         carrito[e.target.dataset.id] = {...producto}
    //     }
    //     pintarCarritoDeCompras();
    // }
    e.stopPropagation();
}


function obtenerDatos (){
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Compra Realizada',
        showConfirmButton: false,
        timer: 2500
    })
}

function saludoUsuario() {
    fname = document.getElementById("fname").value;
    nombreUsuario.innerHTML = `<h4>Bienvenido ${fname}</h4>`
    
    localStorage.setItem("nombreUsuario",fname);
    
    return fname; 
    
}

function verNombreUsuario(){
    console.log(fname);
}

usuarioAnterior.innerHTML = `<p>Usuario Anterior ${localStorage.getItem("nombreUsuario")}</p>`
/* Incorporando AJAX */

const listaRellenos = document.querySelector('#listadoRellenos');
const listaProductos = document.querySelector('#listadoProductos');
const listadoCantidad = document.querySelector('#listadoCantidad');

function mostrarRellenos(){
    fetch('/dataRelleno.json')
    .then( (res) => res.json())
    .then( (data) => {
        data.forEach((relleno) => {
            const li = document.createElement('li')
            li.innerHTML = `
                <h4>Código: ${relleno.id}</h4>
                <p>Relleno de: ${relleno.relleno}</p>
                <p>Costo Adicional: S/.${relleno.adicional}</p>
                <hr/>
            `
            listaRellenos.append(li)
        })
    })
}



function mostrarCantidad(){
    fetch('/dataCantidad.json')
    .then( (res) => res.json())
    .then( (data) => {
        data.forEach((cantidad) => {
            const li = document.createElement('li')
            li.innerHTML = `
                <h4>Código: ${cantidad.id}</h4>
                <p>Cantidad por caja: ${cantidad.cantidaPorCaja} u.</p>
                <hr/>
            `
            listadoCantidad.append(li)
        })
    })
}
