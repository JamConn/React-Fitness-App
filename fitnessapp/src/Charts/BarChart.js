import React, {useState, useEffect} from "react";
import{Chart as ChartJS, BarElement, CategoryScale, LinearScale} from 'chart.js'
import Chart from "chart.js/auto"
import{Bar} from 'react-chartjs-2'

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale
)



const BarChart = () => {


    (async function() {
        const data = [
          { year: 2010, count: 10 },
          { year: 2011, count: 20 },
          { year: 2012, count: 15 },
          { year: 2013, count: 25 },
          { year: 2014, count: 22 },
          { year: 2015, count: 30 },
          { year: 2016, count: 28 },
        ];
      
        new Chart(
          document.getElementById('acquisitions'),
          {
            type: 'bar',
            data: {
              labels: data.map(row => row.year),
              datasets: [
                {
                  label: 'Acquisitions by year',
                  data: data.map(row => row.count)
                }
              ]
            }
          }
        );
      })();

     

    return (
        <div>
            <Bar height={400}
            />

        </div>
    )
}

export default BarChart