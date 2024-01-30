'use client'

import dynamic from 'next/dynamic'
import React from "react"
import Footer from "../../../../layout/footer"
import Header from "../../../../layout/header"
import NavBar from "../../../../layout/navbar"
import toast, { Toaster } from "react-hot-toast"
import { getProducts, isShopOpened, newSale } from "../../../../../src/app/api/v1/controller/butchery/route"
import { DayTime, Today } from "../../../../layout/utils"
import lodash from 'lodash'
import printJS from 'print-js'

let paymentType={
    type:1,
    cash:0,
    m_pesa:0
}

let sellData=[]
let branch

export default function MakeSalesPage({session,data}) {

    let toastId
    const modalRef1=React.useRef()

    const [ProductData, setProductDataData]=React.useState(data?.products)
    const htmlValue=React.useRef('1')
    branch=data?.products[0]?.documents.branches.name

    const getProductData=async()=>{

        let data={
            page:0,
            pageLimit:1000,
            branch:session?.user.branch,
            searchParams:'all',
            value:1
        }
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })
        let response=await getProducts(data)

        setProductDataData(response.products)

        toast.dismiss(toastId)
        
    }

    React.useEffect(()=>{
        modalRef1.current.style.display='none'
        bothRef.current.style.display='none'
        
        // const foundPrinters=Printer.getPrinters()
        // setPrinters(foundPrinters)
    },[])


    let checkRef={

    }
    let inputRef={

    }
    let totalState={

    }
    
    const promptM_Pesa=React.useRef()
    const saveBtn=React.useRef()
    const totalPrice=React.useRef(0)
    const bothRef=React.useRef()
    const paidAmountCash=React.useRef()
    const paidAmountMpesa=React.useRef()
    const [total, setTotal]=React.useState(totalState)
    const [change, setChange]=React.useState()
    const [display, setDisplay]=React.useState(false)
    const [Printers, setPrinters]=React.useState([])

    if (ProductData.length>0) {

        for (let i = 0; i < ProductData.length; i++) {
            checkRef[`checkBox${i}`]=React.useRef()
            inputRef[`input${i}`]=React.useRef()
            totalState[`total${i}`]=''
        }
    }

    React.useEffect(()=>{
        saveBtn.current.disabled=true
        if (ProductData.length>0) {
            for (let i = 0; i < ProductData.length; i++) {
                inputRef[`input${i}`].current.readOnly=true
                ProductData[i].documents['quantitySold']=0
                ProductData[i].documents['totalPrice']=0
                ProductData[i].documents['sellingTime']=Today()
            }
        }
    },[ProductData])

    const isShopClosed=async()=>{

        let shopOpened=await isShopOpened(session.user.branch,session.user.id)

        if (!shopOpened) {

            if (session.user.access===1) {
                toast('Your Employer has closed the shop')
                signOut()
                router.push('/')
            }
            
        }
        
    }

    const printReceipt=()=>{

        const domainName = window.location.hostname;
        try {

            const receiptHTML = `
            <div class="receipt" style="max-width: 350px; margin: auto; border: 1px solid #ccc; padding: 20px;">
                <div class="header" style="text-align: center; margin-bottom: 10px;">
                <div class="store-name" style="font-size: 1.5em; font-weight: bold;">${session.user.butcheryName} Butchery</div>
                <div class="branch" style="font-weight: bold;">${session.user.branchName} Branch</div>
                <div class="contact" style="font-size: 0.8em;">
                    0759903908<br />
                    btgavygarvey@gmail.com
                </div>
                </div>
                
                <div class="datetime" style="text-align: center; margin-bottom: 10px;">
                ${DayTime()} ${Today().time}
                </div>
                
                <hr style="border: 0; border-top: 1px solid #000; margin: 10px 0;" />

                <div class="items" style="margin-bottom: 10px;">
                


                <table style="width: 100%; margin-bottom: 10px;">
                <colgroup>
                    <col style="width: 10%">
                    <col style="width: 30%">
                    <col style="width: 30%">
                    <col style="width: 30%">
                </colgroup>
                    <thead>
                        <tr style="font-weight: bold;">
                        <td>No.</td>
                        <td>Product</td>
                        <td>Quantity</td>
                        <td>Total (KShs.)</td>
                        </tr>
                    </thead>
                    <tbody>
                    ${sellData?.map((result,key) => `
                        <tr key=${result.id}>
                            <td>${key+1}</td>
                            <td>${result.name}</td>
                            <td>${result.quantitySold}</td>
                            <td>${result.totalPrice}.00</td>
                        </tr>
                    `).join('')}
                    </tbody>
                </table>
                
                <hr style="border: 0; border-top: 1px solid #000; margin: 10px 0;" />
                </div>

                <div style="margin-bottom: 5px; display: flex; justify-content: space-between;">
                <span class="received-amount">Received Amount:</span>
                <span class="change-amount">KSh ${parseInt(totalPrice.current)+parseInt(change)}.00</span>
                </div>
                <div style="margin-bottom: 5px; display: flex; justify-content: space-between;">
                <span class="total-amount">Total amount:</span>
                <span class="total-amount">KSh ${totalPrice.current}.00</span>
                </div>
                <div style="margin-bottom: 5px; display: flex; justify-content: space-between;">
                <span class="change-amount">Change Amount:</span>
                <span class="change-amount">KSh ${change}.00</span>
                </div>

                <hr style="border: 0; border-top: 1px solid #000; margin: 10px 0;" />

                <div class="footer" style="font-size: 0.8em; display: flex; justify-content: space-between;">
                <span style="font-style: italic;">You were served by:</span>
                <span style="font-style: italic; font-weight: bold;">${session.user.name}</span>
                </div>
                <div class="footer" style="font-size: 0.8em; display: flex; justify-content: center;">
                <span style="font-style: italic; font-weight: bold;">Wellcome Back.</span>
                </div>
                <div class="footer" style="font-size: 0.8em; display: flex; justify-content: space-between;">
                <span style="font-style: italic;">System Website:</span>
                <span style="font-style: italic; font-weight: bold;">${domainName}</span>
                </div>
            </div>
            `;

            printJS({
                printable: receiptHTML, // ID, class, or HTML element to print
                type: 'raw-html', // 'html' or 'raw-html'
                // header: 'Print Example', // Optional header
                // style: '@media print { body {font-family: monospace; font-size: 12pt } }', // Optional styles
            });

           
              console.log("Print done!");
            
        } catch (error) {
            console.error("Print failed: ", error)
          
        }
    }

    const readOnly=()=>{
        totalPrice.current=0
        // setTotal_Price(0)
        saveBtn.current.disabled=true

        if (ProductData) {
            for (let i = 0; i < ProductData.length; i++) {
                inputRef[`input${i}`].current.readOnly=true
                checkRef[`checkBox${i}`].current.checked=false
                inputRef[`input${i}`].current.value=''
                ProductData[i].documents['quantitySold']=0
                ProductData[i].documents['totalPrice']=0
                ProductData[i].documents['sellingTime']=Today()
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
                if (value==='1') {
                    promptM_Pesa.current.style.display='none'
                    
                } else {
                    promptM_Pesa.current.style.display='block'
                    
                }
                bothRef.current.style.display='none'
                paidAmountMpesa.current.value=''
                setDisplay(false)

            }
            else{

                promptM_Pesa.current.style.display='block'
                bothRef.current.style.display='block'
                paymentType.m_pesa='0'
                setDisplay(true)
            }
        }

        if (totalPrice.current>0) {
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

        totalChange(totalPrice.current)
    }

    const handleInputChange=(val)=>{

        const amountEntered=inputRef[`input${val}`].current.value

        if (isNaN(amountEntered)) {
            toast.error('Invalid Input',{id:toastId})
            return
        }
        else{
            let totalQuantity=(amountEntered/ProductData[val].documents.price).toFixed(4)

            if (totalQuantity > ProductData[val].documents.quantity) {
                toast.error('Insufficient Available Quantity',{id:toastId})
                return
            }


            ProductData[val].documents['quantitySold']=parseFloat(totalQuantity)
            ProductData[val].documents['totalPrice']=parseFloat(amountEntered)

            setTotal((prev)=>({
                ...prev,
                [`total${val}`]:totalQuantity
            }))

            Main()
        }

    }

    const promptM_PesaAmount=async()=>{
        
        let answer=prompt('Enter customer phone number')

        if (!answer) {
            return
        }

        if (isNaN(answer)) {
            toast.error('Invalid input')
            return
        }

        if (answer.length<10) {
            toast.error('Input is too short')
            return
        }

        toast.success(answer)

    }

    const checkChange=(val,arr)=>{


        if (checkRef[`checkBox${val}`].current.checked) {
            inputRef[`input${val}`].current.readOnly=false
            inputRef[`input${val}`].current.focus()


            sellData.push(ProductData[val]?.documents)
            
            setTotal((prev)=>({
                ...prev,
                [`total${val}`]:0
            }))
            
        }
        else{
            inputRef[`input${val}`].current.readOnly=true

            lodash.pullAllWith(sellData, [arr],lodash.isEqual)

            setTotal((prev)=>({
                ...prev,
                [`total${val}`]:''
            }))

            inputRef[`input${val}`].current.value=''

            ProductData[val].documents['quantitySold']=0
            ProductData[val].documents['totalPrice']=0

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
                    <td>{ProductData[i]?.documents.name}</td>
                    <td>{ProductData[i]?.documents.quantity}</td>
                    <td>{ProductData[i]?.documents.price}</td>
                    <td ><input ref={inputRef[`input${i}`]} type="text" className="form-control" onChange={(e)=>handleInputChange(i)}></input></td>
                    <td>{total[`total${i}`]}</td>
                    <td><input ref={checkRef[`checkBox${i}`]} type="checkbox" onChange={(e)=>checkChange(i,ProductData[i]?.documents)}></input></td>
                    </tr>
        
                    </>
                )
                
            }
            
        }

        return result1
    }

    const submit=async(e)=>{

        e.preventDefault()

        let cash=parseInt(totalPrice.current) - parseInt(paymentType.m_pesa)
        paymentType.cash=cash

        toastId=toast.loading('Checking status, please wait...',{
            id:toastId
        })

        await isShopClosed()

        toast.dismiss(toastId)
        
        for (let i = 0; i < sellData.length; i++) {
            sellData[i]['sellingTime']=Today()
            sellData[i]['paymentType']=paymentType
        }

        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })

        let response=await newSale(sellData,session)

        toast.dismiss(toastId)
        if (response.success===true) {
            
            printReceipt()
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

        if (totalPrice.current>0 && paid_amount>0) {

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

            sellData.map((result)=>{
                currentPrice=currentPrice+result['totalPrice']
            })
            
        }

        if (currentPrice < 1) {
            paymentType.cash=0
            paymentType.m_pesa=0
        }

        totalPrice.current=currentPrice
        // setTotal_Price(currentPrice)

        totalChange(totalPrice.current)
       
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
                        <div class="card-header py-3 d-flex justify-content-between">
                            <p class="text-primary m-0 fw-bold">Product Info</p>
                            <p class="text-success m-0 fw-bold">{branch} Branch</p>
                        </div>
                        <div class="card-body bg-dark">

                        <div class="table-responsive font-monospace border-2 table-height  shadow-sm table mt-2"
                                id="dataTable" role="grid" aria-describedby="dataTable_info">
                                <table class="table table-striped table-hover table-bordered my-0" id="dataTable">
                                    <thead >
                                        <tr>
                                            <th>No.</th>
                                            <th>Name</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th style={{width:'15%'}}>Amount</th>
                                            <th>Sold</th>
                                            <th colspan="1" style={{width:'3%'}}>Action</th>
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
                                        <td><strong>Name</strong></td>
                                        <td><strong>Quantity</strong></td>
                                        <td><strong>Price</strong></td>
                                        <td style={{width:'15%'}}><strong>Amount</strong></td>
                                        <td><strong>Sold</strong></td>
                                        <td colspan="1" style={{width:'3%'}}><strong>Action</strong></td>
                                        </tr>
                                        
                                    </tfoot>
                                    
                                </table>
                            </div>

                            <div class="row">
                    
                                <div class="col-md-12">
                                    <div class="p-0">

                                        <form onSubmit={submit} className="user">
                                        <div class="row mb-3">
                                            <div class="col-md-6 mb-3 mb-sm-0 d-grid">
                                                <strong
                                                class="text-uppercase text-light text-center">Total
                                                Amount</strong><input value={totalPrice.current}
                                                class="border text-center fw-bold text-primary rounded-pill border-2 border-success shadow form-control"
                                                type="text" required
                                                disabled />
                                            </div>
                                            <div class="col-md-6 mb-3 mb-sm-0 d-grid">
                                                <strong
                                                class="text-uppercase text-light text-center mb-xl-2">Change</strong>
                                                <input value={change?.toLocaleString()}
                                                class="border text-center text-danger fw-bold rounded-pill border-2 border-success shadow form-control"
                                                type="text" disabled
                                                    />
                                                
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6 mb-3 mb-sm-0 d-grid">
                                                <strong
                                                class="text-uppercase text-light text-center mb-xl-2"
                                                >Payment Type</strong>
                                                <select onChange={handleInputChange1}
                                                class="border text-center fw-bold rounded-pill border-2 border-success shadow form-select"
                                                name="type" >
                                                <option value={1}>Cash</option>
                                                <option value={2}>M-Pesa</option>
                                                <option value={3}>Cash &amp; M-Pesa</option>
                                                </select>
                                            </div>
                                            <div class="col-md-6 mb-3 mb-sm-0 d-grid">
                                                
                                                <strong
                                                class="text-uppercase text-light text-center text-danger mt-xl-2">Enter
                                                Amount</strong><span class="text-start fw-bold text-warning text-decoration-italic"
                                                style={{fontStyle: "italic",marginTop: "3px", display: display ? 'block' : 'none'}}>Cash
                                                Amount</span><input ref={paidAmountCash} onChange={(e)=>{
                                                    handleInputChange1(e);
                                                }}
                                                class="border rounded-pill  text-center fw-bold text-success border-2 border-danger shadow form-control"
                                                type="text" name="cash"
                                                />
                                                <div ref={bothRef} className='col-md-12 mb-3 mb-sm-0 bothRef'>
                                                    <span 
                                                    class="text-start fw-bold text-warning text-decoration-italic"
                                                    style={{fontStyle: "italic",marginTop: "3px", display: display ? 'block' : 'none'}}>M-Pesa
                                                    Amount</span><input ref={paidAmountMpesa} onChange={(e)=>{
                                                        handleInputChange1(e);
                                                    }}
                                                    class="border col-md-12  text-center rounded-pill fw-bold text-success border-2 border-success shadow form-control"
                                                    type="text" name="m_pesa"
                                                    />
                                                    
                                                </div>
                                                
                                            </div>
                                            <div className="col-md-12 d-flex justify-content-center p-3">
                                            <a onClick={promptM_PesaAmount} ref={promptM_Pesa} className="bothRef text-light text-decoration-underlined" href="#">Prompt Customer</a>
                                            </div>
                                        </div>

                                        <div class="row mb-3">
                                        <div class="col-sm-12 mb-3 mb-sm-0 d-flex justify-content-center"><button ref={saveBtn} 
                                                class="btn btn-outline-primary btn-md active font-monospace text-uppercase fs-1 fw-bolder text-center border rounded-pill border-2 border-success shadow"
                                                type="submit" style={{marginTop: "6px"}}>Make Sale</button></div>
                                        </div>
                                        </form>

                                    </div>
                                </div>
                            </div>
                            
                            <div ref={modalRef1} class="modal" role="dialog"
                                tabindex="-1" id="modal-2">
                                <div class="modal-dialog modal-md modal-dialog-centered" role="document">
                                    <div class="modal-content bg-primary">
                                        <div class="modal-header text-capitalize d-flex justify-content-center">
                                            <h1 class="display-4 modal-title fw-bolder text-warning">CHANGE</h1>
                                        </div>

                                        <form onSubmit={e=>{
                                            e.preventDefault()
                                            getProductData()
                                            modalRef1.current.style.display='none'
                                        }}>
                                        <div class="display-2 modal-body d-flex justify-content-center">
                                            
                                            <h1 className="display-1 text-light fw-bold">{change?.toLocaleString()}</h1>
                                                
                                        </div>
                                        <div class="modal-footer d-flex justify-content-center">
                                            
                                            <button class="btn btn-primary bg-success btn-lg"
                                            type="submit" data-bs-target="#modal-2" data-bs-toggle="modal">CLOSE</button>
                                        </div>
                                        </form>
                                        
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
