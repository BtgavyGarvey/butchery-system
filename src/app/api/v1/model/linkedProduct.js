import crypto from 'crypto'
import mongoose, { Schema, model, models } from 'mongoose'

const LinkedProductSchema=new Schema({

    parent:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    child:{
        type:String,
        required:true,
    },
    quantity:{
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

LinkedProductSchema.index({parent:1})


const LinkedProduct=models.Linkd || model("Linkd",LinkedProductSchema)
export default LinkedProduct
