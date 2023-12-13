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
import Dataset from "../../model/dataset";
import Sales from "../../model/sales";
import Expenses from "../../model/expenses";
import RollBackSales from "../../model/rollBackSales";
import mongoose from "mongoose";
import { format } from "date-fns";

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

async function NationalID() {
  let id;
  do {
    id = Math.floor(Math.random() * (99999999 - 10000000)) + 10000000;
  } while (await User.findOne({ nationalId:id }));
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
      NationalID(),

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
    const nationalId=data[7]

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
      __v:1,
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
      mobile:body.mobile,
      nationalId,
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
      __v:1
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

export async function getBranchById(id){

  try {

    let branch=await Branch.findOne({id})

    console.log(branch)

    branch=JSON.stringify(branch) 

    let butcheryData={
      branch:JSON.parse(branch),
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
        __v:1
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
    // console.log(products);

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
        __v:1
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

export async function newSale(value,session){

  const user=session.user

  let responseData={
      message:'',
      success:false
  }

  try {

    // console.log(value)
      
      const body=[]

      value.map((result)=>{

        if(parseFloat(result.quantitySold) >0 && parseFloat(result.totalPrice) >0){
          body.push(result)
        }
      })
      // console.log(body);


      let processes=[]

      processes.push(
        Sales.findOne({branch:user.branch}),
        // Dataset.findOne({branch:user.branch})
      )

      let wait=await Promise.allSettled(processes)
      // console.log(wait)

      let isToday=wait[0].value 
      // let branchDataset=wait[1].value

      let dateObject=new Date(body[0].sellingTime.date)
      
      let weekDayName=format(dateObject,'EEEE')
      

      const branch = user.branch;
      const date = body[0].sellingTime.date;
      const hour = body[0].sellingTime.hour;

      const moreHourDetails=async()=>{
          await Sales.updateOne(
              {
              branch,
              'details.date': date,
              'details.moreDateDetails.hour': hour,
              },
              {
              
              $push: {
                  'details.$[outer].moreDateDetails.$[hour].moreHourDetails': {
                  $each: body.map((result) => ({
                      id:result.code.toLowerCase()+result.sellingTime.uniqueDate,
                      code: result.code.toUpperCase(),
                      name: result.name,
                      amountSold: parseInt(result.totalPrice),
                      date: result.sellingTime.fullDate,
                      weekDayName,
                      quantity: parseFloat(result.quantitySold).toFixed(4),
                      amountProvided:parseInt(result.paymentType.cash) + parseInt(result.paymentType.m_pesa),
                      change:(parseInt(result.paymentType.cash) + parseInt(result.paymentType.m_pesa)) - parseInt(result.totalPrice),
                      cashier:user.id,
                      payedBy:{
                        type:parseInt(result.paymentType.type),
                        cash: result.paymentType.type ===2 ? 0 : parseInt(result.paymentType.cash),
                        m_pesa:result.paymentType.type ===2 ? parseInt(result.paymentType.cash) : parseInt(result.paymentType.m_pesa)
                      }
                  })),
                  },
              },
              },
              {
              arrayFilters: [
                  { 'outer.date': date },
                  { 'hour.hour': hour },
              ],
              }
          )
      }

      const moreDateDetails=async()=>{
              await Sales.updateOne(
                  {
                  branch,
                  'details.date': date,
                  // 'details.moreDateDetails': hour,
                  },
                  {
                      hour:body[0].sellingTime.hour,
                      $push: {
                        'details.$[outer].moreDateDetails': {
                          hour:body[0].sellingTime.hour,
                          moreHourDetails:[],
                          }
                      },
                    },
                    {
                      arrayFilters: [
                        { 'outer.date': date },
                      ],
                    }
              )
      }

      const Details=async()=>{
          await Sales.updateOne(
                  {
                  branch,
                  },
                  {
                      date:body[0].sellingTime.date,
                      $push: {
                        'details': {
                              date:body[0].sellingTime.date,
                              moreDateDetails:[]
                          }
                      },
                  },
                    
              )
      }


      if (isToday) {

          if (isToday.date === body[0].sellingTime.date) {

              if (isToday.hour === body[0].sellingTime.hour) {
                  moreHourDetails()
              } else {
                  await moreDateDetails()
                  moreHourDetails()
              }
              
          } else {
              await Details()
              await moreDateDetails()
              await moreHourDetails()
          }
      }
      else{

          await Sales.create({
              branch,
              date:body[0].sellingTime.date,
              hour:body[0].sellingTime.hour,
              details:[]
          })

          await Details()
          await moreDateDetails()
          await moreHourDetails()

      }

      // let promises=[]

      // const moreDatasetDetails=async(name,quantity)=>{
        
      //   await Dataset.updateOne(
      //       {
      //       branch:user.branch,
      //       'details.name': name,
      //       'details.moreNameDateDetails.date': date,
      //       },
      //       {
      //           date:body[0].sellingTime.date,
      //           $addToSet: {
      //             'details.$[outer].moreNameDateDetails.$[date].totalQuantity': parseFloat(quantity)
      //           },
      //         },
      //         {
      //           arrayFilters: [
      //             { 'outer.name': name },
      //             { 'date.date': date },
      //           ],
      //         },
      //         {
      //           $upsert:true
      //         }
      //   )
      // }

      // const moreNameDatasetDetails=async(name)=>{
        
      //   await Dataset.updateOne(
      //       {
      //       branch:user.branch,
      //       'details.name': name,
      //       // 'details.moreDateDetails': hour,
      //       },
      //       {
      //           date:body[0].sellingTime.date,
      //           $addToSet: {
      //             'details.$[outer].moreNameDateDetails': {
      //                 date:body[0].sellingTime.date,
      //                 // moreDateDetails:[]
      //               }
      //           },
      //         },
      //         {
      //           arrayFilters: [
      //             { 'outer.name': name },
      //           ],
      //         },
      //         {
      //           $upsert:true
      //         }
              
      //   )
      // }

      // const DatasetDetails=async(name)=>{

      //   let a= []

      //   a.push(
      //     Dataset.updateOne(
      //       {
      //       branch:user.branch,
      //       },
      //       {
      //         date:body[0].sellingTime.date,
      //         $addToSet: {
      //           'details':{
      //             name: name,
      //             moreNameDateDetails: []
      //           }
                
      //         },
      //       },
      //       {
      //         upsert: true,
      //       }
            
      //     ),
      //     Dataset.updateOne(
      //       {
      //       branch:user.branch,
      //       },
      //       {
      //         $addToSet: {
      //           'products': name,
      //         },
      //       },
      //       {
      //         $upsert:true
      //       }
      //   )
      //   )

      //   await Promise.allSettled(a)
          
      // }

      // if (!branchDataset) {
      //   branchDataset=await Dataset.create({
      //     branch:user.branch,
      //     date:body[0].sellingTime.date,
      //     products:[],
      //     details:[]
      //   })
      // }

      // promises.push(
      //     body.map(async(result)=>{

      //       let product=await Product.findOne({code:result.code})

      //       const newQuantity= (product.quantity-result.quantitySold)
      //       product.quantity=newQuantity.toFixed(4)
      //       console.log(branchDataset.products);


      //       if (!branchDataset.products.includes(result.name)) {
      //         await DatasetDetails(result.name)
      //         await moreNameDatasetDetails(result.name)
      //       }

      //       if (branchDataset.date !== body[0].sellingTime.date) {
      //         await moreNameDatasetDetails(result.name)
      //       } 
      //       moreDatasetDetails(result.name,result.quantitySold)
            
      //       product.save()
      //     })
      // )

      // await Promise.allSettled(promises)

      responseData.success=true
  
      return responseData

  } catch (error) {
      
      console.log(error);
      responseData.message='Server error has ocurred.'      
  
      return responseData
  }
  
}

export async function getSales(data){

  const session=data.session
  const date=data.date
  const page=data.page
  const limit=data.limit

  // console.log(data);

  const user=session.user

  let responseData={
    message:'',
    success:false,
    sales:''
  }

  try {

  // let dateHour= Today()

  // const today = new Date();
  // const weekStart = new Date(today);
  // weekStart.setDate(today.getDate() - today.getDay());
  // const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  // const yearsAgo = new Date();
  // yearsAgo.setFullYear(today.getFullYear() - 5); // 5 years ago

  let productMatchQuery
  let cashierMatchQuery

  productMatchQuery =
    data.product === 'all'
    ? {}
    : { 'details.moreDateDetails.moreHourDetails.name': data.product };
    cashierMatchQuery =
    data.cashier === 'all'
    ? {}
    : {'details.moreDateDetails.moreHourDetails.cashier': data.cashier};
  
    const salesPipeline = [
      {
        $match: { branch: new mongoose.Types.ObjectId(user.branch) },
      },
      {
        $unwind: "$details",
      },
      {
        $unwind: "$details.moreDateDetails",
      },
      {
        $unwind: "$details.moreDateDetails.moreHourDetails",
      },
      {
        $match: {
          "details.date": date,
          ...productMatchQuery,
          ...cashierMatchQuery,
        },
      },
      {
        $sort: {
          "details.moreDateDetails.moreHourDetails.date": -1,
        },
      },
      {
        $group: {
          _id: null,
          pageCount: { $sum: 1 },
          documents: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $unwind: "$documents",
      },
      
      {
        $skip: page * limit,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          documents: 1,
          pageCount: 1,
        },
      },
    ];

  const groupedDocuments = await Sales.aggregate(salesPipeline);

  let cashierInfo=[]

  if (groupedDocuments.length>0) {
    let userArrayTemp=[]

    groupedDocuments.map((result)=>{

      let cashier_id=result.documents.details.moreDateDetails.moreHourDetails.cashier
  
      if (!userArrayTemp.includes(cashier_id)) {
        userArrayTemp.push(cashier_id)
      }
  
    })

    for (let i = 0; i < userArrayTemp.length; i++) {
      let dbCashier=await User.findOne({id:userArrayTemp[i]}).select('-password -_id -__v -verified')
      cashierInfo=cashierInfo.concat(dbCashier)
      console.log(cashierInfo);
      
    }

  }

  let products=JSON.stringify(groupedDocuments) 
  cashierInfo=JSON.stringify(cashierInfo) 

  let productData={
    products:JSON.parse(products),
    cashierInfo:JSON.parse(cashierInfo),
  }

  // console.log(groupedDocuments);

  responseData.success=true
  responseData.sales=productData
  return responseData

  } catch (error) {
    console.log(error);
    responseData.message='Server error has ocurred.'      
    return responseData
  }
};

export async function rollBackSales(data){

  let responseData={
    message:'',
    success:false
  }
  const sale=data.sale

  // console.log(data);

  // return
  let promises=[]

  try {

    promises.push(
    Sales.updateOne(
      {
      branch:data.branch,
      'details.date': data.date,
      'details.moreDateDetails.hour': data.hour,
      },
      {
          $pull: {
            'details.$[outer].moreDateDetails.$[hour].moreHourDetails': {id:sale.id}
          },
        },
        {
          arrayFilters: [
            { 'outer.date': data.date },
            { 'hour.hour': data.hour },
            { 'id.id': sale.id },
          ],
        },
    ))

    promises.push(
      RollBackSales.create({
      branch:data.branch,
      date:data.now.date,
      user:data.user,
      details:{
        rolledAt:data.now.fullDate,
        ...sale
      }
    })
    )
    let product=await Product.findOne({branch:data.branch,code:sale.code})

    product.quantity=product.quantity + parseFloat(sale.quantity) || product.quantity

    promises.push(product.save())

    await Promise.allSettled(promises)

    responseData.success=true

    return responseData
    
  } catch (error) {
    console.log(error);
    responseData.message='Server error has ocurred.'      

    return responseData
  }

  


}

export async function getRollBackSales(data){

  const session=data.session
  const date=data.date
  const page=data.page
  const limit=data.limit


  const user=session.user

  let responseData={
    message:'',
    success:false,
    sales:''
  }

  try {

  // let dateHour= Today()

  // const today = new Date();
  // const weekStart = new Date(today);
  // weekStart.setDate(today.getDate() - today.getDay());
  // const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  // const yearsAgo = new Date();
  // yearsAgo.setFullYear(today.getFullYear() - 5); // 5 years ago

  let productMatchQuery
  let cashierMatchQuery

  productMatchQuery =
    data.product === 'all'
    ? {}
    : { 'details.name': data.product };
    cashierMatchQuery =
    data.cashier === 'all'
    ? {}
    : {'user': data.cashier};
  
    const salesPipeline = [
      {
          
        $match: { branch: new mongoose.Types.ObjectId(user.branch), date },
      },
      
      {
        $unwind: "$details",
      },
      {
        $sort: {
          "date": -1,
        },
      },
      {
        $match: {
          ...productMatchQuery,
          ...cashierMatchQuery,
        },
      },
      
      {
        $group: {
          _id: null,
          pageCount: { $sum: 1 },
          documents: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $unwind: "$documents",
      },
      
      {
        $skip: page * limit,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          documents: 1,
          pageCount: 1,
        },
      },
    ];

  const groupedDocuments = await RollBackSales.aggregate(salesPipeline);


  let cashierInfo=[]

  if (groupedDocuments.length>0) {
    let userArrayTemp=[]

    groupedDocuments.map((result)=>{

      let cashier_id=result.documents.user
  
      if (!userArrayTemp.includes(cashier_id)) {
        userArrayTemp.push(cashier_id)
      }
  
    })

    for (let i = 0; i < userArrayTemp.length; i++) {
      let dbCashier=await User.findOne({id:userArrayTemp[i]}).select('-_id -__v -verified')
      cashierInfo=cashierInfo.concat(dbCashier)
      
    }

  }

  let products=JSON.stringify(groupedDocuments) 
  cashierInfo=JSON.stringify(cashierInfo) 

  let productData={
    products:JSON.parse(products),
    cashierInfo:JSON.parse(cashierInfo),
  }

  // console.log(groupedDocuments);

  responseData.success=true
  responseData.sales=productData
  return responseData

  } catch (error) {
    console.log(error);
    responseData.message='Server error has ocurred.'      
    return responseData
  }
};

export async function getExpense(data){

  const session=data.session
  const date=data.date
  const page=data.page
  const limit=data.limit

  const user=session.user

  let responseData={
    message:'',
    success:false,
    expense:''
  }

  try {

  let cashierMatchQuery
  let expenseMatchQuery

    cashierMatchQuery =
    data.cashier === 'all'
    ? {}
    : {'details.moreDateDetails.cashier': data.cashier};

    expenseMatchQuery =
    data.expense === 'all'
    ? {}
    : {'details.moreDateDetails.name': data.expense};
  
    const expensePipeline = [
      {
        $match: { branch: new mongoose.Types.ObjectId(user.branch) },
      },
      {
        $unwind: "$details",
      },
      {
        $unwind: "$details.moreDateDetails",
      },
      {
        $match: {
          "details.date": date,
          ...cashierMatchQuery,
          ...expenseMatchQuery,
        },
      },
      {
        $sort: {
          "details.moreDateDetails.date": -1,
        },
      },
      {
        $group: {
          _id: null,
          pageCount: { $sum: 1 },
          documents: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $unwind: "$documents",
      },
      
      {
        $skip: page * limit,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          documents: 1,
          pageCount: 1,
        },
      },
    ];

  const groupedDocuments = await Expenses.aggregate(expensePipeline);

  let cashierInfo=[]
  let cashiers=[]

  if (groupedDocuments.length>0) {
    let userArrayTemp=[]

    await Promise.all(groupedDocuments.map(async(result)=>{

      let cashier_id=result.documents.details.moreDateDetails.cashier
      let dbCashier=await User.findOne({id:cashier_id}).select('-_id -__v -verified')

      if (!userArrayTemp.includes(cashier_id)) {
        userArrayTemp.push(cashier_id)
        cashierInfo.push(dbCashier)
      }
      cashiers.push(dbCashier)
        
    }))

  }

  let expenses=JSON.stringify(groupedDocuments) 
  cashierInfo=JSON.stringify(cashierInfo) 
  cashiers=JSON.stringify(cashiers) 

  let productData={
    expenses:JSON.parse(expenses),
    cashierInfo:JSON.parse(cashierInfo),
    cashiers:JSON.parse(cashiers),
  }

  responseData.success=true
  responseData.expense=productData
  return responseData

  } catch (error) {
    console.log(error);
    responseData.message='Server error has ocurred.'      
    return responseData
  }
};

export async function newExpense(data){
  let responseData={
    message:'',
    success:false,
    expense:''
  }

  try {

    // await Expenses.deleteMany({})
    
    let expenseData=await Expenses.findOne({branch:data.branch})

      const moreDateDetails=async(data)=>{
        
        await Expenses.updateOne(
            {
            branch:data.branch,
            'details.date': data.date.date,
            },
            {
                date:data.date.date,
                $push: {
                  'details.$[date].moreDateDetails': {
                    cashier:data.cashier,
                    date:data.date.fullDate,
                    name:data.name,
                    amount:parseFloat(data.amount)
                  }
                },
              },
              {
                arrayFilters: [
                  { 'date.date': data.date.date },
                ],
              },
              {
                $upsert:true
              }
        )
      }

      const setDetails=async(data)=>{

          await Expenses.updateOne(
            {
            branch:data.branch,
            },
            {
              date:data.date.date,
              $push: {
                'details':{
                  date:data.date.date,
                  moreDateDetails:[]
                }
              },
            },
            {
              upsert: true,
            }
            
          )
          
      }

      if (!expenseData) {
        expenseData=await Expenses.create({
          branch:data.branch,
          date:data.date.date,
          expenseName:[],
          details:[]
        })

        await setDetails(data)
      }

      if (!expenseData.expenseName.includes(data.name)) {
        await Expenses.updateOne(
          {
          branch:data.branch
          },
          {
            $addToSet: {
              'expenseName': data.name,
            },
          },
          {
            $upsert:true
          }
        )
      }

      if (expenseData.date !== data.date.date) {
        await setDetails(data)
      }

      await moreDateDetails(data)

    responseData.success=true
    return responseData
  } catch (error) {
    console.log(error);
    responseData.message='Server error has ocurred.'      
    return responseData
  }
}

export const getReportData = async (branch,Today,val) => {

  let responseData={
      message:'',
      success:false,
      reports:[]
  }

  try {

  let dateHour= Today

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const yearsAgo = new Date();
  yearsAgo.setFullYear(today.getFullYear() - 5); // 5 years ago
  
  const salesPipelineRevenue = [
    {
      $match: { branch: new mongoose.Types.ObjectId(branch) },
    },
    {
      $unwind: "$details",
    },
    {
      $unwind: "$details.moreDateDetails",
    },
    {
      $unwind: "$details.moreDateDetails.moreHourDetails",
    },
    {
      $match: {
        "details.date": { $gte: dateHour.yearsAgo },
      },
    },
    {
      $group: {
        _id: {
          date: "$details.date",
        },
        totalAmount: { $sum: "$details.moreDateDetails.moreHourDetails.amountSold" },
        documents: {
          $push: "$$ROOT", // Store the original documents
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        totalAmount: 1,
        // documents: 1,
      },
    },
    {
      $sort: { date: 1 },
    },
  ];

  const salesPipelineExpense = [
    {
      $match: { branch: new mongoose.Types.ObjectId(branch) },
    },
    {
      $unwind: "$details",
    },
    {
      $unwind: "$details.moreDateDetails",
    },
    {
      $match: {
        "details.date": { $gte: dateHour.yearsAgo },
      },
    },
    {
      $group: {
        _id: {
          date: "$details.date",
        },
        totalAmount: { $sum: "$details.moreDateDetails.amount" },
        documents: {
          $push: "$$ROOT", // Store the original documents
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        totalAmount: 1,
        // documents: 1,
      },
    },
    {
      $sort: { date: 1},
    },
  ];

  let revenue
  let expense
  let report


  if (val===1) {

    let promise=[
      Sales.aggregate(salesPipelineRevenue),
      Expenses.aggregate(salesPipelineExpense)
    ]

    let response=await Promise.allSettled(promise)

    revenue=response[0].value
    expense=response[1].value
    
  } else {
    
  }

  let data={
    revenue,expense,report
  }
  
  responseData.success = true;
  responseData.reports = data;
  return responseData;

  } catch (error) {
      console.log(error);
      responseData.message='Server error has ocurred.'      
      return responseData
  }
};