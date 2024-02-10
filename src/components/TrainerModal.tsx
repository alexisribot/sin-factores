import { Modal } from "antd";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Trainer } from "../entities/trainer";
import { SpendingShinyData, prepareChartData } from "../use-cases/prepare-chart-data";

const TrainerDetailsModal = ({ trainer, isVisible, onClose }: { trainer: Trainer | null; isVisible: boolean; onClose: () => void }) => {
    const [spendingData, setSpendingData] = useState<SpendingShinyData[]>([]);
    useEffect(() => {
        if (trainer) {
            const data = prepareChartData(trainer);
            setSpendingData(data);
        }
    }, [trainer]);

    return (
        <Modal title="Détails du dresseur" open={isVisible} onOk={onClose} onCancel={onClose} width={700} footer={null}>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={spendingData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="spent" fill="#8884d8" name="Argent dépensé" />
                    <Bar dataKey="shinies" fill="#82ca9d" name="Shinies obtenus" />
                </BarChart>
            </ResponsiveContainer>
        </Modal>
    );
};

export default TrainerDetailsModal;
