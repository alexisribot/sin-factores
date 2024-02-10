export interface Trainer {
    id: string;
    name: string;
    pokemonShiniesCount: number;
    pokemonShiniesNames: string[];
    lastShinyCaughtAt: Date | null;
}
