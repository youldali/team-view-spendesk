import React from 'react';
import Header from 'routes/common/Header';
import TeamsList from 'routes/teams/TeamsList';
import UsersList from 'routes/users/UsersList';
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
                        <UsersList />
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
