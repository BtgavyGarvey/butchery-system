import { NextRequest, NextResponse } from "next/server";
import DbConnect, { AddDate, MiddleWare, generateCode, generateId, newBranchValidation, newButcheryValidation, sanitizeMessage, sendEmail } from "../../utils";
import Butchery from "../../model/butchery";
import Token from "../../model/token";
import Branch from "../../model/branches";
import User from "../../model/users";
import bcrypt from 'bcryptjs'
import crypto from 'crypto';
import Morgan from 'morgan'
import { newUser } from "../user/route";

// DB CONNECTION

DbConnect()

let butcheryName
export let email

// HTTP REQUEST METHODS

export async function POST(request) {

    let responseData

    const body=await request.json()
    const {searchParams}=new URL(request.url)
    const params=searchParams.get('action')
    const morgan=Morgan('dev')

    if (params==='newButchery') {
      MiddleWare(request,NextResponse,morgan)
      responseData=await newButchery(body)
    }
    else if (params==='forgotpassword') {
      MiddleWare(request,NextResponse,morgan)
      // responseData=await forgotPassword(body)
    }
    else if (params==='checkcode') {
      MiddleWare(request,NextResponse,morgan)
      // responseData=await checkResetPasswordCode(body)
    }
    return NextResponse.json(responseData)
    
}

export async function GET(request) {

    let responseData={
        message:'',
        success:false
    }

    const {searchParams}=new URL(request.url)
    const params=searchParams.get('action')

    if (params==='newPharmacy') {
        
        // await newPharmacy()
    }
    return NextResponse.json(responseData)
    
}

export async function PATCH(request) {

    let responseData

    const {searchParams}=new URL(request.url)
    const action=searchParams.get('action')
    const token=searchParams.get('token')
    const morgan=Morgan('dev')

    if (action==='verifyemail') {
      
      MiddleWare(request,NextResponse,morgan)
        
      // responseData=await verifyEmail(token)
    }
    return NextResponse.json(responseData)
    
}

export async function PUT(request) {

    let responseData

    const body=await request.json()
    const {searchParams}=new URL(request.url)
    const params=searchParams.get('action')

    if (params==='resetPassword') {
        
      // responseData=await resetPassword(body)
    }
    return NextResponse.json(responseData)
    
}

export async function DELETE(request) {

    let responseData={
        message:'',
        success:false
    }

    // const body=await request.json()
    const {searchParams}=new URL(request.url)
    const params=searchParams.get('action')

    if (params==='newPharmacy') {
        
        // await newPharmacy(body)
    }
    return NextResponse.json(responseData)
    
}

// CODE GENERATION

async function generateUniqueButcheryCode(prefix) {
  let code;
  do {
    code = await generateCode(prefix);
  } while (await Butchery.findOne({ code }));

  return code;
}

async function generateUniqueButcheryId(prefix) {
  let id;
  do {
    id = await generateId(prefix);
  } while (await Butchery.findOne({ id }));

  return id;
}

async function generateUniqueBranchCode(prefix) {
  let code;
  do {
    code = await generateCode(prefix);
  } while (await Branch.findOne({ code }));

  return code;
}

async function generateUniqueBranchId(prefix) {
  let id;
  do {
    id = await generateId(prefix);
  } while (await Branch.findOne({ id }));

  return id;
}

export const tokenGeneration = async (id, emailToken) => {
  try {
    let token = await Token.findOne({ butchery: id });

    if (token) {
      await token.deleteOne();
    }

    await Token.create({
      butchery: id,
      token: emailToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 2880 * 60 * 1000, // 2880 minutes => 2 days
    });
  } catch (error) {
    console.log(error);
  }
};

// EXTENSION FUNCTIONS OF HTTP METHODS

