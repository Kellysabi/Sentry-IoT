import { useEffect, useState, useCallback } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Define type for alert data
interface Alert {
    id: string;
    score: number;
    timestamp: string;
    // Add other properties as needed
}

// Define a more specific chart data type to ensure labels is not undefined
interface LineChartData extends ChartData<'line'> {
    labels: string[];  // Ensure labels is not undefined
}

const ChartComponent = () => {
    const [chartData, setChartData] = useState<LineChartData>({
        labels: [],
        datasets: [
            {
                label: "Anomaly Score",
                data: [],
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                tension: 0.4,
            },
        ],
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Define chart options
    const chartOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true },
            title: {
                display: true,
                text: "Alert Scores Over Time",
                font: { size: 16 }
            },
            tooltip: {
                callbacks: {
                    label: (context) => `Score: ${context.parsed.y.toFixed(2)}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Anomaly Score'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Alerts'
                }
            }
        },
        animation: {
            duration: 750,
            easing: 'easeOutQuart'
        }
    };

    const fetchChartData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:8000/alerts");

            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.status}`);
            }

            const alerts: Alert[] = await response.json();

            // Sort alerts by timestamp if available
            const sortedAlerts = [...alerts].sort((a, b) =>
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );

            const labels = sortedAlerts.map((alert) =>
                new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            );

            const scores = sortedAlerts.map((alert) => alert.score);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: "Anomaly Score",
                        data: scores,
                        borderColor: "rgba(75,192,192,1)",
                        backgroundColor: "rgba(75,192,192,0.2)",
                        borderWidth: 2,
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        tension: 0.4,
                    },
                ],
            });
            setError(null);
        } catch (err) {
            console.error("Failed to fetch chart data:", err);
            setError("Failed to load chart data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChartData();

        const interval = setInterval(fetchChartData, 5000);

        return () => clearInterval(interval);
    }, [fetchChartData]);

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded shadow mt-4 border border-red-300">
                <h3 className="font-semibold text-red-700 mb-2">Error</h3>
                <p className="text-red-600">{error}</p>
                <button
                    onClick={fetchChartData}
                    className="mt-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-1 px-3 rounded text-sm"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded shadow mt-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Alert Score Trend</h3>
                <button
                    onClick={fetchChartData}
                    disabled={isLoading}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-1 px-3 rounded text-sm flex items-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                        </>
                    ) : (
                        'Refresh'
                    )}
                </button>
            </div>

            {isLoading && chartData.labels.length === 0 ? (
                <div className="flex justify-center items-center h-64 bg-gray-50">
                    <div className="text-gray-500">Loading chart data...</div>
                </div>
            ) : (
                <div className="h-64">
                    <Line data={chartData} options={chartOptions} />
                </div>
            )}

            <div className="mt-2 text-xs text-gray-500 text-right">
                Auto-refreshes every 5 seconds
            </div>
        </div>
    );
};

export default ChartComponent;