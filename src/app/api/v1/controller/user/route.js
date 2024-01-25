'use server'

import { NextResponse } from "next/server";
import DbConnect, { MiddleWare, generateId, newUserValidation, sanitizeMessage, sendEmail, setCookies } from "../../utils";
import Token from "../../model/token";
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import Morgan from 'morgan'
import User from "../../model/users";
import Branches from "../../model/branches";
import Cashier from "../../model/cashiers";
import { exportEmail } from "../butchery/route";
import Butchery from "../../model/butchery";
import EmployeesPayments from "../../model/employeesPayments";
import LoginDetails from '../../model/loginDetailsModel'
import LoginStatus from '../../model/loginStatusModel'
import mongoose from "mongoose";
import { Country } from "country-state-city";


// DB CONNECTION

DbConnect()

// HTTP REQUEST METHODS

export async function POST(request) {

    let responseData

    const body=await request.json()
    const {searchParams}=new URL(request.url)
    const params=searchParams.get('action')
    const morgan=Morgan('dev')

    if (params==='newUser') {
        MiddleWare(request,NextResponse,morgan)
        responseData=await newUser(body)
    }
    else if (params==='forgotpassword') {
    MiddleWare(request,NextResponse,morgan)
    responseData=await forgotPassword(body)
    }
    else if (params==='checkcode') {
    MiddleWare(request,NextResponse,morgan)
    responseData=await checkResetPasswordCode(body)
    }
    // else if (params==='checkcode') {
    //   MiddleWare(request,NextResponse,morgan)
    //   responseData=await checkResetPasswordCode(body)
    // }
    return NextResponse.json(responseData)
    
}

export async function GET(request) {

    let responseData={
        message:'',
        success:false,
        drugs:null
    }

    const {searchParams}=new URL(request.url)
    const action=searchParams.get('action')
    const pharmacy=searchParams.get('pharmacy')
    const morgan=Morgan('dev')

    if (action==='getMedicineData') {
        
      MiddleWare(request,NextResponse,morgan)
      responseData=await getMedicineData(pharmacy)
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
        
      responseData=await verifyEmail(token)
    }
    return NextResponse.json(responseData)
    
}

