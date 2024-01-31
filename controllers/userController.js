// Controller logic for API routes

exports.listItem = (req, res) => {
    console.log("IN list items");
    res.json({ message: 'Hello, this is your API response! list Items' });
};

exports.buyItems = (req, res) =>{

    res.send({message:"Hellon in addItems"});
}
  