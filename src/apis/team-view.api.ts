const teamsEndPoint = 'https://jsonplaceholder.typicode.com/posts';
const usersEndPoint = 'https://jsonplaceholder.typicode.com/posts';

const fetchRessource = async (ressourceEndPoint: string) => {
    const response = await fetch(ressourceEndPoint);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export const fetchTeams = fetchRessource(teamsEndPoint);
export const fetchUsers = fetchRessource(usersEndPoint);
