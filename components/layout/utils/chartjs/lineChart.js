import React from "react";
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function LineChart({ chartData, timeDate, options }) {
  return (
    <div className="chart-container">
      <h6 className='text-center text-dark fw-bold'>{timeDate}</h6>
      {/* <h6 style={{ textAlign: "center" }}></h6> */}
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: `Product Sales and Quantity Sold`
            },
            legend: {
              display: true
            }
          },
          scales:options.scales
        }}
      />
    </div>
  );
}