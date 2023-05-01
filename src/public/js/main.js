// La carpeta publica es el cliente
const socket= io();

//socket.emit() //enviar eventos
//socket.on() //escuchar eventos


const formulario= document.getElementById('formulario');
formulario?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const formdata= new FormData(formulario)
    const product=Object.fromEntries(formdata);//Transforma el FormData en un objeto
    //console.log(product);
    socket.emit('client:newproduct', product);
    formulario.reset();
})

//Cargar productos
LoadProducts=(products)=>{
    const productlist=document.getElementById('product-list');
    productlist.innerHTML='';
    products.forEach(product => {
        const productli=document.createElement('li');
        Object.entries(product).forEach(([key, value])=>{productli.innerHTML+=`<p><strong>${key}:</strong> ${value}</p>`})
        productli.innerHTML+=`<button class="delete" data-id="${product.id}">Borrar</button>`
        productli.innerHTML+=`<br>`
        productlist?.appendChild(productli);

        //Listener al boton delete
        const btnDelete= productli.querySelector('.delete');
        btnDelete.addEventListener('click', (e)=>{
            const id=parseInt(e.target.dataset.id);
            console.log(id);
            socket.emit('client:deleteProduct', id);
        })
    });
}

socket.on('server:onloadProducts', (Products)=>{
    LoadProducts(Products)
})

socket.on('server:updatedProducts', (updatedProducts)=>{
    LoadProducts(updatedProducts)
})

socket.on('server:deleteProduct', (updatedProducts)=>{
    LoadProducts(updatedProducts)
})


