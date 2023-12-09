import mongoose, { Schema, model, models } from 'mongoose'
import bcrypt from 'bcryptjs'

const cashierSchema=new Schema({

    cashier:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    branch:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    __v:{
        type: Number,
        default:1,
    }
},{timestamps:true})

cashierSchema.index({cashier:1,branch:1})


cashierSchema.pre('save', async function(next){

    if(!this.isModified('password')){
        return next()
    }

    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(this.password,salt)
    this.password=hashedPassword

    next()

})

const Cashier=models.Kashea || model("Kashea",cashierSchema)
export default Cashier