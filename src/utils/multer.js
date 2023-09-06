import multer from 'multer';
import { __dirname } from './path.js';

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        const body = req.body;//multipart/form-data entrega body vacio, por lo que se agrega un input de texto adicional con el nombre del documento
        const docName=Object.values(body)[0];
        if(docName=='profileImg'){
            cb(null, __dirname+'/public/profile')
        }
        else if(docName=='product'){
            cb(null, __dirname+'/public/products')
        }
        else{
            cb(null, __dirname+'/public/documents')
        }
    },
    filename: (req, file, cb)=>{
        const userId = req.params.id;
        cb(null,userId+'_'+ file.originalname)
    }
});

export const multerUploader = multer({storage: storage});

