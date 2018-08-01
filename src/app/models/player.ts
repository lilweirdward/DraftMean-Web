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
    BoardId: string;

    constructor(rank = null, playerName = "", team = "", position = "", byeWeek = null, bestRank = null, 
        worstRank = null, avgRank = null, stdDev = null, adp = null, isDrafted = false, pickTaken = null, boardId = "") {
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
            this.BoardId = boardId;
    }
}