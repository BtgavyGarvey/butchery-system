import { NextRequest, NextResponse } from "next/server";
import DbConnect, { MiddleWare, generateCode, generateId, newUserValidation, sanitizeMessage, sendEmail } from "../../utils";
import NewMedicine from "../../model/product";
import Sales from "../../model/sales";
import Token from "../../model/token";
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import Morgan from 'morgan'
import User from "../../model/users";
import Branches from "../../model/branches";
import { email } from "../butchery/route";
import Butchery from "../../model/butchery";


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

//NEW MEDICINE

export const newUser=async(value)=>{

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
        ]

        const promise=await Promise.allSettled(promises)

        const data=promise.filter((res)=> res.status==='fulfilled')
        
        let userData={
            id:data[0].value,
            username:data[1].value,
            firstName:body.firstName,
            lastName:body.lastName,
            password:body.password,
            role:body.role,
            branch:body.branch,
            salary:{
              basicSalary:body.salary,
              remainingSalary:body.salary,
            },
            __v:0
        }

        if (body.role==='Administrator') {
            userData.username='000000'
        }

        const insertUser=await User.create(userData)
    
        if (!insertUser) {
            responseData.message='Invalid data'
            return responseData
        }

        const message=`
        <h3>Registration of ${body.role} ${body.firstName} ${body.lastName},</h3>
        <p>This is to notify you that this new ${body.role} have been registered successfully.</p>
        <p>Kindly provide the username below to the ne ${body.role} for the purpose of login.</p>
        <p>Username: <b>${insertUser.username}</b></p>

        <p>Kind Regards</P>
        `
        
        const subject="Cashier Registration"
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

export const getMedicineData=async(value)=>{

    let responseData={
        message:'',
        success:false,
        drugs:[]
    }

    try {
        
        let drugs=await NewMedicine.find()

        if (drugs.length>0) {
            responseData.success=true
            responseData.drugs=drugs
        }
        else{
            responseData.message='No medicine data found'
        }

        return responseData

    } catch (error) {
        console.log(error);
        responseData.message='Server error has ocurred.'      
    
        return responseData
        
    }
}

export const newSale=async(value)=>{

    let responseData={
        message:'',
        success:false
    }
  

    try {
        
        // const validate=await newMedicineValidation(value)
      
        // if (validate.error) {
        //     console.log(validate.error);
        //     responseData.message='Fill in all fields.'      
      
        //     return responseData
        // }
      
        // const body=validate.value
        const body=value
        // console.log(body);

        let isToday=await Sales.findOne({pharmacy:body[0].pharmacy})

        if (isToday) {

            // console.log(isToday.details[isToday.lastIndexDetails].moreDateDetails[isToday.lastIndexDate].moreHourDetails);
            


            body.flatMap((result)=>{

                
                let v=isToday.details[isToday.lastIndexDetails].moreDateDetails[isToday.lastIndexDate].moreHourDetails({
                    batchNumber:result.batchNumber.toUpperCase(),
                    medicineName:result.medicineName,
                    saleAmount:result.totalPrice,
                    medicineCategory:result.medicineCategory,
                    quantitySold:result.quantitySold,
                })

                console.log(v);
                
            })

            await isToday.save()

            // if (isToday.date === body[0].sellingTime.date) {
                
            //     isToday.details.flatMap((result1:any)=>{

            //         console.log(result1);
                    
                    
            //         result1.moreDateDetails.flatMap((result2:any)=>{


            //             if (isToday.hour === body[0].sellingTime.hour) {
            //             console.log(result2);
                            
            //                 body.flatMap((result:any)=>{
            //                     isToday.details[isToday.lastIndexDetails].moreDateDetails[isToday.lastIndexDate].moreHourDetails[isToday.lastIndexHour].push({
            //                         batchNumber:result.batchNumber.toUpperCase(),
            //                         medicineName:result.medicineName,
            //                         saleAmount:result.totalPrice,
            //                         medicineCategory:result.medicineCategory,
            //                         quantitySold:result.quantitySold,
            //                     })
            //                 })

            //                 isToday.save()

            //                 // return

            //             } else {
                            
            //             }
    
                        
            //         })
    
    
            //     })
                
            // } else {
                
                
            // }

            
            
        }


      
        // const promise=await Promise.allSettled(promises)
      
        // const data=promise.filter((res)=> res.status==='fulfilled') as PromiseFulfilledResult<any>[]
      
        let promises

        // body.flatMap((result:any)=>{

        //     let details=[{
        //         date:result.sellingTime.date,
        //         moreDateDetails:[{
        //             hour:result.sellingTime.hour,
        //             moreHourDetails:[{
        //                 batchNumber:result.batchNumber.toUpperCase(),
        //                 medicineName:result.medicineName,
        //                 saleAmount:result.totalPrice,
        //                 medicineCategory:result.medicineCategory,
        //                 quantitySold:result.quantitySold,
        //             }]
                    
        //         }]
        //     }]

            

        //     promises.push(
        //         Sales.create({
        //             pharmacy:result.pharmacy,
        //             date:result.sellingTime.date,
        //             hour:result.sellingTime.hour,
        //             lastIndexDate:0,
        //             lastIndexHour:0,
        //             lastIndexDetails:0,
        //             details
        //         })
        //     )


        // })

        // let b=await Promise.allSettled(promises)

        // console.log(b);
        

        // const batchNumberExist=data[0].value
        // console.log(data);
    
        // if (batchNumberExist) {
        //     responseData.message='Batch Number has already been registered'
        //     return responseData
        // }

        // let details={
        //     date:body.sellingTime.toLocaleDateString(),
        //     moreDetails:{
        //         hour:new Date(body.sellingTime).getHours(),
        //         batchNumber:body.batchNumber.toUpperCase(),
        //         medicineName:body.medicineName,
        //         saleAmount:body.totalPrice,
        //         medicineCategory:body.medicineCategory,
        //         quantitySold:body.quantitySold,
        //     }
        // }

        
    
        // const insertMedicine=await NewMedicine.create({
        //     pharmacy:body.pharmacy,
        //     medicineName:body.medicineName,
        //     costPerUnit:body.costPerUnit,
        //     dosageForm:body.dosageForm,
        //     batchNumber:body.batchNumber.toUpperCase(),
        //     expiresAt:body.expiresAt,
        //     medicineCategory:body.medicineCategory,
        //     availableQuantity:body.availableQuantity,
        //     __v:0,
        // })
    
        // if (!insertMedicine) {
        //     responseData.message='Invalid data'
        //     return responseData
        // }
    
        responseData.success=true
    
        return responseData

    } catch (error) {
        
        console.log(error);
        responseData.message='Server error has ocurred.'      
    
        return responseData
    }


    
}

