import { Trainer } from "../entities/trainer";

export interface SpendingShinyData {
    month: string;
    spent: number;
    shinies: number;
}

export const prepareChartData = (trainer: Trainer): SpendingShinyData[] => {
    const data: SpendingShinyData[] = [];

    const months = new Map<string, SpendingShinyData>();

    trainer.spending?.forEach((spending) => {
        const monthYear = `${spending.month.toString().padStart(2, "0")}/${spending.year}`;
        if (!months.has(monthYear)) {
            months.set(monthYear, {
                month: monthYear,
                spent: 0,
                shinies: 0,
            });
        }

        const monthData = months.get(monthYear);
        if (monthData) {
            monthData.spent += spending.amount;
        }
    });

    trainer.pokemonShinies.forEach((shiny) => {
        const monthYear = `${(shiny.caughtAt.getMonth() + 1).toString().padStart(2, "0")}/${shiny.caughtAt.getFullYear()}`;
        if (!months.has(monthYear)) {
            months.set(monthYear, {
                month: monthYear,
                spent: 0,
                shinies: 0,
            });
        }

        const monthData = months.get(monthYear);
        if (monthData) {
            monthData.shinies++;
        }
    });

    months.forEach((monthData) => {
        data.push(monthData);
    });

    return data;
};
