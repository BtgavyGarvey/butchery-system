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

export const formatDate=(date)=>{

    const dayTime=new Date(date)
    const formattedDate=dayTime.toISOString().split('T')[0]
    return formattedDate
}

export const Today=()=>{

    let today=new Date()

    const fullDate=moment().format('YYYY-MM-DD HH:mm:ss')
    const time=moment().format('HH:mm:ss')
    const date=moment().format('YYYY-MM-DD')
    const hour=moment().format('HH')
    const thisWeek=moment().weekday(1).format('YYYY-MM-DD')
    const thisMonth=moment().format('YYYY')+'-'+moment().format('MM')+'-01'
    const yearsAgo=moment().subtract(5,"years").format('YYYY-MM-DD')
    const uniqueDate=moment().format('YYYY')+moment().format('MM')+moment().format('DD')+moment().format('HH')+moment().format('mm')+moment().format('ss')
    

    let dayTime={
        date,hour,thisWeek,thisMonth,yearsAgo,fullDate,uniqueDate,time
    }
    return dayTime
}
