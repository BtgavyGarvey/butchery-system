import React from "react";
import { Pie } from 'react-chartjs-2';

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function PieChart({ chartData, timeDate ,options}) {

  // console.log(chartDataHour);
  
  return (
    <div className="chart-container">
      <h6 className='fw-bold text-center text-dark'>{timeDate}</h6>
      {/* <h6 style={{ textAlign: "center" }}></h6> */}
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: false,
              text: `Product Sales and Quantity Sold`
            },
            legend: {
              display: true
            }
          },

        }}
      />
    </div>
  );
}