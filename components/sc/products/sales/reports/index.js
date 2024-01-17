'use client'

import React from "react"
import Footer from "../../../../layout/footer"
import Header from "../../../../layout/header"
import NavBar from "../../../../layout/navbar"
import { getBranches, getReportData, isShopOpened } from "../../../../../src/app/api/v1/controller/butchery/route"
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

    const [chartData, setChartData] = React.useState();

    const DateRef=React.useRef()
    const refDay=React.useRef('Sales Today')
    const cashier=React.useRef()
    const text=React.useRef('')
    const product=React.useRef()
    const radio1=React.useRef()
    const radio2=React.useRef()
    const radio=React.useRef()
    const chartjs1=React.useRef()
    const chartjs2=React.useRef()
    const chartjs3=React.useRef()
    const view=React.useRef()
    const [Branches, setBranches]=React.useState([])
    const branch=React.useRef()

    let toastId
    let data
    let dateDetails=Today()

    React.useEffect(()=>{
        let date=Today()
        DateRef.current=date.date
        branch.current=session.user.branch
        product.current='all'
        cashier.current='all'
        isShopClosed()

    },[])

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

      view.current.style.display='block'

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

    const handleChangeView=(e)=>{
      const { name, value } = e.target;

      
      if (value==='1') {
        chartjs1.current.style.display='flex'
        chartjs2.current.style.width='50%'
        chartjs3.current.style.width='50%'
      } else {
        chartjs1.current.style.display='block'
        chartjs2.current.style.width='100%'
        chartjs3.current.style.width='100%'
      }
    
    }

    const loopDataDate=()=>{

        let value=refDay.current
        data=Revenue.current
    
        if (value==='Sales Today') {
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
                          <option value={'Sales Today'}>Sales Today</option>
                          {
                            session.user.access !==1 && (
                              <>
                              <option value={'Sales This Week'}>This Week</option>
                              <option value={'Sales This Month'}>Sales This Month</option>
                              <option value={'Sales This Year'}>Sales This Year</option>
                              <option value={'Sales In The Past 5 Years'}>Sales In The Past 5 Years</option>
                              </>
                            )
                          }
                          
                        </select>
                        </div>
                        {
                          session.user.access !==1 && (
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
                          )
                        }
                        
                        <div ref={view} className="col-md-2 p-1 view">
                          <label className="fw-bold">Choose View</label>
                          <select
                          className="form-control"
                          onChange={handleChangeView}
                          name="view"
                        >
                         <option value={'1'}>Default</option>
                         <option value={'2'}>Full</option>
                        </select>
                        </div>
                        </div>
                        {
                            chartData && (
                              <>
                              <div ref={chartjs1} className="chart-js">
                              <div ref={chartjs2} className="chartjs">
                                <div className="chartjs-div">
                                <BarChart chartData={chartData} options={options2} timeDate={refDay.current}/>
                                </div>
                                <div className='chartjs-div polar'>
                                <PolarAreaChart chartData={chartData} options={options2} timeDate={refDay.current}/>
                                </div>
                                <div className='chartjs-div polar'>
                                <DoughnutChart chartData={chartData} options={options2} timeDate={refDay.current}/>
                                </div>

                              </div>
                              <div ref={chartjs3} className="chartjs">
                                <div className='chartjs-div'>
                                <LineChart chartData={chartData} options={options2} timeDate={refDay.current}/>
                                </div>
                                <div className="chartjs-div polar">
                                <PieChart chartData={chartData} options={options2} timeDate={refDay.current}/>
                                </div>
                                {
                                  radio.current===1 && (
                                    <>
                                    <div className='chartjs-div polar' >
                                      <BubbleChart chartData={chartData} options={options2} timeDate={refDay.current}/>
                                    </div>
                                    </>
                                  )
                                }
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
