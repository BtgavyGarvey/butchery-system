import mongoose, { Schema, model, models } from 'mongoose'

const loginDetailsSchema= new Schema({
    
    cashier:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    details:{
        type:Array,
        required:true
    },
    __v:{
        type: Number,
        default:1,
    }
    
},{
    timestamps:true,
})

loginDetailsSchema.index({userId:1})

const LoginDetails=models.detailLoggin || model('detailLoggin',loginDetailsSchema);
module.exports=LoginDetails