export async function PUT(request) {

    let responseData

    const body=await request.json()
    const {searchParams}=new URL(request.url)
    const params=searchParams.get('action')

    if (params==='resetPassword') {
        
    //   responseData=await resetPassword(body)
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

async function generateUniqueUserId(prefix) {
    let id;
    do {
      id = await generateId(prefix);
    } while (await User.findOne({ id }));
  
    return id;
}
  
  async function generateUniqueUsername() {
    let username;
    do {
      username = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    } while (await User.findOne({ username }));
    return username;
}

//NEW USER

export async function newUser(value){

    let responseData={
        message:'',
        success:false
    }

    try {

        const validate=await newUserValidation(value)
      
        if (validate.error) {
            console.log(validate.error);
            responseData.message='Fill in all fields.'      
      
            return responseData
        }
      
        const body=validate.value
        
        const promises=[
            generateUniqueUserId(3),
            generateUniqueUsername(),
            User.findOne({mobile:body.mobile})
        ]

        const promise=await Promise.allSettled(promises)

        let data = promise.flatMap((response) =>
          response.status==='fulfilled' ? [response.value] : []
        );

        let mobileExist=data[2]

        let userData={
            id:data[0],
            username:data[1],
            firstName:body.firstName,
            lastName:body.lastName,
            password:body.password,
            role:body.role,
            mobile:body.mobile,
            nationalId:body.nationalId,
            branch:body.branch,
            salary:body.salary,
            __v:1
        }

        if (mobileExist) {
          responseData.message='Phone number already exist'
          return responseData
        }

        if (body.role==='Administrator') {
          userData.username='000000'
        }

        if (body.role==='Administrator' || body.role==='Employer') {
          let cashierData={
            id:userData.id,
            password:body.password,
            branch:body.branch,
          }
          await newCashier(cashierData)
        }

        if (body.role ==='Employee') {
          
          let IdExist=await User.findOne({nationalId:userData.nationalId})

          if (IdExist) {
            responseData.message='National ID already exist.'      
    
            return responseData
          }
          
        }

        const insertUser=await User.create(userData)
    
        if (!insertUser) {
            responseData.message='Invalid data'
            return responseData
        }

        insertUser.__v=1

        await insertUser.save()

        const message=`
        <h3>Registration of ${body.role} ${body.firstName} ${body.lastName},</h3>
        <p>This is to notify you that this new ${body.role} have been registered successfully.</p>
        <p>Kindly provide the username below to the ${body.role} for the purpose of login.</p>
        <p>Username: <b>${insertUser.username}</b></p>

        <p>Kind Regards</P>
        `
        let email=await exportEmail()
        
        const subject=`${body.role} Registration`
        const send_to=email
        const sent_from=process.env.EMAIL_USER

        const sanitizedMessage = await sanitizeMessage(message);

        sendEmail(subject,sanitizedMessage,send_to,sent_from)

    
        responseData.success=true
    
        return responseData

    } catch (error) {
        
        console.log(error);
        responseData.message='Server error has ocurred.'      
    
        return responseData
    }
    
}

export async function getUsers(data){

    let responseData={
        message:'',
        success:false,
        users:[]
    }
    let branches=[]
    let payments=[]

    let branch=data.branch
    let searchParams=data.searchParams
    let limit=data.pageLimit
    let page=data.page

    try {

      const matchQuery = 
        searchParams==='all' 
        ? {}
        :
        {
          $or: [
          { username: { $regex: searchParams, $options: 'i' } },
          { firstName: { $regex: searchParams, $options: 'i' } },
          { lastName: { $regex: searchParams, $options: 'i' } },
          { mobile: { $regex: searchParams, $options: 'i' } },
          { nationalId: { $regex: searchParams, $options: 'i' } },
          ],
        }
        
      
  
      let pipeline = [
        {
          $match: {
            ...matchQuery,
            branch: new mongoose.Types.ObjectId(branch),
            __v: 1,
            role:'Employee'
          },
        },
        {
          $sort: { createdAt: -1 },
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
          $skip:page * limit
        },
        {
          $limit:limit
        },
        {
          $project: {
            _id: 0,
          },
        },
      ];
  
      let users = await User.aggregate(pipeline);

      if (users.length>0) {

        for (let i = 0; i < users.length; i++) {

          pipeline=[
            {
              $match:{
                employee:new mongoose.Types.ObjectId(users[i].documents.id),
                branch:new mongoose.Types.ObjectId(users[i].documents.branch),
                __v:1
              }
              
            },
            {
              $lookup: {
                from: 'usars',
                localField: 'cashier',
                foreignField: 'id',
                as: 'cashierInfo',
              },
            },
            {
              $unwind: { path: '$cashierInfo', preserveNullAndEmptyArrays: true },
            }

          ]

          let promises=[
            Branches.findOne({id:users[i].documents.branch}),
            EmployeesPayments.aggregate(pipeline)
          ]

          const element =  await Promise.allSettled(promises)

          branches.push(element[0].value)
          payments.push(element[1].value)
          
        }
        
      }

      users=JSON.stringify(users) 
      branches=JSON.stringify(branches)
      payments=JSON.stringify(payments)

      let data={
        users:JSON.parse(users),
        branches:JSON.parse(branches),
        payments:JSON.parse(payments),
      }
      responseData.users=data
      responseData.success=true

      return responseData

    } catch (error) {
        console.log(error);
        responseData.message='Server error has ocurred.'      
    
        return responseData
        
    }
}

export async function editUser(body){

  let responseData={
    message:'',
    success:false,
  }

  try {
    
    let user=await User.findOne({id:body.id})

    if (user) {

      user.firstName=body.firstName || user.firstName
      user.lastName=body.lastName || user.lastName
      user.salary=body.salary || user.salary
      user.branch=body.branch || user.branch
      user.mobile=body.mobile || user.mobile

      let mobileExist=await User.findOne({mobile:body.mobile,id:{$ne:body.id}})

      if (mobileExist) {
        responseData.message='Phone number already exist'
        return responseData
      }

      await user.save()
      
    }
    responseData.success=true
    return responseData

  } catch (error) {
    console.log(error);
    responseData.message='Server error occured'
    return responseData
  }
}

export async function deleteUser(id){

  try {
    await User.deleteOne({id})

    return true
    
  } catch (error) {
    console.log(error)
    return false
  }

}

export async function getEmployeePayments(branch,employee){

  let responseData={
    message:'',
    success:false,
    payments:[]
  }

  try {
    let payments=await EmployeesPayments.find({branch,employee,__v:1})

    let cashier=[]

    if (payments > 0) {

      await Promise.all(
        payments.map(async(result)=>{
          const element = await User.find({id:result.cashier});
          cashier.push(element)
        })
      )
    }

    payments=JSON.stringify(payments)
    cashier=JSON.stringify(cashier)
    
    let data={
      cashier:JSON.parse(cashier),
      payments:JSON.parse(payments),
    }

    responseData.success=true
    responseData.payments=data
    
  } catch (error) {
    
  }

}

export async function newEmployeePayment(data){
  let responseData={
    message:'',
    success:false,
  }
  try {

    let user= await User.findOne({id:data.employee})
    let pipeline=[
      {
        $match:{
          employee:new mongoose.Types.ObjectId(data.employee),
          branch:new mongoose.Types.ObjectId(user.branch),
          __v:1
        }
        
      },
      {
          $group:{
            _id:null,
            totalPayment:{$sum:'$amount'}
          }
      }
    ]

    let payments=await EmployeesPayments.aggregate(pipeline)

    if (payments.length>0) {
      if (parseFloat(user.salary) <= parseFloat(payments[0]) || (parseFloat(payments) + parseFloat(data.amount)) > parseFloat(user.salary)) {

        responseData.message='Insufficient salary balance'
        return responseData
      }
    }
    
    let insertPayment=await EmployeesPayments.create({
      ...data,
      branch:user.branch,
      __v:1
    })

    insertPayment.__v=1

    await insertPayment.save()

    responseData.success=true
    return responseData

    
  } catch (error) {
    console.log(error)
    responseData.message='Server error occurred'
    return responseData
  }

}

export async function resetEmployeePayment(value){

  try {

    if (value.action === 1) {
      await EmployeesPayments.updateMany({branch:value.branch},{$set:{__v:-1}})
    } else if (value.action === 2){
      await EmployeesPayments.updateMany({branch:value.branch, employee:value.employee},{$set:{__v:-1}})
    }

    return true
    
  } catch (error) {
    console.log(error)
    return false
  }

}

export async function reverseEmployeePayment(id){

  try {
    await EmployeesPayments.findByIdAndDelete(id)

    return true
    
  } catch (error) {
    console.log(error)
    return false
  }

}

// USER LOGIN

export async function loginUser(username, password, req) {
  try {
    if (!username || !password) {
      return {
        message: 'Please enter username and password',
        success: false,
      };
    }

    const user = await User.findOne({ username }).lean().exec();

    if (!user) {
      return {
        message: 'User not found',
        success: false,
      };
    }

    if (user.__v === -1) {
      return {
        message: 'Invalid username or password',
        success: false,
      };
    }

    const cashierUser = await Cashier.findOne({ cashier: user.id }).lean().exec();

    if (!cashierUser) {
      return {
        message: 'Invalid username or password',
        success: false,
      };
    }

    if (cashierUser.__v === -1) {
      return {
        message: 'Access denied',
        success: false,
      };
    }

    const validPassword = await bcrypt.compare(password, cashierUser.password);

    const branch = await Branches.findOne({ id: cashierUser.branch }).lean().exec();

    const butchery = await Butchery.findOne({ id: branch.butchery }).lean().exec();

    if (validPassword) {
      if (!butchery.verified) {
        return {
          message: 'Email not verified. Please verify your business email address',
          success: false,
        };
      }

      if (butchery.__v !==1 && user.role ==='Employee') {
        return {
          message: 'The shop is closed. Contact your employer',
          success: false,
        };
      }

      const cashierName = user.firstName + ' ' + user.lastName + ' (' + user.username + ')';
      if (process.env.NODE_ENV === 'production') {
        loginDetails(req, cashierUser.cashier, butchery.email, butchery.name, cashierName);
      }

      let access = 0

      if (user.role==='Administrator') {
        setCookies(req,'2')
        access=2
        
      } else if (user.role==='Employer') {
        setCookies(req,'3')
        access=3
        
      } else if (user.role==='Employee'){
        setCookies(req,'1')
        access=1
      }

      return {
        success: true,
        user,
        butchery,
        access,
        branch,
      };
    } else {
      return {
        message: 'Invalid username or password',
        success: false,
      };
    }
  } catch (error) {
    console.log('Error =>' + error);
    return {
      message: 'Unknown server error has occurred',
      success: false,
    };
  }
}

export const loginDetails = async (req, id, email, name, cashierName) => {

  try {
    loginStatus(id)
    const { headers, connection } = req;

    const device = headers['user-agent'];
    const ipAddress = headers['x-real-ip'] || headers._remoteAddress;
    const location = {
      country: headers['x-vercel-ip-country'],
      city: headers['x-vercel-ip-city'],
      latitude: headers['x-vercel-ip-latitude'],
      longitude: headers['x-vercel-ip-longitude'],
      timeZone: headers['x-vercel-ip-timezone'],
    };

    if (!device || !ipAddress || !location.country || !location.city) {
      return;
    }

    const rootDomain = headers.host;
    const protocol = headers['x-forwarded-proto'] || (connection.encrypted ? 'https' : 'http');

    const country = Country.getCountryByCode(location.country);
    location.country = country.name;

    const options = {
      timeZone: location.timeZone,
      dateStyle: 'full',
      timeStyle: 'medium',
    };
    const d = new Date();
    const date = new Intl.DateTimeFormat('en-US', options).format(d);

    let logindetails
    const result = await LoginDetails.find({cashier: id}).sort({ _id: -1 }).limit(1).toArray();


    if (result.length >0) {
      logindetails = result[0];

      if (logindetails.device !== device) {
        const message = `
          <h4>Hello ${name} Butchery</h4>
          <p>Your Butchery Management System account was just signed in to from a new device.</p><br />
          <p><b>Cashier:</b> ${cashierName}</P>
          <p><b>When:</b> ${date}</P>
          <p><b>Time Zone:</b> ${location.timeZone}</P>
          <p><b>Device:</b> ${device}</P>
          <p><b>IP Address:</b> ${ipAddress}</P>
          <p><b>Location:</b> ${location.city}/${location.country}</P><br />
          <p>If you recognize this activity, then you don't need to do anything.</P>
          <p>If you don't recognize this activity, please contact us through <a href="emailto:mylegiomariae.systems@gmail.com">mylegiomariae.systems@gmail.com</a>.</P>
        `;
        const subject = 'New Sign in to your Butchery Account';
        const send_to = email;
        const sent_from = process.env.EMAIL_USER;

        // Sanitize the message before sending it via email
        const sanitizedMessage = await sanitizeMessage(message);

        sendEmail(subject, sanitizedMessage, send_to, sent_from);
      }

    }
    
    let insert = await LoginDetails.create({
      cashier: id,
      ipAddress,
      device,
      location,
      __v: 1,
    });

    insert.__v = 1;
    await insert.save();
    return;

  } catch (error) {
    console.error(error);
    return;
  }
};

export async function loginStatus(id){

  try {
    await LoginStatus.findOneAndUpdate(
      { cashier: id },
      { __v: 1 },
      { upsert: true, new: true },
    );
  } catch (error) {
    console.log(error);
  }
  
}

  // LOGIN DETAILS - EXTENSION OF loginUser() FUNCTION
  
  // export const loginDetails = async (req: { headers: any; connection: any; }, id: any, email: any, name: any) => {
  //   try {
  //     const { headers, connection } = req;
  
  //     const device = headers['user-agent'];
  //     const ipAddress = headers['x-real-ip'] || headers._remoteAddress;
  //     const location = {
  //       country: headers['x-vercel-ip-country'],
  //       city: headers['x-vercel-ip-city'],
  //       latitude: headers['x-vercel-ip-latitude'],
  //       longitude: headers['x-vercel-ip-longitude'],
  //       timeZone: headers['x-vercel-ip-timezone'],
  //     };
  
  //     if (!device || !ipAddress || !location.country || !location.city) {
  //       return; 
  //     }
  
  //     const rootDomain = headers.host;
  //     const protocol = headers['x-forwarded-proto'] || (connection.encrypted ? 'https' : 'http');
  
  //     const country = await Country.getCountryByCode(location.country);
  //     location.country = country.name;
  
  //     const options = {
  //       timeZone: location.timeZone,
  //       dateStyle: 'full',
  //       timeStyle: 'medium',
  //     };
  //     const d = new Date();
  //     const date = new Intl.DateTimeFormat('en-US', options).format(d);
  
  //     // const login = await LoginStatus.findOneAndUpdate(
  //     //   { userId: id },
  //     //   { isLoggedIn: true, updatedAt: new Date() },
  //     //   { upsert: true, new: true },
        
  //     // );
  
  //     const logindetails = await LoginDetails.findOne({ userId: id });
  
  //     if (logindetails) {
  //       if (logindetails.device !== device) {
  //         const message = `
  //           <h4>Hello ${name}</h4>
  //           <p>Your Legio Mariae Management System account was just signed in to from a new device.</p><br />
  //           <p><b>When:</b> ${date}</P>
  //           <p><b>Time Zone:</b> ${location.timeZone}</P>
  //           <p><b>Device:</b> ${device}</P>
  //           <p><b>IP Address:</b> ${ipAddress}</P>
  //           <p><b>Location:</b> ${location.city}/${location.country}</P><br />
  //           <p>If this was you, then you don't need to do anything.</P>
  //           <p>If you don't recognize this activity, please <a href="${protocol}://${rootDomain}/sections/forgotpassword">change your password</a>.</P>
  //         `;
  //         const subject = 'New Sign in to your Legio Mariae Management System account';
  //         const send_to = email;
  //         const sent_from = process.env.EMAIL_USER;
  
  //         // Sanitize the message before sending it via email
  //         const sanitizedMessage = await sanitizeMessage(message);
  
  //         sendEmail(subject, sanitizedMessage, send_to, sent_from);
  //       }
  
  //       logindetails.device = device;
  //       logindetails.location = location;
  //       logindetails.ipAddress = ipAddress;
  //       await logindetails.save();
  
        
  //     } else {
  //       await LoginDetails.create({
  //         userId: id,
  //         ipAddress,
  //         device,
  //         location,
  //         __v: 0,
  //       },);
  //     }
  
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };


export async function verifyEmail(token){

    let responseData={
      message:'',
      success:false
    }

    const hashedToken=crypto.createHash("sha256").update(token).digest('hex')

    try {

        const butcheryToken=await Token.findOne({
            token:hashedToken,
            expiresAt:{$gt:Date.now()}
        })
    
        if (!butcheryToken) {
          responseData.message='Link has expired.'      
          return responseData
        }
    
        if (butcheryToken.used) {
          responseData.message='Link has already been used.'      
          return responseData
        }

        let butchery=await Butchery.findOne({id:butcheryToken.id})

        if (butchery.verified) {
          responseData.message='You have already verified your email.'      
          return responseData
        }
    
        butchery.verified=true
        butcheryToken.used=true
        await butcheryToken.save()
        await butchery.save()


        responseData.success=true      
        return responseData
    } catch (error) {
        console.log(error)
        responseData.message='Unknown sever error has occured.'      
        return responseData
    }
    
}

// REQUEST PASSWORD CODE

export async function forgotPassword(body) {
  let responseData = {
    message: '',
    success: false,
  };

  try {
    const { username } = body;
    const user = await User.findOne({ username });

    if (!user) {
      responseData.message = 'Invalid Username.';
      return responseData;
    }

    const [branch, butchery] = await Promise.all([
      Branches.findOne({ id: user.branch }),
      Butchery.findOne({ id: branch.butchery }),
    ]);

    await Token.deleteMany({ id: user.id });

    const resetToken = crypto.randomBytes(8).toString('hex').toUpperCase();
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await Token.create({
      id: user.id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * (60 * 1000), // 5 minutes
    });

    const message = `
      <h2>Hello ${user.firstName}</h2>
      <p>You requested a password reset.</p>
      <p>Please use the code below to reset your password.</p>
      <p>The reset code is valid for only 5 minutes.</p><br />
      <p>${resetToken}</p><br />
      <p>Kind Regards</p>
    `;
    const subject = 'Password Reset Request';
    const send_to = butchery.email;
    const sent_from = process.env.EMAIL_USER;

    try {
      const sanitizedMessage = await sanitizeMessage(message);

      await sendEmail(subject, sanitizedMessage, send_to, sent_from);

      responseData.message = 'Password reset code sent to your butchery email.';
      responseData.success = true;
      return responseData;
    } catch (error) {
      console.error('Email sending error:', error);
      responseData.message = 'Server error occurred.';
      return responseData;
    }
  } catch (error) {
    console.error('Password reset error:', error);
    responseData.message = 'Server error occurred.';
    return responseData;
  }
}


// CHECK PASSWORD CODE

export async function checkResetPasswordCode(body) {
  let responseData={
    message:'',
    success:false
  }


  try {

    const myCode = body.code.trim();
    let hashedToken = crypto.createHash("sha256").update(myCode).digest("hex");
    hashedToken = crypto.createHash("sha256").update(hashedToken).digest("hex");

    const user = await User.findOne({ username:body.username });

    const userToken = await Token.findOne({
        id: user.id,
        token: hashedToken,
        expiresAt: { $gt: Date.now() }
    });

    if (!userToken) {
      responseData.message='Invalid code.'      
      return responseData
    }

    responseData.success=true      
    return responseData
  } catch (error) {
    console.log(error);
    responseData.message='Server error occurred.'      
    return responseData
  }
};

// RESET PASSWORD

export async function resetPassword (body) {

  let responseData={
    message:'',
    success:false
  }

  try {


    const { password, username } = body;

    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      responseData.message='User not found, please sign up.'      
      return responseData
    }

    const cashier = await Cashier.findOne({ cashier:user.id }).select("-password");

    if (!cashier) {
      responseData.message='Access denied. User not cashier.'      
      return responseData
    }
    let branch=await Branches.findOne({id:user.branch})

    let butchery=await Butchery.findOne({id:branch.butchery})
  
    cashier.password = password;
    await cashier.save();

    const message = `
      <h2>Hello ${user.firstName} ${user.lastName},</h2>
      <p>You have reset your password successfully.</p>
      <p>If you did not change your password, contact us on the email below.</p>
      <p><a href=${process.env.EMAIL_USER} alt='_blank' clicktracking=off>${process.env.EMAIL_USER}.</a></p><br />
      <p>Kind Regards</p>
    `;
    const subject = "Password Reset Update";
    const send_to = butchery.email;
    const sent_from = process.env.EMAIL_USER;

    try {
      const sanitizedMessage = await sanitizeMessage(message);

      sendEmail(subject, sanitizedMessage, send_to, sent_from);

      responseData.message='Password Reset Successful. Please Login.'     
      responseData.success=true     
      return responseData

    } catch (error) {
      console.log(error);
      responseData.message='Email not set, please try again.'      
      return responseData
    }
  } catch (error) {
    console.log(error);
    responseData.message='Server error occurred.'      
    return responseData
  }
};

