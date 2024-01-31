'use client'

import NavBar from "../../layout/navbar"
import Header from "../../layout/header"
import Footer from "../../layout/footer"
import MonthYear, { DateWeek, Today, formatDate } from '../../layout/utils/index'
import React from "react"
import toast, { Toaster } from "react-hot-toast"
import { getReportData, isShopOpened } from "../../../src/app/api/v1/controller/butchery/route"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function DashboardPage({session}) {

    let toastId

    let router=useRouter()

    let dateDetails=Today()

    const [DayRevenue,setDayRevenue]=React.useState('0')
    const [WeekRevenue,setWeekRevenue]=React.useState('0')
    const [MonthRevenue,setMonthRevenue]=React.useState('0')
    const [YearRevenue,setYearRevenue]=React.useState('0')
    const [YearsAgoRevenue,setYearsAgoRevenue]=React.useState('0')

    const [Cash,setCash]=React.useState()
    const [M_Pesa,setM_Pesa]=React.useState()
    
    const [DayExpense,setDayExpense]=React.useState('0')
    const [WeekExpense,setWeekExpense]=React.useState('0')
    const [MonthExpense,setMonthExpense]=React.useState('0')
    const [YearExpense,setYearExpense]=React.useState('0')
    const [YearsAgoExpense,setYearsAgoExpense]=React.useState('0')
    
    const branch=React.useRef()

    React.useEffect(()=>{
        branch.current=session.user.branch
        isShopClosed()

    },[])

    const isShopClosed=async()=>{

        let shopOpened=await isShopOpened(session.user.branch,session.user.id)

        if (shopOpened) {
            getReport()
            
        }
        else{
            if (session.user.access===1) {
                toast('Your Employer has closed the shop')
                signOut()
                router.push('/')
            }
            else{
                getReport()
            }
        }
    }
    
    const getReport=async()=>{

        dateDetails['dynamicDate']=dateDetails.yearsAgo

        toastId=toast.loading('Loading data. Please wait...',{id:toastId})

        let response=await getReportData(branch.current,dateDetails,1)

        let todayRevenue=[]
        let thisWeekRevenue=[]
        let thisMonthRevenue=[]
        let thisYearRevenue=[]
        let yearsAgoRevenue=[]

        let todayPaymentType=[]
        let thisWeekPaymentType=[]
        let thisMonthPaymentType=[]
        let thisYearPaymentType=[]
        let yearsAgoPaymentType=[]

        let revenue={
            day:0,
            week:0,
            month:0,
            year:0,
            yearsAgo:0,
        }

        let m_pesa={
            day:0,
            week:0,
            month:0,
            year:0,
            yearsAgo:0,
        }

        let cash={
            day:0,
            week:0,
            month:0,
            year:0,
            yearsAgo:0,
        }

        response?.reports?.revenue?.map((result)=>{

        let weekNo=DateWeek(result._id)

        let date=formatDate(result._id)

          result['date']=result._id
          result['weekNumber']=weekNo.weekNumber
          result['year']=weekNo.year
          result['month']=weekNo.month

            if (date === dateDetails.date) {

                let indexOfObjectDay=todayRevenue.findIndex((item)=>(item.date === result.date))

                if (indexOfObjectDay < 0) {
                    todayRevenue.push(
                        result
                    )
                    revenue.day +=parseFloat(result.totalAmount)
                } 

            }

            if (result._id >= dateDetails.thisWeek) {
                let indexOfObjectDay=thisWeekRevenue.findIndex((item)=>(dateDetails.thisWeek <= result.date && item.date === result.date))

                if (indexOfObjectDay < 0) {
                    thisWeekRevenue.push(
                        result
                    )
                    revenue.week +=parseFloat(result.totalAmount)
                } 
                
            }

            if (result._id >= dateDetails.thisMonth) {

                let indexOfObjectDay=thisMonthRevenue.findIndex((item)=>( item.date === result.date && item.month === weekNo.month && item.year === weekNo.year))
                
                if (indexOfObjectDay < 0) {
                    thisMonthRevenue.push(
                        result
                    )
                    revenue.month +=parseFloat(result.totalAmount)
                } 
                
            }

            if (result._id >= dateDetails.thisYear) {
                let indexOfObjectDay=thisYearRevenue.findIndex((item)=>(item.date === result.date && item.year === weekNo.year))

                if (indexOfObjectDay < 0) {
                    thisYearRevenue.push(
                        result
                    )
                    revenue.year +=parseFloat(result.totalAmount)
                } 
                
            }

            if (result._id >= dateDetails.yearsAgo) {
                let indexOfObjectDay=yearsAgoRevenue.findIndex((item)=>(item.date === result.date && item.date >= dateDetails.yearsAgo))

                if (indexOfObjectDay < 0) {
                    yearsAgoRevenue.push(
                        result
                    )
                    revenue.yearsAgo +=parseFloat(result.totalAmount)
                } 
                
            }

            if (date === dateDetails.date) {

                let indexOfObjectDay=todayPaymentType.findIndex((item)=>(item.date === result.date))
                if (indexOfObjectDay < 0) {
                    todayPaymentType.push(
                        result
                    )
                    
                    cash.day +=parseInt(result.documents.details.moreDateDetails.moreHourDetails.payedBy.cash)
                    m_pesa.day +=parseInt(result.documents.details.moreDateDetails.moreHourDetails.payedBy.m_pesa)
                }
                

            }

            if (result._id >= dateDetails.thisWeek) {
                let indexOfObjectDay=thisWeekPaymentType.findIndex((item)=>(dateDetails.thisWeek <= result.date && item.date === result.date))

                if (indexOfObjectDay < 0) {

                    thisWeekPaymentType.push(
                        result
                    )
                    cash.week +=parseInt(result.documents.details.moreDateDetails.moreHourDetails.payedBy.cash)
                    m_pesa.week +=parseInt(result.documents.details.moreDateDetails.moreHourDetails.payedBy.m_pesa)
                } 
                
            }

            if (result._id >= dateDetails.thisMonth) {

                let indexOfObjectDay=thisMonthPaymentType.findIndex((item)=>( item.date === result.date && item.month === weekNo.month && item.year === weekNo.year))
                
                if (indexOfObjectDay < 0) {

                    thisMonthPaymentType.push(
                        result
                    )
                    cash.month +=parseInt(result.documents.details.moreDateDetails.moreHourDetails.payedBy.cash)
                    m_pesa.month +=parseInt(result.documents.details.moreDateDetails.moreHourDetails.payedBy.m_pesa)
                }
                
            }

            if (result._id >= dateDetails.thisYear) {
                let indexOfObjectDay=thisYearPaymentType.findIndex((item)=>(item.date === result.date && item.year === weekNo.year))

                if (indexOfObjectDay < 0) {

                    thisYearPaymentType.push(
                        result
                    )
                    cash.year +=parseInt(result.documents.details.moreDateDetails.moreHourDetails.payedBy.cash)
                    m_pesa.year +=parseInt(result.documents.details.moreDateDetails.moreHourDetails.payedBy.m_pesa)
                } 
                
            }

            if (result._id >= dateDetails.yearsAgo) {
                let indexOfObjectDay=yearsAgoPaymentType.findIndex((item)=>(item.date === result.date && item.date >= dateDetails.yearsAgo))

                if (indexOfObjectDay < 0) {

                    yearsAgoPaymentType.push(
                        result
                    )
                    cash.yearsAgo +=parseInt(result.documents.details.moreDateDetails.moreHourDetails.payedBy.cash)
                    m_pesa.yearsAgo +=parseInt(result.documents.details.moreDateDetails.moreHourDetails.payedBy.m_pesa)
                }
                
            }

        })

        setDayRevenue(revenue.day)
        setWeekRevenue(revenue.week)
        setMonthRevenue(revenue.month)
        setYearRevenue(revenue.year)
        setYearsAgoRevenue(revenue.yearsAgo)


        setCash(cash)
        setM_Pesa(m_pesa)

        let todayExpense=0
        let thisWeekExpense=0
        let thisMonthExpense=0
        let thisYearExpense=0
        let yearsAgoExpense=0

        response?.reports?.expense?.map((result)=>{

            if (result._id === dateDetails.date) {
                todayExpense +=parseFloat(result.totalAmount)
            }

            if (result._id >= dateDetails.thisWeek) {
                thisWeekExpense +=parseFloat(result.totalAmount)
            }

            if (result._id >= dateDetails.thisMonth) {
                thisMonthExpense +=parseFloat(result.totalAmount)
            }

            if (result._id >= dateDetails.thisYear) {
                thisYearExpense +=parseFloat(result.totalAmount)
            }

            if (result._id >= dateDetails.yearsAgo) {
                yearsAgoExpense +=parseFloat(result.totalAmount)
            }

        })
        

        setDayExpense(todayExpense)
        setWeekExpense(thisWeekExpense)
        setMonthExpense(thisMonthExpense)
        setYearExpense(thisYearExpense)
        setYearsAgoExpense(yearsAgoExpense)

        toast.dismiss(toastId)

    }

  let now=MonthYear()
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
    <div id="page-top " >
    <div id="wrapper" className="bg-light">
        <NavBar session={session.user}/>
        <div class="d-flex flex-column" id="content-wrapper">
            <div id="content">
                <Header session={session.user}/>
                <div class="container-fluid">
                    <div class="d-flex d-sm-flex justify-content-center align-items-center mb-4">
                        <h4 class="text-dark mb-0 text-align-center"><strong><span
                                    className="text-danger">Revenue &amp; Expense Dashboard</span></strong></h4>
                                    {/* <a
                            class="btn btn-primary btn-sm d-block d-sm-inline-block" role="button" href="#"><i
                                class="fas fa-download fa-sm text-white-50"></i>&nbsp;Generate Report</a> */}
                    </div>
                    <div>
                        <div class="cardDiv font-monospace flex-wrap">
                            <div class="card d-flex card-dashboard text-dark"
                                >
                                <div class="card-body d-grid">
                                    <div class="row">
                                        <div class="col d-grid">
                                            <div class="row">
                                                <div class="col d-grid flex-wrap">
                                                    <p><strong><span
                                                                className="text-danger">Revenue</span></strong>
                                                        (<span className="text-primary">Today</span>)</p>
                                                    <p class="fw-bolder">Total KSh. {DayRevenue.toLocaleString()}</p>
                                                    <p class="fw-bolder">M-Pesa. {M_Pesa?.day.toLocaleString()}</p>
                                                    <p class="fw-bolder">Cash. {Cash?.day.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div class="card-body d-grid flex-wrap">
                                    <div class="row">
                                        <div class="col d-grid">
                                            <div class="row">
                                                <div class="col d-grid flex-wrap">
                                                    <p><strong><span
                                                                className="text-success">Expense</span></strong>
                                                        (<span className="text-danger">Today</span>)</p>
                                                    <p class="fw-bolder">Total KSh. {DayExpense.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div class="card-body d-grid flex-wrap">
                                    <div class="row">
                                        <div class="col d-grid">
                                            <div class="row">
                                                <div class="col d-grid flex-wrap">
                                                    <p><strong><span
                                                                className="text-primary">Net Income</span></strong>
                                                        (<span className="text-success">Today</span>)</p>
                                                    <p class="fw-bolder">Total KSh. {(DayRevenue-DayExpense).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                session.user.access !==1 && (
                                    <>
                                    <div class="card d-flex card-dashboard text-dark"
                                        >
                                        <div class="card-body d-grid">
                                            <div class="row">
                                                <div class="col d-grid">
                                                    <div class="row">
                                                        <div class="col d-grid flex-wrap">
                                                            <p><strong><span
                                                                        className="text-danger">Revenue</span></strong>
                                                                (<span className="text-primary">This Week</span>)</p>
                                                            <p class="fw-bolder">Total KSh. {WeekRevenue.toLocaleString()}</p>
                                                            <p class="fw-bolder">M-Pesa. {M_Pesa?.week.toLocaleString()}</p>
                                                            <p class="fw-bolder">Cash. {Cash?.week.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div class="card-body d-grid flex-wrap">
                                            <div class="row">
                                                <div class="col d-grid">
                                                    <div class="row">
                                                        <div class="col d-grid flex-wrap">
                                                            <p><strong><span
                                                                        className="text-success">Expense</span></strong>
                                                                (<span className="text-danger">This Week</span>)</p>
                                                            <p class="fw-bolder">Total KSh. {WeekExpense.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div class="card-body d-grid flex-wrap">
                                            <div class="row">
                                                <div class="col d-grid">
                                                    <div class="row">
                                                        <div class="col d-grid flex-wrap">
                                                            <p><strong><span
                                                                        className="text-primary">Net Income</span></strong>
                                                                (<span className="text-success">This Week</span>)</p>
                                                            <p class="fw-bolder">Total KSh. {(WeekRevenue-WeekExpense).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="card d-flex card-dashboard text-dark"
                                        >
                                        <div class="card-body d-grid">
                                            <div class="row">
                                                <div class="col d-grid">
                                                    <div class="row">
                                                        <div class="col d-grid flex-wrap">
                                                            <p><strong><span
                                                                        className="text-danger">Revenue</span></strong>
                                                                (<span className="text-primary">{now.month}</span>)</p>
                                                            <p class="fw-bolder">Total KSh. {MonthRevenue.toLocaleString()}</p>
                                                            <p class="fw-bolder">M-Pesa. {M_Pesa?.month.toLocaleString()}</p>
                                                            <p class="fw-bolder">Cash. {Cash?.month.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div class="card-body d-grid flex-wrap">
                                            <div class="row">
                                                <div class="col d-grid">
                                                    <div class="row">
                                                        <div class="col d-grid flex-wrap">
                                                            <p><strong><span
                                                                        className="text-success">Expense</span></strong>
                                                                (<span className="text-primary">{now.month}</span>)</p>
                                                            <p class="fw-bolder">Total KSh. {MonthExpense.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div class="card-body d-grid flex-wrap">
                                            <div class="row">
                                                <div class="col d-grid">
                                                    <div class="row">
                                                        <div class="col d-grid flex-wrap">
                                                            <p><strong><span
                                                                        className="text-primary">Net Income</span></strong>
                                                                (<span className="text-success">{now.month}</span>)</p>
                                                            <p class="fw-bolder">Total KSh. {(MonthRevenue-MonthExpense).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        session.user.package === 2 && (

                                            <>
                                            <div class="card d-flex card-dashboard text-dark"
                                                >
                                                <div class="card-body d-grid">
                                                    <div class="row">
                                                        <div class="col d-grid">
                                                            <div class="row">
                                                                <div class="col d-grid flex-wrap">
                                                                    <p><strong><span
                                                                                className="text-danger">Revenue</span></strong>
                                                                        (<span className="text-primary">{now.year}</span>)</p>
                                                                    <p class="fw-bolder">Total KSh. {YearRevenue.toLocaleString()}</p>
                                                                    <p class="fw-bolder">M-Pesa. {M_Pesa?.year.toLocaleString()}</p>
                                                                    <p class="fw-bolder">Cash. {Cash?.year.toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div class="card-body d-grid flex-wrap">
                                                    <div class="row">
                                                        <div class="col d-grid">
                                                            <div class="row">
                                                                <div class="col d-grid flex-wrap">
                                                                    <p><strong><span
                                                                                className="text-success">Expense</span></strong>
                                                                        (<span className="text-primary">{now.year}</span>)</p>
                                                                    <p class="fw-bolder">Total KSh. {YearExpense.toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div class="card-body d-grid flex-wrap">
                                                    <div class="row">
                                                        <div class="col d-grid">
                                                            <div class="row">
                                                                <div class="col d-grid flex-wrap">
                                                                    <p><strong><span
                                                                                className="text-primary">Net Income</span></strong>
                                                                        (<span className="text-success">{now.year}</span>)</p>
                                                                    <p class="fw-bolder">Total KSh. {(YearRevenue-YearExpense).toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="card d-flex card-dashboard text-dark"
                                                >
                                                <div class="card-body d-grid flex-wrap">
                                                    <div class="row">
                                                        <div class="col d-grid flex-wrap">
                                                            <div class="row">
                                                                <div class="col d-grid flex-wrap">
                                                                    <p><strong><span
                                                                                className="text-danger">Revenue</span></strong>
                                                                        (<span className="text-primary">{new Date(dateDetails.yearsAgo).getFullYear()} - {new Date().getFullYear()}</span>)</p>
                                                                    <p class="fw-bolder">Total KSh. {YearsAgoRevenue.toLocaleString()}</p>
                                                                    <p class="fw-bolder">M-Pesa. {M_Pesa?.yearsAgo.toLocaleString()}</p>
                                                                    <p class="fw-bolder">Cash. {Cash?.yearsAgo.toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div class="card-body d-grid flex-wrap">
                                                    <div class="row">
                                                        <div class="col d-grid flex-wrap">
                                                            <div class="row">
                                                                <div class="col d-grid flex-wrap">
                                                                    <p><strong><span
                                                                                className="text-success">Expense</span></strong>
                                                                        (<span className="text-primary">{new Date(dateDetails.yearsAgo).getFullYear()} - {new Date().getFullYear()}</span>)</p>
                                                                    <p class="fw-bolder">Total KSh. {YearsAgoExpense.toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div class="card-body d-grid flex-wrap">
                                                    <div class="row">
                                                        <div class="col d-grid">
                                                            <div class="row">
                                                                <div class="col d-grid flex-wrap">
                                                                    <p><strong><span
                                                                                className="text-primary">Net Income</span></strong>
                                                                        (<span className="text-success">{new Date(dateDetails.yearsAgo).getFullYear()} - {new Date().getFullYear()}</span>)</p>
                                                                    <p class="fw-bolder">Total KSh. {(YearsAgoRevenue-YearsAgoExpense).toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            </>
                                        )
                                    }

                                    
                                    </>
                                )
                            }

                            
                            
                        </div>
                    </div>
                </div>
            </div>
            
        </div>

        
        {/* <a class="border rounded d-inline scroll-to-top" href="#page-top"><i class="fas fa-angle-up"></i>
        </a> */}
    </div>
    <Footer />

    </div>
    </>
  )
}

