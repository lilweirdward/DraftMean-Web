import { Player } from './player';

export class DraftPick {
    roundNumber: number;
    playerDrafted: Player;

    constructor(roundNumber, player) {
        this.roundNumber = roundNumber;
        this.playerDrafted = player;
    }
}