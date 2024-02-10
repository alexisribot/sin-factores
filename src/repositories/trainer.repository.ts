import { DocumentData, Query, collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { Trainer } from "../entities/trainer";

export const trainersRepository = {
    getTrainersData: async (month?: string): Promise<Trainer[]> => {
        const db = getFirestore();
        const trainersCollectionRef = collection(db, "trainers");
        const trainersSnapshot = await getDocs(trainersCollectionRef);
        const trainers: Trainer[] = [];

        for (const trainerDoc of trainersSnapshot.docs) {
            const trainerData = trainerDoc.data();
            const trainer: Trainer = {
                id: trainerDoc.id,
                name: trainerData.name,
                pokemonShiniesCount: 0,
                pokemonShiniesNames: [],
                lastShinyCaughtAt: null,
            };

            const pokemonShiniesRef = collection(db, `trainers/${trainerDoc.id}/pokemonShinies`);
            let pokemonShiniesQuery: Query<DocumentData> = pokemonShiniesRef;

            if (month) {
                const [year, monthIndex] = month.split("-");
                const startDate = new Date(Number(year), Number(monthIndex) - 1, 1);
                const endDate = new Date(Number(year), Number(monthIndex), 0, 23, 59, 59);
                pokemonShiniesQuery = query(pokemonShiniesRef, where("caughtAt", ">=", startDate), where("caughtAt", "<=", endDate));
            }

            const pokemonShiniesSnapshot = await getDocs(pokemonShiniesQuery);

            for (const shinyDoc of pokemonShiniesSnapshot.docs) {
                const shinyData = shinyDoc.data();
                trainer.pokemonShiniesCount += 1;
                trainer.pokemonShiniesNames.push(shinyData.name);

                const caughtAt = shinyData.caughtAt.toDate();
                if (!trainer.lastShinyCaughtAt || caughtAt > trainer.lastShinyCaughtAt) {
                    trainer.lastShinyCaughtAt = caughtAt;
                }
            }

            trainers.push(trainer);
        }

        return trainers;
    },
    getUniqueMonthYears: async (): Promise<string[]> => {
        const db = getFirestore();
        const trainersCollectionRef = collection(db, "trainers");
        const trainersSnapshot = await getDocs(trainersCollectionRef);

        const monthYearsSet = new Set<string>();

        for (const trainerDoc of trainersSnapshot.docs) {
            const pokemonShiniesRef = collection(db, `trainers/${trainerDoc.id}/pokemonShinies`);
            const pokemonShiniesSnapshot = await getDocs(pokemonShiniesRef);

            for (const shinyDoc of pokemonShiniesSnapshot.docs) {
                const shinyData = shinyDoc.data();
                const caughtAt = shinyData.caughtAt.toDate(); // Convertir Timestamp en Date
                const monthYear = `${caughtAt.getFullYear()}-${(caughtAt.getMonth() + 1).toString().padStart(2, "0")}`;
                monthYearsSet.add(monthYear);
            }
        }

        return Array.from(monthYearsSet).sort();
    },
};
