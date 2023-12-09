'use client'

import { signOut } from "next-auth/react"
import NavBar from "../../layout/navbar"
import Header from "../../layout/header"
import Footer from "../../layout/footer"
import MonthYear from '../../layout/utils/index'

export default function DashboardPage({session}) {

  let now=MonthYear()
  return (
    <>
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
                                                    <p class="fw-bolder">KSh. 100,000</p>
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
                                                    <p class="fw-bolder">KSh. 20,000</p>
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
                                                    <p class="fw-bolder">KSh. 100,000</p>
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
                                                    <p class="fw-bolder">KSh. 20,000</p>
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
                                                    <p class="fw-bolder">KSh. 100,000</p>
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
                                                    <p class="fw-bolder">KSh. 20,000</p>
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
                                                    <p class="fw-bolder">KSh. 100,000</p>
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
                                                    <p class="fw-bolder">KSh. 20,000</p>
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
