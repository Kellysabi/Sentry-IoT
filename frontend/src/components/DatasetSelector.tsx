import { useState, useEffect } from "react";

// Define available dataset types
interface Dataset {
    id: string;
    name: string;
    description: string;
    recordCount: number;
    lastUpdated?: string;
}

const DatasetSelector = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [availableDatasets, setAvailableDatasets] = useState<Dataset[]>([]);
    const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch available datasets on component mount
    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("http://localhost:8000/external-dataset");
                if (!response.ok) {
                    throw new Error("Failed to fetch available datasets");
                }
                const data = await response.json();
                setAvailableDatasets(data);
            } catch (err) {
                console.error("Error fetching datasets:", err);
                // Set some example datasets if API fails
                setAvailableDatasets([
                    {
                        id: "network-traffic",
                        name: "Network Traffic Sample",
                        description: "IoT network traffic patterns with labeled anomalies",
                        recordCount: 5000,
                        lastUpdated: "2025-03-15"
                    },
                    {
                        id: "smart-home",
                        name: "Smart Home Sensors",
                        description: "Data from connected home devices with security events",
                        recordCount: 3200,
                        lastUpdated: "2025-04-01"
                    },
                    {
                        id: "industrial-iot",
                        name: "Industrial IoT Metrics",
                        description: "Factory sensor data with security incidents",
                        recordCount: 8500,
                        lastUpdated: "2025-03-25"
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDatasets();
    }, []);

    const handleExternalDataset = async (datasetId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            setSelectedDataset(datasetId);

            const response = await fetch(`http://localhost:8000/external-dataset/${datasetId}`);

            if (!response.ok) {
                throw new Error(`Failed to load dataset: ${response.statusText}`);
            }

            const data = await response.json();

            // Instead of alert, you would typically dispatch this to your state management
            console.log("Dataset loaded:", data);

            // Show success notification or trigger next step in your app
            // This is where you would dispatch the data to your store
        } catch (err) {
            console.error("Error loading dataset:", err);
            setError(err instanceof Error ? err.message : "Failed to load dataset");
        } finally {
            setIsLoading(false);
        }
    };

    // Format the record count with commas
    const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    Select Dataset
                </h2>
                <p className="text-blue-100 mt-1">Choose a pre-built dataset or upload your own</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 my-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Available Datasets */}
            <div className="px-6 py-4">
                <h3 className="text-gray-700 font-medium mb-3">Available Datasets</h3>

                {isLoading && availableDatasets.length === 0 ? (
                    <div className="flex justify-center p-8">
                        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableDatasets.map((dataset) => (
                            <div
                                key={dataset.id}
                                className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 ${
                                    selectedDataset === dataset.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
                                }`}
                            >
                                <div className="px-4 py-3 border-b bg-gray-50">
                                    <h4 className="font-medium text-gray-800">{dataset.name}</h4>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-gray-600 mb-4">{dataset.description}</p>
                                    <div className="flex justify-between text-xs text-gray-500 mb-4">
                                        <span>{formatNumber(dataset.recordCount)} records</span>
                                        {dataset.lastUpdated && (
                                            <span>Updated: {new Date(dataset.lastUpdated).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleExternalDataset(dataset.id)}
                                        disabled={isLoading}
                                        className={`w-full text-sm px-4 py-2 rounded font-medium transition-colors ${
                                            selectedDataset === dataset.id
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                    >
                                        {isLoading && selectedDataset === dataset.id ? (
                                            <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </span>
                                        ) : selectedDataset === dataset.id ? (
                                            "Selected"
                                        ) : (
                                            "Select Dataset"
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Your Own */}
            <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-3 sm:mb-0">
                        <h3 className="text-gray-700 font-medium">Upload Your Own Dataset</h3>
                        <p className="text-sm text-gray-500">CSV, JSON, or XLSX formats supported</p>
                    </div>
                    <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer">
                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        Browse Files
                        <input
                            type="file"
                            accept=".csv,.json,.xlsx"
                            className="sr-only"
                            onChange={(e) => {
                                // Handle file upload logic here
                                const file = e.target.files?.[0];
                                if (file) {
                                    console.log("Selected file:", file.name);
                                    // Here you would integrate with your file upload API
                                }
                            }}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default DatasetSelector;