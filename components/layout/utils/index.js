'use client'

import { addMonths } from "date-fns"
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
    const thisYear=moment().format('YYYY')+'-01-01'
    const yearsAgo=moment().subtract(5,"years").format('YYYY-MM-DD')
    const uniqueDate=moment().format('YYYY')+moment().format('MM')+moment().format('DD')+moment().format('HH')+moment().format('mm')+moment().format('ss')
    
    let dayTime={
        date,hour,thisWeek,thisMonth,yearsAgo,fullDate,uniqueDate,time,thisYear
    }
    return dayTime
}

export const DateTime=(date)=>{

    let dateTime=new Date(date).toDateString() +' '+ new Date(date).toLocaleTimeString()

    return dateTime
}

export const DateOnly=(date)=>{

    let dateTime=new Date(date).toDateString()

    return dateTime
}

export const TimeSeconds=()=>{

    return moment().format('LTS')
}

export const AddDate=(from,value)=>{

    const today = new Date(from);
    const plusDate = addMonths(today, value);
    return plusDate
}

export const DateWeek=(day)=>{

    let date=new Date(day)
    const year=date.getFullYear()
    const month=date.getMonth()
  
    const firstDay = new Date(year, month, 1);
    const daysOffset = firstDay.getDay();
    const dayOfMonth = date.getDate();
  
    let weekNumber=Math.ceil((dayOfMonth + daysOffset) / 7);
    
  
    let data={
      weekNumber,
      year,
      month: month + 1
    }
    
    return data
  
}
 
