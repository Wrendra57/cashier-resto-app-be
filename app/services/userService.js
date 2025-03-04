const userRepository = require("../repositories/userRepository")

const createUser = async ()=>{
    try{
        // let user = await userRepository.insert({});
        console.log("user service create user");
        return "user";
    } catch (error) {
        console.error(`Request ID: - User Service Create User error:`, error.message);
        throw new Error("Database query error: " + error.message);
    }
}

module.exports = {
    createUser
}