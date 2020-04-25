import React, { useEffect, useState } from 'react';
import apiCovid from '../../services/api';

import Header from '../../components/Header/Header'
import Ranking from '../../components/Ranking/Ranking'
import StatsChart from '../../components/StatsChart/StatsChart'

import './styles.css';

export default function Main() {
    const [summary, setSummary] = useState([]);
    
    /**
     * GET GLOBAL SUMMARY
     */
    useEffect(() =>{
        async function loadGlobalSummary() {
            const response = await apiCovid.get('/summary')
            
            setSummary(response.data.Global)
        }
        loadGlobalSummary();
    }, []);
    
    let nowActive = summary.TotalConfirmed - summary.TotalDeaths - summary.TotalRecovered;
    let activeStats = (nowActive*100)/summary.TotalConfirmed;
    let recoveredStats = (summary.TotalRecovered*100)/summary.TotalConfirmed;
    let fatalStats = (summary.TotalDeaths*100)/summary.TotalConfirmed;

    /**
     * RENDER
     */
    return (
        <>
        <Header />
        <div className="dashboardGlobal">
            <div className="globalSummary">
                <h1>Global Summary</h1>
                <strong>Total Confirmed Cases</strong> <p> {summary.TotalConfirmed} </p>
                <div className="globalDetails">
                    <li>
                        <p className="new" > + {summary.NewConfirmed} </p>
                        <p className="dataGlobal" > {nowActive} </p>
                        <p> <strong>Active Cases</strong> </p>
                    </li>
                    <li>
                        <p className="new" > + {summary.NewRecovered} </p>
                        <p className="dataGlobal" > {summary.TotalRecovered} </p> 
                        <p> <strong>Recovered Cases</strong> </p>
                    </li>
                    <li>
                        <p className="new" > + {summary.NewDeaths} </p>
                        <p className="dataGlobal" > {summary.TotalDeaths} </p> 
                        <p> <strong>Fatal Cases</strong> </p>
                    </li>
                </div>

            </div>
            <Ranking page={"Main"} />

            <StatsChart title={"Global"} page={"Main"} activeStats={activeStats.toFixed(2)} recoveredStats={recoveredStats.toFixed(2)} fatalStats={fatalStats.toFixed(2)} />
        </div>
        </>
    );
}