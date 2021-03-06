import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiCovid from '../services/api';

import { Line } from 'react-chartjs-2';

export default function NowActive() {
    const [date, setDate] = useState([]);
    const { country } = useParams();
    
    const [activeChart, setActiveChart] = useState([]);

    /**
     * GET DATA
     */
    useEffect(() =>{
        async function loadCountryTotalData() {
            const response = await apiCovid.get(`/total/country/${country}`);
            
            const labelDate = []
            const activeChartData = []

            for (let i=0; i<response.data.length; i+=5) {
                // Ignores if there are 0 cases confirmed
                if (response.data[i].Confirmed!==0) {
                    labelDate.push(response.data[i].Date.slice(0, 10));

                    // Now Active Chart
                    activeChartData.push(response.data[i].Confirmed-response.data[i].Recovered-response.data[i].Deaths);
                } 
            }

            // Checks if the last report is actually valid
            const lastRep = (response.data[response.data.length-1].Confirmed!==0) ? 1 : 2;

            // Pushes the last report
            labelDate.push(response.data[response.data.length-lastRep].Date.slice(0, 10));
            
            activeChartData.push(response.data[response.data.length-lastRep].Confirmed-response.data[response.data.length-lastRep].Recovered-response.data[response.data.length-lastRep].Deaths);

            setDate(labelDate)
            setActiveChart(activeChartData)
        }
        loadCountryTotalData();
    }, [country]);
    
    /**
     * RENDER
     */
    return (
      <div className="nowActiveChart">
        <h2>Simultaneously Active Cases</h2>
        <Line
          data={{
            labels: date,
            datasets: [
              {
                label: 'Active Cases',
                fill: false,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: 'rgba(209, 148, 25,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(209, 148, 25,1)',
                hoverBorderColor: 'rgba(209, 148, 25,1)',
                data: activeChart
              }
            ]
          }}
          width={100}
          height={33}
          options={
            { 
              maintainAspectRatio: true,
              legend: {
                position: 'top',
                labels: {
                  usePointStyle: true,
                  boxWidth: 5
                }              
              },
              tooltips: {
                legendColorBackground: 'rgba(75,75,75,1)',
                mode: 'index',
                intersect: false
              },
              hover: {
                mode: 'index',
                intersect: false
              }
            }
          }
        />
      </div>
    );
};