import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import allCountries from '../../assets/allCountries'

import './styles.css';

export default function Header({ history }) {

    const [country, setCountry] = useState('');

    return (
        <div className="header">
            <h1>Covid-19 Tracker | #FicaEmCasa</h1>

            <Autocomplete
                id="size-small-outlined"
                size="small"
                options={allCountries}
                getOptionLabel={(option) => option.Country}
                style={{ width: 300, marginLeft: 50 }}
                renderInput={(params) => <TextField {...params} label="Filtrar por região" variant="outlined" />}
                onChange={(event, value) => {
                    if (value) return setCountry(value.Slug)
                }}
            />
            <Link to={`/covid19-tracker/${country}`} > <button type="submit" className="btn">Search</button> </Link>
        </div>
    );
}