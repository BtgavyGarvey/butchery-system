import crypto from 'crypto'
import mongoose, { Schema, model, models } from 'mongoose'

const tokenSchema=new Schema({

    id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    token:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
    },
    expiresAt:{
        type:Date,
        required:true,
    },
    used:{
        type:Boolean,
        default:false,
        required:true,
    },
    __v:{
        type: Number,
        default:1,
    }
},{
    timestamps:true
})

tokenSchema.index({id:1})


tokenSchema.pre('save', async function(next){

    if(!this.isModified('token')){
        return next()
    }

    const hashedToken=crypto.createHash("sha256").update(this.token).digest('hex')
    this.token=hashedToken

    next()

})

const Token=models.Tokenn || model("Tokenn",tokenSchema)
export default Token
