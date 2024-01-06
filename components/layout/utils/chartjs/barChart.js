import { Bar } from 'react-chartjs-2';

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function BarChart({ chartData,options, timeDate }) {
  return (
    <div className="chart-container">
      <h6 className='fw-bold text-center text-dark'>{timeDate}</h6>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: false,
              text: "Product Sales and Quantity Sold"
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
};