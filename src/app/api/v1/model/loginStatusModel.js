import mongoose, { Schema, model, models } from 'mongoose'

const loginStatusSchema= new Schema({
    
    cashier:{
        type:mongoose.Schema.Types.ObjectId,
    },
    __v:{
        type: Number,
        default:1,
    }
    
},{
    timestamps:true,
})

loginStatusSchema.index({userId:1})

const LoginStatus=models.StatasLoggin || model('StatasLoggin',loginStatusSchema);
module.exports=LoginStatus
