const dummyTournament = {
    name: "Tactix Championship",
    season: "Season 01",
    description:
        "Battle against the best MLBB squads and compete for the championship title, glory, and a ₹50,000 prize pool.",
    backgroundImage:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
    prizePool: "₹50,000",
    registeredTeams: 16,
    teamCapacity: 32,
    format: "5v5",
    startsIn: "3 Days",
    prizePool: "₹50,000",

    registeredTeams: 16,
    teamCapacity: 32,

    registrationEndsAt: "2026-08-21T20:00:00",
};

const upcomingTournaments = [
    {
        id: 1,
        name: "Tactix Rising Stars",
        subtitle: "Prove your squad belongs here.",
        category: "Weekly Championship",
        format: "5v5",
        status: "Registration Open",
        backgroundImage:
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
        prizePool: "₹15,000",
        registeredTeams: 18,
        teamCapacity: 32,
        startsIn: "2 Days",
        registrationEnds: "Tomorrow, 8:00 PM",
    },

    {
        id: 2,
        name: "Tactix Night Raid",
        subtitle: "One night. One champion.",
        category: "Night Series",
        format: "5v5",
        status: "Registration Open",
        backgroundImage:
            "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=900&q=80",
        prizePool: "₹25,000",
        registeredTeams: 21,
        teamCapacity: 32,
        startsIn: "4 Days",
        registrationEnds: "Friday, 10:00 PM",
    },

    {
        id: 3,
        name: "Tactix Arena Cup",
        subtitle: "Battle. Adapt. Dominate.",
        category: "Arena Series",
        format: "5v5",
        status: "Filling Fast",
        backgroundImage:
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80",
        prizePool: "₹40,000",
        registeredTeams: 28,
        teamCapacity: 32,
        startsIn: "6 Days",
        registrationEnds: "Saturday, 6:00 PM",
    },

    {
        id: 4,
        name: "Tactix Clash",
        subtitle: "Fast reflexes. Smarter plays.",
        category: "Open Tournament",
        format: "5v5",
        status: "Registration Open",
        backgroundImage:
            "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80",
        prizePool: "₹20,000",
        registeredTeams: 12,
        teamCapacity: 24,
        startsIn: "8 Days",
        registrationEnds: "Aug 26, 8:00 PM",
    },

    {
        id: 5,
        name: "Tactix Elite League",
        subtitle: "Where the best squads collide.",
        category: "Elite Series",
        format: "5v5",
        status: "Coming Soon",
        backgroundImage:
            "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=900&q=80",
        prizePool: "₹75,000",
        registeredTeams: 0,
        teamCapacity: 32,
        startsIn: "12 Days",
        registrationEnds: "Opens Aug 28",
    },

    {
        id: 6,
        name: "Tactix Dominion",
        subtitle: "Control the map. Own the game.",
        category: "Major Tournament",
        format: "5v5",
        status: "Registration Open",
        backgroundImage:
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80",
        prizePool: "₹1,00,000",
        registeredTeams: 24,
        teamCapacity: 64,
        startsIn: "15 Days",
        registrationEnds: "Sep 2, 9:00 PM",
    },

    {
        id: 7,
        name: "Tactix Vanguard",
        subtitle: "Rise with your squad.",
        category: "Community Cup",
        format: "5v5",
        status: "Registration Open",
        backgroundImage:
            "https://images.unsplash.com/photo-1603481546238-487240415921?auto=format&fit=crop&w=900&q=80",
        prizePool: "₹10,000",
        registeredTeams: 9,
        teamCapacity: 16,
        startsIn: "18 Days",
        registrationEnds: "Sep 5, 6:00 PM",
    },

    {
        id: 8,
        name: "Tactix Grand Showdown",
        subtitle: "The biggest battle is coming.",
        category: "Grand Championship",
        format: "5v5",
        status: "Coming Soon",
        backgroundImage:
            "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=900&q=80",
        prizePool: "₹2,00,000",
        registeredTeams: 0,
        teamCapacity: 64,
        startsIn: "24 Days",
        registrationEnds: "Opens Sep 10",
    },
];


const recentTournaments = [
    {
        id: 3,
        name: "Vyuha Championship S3",
        season: "Season 3",
        label: "Grand Finals",
        subtitle: "The final battle for the championship.",
        videoThumbnail: "/images/tournaments/s3-final.jpg",
        videoDuration: "12:45",
        score: "3 — 1",
        series: "Best of 5",
        date: "12 May 2024",
        teamCount: 128,
        winner: {
            name: "Team Phoenix",
            logo: "/images/teams/phoenix.png",
        },
        runnerUp: {
            name: "Shadow Squad",
            logo: "/images/teams/shadow.png",
        },
    },
    {
        id: 2,
        name: "Elite Showdown S2",
        season: "Season 2",
        label: "Grand Finals",
        subtitle: "A championship decided in the final game.",
        videoThumbnail: "/images/tournaments/s2-final.jpg",
        videoDuration: "08:42",
        score: "3 — 2",
        series: "Best of 5",
        date: "08 Apr 2024",
        teamCount: 64,
        winner: {
            name: "Shadow Squad",
            logo: "/images/teams/shadow.png",
        },
        runnerUp: {
            name: "Omega Esports",
            logo: "/images/teams/omega.png",
        },
    },
];

