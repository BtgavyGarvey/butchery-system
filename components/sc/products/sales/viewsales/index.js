'use client'

import React from "react"
import Footer from "../../../../layout/footer"
import Header from "../../../../layout/header"
import NavBar from "../../../../layout/navbar"
import { getBranchById, getBranches, getSales, isShopOpened, rollBackSales } from "../../../../../src/app/api/v1/controller/butchery/route"
import toast, { Toaster } from "react-hot-toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowAltCircleUp, faEye } from "@fortawesome/free-solid-svg-icons"
import { DateTime, Today, formatDate } from "../../../../layout/utils"
import ReactPaginate from "react-paginate"
import { getCashierById } from "../../../../../src/app/api/v1/controller/user/route"

let soldProducts=[]
let cashierData=[]


export default function ViewSalesPage({session}) {

    const [SalesData, setSalesData]=React.useState([])
    const [OneSalesData, setOneSalesData]=React.useState()

    const page=React.useRef()
    const totalSales=React.useRef(0)
    const m_pesaSales=React.useRef(0)
    const cashSales=React.useRef(0)
    const DateRef=React.useRef()
    const cashier=React.useRef()
    const pageLimit=React.useRef()
    const product=React.useRef()
    const [pageCount,setPageCount]=React.useState(0)
    const [outOfPage,setOutOfPage]=React.useState(0)
    const [OneCashier,setOneCashier]=React.useState(0)
    const [ManyCashiers,setManyCashiers]=React.useState([])
    const [Branches, setBranches]=React.useState([])
    const branch=React.useRef()
    const modalRef2=React.useRef()
    const [dropDownManu, setDropDownManu]=React.useState(false)

    let toastId

    React.useEffect(()=>{
        modalRef2.current.style.display='none'
        let date=Today()
        DateRef.current=date.date
        pageLimit.current=25
        page.current=1
        branch.current=session.user.branch
        product.current='all'
        cashier.current='all'
        isShopClosed(1)

    },[])

    const isShopClosed=async(val)=>{

        let shopOpened=await isShopOpened(session.user.branch,session.user.id)

        if (shopOpened) {
            if (val===1) {
                getSalesData()
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
                    getSalesData()
                    getBrunches()
                }
                return
            }
        }
    }

    const hideModal=()=>{
        modalRef2.current.style.display='none'
        
    }

    const handlePageClick=(e)=>{
        page.current=e.selected+1
        getSalesData()
    }

    const handlePageLimitClick=(e)=>{
        pageLimit.current=parseInt(e.target.value)
        getSalesData()
    }

    const handleDateClick=(e)=>{
        DateRef.current=formatDate(e.target.value)
        getSalesData()
    }

    const handleCashierClick=(e)=>{
        cashier.current=e.target.value
        getSalesData()
    }

    const handleProductClick=(e)=>{
        product.current=e.target.value
        getSalesData()
    }

    const getSalesData=async()=>{
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })
        let data={
            cashier:cashier.current,
            date:DateRef.current,
            page:page.current-1,
            limit:pageLimit.current,
            branch:branch.current,
            product:product.current
        }
        let response=await getSales(data)

        let pages=Math.ceil(response.sales?.products[0]?.pageCount / pageLimit.current)
        setPageCount(pages)
        setOutOfPage(response.sales?.products[0]?.pageCount)
        setSalesData(response.sales?.products)
        setManyCashiers(response.sales?.cashierInfo)
        toast.dismiss(toastId)
        
    }

    const rollBackSale=async(data)=>{

        toastId=toast.loading('Checking status, please wait...',{
            id:toastId
        })

        await isShopClosed(2)

        toast.dismiss(toastId)

        let answer=confirm(`Are you sure you want to roll back the sale of ${data.name}`)

        if (answer) {
            toastId=toast.loading('Loading, please wait...',{
                id:toastId
            })
    
            let response=await rollBackSales(data)
            toast.dismiss(toastId)

            if (response.success) {

                toast.success('Successful')
                getSalesData()
            } else {
                toast.error(`Failed!!! ${response.message}`)
                
            }
        }
        
    }

    const viewMore=async(branch,data)=>{

        modalRef2.current.style.display='block'

        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })
        let promises=[]

        promises.push(
            getCashierById(data.cashier),
            getBranchById(branch),
        )

        let response=await Promise.allSettled(promises)

        let cashiers=[]

        cashiers.push(
            response[0].value.cashierInfo,
            response[1].value.branch,
        )

        toast.dismiss(toastId)

        setOneCashier(cashiers)

        setOneSalesData(data)
        
    }

    const getTableData=()=>{

        const result1=[]
        const sale=[]
        soldProducts=[]

        totalSales.current=0
        cashSales.current=0
        m_pesaSales.current=0

        for (let i = 0; i < SalesData.length; i++) {

            if (!soldProducts.includes(SalesData[i]?.documents.details.moreDateDetails.moreHourDetails.name)) {
                soldProducts.push(SalesData[i]?.documents.details.moreDateDetails.moreHourDetails.name)
            }

            let indexOfObjectDay=sale.findIndex((item)=>(item.date === SalesData[i]?.documents.details.moreDateDetails.moreHourDetails.date))

            let result={
                date:SalesData[i]?.documents.details.moreDateDetails.moreHourDetails.date
            }
            if (indexOfObjectDay < 0) {
                sale.push(
                    result
                )
                m_pesaSales.current +=parseInt(SalesData[i]?.documents.details.moreDateDetails.moreHourDetails.payedBy.m_pesa)
                cashSales.current +=parseInt(SalesData[i]?.documents.details.moreDateDetails.moreHourDetails.payedBy.cash)
            }

            totalSales.current +=parseInt(SalesData[i]?.documents.details.moreDateDetails.moreHourDetails.amountSold)
            

            result1.push(
                <>
                <tr>
                <td>{i+1}</td>
                <td>{SalesData[i]?.documents.details.moreDateDetails.moreHourDetails.name}</td>
                <td>{SalesData[i]?.documents.details.moreDateDetails.moreHourDetails.quantity}</td>
                <td>{SalesData[i]?.documents.details.moreDateDetails.moreHourDetails.amountSold}</td>
                <td>{DateTime(SalesData[i]?.documents.details.moreDateDetails.moreHourDetails.date)}</td>
                <td title="View More"><FontAwesomeIcon icon={faEye} className="text-success fw-bold faEdit" onClick={()=>{
                    viewMore(SalesData[i]?.documents.branch,SalesData[i]?.documents.details.moreDateDetails.moreHourDetails)
                }}/></td>
                {
                    session.user.package === 2 && (
                        <td title="Roll Back"><FontAwesomeIcon icon={faArrowAltCircleUp} className="text-danger fw-bold faEdit" onClick={()=>{
                            let data={
                                user:session?.user.id,
                                now:Today(),
                                date:SalesData[i]?.documents.details.date,
                                hour:SalesData[i]?.documents.details.moreDateDetails.hour,
                                name:SalesData[i]?.documents.details.moreDateDetails.moreHourDetails.name,
                                branch:branch.current,
                                sale:SalesData[i]?.documents.details.moreDateDetails.moreHourDetails
                            }
                            rollBackSale(data)
                        }}/></td>
                    )
                }
                
                </tr>
    
                </>
            )
    
        }

        return result1
            
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
        getSalesData()
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
                        View Sales</h1>
                    <div class="card shadow">
                    <div class="card-header d-flex justify-content-between py-3">
                            <p class="text-primary m-0 fw-bold">Sales Info</p>
                            <div class="dropdown border rounded-pill">
                                <button onClick={()=>{setDropDownManu(!dropDownManu)}}
                                    class="dropdown-btn btn btn-primary bg-primary dropdown-toggle text-center border rounded-pill"
                                    aria-expanded="false" data-bs-toggle="dropdown"
                                    type="button"><strong>Sales&nbsp;</strong>
                                </button>
                               
                                <div style={{display:dropDownManu ? 'block' : 'none'}} class="dropdown-menu" >
                                    <a class="dropdown-item" href="/sc/products/sales/makesales">New Sale</a>
                                    {
                                        session.user.package === 2 && (
                                            session.user.access !==1 && (
                                                <a class="dropdown-item" href="/sc/products/sales/rollback"  >Roll Back Report</a>
                                            )
                                        )
                                    }

                                    {
                                        session.user.package === 2 && (
                                            <a class="dropdown-item" href="/sc/products/sales/reports"  >Sales Report Dashboard</a>
                                        )
                                    }
                                </div>
                                    
                            </div>
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
                                {
                                    session.user.access !==1 && (
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
                                    )
                                }
                                
                                <div class="col-md-2 text-wrap">
                                    <div id="dataTable_length-1" class="dataTables_length" aria-controls="dataTable">
                                        <label class="form-label">Date&nbsp;<input type="date" ref={DateRef} onChange={handleDateClick}
                                                class="d-inline-block form-control form-control-sm" />
                                            &nbsp;</label></div>
                                </div>
                                {
                                    session.user.access !==1 && (
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
                                    )
                                }
                                
                            </div>
                            <div class="row">
                                <div class="Dflex col-md-12 bg-light justify-content-between">
                                        <p className="text-primary fw-bold">Total Sales: <span className="text-dark">KSh. {totalSales.current.toLocaleString()}</span></p>
                                        <p className="text-success fw-bold">M-Pesa Sales: <span className="text-dark">KSh. {m_pesaSales.current.toLocaleString()}</span></p>
                                        <p className="text-danger fw-bold">Cash Sales: <span className="text-dark">KSh. {cashSales.current.toLocaleString()}</span></p>
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
                                            <th>Sold At</th>
                                            <th colSpan={2}>Action</th>
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
                                            <td><strong>Sold At</strong></td>
                                            <td colSpan={2}><strong>Action</strong></td>
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
                                <div ref={modalRef2} class="modal font-monospace border rounded" role="dialog"
                            tabindex="-1" id="modal-2">
                            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
                            <div class="modal-content bg-dark">
                                <div class="modal-header text-capitalize">
                                    <h2 class="modal-title fw-bolder">More On {OneSalesData?.name} Sale</h2><button class="btn-close"
                                        type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                                </div>

                                <div class="modal-body">
                                    {
                                        OneCashier.length>0 && (
                                            <>
                                            <div
                                                class="font-monospace text-capitalize fw-bolder d-flex justify-content-center">
                                                <p class="fs-5 text-warning">{OneCashier[1]?.name} Branch</p>
                                                
                                            </div>
                                            <div
                                                class="font-monospace text-capitalize fw-bolder d-flex justify-content-between">
                                                <p class="fs-5 text-warning">{OneSalesData?.name}</p>
                                                <p className="text-light">{OneSalesData?.code}</p>
                                                
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
                                                                <label class="form-label">{OneSalesData?.quantity.toLocaleString()}</label>
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
                                                                <label class="form-label">{OneSalesData?.amountSold.toLocaleString()}</label>
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
                                                                <label class="form-label">{OneCashier[0]?.cashiers.firstName} {OneCashier[0].cashiers.lastName} ({OneCashier[0].cashiers.username})</label>
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
                                                                <label class="form-label">{DateTime(OneSalesData?.date)}</label>
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
                                                                <label class="form-label">{OneSalesData.weekDayName}</label>
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
                                                                <label class="form-label">{paidTypeName(OneSalesData.payedBy.type)}</label>
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
                                                                <label class="form-label">{OneSalesData.payedBy.cash.toLocaleString()}</label>
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
                                                                <label class="form-label">{OneSalesData.payedBy.m_pesa.toLocaleString()}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        
                                                </div>
                                            </div>

                                                <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                                    <div class="col">
                                                        <div class="row d-grid d-flex">
                                                            <div class="col d-grid">
                                                                <label class="form-label text-light">Paid Amount:</label>
                                                            </div>
                                                            <div class="col d-grid">
                                                                <label class="form-label">{OneSalesData.amountProvided.toLocaleString()}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        
                                                </div>

                                                <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                                    <div class="col">
                                                        <div class="row d-grid d-flex">
                                                            <div class="col d-grid">
                                                                <label class="form-label text-light">Change:</label>
                                                            </div>
                                                            <div class="col d-grid">
                                                                <label class="form-label">{OneSalesData.change.toLocaleString()}</label>
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
