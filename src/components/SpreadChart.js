import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiCovid from '../services/api';

import { Line } from 'react-chartjs-2';

export default function SpreadChart() {
    const [date, setDate] = useState([]);
    const { country } = useParams();

    const [confirmed, setConfirmed] = useState([]);
    const [fatal, setFatal] = useState([]);
    
    /**
     * GET DATA
     */
    useEffect(() =>{
        async function loadCountryTotalData() {
            const response = await apiCovid.get(`/total/country/${country}`);
            
            const labelDate = []

            const confirmedData = []
            const fatalData = []

            for (let i=0; i<response.data.length; i+=5) {
                // Ignores if there are 0 cases confirmed
                if (response.data[i].Confirmed!==0) {                    
                    labelDate.push(response.data[i].Date.slice(0, 10));

                    // Spread Chart
                    confirmedData.push(response.data[i].Confirmed);
                    fatalData.push(response.data[i].Deaths);
                } 
            }

            // Checks if the last report is actually valid
            const lastRep = (response.data[response.data.length-1].Confirmed!==0) ? 1 : 2;

            // Pushes the last report
            labelDate.push(response.data[response.data.length-lastRep].Date.slice(0, 10));

            confirmedData.push(response.data[response.data.length-lastRep].Confirmed);
            fatalData.push(response.data[response.data.length-lastRep].Deaths);

            setDate(labelDate)
            setConfirmed(confirmedData)
            setFatal(fatalData)
        }
        loadCountryTotalData();
    }, [country]);

    /**
     * RENDER
     */
    return (
      <div className="virusSpreadChart">
        <h2>Gráfico de Propagação</h2>
        <Line
          data={{
            labels: date,
            datasets: [
              {
                label: 'Confirmados',
                fill: false,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: 'rgba(227, 34, 34,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(227, 34, 34,1)',
                hoverBorderColor: 'rgba(227, 34, 34,1)',
                data: confirmed
              },
              {
                label: 'Fatais',
                fill: false,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: 'rgba(55,55,55,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,75,75,1)',
                hoverBorderColor: 'rgba(75,75,75,1)',
                data: fatal
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