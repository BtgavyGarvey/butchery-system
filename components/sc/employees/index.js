'use client'

import React from "react";
import Footer from "../../layout/footer";
import Header from "../../layout/header";
import NavBar from "../../layout/navbar";
import { Country, City } from "country-state-city";
import toast, { Toaster } from "react-hot-toast";
import { newUser } from "../../../src/app/api/v1/controller/user/route";
import { getBranches } from "../../../src/app/api/v1/controller/butchery/route";

let initialState = {
    firstName:"",
    lastName:"",
    branch:"",
    mobile:"",
    nationalId:"",
    password:"0",
    salary:"",
    role:'Employee',
};

export default function NewEmployeePage({session}) {

    let toastId

    const [formData, setFormData] = React.useState(initialState);
    const [Branches, setBranches] = React.useState([]);

    React.useEffect(()=>{
        myBranches()
    },[])

    const myBranches=async()=>{

        let response=await getBranches(session)

        setBranches(response.branches)

    }

    const handleInputChange = (e) => {
        
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

    };

    const validate=async()=>{

        if(
            !formData.firstName || 
            !formData.lastName || 
            !formData.branch ||
            !formData.nationalId ||
            !formData.salary ||
            !formData.mobile
            ){
                toastId=toast.error('Please fill all required fields',{id:toastId})

            return false
        }

        if (isNaN(formData.nationalId)) {
            toastId=toast.error(`Invalid National ID`,{id:toastId})

            return false
        }

        if (isNaN(formData.mobile)) {
            toastId=toast.error('Invalid phone number',{id:toastId})

            return false
        }

        return true
        
    }

    const onSubmit=async(e)=>{

        e.preventDefault()
        var isValid=await validate()

        try {

            let response

            if (isValid) {

                toastId=toast.loading('Loading, please wait...')

                response=await newUser(formData)
                toast.dismiss(toastId)

                if (response.success===true) {
                    toast.success(`Successful!`,{id:toastId})
                }
                else{
                    toast.error(`Failed! ${response.message}`,{id:toastId})
                }
            }

        } catch (error) {
            console.log(error)
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
    <div id="wrapper" className="bg-light">
        <NavBar session={session.user}/>
        <div class="d-flex flex-column" id="content-wrapper">
            <div id="content">
                <Header session={session.user}/>
                <div class="container-fluid">
                    <h1
                        class="font-monospace text-uppercase fw-bolder text-center text-light bg-success bg-gradient border-2 border-secondary shadow-sm mb-4">
                        New Employee</h1>
                        <div class="card-body p-0">
                <div class="row">
                    
                    <div class="col-lg-12">
                        <div class="p-5">
                            
                            <form class="user" onSubmit={onSubmit}>
                                <div class="row mb-3">
                                    <div class="col-sm-6 mb-3 mb-sm-0"><label class="form-label">First
                                            Name</label><input
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-control form-control-lg bounce animated"
                                            type="text" required autofocus="" placeholder="First Name" name="firstName" onChange={handleInputChange} minLength={3}/></div>
                                    <div class="col-sm-6"><label class="form-label">Last Name</label><input
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-secondary form-control form-control-lg bounce animated"
                                            type="text" placeholder="Last Name" autocomplete="off" name="lastName" onChange={handleInputChange} required minLength={3}/></div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-sm-6 mb-3 mb-sm-0"><label class="form-label">Phone Number</label><input
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-control form-control-lg bounce animated"
                                            type="text" autocomplete="off" required placeholder="0712345678" name="mobile" onChange={handleInputChange} minLength={10}/>
                                    </div>

                                    <div class="col-sm-6 mb-3 mb-sm-0"><label class="form-label">National ID/Passport</label><input
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-control form-control-lg bounce animated"
                                            type="text" autocomplete="off" required placeholder="National ID" name="nationalId" onChange={handleInputChange}/>
                                    </div>
                                    
                                </div>

                                <div class="row mb-3">
                                    <div class="col-sm-6 mb-3 mb-sm-0"><label class="form-label">Salary</label><input
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-control form-control-lg bounce animated"
                                            type="text" autocomplete="off" required placeholder="Salary" name="salary" onChange={handleInputChange}/>
                                    </div>
                                    <div class="col-sm-6 mb-3 mb-sm-0"><label class="form-label">Branch</label><select
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-select form-select-lg bounce animated"
                                            autocomplete="off" required name="branch" onChange={handleInputChange} >
                                                <option></option>
                                                {
                                                    Branches.map((result)=>{
                                                        return (
                                                            <>
                                                                <option value={result.id}>{result.name}</option>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </select>
                                    </div>

                                </div>
                                
                                <button
                                    class="btn btn-primary bg-primary fw-bolder text-center d-block rubberBand animated btn-user w-100"
                                    type="submit">Register Employee</button>
                                <hr />
                            </form>
                            
                        </div>
                    </div>
                </div>
            </div>
                </div>
            </div>
            <Footer />
        </div>
        {/* <a class="border rounded d-inline scroll-to-top" href="#page-top"><i class="fas fa-angle-up"></i></a> */}
    </div>
    </>
  )
}