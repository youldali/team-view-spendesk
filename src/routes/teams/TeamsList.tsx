import React, { useEffect } from 'react';
import Table, { Column } from 'routes/common/Table'
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { fetchTeamsThunk, selectAllTeams, selectTeamsLoadingStatus } from 'features/teams/teams.slice'
import { Team } from 'features/teams/team.model'
import { LoadingState } from 'features/asyncSlice.util'

const columns: Column[] = [
    { id: 'teamName', label: 'Team name', minWidth: 170 },
    { id: 'teamMembersCount', label: 'Number of people', minWidth: 100 },
];

interface RowData {
    id: string,
    teamName: React.ReactElement,
    teamMembersCount: number,
}

const prepareData = (team: Team): RowData => (
    {
        id: team.id,
        teamName: <Link to={`/team/${team.id}`}>{team.name}</Link>,
        teamMembersCount: team.users.length,
    }
);

export default () => {
    const dispatch = useDispatch()
    const teams = useSelector(selectAllTeams);
    const teamsLoadingStatus = useSelector(selectTeamsLoadingStatus);
    
    useEffect(() => {
        if(teamsLoadingStatus === LoadingState.Idle){
            dispatch(fetchTeamsThunk());
        }
    }, [teamsLoadingStatus, dispatch])

    const rows = teams.map(prepareData);

    return (
        <Table
            columns = {columns}
            rows = {rows}
        />
    )
}
