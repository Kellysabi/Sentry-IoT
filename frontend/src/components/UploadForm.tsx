import React, { useState, useRef, useCallback } from "react";

// Define upload status types
type UploadStatus = "idle" | "uploading" | "success" | "error";

// Define response type
interface UploadResponse {
    success: boolean;
    message: string;
    fileId?: string;
    [key: string]: any; // For any additional fields in the response
}

const UploadForm: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [response, setResponse] = useState<UploadResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file selection from input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            validateAndSetFile(selectedFile);
        }
    };

    // Validate file type and size
    const validateAndSetFile = (file: File) => {
        // Reset states
        setErrorMessage("");
        setResponse(null);

        // Check file type
        if (!file.name.endsWith('.csv')) {
            setErrorMessage("Please upload a CSV file.");
            return;
        }

        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setErrorMessage("File size exceeds 10MB limit.");
            return;
        }

        // Set file if validation passes
        setFile(file);
        setUploadStatus("idle");
    };

    // Handle drag events
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    // Handle drop event
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    }, []);

    // Trigger file input click
    const onButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setErrorMessage("Please select a file to upload");
            return;
        }

        try {
            setUploadStatus("uploading");
            setUploadProgress(0);

            const formData = new FormData();
            formData.append("file", file);

            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(progress);
                }
            };

            // Promise wrapper for XHR
            const uploadPromise = new Promise<UploadResponse>((resolve, reject) => {
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            resolve(response);
                        } catch (error) {
                            reject(new Error("Invalid response format"));
                        }
                    } else {
                        reject(new Error(`HTTP Error: ${xhr.status}`));
                    }
                };

                xhr.onerror = () => reject(new Error("Network error occurred"));
                xhr.ontimeout = () => reject(new Error("Request timed out"));
            });

            xhr.open("POST", "http://localhost:8000/upload");
            xhr.send(formData);

            const result = await uploadPromise;
            setResponse(result);
            setUploadStatus(result.success ? "success" : "error");

            // Reset file after successful upload if needed
            if (result.success) {
                setTimeout(() => {
                    setFile(null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                }, 3000);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setUploadStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
        }
    };

    // Reset the form
    const handleReset = () => {
        setFile(null);
        setUploadStatus("idle");
        setUploadProgress(0);
        setResponse(null);
        setErrorMessage("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Upload Your IoT Data</h2>

            <form
                onSubmit={handleSubmit}
                onReset={handleReset}
                className="space-y-4"
                onDragEnter={handleDrag}
            >
                {/* Drag & Drop Area */}
                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center ${
                        dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
                    } ${file ? "bg-gray-50" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploadStatus === "uploading"}
                    />

                    {file ? (
                        <div className="py-2">
                            <div className="flex items-center justify-center mb-2">
                                <svg className="w-8 h-8 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="font-medium text-gray-700">File selected</span>
                            </div>
                            <p className="text-sm text-gray-600">{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="mt-2 text-sm text-red-600 hover:text-red-800"
                                disabled={uploadStatus === "uploading"}
                            >
                                Remove file
                            </button>
                        </div>
                    ) : (
                        <>
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p className="mt-2 text-gray-600">Drag and drop your CSV file here, or</p>
                            <button
                                type="button"
                                onClick={onButtonClick}
                                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Browse files
                            </button>
                            <p className="mt-1 text-xs text-gray-500">CSV files only, max 10MB</p>
                        </>
                    )}
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200">
                        <p className="text-sm">{errorMessage}</p>
                    </div>
                )}

                {/* Upload Progress */}
                {uploadStatus === "uploading" && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {uploadStatus === "success" && response && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-md border border-green-200">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <p>{response.message || "File uploaded successfully!"}</p>
                        </div>
                    </div>
                )}

                {/* Form Buttons */}
                <div className="flex space-x-3">
                    <button
                        type="submit"
                        className={`px-4 py-2 rounded-md font-medium ${
                            uploadStatus === "uploading"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                        disabled={!file || uploadStatus === "uploading"}
                    >
                        {uploadStatus === "uploading" ? "Uploading..." : "Upload"}
                    </button>

                    <button
                        type="reset"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                        disabled={uploadStatus === "uploading"}
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadForm;