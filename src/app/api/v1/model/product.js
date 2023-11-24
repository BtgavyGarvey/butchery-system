import crypto from 'crypto'
import mongoose, { Schema, model, models } from 'mongoose'

const productSchema=new Schema({

    id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    branch:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    code:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    linked:{
        type:Array,
        required:true,
    },
    addedBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    __v:{
        type: Number,
        default:0,
    }
},{
    timestamps:true
})

productSchema.index({code:1,name:1})


const Product=models.Prodakt || model("Prodakt",productSchema)
export default Product
