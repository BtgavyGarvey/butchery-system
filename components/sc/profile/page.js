'use client'

import NavBar from "../../layout/navbar"
import Header from "../../layout/header"
import Footer from "../../layout/footer"
import { editButcheryProfile, generateUniqueBranchId, getButcheryProfile, newBranch, openCloseShop } from "../../../src/app/api/v1/controller/butchery/route"
import React from 'react'
import { AddDate, DateOnly, DayTime } from "../../layout/utils"
import { City, Country } from 'country-state-city'
import toast, { Toaster } from "react-hot-toast"

let initialState={
    id:'',
    name:'',
    region:'',
    butchery:'',
    package:2,
    expiryDate:'',
    mobile:''
}

export default function ProfilePage({session}) {

    const today = new Date();
    const modalRef2=React.useRef()
    const modalRef1=React.useRef()
    let toastId

    const [Branches,setBranches]=React.useState([])
    const [OneBranches,setOneBranches]=React.useState()
    const [Butchery,setButchery]=React.useState()
    const [Name,setName]=React.useState()
    const [Cities, setCity]=React.useState(null)
    const [formData, setFormData]=React.useState(initialState)

    formData.butchery=Butchery?.id

    const getProfile =async()=>{
        toastId=toast.loading('Please wait. Loading...',{
            id:toastId
        })
        
        let serverData=await getButcheryProfile(session)
        setBranches(serverData.branches)
        setButchery(serverData.butchery)
        setName(serverData.userData)

        let cityData=City.getCitiesOfCountry(serverData.butchery.country.isoCode ? serverData.butchery.country.isoCode : 'KE')
        toast.dismiss(toastId)

        setCity(cityData)
    }

    React.useEffect(()=>{
        getProfile()
        modalRef1.current.style.display='none'
        modalRef2.current.style.display='none'


    },[session])

    const showModal=(val)=>{

        if (val===1) {
            modalRef1.current.style.display='block'
            
        } else {
            modalRef2.current.style.display='block'
            
        }
    }

    const hideModal=()=>{
        modalRef1.current.style.display='none'
        modalRef2.current.style.display='none'
    }

    const renderCountries=()=>{

        const result1=[]
        
        for (let i = 0; i < Cities.length; i++) {
        
            result1.push(
                <option key={'b'+i} value={Cities[i].name}>{Cities[i].name}</option>

            )
            
        }

        return result1


        
    }

    const handleInputChangeButchery = (e) => {
        
        const { name, value } = e.target;

        setButchery({ ...Butchery, [name]: value });
    };

    const handleInputChangeProfile = (e) => {
        
        const { name, value } = e.target;
        setName({ ...Name, [name]: value });
    };

    const handleInputChangeBranch = (e) => {
        const { name, value } = e.target;
        
        setOneBranches({ ...OneBranches, [name]: value });

    };

    const handleInputChangeNew = (e) => {
        
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // console.log(Branches);
    // console.log(Butchery);

    const renderBranches=()=>{

        let result=[]

        // if (Branches.length>1) {
            Branches.map((branch, key)=>{
                result.push(
                    <>
                    <div class="row">
                                <div class="col offset-sm-2">
                                    <div class="card">
                                        <div class="card-header">
                                            <h5 class="text-capitalize fw-bolder text-center text-primary mb-0">
                                                <strong><span className="text-success"><span className="text-danger">{key+1}.</span> {branch.name} Branch</span></strong>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col offset-sm-2 p-2">
                                    <form className="border-1 border-success shadow">
                                        <div class="row">
                                            <div class="col-sm-6 text-dark"><label class="form-label"
                                                    style={{margin: "8px"}}><strong><span
                                                            >Branch
                                                            Name</span></strong></label><input value={branch?.name}
                                                    class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-control form-control-lg bounce animated"
                                                    type="text" autocomplete="off" required  name="name" disabled/>
                                            </div>
                                            <div class="col-sm-6 text-dark">
                                                <label class="form-label"
                                                    style={{margin: "8px"}}><strong><span >Phone
                                                            Number</span></strong></label><input value={branch?.mobile}
                                                    class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-control form-control-lg bounce animated"
                                                    type="tel" autocomplete="off" required name="mobile" disabled/>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-6 text-dark"><label class="form-label"
                                                    style={{margin: "8px"}}><strong><span
                                                            >Branch
                                                            Region</span></strong></label><select
                                                    class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-select form-select-lg bounce animated"
                                                    required name="region" disabled>
                                                    <option value={branch?.region}>{branch?.region}</option>
                                                    {
                                                        Cities &&(
                                                            renderCountries()
                                                        )
                                                    }
                                                </select>
                                            </div>
                                            <div class="col-sm-6 text-dark">
                                                <label class="form-label"
                                                    style={{margin: "8px"}}><strong><span >Register
                                                            Date</span></strong></label><input value={DateOnly(branch?.createdAt)}
                                                    class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-control form-control-lg bounce animated"
                                                    autocomplete="off" required disabled/>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-sm-6 text-dark">
                                                <label class="form-label"
                                                    style={{margin: "8px"}}><strong><span
                                                            >Subscription
                                                            Package</span></strong></label>
                                                <input value={branch?.subscription[0].package === 1 ? 'Basic' : 'Premium'}
                                                    class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-control form-control-lg bounce animated"
                                                    autocomplete="off" required disabled/>
                                            </div>
                                            <div class="col-sm-6 text-dark">
                                                <label class="form-label"
                                                    style={{margin: "8px"}}><strong><span >Expiry
                                                            Date</span></strong></label><input value={DateOnly(branch?.subscription[0].expiryDate)}
                                                    class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-control form-control-lg bounce animated"
                                                    autocomplete="off" required disabled/>
                                            </div>
                                        </div>
                                        
                                        <div class="row">
                                            <div class="col-sm-12"><button
                                                    class="btn btn-warning font-monospace text-dark text-nowrap text-truncate text-break text-uppercase fs-6 fw-bolder border rounded-pill border-2 border-danger shadow rubberBand animated"
                                                        type="button" style={{margin: "8px"}} onClick={e=>{
                                                            setOneBranches(branch)
                                                            showModal(1)
                                                        }}>Edit</button>
                                                    {
                                                        (branch?.subscription[0].expiryDate).toLocaleString() < today.toLocaleString() && (
                                                            <button
                                                            class="btn btn-secondary font-monospace text-dark text-nowrap text-truncate text-break text-uppercase fs-6 fw-bolder border rounded-pill border-2 border-danger shadow rubberBand animated"
                                                            type="button" style={{margin: "8px"}}>Subscribe</button>
                                                        )
                                                    }
                                                    
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                    </>
                )
            })
        // }

        

        return result
    }

    const newBranchClick=async()=>{

        formData.expiryDate=AddDate(today,1)
        formData.id=await generateUniqueBranchId(2)

        showModal(2)
    }

    const validate=async()=>{

        if(
            !formData.region ||
            !formData.mobile ||
            !formData.name
            ){
                toastId=toast.error('Please fill all required fields',{id:toastId})

            return false
        }

        if (isNaN(formData.mobile)) {
            toastId=toast.error('Invalid phone number',{id:toastId})

            return false
        }

        return true
        
    }

    const new_Branch=async(e)=>{

        e.preventDefault()
        var isValid=await validate()

        try {
            if (isValid) {

                toastId=toast.loading('Please wait. Loading...',{
                    id:toastId
                })

                const response=await newBranch(formData)
                toast.dismiss(toastId)
                if (response.success) {
                    toast.success('Successful')

                    getProfile()
                }
                else{
                    toast.error(response.message,{
                        id:toastId
                    })
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const editUser=async(e)=>{

        e.preventDefault()

        try {
            toastId=toast.loading('Please wait. Loading...',{
                id:toastId
            })

            const response=await editButcheryProfile(Name,1)
            toast.dismiss(toastId)
            if (response.success) {
                toast.success('Successful')

                getProfile()
            }
            else{
                toast.error(response.message,{
                    id:toastId
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const editButchery=async(e)=>{

        e.preventDefault()

        try {
            toastId=toast.loading('Please wait. Loading...',{
                id:toastId
            })

            const response=await editButcheryProfile(Butchery,2)
            toast.dismiss(toastId)
            if (response.success) {
                toast.success('Successful')

                getProfile()
            }
            else{
                toast.error(response.message,{
                    id:toastId
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const editBranch=async(e)=>{

        e.preventDefault()

        try {
            toastId=toast.loading('Please wait. Loading...',{
                id:toastId
            })

            const response=await editButcheryProfile(OneBranches,3)
            toast.dismiss(toastId)
            if (response.success) {
                toast.success('Successful')

                getProfile()
            }
            else{
                toast.error(response.message,{
                    id:toastId
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const closeOpenShop=async(val)=>{

        let answer

        if (val===1) {
            answer=confirm(`Are you sure you want to OPEN the shop? ${Butchery?.name} butchery`)
        } else {
            answer=confirm(`Are you sure you want to CLOSE the shop? ${Butchery?.name} butchery`)
        }

        let data={
            id:Butchery?.id,
            value:val
        }

        try {

            if (answer) {
                toastId=toast.loading('Please wait. Loading...',{
                    id:toastId
                })
    
                const response=await openCloseShop(data)
                toast.dismiss(toastId)
                if (response.success) {
                    toast.success('Successful')
                    getProfile()
                }
                else{
                    toast.error(response.message,{
                        id:toastId
                    })
                }
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
    <div className="bg-light">
    <div id="wrapper">
        <NavBar session={session.user}/>
        <div class="d-flex flex-column" id="content-wrapper">
            <div id="content">
                <Header session={session.user}/>
                <div class="container-fluid">
                    <h1
                        class=" font-monospace text-uppercase fw-bold text-center text-light text-bg-secondary mb-4">
                        Profile</h1>
                    <div class="row">
                        <div class="col">
                            <div class="card"></div>
                        </div>
                    </div>
                    <div class="card-body shadow d-flex justify-content-between">
                        <span className="text-dark"><span className="text-info fw-bold">NB: </span> Changes will be effective on next login.</span>
                        <span>
                            {
                                Butchery && (
                                    Butchery?.__v===1 ? (
                                        <a onClick={e=>{closeOpenShop(2)}} className="text-danger fw-bold faEdit">Close Shop</a>
                                    ):(
                                        <a onClick={e=>{closeOpenShop(1)}} className="text-success fw-bold faEdit">Open Shop</a>
                                    )
                                )
                                
                            }
                        </span>
                    </div>
                </div>
                <div></div>
                <div class="row" style={{marginBottom: "59px"}}>
                    <div class="col-sm-5 offset-sm-1 text-center m-auto" style={{marginBottom: "7px"}}>
                        <div class="row" style={{textAlign: "center"}}>
                            <div class="col">
                                <div class="card">
                                    <div class="card-header">
                                        <h3 class="text-capitalize fw-bolder text-center mb-0"><strong><span
                                                    className='text-danger'>User Settings</span></strong></h3>
                                    </div>
                                </div>
                                <form onSubmit={editUser} class="text-center border-1 border-primary shadow"
                                    style={{marginTop: "10px"}}>
                                    <div class="row" >
                                        <div class="col-sm-12 text-dark"><label class="form-label"
                                                style={{margin: "7px"}}><strong><span className="text-dark">First
                                                        Name</span></strong></label><input value={Name?.firstName}
                                                class="border rounded-pill border-1 text-dark border-success shadow-sm focus-ring focus-ring-primary form-control form-control-lg bounce animated"
                                                type="text" required onChange={handleInputChangeProfile}
                                                data-bs-theme="light" name="firstName" minLength={3}/></div>
                                        <div class="col text-dark"><label class="form-label" style={{margin: "7px"}}><strong><span
                                                        className="text-dark">Last
                                                        Name</span></strong></label><input value={Name?.lastName} minLength={3}
                                                class="border rounded-pill text-dark border-1 border-success shadow-sm focus-ring focus-ring-primary form-control form-control-lg bounce animated"
                                                type="text" required onChange={handleInputChangeProfile} data-bs-theme="light"name="lastName" /></div>
                                        <div class="col-sm-12 offset-sm-0"><button
                                                class="btn btn-primary font-monospace text-nowrap text-truncate text-break text-uppercase fs-6 fw-bolder text-center text-dark border rounded-pill border-2 border-success shadow focus-ring focus-ring-danger rubberBand animated"
                                                type="submit" style={{margin: "8px"}}><strong>SAVE</strong></button><a
                                                class="btn btn-danger font-monospace text-nowrap text-truncate text-break text-uppercase fs-6 fw-bolder text-center border rounded-pill border-2 border-info shadow focus-ring focus-ring-danger rubberBand animated"
                                                role="button" style={{margin: "8px"}} href={`/sc/profile/resetpassword?username=${Name?.username}`}
                                                target="_top"><strong>Change password</strong></a></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                <hr className="dhr"/>

                    <div class="col-sm-6 offset-sm-4 text-center m-auto p-2">
                        <div class="row">
                            <div class="col">
                                <div class="card">
                                    <div class="card-header card_header">
                                        <h3 class="text-capitalize fw-bolder text-center mb-0"><strong><span
                                                    className="text-primary">Butchery Settings</span></strong>
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <form onSubmit={editButchery} className="border-1 border-danger shadow">
                                    <div class="row">
                                        <div class="col-sm-6 text-dark"><label class="form-label"
                                                style={{margin: "8px"}}><strong><span
                                                        >Butchery
                                                        Code</span></strong></label><input value={Butchery?.code}
                                                class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-control form-control-lg bounce animated"
                                                type="text"  disabled/></div>
                                        <div class="col-sm-6 text-dark"><label class="form-label"
                                                style={{margin: "8px"}}><strong><span >Butchery Name
                                                        </span></strong></label><input value={Butchery?.name}
                                                class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-control form-control-lg bounce animated"
                                                type="text" required onChange={handleInputChangeButchery}  name="name" minLength={3}/></div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6 text-dark"><label class="form-label"
                                                style={{margin: "8px"}}><strong><span
                                                        >Butchery
                                                        Email</span></strong></label><input value={Butchery?.email}
                                                class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-control form-control-lg bounce animated"
                                                type="email"  disabled name="name"/></div>
                                        <div class="col-sm-6 text-dark"><label class="form-label"
                                                style={{margin: "8px"}}><strong><span >Phone
                                                        Number</span></strong></label><input value={Butchery?.mobile} minLength={10}
                                                class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-control form-control-lg bounce animated"
                                                type="tel" required onChange={handleInputChangeButchery}  name="mobile"/></div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6 text-dark"><label class="form-label"
                                                style={{margin: "8px"}}><strong><span
                                                        >Butchery
                                                        Country</span></strong></label><input value={Butchery?.country[0].name}
                                                class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-control form-control-lg bounce animated"
                                                type="text"  disabled name="name"/></div>
                                        <div class="col-sm-6 text-dark"><label class="form-label"
                                                style={{margin: "8px"}}><strong><span >Registration
                                                        Date</span></strong></label><input value={DateOnly(Butchery?.createdAt)}
                                                class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-control form-control-lg bounce animated"
                                                type="text" disabled  name="email"/></div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-12"><button
                                                class="btn btn-success font-monospace text-dark text-nowrap text-truncate text-break text-uppercase fs-6 fw-bolder link-light border rounded-pill border-2 border-primary shadow rubberBand animated"
                                                type="submit" style={{margin: "8px"}}>Save</button></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div class="row">
                    <div class="col-sm-8 offset-sm-6 text-center m-auto" >
                        <div class="row">
                            <div class="col offset-sm-2">
                                <div class="card">
                                    <div class="card-header">
                                        <h3 class="text-capitalize fw-bolder mb-0"><strong><span
                                                    className="text-danger">Branch Settings</span></strong></h3>
                                    </div>
                                    <div>
                                        <a onClick={newBranchClick} className="fw-bold text-primary faEdit">New Branch</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {
                            renderBranches()
                        }

                    </div>
                </div>

                <div ref={modalRef2} className="modal " role="dialog"
                        tabindex="-1" id="modal-1">
                        <div class="modal-dialog modal-md modal-dialog-centered" role="document">
                            <div class="modal-content bg-dark">
                                <div class="modal-header text-capitalize">
                                    <h2 class="modal-title fw-bolder">New Branch</h2><button class="btn-close"
                                        type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                                </div>
                                <form onSubmit={new_Branch}>
                                    <div class="modal-body">
                                    
                                        <div class="d-grid">
                                            <div class="col ">
                                                
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Branch
                                                            Name</label>
                                                            <input onChange={handleInputChangeNew}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control"
                                                             required name="name" minLength={3}/>
                                                    </div>
                                                </div>
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Branch
                                                            Mobile</label>
                                                            <input onChange={handleInputChangeNew}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control"
                                                              required name="mobile" minLength={10}/>
                                                    </div>
                                                </div>
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Branch
                                                            Region</label>
                                                            <select
                                                            class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-select form-select-lg bounce animated"
                                                            required onChange={handleInputChangeNew} name="region"> 
                                                            <option ></option>
                                                            {
                                                                Cities &&(
                                                                    renderCountries()
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        
                                        </div>
                                    </div>
                                    <div class="modal-footer"><button class="btn btn-light" type="button"
                                            data-bs-dismiss="modal" data-bs-target="#modal-1"
                                            data-bs-toggle="modal" onClick={()=>{hideModal()}}>Close</button><button class="btn btn-primary"
                                            type="submit" data-bs-target="#modal-1" data-bs-toggle="modal">Save</button>
                                    </div>
                                </form>
                                
                            </div>
                        </div>
                </div>

                <div ref={modalRef1} className="modal " role="dialog"
                        tabindex="-1" id="modal-1">
                        <div class="modal-dialog modal-md modal-dialog-centered" role="document">
                            <div class="modal-content bg-dark">
                                <div class="modal-header text-capitalize">
                                    <h2 class="modal-title fw-bolder">Edit Branch</h2><button class="btn-close"
                                        type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                                </div>
                                <form onSubmit={editBranch}>
                                    <div class="modal-body">
                                    
                                        <div class="d-grid">
                                            <div class="col ">
                                                
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Branch
                                                            Name</label>
                                                            <input onChange={handleInputChangeBranch} value={OneBranches?.name}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control"
                                                             required name="name" minLength={3}/>
                                                    </div>
                                                </div>
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Branch
                                                            Mobile</label>
                                                            <input onChange={handleInputChangeBranch} value={OneBranches?.mobile}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control"
                                                              required name="mobile" minLength={10}/>
                                                    </div>
                                                </div>
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Branch
                                                            Region</label>
                                                            <select
                                                            class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-select form-select-lg bounce animated"
                                                            required onChange={handleInputChangeBranch} name="region"> 
                                                            <option value={OneBranches?.region}>{OneBranches?.region}</option>
                                                            {
                                                                Cities &&(
                                                                    renderCountries()
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        
                                        </div>
                                    </div>
                                    <div class="modal-footer"><button class="btn btn-light" type="button"
                                            data-bs-dismiss="modal" data-bs-target="#modal-1"
                                            data-bs-toggle="modal" onClick={()=>{hideModal()}}>Close</button><button class="btn btn-primary"
                                            type="submit" data-bs-target="#modal-1" data-bs-toggle="modal">Save</button>
                                    </div>
                                </form>
                                
                            </div>
                        </div>
                </div>
            </div>
            <Footer />
        </div>
        {/* <a class="border rounded d-inline scroll-to-top" href="#page-top"><i class="fas fa-angle-up"></i></a> */}
    </div>
    </div>
    </>
  )
}
