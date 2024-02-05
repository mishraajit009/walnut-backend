// Controller logic for API routes
const jwt = require('jsonwebtoken');
const usersModal = require('../modal/users');
//console.log("Consoling env",process.env.JSONTOKEN_SECRET_KEY)
// const secretKey = process.env.JSONTOKEN_SECRET_KEY;
const secretKey ='secret';
exports.listItem = async(req, res) => {
    const list_items = await usersModal.listItems();
    res.send({ products: list_items });
};

exports.buyItems = (req, res) =>{
    res.send({message:"Hellon in addItems"});
}

exports.login = async (req,res)=>{
    console.log("my req body",req.body);
    const { username, password } = req.body;

    //const user = users.find((u) => u.username === username && u.password === password);
    const user_detail =await usersModal.login(username,password)
    console.warn("User Details",user_detail);
    if (!user_detail) {
        return res.status(401).send('Invalid username or password.');
    }

    const token = jwt.sign({ username: user_detail[0].userId, role: user_detail[0].role }, secretKey);
   // res.json({ token });
    res.send({message:"Login Succesfull",token:token})
}
  