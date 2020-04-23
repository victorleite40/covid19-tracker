import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './pages/Main';
import Local from './pages/Local';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/covid19-tracker/" exact component={Main} />
                <Route path="/covid19-tracker/:country" exact component={Local}  children={<Local />} />
            </Switch>
        </BrowserRouter>
    );
}