import { Team } from "./team";

export class Board {
    id: string;
    name: string;
    dateCreated: Date;
    totalRounds: number;
    teams: Team[];
}