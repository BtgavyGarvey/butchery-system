'use client'

import React from "react";
import {signIn} from 'next-auth/react'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from "next/navigation";


let initialState = {
    password: "",
    username:"",
};

export default function LoginPage(){

    const [formData, setFormData] = React.useState(initialState);
    let toastId

    const router=useRouter()

    const validate=async()=>{

        if(!formData.username){
            toast.error("Username is required",{
                id:toastId
            })
            return false
        }

        if(!formData.password){
            toast.error("Password is required",{
                id:toastId
            })
            return false
        }

        return true
    }

    const handleInputChange = (e) => {
        // if(e.target.files){
        //     setState({...state,[e.target.name]:e.target.files[0]})

        // }
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const login = async (e) => {

        e.preventDefault()

        const valid=await validate()

        if (valid) {
            toastId=toast.loading('Loading, please wait...',{
                id:toastId
            })

            let info=await signIn('credentials',{
                username:formData.username,
                password:formData.password,
                redirect:false
            })
            toast.dismiss(toastId)
        
            if ((info && !info.ok)) {
                toastId=toast.error(info.error,{
                    id:toastId
                })
            }
            else{
                router.push('/sc/dashboard')
            }

        }
        
    };

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
                    
                    <div className="card-body p-3 text-center">

                        <div className="mb-md-5 mt-md-4 pb-3">
                        <form onSubmit={login}>

                        <div className="logo mb-md-5 mt-md-4 pb-3">
                            <h1 className="logo-caption fw-bold"><span className="tweak">B</span>utchery <span className="tweak">S</span>ystem</h1>
                        </div>

                        <h2 className="fw-bold mb-3 text-uppercase text-warning">Login</h2>
                        <p className="text-white-50 mb-5">Please enter your username and password!</p>


                        <div className="form-outline form-white mb-4">
                            <input type="text" name="username" className="form-control form-control-lg" 
                            onChange={handleInputChange}
                            autoFocus
                            autoComplete='false' 
                            />
                            <label className="form-label" >Username</label>
                        </div>

                        <div className="form-outline form-white mb-4">
                            <input type="password" name="password" className="form-control form-control-lg" 
                            onChange={handleInputChange}
                            autoFocus
                            autoComplete='false'
                            />
                            <label className="form-label">Password</label>
                        </div>

                        <p className="small mb-5 pb-lg-2"><a className="text-white-50" href="/resetpassword">Forgot password?</a></p>

                        <button className="btn btn-outline-light btn-lg px-5" type="submit">Login</button>

                        </form>

                        </div>

                        <div>
                        <p className="mb-0">Don't have an account? <a href="/register" className="text-white-50 fw-bold">Sign Up</a>
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