import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiCovid from '../services/api'

export default function MostCases() {
    const { country } = useParams();

    const [hiRecovered, setHiRecovered] = useState(0)
    const [hiFatal, setHiFatal] = useState(0)
    
    /**
     * GET DATA
     */
    useEffect(() =>{
        async function loadCountryTotalData() {
            const response = await apiCovid.get(`/total/country/${country}`);
            
            for (let i=1; i<response.data.length; i++) {
                let newRecovered = response.data[i].Recovered - response.data[i-1].Recovered;
                let newFatal = response.data[i].Deaths - response.data[i-1].Deaths;
                
                if (newRecovered>hiRecovered) {
                    setHiRecovered(newRecovered)
                }
                if (response.data[i].Deaths>response.data[i-1].Deaths) {
                    setHiFatal(newFatal)
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

            <h3 style={{marginTop: "25px"}} >Recovered</h3>
            <p>{hiRecovered}</p>

            <h3 style={{marginTop: "30px"}} >Fatal</h3>
            <p>{hiFatal}</p>
        </div>
    )
}