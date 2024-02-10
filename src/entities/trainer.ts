export interface Trainer {
    id: string;
    name: string;
    pokemonShinies: {
        name: string;
        caughtAt: Date;
    }[];
    lastShinyCaughtAt: Date | null;
    spending?: Spending[];
}

export interface Spending {
    month: number;
    year: number;
    amount: number;
}
