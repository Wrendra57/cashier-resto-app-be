const {sequelize} = require("../models/index.js");
const models = require("../models/index.js")
const User = models.User;


const insert = async ({params})=>{
    try{
        let user = await User.create(params);
        return user;
    } catch (error) {
        console.error(`Request ID: - User Repository Insert error:`, error.message);
        throw new Error("Database query error: " + error.message);
    }
}

module.exports={insert}