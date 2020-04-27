import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiCovid from '../../services/api';

import Header from '../../components/Header/Header'
import Ranking from '../../components/Ranking/Ranking'

import Propragacao from '../../components/Propragacao'
import NowActive from '../../components/NowActive'
import StatsChart from '../../components/StatsChart/StatsChart'
import DailyData from '../../components/DailyData'

import './styles.css';

export default function Main() {
    const [summary, setSummary] = useState([]);
    const [previousSummary, setPreviousSummary] = useState([]);

    /**
     * CHARTS DATA
     */
    const [date, setDate] = useState([]);
    const [confirmed, setConfirmed] = useState([]);
    const [fatal, setFatal] = useState([]);
    const [activeChart, setActiveChart] = useState([]);

    const [dailyRecovered, setDailyRecovered] = useState([]);
    const [dailyFatal, setDailyFatal] = useState([]);
    
    const { country } = useParams();

    useEffect(() =>{
        /**
         * GET SUMMARY
         */
        async function loadCountrySummary() {
            const response = await apiCovid.get(`/total/country/${country}`)

            // Checks if the last report is actualy valid
            const lastRep = (response.data[response.data.length-1].Confirmed!==0) ? 1 : 2;

            setSummary(response.data[response.data.length-lastRep])
            setPreviousSummary(response.data[(response.data.length-lastRep)-1])
        }

        /**
         * GET TOTAL DATA
         */
        async function loadCountryTotalData() {
            const response = await apiCovid.get(`/total/country/${country}`)
            
            const labelDate = []
            const confirmedData = []
            const fatalData = []
            const activeChartData = []

            const dailyRecoveredData = []
            const dailyFatalData = []

            for (let i=0; i<response.data.length; i+=5) {
                // Ignores if there are 0 cases confirmed
                if (response.data[i].Confirmed!==0) {
                    // Spread Chart
                    labelDate.push(response.data[i].Date.slice(0, 10));
                    confirmedData.push(response.data[i].Confirmed);
                    fatalData.push(response.data[i].Deaths);
                    
                    // Now Active Chart
                    activeChartData.push(response.data[i].Confirmed-response.data[i].Recovered-response.data[i].Deaths);

                    // Daily Data Chart
                    dailyRecoveredData.push(response.data[i].Recovered);
                    dailyFatalData.push(response.data[i].Deaths);
                } else {
                    i--;
                }
            }

            // Checks if the last report is actually valid
            const lastRep = (response.data[response.data.length-1].Confirmed!==0) ? 1 : 2;

            // Pushes the last report
            labelDate.push(response.data[response.data.length-lastRep].Date.slice(0, 10));
            confirmedData.push(response.data[response.data.length-lastRep].Confirmed);
            fatalData.push(response.data[response.data.length-lastRep].Deaths);
            activeChartData.push(response.data[response.data.length-lastRep].Confirmed-response.data[response.data.length-lastRep].Recovered-response.data[response.data.length-lastRep].Deaths);

            dailyRecoveredData.push(response.data[response.data.length-lastRep].Recovered);
            dailyFatalData.push(response.data[response.data.length-lastRep].Deaths);

            setDate(labelDate)
            setConfirmed(confirmedData)
            setFatal(fatalData)
            setActiveChart(activeChartData)

            setDailyRecovered(dailyRecoveredData)
            setDailyFatal(dailyFatalData)
        }
        loadCountryTotalData();
        loadCountrySummary();
    }, [country]);

    const newActive = (summary.Confirmed - summary.Recovered - summary.Deaths) - (previousSummary.Confirmed - previousSummary.Recovered - previousSummary.Deaths)
    const nowActive = (summary.Confirmed - summary.Recovered - summary.Deaths)
    
    let activeStats = (nowActive*100)/summary.Confirmed;
    let recoveredStats = (summary.Recovered*100)/summary.Confirmed;
    let fatalStats = (summary.Deaths*100)/summary.Confirmed;

    /**
     * RENDER
     */
    return (
        <>
        <Header />
        <div className="content">
            <h1> {summary.Country + " Statistics"} </h1>
            <div className="dashboardLocal">
                <div className="localSummary">
                    {/* <strong>Total Confirmed Cases</strong> <p> {summary.Confirmed} </p> */}
                    <li>
                        <p> <strong>Active Cases</strong> </p>
                        <h3 style={{color: '#EEAF1E'}} className="dataLocal" > {nowActive} </h3>
                        <p className="newLocal" > {(newActive>0) ? "+ " + newActive : "- " + (newActive-newActive*2)} </p>
                    </li>
                    <li>
                        <p> <strong>Recovered Cases</strong> </p>
                        <h3 style={{color: '#5AC923'}} className="dataLocal" > {summary.Recovered} </h3> 
                        <p className="newLocal" > + {summary.Recovered-previousSummary.Recovered} </p>
                    </li>
                    <li>
                        <p> <strong>Fatal Cases</strong> </p>
                        <h3 style={{color: '#575757'}} className="dataLocal" > {summary.Deaths} </h3> 
                        <p className="newLocal" > + {summary.Deaths - previousSummary.Deaths} </p>
                    </li>
                </div>

                <div className="subGridLocal">
                    <StatsChart title={summary.Country} page={"Local"} activeStats={activeStats.toFixed(2)} recoveredStats={recoveredStats.toFixed(2)} fatalStats={fatalStats.toFixed(2)} />
                </div>

                <Propragacao labelDate={date} confirmedData={confirmed} fatalData={fatal} />
                <NowActive labelDate={date} activeData={activeChart} />

                <Ranking page={"Local"} />
                <DailyData labelDate={date} recovered={dailyRecovered} fatal={dailyFatal} />
            </div>
        </div>
        </>
    );
}