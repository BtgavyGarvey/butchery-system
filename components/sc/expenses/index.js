'use client'

import React from "react"
import Footer from "../../layout/footer"
import Header from "../../layout/header"
import NavBar from "../../layout/navbar"
import { getBranches, getExpense, isShopOpened, newExpense } from "../../../src/app/api/v1/controller/butchery/route"
import toast, { Toaster } from "react-hot-toast"
import { DateTime, Today, formatDate } from "../../layout/utils"
import ReactPaginate from "react-paginate"

let soldProducts=[]
let fetchedExpenses=[]

export default function ViewExpensePage({session}) {

    let date=Today()

    const [ExpenseData, setExpenseData]=React.useState([])

    const selectRef=React.useRef()
    const newExpenseDiv=React.useRef()
    const page=React.useRef()
    const DateRef=React.useRef()
    const cashier=React.useRef()
    const branch=React.useRef()
    const pageLimit=React.useRef()
    const product=React.useRef()
    const [pageCount,setPageCount]=React.useState(0)
    const [outOfPage,setOutOfPage]=React.useState(0)
    const [ManyCashiers,setManyCashiers]=React.useState([])
    const [Cashiers,setCashiers]=React.useState([])
    const [NewExpense,setNewExpense]=React.useState({
        amount:'',
        name:'',
        cashier:session.user.id,
        date
    })
    const modalRef2=React.useRef()
    const [dropDownManu, setDropDownManu]=React.useState(false)
    const [Branches, setBranches]=React.useState([])

    let toastId

    React.useEffect(()=>{
        newExpenseDiv.current.style.display='none'
        modalRef2.current.style.display='none'
        DateRef.current=date.date
        branch.current=session.user.branch
        pageLimit.current=25
        page.current=1
        product.current='all'
        cashier.current='all'
        

        isShopClosed(1)

    },[])

    const isShopClosed=async(val)=>{

        let shopOpened=await isShopOpened(session.user.branch,session.user.id)

        if (shopOpened) {

            if (val===1) {
                getExpenseData()
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
                    getExpenseData()
                    getBrunches()
                }
                return
            }
        }
    }

    const getBrunches=async()=>{
        let response=await getBranches(session)
        setBranches(response.branches)
    }

    const handleBranchClick=(e)=>{
        branch.current=e.target.value
        getExpenseData()
    }

    const showModal=()=>{
        modalRef2.current.style.display='block'
        newExpenseDiv.current.style.display='none'
        selectRef.current.style.display='block'
    }

    const hideModal=()=>{
        setDropDownManu(false)
        modalRef2.current.style.display='none'
        newExpenseDiv.current.style.display='none'
        selectRef.current.style.display='block'
    }

    const handlePageClick=(e)=>{
        page.current=e.selected+1
        getExpenseData()
    }

    const handlePageLimitClick=(e)=>{
        pageLimit.current=parseInt(e.target.value)
        getExpenseData()
    }

    const handleDateClick=(e)=>{
        DateRef.current=formatDate(e.target.value)
        getExpenseData()
    }

    const handleExpenseClick=(e)=>{
        product.current=e.target.value
        getExpenseData()
    }

    const handleCashierClick=(e)=>{
        cashier.current=e.target.value
        getExpenseData()
    }

    const handleInputChange=(e)=>{
        const {name,value}=e.target
        setNewExpense({...NewExpense,[name]:value})
    }

    const getExpenseData=async()=>{
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })
        let data={
            cashier:cashier.current,
            date:DateRef.current,
            page:page.current-1,
            limit:pageLimit.current,
            branch:branch.current,
            expense:product.current
        }
        let response=await getExpense(data)

        let pages=Math.ceil(response.expense?.expenses[0]?.pageCount / pageLimit.current)
        setPageCount(pages)
        setOutOfPage(response.expense?.expenses[0]?.pageCount)
        setExpenseData(response.expense?.expenses)
        setManyCashiers(response.expense?.cashierInfo)
        setCashiers(response.expense?.cashiers)
        soldProducts=response.expense?.expenseNames
        toast.dismiss(toastId)
        
    }

    const getTableData=()=>{

        const result1=[]
        fetchedExpenses=[]

        for (let i = 0; i < ExpenseData.length; i++) {

            if (!fetchedExpenses.includes(ExpenseData[i]?.documents.details.moreDateDetails.name)) {
                fetchedExpenses.push(ExpenseData[i]?.documents.details.moreDateDetails.name)
            }

            result1.push(
                <>
                <tr>
                <td>{i+1}</td>
                <td>{ExpenseData[i]?.documents.details.moreDateDetails.name}</td>
                <td>{ExpenseData[i]?.documents.details.moreDateDetails.amount}</td>
                <td>{DateTime(ExpenseData[i]?.documents.details.moreDateDetails.date)}</td>
                <td title={Cashiers[i]?.username} onClick={e=>{toast(Cashiers[i]?.username)}} className="faEdit">{Cashiers[i]?.firstName} {Cashiers[i]?.lastName}</td>
                </tr>
    
                </>
            )
    
        }

        return result1
            
    }

    const showNew=(val)=>{
        
        if (val===1) {
            newExpenseDiv.current.style.display='block'
            selectRef.current.style.display='none'

        } else {
            newExpenseDiv.current.style.display='none'
            selectRef.current.style.display='block'

        }

    }

    const new_Expense=async(e)=>{

        e.preventDefault()

        toastId=toast.loading('Checking status, please wait...',{
            id:toastId
        })

        await isShopClosed(2)

        // toast.dismiss(toastId)
        NewExpense['branch']=branch.current

        if (!NewExpense.amount || !NewExpense.name) {
            toast.error('Fill in all fields')
            return
        }

        if (isNaN(NewExpense.amount)) {
            toast.error('Invalid Amount')
            return
        }

        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })
        
        let response=await newExpense(NewExpense)

        toast.dismiss(toastId)

        if (response.success) {
            toast.success('SUccessful')
            getExpenseData()
            hideModal()
        } else {
            toast.error(`Failed!!! ${response.message}`)
            
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
                        class=" font-monospace text-uppercase fw-bolder text-center text-light bg-success bg-gradient border-2 border-secondary shadow-sm mb-4">
                        View Expenses</h1>
                    <div class="card shadow">
                    <div class="card-header d-flex justify-content-between py-3">
                            <p class="text-primary m-0 fw-bold">Expense Info</p>
                            <div class="dropdown border rounded-pill">
                                <button onClick={()=>{setDropDownManu(!dropDownManu)}}
                                    class="dropdown-btn btn btn-primary bg-primary dropdown-toggle text-center border rounded-pill"
                                    aria-expanded="false" data-bs-toggle="dropdown"
                                    type="button"><strong>Expense&nbsp;</strong>
                                </button>
                               
                                <div style={{display:dropDownManu ? 'block' : 'none'}} class="dropdown-menu" >
                                    <a class="dropdown-item" onClick={showModal}>New Expense</a>
                                    <a class="dropdown-item" href="/sc/expenses/reports">Expense Report Dashboard</a>
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
                                        <label class="form-label">Expense&nbsp;<select onChange={handleExpenseClick}
                                                class="d-inline-block form-select form-select-sm">
                                                <option value="all">All</option>
                                                {
                                                    fetchedExpenses?.map((result)=>{
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
                                                    ManyCashiers?.map((result)=>{
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
                                        <label class="form-label">Date&nbsp;<input type="date" ref={DateRef} onChange={handleDateClick}
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
                                            <th>Name</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Cashier</th>
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
                                            <td><strong>Name</strong></td>
                                            <td><strong>Amount</strong></td>
                                            <td><strong>Date</strong></td>
                                            <td><strong>Cashier</strong></td>
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
                                <div ref={modalRef2} class="modal font-monospace text-center border rounded" role="dialog" tabindex="-1"
                                    id="modal-1">
                                    <div class="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable"
                                        role="document">
                                        <div class="modal-content bg-dark">
                                            <div class="modal-header text-center">
                                                <h1 class="modal-title text-capitalize fw-bolder text-center">New Expense</h1>
                                                <button class="btn-close" type="button" aria-label="Close"
                                                    data-bs-dismiss="modal"></button>
                                            </div>
                                            <form onSubmit={new_Expense} class="modal-body">
                                            <div >
                                                <div class="font-monospace text-center d-flex justify-content-center">
                                                    <p class="lead text-capitalize fs-4 fw-bolder text-center text-danger">{new Date().toDateString()}</p>
                                                </div>
                                                <div class="font-monospace text-center d-grid">
                                                    <div class="row d-flex">
                                                        <div class="col">
                                                            <div class="row d-flex me-xl-0 ms-xl-" style={{width: "100%"}}>
                                                                <div class="col-xl-12 d-grid"><label class="form-label">Amount
                                                                        </label><input onChange={handleInputChange}
                                                                        class="border rounded-pill border-2 border-success shadow-sm form-control-lg"
                                                                        type="text" required name="amount"/></div>
                                                                <div ref={selectRef}>
                                                                <div class="col-xl-12 d-grid"><label class="form-label">Choose Expense
                                                                        </label><select onChange={handleInputChange}
                                                                        class="border rounded-pill border-2 border-success shadow-sm form-control-lg"
                                                                        type="text" name="name">
                                                                        <option></option>
                                                                        {
                                                                            soldProducts?.map((result)=>{
                                                                                return (
                                                                                    <>
                                                                                    <option value={result} >{result}</option>
                                                                                    
                                                                                    </>
                                                                                )

                                                                            })
                                                                        }
                                                                            
                                                                        </select>
                                                                    <div class="col-xl-12 d-flex justify-content-end ">
                                                                    <a href="#" className="fw-bold text-primary" onClick={e=>{showNew(1)}}>Enter New Expense</a>
                                                                    </div>
                                                                </div>
                                                                </div>
                                                                
                                                                
                                                                
                                                            </div>
                                                        
                                                        </div>
                                                        <div ref={newExpenseDiv} class="col">
                                                            <div class="row d-flex me-xl-0 ms-xl-" style={{width: "100%"}}>
                                                                <div class="col-xl-12 d-grid"><label class="form-label">New Expense
                                                                        Name</label><input onChange={handleInputChange}
                                                                        class="border rounded-pill border-2 border-success shadow-sm form-control-lg"
                                                                        type="text" name="name" />
                                                                <div class="col-xl-12 d-flex justify-content-end ">
                                                                <a  href="#" className="fw-bold text-primary" onClick={e=>{showNew(2)}}>Choose Existing</a>
                                                                </div>
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
                                                <button class="btn btn-primary fw-bolder"
                                                    type="submit" data-bs-target="#modal-1" data-bs-toggle="modal">Save</button>
                                            </div>
                                            </form>
                                            
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
