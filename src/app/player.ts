export class Player {
    Rank: number;
    PlayerName: string;
    Team: string;
    Position: string;
    ByeWeek: number;
    BestRank: number;
    WorstRank: number;
    AvgRank: number;
    StdDev: number;
    ADP: number;
    IsDrafted: boolean;
    PickTaken: number;

    constructor(rank = 0, playerName = "", team = "", position = "", byeWeek = 0, bestRank = 0, 
        worstRank = 0, avgRank = 0, stdDev = 0, adp = 0, isDrafted = false, pickTaken = 0) {
            this.Rank = rank;
            this.PlayerName = playerName;
            this.Team = team;
            this.Position = position;
            this.ByeWeek = byeWeek;
            this.BestRank = bestRank;
            this.WorstRank = worstRank;
            this.AvgRank = avgRank;
            this.StdDev = stdDev;
            this.ADP = adp;
            this.IsDrafted = isDrafted;
            this.PickTaken = pickTaken;
    }
}