import { Team } from './team';
import { DraftPick } from './draftpick';
import { Player } from './player';

export const TEAMS: Team[] = [
    {
        id: 1,
        name: "Seth Payne",
        picks: [
            new DraftPick(
                1,
                new Player(
                    4,
                    "Julio Jones",
                    "ATL",
                    "WR2",
                    5,
                    3,
                    8,
                    5.1,
                    1.1,
                    4
                )
            )
        ]
    },
    {
        id: 2,
        name: "Chris Collier",
        picks: [
            new DraftPick(
                1,
                new Player(
                    1,
                    "David Johnson",
                    "ARI",
                    "RB1",
                    8,
                    1,
                    3,
                    1.2,
                    0.5,
                    1
                )
            )
        ]
    },
    {
        id: 3,
        name: "Andy Woodward",
        picks: [
            new DraftPick(
                1,
                new Player(
                    2,
                    "Le'Veon Bell",
                    "PIT",
                    "RB2",
                    9,
                    1,
                    2,
                    1.8,
                    0.4,
                    2
                )
            )
        ]
    },
    {
        id: 4,
        name: "Curt Collier",
        picks: [
            new DraftPick(
                1,
                new Player(
                    3,
                    "Antonio Brown",
                    "PIT",
                    "WR1",
                    9,
                    1,
                    6,
                    3.1,
                    0.6,
                    3
                )
            )
        ]
    },
    {
        id: 5,
        name: "Steve Sweeden",
        picks: [
            new DraftPick(
                1,
                new Player(
                    5,
                    "Odell Beckham Jr.",
                    "NYG",
                    "WR3",
                    8,
                    4,
                    16,
                    5.8,
                    2.1,
                    5
                )
            )
        ]
    },
    {
        id: 6,
        name: "Zach Woodward",
        picks: [
            new DraftPick(
                1,
                new Player(
                    7,
                    "Mike Evans",
                    "TB",
                    "WR4",
                    11,
                    4,
                    14,
                    8.4,
                    2.6,
                    7
                )
            )
        ]
    },
    {
        id: 7,
        name: "Danielle Woodward",
        picks: [
            new DraftPick(
                1,
                new Player(
                    6,
                    "LeSean McCoy",
                    "BUF",
                    "RB3",
                    6,
                    3,
                    17,
                    7.3,
                    3.5,
                    6
                )
            )
        ]
    },
    {
        id: 8,
        name: "Nate Payne",
        picks: []
    },
    {
        id: 9,
        name: "Heather Payne",
        picks: []
    },
    {
        id: 10,
        name: "Robin Collier",
        picks: []
    },
    {
        id: 11,
        name: "Michael Woodward",
        picks: []
    },
    {
        id: 12,
        name: "Brian Payne",
        picks: []
    }
];