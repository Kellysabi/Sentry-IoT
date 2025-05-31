import Navbar from "../components/Navbar";
import UploadForm from "../components/UploadForm";
import DatasetSelector from "../components/DatasetSelector";
import Dashboard from "../components/Dashboard";

export default function Home() {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <main className="p-4 md:p-8">
                <DatasetSelector />
                <UploadForm />
                <Dashboard />
            </main>
        </div>
    );
}
