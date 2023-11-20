'use client'

import dayjs from "dayjs"

export default function MonthYear() {

    let month=dayjs().format('MMMM')
    let year=dayjs().format('YYYY')

    let data={month,year}

    console.log(data);

    return data
  
}
