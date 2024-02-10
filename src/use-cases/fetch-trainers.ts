import { Trainer } from "../entities/trainer";
import { trainersRepository } from "../repositories/trainer.repository";

export interface FetchTrainersRequest {
    month?: string;
}

export interface FetchTrainersResponse {
    trainers: Trainer[];
}

export const fetchTrainers = async (request: FetchTrainersRequest): Promise<FetchTrainersResponse> => {
    const trainersData = await trainersRepository.getTrainersData(request.month);

    const sortedTrainersData = trainersData.sort((a, b) => {
        if (a.pokemonShinies.length > b.pokemonShinies.length) {
            return -1;
        } else if (a.pokemonShinies.length < b.pokemonShinies.length) {
            return 1;
        } else {
            return a.name.localeCompare(b.name);
        }
    });

    return {
        trainers: sortedTrainersData,
    };
};

export const fetchMonthYearOptions = async (): Promise<{ label: string; value: string }[]> => {
    const uniqueMonthYears = await trainersRepository.getUniqueMonthYears();

    const options = uniqueMonthYears.map((monthYear) => {
        const [year, month] = monthYear.split("-");
        return { label: `${month}/${year}`, value: monthYear };
    });

    return options.sort((a, b) => a.value.localeCompare(b.value));
};
