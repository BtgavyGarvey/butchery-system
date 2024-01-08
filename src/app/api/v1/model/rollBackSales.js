import mongoose, { Schema, model, models } from 'mongoose'

const rollBackSchema=new Schema({

    branch:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    date:{
        type:String,
        required:true
    },
    user:{
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

rollBackSchema.index({branch:1,date:1})


const RollBackSale=models.Bakrolsel || model("Bakrolsel",rollBackSchema)
export default RollBackSale
