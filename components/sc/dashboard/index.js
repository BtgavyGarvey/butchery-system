'use client'

import { signOut } from "next-auth/react"
import NavBar from "../../layout/navbar"
import Header from "../../layout/header"
import Footer from "../../layout/footer"
import MonthYear, { Today } from '../../layout/utils/index'
import React from "react"
import toast, { Toaster } from "react-hot-toast"
import { getReportData } from "../../../src/app/api/v1/controller/butchery/route"

export default function DashboardPage({session}) {

    let toastId

    let dateDetails=Today()

    const [DayRevenue,setDayRevenue]=React.useState('0')
    const [WeekRevenue,setWeekRevenue]=React.useState('0')
    const [MonthRevenue,setMonthRevenue]=React.useState('0')
    const [YearRevenue,setYearRevenue]=React.useState('0')
    const [YearsAgoRevenue,setYearsAgoRevenue]=React.useState('0')

    const [DayExpense,setDayExpense]=React.useState('0')
    const [WeekExpense,setWeekExpense]=React.useState('0')
    const [MonthExpense,setMonthExpense]=React.useState('0')
    const [YearExpense,setYearExpense]=React.useState('0')
    const [YearsAgoExpense,setYearsAgoExpense]=React.useState('0')
    
    const branch=React.useRef()
    React.useEffect(()=>{
        branch.current=session.user.branch
        getReport()
    })
    
    const getReport=async()=>{


        toastId=toast.loading('Loading data. Please wait...',{id:toastId})

        let response=await getReportData(branch.current,dateDetails,1)
        // console.log(response);

        let todayRevenue=0
        let thisWeekRevenue=0
        let thisMonthRevenue=0
        let thisYearRevenue=0
        let yearsAgoRevenue=0


        response?.reports?.revenue?.map((result)=>{

            if (result.date === dateDetails.date) {
                todayRevenue +=parseFloat(result.totalAmount)
            }

            if (result.date >= dateDetails.thisWeek) {
                thisWeekRevenue +=parseFloat(result.totalAmount)
            }

            if (result.date >= dateDetails.thisMonth) {
                thisMonthRevenue +=parseFloat(result.totalAmount)
            }

            if (result.date >= dateDetails.thisYear) {
                thisYearRevenue +=parseFloat(result.totalAmount)
            }

            if (result.date >= dateDetails.yearsAgo) {
                yearsAgoRevenue +=parseFloat(result.totalAmount)
            }

        })

        setDayRevenue(todayRevenue)
        setWeekRevenue(thisWeekRevenue)
        setMonthRevenue(thisMonthRevenue)
        setYearRevenue(thisYearRevenue)
        setYearsAgoRevenue(yearsAgoRevenue)


        let todayExpense=0
        let thisWeekExpense=0
        let thisMonthExpense=0
        let thisYearExpense=0
        let yearsAgoExpense=0

        response?.reports?.expense?.map((result)=>{

            if (result.date === dateDetails.date) {
                todayExpense +=parseFloat(result.totalAmount)
            }

            if (result.date >= dateDetails.thisWeek) {
                thisWeekExpense +=parseFloat(result.totalAmount)
            }

            if (result.date >= dateDetails.thisMonth) {
                thisMonthExpense +=parseFloat(result.totalAmount)
            }

            if (result.date >= dateDetails.thisYear) {
                thisYearExpense +=parseFloat(result.totalAmount)
            }

            if (result.date >= dateDetails.yearsAgo) {
                yearsAgoExpense +=parseFloat(result.totalAmount)
            }

        })
        

        setDayExpense(todayExpense)
        setWeekExpense(thisWeekExpense)
        setMonthExpense(thisMonthExpense)
        setYearExpense(thisYearExpense)
        setYearsAgoExpense(yearsAgoExpense)

        toast.dismiss(toastId)

        // console.log(response);
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
                    <div class="d-flex d-sm-flex justify-content-between align-items-center mb-4">
                        <h4 class="text-dark mb-0 text-align-center"><strong><span
                                    className="text-danger">Revenue &amp; Expense Dashboard</span></strong></h4>
                                    <a
                            class="btn btn-primary btn-sm d-block d-sm-inline-block" role="button" href="#"><i
                                class="fas fa-download fa-sm text-white-50"></i>&nbsp;Generate Report</a>
                    </div>
                    <div>
                        <div class="cardDiv font-monospace flex-wrap">
                            <div class="card d-flex card-dashboard"
                                >
                                <div class="card-body d-grid">
                                    <div class="row">
                                        <div class="col d-grid">
                                            <div class="row">
                                                <div class="col d-grid flex-wrap">
                                                    <p><strong><span
                                                                className="text-danger">Revenue</span></strong>
                                                        (<span className="text-primary">Today</span>)</p>
                                                    <p class="fw-bolder">KSh. {DayRevenue.toLocaleString()}</p>
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
                                                        (<span className="text-info">Today</span>)</p>
                                                    <p class="fw-bolder">KSh. {DayExpense.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card d-flex card-dashboard"
                                >
                                <div class="card-body d-grid">
                                    <div class="row">
                                        <div class="col d-grid">
                                            <div class="row">
                                                <div class="col d-grid flex-wrap">
                                                    <p><strong><span
                                                                className="text-danger">Revenue</span></strong>
                                                        (<span className="text-primary">This Week</span>)</p>
                                                    <p class="fw-bolder">KSh. {WeekRevenue.toLocaleString()}</p>
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
                                                        (<span className="text-info">This Week</span>)</p>
                                                    <p class="fw-bolder">KSh. {WeekExpense.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card d-flex card-dashboard"
                                >
                                <div class="card-body d-grid">
                                    <div class="row">
                                        <div class="col d-grid">
                                            <div class="row">
                                                <div class="col d-grid flex-wrap">
                                                    <p><strong><span
                                                                className="text-danger">Revenue</span></strong>
                                                        (<span className="text-primary">{now.month}</span>)</p>
                                                    <p class="fw-bolder">KSh. {MonthRevenue.toLocaleString()}</p>
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
                                                        (<span className="text-info">{now.month}</span>)</p>
                                                    <p class="fw-bolder">KSh. {MonthExpense.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card d-flex card-dashboard"
                                >
                                <div class="card-body d-grid">
                                    <div class="row">
                                        <div class="col d-grid">
                                            <div class="row">
                                                <div class="col d-grid flex-wrap">
                                                    <p><strong><span
                                                                className="text-danger">Revenue</span></strong>
                                                        (<span className="text-primary">{now.year}</span>)</p>
                                                    <p class="fw-bolder">KSh. {YearRevenue.toLocaleString()}</p>
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
                                                        (<span className="text-info">{now.year}</span>)</p>
                                                    <p class="fw-bolder">KSh. {YearExpense.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card d-flex card-dashboard"
                                >
                                <div class="card-body d-grid flex-wrap">
                                    <div class="row">
                                        <div class="col d-grid flex-wrap">
                                            <div class="row">
                                                <div class="col d-grid flex-wrap">
                                                    <p><strong><span
                                                                className="text-danger">Revenue</span></strong>
                                                        (<span className="text-primary">{new Date(dateDetails.yearsAgo).getFullYear()} - {new Date().getFullYear()}</span>)</p>
                                                    <p class="fw-bolder">KSh. {YearsAgoRevenue.toLocaleString()}</p>
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
                                                        (<span className="text-info">{new Date(dateDetails.yearsAgo).getFullYear()} - {new Date().getFullYear()}</span>)</p>
                                                    <p class="fw-bolder">KSh. {YearsAgoExpense.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
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
