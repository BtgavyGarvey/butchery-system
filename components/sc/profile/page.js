'use client'

import NavBar from "../../layout/navbar"
import Header from "../../layout/header"
import Footer from "../../layout/footer"
import { getButcheryProfile } from "../../../src/app/api/v1/controller/butchery/route"
import React from 'react'
import { DayTime } from "../../layout/utils"
import { City, Country } from 'country-state-city'
import toast, { Toaster } from "react-hot-toast"

export default function ProfilePage({session}) {

    const [Branches,setBranches]=React.useState([])
    const [Butchery,setButchery]=React.useState()
    const [Name,setName]=React.useState()
    const [Cities, setCity]=React.useState(null)

    const getProfile =async()=>{
        
        let serverData=await getButcheryProfile(session)
        setBranches(serverData.branches)
        setButchery(serverData.butchery)
        setName(serverData.userData)

        let cityData=City.getCitiesOfCountry(serverData.butchery.country.isoCode ? serverData.butchery.country.isoCode : 'KE')

        setCity(cityData)
    }

    React.useEffect(()=>{
        getProfile()

    },[session])

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

    const handleInputChangeBranch = (e,val) => {
        toast(val)
        console.log(e);
        const { name, value } = e.target;
        
        setBranches({ ...Branches, [name]: value });

    };

    console.log(Branches);
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
                                                <strong><span className="text-success">{branch.name} Branch</span></strong>
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
                                                            Name</span></strong></label><input value={branch?.name} onChange={(e)=>{handleInputChangeBranch(e,key)}}
                                                    class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-control form-control-lg bounce animated"
                                                    type="text" autocomplete="off" required  />
                                            </div>
                                            <div class="col-sm-6 text-dark">
                                                <label class="form-label"
                                                    style={{margin: "8px"}}><strong><span >Phone
                                                            Number</span></strong></label><input value={branch?.mobile} onChange={(e)=>{handleInputChangeBranch(e,key)}}
                                                    class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-control form-control-lg bounce animated"
                                                    type="tel" autocomplete="off" required />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-6 text-dark"><label class="form-label"
                                                    style={{margin: "8px"}}><strong><span
                                                            >Branch
                                                            Region</span></strong></label><select
                                                    class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-select form-select-lg bounce animated"
                                                    required onChange={(e)=>{handleInputChangeBranch(e,key)}}>
                                                    <option label={branch?.region}>{branch?.region}</option>
                                                    {
                                                        Cities &&(
                                                            renderCountries()
                                                        )
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        {/* <div class="row">
                                            <div class="col-sm-6 text-dark"><label class="form-label"
                                                    style={{margin: "8px"}}><strong><span
                                                            >Branch
                                                            Subscription</span></strong></label><select
                                                    class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-select form-select-lg bounce animated"
                                                    required="">
                                                    <optgroup label={branch?.region}>{branch?.subscription}</optgroup>
                                                </select></div>
                                        </div> */}
                                        <div class="row">
                                            <div class="col-sm-12"><button
                                                    class="btn btn-secondary font-monospace text-dark text-nowrap text-truncate text-break text-uppercase fs-6 fw-bolder border rounded-pill border-2 border-danger shadow rubberBand animated"
                                                    type="submit" style={{margin: "8px"}}>Save</button></div>
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
                    <div class="card shadow mb-5"></div>
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
                                <form class="text-center border-1 border-primary shadow"
                                    style={{marginTop: "10px"}}>
                                    <div class="row" >
                                        <div class="col-sm-12 text-dark"><label class="form-label"
                                                style={{margin: "7px"}}><strong><span className="text-dark">First
                                                        Name</span></strong></label><input value={Name?.firstName}
                                                class="border rounded-pill border-1 text-dark border-success shadow-sm focus-ring focus-ring-primary form-control form-control-lg bounce animated"
                                                type="text" required onChange={handleInputChangeProfile}
                                                data-bs-theme="light" name="firstName"/></div>
                                        <div class="col text-dark"><label class="form-label" style={{margin: "7px"}}><strong><span
                                                        className="text-dark">Last
                                                        Name</span></strong></label><input value={Name?.lastName}
                                                class="border rounded-pill text-dark border-1 border-success shadow-sm focus-ring focus-ring-primary form-control form-control-lg bounce animated"
                                                type="text" required onChange={handleInputChangeProfile} data-bs-theme="light"name="lastName" /></div>
                                        <div class="col-sm-12 offset-sm-0"><button
                                                class="btn btn-primary font-monospace text-nowrap text-truncate text-break text-uppercase fs-6 fw-bolder text-center text-dark border rounded-pill border-2 border-success shadow focus-ring focus-ring-danger rubberBand animated"
                                                type="submit" style={{margin: "8px"}}><strong>SAVE</strong></button><a
                                                class="btn btn-danger font-monospace text-nowrap text-truncate text-break text-uppercase fs-6 fw-bolder text-center border rounded-pill border-2 border-info shadow focus-ring focus-ring-danger rubberBand animated"
                                                role="button" style={{margin: "8px"}} href="#"
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
                                <form className="border-1 border-danger shadow">
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
                                                type="email" required onChange={handleInputChangeButchery}  name="name"/></div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6 text-dark"><label class="form-label"
                                                style={{margin: "8px"}}><strong><span
                                                        >Butchery
                                                        Email</span></strong></label><input value={Butchery?.email}
                                                class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-control form-control-lg bounce animated"
                                                type="text"  disabled name="name"/></div>
                                        <div class="col-sm-6 text-dark"><label class="form-label"
                                                style={{margin: "8px"}}><strong><span >Phone
                                                        Number</span></strong></label><input value={Butchery?.mobile}
                                                class="border rounded-pill text-dark border-1 border-primary shadow-sm focus-ring focus-ring-success form-control form-control-lg bounce animated"
                                                type="email" required onChange={handleInputChangeButchery}  name="mobile"/></div>
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
                                                        Date</span></strong></label><input value={DayTime(Butchery?.createdAt)}
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
                                </div>
                            </div>
                        </div>
                        
                        {
                            renderBranches()
                        }

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
