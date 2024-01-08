'use client'

import { navRefDiv } from "./navbar";
import React from 'react'

export default function Header({session}) {

    let checkBox=React.useRef()

    React.useEffect(()=>{
        navRefDiv.current.style.display='none'
    },[navRefDiv.current])

    const check_Box=()=>{
        if (checkBox.current.checked) {
            navRefDiv.current.style.display='none'
            checkBox.current.checked=false
        }
        else{
            navRefDiv.current.style.display='block'
            checkBox.current.checked
            checkBox.current.checked=true
        }
    }


    
  return (
    <>
        <nav class="navbar navbar-expand bg-white shadow mb-4 top-bar static-top navbar-light">
            <div class="container-fluid d-flex justify-content-between">
                <div className="d-flex ">
                <button onClick={check_Box}
                    class="btn btn-link d-md-block bounce animated rounded-circle me-3" id="sidebarToggleTop"
                    type="button"><i  class="fas fa-bars"><input ref={checkBox} type="checkbox" style={{visibility:'hidden'}}></input></i>
                    
                </button>
                <span class="d-block d-lg-inline  text-gray-600 small">{session.branchName} Branch</span>
                </div>
                
                <ul class="navbar-nav flex-wrap ms-auto">
                    <li class="nav-item dropdown no-arrow">
                        <div class="nav-item dropdown no-arrow ">
                        <span class="d-block d-lg-inline  text-gray-600 small">{session.name}</span>
                            
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    </>
  )
}
