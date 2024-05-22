const Product = require("../model/productModel")

class productController{
    addProduct = async (req,res,next)=>{
       res.send("Hello")
    }

}
module.exports = new productController();