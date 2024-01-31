'use server'

import request from "request";
import { NextResponse } from "next/server";

// export const accessToken = ()=> {
//     try{

//         const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
//         const auth = new Buffer.from(`${process.env.SAFARICOM_CONSUMER_KEY}:${process.env.SAFARICOM_CONSUMER_SECRET}`).toString('base64');

//         request(
//             {
//                 url: url,
//                 headers: {
//                     "Authorization": "Basic " + auth
//                 }
//             },
//             (error,response,body) => {

//                 console.log(body);
//                 if (error) {
//                     NextResponse.json({
//                         "message": 'Something went wrong when trying to process your payment',
//                         "error":error.message
//                     })
//                 }
//                 else {
//                     return 
//                     req.safaricom_access_token = JSON.parse(body).access_token
//                     next()
//                 }
//             }
//         )
//     }catch (error) {

//         console.error("Access token error ", error)
//         NextResponse.json({
//             "message": 'Something went wrong when trying to process your payment',
//             "error":error.message
//         })
//     }

// }

import axios from 'axios';

export async function accessToken() {

  const auth = new Buffer(`${process.env.SAFARICOM_CONSUMER_KEY}:${process.env.SAFARICOM_CONSUMER_SECRET}`).toString('base64');

  try {
    const response =await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`
      }
    });

    console.log(response);

    NextResponse.json({ token: response.data.access_token });
  } catch (error) {
    NextResponse.json(error.response?.data || {});
  }
}



