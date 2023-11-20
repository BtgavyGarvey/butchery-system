'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Footer from "../../../layout/footer"
import Header from "../../../layout/header"
import NavBar from "../../../layout/navbar"
import { faArchive, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import React from "react"
import toast, { Toaster } from "react-hot-toast"

export default function ViewProductsPage() {

    let toastId

    const modalRef1=React.useRef()
    const modalRef2=React.useRef()
    const [dropDownManu, setDropDownManu]=React.useState(false)
    const [achivedProducts, setAchivedProducts]=React.useState(false)
    const [ProductData, setProductDataData]=React.useState([])
    const [oneProductDataData, setOneProductDataData]=React.useState()
    const [productInfo, setproductInfo]=React.useState('Available Products')
    const [ProductIssue, setProductIssue]=React.useState({
        productId:'',
        quantityIssue:''
    })

    
    React.useEffect(()=>{
        modalRef1.current.style.display='none'
        modalRef2.current.style.display='none'
    },[modalRef1,modalRef2])

    const showModal=(val)=>{

        if (val===1) {
            modalRef1.current.style.display='block'
            
        } else if(val===2){
            modalRef2.current.style.display='block'
            setDropDownManu(false)
        }
    }

    const hideModal=(val)=>{

        if (val===1) {
            modalRef1.current.style.display='none'
            
        } else if(val===2){
            modalRef2.current.style.display='none'
            
        }
    }

    const deleteProduct=async(branch, id)=>{

        let answer=confirm(`Are you sure you want to delete product with ID: ${id}`)

        if (answer) {
            toastId=toast.loading('Loading, please wait...',{
                id:toastId
            })
    
            
        }
        
    }

    const getTableData=()=>{

        const result1=[]
        const result2=[]

        // if (val===1) {

            // for (let i = 0; i < ProductData.length; i++) {
                result1.push(
                    <>
                    <tr>
                    {/* <td>{ProductData[i].batchNumber}</td>
                    <td>{ProductData[i].medicineName}</td>
                    <td>{ProductData[i].dosageForm}</td>
                    <td>{ProductData[i].medicineCategory}</td>
                    <td>{ProductData[i].availableQuantity}</td>
                    <td>{ProductData[i].costPerUnit}</td>
                    <td>{(DayTime(ProductData[i].expiresAt))}</td>
                    <td><a title='Edit' onClick={(e)=>{oneMedicine(ProductData[i])}}><FontAwesomeIcon icon={faEdit} className="editA text-warning"/></a></td>
                    <td><a title="Delete" onClick={(e)=>{deleteMed(ProductData[i].pharmacy, ProductData[i].batchNumber)}}><FontAwesomeIcon icon={faTrashAlt} className="editA text-danger"/></a></td> */}
                    <td>1</td>
                    <td>GD8EG5</td>
                    <td>Beef Liver</td>
                    <td>50.8798</td>
                    <td>640</td>
                    <td>Kayole</td>
                    {
                        achivedProducts ? (
                            <>
                            <td title="Delete"><FontAwesomeIcon icon={faTrashAlt} className="text-danger faEdit" onClick={()=>{
                                deleteProduct(1,2)
                            }}/></td>
                    
                            </>
                        ):(
                            <>
                            <td title="Edit"><i onClick={()=>{showModal(1)}} class="far fa-edit faEdit text-start text-warning "
                            ></i></td>
                            <td title="Archive"><FontAwesomeIcon icon={faArchive} className="text-danger faEdit"/></td>
                    
                            </>
                        )
                    }
                    
                    </tr>
        
                    </>
                )
        
            // }
    
            return result1
            
        // } 
        // else if (val===2) {

        //     for (let i = 0; i < ProductData.length; i++) {
        //         result1.push(
        //             <>
        //             <tr>
        //             <td>{ProductData[i].batchNumber}</td>
        //             <td>{ProductData[i].medicineName}</td>
        //             <td>{ProductData[i].dosageForm}</td>
        //             <td>{ProductData[i].medicineCategory}</td>
        //             <td>{ProductData[i].availableQuantity}</td>
        //             <td>{ProductData[i].costPerUnit}</td>
        //             <td>{(DayTime(ProductData[i].expiresAt))}</td>
        //             <td><a title='Edit' onClick={(e)=>{oneMedicine(ProductData[i])}}><FontAwesomeIcon icon={faEdit} className="editA text-warning"/></a></td>
        //             <td><a title="Delete" onClick={(e)=>{deleteMed(ProductData[i].pharmacy, ProductData[i].batchNumber)}}><FontAwesomeIcon icon={faTrashAlt} className="editA text-danger"/></a></td>
        //             </tr>
        
        //             </>
        //         )
        
        //     }
    
        //     return result1
            
        // }


        
    }

    const getProductData=async(val)=>{
        toast(val)
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })

        // let response=await axios.get(`/api/v1/controller/medicine?action=getMedicineData&pharmacy=${pharm.id}`)            
        // toast.dismiss(toastId)
        // if (response.data.success===true) {
        //   toast.success(`Successful!`,{id:toastId})
        //   setProductDataData(response.data.drugs)
        // }
        // else{
            
        //     toast.error(`Failed! ${response.data.message}`,{id:toastId})
        // }
    }

    const editProduct=()=>{
        hideModal(1)
    }

    const productIssue=()=>{
        hideModal(2)
    }

    const handleInputChangeEdit = (e) => {
      
        const { name, value } = e.target;
        setOneProductDataData({ ...oneProductDataData, [name]: value });

        
    }

    const handleInputChangeIssue = (e) => {
      
        const { name, value } = e.target;
        setProductIssue({ ...ProductIssue, [name]: value });

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
        <NavBar />
        <div class="d-flex flex-column" id="content-wrapper">
            <div id="content" >
                <Header />
                <div class="container-fluid">
                    <h1
                        class=" font-monospace text-uppercase fw-bolder text-center text-light bg-success bg-gradient border-2 border-secondary shadow-sm mb-4">
                        My Products</h1>
                    <div class="card shadow">
                        <div class="card-header d-flex justify-content-between py-3">
                            <p class="text-primary m-0 fw-bold">{productInfo}</p>
                            <div class="dropdown border rounded-pill">
                                <button onClick={()=>{setDropDownManu(!dropDownManu)}}
                                    class="dropdown-btn btn btn-primary bg-primary dropdown-toggle text-center border rounded-pill"
                                    aria-expanded="false" data-bs-toggle="dropdown"
                                    type="button"><strong>Product&nbsp;</strong>
                                </button>
                               
                                <div style={{display:dropDownManu ? 'block' : 'none'}} class="dropdown-menu" >
                                    <a class="dropdown-item"  onClick={(e)=>{showModal(2)}}>Dead Stock/Issues</a>
                                    {
                                        achivedProducts ? (
                                            <>
                                    <a class="dropdown-item" onClick={(e)=>{
                                        getProductData(0)
                                        setproductInfo('Available Products')
                                        setAchivedProducts(false)
                                        setDropDownManu(false)
                                    }}>Available Products</a>
                                            
                                            </>
                                        ):(
                                            <>
                                    <a class="dropdown-item" onClick={(e)=>{
                                        getProductData(1)
                                        setproductInfo('Archived Products')
                                        setAchivedProducts(true)
                                        setDropDownManu(false)
                                    }}>Archived Products</a>
                                            
                                            </>
                                        )
                                    }
                                    <a class="dropdown-item" href="/sc/invoice"  >Invoices</a>

                                </div>
                                    
                            </div>
                        </div>
                        <div class="card-body">
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
                            <div class="table-responsive font-monospace text-center border-2  shadow-sm table"
                                id="dataTable" role="grid" aria-describedby="dataTable_info">
                                <table class="table table-striped  table-hover table-bordered" id="dataTable">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Branch</th>
                                            <th colspan={achivedProducts ? '1':'2'}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{maxHeight:'100vh', overflow:'scroll'}}>
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
                            </div>
                        </div>
                    </div>
                    <div ref={modalRef1} className="modal " role="dialog"
                        tabindex="-1" id="modal-1">
                        <div class="modal-dialog modal-md modal-dialog-centered" role="document">
                            <div class="modal-content bg-dark">
                                <div class="modal-header text-capitalize">
                                    <h2 class="modal-title fw-bolder">Edit Product</h2><button class="btn-close"
                                        type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <div
                                        class="font-monospace text-capitalize fw-bolder d-flex justify-content-between">
                                        <p class="fs-5 text-warning">Product 1</p>
                                        <p className="text-light">290180</p>
                                    </div>
                                    <div class="d-grid">
                                            <div class="col ">
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Product
                                                            Name</label><input onChange={handleInputChangeEdit}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control-lg"
                                                            type="text" style={{textAlign: "center"}} required name="productName" /></div>
                                                </div>
                                            </div>
                                            <div class="col d-grid">
                                                <div class="row">
                                                    <div class="col d-grid"><label class="form-label">Price Per
                                                            Unit</label><input onChange={handleInputChangeEdit}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control-lg"
                                                            type="text" required style={{textAlign: "center"}} name="productPrice"/></div>
                                                </div>
                                            </div>

                                            {/* <div class="col">
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Product
                                                            Quantity</label><input onChange={handleInputChangeEdit}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control-lg"
                                                            type="text" style={{textAlign: "center"}} required name="productQuantity"/></div>
                                                </div>
                                            </div> */}
                                            
                                        
                                    </div>
                                </div>
                                <div class="modal-footer"><button class="btn btn-light" type="button"
                                        data-bs-dismiss="modal" data-bs-target="#modal-1"
                                        data-bs-toggle="modal" onClick={()=>{hideModal(1)}}>Close</button><button class="btn btn-primary"
                                        type="button" data-bs-target="#modal-1" data-bs-toggle="modal" onClick={editProduct}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ref={modalRef2} class="modal" role="dialog"
                        tabindex="-1" id="modal-2">
                        <div class="modal-dialog modal-md modal-dialog-centered" role="document">
                            <div class="modal-content bg-dark">
                                <div class="modal-header text-capitalize">
                                    <h2 class="modal-title fw-bolder">Product issues</h2><button class="btn-close"
                                        type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <div
                                        class="font-monospace text-capitalize fw-bolder d-flex justify-content-between">
                                        <p class="fs-5 text-warning">Product 1</p>
                                        <p className="text-light">290180</p>
                                    </div>
                                    <div class="d-flex">
                                        <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                            <div class="col d-grid">
                                                <div class="row d-grid">
                                                    <div class="col d-grid"><label class="form-label">Product
                                                            Name</label>
                                                            <select onChange={handleInputChangeIssue}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control-lg"
                                                             style={{textAlign: "center"}} required name="productId">
                                                                <option value={''}></option>
                                                            
                                                            </select></div>
                                                </div>
                                            </div>
                                            <div class="col d-grid">
                                                <div class="row">
                                                    <div class="col d-grid"><label class="form-label">Quantity
                                                            Issue</label><input onChange={handleInputChangeIssue}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control-lg"
                                                            type="text" required style={{textAlign: "center"}} name="quantityIssue"/></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer"><button class="btn btn-light" type="button"
                                        data-bs-dismiss="modal" data-bs-target="#modal-2"
                                        data-bs-toggle="modal" onClick={()=>{hideModal(2)}}>Close</button><button class="btn btn-primary"
                                        type="button" data-bs-target="#modal-2" data-bs-toggle="modal" onClick={productIssue}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div><a class="border rounded d-inline scroll-to-top" href="#page-top"><i class="fas fa-angle-up"></i></a>
    </div>
    </div>
    </>
  )
}
