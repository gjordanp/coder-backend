import cartService from '../services/cart.service.js';
import productService from '../services/product.service.js';

export const createCart = async (req, res) => {
    try {
        const newCart = await cartService.create({ products: [] });
        //res.status(200).json({message: "Cart created",newCart});
        res.status(200).send(newCart);
    }
    catch (error) {
        //res.status(500).json({message: "Error",error});
        res.status(500).send("ERROR: " + error);
    }
};

export const getCarts = async (req, res) => {
    try {
        const carts = await cartService.findAll();
        //res.status(200).json({message: "Carts",carts});
        res.status(200).send(carts);
    } catch (error) {
        //res.status(500).json({message: "Error",error});
        res.status(500).send("ERROR: " + error);
    }
};

export const getCartById =  async (req, res) => {
    const cid= req.params.cid
    try {
        const cart=await cartService.findByIdAndPopulate(cid,'products.id_prod');
        res.status(200).render('carts',{cart:cart});
    } catch (error) {
        res.status(500).send("ERROR: " + error);
    }
};

export const addProductOnCart = async (req, res) => {
    const cid= req.params.cid;
    const pid= req.params.pid;
    const { quantity } = req.body //Consulto el dato quantity enviado por postman
    try {
        const cart=await cartService.findById(cid);
        const product= await productService.findById(pid);
        if(!product){
            res.status(200).send("Producto no existe"+product);
        }
        //if product is already in cart
        if(cart.products.find(product=>product.id_prod==pid)){
        //find cart and product and update incrementing quantity
            const filter={_id:cid,"products.id_prod":pid};
            const update={$inc:{"products.$.quantity":quantity}};
            const options={new:true};
            const updatedCart= await cartService.findOneAndUpdate(filter,update,options);
            res.status(200).send(updatedCart);
        }
        else{
            //if product is not in cart, add it
            const filter={_id:cid};
            const update={$push:{products:{id_prod:pid,quantity:quantity}}};
            const options={new:true};
            const updatedCart= await cartService.findOneAndUpdate(filter,update,options);
            console.log(updatedCart);
            res.status(200).send(updatedCart);
        }
    } catch (error) {
        res.status(500).send( "Error: Cart ID o Product ID no existen\n\n"+error);
    }
};

export const deleteProductOnCart = async (req, res) => {
    try {
        const cid= req.params.cid;
        const pid= req.params.pid;
        //find cart and delete product
        const filter={_id:cid};
        const update={$pull:{products:{id_prod:pid}}};
        const options={new:true};
        const updatedCart=await cartService.findOneAndUpdate(filter,update,options);
        res.status(200).send(updatedCart);
    } catch (error) {
        res.status(500).send("Error: Cart ID o Product ID no existen\n\n" + error);
    }
};

export const deleteCart = async (req, res) => {
    try {
        const cid= req.params.cid;
        //find cart and delete products
        const filter={_id:cid};
        const update={products:[]};
        const options={new:true};
        const updatedCart=await cartService.findOneAndUpdate(filter,update,options);
        res.status(200).send(updatedCart);
    } catch (error) {
        res.status(500).send("Error: Cart ID no existe\n\n" + error);
    }
};

export const updateProductOnCart = async (req, res) => {
    const cid= req.params.cid;
    const products=req.body.products;
    try {
        //find cart and update products
        const filter={_id:cid};
        const update={products:products};
        const options={new:true};
        const updatedCart=await cartService.findOneAndUpdate(filter,update,options);
        res.status(200).send(updatedCart);
    } catch (error) {
        res.status(500).send("Error: Cart ID o formato del arreglo products incorrectos \n\n" + error);
    }
};

export const updateProductQuantityOnCart = async (req, res) => {
    const cid= req.params.cid;
    const pid= req.params.pid;
    const { quantity } = req.body //Consulto el dato quantity enviado por postman
    try {
        //find cart and product and update quantity
        const filter={_id:cid,"products.id_prod":pid}
        const update={$set:{"products.$.quantity":quantity}}
        const options={new:true};
        const updatedCart=await cartService.findOneAndUpdate(filter,update,options);
        res.status(200).send(updatedCart);

    } catch (error) {
        res.status(500).send( "Error: Cart ID o Product ID o quantity Incorrectos \n\n"+error);
    }
};