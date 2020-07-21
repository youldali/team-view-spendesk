import { UserId } from '../users/user.model';

export type TeamId = string;

export interface Team {
    id: TeamId,
    name: string,
    users: UserId[],
}
