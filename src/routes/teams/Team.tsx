import React, { useEffect } from 'react';
import Table, { Column } from 'routes/common/Table'

import { useSelector, useDispatch } from 'react-redux';
import { selectAllTeams, fetchTeamsThunk } from 'features/teams/teams.slice'

const columns: Column[] = [
    { id: 'name', label: 'Team name', minWidth: 170 },
    { id: 'users', label: 'Team members', minWidth: 100 },
];

export default () => {
    const dispatch = useDispatch()
    const teams = useSelector(selectAllTeams);
    
    useEffect(() => {
        dispatch(fetchTeamsThunk());
    })

    return (
        <Table
            columns = {columns}
            rows = {teams}
        />
    )
}
