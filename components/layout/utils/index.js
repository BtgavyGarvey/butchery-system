'use client'

import dayjs from "dayjs"
import moment from "moment"

export default function MonthYear() {

    let month=dayjs().format('MMMM')
    let year=dayjs().format('YYYY')

    let data={month,year}

    // console.log(data);

    return data
  
}

export const DayTime=()=>{

    const dayTime=moment().format('LL')
    return dayTime
}

export const Today=()=>{

    let today=new Date()

    const date=moment().format('YYYY-MM-DD')
    const hour=moment().format('H')
    const thisWeek=moment().weekday(1).format('YYYY-MM-DD')
    const thisMonth=moment().format('YYYY')+'/'+moment().format('MM')+'/01'
    const yearsAgo=moment().subtract(5,"years").format('YYYY-MM-DD')
    

    let dayTime={
        date,hour,thisWeek,thisMonth,yearsAgo
    }
    return dayTime
}
