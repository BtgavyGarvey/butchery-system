import { Bubble } from 'react-chartjs-2';

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function BubbleChart({ chartData ,options, timeDate}) {
  return (
    <div className="chart-container">
      <h6 className='fw-bold text-center text-dark'>{timeDate}</h6>
      {/* <h6 style={{ textAlign: "center" }}></h6> */}
      <Bubble
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