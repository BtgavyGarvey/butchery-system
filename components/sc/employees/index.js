'use client'

import React from "react";
import Footer from "../../layout/footer";
import Header from "../../layout/header";
import NavBar from "../../layout/navbar";
import { Country, City } from "country-state-city";

let initialState = {
    password: "",
    email:"",
    confirmPassword:"",
    firstName:"",
    lastName:"",
    country:"",
    countryCode:"",
    region:"",
    branch:"",
    mobile:"",
    terms:false,
    role:'Employer',
    subscription:0,
    name:''
};

export default function NewEmployeePage() {

    let toastId

    const termsCheckBox=React.useRef()

    const [formData, setFormData] = React.useState(initialState);
    const [Cities, setCity]=React.useState(null)
    const [Countries, setCountries]=React.useState(null)

    const handleInputChange = (e) => {
        
        const { name, value } = e.target;

        if (name==='terms') {

            if (termsCheckBox.current.checked) {
                formData.terms=true  
            } else {
                formData.terms=false  

            }
        }
        else{
          setFormData({ ...formData, [name]: value });

        }
    };

    const validate=async()=>{

        if(
            !formData.firstName || 
            !formData.lastName || 
            !formData.country ||
            !formData.branch ||
            !formData.region ||
            !formData.email ||
            !formData.mobile ||
            !formData.terms ||
            !formData.confirmPassword ||
            !formData.password || 
            !formData.name || 
            !formData.countryCode
            ){
                toastId=toast.error('Please fill all required fields',{id:toastId})

            return false
        }

        if(
            !formData.email.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
            ){
                toastId=toast.error('Please enter a valid email address',{id:toastId})
                return false
        }

        if (formData.password !== formData.confirmPassword) {
            toastId=toast.error(`Password don't match`,{id:toastId})

            return false
        }

        if (isNaN(formData.mobile)) {
            toastId=toast.error('Invalid phone number',{id:toastId})

            return false
        }

        return true
        
    }

    const renderCountries=(num)=>{

        const result1=[]
        const result2=[]

        if (num===1) {
            for (let i = 0; i < Countries.length; i++) {
            
                result1.push(
                    <option key={'a'+i} value={Countries[i].isoCode}>{Countries[i].name}</option>
    
                )
                
            }
    
            return result1
        }
        else{
            for (let i = 0; i < Cities.length; i++) {
            
                result2.push(
                    <option key={'b'+i} value={Cities[i].name}>{Cities[i].name}</option>
    
                )
                
            }
    
            return result2
        }


        
    }

    const onSubmit=async(e)=>{

        e.preventDefault()
        var isValid=await validate()

        try {

            let response

            if (isValid) {
                toastId=toast.loading('Loading, please wait...')

                response=await axios.post('/api/v1/controller/butchery?action=newButchery',formData)
                toast.dismiss(toastId)

                if (response.data.success===true) {
                    toast.success(`Successful!`,{id:toastId})
                }
                else{
                    toast.error(`Failed! ${response.data.message}`,{id:toastId})
                }
            }

        } catch (error) {
            console.log(error)
        }

    }

  return (
    <>
    <div id="wrapper" className="bg-light">
        <NavBar />
        <div class="d-flex flex-column" id="content-wrapper">
            <div id="content">
                <Header />
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
                                            type="number" autocomplete="off" required placeholder="0712345678" name="mobile" onChange={handleInputChange} minLength={10}/>
                                    </div>

                                    <div class="col-sm-6 mb-3 mb-sm-0"><label class="form-label">National ID/Passport</label><input
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-control form-control-lg bounce animated"
                                            type="number" autocomplete="off" required placeholder="National ID" name="nationalID" onChange={handleInputChange}/>
                                    </div>
                                    
                                </div>
                                
                                <button
                                    class="btn btn-primary fw-bolder text-center d-block rubberBand animated btn-user w-100"
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