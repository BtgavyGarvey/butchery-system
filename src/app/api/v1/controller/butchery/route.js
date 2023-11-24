'use server'

import { NextRequest, NextResponse } from "next/server";
import DbConnect, { AddDate, MiddleWare, generateCode, generateId, newBranchValidation, newButcheryValidation, newProductValidation, sanitizeMessage, sendEmail } from "../../utils";
import Butchery from "../../model/butchery";
import Token from "../../model/token";
import Branch from "../../model/branches";
import User from "../../model/users";
import bcrypt from 'bcryptjs'
import crypto from 'crypto';
import Morgan from 'morgan'
import { newUser } from "../user/route";
import Product from "../../model/product";
import LinkedProduct from "../../model/linkedProduct";
import ProductIssue from "../../model/productIssues";

// DB CONNECTION

DbConnect()

let butcheryName

let email
export async function exportEmail(){
  return email
}

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

async function generateUniqueProductId(prefix) {
  let id;
  do {
    id = await generateId(prefix);
  } while (await Product.findOne({ id }));

  return id;
}

async function generateUniqueProductCode(prefix,branch) {
  let code;
  do {
    code = await generateCode(prefix);
  } while (await Product.findOne({ code,branch }));

  return code;
}

export async function tokenGeneration (id, emailToken) {
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

export async function newButchery(value){

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

    // const data=promise.filter((res)=> res.status==='fulfilled')

    let data = promise.flatMap((response) =>
      response.status==='fulfilled' ? [response.value] : []
    );

    const emailExist=data[0]
    const mobile=data[1]
    const ButcheryCode=data[2]
    const ButcheryId=data[3]
    const BranchId=data[4]
    const dbNotNull=data[6]

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

    let country={
      name:body.country,
      phoneCode:body.phoneCode,
      isoCode:body.isoCode,
    }

    const insertButchery=await Butchery.create({
      id:ButcheryId,
      code:ButcheryCode,
      name:body.name,
      mobile:body.mobile,
      email:body.email,
      country,
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
      expiryDate:data[5],
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

    const verifyUrl = `${process.env.WEB_URL}/verifyemail?token=${verifyToken}`;

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

export async function newBranch(value){

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

  let data = promise.flatMap((response) =>
    response.status==='fulfilled' ? [response.value] : []
  );

  let id=body.id

  if (!id) {
    id=data[0]
  }

    let nameExist=data[2]
    let nameRegionExist=data[3]

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
      code:data[1],
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

export async function getButcheryProfile(session){

  const user=session.user  
  // console.log(user);

  let branch
  let butchery
  let branches
  let userData
  
  let profileData

  try {

    const promises=[
      Branch.findOne({id:user.branch}),
      User.findOne({id:user.id})
    ]

    const promise=await Promise.allSettled(promises)

    let data = promise.flatMap((response) =>
      response.status==='fulfilled' ? [response.value] : []
    );

    branch=data[0]
    userData=data[1]

    if (branch) {
      butchery=await Butchery.findOne()

      if (butchery) {
        branches=await Branch.find({butchery:butchery.id})
      }

      branches=JSON.stringify(branches) 
      butchery=JSON.stringify(butchery) 
      userData=JSON.stringify(userData) 

      profileData={
        branches:JSON.parse(branches),
        butchery:JSON.parse(butchery),
        userData:JSON.parse(userData),
      }
      
    } else {
      
    }
    console.log(profileData);

    return profileData
    
  } catch (error) {
    
  }

  

}

export async function getBranches(session){
  const user=session.user

  let butcheryData
  let branches

  try {

    let branch=Branch.findOne({id:user.branch})

    if (branch) {
      let butchery=await Butchery.findOne()

      if (butchery) {
        branches=await Branch.find({butchery:butchery.id})
      }

      branches=JSON.stringify(branches) 

      butcheryData={
        branches:JSON.parse(branches),
      }
      
    } else {
      
    }

    return butcheryData
    
  } catch (error) {
    
  }


}

export async function newProduct(value,session){

  const user=session.user

  let responseData={
    message:'',
    success:false
  }

  try {

  const validate=await newProductValidation(value)

  if (validate.error) {
      console.log(validate.error);
      responseData.message='Fill in all fields.'      

      return responseData
  }

  const body=validate.value

  const promises=[
    generateUniqueProductId(3),
    generateUniqueProductCode('P'),
    Product.findOne({branch:user.branch,name:body.name}),
  ]

  const promise=await Promise.allSettled(promises)

  let data = promise.flatMap((response) =>
    response.status==='fulfilled' ? [response.value] : []
  );

  let id=data[0]

    let nameExist=data[2]

    if (nameExist) {
      responseData.message='Your branch has a product with the same name'
      return responseData
    }

    let parentProduct
    let quantity=body.quantity

    let dbPromise=[]

    if (body.link) {
      parentProduct=await Product.findOne({id:body.parent})
      quantity=parentProduct.quantity

      let parentData={
        parent:parentProduct.id,
        quantity,
        child:id,
        __v:0
      }

      dbPromise.push(
      LinkedProduct.updateMany({parent:parentProduct.id},{$set:{quantity}},{$upsert:false})
      )
      dbPromise.push(
      LinkedProduct.create(parentData)
      )
      
    }

    let productData={
      id,
      code:data[1],
      name:body.name,
      branch:user.branch,
      quantity,
      price:body.price,
      linked:{
        status:body.link,
        parent:body.parent,
      },
      addedBy:user.id,
      updatedBy:user.id,
      __v:1
    }


    dbPromise.push(
      Product.create(productData)
    )

    await Promise.allSettled(dbPromise)

    responseData.success=true

    return responseData
    
  } catch (error) {
    console.log(error);
    responseData.message='Server error has ocurred.'      

    return responseData
  }

}

export async function getProducts(session,val){
  const user=session.user

  let productData
  let branches=[]
  let addedBy=[]

  try {

    let currentPage=0
    let size=10

    let skip=currentPage*size

    let products=await Product.find({branch:user.branch,__v:val}).skip(skip).limit(size)

    if (products.length>0) {

      for (let i = 0; i < products.length; i++) {

        const promises=[
          Branch.findOne({id:products[i].branch}),
          User.findOne({id:products[i].addedBy})
        ]
    
        const promise=await Promise.allSettled(promises)
    
        let data = promise.flatMap((response) =>
          response.status==='fulfilled' ? [response.value] : []
        );
        branches.push(data[0])
        addedBy.push(data[1])

        
      }

      products=JSON.stringify(products) 
      branches=JSON.stringify(branches) 
      addedBy=JSON.stringify(addedBy) 

      productData={
        products:JSON.parse(products),
        branches:JSON.parse(branches),
        addedBy:JSON.parse(addedBy),
      }
      
    } else {
      productData={
        products,
        branches,
        addedBy,
      }
    }

    // console.log(productData);

    return productData
    
  } catch (error) {
    
  }


}

export async function editProducts(body,session){

  const user=session.user

  try {
    
    let product=await Product.findOne({id:body.id})

    if (product) {

      product.name=body.name || product.name
      product.price=body.price || product.price
      product.updatedBy=user.id || product.updatedBy

      await product.save()
      
    }else{
      return false
    }
    return true

  } catch (error) {
    
  }
}

export async function productsIssue(body,session){

  const user=session.user
  let date=new Date()
  date=date.toLocaleDateString()

  try {

    let issueDataDB=await ProductIssue.findOne({product:body.id,branch:user.branch,date})
    // console.log(issueDataDB);
    if (issueDataDB) {
      return false
    }

    let product=await Product.findOne({id:body.id})
    // console.log(product);

    if (product) {

      if (product.linked[0].status) {
        return false
      }

      let newQuantity=product.quantity - body.quantity
      product.quantity=newQuantity.toFixed(4) || product.quantity
      product.updatedBy=user.id || product.updatedBy

      let promises=[]

      promises.push(
        product.save()
      )
      promises.push(
        LinkedProduct.updateMany({parent:product.id},{$set:{quantity:newQuantity.toFixed(4)}},{$upsert:false})
      )

      let parentProduct=await LinkedProduct.find({parent:product.id})
      if (parentProduct.length>0) {

        for (let i = 0; i < parentProduct.length; i++) {

          promises.push(
            Product.updateOne({id:parentProduct[i].child},{$set:{quantity:newQuantity.toFixed(4)}})
          )
          
        }

      }

      let issueData={
        product:product.id,
        quantity:body.quantity,
        loss:parseFloat(body.quantity * product.price).toFixed(4),
        branch:user.branch,
        addedBy:user.id,
        date,
        __v:0
      }

      promises.push(
        ProductIssue.create(issueData)
      )

      await Promise.allSettled(promises)

    }else{
      return false
    }
    return true

  } catch (error) {
    
  }

}

export async function deleteProducts(branch,id,session,val){

  const user=session.user

  try {
    
    let product=await Product.findOne({id,branch})

    if (product) {

      product.__v=val || product.__v
      product.updatedBy=user.id || product.updatedBy

      await product.save()
      
    }else{
      return false
    }
    return true

  } catch (error) {
    
  }
}