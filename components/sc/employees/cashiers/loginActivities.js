'use client'

import toast, { Toaster } from "react-hot-toast"
import Footer from "../../../layout/footer"
import Header from "../../../layout/header"
import NavBar from "../../../layout/navbar"
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { deleteCashiers, deleteUser, editUser, getCashiers, getUsers, newCashier, updateCashier } from "../../../../src/app/api/v1/controller/user/route"
import ReactPaginate from "react-paginate"

export default function CashiersLoginActivitiesPage({session}) {

    let toastId

    const modalRef1=React.useRef()
    const branch=React.useRef()
    const searchParams=React.useRef()
    const pageLimit=React.useRef()
    const page=React.useRef()
    const [pageCount,setPageCount]=React.useState(0)
    const [outOfPage,setOutOfPage]=React.useState(0)
    const [dropDownManu, setDropDownManu]=React.useState(false)
    const [CashiersData, setCashiersData]=React.useState([])
    const [AllBranches, setAllBranches]=React.useState([])
    const [oneCashiersData, setOneCashiersData]=React.useState()

    
    React.useEffect(()=>{
        modalRef1.current.style.display='none'
        branch.current=session.user.branch
        searchParams.current='all'
        pageLimit.current=25
        page.current=1
        getCashiersData()
    },[])

    const showModal=()=>{

        // if (val===1) {
        modalRef1.current.style.display='block'
            
        // } 
        // else if(val===2){
        //     modalRef2.current.style.display='block'
        //     setDropDownManu(false)
        // }
    }

    const hideModal=()=>{
        modalRef1.current.style.display='none'
    }

    const getTableData=()=>{

        const result1=[]

        for (let i = 0; i < CashiersData.length; i++) {
            result1.push(
                <>
                <tr>
                <td>{i+1}</td>
                <td>{CashiersData[i].documents.cashierInfo.username}</td>
                <td>{CashiersData[i].documents.cashierInfo.firstName} {CashiersData[i].documents.cashierInfo.lastName}</td>
                <td>{CashiersData[i].documents.__v===1 ? 'Yes' : 'No'}</td>
                <td>{CashiersData[i].documents.branchInfo.name}</td>
                <td title="Edit"><FontAwesomeIcon icon={faEdit} className="text-warning faEdit" onClick={()=>{
                    setOneCashiersData(CashiersData[i].documents)
                    showModal()
                }}/></td>
                <td title="Delete"><FontAwesomeIcon icon={faTrashAlt} className="text-danger faEdit" onClick={()=>{
                    deleteCashier(CashiersData[i].documents.cashier,CashiersData[i].documents)
                }}/></td>
                
                </tr>
    
                </>
            )
    
        }

        return result1
            
    }

    const getCashiersData=async()=>{
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })

        let data={
            page:page.current-1,
            pageLimit:pageLimit.current,
            branch:branch.current,
        }

        let response=await getCashiers(data)

        toast.dismiss(toastId)
        
        // setAddedBy(response.addedBy)
        console.log(response);

        if (response.success) {
            let pages=Math.ceil(response.cashiers.cashiers[0]?.pageCount / pageLimit.current)

            setCashiersData(response.cashiers.cashiers)
            setPageCount(pages)
            setOutOfPage(response.cashiers.cashiers[0]?.pageCount)

            let brunches=response.cashiers.cashiers

            let isObjectInArray=(array,id)=>array.some(obj=>obj.id===id)


            for (let i = 0; i < brunches.length; i++) {

                let id=brunches[i].documents.branchInfo.id
                
                if (!isObjectInArray(AllBranches, id)) {

                    AllBranches.push(brunches[i].documents.branchInfo)
                    
                }
                
            }
        }
        else{
            toast.error(response.message)
        }
        
    }

    const editCashier=async(id,val)=>{

        let answer=confirm(`Are you sure you want to ${val===1 ? 'GRANT' : 'DENY'} the selected cashier access, ${oneCashiersData.cashierInfo.firstName} ${oneCashiersData.cashierInfo.lastName}?`)

        if (!answer) {
            return
        }

        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })
        let editData=await updateCashier(id,val)

        toast.dismiss(toastId)

        if (editData) {
            toast.success('Successful',{id:toastId})
            getCashiersData()
            hideModal()
        }
        else{
            toast.error(`Failed!!! Try again later`,{id:toastId})
        }

    }

    const deleteCashier=async(id,data)=>{

        alert('This action is NOT reversible')

        let answer=confirm(`Are you sure you want to delete the selected cashier, ${data.cashierInfo.firstName} ${data.cashierInfo.lastName}?`)

        if (!answer) {
            return
        }

        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })
        let response=await deleteCashiers(id)

        toast.dismiss(toastId)

        if (response) {
            toast.success('Successful',{id:toastId})
            getCashiersData()
        }
        else{
            toast.error(`Failed!!! Try again later`,{id:toastId})
        }

    }

    const handlePageClick=(e)=>{
        page.current=e.selected+1
        getCashiersData()
    }

    const handlePageLimitClick=(e)=>{
        pageLimit.current=parseInt(e.target.value)
        getCashiersData()
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
                        Login Activities</h1>
                    <div class="card shadow">
                        <div class="card-header d-flex justify-content-between py-3">
                            <p class="text-primary m-0 fw-bold">Cashiers Info</p>
                            <div class="dropdown border rounded-pill">
                                <button onClick={()=>{setDropDownManu(!dropDownManu)}}
                                    class="dropdown-btn btn btn-primary bg-primary dropdown-toggle text-center border rounded-pill"
                                    aria-expanded="false" data-bs-toggle="dropdown"
                                    type="button"><strong>Cashiers&nbsp;</strong>
                                </button>
                               
                                <div style={{display:dropDownManu ? 'block' : 'none'}} class="dropdown-menu" >
                                    <a class="dropdown-item" href="/sc/Cashiers">Login Activities</a>
                                    {/* <a class="dropdown-item" href="/sc/Cashiers/view/payments"  >Cashiers Payments</a> */}
                                    {/* <a class="dropdown-item" href="/sc/Cashiers/cashiers"  >Cashiers</a> */}
                                    {/* <a class="dropdown-item" href="#"  >Sales Reports</a> */}
                                </div>
                                    
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row">
                            <div class="col-md-4 text-wrap">
                                    <div id="dataTable_length" class="dataTables_length" aria-controls="dataTable">
                                        <label class="form-label">Show&nbsp;<select onChange={handlePageLimitClick}
                                                class="d-inline-block form-select form-select-sm">
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="75">75</option>
                                                <option value="100">100</option>
                                            </select>&nbsp;</label></div>
                                </div>
                                
                                <div class="col-md-4">
                                    <div class="dataTables_filter" id="dataTable_filter"><label
                                            class="form-label">Branch&nbsp;<select onChange={handlePageLimitClick}
                                            class="d-inline-block form-select form-select-sm">
                                            {
                                                AllBranches.map((result)=>{
                                                    return (
                                                        <>
                                                        <option value={result.id}>{result.name}</option>
                                                        </>
                                                    )
                                                })
                                            }    
                                        </select>&nbsp;</label></div>
                                </div>
                            </div>
                            <div class="table-responsive font-monospace border-1 shadow-sm table mt-2"
                                id="dataTable" role="grid" aria-describedby="dataTable_info">
                                <table class="table table-striped table-hover table-bordered my-0" id="dataTable">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Username</th>
                                            <th>Full Name</th>
                                            <th>Has Access</th>
                                            <th>Branch</th>
                                            <th colspan="2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            getTableData()
                                        }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td><strong>No.</strong></td>
                                            <td><strong>Username</strong></td>
                                            <td><strong>Full Name</strong></td>
                                            <td><strong>Has Access</strong></td>
                                            <td><strong>Branch</strong></td>
                                            <td colspan="2"><strong>Action</strong></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div class="row">
                                <div class="col-md-6 align-self-center">
                                    <p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">
                                        Showing 1 to {pageLimit.current} of {outOfPage}</p>
                                </div>
                                <div class="col-md-6">
                                    <nav
                                        class="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
                                        <ReactPaginate

                                            breakLabel="..."
                                            nextLabel=" >>"
                                            onPageChange={handlePageClick}
                                            pageRangeDisplayed={5}
                                            pageCount={pageCount}
                                            previousLabel="<< "
                                            renderOnZeroPageCount={null}
                                            marginPagesDisplayed={2}
                                            containerClassName="pagination justify-content-center"
                                            pageClassName="page-item"
                                            pageLinkClassName="page-link"
                                            previousClassName="page-item"
                                            previousLinkClassName="page-link"
                                            nextClassName="page-item"
                                            nextLinkClassName="page-link"
                                            activeClassName="active"
                                            />
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ref={modalRef1} class="modal font-monospace border rounded" role="dialog" tabindex="-1"
                        id="modal-1">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
                            role="document">
                            <div class="modal-content bg-dark">
                                <div class="modal-header text-center">
                                    <h1 class="modal-title text-capitalize fw-bolder text-center">Cashier's Information</h1>
                                    <button class="btn-close" type="button" aria-label="Close"
                                        data-bs-dismiss="modal"></button>
                                </div>
                                <div  class="modal-body">
                                    <div
                                        class="font-monospace text-capitalize fw-bolder d-flex justify-content-center">
                                        <p class="fs-5 text-danger">{oneCashiersData?.branchInfo.name} Branch</p>
                                        
                                    </div>
                                    <div
                                        class="font-monospace text-capitalize fw-bolder d-flex justify-content-between">
                                        <p class="fs-5 text-warning">{oneCashiersData?.cashierInfo.firstName} {oneCashiersData?.cashierInfo.lastName}</p>
                                        <p className="text-light">{oneCashiersData?.cashierInfo.username}</p>
                                        
                                    </div>
                                    <hr />
                                    
                                    <div>

                                    <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                        <div class="col">
                                            <div class="row d-grid d-flex">
                                                <div class="col d-grid">
                                                    <label class="form-label text-light">Has Access:</label>
                                                </div>
                                                <div class="col d-grid">
                                                    <label class="form-label">{oneCashiersData?.__v===1 ? 'Yes' : 'No'}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                        <div class="col">
                                            <div class="row d-grid d-flex">
                                                <div class="col d-grid">
                                                    <label class="form-label text-light">Made Cashier On:</label>
                                                </div>
                                                <div class="col d-grid">
                                                    <label class="form-label">{new Date(oneCashiersData?.createdAt).toDateString()}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                        <div class="col">
                                            <div class="row d-grid d-flex">
                                                <div class="col d-grid">
                                                    <label class="form-label text-light">Last Logged In:</label>
                                                </div>
                                                <div class="col d-grid">
                                                    <label class="form-label">{new Date(oneCashiersData?.createdAt).toDateString()} {new Date(oneCashiersData?.createdAt).toLocaleTimeString()}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <hr />
                                <div class="modal-footer d-flex justify-content-between">
                                    <button class="btn btn-light" type="button"
                                        data-bs-dismiss="modal" data-bs-target="#modal-1"
                                        data-bs-toggle="modal" onClick={hideModal}>Close</button>
                                    {
                                        oneCashiersData?.__v===1 ? (
                                            <>
                                            <button class="btn btn-danger bg-danger fw-bolder"
                                                type="button" data-bs-target="#modal-1" data-bs-toggle="modal" onClick={e=>{editCashier(oneCashiersData.cashier,-1)}}>Deny Access</button>
                                            </>
                                        ):(
                                            <>
                                            <button class="btn btn-primary bg-primary fw-bolder"
                                                type="button" data-bs-target="#modal-1" data-bs-toggle="modal" onClick={e=>{editCashier(oneCashiersData.cashier,1)}}>Grant Access</button>
                                            </>
                                        )
                                    }
                                    
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
