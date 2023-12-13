'use client'
import React, { useEffect } from "react";
import { useRouter } from "next/navigation"
import toast, {Toaster} from 'react-hot-toast'
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { Country,State,City } from 'country-state-city'
import { newButchery } from "../../src/app/api/v1/controller/butchery/route";


let initialState = {
    password: "",
    email:"",
    confirmPassword:"",
    firstName:"",
    lastName:"",
    country:"",
    phoneCode:"",
    isoCode:"",
    region:"",
    branch:"",
    mobile:"",
    terms:false,
    role:'Employer',
    subscription:0,
    name:''
};
 
export default function RegisterPage() {

    let toastId

    const termsCheckBox=React.useRef()

    const [formData, setFormData] = React.useState(initialState);
    const [Cities, setCity]=React.useState(null)
    const [Countries, setCountries]=React.useState(null)

    React.useEffect(()=>{
        let countryData=Country.getAllCountries()
        let country=Country.getCountryByCode('KE')
        setCountries(countryData)
        let cityData=City.getCitiesOfCountry('KE')
        setCity(cityData)
        formData.country=country.name
        formData.isoCode=country.isoCode
        formData.phoneCode='+'+country.phonecode

    },[])

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

    const handleInputChange1 = async (e) => {
        const { name, value } =await e.target;

        if (name==='country' && value !=='') {

            let cityData=City.getCitiesOfCountry(value)
            let countryData=Country.getCountryByCode(value)

            setCity(cityData)
            formData.country=countryData.name
            formData.isoCode=countryData.isoCode
            formData.phoneCode='+'+countryData.phonecode

        }
        else if(name==='country' && value ===''){
            setCity(null)
            formData.city=''
        }

    }

    console.log(formData);

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
            !formData.phoneCode || 
            !formData.isoCode
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

                response=await newButchery(formData)

                // response=await axios.post('/api/v1/controller/butchery?action=newButchery',formData)
                toast.dismiss(toastId)

                if (response.success) {
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
                    color:'white'
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

      <div class="container">
        <div class="card shadow-lg o-hidden border-0 my-5">
            <div >
            <div><a class="text-center" href="/"><button
                class="btn-close fw-bolder text-dark text-center border rounded-circle border-2 border-secondary shadow-sm bounce animated"
                type="button" aria-label="Close"></button></a>
            </div>
            {/* <div className="logo mb-md-5 ">
                <h1 className="logo-caption fw-bold"><span className="tweak">B</span>utchery <span className="tweak">S</span>ystem</h1>
            </div> */}
            </div>
        
            <div class="card-body p-0">
                <div class="row">
                    {/* <div class="col-lg-5 d-none d-lg-flex">
                        <div class="flex-grow-1 bg-register-image"
                            style="background-image: url(&quot;/assets/img/dogs/image2.jpeg?h=a0a7d00bcd8e4f84f4d8ce636a8f94d4&quot;);">
                        </div>
                    </div> */}
                    <div class="col-lg-12">
                        <div class="p-1">

                            <div className="logo text-center mb-md-5 mt-md-4 pb-3">
                                <h1 className="logo-caption fw-bold"><span className="tweak">B</span>utchery <span className="tweak">S</span>ystem</h1>
                            </div>
                            
                            <div class="text-center">
                                <h2 class="text-capitalize fw-bolder text-center text-success flash animated mb-4">
                                    Registration</h2>
                                <h4 class="fw-bolder text-center text-dark pulse animated mb-4">Owner Details</h4>
                            </div>
                            <form class="user" onSubmit={onSubmit}>
                                <div class="row mb-3">
                                    <div class="col-sm-6 mb-3 mb-sm-0"><label class="form-label">First
                                            Name</label><input
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-control form-control-lg bounce animated"
                                            type="text" required autofocus="" placeholder="First Name" name="firstName" onChange={handleInputChange} minLength={3}/></div>
                                    <div class="col-sm-6"><label class="form-label">Last Name</label><input
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-secondary form-control form-control-lg bounce animated"
                                            type="text" placeholder="Last Name"  name="lastName" onChange={handleInputChange} required minLength={3}/></div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-sm-6 mb-3 mb-sm-0"><label class="form-label">Password</label><input
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-control form-control-lg bounce animated"
                                            type="password"  required placeholder="New Password" name="password" onChange={handleInputChange} min={8}/>
                                    </div>
                                    <div class="col-sm-6"><label class="form-label">Confirm Password</label><input
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring form-control form-control-lg bounce animated"
                                            type="password" placeholder="Confirm Password"
                                            required name="confirmPassword" onChange={handleInputChange}/></div>
                                </div>
                                <div class="mb-3">
                                    <h4 class="fw-bolder text-center text-dark pulse animated mb-4">Butchery Details
                                    </h4>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-sm-6 mb-3 mb-sm-0"><label class="form-label">Butchery Name</label>
                                        <div
                                            class="input-group input-group-lg focus-ring focus-ring-info bounce animated">
                                            <input
                                                class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-control form-control-lg"
                                                type="text" placeholder="e.g., MyButchery" required minLength={3} name="name" onChange={handleInputChange}/><span
                                                class="border rounded-pill border-2 border-primary shadow-sm input-group-text">Butchery</span>
                                        </div>
                                    </div>
                                    <div class="col-sm-6"><label class="form-label">Email Address</label><input
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-control form-control-lg bounce animated"
                                            type="email" required name="email" onChange={handleInputChange} /></div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-sm-6 mb-3 mb-sm-0"><label class="form-label">Phone
                                            Number</label><input
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-control form-control-lg bounce animated"
                                            type="tel" minLength={10} maxLength={10} placeholder="Phone Number" required name="mobile" onChange={handleInputChange}/></div>
                                    <div class="col-sm-6"><label class="form-label">Estate/Branch</label><input
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-control form-control-lg bounce animated"
                                            type="text" required placeholder="Main Branch" name="branch" minLength={3} onChange={handleInputChange}/></div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-sm-6 mb-3 mb-sm-0"><label class="form-label">Country</label><select
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-select form-select-lg bounce animated"
                                            required name="country" onChange={handleInputChange1}>
                                            <option value="KE">Kenya</option>
                                            {
                                                Countries &&(
                                                    renderCountries(1)
                                                )
                                            }
                                        </select></div>
                                    <div class="col-sm-6"><label class="form-label">Region</label><select
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-select form-select-lg bounce animated"
                                            required name="region" onChange={handleInputChange}>
                                            <option value="">Choose City</option>
                                            {
                                                Cities &&(
                                                    renderCountries(2)
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div className="col-sm-12 m-2">
                                            <input ref={termsCheckBox} type="checkbox" onChange={handleInputChange} required name="terms" className="checkbox"></input> By checking this checkbox, you have 
                                            agreed to our <a href='#' className='fw-bold text-primary'>Terms and conditions</a>
                                    </div>
                                </div><button
                                    class="btn btn-primary bg-primary fw-bolder text-center d-block rubberBand animated btn-user w-100"
                                    type="submit">Register Butchery</button>
                                <hr />
                            </form>
                            
                            <div class="text-center">
                            <p className="mb-0">Have an account? <a href="/login" className="text-primary-50 fw-bold text-decoration-none">Sign In</a>
                        </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
      </>
    )
  }
  