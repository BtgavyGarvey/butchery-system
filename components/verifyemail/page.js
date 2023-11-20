'use client'

import React from "react";
import {signIn} from 'next-auth/react'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";


export default function VerifyEmailPage(){

    let toastId

    const searchParams=useSearchParams()
    const token=searchParams.get('token')

    const router=useRouter()

    const emailVerify=async()=>{

        try {

            toastId=toast.loading('Please wait, Loading...',{id:toastId})
            const response=await axios.patch(`/api/v1/controller/user?action=verifyemail&token=${token}`)
            toast.dismiss(toastId)
            console.log(response);
            
            if (response.data.success) {
                toast.success('Verification Successful',{id:toastId})
                router.push('/sc/login')
            }
            else{
                toast.error('Failed! '+response.data.message,{id:toastId})

            }
            
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <>
        <Toaster 

        toastOptions={{
            success:{
                style:{
                    background:'green',
                    color:'white',
                }
            },
            error:{
                style:{
                    background:'red',
                    color:'white'
                }
            },
            
        }}

        >
        </Toaster>
        <section className="gradient-custom">
            <div className="container py-5 ">
                <div className="row d-flex justify-content-center align-items-center">
                <div className="col-12 col-md-8 col-lg-6 col-xl-6">
                    <div className="card bg-dark text-white" style={{borderRadius: "1rem"}}>
                    <div className="card-body p-3 text-center">

                        <div className="mb-md-5 mt-md-4 pb-5">

                        <div className="logo mb-md-5 mt-md-4 pb-5">
                            <h1 className="logo-caption fw-bold"><span className="tweak">B</span>utchery <span className="tweak">S</span>ystem</h1>
                        </div>

                        <h2 className="fw-bold mb-3 text-uppercase text-warning">Email Verification</h2>
                        <p className="text-white-50 mb-5">By verifying your email means that you have <span className="fw-bold text-success">agreed </span> to our <span className="text-danger fw-bold"><a href="/termsandconditionsandprivacypolicy" target="_blank">terms & conditions.</a></span></p>


                        <div className="form-outline form-white mb-4">
                            <button className="btn btn-outline-light btn-lg px-5" type="button" onClick={emailVerify}>Verify Email</button>
                        </div>

                        </div>

                    </div>
                    </div>
                </div>
                </div>
            </div>
        </section>

        </>
    )
}