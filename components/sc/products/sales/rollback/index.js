'use client'

import React from "react"
import Footer from "../../../../layout/footer"
import Header from "../../../../layout/header"
import NavBar from "../../../../layout/navbar"
import { getBranchById, getBranches, getRollBackSales, isShopOpened } from "../../../../../src/app/api/v1/controller/butchery/route"
import toast, { Toaster } from "react-hot-toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye } from "@fortawesome/free-solid-svg-icons"
import { DateTime, Today, formatDate } from "../../../../layout/utils"
import ReactPaginate from "react-paginate"
import { getCashierById } from "../../../../../src/app/api/v1/controller/user/route"

let soldProducts=[]
let cashierData=[]

export default function ViewSalesPage({session}) {

    const [SalesData, setSalesData]=React.useState([])

    const page=React.useRef()
    const Date=React.useRef()
    const cashier=React.useRef()
    const pageLimit=React.useRef()
    const product=React.useRef()
    const [pageCount,setPageCount]=React.useState(0)
    const [outOfPage,setOutOfPage]=React.useState(0)
    const [OneCashier,setOneCashier]=React.useState([])
    const [ManyCashiers,setManyCashiers]=React.useState([])
    const branch=React.useRef()
    const modalRef2=React.useRef()
    const [dropDownManu, setDropDownManu]=React.useState(false)
    const [OneRollData, setOneRollData]=React.useState()
    const [Branches, setBranches]=React.useState([])

    let toastId

    React.useEffect(()=>{
        modalRef2.current.style.display='none'
        let date=Today()
        Date.current=date.date
        pageLimit.current=25
        branch.current=session.user.branch
        page.current=1
        product.current='all'
        cashier.current='all'
        
        isShopClosed(1)

    },[])

    const isShopClosed=async(val)=>{

        let shopOpened=await isShopOpened(session.user.branch,session.user.id)

        if (shopOpened) {
            if (val===1) {
                getRollBackSalesData()
                getBrunches()
            }
            return
        }
        else{
            if (session.user.access===1) {
                toast('Your Employer has closed the shop')
                signOut()
                router.push('/')
            }
            else{
                if (val===1) {
                    getRollBackSalesData()
                    getBrunches()
                }
                return
            }
        }
    }

    const handlePageClick=(e)=>{
        page.current=e.selected+1
        getRollBackSalesData()
    }

    const handlePageLimitClick=(e)=>{
        pageLimit.current=parseInt(e.target.value)
        getRollBackSalesData()
    }

    const handleDateClick=(e)=>{
        Date.current=formatDate(e.target.value)
        getRollBackSalesData()
    }

    const handleCashierClick=(e)=>{
        cashier.current=e.target.value
        getRollBackSalesData()
    }

    const handleProductClick=(e)=>{
        product.current=e.target.value
        getRollBackSalesData()
    }

    const getRollBackSalesData=async()=>{
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })
        let data={
            cashier:cashier.current,
            date:Date.current,
            page:page.current-1,
            limit:pageLimit.current,
            branch:branch.current,
            product:product.current
        }
        let response=await getRollBackSales(data)

        let pages=Math.ceil(response.sales?.products[0]?.pageCount / pageLimit.current)
        setPageCount(pages)
        setOutOfPage(response.sales?.products[0]?.pageCount)
        setSalesData(response.sales?.products)
        setManyCashiers(response.sales?.cashierInfo)
        toast.dismiss(toastId)
        
    }

    const viewMore=async(data)=>{

        modalRef2.current.style.display='block'

        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })

        let promises=[]

        promises.push(
            getCashierById(data.user),
            getCashierById(data.details.cashier),
            getBranchById(data.branch),
        )

        let response=await Promise.allSettled(promises)

        let cashiers=[]

        cashiers.push(
            response[0].value.cashierInfo,
            response[1].value.cashierInfo,
            response[2].value.branch,
        )

        toast.dismiss(toastId)

        setOneCashier(cashiers)

        setOneRollData(data)
        
    }

    const getTableData=()=>{

        const result1=[]
        soldProducts=[]

        for (let i = 0; i < SalesData.length; i++) {

            if (!soldProducts.includes(SalesData[i]?.documents.details.name)) {
                soldProducts.push(SalesData[i]?.documents.details.name)
            }

            result1.push(
                <>
                <tr>
                <td>{i+1}</td>
                <td>{SalesData[i]?.documents.details.name}</td>
                <td>{SalesData[i]?.documents.details.quantity}</td>
                <td>{SalesData[i]?.documents.details.amountSold}</td>
                <td>{DateTime(SalesData[i]?.documents.details.rolledAt)}</td>
                <td title="View More"><FontAwesomeIcon icon={faEye} className="text-success fw-bold faEdit" onClick={()=>{
                    viewMore(SalesData[i]?.documents)

                }}/></td>
                </tr>
    
                </>
            )
    
        }

        return result1
            
    }

    const hideModal=()=>{
        modalRef2.current.style.display='none'
        
    }

    const paidTypeName=(val)=>{
        let name

        if(val===1) name='Cash';
        if(val===2) name='M-Pesa';
        if(val===3) name='Cash & M-Pesa';
        
        return name
    }

    const getBrunches=async()=>{
        let response=await getBranches(session)
        setBranches(response.branches)
    }

    const handleBranchClick=(e)=>{
        branch.current=e.target.value
        getRollBackSalesData()
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
                        class=" font-monospace text-uppercase fw-bolder text-center text-light bg-success bg-gradient border-2 border-secondary shadow-sm mb-4">
                        Roll Back Report</h1>
                    <div class="card shadow">
                    <div class="card-header d-flex justify-content-between py-3">
                            <p class="text-primary m-0 fw-bold">Roll Back Info</p>
                            
                        </div>
                        
                        <div class="card-body bg-dark">
                            <div class="row">
                                <div class="col-md-1 text-wrap">
                                    <div id="dataTable_length" class="dataTables_length" aria-controls="dataTable">
                                        <label class="form-label">Show&nbsp;<select onChange={handlePageLimitClick}
                                                class="d-inline-block form-select form-select-sm">
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="75">75</option>
                                                <option value="100">100</option>
                                            </select>&nbsp;</label></div>
                                </div>
                                <div class="col-md-3 text-wrap">
                                    <div id="dataTable_length-1" class="dataTables_length" aria-controls="dataTable">
                                        <label class="form-label">Products&nbsp;<select onChange={handleProductClick}
                                                class="d-inline-block form-select form-select-sm">
                                                <option value="all">All</option>
                                                {
                                                    soldProducts.map((result)=>{
                                                        return (
                                                            <>
                                                            <option value={result} >{result}</option>
                                                            
                                                            </>
                                                        )

                                                    })
                                                }
                                            </select>&nbsp;</label></div>
                                </div>
                                <div class="col-md-3 text-wrap">
                                    <div id="dataTable_length-1" class="dataTables_length" aria-controls="dataTable">
                                        <label class="form-label">Cashier&nbsp;<select onChange={handleCashierClick}
                                                class="d-inline-block form-select form-select-sm">
                                                <option value="all">All</option>
                                                {
                                                    ManyCashiers.map((result)=>{
                                                        return (
                                                            <>
                                                            <option value={result.id} >{result.firstName} {result.lastName}</option>
                                                            
                                                            </>
                                                        )

                                                    })
                                                }
                                            </select>&nbsp;</label></div>
                                </div>
                                <div class="col-md-2 text-wrap">
                                    <div id="dataTable_length-1" class="dataTables_length" aria-controls="dataTable">
                                        <label class="form-label">Date&nbsp;<input type="date" ref={Date} onChange={handleDateClick}
                                                class="d-inline-block form-control form-control-sm" />
                                            &nbsp;</label></div>
                                </div>
                                <div class="col-md-3">
                                    <div class="text-md-end dataTables_filter" id="dataTable_filter"><label
                                            class="form-label">Branch&nbsp;<select onChange={handleBranchClick}
                                            class="d-inline-block form-select form-select-sm">
                                            {
                                                Branches.map((result)=>{
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
                            
                            <div class="table-responsive table-height font-monospace border-1 shadow-sm table mt-2"
                                id="dataTable" role="grid" aria-describedby="dataTable_info">
                                <table class="table table-striped table-hover table-bordered my-0" id="dataTable">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Product Name</th>
                                            <th>Sold Quantity</th>
                                            <th>Sold Amount</th>
                                            <th>Rolled Back Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { 
                                            getTableData()
                                        }
                                    </tbody>
                                    <tfoot >
                                        <tr>
                                            <td><strong>No.</strong></td>
                                            <td><strong>Product Name</strong></td>
                                            <td><strong>Sold Quantity</strong></td>
                                            <td><strong>Sold Amount</strong></td>
                                            <td><strong>Rolled Back Date</strong></td>
                                            <td><strong>Action</strong></td>
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
                            <div ref={modalRef2} class="modal" role="dialog"
                            tabindex="-1" id="modal-2">
                            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content bg-dark">
                                <div class="modal-header text-capitalize">
                                    <h2 class="modal-title fw-bolder">More On Rolled Back Sale</h2><button class="btn-close"
                                        type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                                </div>

                                <div class="modal-body">
                                    {
                                        OneCashier.length>0 && (
                                            <>
                                            <div
                                                class="font-monospace text-capitalize fw-bolder d-flex justify-content-center">
                                                <p class="fs-5 text-warning">{OneCashier[2].name} Branch</p>
                                                
                                            </div>
                                            <div
                                                class="font-monospace text-capitalize fw-bolder d-flex justify-content-between">
                                                <p class="fs-5 text-warning">{OneRollData.details.name}</p>
                                                <p className="text-light">{OneRollData.details.code}</p>
                                                
                                            </div>
                                            <hr />
                                            <div >
                                                
                                                <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                                    <div class="col">
                                                        <div class="row d-grid d-flex">
                                                            <div class="col d-grid">
                                                                <label class="form-label text-light">Quantity Sold:</label>
                                                            </div>
                                                            <div class="col d-grid">
                                                                <label class="form-label">{OneRollData.details.quantity.toLocaleString()}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        
                                                </div>

                                                <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                                    <div class="col">
                                                        <div class="row d-grid d-flex">
                                                            <div class="col d-grid">
                                                                <label class="form-label text-light">Amount Sold:</label>
                                                            </div>
                                                            <div class="col d-grid">
                                                                <label class="form-label">{OneRollData.details.amountSold.toLocaleString()}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        
                                                </div>

                                                <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                                    <div class="col">
                                                        <div class="row d-grid d-flex">
                                                            <div class="col d-grid">
                                                                <label class="form-label text-light">Sold By:</label>
                                                            </div>
                                                            <div class="col d-grid">
                                                                <label class="form-label">{OneCashier[1].cashiers.firstName} {OneCashier[1].cashiers.lastName} ({OneCashier[1].cashiers.username})</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        
                                                </div>

                                                <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                                    <div class="col">
                                                        <div class="row d-grid d-flex">
                                                            <div class="col d-grid">
                                                                <label class="form-label text-light">Sold Date:</label>
                                                            </div>
                                                            <div class="col d-grid">
                                                                <label class="form-label">{DateTime(OneRollData.details.date)}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        
                                                </div>

                                                <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                                    <div class="col">
                                                        <div class="row d-grid d-flex">
                                                            <div class="col d-grid">
                                                                <label class="form-label text-light">Week Day Name:</label>
                                                            </div>
                                                            <div class="col d-grid">
                                                                <label class="form-label">{OneRollData.details.weekDayName}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        
                                                </div>

                                                <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                                    <div class="col">
                                                        <div class="row d-grid d-flex">
                                                            <div class="col d-grid">
                                                                <label class="form-label text-light">Paid By:</label>
                                                            </div>
                                                            <div class="col d-grid">
                                                                <label class="form-label">{paidTypeName(OneRollData.details.payedBy.type)}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        
                                                </div>

                                                <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                                    <div class="col">
                                                        <div class="row d-grid d-flex">
                                                            <div class="col d-grid">
                                                                <label class="form-label text-light">Cash Payment:</label>
                                                            </div>
                                                            <div class="col d-grid">
                                                                <label class="form-label">{OneRollData.details.payedBy.cash.toLocaleString()}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        
                                                </div>

                                                <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                                    <div class="col">
                                                        <div class="row d-grid d-flex">
                                                            <div class="col d-grid">
                                                                <label class="form-label text-light">M-Pesa Payment:</label>
                                                            </div>
                                                            <div class="col d-grid">
                                                                <label class="form-label">{OneRollData.details.payedBy.m_pesa.toLocaleString()}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        
                                                </div>
                                            </div>

                                                <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                                    <div class="col">
                                                        <div class="row d-grid d-flex">
                                                            <div class="col d-grid">
                                                                <label class="form-label text-light">Rolled Back By:</label>
                                                            </div>
                                                            <div class="col d-grid">
                                                                <label class="form-label">{OneCashier[0].cashiers.firstName} {OneCashier[0].cashiers.lastName} ({OneCashier[0].cashiers.username})</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        
                                                </div>

                                                <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                                    <div class="col">
                                                        <div class="row d-grid d-flex">
                                                            <div class="col d-grid">
                                                                <label class="form-label text-light">Rolled Back Date:</label>
                                                            </div>
                                                            <div class="col d-grid">
                                                                <label class="form-label">{DateTime(OneRollData.details.rolledAt)}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        
                                                </div>

                                                
                                            </>
                                        )
                                    }
                                    
                                    
                                    </div>
                                    <div class="modal-footer"><button class="btn btn-light" type="button"
                                            data-bs-dismiss="modal" data-bs-target="#modal-2"
                                            data-bs-toggle="modal" onClick={()=>{hideModal()}}>Close</button>
                                    </div>
                                    </div>
                                </div>
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
