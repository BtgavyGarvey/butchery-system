'use client'

import { useRouter } from "next/navigation"
import React from "react"
import toast, {Toaster} from 'react-hot-toast'
import { checkResetPasswordCode, forgotPassword, resetPassword } from "../../src/app/api/v1/controller/user/route";

let initialState = {
    password: "",
    username:"",
    confirmPassword:"",
    code:"",
};

export default function ForgotPasswordPage(){

    const router=useRouter()
    let toastId

    const [formData, setFormData] = React.useState(initialState);


    const emailDiv=React.useRef(null)
    const codeDiv=React.useRef(null)
    const passwordDiv=React.useRef(null)
    const sendCodeBtn=React.useRef(null)
    const confirmCodeBtn=React.useRef(null)
    const resetPassBtn=React.useRef(null)

    
    const sendCode=async()=>{

        if (formData.username.trim() !=="") {

            try {
                toastId=toast.loading('Please wait. Loading...',{
                    id:toastId
                })

                const response=await forgotPassword(formData)
                toast.dismiss(toastId)
                if (response.success) {
                    toast.success(response.message)
                    if (emailDiv.current) emailDiv.current.style.pointerEvents='none'
                    if (codeDiv.current) codeDiv.current.style.display='block'
                    if (confirmCodeBtn.current) confirmCodeBtn.current.style.display='block'
                    if (sendCodeBtn.current) sendCodeBtn.current.style.display='none'
                }
                else{
                    toast.error(response.message,{
                        id:toastId
                    })
                }
            } catch (error) {
                console.log(error);
            }
            
        } else {
            toastId=toast.error('Please enter username',{
                id:toastId
            })
        }

    }

    const confirmCode=async()=>{

        if (formData.code.trim() !=="") {

            const data={
                code:formData.code,
                email:formData.email
            }

            try {
                toastId=toast.loading('Please wait. Loading...',{
                    id:toastId
                })

                const response=await checkResetPasswordCode(data)
                toast.dismiss(toastId)
                if (response.success) {
                    if (codeDiv.current) codeDiv.current.style.pointerEvents='none'
                    if (passwordDiv.current) passwordDiv.current.style.display='block'
                    if (resetPassBtn.current) resetPassBtn.current.style.display='block'
                    if (confirmCodeBtn.current) confirmCodeBtn.current.style.display='none'
                }
                else{
                    toast.error(response.message,{
                        id:toastId
                    })
                }
            } catch (error) {
                console.log(error);
            }
            
        } else {
            toastId=toast.error('Please enter confirmation code',{
                id:toastId
            })
        }
    }

    const handleInputChange = (e) => {
        
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const resetPass=async(e)=>{

        e.preventDefault()
        
        if (formData.password.trim() !=="") {

            if ((formData.password).length<8) {
                toastId=toast.error(`Password must be atleast 8 characters`,{
                    id:toastId
                })
                return
                
            }

            if (formData.confirmPassword.trim() !=="") {

                if (formData.password===formData.confirmPassword) {

                    try {
                        toastId=toast.loading('Please wait. Loading...',{
                            id:toastId
                        })
        
                        const response=await resetPassword(formData)
                        toast.dismiss(toastId)
                        if (response.success) {
                            toast.success(response.message,{
                                id:toastId
                            })
                            router.push('/login')
                        }
                        else{
                            toast.error(response.message,{
                                id:toastId
                            })
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    toast.error(`Password don't match`,{
                        id:toastId
                    })
                }
            
            } else {
                toastId=toast.error('Please confirm your password',{
                id:toastId
            })
            }
            
        } else {
            toastId=toast.error('Please enter new password',{
                id:toastId
            })
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
            <div className="container py-3 ">
                <div className="row d-flex justify-content-center align-items-center">
                <div className="col-12 col-md-8 col-lg-6 col-xl-6">
                    <div className="card bg-dark text-white" style={{borderRadius: "1rem"}}>
                    <div><a href="/"><button
                        class="btn-close text-center border rounded-circle border-2 border-light shadow-sm bounce animated"
                        type="button" aria-label="Close"></button></a>
                    </div>
                    <div className="card-body p-2 text-center">

                        <div className="mb-md-5 mt-md-4 pb-3">

                        <div className="logo mb-md-5 mt-md-4 pb-3">
                            <h1 className="logo-caption fw-bold"><span className="tweak">B</span>utchery <span className="tweak">S</span>ystem</h1>
                        </div>

                        <h2 className="fw-bold mb-3 text-uppercase text-warning">Reset Password</h2>
                        <p className="text-white-50 mb-5">Please enter your username to proceed!</p>

                        <div ref={emailDiv} className="form-outline form-white mb-4">
                            <input type="text" name="username" className="form-control form-control-lg" 
                            onChange={handleInputChange}
                            required
                            />
                            <label className="form-label" >Username</label>
                        </div>

                        <div ref={codeDiv} className="form-outline form-white mb-4 dblock">
                            <input type="text" name="code" className="form-control form-control-lg" 
                            onChange={handleInputChange}
                            required
                            />
                            <label className="form-label" >Confirmation Code</label>
                        </div>

                        <div ref={passwordDiv} className="dblock">
                            <div className="form-outline form-white mb-4">
                                <input type="password" name="password" className="form-control form-control-lg" 
                                onChange={handleInputChange}
                                required
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title='Must contain at least one number an one uppercase and lowercase letter, and at least 8 or more characters'
                                />
                                <label className="form-label">New Password</label>
                            </div>

                            <div className="form-outline form-white mb-4">
                                <input type="password" name="confirmPassword" className="form-control form-control-lg" 
                                onChange={handleInputChange}
                                autoComplete='new-password'
                                required
                                />
                                <label className="form-label">Confirm Password</label>
                            </div>
                        </div>

                        <div ref={sendCodeBtn}>
                            <button className="btn btn-outline-light btn-lg px-5" type="button" onClick={sendCode}>Request Code</button>
                        </div>
                        <div ref={confirmCodeBtn} className="dblock">
                            <button className="btn btn-outline-light btn-lg px-5" type="button" onClick={confirmCode}>Confirm Code</button>
                        </div>
                        <div ref={resetPassBtn} className="dblock">
                            <button className="btn btn-outline-light btn-lg px-5" type="button" onClick={resetPass}>Reset Password</button>
                        </div>

                        </div>

                        <div>
                        <p className="mb-0"><a href="/login" className="text-white-50 fw-bold">Sign In</a>
                        </p>
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