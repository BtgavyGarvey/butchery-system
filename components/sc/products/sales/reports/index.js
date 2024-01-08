'use client'

import React from "react"
import Footer from "../../../../layout/footer"
import Header from "../../../../layout/header"
import NavBar from "../../../../layout/navbar"
import { getBranches, getReportData } from "../../../../../src/app/api/v1/controller/butchery/route"
import toast, { Toaster } from "react-hot-toast"
import { DateWeek, Today } from "../../../../layout/utils"
import BarChart from "../../../../layout/utils/chartjs/barChart";
import DoughnutChart from "../../../../layout/utils/chartjs/doughnutChart";
import PieChart from "../../../../layout/utils/chartjs/pieChart";
import LineChart from "../../../../layout/utils/chartjs/lineChart";
import PolarAreaChart from "../../../../layout/utils/chartjs/polarArea";
import BubbleChart from "../../../../layout/utils/chartjs/bubleChart"

let label=[]
let DataSales=[]
let DataQuantity=[]


export default function ViewSalesPage({session}) {


    const [SalesData, setSalesData]=React.useState([])
    const [OneSalesData, setOneSalesData]=React.useState()
    const [chartData, setChartData] = React.useState();

    const DateRef=React.useRef()
    const refDay=React.useRef('Sales In The Past 5 Years')
    const cashier=React.useRef()
    const text=React.useRef('')
    const product=React.useRef()
    const radio1=React.useRef()
    const radio2=React.useRef()
    const radio=React.useRef()
    const [pageCount,setPageCount]=React.useState(0)
    const [outOfPage,setOutOfPage]=React.useState(0)
    const [OneCashier,setOneCashier]=React.useState(0)
    const [ManyCashiers,setManyCashiers]=React.useState([])
    const [Branches, setBranches]=React.useState([])
    const branch=React.useRef()
    const [dropDownManu, setDropDownManu]=React.useState(false)

    let toastId
    let data
    let dateDetails=Today()

    React.useEffect(()=>{
        let date=Today()
        DateRef.current=date.date
        branch.current=session.user.branch
        product.current='all'
        cashier.current='all'

    },[])


    const Revenue=React.useRef([])

    const RevenuePerProduct=React.useRef([])

    
    const getReport=async()=>{

      toastId=toast.loading('Loading data. Please wait...',{id:toastId})
        let response
        let revenuePerProduct=[]

        let revenue=[]

        if (refDay.current==='Sales In The Past 5 Years') {
          dateDetails['dynamicDate']=dateDetails.yearsAgo
        } else if (refDay.current==='Sales Today') {
          dateDetails['dynamicDate']=dateDetails.date
        }
        else if (refDay.current==='Sales This Week') {
          dateDetails['dynamicDate']=dateDetails.thisWeek
        }
        else if (refDay.current==='Sales This Month') {
          dateDetails['dynamicDate']=dateDetails.thisMonth
        }
        else if (refDay.current==='Sales This Year') {
          dateDetails['dynamicDate']=dateDetails.thisYear
        }

        if (radio.current===1) {
        response=await getReportData(branch.current,dateDetails,2)
          
        response?.reports?.revenue?.map((result)=>{

          let weekNo=DateWeek(result._id[0])

          result['date']=result._id[0]
          result['hour']=result._id[1]
          result['weekNumber']=weekNo.weekNumber
          result['year']=weekNo.year
          result['month']=weekNo.month

          if (refDay.current ==='Sales Today') {
            
            revenue.push(
                result
              )
            
          }
          else if (refDay.current ==='Sales This Week') {
            let indexOfObjectDay=revenue.findIndex((item)=>(dateDetails.thisWeek <= result.date && item.date === result.date))

            if (indexOfObjectDay >-1) {
              revenue[indexOfObjectDay].totalAmount +=result.totalAmount
              revenue[indexOfObjectDay].totalQuantity +=result.totalQuantity
            } else {
              revenue.push(
                result
              )
            }
            
          }
          else if (refDay.current ==='Sales This Month') {
            let indexOfObjectDay=revenue.findIndex((item)=>(item.weekNumber === result.weekNumber && item.month === weekNo.month && item.year === weekNo.year))

            if (indexOfObjectDay >-1) {
              revenue[indexOfObjectDay].totalAmount +=result.totalAmount
              revenue[indexOfObjectDay].totalQuantity +=result.totalQuantity
            } else {
              revenue.push(
                result
              )
            }
            
          }
          else if (refDay.current ==='Sales This Year') {
            let indexOfObjectDay=revenue.findIndex((item)=>(item.month === weekNo.month && item.year === weekNo.year))

            if (indexOfObjectDay >-1) {
              revenue[indexOfObjectDay].totalAmount +=result.totalAmount
              revenue[indexOfObjectDay].totalQuantity +=result.totalQuantity
            } else {
              revenue.push(
                result
              )
            }
            
          }
          else if (refDay.current ==='Sales In The Past 5 Years') {
            let indexOfObjectDay=revenue.findIndex((item)=>(item.year === weekNo.year))

            if (indexOfObjectDay >-1) {
              revenue[indexOfObjectDay].totalAmount +=result.totalAmount
              revenue[indexOfObjectDay].totalQuantity +=result.totalQuantity
            } else {
              revenue.push(
                result
              )
            }
            
          }
          
        })
          
        } else {

          let response=await getReportData(branch.current,dateDetails,3)
          
          response?.reports?.revenue?.map((result)=>{
            result['product']=result._id
            revenuePerProduct.push(
              result
            )
          })
        
        }

        Revenue.current=revenue
        RevenuePerProduct.current=revenuePerProduct
        
        toast.dismiss(toastId)

        if (radio.current===1) {
        loopDataDate()
        } else {
        loopDataProduct()
        }

    }

    const handleChangeInput=(e)=>{
      const { value } = e.target;
    
      refDay.current=value

      getReport()
    }

    const handleChangeProduct=(e)=>{
      const { name } = e.target;

      if (Branches.length < 1) {
        getBrunches()
        
      }

      if (name==='1') {
      radio.current=1
      getReport()
      radio2.current.checked=false
        
      } else {
        radio.current=2
        getReport()
      radio1.current.checked=false
      }
    
    }

    const loopDataDate=()=>{

        let value=refDay.current
        data=Revenue.current
    
        if (value==='Sales In The Past 5 Years') {
          text.current='Years'
          label=data?.map((item) => item.year)
          
        }
        else if (value==='Sales Today') {
            text.current="Hours"
          label=data?.map((item) => item.hour)
          
          
        } else if (value==='Sales This Week'){
            text.current="Dates"
    
          label=data?.map((item) => item.date)
        }
        else if (value==='Sales This Month'){
            text.current='Weeks'
          label=data?.map((item) => item.weekNumber)
          
        }
        else if (value==='Sales This Year'){
            text.current='Months'
          label=data?.map((item) => item.month)
          
        }

        DataSales=data?.map((item) => item.totalAmount)
          DataQuantity=data?.map((item) => item.totalQuantity)
        
      
    
        let CData={
          labels: label,
          datasets: [
            {
              label: `Total Sales`,
              data: DataSales,
              backgroundColor: [
                "rgba(75,192,192,1)",
                "#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0",
              ],
              borderColor: "black",
              borderWidth: 2,
            },
            {
              label: `Total Quantity`,
              data: DataQuantity,
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
              ],
              borderColor: "black",
              borderWidth: 2,
            },
          ],
        }
    
        setChartData(CData)
    
    }

    const loopDataProduct=()=>{

        data=RevenuePerProduct.current
    
        text.current='Products'
        label=data?.map((item) => item.product)
        DataSales=data?.map((item) => item.totalAmount)
        DataQuantity=data?.map((item) => item.totalQuantity)
        
        let CData={
          labels: label,
          datasets: [
            {
              label: `Total Sales`,
              data: DataSales,
              backgroundColor: [
                "rgba(75,192,192,1)",
                "#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0",
              ],
              borderColor: "black",
              borderWidth: 2,
            },
            {
              label: `Total Quantity`,
              data: DataQuantity,
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
              ],
              borderColor: "black",
              borderWidth: 2,
            },
          ],
        }
    
        setChartData(CData)
    
    }



    const options2 = {
        scales: {
          x: {
            title: {
              display: true,
              text: text.current,
              font: {
                color: 'dark',
                weight: "bold",
              },
            },
          },
          y: {
            title: {
              display: true,
              text: "Sale Amount / Quantity",
              font: {
                weight: "bold",
              },
            },
          },
        },
      };


    // const handleDateClick=(e)=>{
    //     DateRef.current=formatDate(e.target.value)
    //     getSalesData()
    // }

    // const handleCashierClick=(e)=>{
    //     cashier.current=e.target.value
    //     getSalesData()
    // }

    // const handleProductClick=(e)=>{
    //     product.current=e.target.value
    //     getSalesData()
    // }

    const getBrunches=async()=>{
        let response=await getBranches(session)
        setBranches(response.branches)
    }

    const handleBranchClick=(e)=>{
        branch.current=e.target.value
        getReport(1)
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
                        Sales Report Dashboard</h1>
                    <div class="card shadow">
                    <div class="card-header d-flex justify-content-between py-3">
                            <p class="text-dark m-0 fw-bold">{refDay.current}</p>
                            {/* <div class="dropdown border rounded-pill">
                                <button onClick={()=>{setDropDownManu(!dropDownManu)}}
                                    class="dropdown-btn btn btn-primary bg-primary dropdown-toggle text-center border rounded-pill"
                                    aria-expanded="false" data-bs-toggle="dropdown"
                                    type="button"><strong>Sales&nbsp;</strong>
                                </button>
                               
                                <div style={{display:dropDownManu ? 'block' : 'none'}} class="dropdown-menu" >
                                    <a class="dropdown-item" href="/sc/products/sales/makesales">New Sale</a>
                                    <a class="dropdown-item" href="/sc/products/sales/rollback"  >Roll Back Report</a>
                                    <a class="dropdown-item" href="/sc/products/sales/reports"  >Sales Report Dashboard</a>
                                </div>
                                    
                            </div> */}
                      </div>
                        
                        <div class="card-body">
                        <div className="Dflex justify-content-between col-md-12 p-1 m-1">
                        <div className="col-md-3 p-1 d-flex justify-content-between">
                          <div className="d-grid">
                          <label className="fw-bold">Per Time Frame</label>
                          <input ref={radio1}
                          type="radio"
                          onChange={handleChangeProduct}
                          name="1"
                          />
                          </div>

                          <div className="d-grid">
                          <label className="fw-bold">Per Product</label>
                          <input ref={radio2}
                          type="radio"
                          onChange={handleChangeProduct}
                          name="2"
                          />
                          </div>
                          
                         
                        </div>
                        <div className="col-md-2 p-1">
                          <label className="fw-bold">Select Time Frame</label>
                          <select
                          className="form-control"
                          onChange={handleChangeInput}
                          name="timeFrame"
                        >
                          <option value={'Sales In The Past 5 Years'}></option>
                          <option value={'Sales Today'}>Sales Today</option>
                          <option value={'Sales This Week'}>This Week</option>
                          <option value={'Sales This Month'}>Sales This Month</option>
                          <option value={'Sales This Year'}>Sales This Year</option>
                          <option value={'Sales In The Past 5 Years'}>Sales In The Past 5 Years</option>
                        </select>
                        </div>
                        <div className="col-md-2 p-1">
                          <label className="fw-bold">Branch</label>
                          <select
                          className="form-control"
                          onChange={handleBranchClick}
                          name="timeFrame"
                        >
                          {
                              Branches.map((result)=>{
                                  return (
                                      <>
                                      <option value={result.id}>{result.name}</option>
                                      </>
                                  )
                              })
                          }    
                        </select>
                        </div>
                        {/* <div className="col-md-2 p-1">
                          <label className="fw-bold">Choose Product</label>
                          <select
                          className="form-control"
                          onChange={handleChangeProduct}
                          name="timeFrame"
                        >
                         <option></option>
                         <option value={'2'}>Report Per Product</option>
                        </select>
                        </div> */}
                        </div>
                            {/* <div class="row">
                            
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
                            </div> */}

        {
            chartData && (
              <>

              
              <div className="chart-js">
              <div className="chartjs">
                <div className="chartjs-div">
                <BarChart chartData={chartData} options={options2} timeDate={refDay.current}/>
                </div>
                <div className='chartjs-div polar'>
                <PolarAreaChart chartData={chartData} options={options2} timeDate={refDay.current}/>
                </div>
                <div className='chartjs-div polar'>
                <BubbleChart chartData={chartData} options={options2} timeDate={refDay.current}/>
                </div>

              </div>
              <div className="chartjs">
                <div className='chartjs-div'>
                <LineChart chartData={chartData} options={options2} timeDate={refDay.current}/>
                </div>
                <div className="chartjs-div polar">
                <PieChart chartData={chartData} options={options2} timeDate={refDay.current}/>
                </div>
                <div className='chartjs-div polar'>
                <DoughnutChart chartData={chartData} options={options2} timeDate={refDay.current}/>
                </div>
              </div>
              </div>

              </>
              )
        }
                            
                            
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
