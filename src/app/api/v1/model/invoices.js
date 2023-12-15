import crypto from 'crypto'
import mongoose, { Schema, model, models } from 'mongoose'

const invoicesSchema=new Schema({

    branch:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    details:{
        type:Array,
        required:true
    },
    
},{
    timestamps:true
})

invoicesSchema.index({branch:1,date:1})


const Invoices=models.Invoisxes || model("Invoisxes",invoicesSchema)
export default Invoices