export async function newCashier (body) {

  let responseData={
    message:'',
    success:false,
  }

  try {

    let data={
      cashier:body.id,
      password:body.password,
      branch:body.branch,
      __v:1
    }

    let insert=await Cashier.create(data)

    insert.__v=1

    await insert.save()

    responseData.success=true
    return responseData
    
  } catch (error) {
    console.log(error);
    responseData.message='Server error has ocurred.'      
    return responseData
  }
}

export async function updateCashier (id,value) {

  try {

    await Cashier.updateOne({cashier:id},{$set:{__v:value}})

    return true
  } catch (error) {
    console.log(error)
    return false
  }

}

export async function getCashierById (id) {

  let responseData={
    message:'',
    success:false,
    cashierInfo:''
  }

  try {

    let cashiers

    
  
    let dbCashiers=await User.findOne({id}).select('-password -_id -__v -verified')

    cashiers=JSON.stringify(dbCashiers) 

  let cashierData={
    cashiers:JSON.parse(cashiers),
  }

  responseData.success=true
  responseData.cashierInfo=cashierData
  return responseData

 
    
  } catch (error) {
    console.log(error);
    responseData.message='Server error has ocurred.'      
    return responseData
  }

}

export async function getCashiers(data){

  let responseData={
      message:'',
      success:false,
      cashiers:[]
  }

  let branch=data.branch
  let limit=data.pageLimit
  let page=data.page
  try {

    let pipeline = [
      {
        $match: {
          branch: new mongoose.Types.ObjectId(branch),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: 'usars',
          localField: 'cashier',
          foreignField: 'id',
          as: 'cashierInfo',
        },
      },
      {
        $unwind: { path: '$cashierInfo', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: 'brunchees',
          localField: 'branch',
          foreignField: 'id',
          as: 'branchInfo',
        },
      },
      {
        $unwind: { path: '$branchInfo', preserveNullAndEmptyArrays: true },
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
        $skip:page * limit
      },
      {
        $limit:limit
      },
      {
        $project: {
          _id: 0,
        },
      },
    ];

    let cashiers = await Cashier.aggregate(pipeline);

    if (cashiers.length>0) {
      cashiers=JSON.stringify(cashiers) 
      
      let data={
        cashiers:JSON.parse(cashiers),
      }

      responseData.success=true
      responseData.cashiers=data
    }
    else{
      responseData.message='No employee data found'
    }

    return responseData

  } catch (error) {
      console.log(error);
      responseData.message='Server error has ocurred.'      
  
      return responseData
      
  }
}

