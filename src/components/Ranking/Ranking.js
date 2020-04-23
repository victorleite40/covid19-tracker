import React, { useState, useEffect } from 'react';
import apiCovid from '../../services/api';
import { Link } from 'react-router-dom';

import arrowUp from '../../assets/arrow-up.svg'
import arrowDown from '../../assets/arrow-down.svg'
import './styles.css';

export default function Header() {
    const [regions, setRegions] = useState([]);

    const [sort, setSort] = useState('confirmed'); // Sort variable; Confirmed cases by default
    const [arrowRot, setArrowRot] = useState(false);
    
    /**
     * GET GLOBAL SUMMARY
     */
    useEffect(() => {
        async function loadGlobalRanking() {
            const response = await apiCovid.get('/summary')
            
            setRegions(response.data.Countries)
        }
        loadGlobalRanking();
    }, [sort]);

    function handleSort(choice) {
        if (sort===choice&&sort!=='') {
            setSort(choice + "r")
            setArrowRot(true)
        } else {
            setSort(choice)
            setArrowRot(false)
        }
    }

    /**
     * RENDER
     */
    return (
        <div className="ranking">
            <h1>Global Ranking</h1>

            <div>
                <table>
                    <tr>
                        <th><button onClick={() => handleSort('')} >Region <img src={(sort==='') ? arrowRot : "" } /> </button></th>
                        <th><button onClick={() => handleSort('confirmed')} >Confirmed <img src={(sort==='confirmed') ? ((arrowRot) ? "" : arrowDown) : ((sort==='confirmedr') ? (arrowRot) ? arrowUp : "" : "")} /> </button></th>
                        <th><button onClick={() => handleSort('recovered')} >Recovered <img src={(sort==='recovered') ? ((arrowRot) ? "" : arrowDown) : ((sort==='recoveredr') ? (arrowRot) ? arrowUp : "" : "")} /> </button></th>
                        <th><button onClick={() => handleSort('fatal')} >Fatal <img src={(sort==='fatal') ? ((arrowRot) ? "" : arrowDown) : ((sort==='fatalr') ? (arrowRot) ? arrowUp : "" : "")} /> </button></th>
                    </tr>
                    {regions
                        .filter(region => region.TotalConfirmed>0) // Render only if there are at least 1 case confirmed
                        .sort(function(a, b) { // Sort according to the user's choice
                            switch (sort) {
                                case 'confirmed': return b.TotalConfirmed-a.TotalConfirmed
                                case 'confirmedr': return a.TotalConfirmed-b.TotalConfirmed
                                case 'recovered': return b.TotalRecovered-a.TotalRecovered
                                case 'recoveredr': return a.TotalRecovered-b.TotalRecovered
                                case 'fatal': return b.TotalDeaths-a.TotalDeaths
                                case 'fatalr': return a.TotalDeaths-b.TotalDeaths
                                default:
                                    break;
                            }
                        })
                        .map(region => ( // Maps
                            <tr className="item" key={region.Country} >
                                <td>{region.Country}</td>
                                <td>{region.TotalConfirmed}</td>
                                <td>{region.TotalRecovered}</td>
                                <td>{region.TotalDeaths}</td>
                            </tr>
                        ))
                    }
                </table>
            </div>
        </div>
    );
}