const Product = require("../model/productModel")

class productController {
    addProduct = async (req,res,next)=>{
        try {
            const {name,img,size, weight,description,price,prodcutType,color,materialName,productTypes,gemstones,materials }=req.body
            const product=new Product(
                {
                    name,img,size, weight,description,price,prodcutType,color,materialName,productTypes,gemstones,materials
                }
            )
            const res = await product.save()
            if(res){
                res.status(200).json(product)
            }
        } catch (error) {
            return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
        }
    }


}
 