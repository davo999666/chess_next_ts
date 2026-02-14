"use client";

import { useRouter } from "next/navigation";

export default function GlobalError({
                                        error,
                                    }: {
    error: Error;
}) {
    const router = useRouter();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="text-center p-6 rounded-lg shadow-lg bg-white">
                <h2 className="text-2xl font-bold mb-2">Something went wrong 😢</h2>
                <p className="text-gray-700 mb-4">{error.message}</p>
                <div className="flex justify-center gap-4">
                    {/* Retry the current route */}
                    <button
                        onClick={() => router.refresh()}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Try again
                    </button>

                    {/* Go to home page */}
                    <button
                        onClick={() => router.push("/")}
                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}
