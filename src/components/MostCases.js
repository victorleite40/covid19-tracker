import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiCovid from '../services/api'

export default function MostCases() {
    const { country } = useParams();

    const [hiRecovered, setHiRecovered] = useState(0)
    const [fatal, setFatal] = useState(0)
    
    /**
     * GET DATA
     */
    useEffect(() =>{
        async function loadCountryTotalData() {
            const response = await apiCovid.get(`/total/country/${country}`);
            
            for (let i=0; i<response.data.length; i++) {
                if (i>1) {
                    let newRecovered = response.data[i].Recovered - response.data[i-1].Recovered;
                    
                    if (newRecovered>hiRecovered) {
                        setHiRecovered(newRecovered)
                    }
                    if (response.data[i].Deaths>response.data[i-1].Deaths) {
                        setFatal(response.data[i].Deaths)
                    }
                }
            }
        }
        loadCountryTotalData();
    }, [country]);

    /**
     * RENDER
     */
    return (
        <div className="mostCases">
            <h2>Most Cases in a Day</h2>
            <p>{hiRecovered}</p>
            <p>{fatal}</p>
        </div>
    )
}