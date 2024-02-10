// views/TrainerRanking.tsx
import { Select, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import TrainerDetailsModal from "../components/TrainerModal";
import { Trainer } from "../entities/trainer";
import { fetchMonthYearOptions, fetchTrainers } from "../use-cases/fetch-trainers";

const TrainerRanking: React.FC = () => {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string | undefined>(undefined);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
    const [monthYearOptions, setMonthYearOptions] = useState<{ label: string; value: string }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadTrainers = async () => {
            setLoading(true);
            try {
                const response = await fetchTrainers({ month: selectedMonth });
                setTrainers(response.trainers);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadTrainers();
    }, [selectedMonth]);

    useEffect(() => {
        const loadMonthYearOptions = async () => {
            setLoading(true);
            try {
                const options = await fetchMonthYearOptions();
                setMonthYearOptions(options);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadMonthYearOptions();
    }, []);

    const handleMonthChange = (value: string) => {
        setSelectedMonth(value);
    };

    const showTrainerDetails = (trainer: Trainer) => {
        setSelectedTrainer(trainer);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: "Rang",
            dataIndex: "rank",
            key: "rank",
            render: (_: string, __: Trainer, index: number) => index + 1,
        },
        {
            title: "Nom",
            dataIndex: "name",
            key: "name",
            render: (text: string, trainer: Trainer) => <a onClick={() => showTrainerDetails(trainer)}>{text}</a>,
        },
        {
            title: "Shinies attrapés",
            dataIndex: "pokemonShinies",
            key: "pokemonShiniesCount",
            render: (pokemonShinies: { name: string }[]) => pokemonShinies.length,
        },
        {
            title: "Liste des shinies",
            dataIndex: "pokemonShinies",
            key: "pokemonShiniesNames",
            render: (
                pokemonShinies: {
                    name: string;
                }[]
            ) => pokemonShinies.map((shiny) => shiny.name).join(", "),
        },
        {
            title: "Dernier shiny capturé",
            dataIndex: "lastShinyCaughtAt",
            key: "lastShinyCaughtAt",
            render: (date?: Date) => date?.toLocaleDateString(),
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Classement des shinies {selectedMonth ? `(${selectedMonth})` : ""}</h1>
            {loading ? (
                <div className="flex justify-center items-center">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <Select
                        placeholder="Sélectionner une date"
                        onChange={handleMonthChange}
                        style={{ width: 200, marginBottom: 16 }}
                        allowClear
                        value={selectedMonth}
                    >
                        <Select.Option key="all" value="">
                            Général
                        </Select.Option>
                        {monthYearOptions.map((option) => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                    <Table columns={columns} dataSource={trainers} rowKey="id" pagination={false} />
                </>
            )}
            <TrainerDetailsModal trainer={selectedTrainer} isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
        </div>
    );
};

export default TrainerRanking;
