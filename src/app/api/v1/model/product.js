import crypto from 'crypto'
import mongoose, { Schema, model, models } from 'mongoose'

const productSchema=new Schema({

    branch:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    batchNumber:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    markedPrice:{
        type:Number,
        required:true,
    },
    availableQuantity:{
        type:Number,
        required:true,
    },
    __v:{
        type: Number,
        default:0,
    }
},{
    timestamps:true
})

productSchema.index({batchNumber:1,name:1,markedPrice:1})


const Product=models.Prodakt || model("Prodakt",productSchema)
export default Product
