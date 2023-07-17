import messajesModel from '../../mongoDB/models/messajes.models.js'
import BasicMongo from './basicMongo.js'

class MessajesMongo extends BasicMongo {
    constructor(model) {
        super(model);
    }
}
export const messajeMongo = new MessajesMongo(messajesModel);