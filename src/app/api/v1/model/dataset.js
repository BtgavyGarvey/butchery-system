import crypto from 'crypto'
import mongoose, { Schema, model, models } from 'mongoose'

const datasetSchema=new Schema({

    branch:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    date:{
        type:String,
        required:true
    },
    products:{
        type:Array,
        required:true
    },
    details:{
        type:Array,
        required:true
    },
    
},{
    timestamps:true
})

datasetSchema.index({name:1,date:1})


const Dataset=models.SetData || model("SetData",datasetSchema)
export default Dataset
