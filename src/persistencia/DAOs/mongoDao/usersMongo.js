import userModel from '../../mongoDB/models/users.models.js'
import BasicMongo from './basicMongo.js'

class UsersMongo extends BasicMongo {
    constructor(model) {
        super(model);
    }
}
export const usersMongo = new UsersMongo(userModel);