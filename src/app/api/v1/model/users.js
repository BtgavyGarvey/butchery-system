import mongoose, { Schema, model, models } from 'mongoose'

const userSchema=new Schema({

    id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
        
    },
    role:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    nationalId:{
        type:String,
        required:true,
    },
    branch:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    salary:{
        type:Number,
        required:true,
    },
    __v:{
        type: Number,
        default:1,
    }
},{timestamps:true})

userSchema.index({id:1,firstName:1,lastName:1})

const User=models.Usar || model("Usar",userSchema)
export default User