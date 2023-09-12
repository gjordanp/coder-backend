import userModel from "../../mongoDB/models/users.model.js";
import BasicMongo from "./basicMongo.js";

class UsersMongo extends BasicMongo {
    constructor(model) {
        super(model);
    }
    async setPasswordModifiable(id, date) {
        try {
            const user = await userModel.findByIdAndUpdate(
                id,
                { passwordModifiableUntil: date },
                { new: true }
            );
            return user;
        } catch (error) {
            return error;
        }
    }
    async changePremiumRole(id) {
        try {
            const user = await userModel.findById(id);
            const role = user.role == "premium" ? "user" : "premium";
            const updatedUser = await userModel.findByIdAndUpdate(
                id,
                { role: role },
                { new: true }
            );
            return updatedUser;
        } catch (error) {
            return error;
        }
    }
    async updateLastConnection(id) {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(
                id,
                { last_connection: Date.now() },
                { new: true }
            );
            return updatedUser;
        } catch (error) {
            return error;
        }
    }

    async uploadDocument(id, docName, filePath) {
        try {
            // push document to user.documents
            const user = await userModel.findById(id);
            if (!user) {
                return { error: "User not found" };
            }
            const doc = user.documents.find((doc) => doc.name === docName);

            if (!doc) {// if document not found, push it
                const update = {$push: { documents: { name: docName, reference: filePath }}};
                const updatedUser = await userModel.findByIdAndUpdate(id, update, {new: true});
            }
            else {// if document found, update it
                const update = {$set: { documents: { name: docName, reference: filePath }}};
                const updatedUser = await userModel.findByIdAndUpdate(id, update, {new: true});
            }

        } catch (error) {
            return error;
        }
    }

    
}
export const usersMongo = new UsersMongo(userModel);
