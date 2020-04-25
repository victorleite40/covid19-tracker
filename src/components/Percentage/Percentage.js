import React, { useState, useEffect } from 'react';
import apiCovid from '../../services/api';

import './styles.css';

export default function Header(props) {    
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
    let active = (nowActive*100)/summary.TotalConfirmed;
    let recovered = (summary.TotalRecovered*100)/summary.TotalConfirmed;
    let fatal = (summary.TotalDeaths*100)/summary.TotalConfirmed;
    
    /**
     * RENDER
     */
    return (
        <div className={"percentage" + props.page}>
            <h1>Global Statistics</h1>
            <div className="globalStats">
                    <li>
                        <p style={{ color: "#a83f2f" }} className="dataStats" > { active.toFixed(2) + "%" } </p>
                        <p> <strong>Active </strong> </p>
                    </li>
                    <li>
                        <p style={{ color: "#45a82f" }} className="dataStats" > { recovered.toFixed(2) + "%" } </p> 
                        <p> <strong>Recovered </strong> </p>
                    </li>
                    <li>
                        <p style={{ color: "#333" }} className="dataStats" > { fatal.toFixed(2) + "%"} </p> 
                        <p> <strong>Fatal </strong> </p>
                    </li>
                </div>
        </div>
    );
}