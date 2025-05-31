import { useEffect, useState, useCallback } from "react";
import Chart from "./Chart";

// Define proper types for alerts
interface Alert {
    id: string;
    source_ip: string;
    score: number;
    timestamp: string;
    alert_type?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    details?: string;
}

const Dashboard = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState<'overview' | 'alerts'>('overview');

    // Get severity class based on score
    const getSeverityClass = (score: number): string => {
        if (score >= 90) return "bg-red-100 text-red-800 border-red-300";
        if (score >= 70) return "bg-orange-100 text-orange-800 border-orange-300";
        if (score >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-300";
        return "bg-green-100 text-green-800 border-green-300";
    };

    // Get severity label based on score
    const getSeverityLabel = (score: number): string => {
        if (score >= 90) return "Critical";
        if (score >= 70) return "High";
        if (score >= 40) return "Medium";
        return "Low";
    };

    // Format timestamp
    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const fetchAlerts = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:8000/alerts");

            if (!response.ok) {
                throw new Error(`Error fetching alerts: ${response.status}`);
            }

            const data: Alert[] = await response.json();

            // Sort alerts by timestamp (most recent first)
            const sortedAlerts = [...data].sort((a, b) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            setAlerts(sortedAlerts);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch alerts:", err);
            setError("Failed to load alert data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 5000);
        return () => clearInterval(interval);
    }, [fetchAlerts]);

    // Calculate summary metrics
    const totalAlerts = alerts.length;
    const criticalAlerts = alerts.filter(alert => alert.score >= 90).length;
    const averageScore = alerts.length > 0
        ? Math.round(alerts.reduce((sum, alert) => sum + alert.score, 0) / alerts.length)
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            {/* Dashboard Header */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Threat Intelligence Dashboard</h1>
                        <p className="text-gray-500 mt-1">Real-time monitoring and threat detection</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <button
                            onClick={fetchAlerts}
                            disabled={isLoading}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Refreshing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    Refresh Dashboard
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    <div className="flex">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white shadow rounded-lg p-6 flex items-center">
                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Alerts</p>
                        <p className="text-2xl font-bold text-gray-900">{totalAlerts}</p>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6 flex items-center">
                    <div className="rounded-full bg-red-100 p-3 mr-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Critical Alerts</p>
                        <p className="text-2xl font-bold text-gray-900">{criticalAlerts}</p>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6 flex items-center">
                    <div className="rounded-full bg-yellow-100 p-3 mr-4">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Average Score</p>
                        <p className="text-2xl font-bold text-gray-900">{averageScore}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setSelectedTab('overview')}
                            className={`py-4 px-6 border-b-2 font-medium text-sm ${
                                selectedTab === 'overview'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setSelectedTab('alerts')}
                            className={`py-4 px-6 border-b-2 font-medium text-sm ${
                                selectedTab === 'alerts'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Recent Alerts
                        </button>
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            {selectedTab === 'overview' ? (
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Threat Trend Analysis</h2>
                    <div className="h-96">
                        <Chart />
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Recent Security Alerts</h2>
                    </div>

                    {isLoading && alerts.length === 0 ? (
                        <div className="flex justify-center items-center p-12">
                            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : alerts.length === 0 ? (
                        <div className="text-center p-12 text-gray-500">
                            No alerts found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source IP</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {alerts.map((alert, idx) => (
                                    <tr key={alert.id || idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityClass(alert.score)}`}>
                          {getSeverityLabel(alert.score)}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{alert.source_ip}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{alert.score}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{alert.alert_type || "Unknown"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTimestamp(alert.timestamp)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900">Details</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Showing {Math.min(alerts.length, 10)} of {alerts.length} alerts • Updated every 5 seconds
                        </p>
                    </div>
                </div>
            )}

            {/* Auto-refresh indicator */}
            <div className="text-xs text-gray-500 mt-4 text-right">
                Auto-refreshes every 5 seconds • Last updated: {new Date().toLocaleTimeString()}
            </div>
        </div>
    );
};

export default Dashboard;