'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Footer from "../../../layout/footer"
import Header from "../../../layout/header"
import NavBar from "../../../layout/navbar"
import { faArchive, faArrowAltCircleUp, faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import React from "react"
import toast, { Toaster } from "react-hot-toast"
import { DayTime, Today, formatDate } from "../../../layout/utils"
import { deleteProducts, editProducts, getAllProducts, getBranches, getInvoices, getProducts, newInvoice, productsIssue } from "../../../../src/app/api/v1/controller/butchery/route"
import ReactPaginate from "react-paginate"
import { useRouter } from "next/navigation"

let Branches=[]
export default function ViewProductsPage({session}) {

    let toastId
    let date=Today()

    const router=useRouter()

    
    const DateRef=React.useRef()
    const page=React.useRef()
    const branch=React.useRef()
    const searchParams=React.useRef()
    const pageLimit=React.useRef()
    const modalRef1=React.useRef()
    const achievedVal=React.useRef()
    const [dropDownManu, setDropDownManu]=React.useState(false)
    const [ProductData, setProductDataData]=React.useState([])
    const [Invoices, setInvoices]=React.useState([])
    const [Users, setUsers]=React.useState([])
    const [AllBranches, setAllBranches]=React.useState([])
    const [pageCount,setPageCount]=React.useState(0)
    const [outOfPage,setOutOfPage]=React.useState(0)
    
    React.useEffect(()=>{
        modalRef1.current.style.display='none'
        branch.current=session.user.branch
        DateRef.current='all'
        searchParams.current='all'
        pageLimit.current=25
        page.current=1
        achievedVal.current=1
        getProductData()
        getInvoiceData()
        getBranchesData()
    },[])

    const showModal=()=>{
        modalRef1.current.style.display='block'
    }

    const hideModal=()=>{
        setDropDownManu(false)
        modalRef1.current.style.display='none'
    }

    const handlePageClick=(e)=>{
        page.current=e.selected+1
        getInvoiceData()
    }

    const handleBranchClick=(e)=>{
        branch.current=e.target.value
        getInvoiceData()
    }

    const handlePageLimitClick=(e)=>{
        pageLimit.current=parseInt(e.target.value)
        getInvoiceData()
    }

    const handleDateClick=(e)=>{
        DateRef.current=e.target.value ? formatDate(e.target?.value) : 'all'
        getInvoiceData()
    }

    const handleInputChangeSearch = (e) => {
      
        searchParams.current= e.target.value ? e.target.value : 'all';

        getInvoiceData()

    }

    const toOneInvoice=async(invoiceNumber)=>{
        router.push(`/sc/invoice/details?branch=${branch.current}&num=${invoiceNumber}`)
    }

    const getTableData=()=>{

        const result1=[]

        for (let i = 0; i < Invoices.length; i++) {

            result1.push(
                <>
                <tr>
                <td>{Invoices[i]?.documents.details.invoiceNumber}</td>
                <td>{Invoices[i]?.documents.details.date}</td>
                <td>{Invoices[i]?.documents.branches.name}</td>
                <td title={Users[i]?.firstName+' '+Users[i]?.lastName} onClick={()=>{
                    toast(Users[i]?.firstName+' '+Users[i]?.lastName)}
                    }>{Users[i]?.username}</td>
                <td title="Restore"><FontAwesomeIcon icon={faEye} className="text-primary faEdit" onClick={()=>{
                            toOneInvoice(Invoices[i]?.documents.details.invoiceNumber)
                }}/></td>
                
                
                </tr>
    
                </>
            )
    
        }

        return result1
            
    }

    const getProductData=async()=>{
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })
        let data={
            branch:branch.current,
        }
        toast()
        let response=await getAllProducts(data)
        console.log(response);
        setProductDataData(response.products)

        toast.dismiss(toastId)
        
    }

    const getBranchesData=async()=>{
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })

        let response=await getBranches(session)
        console.log(response);
        setAllBranches(response.branches)

        toast.dismiss(toastId)
        
    }

    const getInvoiceData=async()=>{
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })
        let data={
            page:page.current-1,
            pageLimit:pageLimit.current,
            branch:branch.current,
            date:DateRef.current,
            searchParams:searchParams.current,
        }
        let response=await getInvoices(data)
        console.log(response);
        let pages=Math.ceil(response.invoices.invoices[0]?.pageCount / pageLimit.current)
        setPageCount(pages)
        setOutOfPage(response.invoices.invoices[0]?.pageCount)

        setInvoices(response.invoices.invoices)
        setUsers(response.invoices.users)

        toast.dismiss(toastId)
        
    }

    const newInvoices=async(e)=>{

        e.preventDefault()

        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })

        let data={
            branch:branch.current,
            date:date.date,
            addedBy:session.user.id
        }

        let response=await newInvoice(data)
        toast.dismiss(toastId)

        if (response.success) {
            toast.success('Successful')
            getInvoiceData()
            hideModal()

        }
        else{
            toast.error(`Failed!!! ${response.message}`)
        }

    }

    const newInvoicesTemp=async()=>{

        // console.log(session.user);

        if(session.user.access){
            showModal()
        }
        else{
            newInvoices()
        }
    }

    const handleInputChange= (e) => {
        const { value } = e.target;
        branch.current=value
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
    <div className="bg-light">
    <div id="wrapper">
        <NavBar session={session.user}/>
        <div class="d-flex flex-column" id="content-wrapper">
            <div id="content" >
                <Header session={session.user}/>
                <div class="container-fluid">
                    <h1
                        class=" font-monospace text-uppercase fw-bolder text-center text-light bg-success bg-gradient border-2 border-secondary shadow-sm mb-4">
                        My Invoices</h1>
                    <div class="card shadow">
                        <div class="card-header d-flex justify-content-between py-3">
                            <p class="text-primary m-0 fw-bold">Invoices Info</p>
                            <div class="dropdown border rounded-pill">
                                <button onClick={()=>{setDropDownManu(!dropDownManu)}}
                                    class="dropdown-btn btn btn-primary bg-primary dropdown-toggle text-center border rounded-pill"
                                    aria-expanded="false" data-bs-toggle="dropdown"
                                    type="button"><strong>Invoice&nbsp;</strong>
                                </button>
                               
                                <div style={{display:dropDownManu ? 'block' : 'none'}} class="dropdown-menu" >
                                    <a class="dropdown-item"  onClick={()=>{
                                        newInvoicesTemp()
                                        }}>New Invoice</a>

                                </div>
                                    
                            </div>
                        </div>
                        <div class="card-body bg-dark">
                            <div class="row">
                                <div class="col-md-3 text-wrap">
                                    <div id="dataTable_length" class="dataTables_length" aria-controls="dataTable">
                                        <label class="form-label">Show&nbsp;<select onChange={handlePageLimitClick}
                                                class="d-inline-block form-select form-select-sm">
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="75">75</option>
                                                <option value="100">100</option>
                                            </select>&nbsp;</label></div>
                                </div>
                                <div class="col-md-3">
                                    <div class="text-md-end dataTables_filter" id="dataTable_filter"><label
                                            class="form-label">Search&nbsp;<input type="search" class="form-control form-control-sm"
                                                aria-controls="dataTable" placeholder="Search" onChange={handleInputChangeSearch}/>&nbsp;</label></div>
                                </div>

                                <div class="text-md-end col-md-3 text-wrap">
                                    <div id="dataTable_length-1" class="dataTables_length" aria-controls="dataTable">
                                        <label class="form-label">Date&nbsp;<input type="date" ref={DateRef} onChange={handleDateClick}
                                                class="d-inline-block form-control form-control-sm" />
                                            &nbsp;</label></div>
                                </div>

                                <div class="col-md-3">
                                    <div class="text-md-end dataTables_filter" id="dataTable_filter"><label
                                            class="form-label">Branch&nbsp;<select onChange={handleBranchClick}
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
                            <div class="table-responsive table-height font-monospace border-2  shadow-sm table"
                                id="dataTable" role="grid" aria-describedby="dataTable_info">
                                <table class="table table-striped  table-hover table-bordered" id="dataTable">
                                    <thead>
                                        <tr>
                                            <th>Invoice Number</th>
                                            <th>Date</th>
                                            <th>Branch</th>
                                            <th>Added By</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{maxHeight:'100vh', overflow:'scroll'}}>
                                        {
                                            getTableData()
                                        }
                                    </tbody>
                                    <tfoot >
                                        <tr>
                                            <th className="fw-bold">Invoice Number</th>
                                            <th className="fw-bold">Date</th>
                                            <th className="fw-bold">Branch</th>
                                            <th className="fw-bold">Added By</th>
                                            <td className="fw-bold"><strong>Action</strong></td>
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
                    <div ref={modalRef1} className="modal " role="dialog"
                        tabindex="-1" id="modal-1">
                        <div class="modal-dialog modal-md modal-dialog-centered" role="document">
                            <div class="modal-content bg-dark">
                                <div class="modal-header text-capitalize">
                                    <h2 class="modal-title fw-bolder">New Invoice</h2><button class="btn-close"
                                        type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                                </div>
                                <form onSubmit={newInvoices}>
                                    <div class="modal-body">
                                    
                                        <div class="d-grid">
                                            <div class="col ">
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Choose
                                                            Branch</label>
                                                            <select onChange={handleInputChange}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control-lg"
                                                             style={{textAlign: "center"}} required>
                                                                <option value={''}></option>
                                                                {
                                                                    AllBranches?.map((result)=>{
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
            </div>
            <Footer />
        </div>
        {/* <a class="border rounded d-inline scroll-to-top" href="#page-top"><i class="fas fa-angle-up"></i></a> */}
    </div>
    </div>
    </>
  )
}
