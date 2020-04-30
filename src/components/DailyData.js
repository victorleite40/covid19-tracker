import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiCovid from '../services/api';

import { Bar } from 'react-chartjs-2';

export default function DailyData() {

    const [date, setDate] = useState([]);
    const { country } = useParams();

    const [dailyRecovered, setDailyRecovered] = useState([]);
    const [dailyFatal, setDailyFatal] = useState([]);

    /**
    * GET DATA
    */
    useEffect(() =>{        
        async function loadCountryTotalData() {
            const response = await apiCovid.get(`/total/country/${country}`);
            
            const labelDate = []

            const dailyRecoveredData = []
            const dailyFatalData = []

            for (let i=0; i<response.data.length; i+=3) {
                // Ignores if there are 0 cases confirmed
                if (response.data[i].Deaths>0 && i>0) {
                    labelDate.push(response.data[i].Date.slice(0, 10));

                    // Daily Data Chart
                    dailyRecoveredData.push(response.data[i].Recovered - response.data[i-1].Recovered );
                    dailyFatalData.push(response.data[i].Deaths - response.data[i-1].Deaths);
                } 
            }

            // Checks if the last report is actually valid
            const lastRep = (response.data[response.data.length-1].Confirmed!==0) ? 1 : 2;

            // Pushes the last report
            labelDate.push(response.data[response.data.length-lastRep].Date.slice(0, 10));

            dailyRecoveredData.push(response.data[response.data.length-lastRep].Recovered - response.data[response.data.length-lastRep-1].Recovered);
            dailyFatalData.push(response.data[response.data.length-lastRep].Deaths - response.data[response.data.length-lastRep-1].Deaths);

            setDate(labelDate)

            setDailyRecovered(dailyRecoveredData)
            setDailyFatal(dailyFatalData)
        }
        loadCountryTotalData();
    }, [country]);

    /**
     * RENDER
     */
    return (
        <div className="dailyChart">
            <h2>Daily Cases</h2>

            <Bar
                data={{
                labels: date,
                datasets: 
                    [{
                        label: 'Recovered',
                        fill: false,
                        backgroundColor: '#8aeb63',
                        borderColor: '#8aeb63',
                        borderWidth: 1,
                        hoverBackgroundColor: '#8aeb63',
                        hoverBorderColor: '#8aeb63',
                        data: dailyRecovered
                    },
                    {
                        label: 'Fatal',
                        fill: false,
                        backgroundColor: '#757575',
                        borderColor: '#757575',
                        borderWidth: 1,
                        hoverBackgroundColor: '#757575',
                        hoverBorderColor: '#757575',
                        data: dailyFatal
                    }]
                }}
                width={100}
                height={33}
                options={{ 
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
                }}
            />

        </div>
    );
};