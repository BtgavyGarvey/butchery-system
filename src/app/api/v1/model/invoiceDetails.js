import mongoose, { Schema, model, models } from 'mongoose'

const invoiceSchema=new Schema({

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


const Invoice=models.Invoisx || model("Invoisx",invoiceSchema)
export default Invoice
