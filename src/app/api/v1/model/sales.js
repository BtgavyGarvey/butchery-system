import mongoose, { Schema, model, models } from 'mongoose'

const salesSchema=new Schema({

    branch:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    date:{
        type:String,
        required:true
    },
    hour:{
        type:String,
        required:true
    },
    details:{
        type:Array,
        required:true
    },
    
},{
    timestamps:true
})

salesSchema.index({branch:1,date:1})


const Sale=models.Selless || model("Selless",salesSchema)
export default Sale
