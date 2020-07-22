import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const appTitle = "Spendesk Team view"

export default () => (
    <header>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">
                    {appTitle}
                </Typography>
            </Toolbar>
        </AppBar>
    </header>
);