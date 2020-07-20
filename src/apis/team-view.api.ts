import camelcaseKeys from 'camelcase-keys';
import { User } from 'features/users/user.model';
import { Team } from 'features/teams/team.model';

const teamsEndPoint = 'https://jsonplaceholder.typicode.com/posts';
const usersEndPoint = 'https://jsonplaceholder.typicode.com/posts';

const fetchRessource = async (ressourceEndPoint: string) => {
    const response = await fetch(ressourceEndPoint);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return camelcaseKeys(response.json());
}

export const fetchTeams: () => Promise<[Team]> = () => fetchRessource(teamsEndPoint);
export const fetchUsers: () => Promise<[User]> = () => fetchRessource(usersEndPoint);
