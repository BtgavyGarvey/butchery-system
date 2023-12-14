'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Footer from "../../../layout/footer"
import Header from "../../../layout/header"
import NavBar from "../../../layout/navbar"
import { faArchive, faArrowAltCircleUp, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import React from "react"
import toast, { Toaster } from "react-hot-toast"
import { DayTime } from "../../../layout/utils"
import { deleteProducts, editProducts, getProducts, productsIssue } from "../../../../src/app/api/v1/controller/butchery/route"
import ReactPaginate from "react-paginate"

let Branches=[]
export default function ViewProductsPage({session}) {

    let toastId

    
    const page=React.useRef()
    const branch=React.useRef()
    const searchParams=React.useRef()
    const pageLimit=React.useRef()
    const modalRef1=React.useRef()
    const modalRef2=React.useRef()
    const achievedVal=React.useRef()
    const [dropDownManu, setDropDownManu]=React.useState(false)
    const [achivedProducts, setAchivedProducts]=React.useState(false)
    const [ProductData, setProductDataData]=React.useState([])
    // const [Branches, setBranches]=React.useState([])
    // const [AddedBy, setAddedBy]=React.useState([])
    const [oneProductDataData, setOneProductDataData]=React.useState()
    const [productInfo, setproductInfo]=React.useState('Available Products')
    const [ProductIssue, setProductIssue]=React.useState({
        id:'',
        quantity:''
    })
    const [pageCount,setPageCount]=React.useState(0)
    const [outOfPage,setOutOfPage]=React.useState(0)
    
    React.useEffect(()=>{
        modalRef1.current.style.display='none'
        modalRef2.current.style.display='none'
        branch.current=session.user.branch
        searchParams.current='all'
        pageLimit.current=25
        page.current=1
        achievedVal.current=1
        getProductData()
    },[])

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

    const handlePageClick=(e)=>{
        page.current=e.selected+1
        getProductData()
    }

    const handlePageLimitClick=(e)=>{
        pageLimit.current=parseInt(e.target.value)
        getProductData()
    }

    const handleInputChangeSearch = (e) => {
      
        searchParams.current= e.target.value ? e.target.value : 'all';

        getProductData()

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

    const getTableData=()=>{

        const result1=[]

        let tempBranch=[]

        for (let i = 0; i < ProductData.length; i++) {

            tempBranch.push(ProductData[i]?.documents.branches)

            result1.push(
                <>
                <tr>
                <td>{i+1}</td>
                <td>{ProductData[i]?.documents.code}</td>
                <td>{ProductData[i]?.documents.name}</td>
                <td>{ProductData[i]?.documents.price}</td>
                <td>{ProductData[i]?.documents.quantity}</td>
                <td>{ProductData[i]?.documents.branches.name}</td>
                <td title={ProductData[i]?.documents.addedBy.firstName+' '+ProductData[i]?.documents.addedBy.lastName} onClick={()=>{
                    toast(ProductData[i]?.documents.addedBy.firstName+' '+ProductData[i]?.documents.addedBy.lastName)}
                    }>{ProductData[i]?.documents.addedBy.username}</td>
                {
                    achivedProducts ? (
                        <>
                        <td title="Restore"><FontAwesomeIcon icon={faArrowAltCircleUp} className="text-success faEdit" onClick={()=>{
                            deleteProduct(ProductData[i]?.documents.branches.id,ProductData[i]?.documents.id,ProductData[i]?.documents.code,1)
                        }}/></td>
                        <td title="Delete"><FontAwesomeIcon icon={faTrashAlt} className="text-danger faEdit" onClick={()=>{
                            deleteProduct(ProductData[i]?.documents.branches.id,ProductData[i]?.documents.id,ProductData[i]?.documents.code,-1)
                        }}/></td>
                
                        </>
                    ):(
                        <>
                        <td title="Edit"><i onClick={()=>{
                            setOneProductDataData(ProductData[i]?.documents)
                            showModal(1)
                        }} class="far fa-edit faEdit text-start text-warning "
                        ></i></td>
                        <td title="Archive"><FontAwesomeIcon icon={faArchive} className="text-danger faEdit" onClick={()=>{
                            deleteProduct(ProductData[i]?.documents.branches.id,ProductData[i]?.documents.id,ProductData[i]?.documents.code,2)
                        }}/></td>
                
                        </>
                    )
                }
                
                </tr>
    
                </>
            )
    
        }

        let isObjectInArray=(array,id)=>array.some(obj=>obj.id===id)


        for (let i = 0; i < tempBranch.length; i++) {

            let id=tempBranch[i].id
            
            if (!isObjectInArray(Branches, id)) {

                Branches.push(tempBranch[i])
                
            }
            
        }

        return result1
            
    }

    const getProductData=async()=>{
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })
        let data={
            page:page.current-1,
            pageLimit:pageLimit.current,
            branch:branch.current,
            searchParams:searchParams.current,
            value:achievedVal.current
        }
        let response=await getProducts(data)
        let pages=Math.ceil(response.products[0]?.pageCount / pageLimit.current)
        setPageCount(pages)
        setOutOfPage(response.products[0]?.pageCount)

        setProductDataData(response.products)

        toast.dismiss(toastId)
        
    }

    const editProduct=async()=>{
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })
        let editData=await editProducts(oneProductDataData,session)
        toast.dismiss(toastId)

        if (editData) {
            toast.success('Successful')
            getProductData(1)
        }
        else{
            toast.error('Failed!!! Try again later')
        }

        hideModal(1)
    }

    const productIssue=async()=>{
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })
        let issueData=await productsIssue(ProductIssue,session)
        toast.dismiss(toastId)

        if (issueData) {
            toast.success('Successful')
            getProductData(1)
        }
        else{
            toast.error('Failed!!! Try again later')
        }
    }

    const handleInputChangeEdit = (e) => {
      
        const { name, value } = e.target;
        setOneProductDataData({ ...oneProductDataData, [name]: value });
    }

    const handleInputChangeIssue = (e) => {
      
        const { name, value } = e.target;
        setProductIssue({ ...ProductIssue, [name]: value });

    }

    const renderProducts=()=>{

        const result1=[]

        for (let i = 0; i < ProductData.length; i++) {
        
            result1.push(
                <option key={'a'+i} value={ProductData[i].id}>{ProductData[i].name}</option>
            )
            
        }
        return result1
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
                                    <a class="dropdown-item" href="/sc/products/newproduct"  >New Product</a>
                                    <a class="dropdown-item"  onClick={(e)=>{showModal(2)}}>Dead Stock/Issues</a>
                                    {
                                        achivedProducts ? (
                                            <>
                                    <a class="dropdown-item" onClick={(e)=>{
                                        achievedVal.current=1
                                        getProductData()
                                        setproductInfo('Available Products')
                                        setAchivedProducts(false)
                                        setDropDownManu(false)
                                    }}>Available Products</a>
                                            
                                            </>
                                        ):(
                                            <>
                                    <a class="dropdown-item" onClick={(e)=>{
                                        achievedVal.current=2
                                        getProductData()
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
                                    <div class="text-md-end dataTables_filter" id="dataTable_filter"><label
                                            class="form-label">Search&nbsp;<input type="search" class="form-control form-control-sm"
                                                aria-controls="dataTable" placeholder="Search" onChange={handleInputChangeSearch}/>&nbsp;</label></div>
                                </div>

                                <div class="col-md-4">
                                    <div class="text-md-end dataTables_filter" id="dataTable_filter"><label
                                            class="form-label">Branch&nbsp;<select onChange={handlePageLimitClick}
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
                            <div class="table-responsive font-monospace border-2  shadow-sm table"
                                id="dataTable" role="grid" aria-describedby="dataTable_info">
                                <table class="table table-striped  table-hover table-bordered" id="dataTable">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Branch</th>
                                            <th>Added By</th>
                                            <th colspan={'2'}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{maxHeight:'100vh', overflow:'scroll'}}>
                                        {
                                            getTableData()
                                        }
                                    </tbody>
                                    <tfoot >
                                        <tr>
                                            <td><strong>No.</strong></td>
                                            <td><strong>ID</strong></td>
                                            <td><strong>Name</strong></td>
                                            <td><strong>Price</strong></td>
                                            <td><strong>Quantity</strong></td>
                                            <td><strong>Branch</strong></td>
                                            <td><strong>Added By</strong></td>
                                            <td colspan={'2'}><strong>Action</strong></td>
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
                                    <h2 class="modal-title fw-bolder">Edit Product</h2><button class="btn-close"
                                        type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <div
                                        class="font-monospace text-capitalize fw-bolder d-flex justify-content-between">
                                        <p class="fs-5 text-warning">{oneProductDataData?.name}</p>
                                        <p className="text-light">{oneProductDataData?.code}</p>
                                    </div>
                                    <div class="d-grid">
                                            <div class="col ">
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Product
                                                            Name</label><input onChange={handleInputChangeEdit}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control-lg"
                                                            type="text" style={{textAlign: "center"}} required name="name" value={oneProductDataData?.name}/></div>
                                                </div>
                                            </div>
                                            <div class="col d-grid">
                                                <div class="row">
                                                    <div class="col d-grid"><label class="form-label">Price Per
                                                            Unit</label><input onChange={handleInputChangeEdit}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control-lg"
                                                            type="text" required style={{textAlign: "center"}} name="price" value={oneProductDataData?.price}/></div>
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
                                        {/* <p class="fs-5 text-warning">Product 1</p>
                                        <p className="text-light">290180</p> */}
                                        
                                    </div>
                                    <hr />
                                    <div class="d-flex">
                                        <div class="col me-xxl-0 pe-xxl-1 pt-xxl-0">
                                            <div class="col d-grid">
                                                <div class="row d-grid">
                                                    <div class="col d-grid"><label class="form-label">Product
                                                            Name</label>
                                                            <select onChange={handleInputChangeIssue}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control-lg"
                                                             style={{textAlign: "center"}} required name="id">
                                                                <option value={''}></option>
                                                                {
                                                                    ProductData.length>0 && (
                                                                        renderProducts()
                                                                    )
                                                                }
                                                            </select></div>
                                                </div>
                                            </div>
                                            <div class="col d-grid">
                                                <div class="row">
                                                    <div class="col d-grid"><label class="form-label">Quantity
                                                            Issue</label><input onChange={handleInputChangeIssue}
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control-lg"
                                                            type="text" required style={{textAlign: "center"}} name="quantity"/></div>
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
        </div>
        {/* <a class="border rounded d-inline scroll-to-top" href="#page-top"><i class="fas fa-angle-up"></i></a> */}
    </div>
    </div>
    </>
  )
}
