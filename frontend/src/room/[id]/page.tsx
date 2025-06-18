"use client";

import { PageHeader } from "@/components/header";

export default function RoomPage({ params }: { params: { id: string } }) {
    return (
        <main className="min-h-screen">
            <PageHeader />
        </main>
    )
}