import mongoose, { Schema, model, models } from 'mongoose'

const invoiceSchema=new Schema({

    branch:{
        type:mongoose.Types.ObjectId,
        required:true,
    },
    invoiceNumber:{
        type:Number,
        required:true,
    },
    details:{
        type:Array,
        required:true
    }
    
},{
    timestamps:true
})

invoiceSchema.index({branch:1,date:1})


const Invoice=models.Invoixs || model("Invoixs",invoiceSchema)
export default Invoice
