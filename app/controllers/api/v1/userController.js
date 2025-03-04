const userService=require("../../../services/userService")

const registerUser = async (req, res) => {
    const user = "dwdw"
    console.log(user)
    return res.status(200).json({Code: 200, message: "User registered", data: user});
}

module.exports= {registerUser}