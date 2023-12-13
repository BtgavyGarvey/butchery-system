import mongoose, { Schema, model, models } from 'mongoose'

const EmployeesPaymentsSchema=new Schema({

    branch:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    employee:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    amount:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    cashier:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    __v:{
        type:Number,
        required:true,
    },
    
},{
    timestamps:true
})

EmployeesPaymentsSchema.index({branch:1,date:1})


const EmployeesPayments=models.PaimentEmployis || model("PaimentEmployis",EmployeesPaymentsSchema)
export default EmployeesPayments
