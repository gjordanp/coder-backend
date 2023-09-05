import multer from 'multer';
import { __dirname } from './path.js';

const profileStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, __dirname+'/public/profile')
    },
    filename: (req, file, cb)=>{
        const userId = req.params.id;
        cb(null,userId+'_'+ file.originalname)
    }
});

export const profileUploader = multer({storage: profileStorage});

const docStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, __dirname+'/public/documents')
    },
    filename: (req, file, cb)=>{
        //id from params
        const userId = req.params.id;
        cb(null, userId+'_'+file.originalname)
    }
});

export const docUploader = multer({storage: docStorage});

const productStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, __dirname+'/public/products')
    },
    filename: (req, file, cb)=>{
        const userId = req.params.id;
        cb(null, userId+'_'+file.originalname)
    }
});

export const productUploader = multer({storage: productStorage});