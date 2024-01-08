import mongoose, { Schema, model, models } from 'mongoose'

const butcherySchema=new Schema({

    id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    code:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ],
    },
    mobile:{
        type:Number,
        required:true,
    },
    country:{
        type:Array,
        required:true,
    },
    verified:{
        type:Boolean,
        default:false,
        required:true,
    },
    __v:{
        type: Number,
        default:1,
    }
},{timestamps:true})

butcherySchema.index({id:1,name:1,email:1,code:1})

const Butchery=models.Buchary || model("Buchary",butcherySchema)
export default Butchery