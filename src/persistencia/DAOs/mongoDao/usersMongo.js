import userModel from '../../mongoDB/models/users.model.js'
import BasicMongo from './basicMongo.js'

class UsersMongo extends BasicMongo {
    constructor(model) {
        super(model);
    }
    async setPasswordModifiable(id, date) {
        try {
            const user= await userModel.findByIdAndUpdate(id, {passwordModifiableUntil:date}, {new: true});
            return user;
        } catch (error) {
            return error;
        }
    }
}
export const usersMongo = new UsersMongo(userModel);