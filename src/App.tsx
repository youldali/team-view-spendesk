import React from 'react';
import Header from 'routes/common/Header';
import TeamsList from 'routes/teams/TeamsList';
import ApprovalScheme from 'routes/approvalScheme/ApprovalScheme';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Router>
                <Header />
                <Switch>
                    <Route exact path="/">
                        <TeamsList />
                    </Route>
                    <Route path="/team/:teamId">
                        <ApprovalScheme />
                    </Route>
                    <Route path="*">
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
