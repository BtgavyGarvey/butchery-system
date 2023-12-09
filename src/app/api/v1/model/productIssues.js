import crypto from 'crypto'
import mongoose, { Schema, model, models } from 'mongoose'

const productSchema=new Schema({

    product:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    branch:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    loss:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    addedBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    date:{
        type:String,
        required:true,
    },
    __v:{
        type: Number,
        default:1,
    }
},{
    timestamps:true
})

productSchema.index({product:1,branch:1})


const ProductIssue=models.ProdaktIshu || model("ProdaktIshu",productSchema)
export default ProductIssue
