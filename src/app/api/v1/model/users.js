import mongoose, { Schema, model, models } from 'mongoose'
import bcrypt from 'bcryptjs'

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
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
    },
    branch:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    salary:{
        type:Array,
        required:true,
    },
    __v:{
        type: Number,
        default:0,
    }
},{timestamps:true})

userSchema.index({id:1,firstName:1,lastName:1})


userSchema.pre('save', async function(next){

    if(!this.isModified('password')){
        return next()
    }

    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(this.password,salt)
    this.password=hashedPassword

    next()

})

const User=models.Usar || model("Usar",userSchema)
export default User