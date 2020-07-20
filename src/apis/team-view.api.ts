import camelcaseKeys from 'camelcase-keys';
import { User } from 'features/users/user.model';
import { Team } from 'features/teams/team.model';

const teamsEndPoint = 'https://s3-eu-west-1.amazonaws.com/spx-development/contents/teams';
const usersEndPoint = 'https://s3-eu-west-1.amazonaws.com/spx-development/contents/users';

const fetchRessource = async (ressourceEndPoint: string) => {
    const response = await fetch(ressourceEndPoint);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    return camelcaseKeys(responseData);
}

export const fetchTeams: () => Promise<[Team]> = () => fetchRessource(teamsEndPoint);
export const fetchUsers: () => Promise<[User]> = () => fetchRessource(usersEndPoint);
