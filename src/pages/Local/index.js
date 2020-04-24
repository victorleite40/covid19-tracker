import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiCovid from '../../services/api';

import Propragacao from '../../components/Propragacao'
import NowActive from '../../components/NowActive'

import Header from '../../components/Header/Header'
import Ranking from '../../components/Ranking/Ranking'

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

            for (let i=0; i<response.data.length; i+=5) {
                // Ignores if there are 0 cases confirmed
                if (response.data[i].Confirmed!==0) {
                    // Spread Chart
                    labelDate.push(response.data[i].Date.slice(0, 10));
                    confirmedData.push(response.data[i].Confirmed);
                    fatalData.push(response.data[i].Deaths);
                    
                    // Now Active Chart
                    activeChartData.push(response.data[i].Confirmed-response.data[i].Recovered-response.data[i].Deaths);
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

            setDate(labelDate)
            setConfirmed(confirmedData)
            setFatal(fatalData)
            setActiveChart(activeChartData)
        }
        loadCountryTotalData();
        loadCountrySummary();
    }, [country]);

    const newActive = (summary.Confirmed - summary.Recovered - summary.Deaths) - (previousSummary.Confirmed - previousSummary.Recovered - previousSummary.Deaths)
    const nowActive = (summary.Confirmed - summary.Recovered - summary.Deaths)
    
    /**
     * RENDER
     */
    return (
        <>
        <Header />
        <div className="dashboardLocal">
            <div className="globalSummary">
                <h1> {summary.Country} </h1>
                <strong>Total de Casos Confirmados</strong> <p> {summary.Confirmed} </p>
                <div className="globalDetails">
                    <li>
                        <p className="new" > {(newActive>0) ? "+ " + newActive : "- " + (newActive-newActive*2)} </p>
                        <p className="dataGlobal" > {nowActive} </p>
                        <p> <strong>Casos Ativos</strong> </p>
                    </li>
                    <li>
                        <p className="new" > + {summary.Recovered-previousSummary.Recovered} </p>
                        <p className="dataGlobal" > {summary.Recovered} </p> 
                        <p> <strong>Casos Recuperados</strong> </p>
                    </li>
                    <li>
                        <p className="new" > + {summary.Deaths - previousSummary.Deaths} </p>
                        <p className="dataGlobal" > {summary.Deaths} </p> 
                        <p> <strong>Casos Fatais</strong> </p>
                    </li>
                </div>
            </div>

            <Propragacao labelDate={date} confirmedData={confirmed} fatalData={fatal} />
            <NowActive labelDate={date} activeData={activeChart} />

            <Ranking page={"Local"} />
        </div>
        </>
    );
}