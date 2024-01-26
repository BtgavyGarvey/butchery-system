'use client'

import React from "react";
import NavBar from "../../../layout/navbar";
import Header from "../../../layout/header";
import Footer from "../../../layout/footer";
import toast, { Toaster } from "react-hot-toast";
import { getBranches, getProducts, isShopOpened, newProduct } from "../../../../src/app/api/v1/controller/butchery/route";

let initialState = {
    price: "",
    name:"",
    quantity:"",
    branch:"",
    link:false,
    parent:'',
};

export default function NewProductPage({session}) {

    let toastId

    const productRef=React.useRef()
    const radioRef1=React.useRef()
    const radioRef2=React.useRef()
    const branch=React.useRef()
    

    const [formData, setFormData] = React.useState(initialState);
    const [Products, setProducts]=React.useState([])
    const [Branches, setBranches]=React.useState([])

    const getBrunches=async()=>{
        let response=await getBranches(session)
        setBranches(response.branches)
    }

    const getProdacts=async(branch)=>{
        let data={
            page:0,
            pageLimit:100,
            branch,
            searchParams:'all',
            value:1
        }
        let response=await getProducts(data)
        setProducts(response.products)
    }

    React.useEffect(()=>{
        branch.current=session.user.branch
        isShopClosed(1)
    },[])

    const isShopClosed=async(val)=>{

        let shopOpened=await isShopOpened(session.user.branch,session.user.id)

        if (shopOpened) {

            if (val===1) {
                getBrunches()
                getProdacts(session.user.branch)
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
                    getBrunches()
                    getProdacts(session.user.branch)
                }
                return
                
            }
        }
    }

    const handleInputChange = (e) => {
        
        const { name, value } = e.target;

        if (name==='radio') {

            if (radioRef1.current.checked) {
                formData.link=false
                formData.parent=''
                productRef.current.style.display='none'
            } else if (radioRef2.current.checked){
                formData.link=true
                productRef.current.style.display='block'
            }
        }

        if(name==='branch'){
            getProdacts(value)
            branch.current=value
        }
        
        setFormData({ ...formData, [name]: value });
    };

    const validate=async()=>{

        if(
            !formData.quantity || 
            !formData.price || 
            !formData.branch ||
            !formData.name
            ){
                toastId=toast.error('Please fill all required fields',{id:toastId})

            return false
        }

        if (!radioRef1.current.checked && !radioRef2.current.checked) {
            toastId=toast.error('Please fill all required fields',{id:toastId})
            return false
        }

        if (isNaN(formData.quantity) || !(parseFloat(formData.quantity) > 0)) {
            toastId=toast.error('Invalid Quantity',{id:toastId})
            return false
        }

        if (isNaN(formData.price) || !(parseFloat(formData.price) > 0)) {
            toastId=toast.error('Invalid Price',{id:toastId})
            return false
        }

        return true
        
    }

    const renderProducts=()=>{

        const result1=[]

        for (let i = 0; i < Products.length; i++) {
        
            result1.push(
                <option key={'a'+i} value={Products[i].documents.id}>{Products[i].documents.name}</option>

            )
            
        }
    
        
        return result1
        
    }

    const renderBranches=()=>{

        const result1=[]

        for (let i = 0; i < Branches.length; i++) {
        
            result1.push(
                <option key={'a'+i} value={Branches[i].id}>{Branches[i].name}</option>

            )
            
        }
        return result1
        
    }

    const onSubmit=async(e)=>{

        e.preventDefault()

        toastId=toast.loading('Checking status, please wait...',{
            id:toastId
        })

        await isShopClosed(2)

        toast.dismiss(toastId)
        var isValid=await validate()

        try {

            let response

            if (isValid) {
                toastId=toast.loading('Loading, please wait...')

                response=await newProduct(formData,session)
                toast.dismiss(toastId)

                if (response.success) {
                    toast.success(`Successful!`,{id:toastId})
                    getProdacts(branch.current)
                }
                else{
                    toast.error(`Failed! ${response.message}`,{id:toastId})
                }
            }

        } catch (error) {
            console.log(error)
        }

    }

  return (
    <>
    <Toaster 

    toastOptions={{
        success:{
            style:{
                background:'green',
                color:'white'
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
                        New Product</h1>
                        <div class="card-body p-0">
                <div class="row">
                    
                    <div class="col-lg-12">
                        <div class="p-2">
                            
                            <form class="user" onSubmit={onSubmit}>
                                <div class="row mb-3">
                                    <div class="col-sm-6 mb-3 mb-sm-0"><label class="form-label">Product
                                            Name</label><input
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-control form-control-lg bounce animated"
                                            type="text" required autofocus="" placeholder="Product Name" name="name" onChange={handleInputChange} minLength={3}/></div>
                                    <div class="col-sm-6"><label class="form-label">Product Unit Price</label><input
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-secondary form-control form-control-lg bounce animated"
                                            type="text" placeholder="Price Per Unit" name="price" onChange={handleInputChange} required/></div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-sm-6 mb-3 mb-sm-0"><label class="form-label">Product Quantity</label><input
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-control form-control-lg bounce animated"
                                            type="text" autocomplete="off" required  name="quantity" onChange={handleInputChange} />
                                    </div>

                                    <div class="col-sm-6 mb-3 mb-sm-0"><label class="form-label">Branch</label><select
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-control form-control-lg bounce animated"
                                             autocomplete="off" required  name="branch" onChange={handleInputChange}>
                                              <option value={''}>Choose Branch</option>
                                              {
                                                Branches.length > 0 && (
                                                    renderBranches()
                                                )
                                              }
                                             </select>
                                    </div>
                                    
                                </div>

                                <div class="row mb-3">
                                    <div class="col-sm-6 mb-3 mb-sm-0">
                                      <label class="form-label">Link This Product?</label><br />
                                      <div className="d-flex justify-content-between text-dark">
                                      <input
                                            type="radio" ref={radioRef1} name="radio" onChange={handleInputChange} /><span className="">No</span>
                                      <input
                                            type="radio" ref={radioRef2}  name="radio" onChange={handleInputChange} /><span>Yes</span>
                                      </div>
                                      
                                    </div>

                                    <div ref={productRef} class="col-sm-6 mb-3 mb-sm-0 parentProduct"><label class="form-label">Available Products</label><select
                                            class="border rounded-pill border-2 border-primary shadow-sm focus-ring focus-ring-info form-control form-control-lg bounce animated"
                                             autocomplete="off"  name="parent" onChange={handleInputChange}>
                                              <option value={''}>Choose Parent Product</option>
                                              {
                                                Products.length > 0 && (
                                                    renderProducts()
                                                )
                                              }
                                            </select>
                                    </div>
                                    
                                </div>
                                
                                <button
                                    class="btn btn-primary bg-primary fw-bolder text-center d-block rubberBand animated btn-user w-100"
                                    type="submit">Register Product</button>
                                <hr />
                            </form>
                            
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