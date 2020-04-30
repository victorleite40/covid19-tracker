import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiCovid from '../../services/api';

import Header from '../../components/Header/Header'
import Ranking from '../../components/Ranking/Ranking'

import SpreadChart from '../../components/SpreadChart'
import NowActive from '../../components/NowActive'
import StatsChart from '../../components/StatsChart/StatsChart'
import DailyData from '../../components/DailyData'
import MostCases from '../../components/MostCases'

import './styles.css';

export default function Main() {
    const { country } = useParams();

    const [summary, setSummary] = useState([]);
    const [previousSummary, setPreviousSummary] = useState([]);

    /**
    * GET SUMMARY
    */
    useEffect(() =>{
        
        async function loadCountrySummary() {
            const response = await apiCovid.get(`/total/country/${country}`)

            // Checks if the last report is actualy valid
            const lastRep = (response.data[response.data.length-1].Confirmed!==0) ? 1 : 2;

            setSummary(response.data[response.data.length-lastRep])
            setPreviousSummary(response.data[(response.data.length-lastRep)-1])
        }
        loadCountrySummary();
    }, [country]);

    /**
     * DATA HANDLE
     */
    let newActive = (summary.Confirmed - summary.Recovered - summary.Deaths) - (previousSummary.Confirmed - previousSummary.Recovered - previousSummary.Deaths)
    let nowActive = (summary.Confirmed - summary.Recovered - summary.Deaths)
    
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
            <h1> {summary.Country} </h1>
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
                    <MostCases />
                </div>

                <SpreadChart />
                <NowActive />

                <Ranking page={"Local"} />
                <DailyData />
            </div>
        </div>
        </>
    );
}