export const newButchery=async(value)=>{

  let responseData={
      message:'',
      success:false
  }

  try {    

    const validate=await newButcheryValidation(value)

    if (validate.error) {
        console.log(validate.error);
        responseData.message='Fill in all fields.'      

        return responseData
    }

    let body=validate.value

    const promises=[
      Butchery.findOne({email:body.email}),
      Butchery.findOne({mobile:body.mobile}),
      generateUniqueButcheryCode('B'),
      generateUniqueButcheryId(1),
      generateUniqueBranchId(2),
      AddDate(1),
      Butchery.findOne(),
    ]

    const promise=await Promise.allSettled(promises)

    const data=promise.filter((res)=> res.status==='fulfilled')


    const emailExist=data[0]?.value
    const mobile=data[1]?.value
    const ButcheryCode=data[2].value
    const ButcheryId=data[3].value
    const BranchId=data[4].value
    const dbNotNull=data[6].value

    if (!dbNotNull) {
      body.role='Administrator'
    }

    if (emailExist) {
      responseData.message='Email has already been registered'
      return responseData
    }

    if (mobile) {
      responseData.message='Contact Number has already been registered'
      return responseData
    }

    const insertButchery=await Butchery.create({
      id:ButcheryId,
      code:ButcheryCode,
      name:body.name,
      mobile:body.mobile,
      email:body.email,
      country:body.country,
      countryCode:body.countryCode,
      verified:false,
      terms:body.terms,
      __v:0,
    })

    if (!insertButchery) {
      responseData.message='Invalid data'
      return responseData
    }

    butcheryName=insertButchery.name
    email=insertButchery.email

    let branchData={
      id:BranchId,
      name:body.branch,
      region:body.region,
      butchery:ButcheryId,
      package:body.subscription,
      expiryDate:data[5].value,
      mobile:body.mobile,
    }

    let userData={
      firstName:body.firstName,
      lastName:body.lastName,
      password:body.password,
      role:body.role,
      branch:BranchId,
      salary:0,
    }

    let verifyToken = crypto.randomBytes(32).toString("hex") + insertButchery.id;
      
    await tokenGeneration(insertButchery.id, verifyToken);

    const verifyUrl = `${process.env.WEB_URL}/sc/verifyemail?token=${verifyToken}`;

    const message=`
    <h3>Registration of ${insertButchery.name} Butchery,</h3>
    <p>Thank you for registering in Butchery Management System, Point Of Sale solution for your business.</p>
    <p>Please use the link below to verify your Registration.</p>
    <p>The verification link is valid for only 2 days.</p>
    <p><a href=${verifyUrl} clicktracking=off>Click here</a> to verify your registration</p><br />
    <p>If the above link is not working, plase copy and paste the below link in your browser.</p>
    <p><a href=${verifyUrl} clicktracking=off>${verifyUrl}.</a></p><br />

    <p>Kind Regards</P>
    `
    
    const subject="Butchery Registration"
    const send_to=insertButchery.email
    const sent_from=process.env.EMAIL_USER

    const sanitizedMessage = await sanitizeMessage(message);

    sendEmail(subject,sanitizedMessage,send_to,sent_from)

    await Promise.allSettled([newBranch(branchData),newUser(userData)])
    
    responseData.message='Check your business email for more information'
    responseData.success=true

    return responseData
    
  } catch (error) {
    console.log(error);
    responseData.message='Server error has ocurred.'      

    return responseData
  }

}

// New Branch

export const newBranch=async(value)=>{

  let responseData={
    message:'',
    success:false
  }

  try {

    const validate=await newBranchValidation(value)

    if (validate.error) {
        console.log(validate.error);
        responseData.message='Fill in all fields.'      

        return responseData
    }



    const body=validate.value

    const promises=[
      generateUniqueBranchId(2),
      generateUniqueBranchCode('R'),
      Branch.findOne({butchery:body.butchery,name:body.name}),
      Branch.findOne({region:body.region,name:body.name})
  ]

  const promise=await Promise.allSettled(promises)

  const data=promise.filter((res)=> res.status==='fulfilled')

  let id=body.id

  if (!id) {
    id=data[0].value
  }

    let nameExist=data[2]?.value
    let nameRegionExist=data[3]?.value

    if (nameExist) {
      responseData.message='Your butchery has a branch with the same name'
      return responseData
    }

    if (nameRegionExist) {
      responseData.message='Your butchery has a branch of the same name in the selected region'
      return responseData
    }


    let branchData={
      id,
      code:data[1].value,
      name:body.name,
      butchery:body.butchery,
      region:body.region,
      subscription:{
        package:body.package,
        expiryDate:body.expiryDate,
      },
      mobile:body.mobile,
      __v:0
    }

    await Branch.create(branchData)

    responseData.success=true

    const message=`
    <h3>Registration of ${body.name} Branch,</h3>
    <p>This is to notify you that you have registered a new branch under ${butcheryName} Butchery.</p>

    <p>Kind Regards</P>
    `
    
    const subject="Branch Registration"
    const send_to=email
    const sent_from=process.env.EMAIL_USER

    const sanitizedMessage = await sanitizeMessage(message);

    sendEmail(subject,sanitizedMessage,send_to,sent_from)

    return responseData
    
  } catch (error) {
    console.log(error);
    responseData.message='Server error has ocurred.'      

    return responseData
  }

}