// USER LOGIN

export const loginUser = async (username, password, req) => {
  
    try {
      if (!username || !password) {
        return {
          message: 'Please enter username and password',
          success: false,
        };
      }
  
      const user = await User.findOne({ username });
  
      if (!user) {
        return {
          message: 'Invalid username or password',
          success: false,
        };
      }
  
      if (user.__v === -1) {
        return {
          message: 'Invalid username or password',
          success: false,
        };
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
  
      let branch=await Branches.findOne({id:user.branch})

        let butchery=await Butchery.findOne({id:branch.butchery})
  
      if (validPassword) {
        if (!butchery.verified) {
          return {
            message: 'Email not verified. Please verify your business email address',
            success: false,
          };
        }
  
        if (process.env.NODE_ENV === 'production') {
          // loginDetails(req, pharmacy.id, pharmacy.email, pharmacy.pharmacy);
        }

        
        let access = true;
  
        return {
          success: true,
          user,
          butchery,
          access,
          branch
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
};
  
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


  export const verifyEmail=async(token)=>{

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

        let butchery=await Butchery.findOne({id:butcheryToken.butchery})

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

export const forgotPassword = async (body) => {

  let responseData={
    message:'',
    success:false
  }

  try {

    const { email } = body;
    const pharmacy = await Pharmacy.findOne({ email });

    if (!pharmacy) {
      responseData.message='Invalid Username.'      
      return responseData
    }

    // Delete existing token for the user from DB if it exists
    await Token.deleteMany({ pharmacy: pharmacy.id });

    // Generate a random token and hash it before saving to DB
    const resetToken = crypto.randomBytes(8).toString("hex").toUpperCase();
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest('hex');

    // console.log(resetToken);
    // Save the new token to DB
    await Token.create({
      pharmacy: pharmacy.id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * (60 * 1000) // 5 minutes
    });

    // Email the reset token to the user
    const message = `
      <h2>Hello ${pharmacy.pharmacy}</h2>
      <p>You requested a password reset.</p>
      <p>Please use the code below to reset your password.</p>
      <p>The reset code is valid for only 5 minutes.</p><br />
      <p>${resetToken}</p><br />
      <p>Kind Regards</P>
    `;
    const subject = "Password Reset Request";
    const send_to = pharmacy.email;
    const sent_from = process.env.EMAIL_USER;

    try {

        const sanitizedMessage = await sanitizeMessage(message);

      sendEmail(subject, sanitizedMessage, send_to, sent_from);

      responseData.message='Password reset code sent to your email.'      
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

// CHECK PASSWORD CODE

export const checkResetPasswordCode = async (body) => {
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
        user: user.id,
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

export const resetPassword = async (body) => {

  let responseData={
    message:'',
    success:false
  }

  try {

    const { password, username } = body;

    // Find user by memberNumber
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      responseData.message='User not found, please sign up.'      
      return responseData
    }
    
    let branch=await Branches.findOne({id:user.branch})

    let butchery=await Butchery.findOne({id:branch.butchery})
  
    user.password = password;
    await user.save();

    const message = `
      <h2>Hello ${user.user.firstName} ${user.user.firstName},</h2>
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