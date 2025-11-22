/**
 * React Component Example: Video Upload with Progress Tracking
 * 
 * This example shows how to integrate the GuGoTik SDK chunked upload
 * feature with a React component to display upload progress.
 */

import React, { useState } from 'react';
import useCreatePostWithProgress from '@/app/hooks/useCreatePostWithProgress';
import type { UploadProgress } from 'gugotik-sdk';

interface UploadState {
    isUploading: boolean;
    progress: number;
    uploadedMB: number;
    totalMB: number;
    chunksUploaded: number;
    chunksTotal: number;
    uploadSpeed: number;
}

export default function VideoUploadWithProgress() {
    const [file, setFile] = useState<File | null>(null);
    const [caption, setCaption] = useState('');
    const [uploadState, setUploadState] = useState<UploadState>({
        isUploading: false,
        progress: 0,
        uploadedMB: 0,
        totalMB: 0,
        chunksUploaded: 0,
        chunksTotal: 0,
        uploadSpeed: 0,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setUploadState(prev => ({
                ...prev,
                totalMB: selectedFile.size / 1024 / 1024,
            }));
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const userId = '123'; // Get from your auth context
        const startTime = Date.now();

        setUploadState(prev => ({ ...prev, isUploading: true, progress: 0 }));

        try {
            await useCreatePostWithProgress(
                file,
                userId,
                caption,
                (progress: UploadProgress) => {
                    const elapsedSeconds = (Date.now() - startTime) / 1000;
                    const uploadSpeed = progress.sizeUploaded / elapsedSeconds / 1024 / 1024;

                    setUploadState({
                        isUploading: true,
                        progress: progress.progress,
                        uploadedMB: progress.sizeUploaded / 1024 / 1024,
                        totalMB: file.size / 1024 / 1024,
                        chunksUploaded: progress.chunksUploaded,
                        chunksTotal: progress.chunksTotal,
                        uploadSpeed: uploadSpeed,
                    });
                }
            );

            // Upload successful
            setUploadState(prev => ({ ...prev, isUploading: false, progress: 100 }));
            alert('Video uploaded successfully!');
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadState(prev => ({ ...prev, isUploading: false }));
            alert('Upload failed. Please try again.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Upload Video with Progress</h1>

            {/* File Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                    Select Video File
                </label>
                <input
                    type="file"
                    accept="video/mp4"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
            </div>

            {/* Caption Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                    Caption
                </label>
                <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Enter video caption..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={!file || !caption || uploadState.isUploading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md
                    hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {uploadState.isUploading ? 'Uploading...' : 'Upload Video'}
            </button>

            {/* Progress Display */}
            {uploadState.isUploading && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-3">Upload Progress</h3>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                        <div
                            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${uploadState.progress}%` }}
                        />
                    </div>

                    {/* Progress Stats */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-gray-600">Progress:</span>
                            <span className="ml-2 font-semibold">{uploadState.progress}%</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Speed:</span>
                            <span className="ml-2 font-semibold">
                                {uploadState.uploadSpeed.toFixed(2)} MB/s
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Uploaded:</span>
                            <span className="ml-2 font-semibold">
                                {uploadState.uploadedMB.toFixed(2)} / {uploadState.totalMB.toFixed(2)} MB
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Chunks:</span>
                            <span className="ml-2 font-semibold">
                                {uploadState.chunksUploaded} / {uploadState.chunksTotal}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

