'use client'

import toast, { Toaster } from "react-hot-toast"
import Footer from "../../../layout/footer"
import Header from "../../../layout/header"
import NavBar from "../../../layout/navbar"
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowAltCircleUp, faEdit, faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { editUser, getEmployeePayments, getUsers, newEmployeePayment, resetEmployeePayment, reverseEmployeePayment } from "../../../../src/app/api/v1/controller/user/route"
import ReactPaginate from "react-paginate"
import moment from "moment"
import { DateTime, TimeSeconds, Today } from "../../../layout/utils"

export default function EmployeesPaymentPage({session}) {

    let toastId

    const modalRef1=React.useRef()
    const modalRef2=React.useRef()
    const branch=React.useRef()
    const searchParams=React.useRef()
    const pageLimit=React.useRef()
    const page=React.useRef()
    const [pageCount,setPageCount]=React.useState(0)
    const [outOfPage,setOutOfPage]=React.useState(0)
    const [dropDownManu, setDropDownManu]=React.useState(false)
    const [EmployeesData, setEmployeesData]=React.useState([])
    const [Branches, setBranches]=React.useState([])
    const [AllBranches, setAllBranches]=React.useState([])
    const [Payments, setPayments]=React.useState([])
    const [OnePayments, setOnePayments]=React.useState([])
    const [NewPayment, setNewPayment]=React.useState({
        amount:'',
        employee:'',
        cashier:session.user.id,
        date:'',
    })
    const [oneEmployeesData, setOneEmployeesData]=React.useState()
    // const [timeSeconds, setTimeSeconds]=React.useState(TimeSeconds())

    
    React.useEffect(()=>{
        modalRef1.current.style.display='none'
        modalRef2.current.style.display='none'
        branch.current=session.user.branch
        searchParams.current='all'
        pageLimit.current=25
        page.current=1
        getEmployeesData()
    },[])

    const showModal=(val)=>{

        if (val===1) {
            modalRef1.current.style.display='block'
        } 
        else if(val===2){
            modalRef2.current.style.display='block'
            setDropDownManu(false)
        }
    }

    const hideModal=()=>{
        modalRef1.current.style.display='none'
        modalRef2.current.style.display='none'
    }

    const deleteProduct=async(branch,id,code,val)=>{

        let answer
        let temp

        if (val===-1) {
            answer=confirm(`Are you sure you want to delete product with ID: ${code}`)
            temp=2
        } 
        else if (val===2) {
            answer=confirm(`Are you sure you want to archive product with ID: ${code}`)
            temp=1
        }
        else {
            answer=confirm(`Are you sure you want to restore product with ID: ${code}`)
            temp=2
        }

        if (answer) {
            toastId=toast.loading('Loading, please wait...',{
                id:toastId
            })

            let response=await deleteProducts(branch,id,session,val)
            toast.dismiss(toastId)
            if (response) {
                toast.success('Successful')
                getProductData(temp)
            }
            else{
                toast.error('Failed')
            }
        }
        
    }

    const totalAmount=(amount)=>{

        let cash=0

        for (let i = 0; i < amount.length; i++) {
            cash += parseFloat(amount[i].amount) 
            
        }

        return cash
    }

    const getTableData=()=>{

        const result1=[]

        for (let i = 0; i < EmployeesData.length; i++) {
            result1.push(
                <>
                <tr>
                <td>{i+1}</td>
                <td>{EmployeesData[i]?.documents.username}</td>
                <td>{EmployeesData[i]?.documents.firstName} {EmployeesData[i]?.documents.lastName}</td>
                <td>{(EmployeesData[i]?.documents.salary).toLocaleString()}</td>
                <td>{(totalAmount(Payments[i])).toLocaleString()}</td>
                <td>{(parseFloat(EmployeesData[i]?.documents.salary) - totalAmount(Payments[i])).toLocaleString()}</td>
                <td title="Show More"><FontAwesomeIcon icon={faEye} className="text-primary faEdit" onClick={()=>{
                    setOneEmployeesData(EmployeesData[i]?.documents)
                    setOnePayments(Payments[i])
                    showModal(1)
                }}/></td>
                </tr>
    
                </>
            )
    
        }

        return result1
            
    }

    const getEmployeesData=async()=>{
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })

        let data={
            page:page.current-1,
            pageLimit:pageLimit.current,
            branch:branch.current,
            searchParams:searchParams.current,
        }

        let response=await getUsers(data)

        toast.dismiss(toastId)
        
        // setAddedBy(response.addedBy)
        console.log(response);

        if (response.success) {
            let pages=Math.ceil(response.users?.users[0]?.pageCount / pageLimit.current)

            setEmployeesData(response.users?.users)
            setBranches(response.users?.branches)
            setPayments(response.users?.payments)
            setPageCount(pages)
            setOutOfPage(response.users?.users[0]?.pageCount)

            let brunches=response.users?.branches

            let isObjectInArray=(array,id)=>array.some(obj=>obj.id===id)


            for (let i = 0; i < brunches.length; i++) {

                let id=brunches[i].id
                
                if (!isObjectInArray(AllBranches, id)) {

                    AllBranches.push(brunches[i])
                    
                }
                
            }
        }
        else{
            toast.error(response.message)
        }
        
    }

    const resetPayments=async(value)=>{

        let answer

        alert('This action is NOT reversible')

        if (value===1) {
            answer=confirm(`Are you sure you want to reset payments of all employees in the selected branch?`)
        }
        else{
            answer=confirm(`Are you sure you want to reset payments of the selected employee, ${oneEmployeesData.firstName} ${oneEmployeesData.lastName}?`)
        }

        if (!answer) {
            return
        }


        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })

        let data={
            action:value,
            employee:oneEmployeesData?.id,
            branch:value===1 ? branch.current : oneEmployeesData?.branch,
        }

        let response=await resetEmployeePayment(data)
        
        toast.dismiss(toastId)

        if (response) {
            toast.success('Successful')
            getEmployeesData()
            setDropDownManu(!dropDownManu)
            hideModal()
        }
        else{
            toast.error('Failed!!! Try again later')
        }

    }

    const reversePayments=async(id)=>{

        alert('This action is NOT reversible')

        let answer=confirm(`Are you sure you want to reverse this payment?`)

        if (!answer) {
            return
        }

        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })

        let response=await reverseEmployeePayment(id)
        
        toast.dismiss(toastId)

        if (response) {
            toast.success('Successful')
            getEmployeesData()
            hideModal()
        }
        else{
            toast.error('Failed!!! Try again later')
        }

    }

    const newEmployeesPayment=async(e)=>{

        e.preventDefault()

        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })

        let date=Today()
        NewPayment.date=date.fullDate

        let response=await newEmployeePayment(NewPayment)
        toast.dismiss(toastId)

        if (response.success) {
            toast.success('Successful')
            hideModal()
            getEmployeesData()
        }
        else{
            toast.error(`Failed!!! ${response.message}`)
        }

    }

    const handleInputChangePayment = (e) => {
      
        const { name, value } = e.target;
        setNewPayment({ ...NewPayment, [name]: value });
    }

    const handleInputChangeSearch = (e) => {
      
        searchParams.current= e.target.value ? e.target.value : 'all';

        getEmployeesData()

    }

    const handlePageClick=(e)=>{
        page.current=e.selected+1
        getEmployeesData()
    }

    const handlePageLimitClick=(e)=>{
        pageLimit.current=parseInt(e.target.value)
        getEmployeesData()
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
                        Employees Payments</h1>
                    <div class="card shadow">
                        <div class="card-header d-flex justify-content-between py-3">
                            <p class="text-primary m-0 fw-bold">Payments Info</p>
                            <div class="dropdown border rounded-pill">
                                <button onClick={()=>{setDropDownManu(!dropDownManu)}}
                                    class="dropdown-btn btn btn-primary bg-primary dropdown-toggle text-center border rounded-pill"
                                    aria-expanded="false" data-bs-toggle="dropdown"
                                    type="button"><strong>Payments&nbsp;</strong>
                                </button>
                               
                                <div style={{display:dropDownManu ? 'block' : 'none'}} class="dropdown-menu" >
                                    <a class="dropdown-item" onClick={e=>{showModal(2);setDropDownManu(!dropDownManu)}}>New Payment</a>
                                    <a class="dropdown-item" onClick={e=>{resetPayments(1);setDropDownManu(!dropDownManu)}}>Reset All Payments</a>
                                </div>
                                    
                            </div>
                        </div>
                        <div class="card-body bg-dark">
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
                                            class="form-label">Search&nbsp;<input type="search" class="form-control form-control-sm"
                                                aria-controls="dataTable" placeholder="Search" onChange={handleInputChangeSearch}/>&nbsp;</label></div>
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
                            <div class="table-responsive table-height font-monospace border-1 shadow-sm table mt-2"
                                id="dataTable" role="grid" aria-describedby="dataTable_info">
                                <table class="table table-striped table-hover table-bordered my-0" id="dataTable">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Username</th>
                                            <th>Full Name</th>
                                            <th>Salary</th>
                                            <th>Paid Salary</th>
                                            <th>Remaining Salary</th>
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
                                            <td><strong>Salary</strong></td>
                                            <td><strong>Paid Salary</strong></td>
                                            <td><strong>Remaining Salary</strong></td>
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
                    
                    <div ref={modalRef1} class="modal font-monospace text-center border rounded" role="dialog" tabindex="-1"
                        id="modal-1">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
                            role="document">
                            <div class="modal-content bg-dark">
                                <div class="modal-header text-center">
                                    <h1 class="modal-title text-capitalize fw-bolder text-center">Employee's Payments</h1>
                                    <button class="btn-close" type="button" aria-label="Close"
                                        data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="font-monospace text-center d-flex justify-content-between">
                                        <p class="lead text-capitalize fs-4 fw-bolder text-center text-danger">{oneEmployeesData?.firstName} {oneEmployeesData?.lastName}</p>
                                        <p class="font-monospace fs-5 fw-bolder text-primary">{oneEmployeesData?.username}</p>
                                    </div>
                                    <div class="font-monospace d-grid">
                                        <div class="row d-flex">
                                            <div class="col">
                                                <div class="row me-xl-0 ms-xl-" style={{width: "100%"}}>
                                                <div class="table-responsive table-height font-monospace border-1 shadow-sm table mt-2"
                                                    id="dataTable" role="grid" aria-describedby="dataTable_info">
                                                    <table  class="table table-striped table-hover table-bordered my-0" id="dataTable">
                                                        <thead>
                                                            <tr>
                                                                <th>No.</th>
                                                                <th>Date</th>
                                                                <th>Amount</th>
                                                                <th>Cashier</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {
                                                                OnePayments.map((result,index)=>{

                                                                    return (
                                                                        <>
                                                                        <tr>
                                                                            <td>{index +1}</td>
                                                                            <td>{new Date(result.date).toDateString()} {new Date(result.date).toLocaleTimeString()}</td>
                                                                            <td>{result.amount}</td>
                                                                            <td className="faEdit" title={result.cashierInfo.firstName+' '+result.cashierInfo.lastName} onClick={e=>{toast(result.cashierInfo.firstName+' '+result.cashierInfo.lastName)}}>{result.cashierInfo.username}</td>
                                                                            <td title="Roll Back"><FontAwesomeIcon icon={faArrowAltCircleUp} className="text-warning faEdit" onClick={e=>{reversePayments(result._id)}}/></td>
                                                                        </tr>
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                            
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                                <th>No.</th>
                                                                <th>Date</th>
                                                                <th>Amount</th>
                                                                <th>Cashier</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </tfoot>

                                                    </table>
                                                </div>
                                                </div>
                                                <div className="fw-bold text-light">Total Amount: <span className="fw-bold text-warning">{totalAmount(OnePayments).toLocaleString()}</span></div>
                                               
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer"><button class="btn btn-light" type="button"
                                        data-bs-dismiss="modal" data-bs-target="#modal-1"
                                        data-bs-toggle="modal" onClick={hideModal}>Close</button>
                                        <button class="btn btn-primary fw-bolder"
                                        type="submit" data-bs-target="#modal-1" data-bs-toggle="modal" onClick={e=>{resetPayments(2)}}>Reset</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div ref={modalRef2} class="modal font-monospace text-center border rounded" role="dialog" tabindex="-1"
                        id="modal-1">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
                            role="document">
                            <div class="modal-content bg-dark">
                                <div class="modal-header text-center">
                                    <h1 class="modal-title text-capitalize fw-bolder text-center">New Employee Payment</h1>
                                    <button class="btn-close" type="button" aria-label="Close"
                                        data-bs-dismiss="modal"></button>
                                </div>

                                <form class="modal-body" onSubmit={newEmployeesPayment}>
                                <div >
                                    <div class="font-monospace text-center d-flex justify-content-center">
                                        <p class="lead text-capitalize fs-4 fw-bolder text-center text-danger">Week 1</p>
                                    </div>
                                    <div class="font-monospace text-center d-flex justify-content-center">
                                        <p class="font-monospace fs-5 fw-bolder text-primary">{new Date().toDateString()}</p>
                                    </div>
                                    <div class="font-monospace text-center d-grid">
                                        <div class="row d-flex">
                                            
                                            <div class="col">
                                                <div class="row d-flex me-xl-0 ms-xl-" style={{width: "100%"}}>
                                                   
                                                    <div class="col-xl-12 d-grid"><label
                                                            class="form-label">Paid Amount</label><input onChange={handleInputChangePayment}
                                                            class="border rounded-pill border-2 border-success shadow-sm form-control-lg"
                                                            type="text" required name="amount" /></div>
                                                    <div class="col-xl-12 d-grid"><label class="form-label">Employee</label><select onChange={handleInputChangePayment}
                                                            class="border rounded-pill border-2 border-success shadow-sm form-control-lg"
                                                            name="employee" required>
                                                                <option></option>
                                                            {
                                                                EmployeesData?.map((result)=>{
                                                                    return (
                                                                        <>
                                                                        <option value={result.documents.id}>{result.documents.firstName} {result.documents.lastName} ({result.documents.username})</option>
                                                                        </>
                                                                    )
                                                                })
                                                            }    
                                                            </select></div>
                                                </div>
                                               
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer"><button class="btn btn-light" type="button"
                                        data-bs-dismiss="modal" data-bs-target="#modal-1"
                                        data-bs-toggle="modal" onClick={hideModal}>Close</button><button class="btn btn-primary bg-primary fw-bolder"
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
    </>
  )
}
