'use client'

import React from "react"
import Footer from "../../../../layout/footer"
import Header from "../../../../layout/header"
import NavBar from "../../../../layout/navbar"
import toast, { Toaster } from "react-hot-toast"
import { getProducts, newSale } from "../../../../../src/app/api/v1/controller/butchery/route"
import { Today } from "../../../../layout/utils"

let paymentType={
    type:1,
    cash:0,
    m_pesa:0
}

let sellData=[]

export default function MakeSalesPage({session,data}) {

    let toastId
    const modalRef1=React.useRef()

    const [ProductData, setProductDataData]=React.useState(data.products)
    const [Branches, setBranches]=React.useState([])
    const [AddedBy, setAddedBy]=React.useState([])
    const [oneProductDataData, setOneProductDataData]=React.useState()

    const getProductData=async(val)=>{
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })
        let response=await getProducts(session,val)

        setProductDataData(response.products)
        toast.dismiss(toastId)
        
    }

    React.useEffect(()=>{
        modalRef1.current.style.display='none'
        bothRef.current.style.display='none'
    },[])


    let checkRef={

    }
    let inputRef={

    }
    let totalState={

    }
    
// console.log(ProductData);
    const paidAmount=React.useRef()
    const saveBtn=React.useRef()
    const dialogBox=React.useRef()
    const bothRef=React.useRef()
    const paidAmountCash=React.useRef()
    const paidAmountMpesa=React.useRef()
    const [total, setTotal]=React.useState(totalState)
    const [change, setChange]=React.useState()
    const [display, setDisplay]=React.useState(false)
    const [total_Price, setTotal_Price]=React.useState(0)

    if (ProductData.length>0) {

        for (let i = 0; i < ProductData.length; i++) {
            checkRef[`checkBox${i}`]=React.useRef()
            inputRef[`input${i}`]=React.useRef()
            totalState[`total${i}`]=''
        }
    }

    React.useEffect(()=>{

        if (ProductData.length>0) {
            for (let i = 0; i < ProductData.length; i++) {
                inputRef[`input${i}`].current.readOnly=true
                saveBtn.current.disabled=true
                ProductData[i]['quantitySold']=0
                ProductData[i]['totalPrice']=0
                ProductData[i]['sellingTime']=Today()
            }
        }
    },[ProductData])

    const readOnly=()=>{
        if (ProductData) {
            for (let i = 0; i < ProductData.length; i++) {
                inputRef[`input${i}`].current.readOnly=true
                checkRef[`checkBox${i}`].current.checked=false
                inputRef[`input${i}`].current.value=''
                saveBtn.current.disabled=true
                ProductData[i]['quantitySold']=0
                ProductData[i]['totalPrice']=0
                ProductData[i]['sellingTime']=Today()
                setTotal_Price(0)
                // paidAmount.current.value=''
                setTotal((prev)=>({
                    ...prev,
                    [`total${i}`]:''
                }))

            }
        }
    }

    const handleInputChange1=(e)=>{
        const { name, value } = e.target;

        if (isNaN(value)) {
            toast.error('Invalid Input')
            saveBtn.current.disabled=true
            return
        }

        if (name==='type') {
            paymentType.type=parseInt(value)

            if (value==='1' || value==='2') {
                bothRef.current.style.display='none'
                paidAmountMpesa.current.value=''
            }
            else{
                bothRef.current.style.display='block'
                paymentType.m_pesa='0'
                setDisplay(true)
            }
        }

        if (total_Price>0) {
            if (name==='cash') {
                paymentType.cash=value
            } 
            else if(name==='m_pesa') {
                paymentType.m_pesa=value
            }
        }
        else{
            paymentType.cash=0
            paymentType.m_pesa=0

        }



        if ((value==='' || value===null)) {

            if (name==='cash') {
                paymentType.cash='0'
            } 
            else if(name==='m_pesa') {
                paymentType.m_pesa='0'
            }
        }

        totalChange(total_Price)
    }

    const handleInputChange=(val)=>{

        const amountEntered=inputRef[`input${val}`].current.value

        if (isNaN(amountEntered)) {
            toast.error('Invalid Input',{id:toastId})
            return
        }
        else{
            let totalQuantity=(amountEntered/ProductData[val].price).toFixed(4)

            if (totalQuantity > ProductData[val].quantity) {
                toast.error('Insufficient Available Quantity',{id:toastId})
                return
            }


            ProductData[val]['quantitySold']=parseFloat(totalQuantity)
            ProductData[val]['totalPrice']=parseFloat(amountEntered)

            setTotal((prev)=>({
                ...prev,
                [`total${val}`]:totalQuantity
            }))

            Main()
        }

    }

    const reload=()=>{
        dialogBox.current.close()
        getProductData(1)

        // router.push('/sc/user/medicine/sales#fourth')

    }

    // const insertItem=(arr: any,index: any,newItem: any)=>{
    //     ...array.slice(0,index),
    //     newItem,
    //     ...array.slice(index)
    // }

    const checkChange=(val)=>{


        if (checkRef[`checkBox${val}`].current.checked) {
            inputRef[`input${val}`].current.readOnly=false
            inputRef[`input${val}`].current.focus()


            sellData.splice(val,0,ProductData[val])
            
            setTotal((prev)=>({
                ...prev,
                [`total${val}`]:0
            }))
            
        }
        else{
            inputRef[`input${val}`].current.readOnly=true

            sellData.splice(val,1)
            // sellData = sellData.filter((element, index) => index !== val);

            setTotal((prev)=>({
                ...prev,
                [`total${val}`]:''
            }))

            inputRef[`input${val}`].current.value=''

            ProductData[val]['quantitySold']=0
            ProductData[val]['totalPrice']=0

        }

        Main()


    }

    const getTableData=()=>{
        const result1=[]

        if (ProductData) {

            for (let i = 0; i < ProductData.length; i++) {
                result1.push(
                    <>
                    <tr>
                    <td>{i+1}</td>
                    <td>{ProductData[i]?.name}</td>
                    <td>{ProductData[i]?.quantity}</td>
                    <td>{ProductData[i]?.price}</td>
                    <td ><input ref={inputRef[`input${i}`]} type="text" className="form-control" onChange={(e)=>handleInputChange(i)}></input></td>
                    <td>{total[`total${i}`]}</td>
                    <td><input ref={checkRef[`checkBox${i}`]} type="checkbox" onChange={(e)=>checkChange(i)}></input></td>
                    </tr>
        
                    </>
                )
                
            }
            
        }

        return result1
    }

    const submit=async()=>{
        
        for (let i = 0; i < sellData.length; i++) {
            sellData[i]['sellingTime']=Today()
            sellData[i]['paymentType']=paymentType
        }

        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })

        let response=await newSale(sellData,session)

        // let response=await axios.post('/api/v1/controller/medicine?action=newSale',sellData)            
        toast.dismiss(toastId)
        if (response.success===true) {
          toast.success(`Successful!`,{id:toastId})
            readOnly()
            modalRef1.current.style.display='block'
            sellData=[]
        }
        else{
            toast.error(`Failed! ${response.message}`,{id:toastId})
        }

    }
    
    let myChange

    const totalChange=(val)=>{

        let paid_amount=0

        if (paymentType.type===1 || paymentType.type===2) {
            paid_amount=paymentType.cash
            
        } else if (paymentType.type===3){
            paid_amount=parseInt(paymentType.cash) + parseInt(paymentType.m_pesa)
        }

        if (isNaN(paid_amount)) {
            saveBtn.current.disabled=true
            toast.error('Invalid Paid Amount',{id:toastId})
            return
        }

        if (total_Price>0 && paid_amount>0) {

            myChange=paid_amount-val
            setChange(myChange)

            if (myChange>-1) {
                saveBtn.current.disabled=false
            }
            else{
                saveBtn.current.disabled=true
            }
        }
        else{
            setChange('')
            paidAmountCash.current.value=''
            paidAmountMpesa.current.value=''
            saveBtn.current.disabled=true

        }


    }

    const Main=()=>{

        let currentPrice=0

        if (sellData.length>0) {
            for (let i = 0; i < sellData.length; i++) {
                currentPrice=currentPrice+sellData[i]['totalPrice']
            }
        }

        if (currentPrice<1) {
            paymentType.cash=0
            paymentType.m_pesa=0
        }

        setTotal_Price(currentPrice)

        totalChange(currentPrice)
       
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
                        sell Products</h1>
                    <div class="card shadow">
                        <div class="card-header py-3">
                            <p class="text-primary m-0 fw-bold">Product Info</p>
                        </div>
                        <div class="card-body bg-dark">
                            <div class="row">
                                <div class="col-md-6 text-nowrap">
                                    <div id="dataTable_length" class="dataTables_length" aria-controls="dataTable">
                                        <label class="form-label">Show&nbsp;<select
                                                class="d-inline-block form-select form-select-sm">
                                                <option value="10" selected="">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>&nbsp;</label></div>
                                </div>
                                <div class="col-md-6">
                                    <div class="text-md-end dataTables_filter" id="dataTable_filter"><label
                                            class="form-label"><input type="search" class="form-control form-control-sm"
                                                aria-controls="dataTable" placeholder="Search" /></label></div>
                                </div>
                            </div>
                            <div class="table-responsive font-monospace text-center border-2  shadow-sm table mt-2"
                                id="dataTable" role="grid" aria-describedby="dataTable_info">
                                <table class="table table-striped table-hover table-bordered my-0" id="dataTable">
                                    <thead >
                                        <tr>
                                            <th>Number</th>
                                            <th>Name</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th style={{width:'15%'}}>Amount</th>
                                            <th>Sold</th>
                                            <th colspan="1" style={{width:'3%'}}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* <tr>
                                            <td>1</td>
                                            <td>Beef Liver</td>
                                            <td>50.8798</td>
                                            <td>640</td>
                                            <td><input class="border rounded-pill border-2 border-success shadow"
                                                    type="number" data-bss-hover-animate="pulse"
                                                    placeholder="Enter amount" readonly="" /></td>
                                            <td>0</td>
                                            <td><input type="checkbox" data-bss-hover-animate="pulse" /></td>
                                        </tr> */}
                                        {
                                            getTableData()
                                        }
                                    </tbody>
                                    
                                </table>
                            </div>
                            <div class="row">
                                <div class="col-md-6 align-self-center">
                                    <p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">
                                        Showing 1 to 10 of 27</p>
                                </div>
                                <div class="col-md-6">
                                    <nav
                                        class="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
                                        <ul class="pagination">
                                            <li class="page-item disabled"><a class="page-link" aria-label="Previous"
                                                    href="#"><span aria-hidden="true">«</span></a></li>
                                            <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                                            <li class="page-item"><a class="page-link" aria-label="Next" href="#"><span
                                                        aria-hidden="true">»</span></a></li>
                                        </ul>
                                    </nav>
                                </div>
                                <div class="col-sm-12" style={{width: "100%"}}>
                                    <div class="text-center d-flex flex-grow-1 flex-shrink-1 flex-fill justify-content-center align-items-start align-content-start align-self-start flex-wrap order-first m-auto"
                                        style={{width: "100%"}}>
                                        <div class="row text-center d-flex">
                                            <div
                                                class="col font-monospace text-uppercase text-center d-flex align-content-start align-self-center flex-wrap order-first m-auto">
                                                <div class="row text-start d-grid me-xl-0">
                                                    <div class="col d-grid"><strong
                                                            class="text-uppercase text-center mb-xl-0 pb-xl-2">Total
                                                            Amount</strong><input value={total_Price}
                                                            class="border tex-align-center fw-bold text-primary rounded-pill border-2 border-success shadow form-control-lg"
                                                            type="text" required
                                                            disabled /></div>
                                                    <div class="col d-grid"><strong
                                                            class="text-uppercase text-center pt-xl-0 mt-xl-3">Change</strong>
                                                            <input value={change?.toLocaleString()}
                                                            class="border tex-align-center fw-bold text-danger rounded-pill border-2 border-success shadow form-control-lg"
                                                            type="text" disabled
                                                             />
                                                    </div>
                                                </div>
                                                <div class="row d-grid ms-xl-0">
                                                    <div class="col text-center d-grid"><strong
                                                            class="text-uppercase text-align-center mb-xl-2"
                                                            >Payment Type</strong><select onChange={handleInputChange1}
                                                            class="border tex-align-center fw-bold rounded-pill border-2 border-success shadow form-select-lg"
                                                            name="type" >
                                                            <option value={1}>Cash</option>
                                                            <option value={2}>M-Pesa</option>
                                                            <option value={3}>Cash &amp; M-Pesa</option>
                                                        </select></div>
                                                    
                                                    <div class="col d-grid">
                                                        <strong
                                                            class="text-uppercase text-center text-danger mt-xl-2">Enter
                                                            Amount</strong><span class="text-start tex-align-center fw-bold text-primary text-decoration-italic"
                                                            style={{fontStyle: "italic",marginTop: "3px",display: display ? 'block' : 'none'}}>Cash
                                                            Amount</span><input ref={paidAmountCash} onChange={(e)=>{
                                                                handleInputChange1(e);
                                                                // totalChange(total_Price)
                                                            }}
                                                            class="border rounded-pill fw-bold text-success border-2 border-danger shadow form-control-lg"
                                                            type="text" name="cash"
                                                            />
                                                            <div ref={bothRef}>
                                                                <span 
                                                                class="text-start tex-align-center fw-bold text-primary text-decoration-italic"
                                                                style={{fontStyle: "italic",marginTop: "3px",display: display ? 'block' : 'none'}}>M-Pesa
                                                                Amount</span><input ref={paidAmountMpesa} onChange={(e)=>{
                                                                    handleInputChange1(e);
                                                                    // totalChange(total_Price)
                                                                }}
                                                                class="border rounded-pill fw-bold text-danger border-2 border-success shadow form-control-lg"
                                                                type="text" name="m_pesa"
                                                                />
                                                            </div>
                                                            
                                                            
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="me-xl-5 ms-xl-5 mt-xl-5 mb-xl-5"><button ref={saveBtn} onClick={submit}
                                                class="btn btn-outline-primary btn-md active font-monospace text-uppercase fs-1 fw-bolder text-center border rounded-pill border-2 border-success shadow"
                                                type="submit" style={{marginTop: "6px"}}>Make Sale</button></div>
                                    </div>
                                </div>

                            </div>
                            <div ref={modalRef1} class="modal" role="dialog"
                        tabindex="-1" id="modal-2">
                        <div class="modal-dialog modal-md modal-dialog-centered" role="document">
                            <div class="modal-content bg-dark">
                                <div class="modal-header text-capitalize d-flex justify-content-center">
                                    <h1 class="modal-title fw-bolder text-warning">CHANGE</h1>
                                </div>
                                <div class="display-2 modal-body d-flex justify-content-center">
                                    
                                    <h1 className="text-light fw-bold">{change?.toLocaleString()}</h1>
                                        
                                </div>
                                <div class="modal-footer d-flex justify-content-center">
                                    
                                        <button class="btn btn-primary bg-success btn-lg"
                                        type="button" data-bs-target="#modal-2" data-bs-toggle="modal" onClick={()=>{
                                            getProductData(1)
                                            modalRef1.current.style.display='none'
                                        }}>CLOSE</button>
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
