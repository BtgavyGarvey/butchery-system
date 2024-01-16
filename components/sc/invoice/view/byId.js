'use client'

import Footer from "../../../layout/footer"
import Header from "../../../layout/header"
import NavBar from "../../../layout/navbar"
import React from "react"
import toast, { Toaster } from "react-hot-toast"
import { Today } from "../../../layout/utils"
import { getAllProducts, getInvoiceDetails, isShopOpened, newInvoiceDetails } from "../../../../src/app/api/v1/controller/butchery/route"

let Branches=[]

export default function ViewProductsPage({session, param}) {
    const {num,branch}=param
    let toastId
    let date=Today()

    const page=React.useRef()
    const searchParams=React.useRef()
    const pageLimit=React.useRef()
    const modalRef2=React.useRef()
    const modalRef1=React.useRef()
    const achievedVal=React.useRef()
    const [dropDownManu, setDropDownManu]=React.useState(false)
    const [ProductData, setProductDataData]=React.useState([])
    const [Invoices, setInvoices]=React.useState([])
    const [OneInvoiceProduct, setOneInvoiceProduct]=React.useState([])
    const [InvoiceProducts, setInvoiceProducts]=React.useState([])
    const [pageCount,setPageCount]=React.useState(0)
    const [outOfPage,setOutOfPage]=React.useState(0)
    const [InvoiceDetails,setInvoiceDetails]=React.useState({
        invoiceNumber:num,
        date:date.fullDate,
        cost:'',
        branch,
        product:'',
        quantity:'',
        value:'',
        addedBy:session.user.id,
    })
    
    React.useEffect(()=>{
        modalRef1.current.style.display='none'
        isShopClosed(1)
    },[])

    const isShopClosed=async(val)=>{

        let shopOpened=await isShopOpened(session.user.branch,session.user.id)

        if (shopOpened) {

            if (val===1) {
                getProductData()
                getInvoiceData()
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
                    getProductData()
                    getInvoiceData()
                }
                return
            }
        }
    }

    const showModal=()=>{
        modalRef1.current.style.display='block'
    }

    const hideModal=()=>{
        setDropDownManu(false)
        modalRef1.current.style.display='none'
    }

    const getTableData=()=>{

        const result1=[]

        let Details=Invoices?.invoices?.details || []


        for (let i = 0; i < Details.length; i++) {

            result1.push(
                <>
                <tr>
                <td>{i+1}</td>
                <td>{Invoices?.products[i]?.code}</td>
                <td>{Invoices?.products[i]?.name}</td>
                <td>{Invoices?.invoices.details[i]?.date}</td>
                <td>{(Invoices?.invoices.details[i]?.quantity).toLocaleString()}</td>
                <td>{(Invoices?.invoices.details[i]?.cost).toLocaleString()}</td>
                <td>{(parseFloat(Invoices?.invoices.details[i]?.quantity) * parseFloat(Invoices?.invoices.details[i]?.cost)).toLocaleString()}</td>
                <td title={Invoices?.users[i]?.firstName+' '+Invoices?.users[i]?.lastName} onClick={()=>{
                    toast(Invoices?.users[i]?.firstName+' '+Invoices?.users[i]?.lastName)}
                    }>{Invoices?.users[i]?.username}</td>
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
            branch,
        }
        let response=await getAllProducts(data)
        setProductDataData(response.products)

        toast.dismiss(toastId)
        
    }

    const getInvoiceData=async()=>{
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })
        let data={
            branch,
            invoiceNumber:num,
        }
        let response=await getInvoiceDetails(data)

        setInvoices(response.invoices)

        toast.dismiss(toastId)
        
    }

    const newInvoices=async(e)=>{

        e.preventDefault()

        toastId=toast.loading('Checking status, please wait...',{
            id:toastId
        })

        await isShopClosed(2)

        // toast.dismiss(toastId)

        InvoiceDetails.value=1

        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })

        let response=await newInvoiceDetails(InvoiceDetails)
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

    const handleInputChange= (e) => {
        const {name, value } = e.target;
        setInvoiceDetails({...InvoiceDetails,[name]:value})
    }

    const handleInputChangeEdit= (e) => {
        const {name, value } = e.target;
        setOneInvoiceProduct({...OneInvoiceProduct,[name]:value})
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
                        Invoice Details</h1>
                    <div class="card shadow">
                        <div class="card-header d-flex justify-content-between py-3">
                            <p class="text-primary m-0 fw-bold">Details Info</p>
                            <div class="dropdown border rounded-pill">
                                <button onClick={()=>{setDropDownManu(!dropDownManu)}}
                                    class="dropdown-btn btn btn-primary bg-primary dropdown-toggle text-center border rounded-pill"
                                    aria-expanded="false" data-bs-toggle="dropdown"
                                    type="button"><strong>No. {num}&nbsp;</strong>
                                </button>
                               
                                <div style={{display:dropDownManu ? 'block' : 'none'}} class="dropdown-menu" >
                                    <a class="dropdown-item"  onClick={()=>{

                                        session.user.access ? (
                                            showModal()
                                        ):(
                                            newInvoices
                                        )

                                        }}>New Invoice</a>

                                </div>
                                    
                            </div>
                        </div>
                        <div class="card-body bg-dark">
                            <div class="table-responsive table-height font-monospace border-2  shadow-sm table"
                                id="dataTable" role="grid" aria-describedby="dataTable_info">
                                <table class="table table-striped  table-hover table-bordered" id="dataTable">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Code</th>
                                            <th>Name</th>
                                            <th>Date</th>
                                            <th>Quantity</th>
                                            <th>Cost</th>
                                            <th>Total Cost</th>
                                            <th>Added By</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{maxHeight:'100vh', overflow:'scroll'}}>
                                        {
                                            getTableData()
                                        }
                                    </tbody>
                                    <tfoot >
                                        <tr>
                                            <td className="fw-bold">No.</td>
                                            <th className="fw-bold">Code</th>
                                            <th className="fw-bold">Name</th>
                                            <th className="fw-bold">Date</th>
                                            <th className="fw-bold">Quantity</th>
                                            <th className="fw-bold">Cost</th>
                                            <td className="fw-bold">Total Cost</td>
                                            <td className="fw-bold">Added By</td>
                                        </tr>
                                    </tfoot>
                                    
                                </table>
                            </div>
                        </div>
                    </div>
                    <div ref={modalRef1} className="modal " role="dialog"
                        tabindex="-1" id="modal-1">
                        <div class="modal-dialog modal-md modal-dialog-centered" role="document">
                            <div class="modal-content bg-dark">
                                <div class="modal-header text-capitalize">
                                    <h2 class="modal-title fw-bolder">New Product Invoice</h2><button class="btn-close"
                                        type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                                </div>
                                <form onSubmit={newInvoices}>
                                    <div class="modal-body">
                                    
                                        <div class="d-grid">
                                            <div class="col ">
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Choose
                                                            Product</label>
                                                            <select onChange={handleInputChange}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control"
                                                             required name="product">
                                                                <option value={''}></option>
                                                                {
                                                                    ProductData?.map((result)=>{
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
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Enter
                                                            Quantity</label>
                                                            <input onChange={handleInputChange}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control"
                                                             required name="quantity" />
                                                    </div>
                                                </div>
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Enter
                                                            Cost Per Unit</label>
                                                            <input onChange={handleInputChange}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control"
                                                              required name="cost" />
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

                    <div ref={modalRef2} className="modal " role="dialog"
                        tabindex="-1" id="modal-1">
                        <div class="modal-dialog modal-md modal-dialog-centered" role="document">
                            <div class="modal-content bg-dark">
                                <div class="modal-header text-capitalize">
                                    <h2 class="modal-title fw-bolder">Edit Product Invoice</h2><button class="btn-close"
                                        type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                                </div>
                                <form onSubmit={newInvoices}>
                                    <div class="modal-body">
                                    
                                        <div class="d-grid">
                                            <div class="col ">
                                                
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Enter
                                                            Quantity</label>
                                                            <input onChange={handleInputChangeEdit}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control"
                                                             required name="quantity" value={OneInvoiceProduct.quantity}/>
                                                    </div>
                                                </div>
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Enter
                                                            Cost Per Unit</label>
                                                            <input onChange={handleInputChangeEdit}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control"
                                                              required name="cost" value={OneInvoiceProduct.cost}/>
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
