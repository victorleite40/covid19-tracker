import React, { useEffect, useState } from 'react';
import apiCovid from '../../services/api';

import Propragacao from '../../components/Propragacao'
import Header from '../../components/Header/Header'

import './styles.css';

export default function Main() {
    const [summary, setSummary] = useState([]);
    
    useEffect(() =>{
        async function loadGlobalSummary() {
            const response = await apiCovid.get('/summary')
            
            setSummary(response.data.Global)
        }
        loadGlobalSummary();
    }, []);

    return (
        <>
        <Header />
        <div className="dashboard">
            <div className="globalSummary">
                <h1>Sumário Global</h1>
                <strong>Total de Casos Confirmados</strong> <p> {summary.TotalConfirmed} </p>
                <div className="globalDetails">
                    <li>
                        <p className="new" > + {summary.NewConfirmed} </p>
                        <p className="dataGlobal" > {summary.TotalConfirmed - summary.TotalDeaths - summary.TotalRecovered } </p>
                        <p> <strong>Casos Ativos</strong> </p>
                    </li>
                    <li>
                        <p className="new" > + {summary.NewRecovered} </p>
                        <p className="dataGlobal" > {summary.TotalRecovered } </p> 
                        <p> <strong>Casos Recuperados</strong> </p>
                    </li>
                    <li>
                        <p className="new" > + {summary.NewDeaths} </p>
                        <p className="dataGlobal" > {summary.TotalDeaths } </p> 
                        <p> <strong>Casos Fatais</strong> </p>
                    </li>
                </div>
            </div>

            <Propragacao />
        </div>
        </>
    );
}