const dummyPlayers = [
    {
        id: 1,
        rank: 1,
        name: "VEXX",
        avatar: null,
        mlbbId: "482915763",
        server: "2234",
        score: 980,
    },
    {
        id: 2,
        rank: 2,
        name: "Kairo",
        avatar: null,
        mlbbId: "739184526",
        server: "2187",
        score: 925,
    },
    {
        id: 3,
        rank: 3,
        name: "ShadowX",
        avatar: null,
        mlbbId: "615827394",
        server: "2241",
        score: 890,
    },
    {
        id: 4,
        rank: 4,
        name: "RAVEN",
        avatar: null,
        mlbbId: "928374615",
        server: "2208",
        score: 845,
    },
    {
        id: 5,
        rank: 5,
        name: "Blaze",
        avatar: null,
        mlbbId: "384726195",
        server: "2194",
        score: 810,
    },
    {
        id: 6,
        rank: 6,
        name: "Nexxus",
        avatar: null,
        mlbbId: "572918463",
        server: "2217",
        score: 775,
    },
    {
        id: 7,
        rank: 7,
        name: "Venom",
        avatar: null,
        mlbbId: "817263945",
        server: "2256",
        score: 740,
    },
    {
        id: 8,
        rank: 8,
        name: "Axel",
        avatar: null,
        mlbbId: "461928375",
        server: "2179",
        score: 710,
    },
    {
        id: 9,
        rank: 9,
        name: "Drift",
        avatar: null,
        mlbbId: "629184753",
        server: "2231",
        score: 685,
    },
    {
        id: 10,
        rank: 10,
        name: "Frost",
        avatar: null,
        mlbbId: "395817264",
        server: "2201",
        score: 650,
    },
    {
        id: 11,
        rank: 11,
        name: "Rex",
        avatar: null,
        mlbbId: "741928365",
        server: "2248",
        score: 625,
    },
    {
        id: 12,
        rank: 12,
        name: "Nova",
        avatar: null,
        mlbbId: "518273946",
        server: "2198",
        score: 590,
    },
];

const dummyBracket = {
    id: "tournament-001",
    name: "Vyuha Championship Season 4",
    description: "The ultimate battle for glory, pride and rewards. Build your squad, compete against the best and fight your way to the championship.",
    registrationEndsAt: "2026-08-25T18:00:00",

    status: "registration_open",

    game: "Mobile Legends: Bang Bang",
    format: "5v5",

    teamCapacity: 128,
    registeredTeams: 84,

    prizePool: "₹5,00,000",

    bracket: {
        round1: [
            {
                id: "match-r1-001",
                team1: {
                    id: "team-001",
                    name: "Team Phoenix",
                    logo: "/images/teams/phoenix.png",
                    score: 2,
                },
                team2: {
                    id: "team-002",
                    name: "Shadow Squad",
                    logo: "/images/teams/shadow.png",
                    score: 0,
                },
                winner: "team-001",
            },
            {
                id: "match-r1-002",
                team1: {
                    id: "team-003",
                    name: "Nova Legends",
                    logo: "/images/teams/nova.png",
                    score: 1,
                },
                team2: {
                    id: "team-004",
                    name: "Omega Esports",
                    logo: "/images/teams/omega.png",
                    score: 2,
                },
                winner: "team-004",
            },
            {
                id: "match-r1-003",
                team1: {
                    id: "team-005",
                    name: "Blaze Knights",
                    logo: "/images/teams/blaze.png",
                    score: 2,
                },
                team2: {
                    id: "team-006",
                    name: "Night Fury",
                    logo: "/images/teams/fury.png",
                    score: 1,
                },
                winner: "team-005",
            },
            {
                id: "match-r1-004",
                team1: {
                    id: "team-007",
                    name: "Soul Reapers",
                    logo: "/images/teams/soul.png",
                    score: 2,
                },
                team2: {
                    id: "team-008",
                    name: "Ice Crystal",
                    logo: "/images/teams/ice.png",
                    score: 0,
                },
                winner: "team-007",
            },
        ],

        quarterFinals: [
            {
                id: "match-qf-001",
                team1: {
                    id: "team-001",
                    name: "Team Phoenix",
                    logo: "/images/teams/phoenix.png",
                    score: 2,
                },
                team2: {
                    id: "team-004",
                    name: "Omega Esports",
                    logo: "/images/teams/omega.png",
                    score: 1,
                },
                winner: "team-001",
            },
            {
                id: "match-qf-002",
                team1: {
                    id: "team-005",
                    name: "Blaze Knights",
                    logo: "/images/teams/blaze.png",
                    score: 2,
                },
                team2: {
                    id: "team-007",
                    name: "Soul Reapers",
                    logo: "/images/teams/soul.png",
                    score: 0,
                },
                winner: "team-005",
            },
        ],

        semiFinals: [
            {
                id: "match-sf-001",
                team1: {
                    id: "team-001",
                    name: "Team Phoenix",
                    logo: "/images/teams/phoenix.png",
                    score: 3,
                },
                team2: {
                    id: "team-005",
                    name: "Blaze Knights",
                    logo: "/images/teams/blaze.png",
                    score: 2,
                },
                winner: "team-001",
            },
        ],

        final: [
            {
                id: "match-final-001",
                team1: {
                    id: "team-001",
                    name: "Team Phoenix",
                    logo: "/images/teams/phoenix.png",
                    score: 3,
                },
                team2: {
                    id: "team-009",
                    name: "Raven Squad",
                    logo: "/images/teams/raven.png",
                    score: 1,
                },
                winner: "team-001",
            },
        ],
    },
};


export {dummyBracket,dummyPlayers,dummyTournament}