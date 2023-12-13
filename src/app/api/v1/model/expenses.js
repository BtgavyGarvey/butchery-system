import crypto from 'crypto'
import mongoose, { Schema, model, models } from 'mongoose'

const expensesSchema=new Schema({

    branch:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    date:{
        type:String,
        required:true
    },
    expenseName:{
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

expensesSchema.index({branch:1,date:1})


const Expenses=models.Expenxes || model("Expenxes",expensesSchema)
export default Expenses
