import mongoose, {connect, connection} from 'mongoose'
import nodeMailer from 'nodemailer'
import sanitizeHtml from 'sanitize-html';
import Joi from 'joi';
import moment from 'moment';
import crypto from 'crypto';
import {addDays, addMonths} from 'date-fns'

// import jwt from 'jsonwebtoken'

// DB CONNECTION

const conn={
    isConnected:false,
    DB_URL:process.env.DB_URL
}

export default async function DbConnect(){

    let db:any
    try {

        if(conn.isConnected) return;
        mongoose.set('strictQuery', false);
        if(conn.DB_URL) db=await connect(conn.DB_URL)
        conn.isConnected=db.connections[0].readyState

    } catch (error) {
        console.log(error);
    }
    
}

connection.once("connected",()=>{
    console.log("DB connected");
})

connection.once("error",(err)=>{
    console.log("MongoDB error ",err.message);
})

// SEND EMAIL

export async function sendEmail(subject: any,message: any,send_to: any,sent_from: any){

    //Create Email transporter
    const transporter=nodeMailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:587,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD,
        },
        tls:{
            rejectUnauthorized:false
        }
    })

    // Options for sending email

    const options={
        from:sent_from,
        to:send_to,
        subject:subject,
        html:message
    }

    //Send Email
    transporter.sendMail(options,function(err: any,info: any){
        if (err) {
            console.log(err);
        }
        
    })
}

export const sanitizeMessage=async(message: any) =>{
  // Define the allowed HTML tags and attributes
  const allowedTags = {
    allowedTags: ['div','h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'br', 'ul', 'ol', 'li'],
    allowedAttributes: {
      a: ['href'],
    },
  };

  const sanitizedMessage = sanitizeHtml(message, allowedTags);
  
  return sanitizedMessage;
}

// INPUT VALIDATION

export async function newButcheryValidation (data: any){
    const schema = Joi.object({
        subscription: Joi.number().required(),
        mobile: Joi.number().required(),
        email: Joi.string().trim().required(),
        password: Joi.string().trim().required(),
        confirmPassword: Joi.string().trim().required(),
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        country: Joi.string().trim().required(),
        countryCode: Joi.string().trim().required(),
        region: Joi.string().trim().required(),
        branch: Joi.string().trim().required(),
        terms: Joi.boolean().required(),
        role: Joi.string().trim().required(),
        name: Joi.string().trim().required(),
    });

    return schema.validate(data);
};

export async function newBranchValidation (data: any){
    const schema = Joi.object({
        name: Joi.string().trim().required(),
        id: Joi.string().trim(),
        butchery: Joi.string().trim().required(),
        region: Joi.string().trim().required(),
        package: Joi.number().required(),
        expiryDate: Joi.date().required().required(),
        mobile: Joi.number().required()
    });

    return schema.validate(data);
};

export async function newUserValidation (data: any){
    const schema = Joi.object({
        branch: Joi.string().trim().required(),
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        salary: Joi.number().required(),
        password: Joi.string().trim().required(),
        role: Joi.string().required().required(),
    });

    return schema.validate(data);
};

export const sanitizeInput =async (input: string) => {
    // Remove unwanted characters and escape special characters
    const sanitizedInput = input
      .replace(/[^\w\s]/gi, '') // Remove characters other than word characters and spaces
      .replace(/'/g, '\\\'') // Escape single quotes
      .replace(/"/g, '\\\"'); // Escape double quotes
  
    return sanitizedInput;
};

// MIDDLEWARE

export function MiddleWare(req: any,res: any,fn: (arg0: any, arg1: any, arg2: (result: any) => void) => void){

    return new Promise((resolve,reject)=>{
        fn(req,res,(result: unknown)=>{
            if(result instanceof Error){
                return reject(result)
            }
            return resolve(result)
        })
    })
}

export const upperCase=(value: string)=>{
    return value.toUpperCase()
}

export const generateCode=async(value: any)=>{
    
    let code=value+crypto.randomBytes(3).toString('hex');
    code=code.trim().toUpperCase();
    return code;

}

export const generateId=async(value: any)=>{
    
    let code=value+crypto.randomBytes(11).toString('hex')+value;
    code=code.trim().toLowerCase();
    return code;

}

export const getFirstAndLastWord=async(value: string)=>{

    value=value.trim()
    const text=value.split(" ")
    var newText1=text[0]
    var newText2=text[text.length-1]

    var emailText=newText1

    if (newText2.trim() !== emailText.trim()) {
        emailText=emailText+'.'+newText2
    }
    return emailText.trim()
}

export const DayTime=async()=>{

    const dayTime=moment().format('LL')
    return dayTime
}

export const AddDate=async(value:Number)=>{

    const today = new Date();
    const plusDate = addMonths(today, 2);
    return plusDate.toDateString()
}

