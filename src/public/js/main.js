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

socket.on('server:updatedProducts', (updatedProducts)=>{
    const productlist=document.getElementById('product-list');
    productlist.innerHTML='';
    updatedProducts.forEach(product => {
        const productli=document.createElement('li');
        Object.entries(product).forEach(([key, value])=>{productli.innerHTML+=`<p><strong>${key}:</strong> ${value}</p>`})
        productli.innerHTML+=`<br>`
        productlist?.appendChild(productli);
    });

})

