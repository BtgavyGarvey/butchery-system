import crypto from 'crypto'
import mongoose, { Schema, model, models } from 'mongoose'

const branchesSchema=new Schema({

    butchery:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    subscription:{
        type:Array,
        required:true,
    },
    mobile:{
        type:Number,
        required:true,
    },
    region:{
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

branchesSchema.index({id:1,name:1})

const Branches=models.Brunchees || model("Brunchees",branchesSchema)
export default Branches
