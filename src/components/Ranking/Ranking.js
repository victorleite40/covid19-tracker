import React, { useState, useEffect } from 'react';
import apiCovid from '../../services/api';
import { Link } from 'react-router-dom';

import arrowUp from '../../assets/arrow-up.svg'
import arrowDown from '../../assets/arrow-down.svg'
import './styles.css';

export default function Header(props) {
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
        <div className={"ranking" + props.page}>
            <h1>Global Ranking</h1>

            <div>
                <table>
                    <tr>
                        <th><button onClick={() => handleSort('')} >Region <img alt="" src={(sort==='') ? arrowRot : "" } /> </button></th>
                        <th><button onClick={() => handleSort('confirmed')} >Confirmed <img alt="" src={(sort==='confirmed') ? ((arrowRot) ? "" : arrowDown) : ((sort==='confirmedr') ? (arrowRot) ? arrowUp : "" : "")} /> </button></th>
                        <th><button onClick={() => handleSort('recovered')} >Recovered <img alt="" src={(sort==='recovered') ? ((arrowRot) ? "" : arrowDown) : ((sort==='recoveredr') ? (arrowRot) ? arrowUp : "" : "")} /> </button></th>
                        <th><button onClick={() => handleSort('fatal')} >Fatal <img alt="" src={(sort==='fatal') ? ((arrowRot) ? "" : arrowDown) : ((sort==='fatalr') ? (arrowRot) ? arrowUp : "" : "")} /> </button></th>
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
                                    return '';
                            }
                        })
                        .map(region => ( // Maps
                            <tr className="item" key={region.Country} >
                                <td>{region.Country}</td>
                                <td style={{ color: "#a83f2f" }} >{region.TotalConfirmed}</td>
                                <td style={{ color: "#45a82f" }} >{region.TotalRecovered}</td>
                                <td style={{ color: "#333" }} >{region.TotalDeaths}</td>
                            </tr>
                        ))
                    }
                </table>
            </div>
        </div>
    );
}