import { PageHeader } from "@/components/header";
import { LobbyList } from "@/components/lobby-list";


export default function LobbyPage() {
    return (
        <main className="min-h-screen bg-gray-900">
            <PageHeader/>
            <div className="w-full">
                <h1 className="text-3xl font-bold text-center text-brand-secondary mt-4">
                    Lobbies
                </h1>
                <p className="text-center text-brand-tertiary mt-2">
                    Join or create a lobby to start playing! 
                </p>
            </div>
            <LobbyList/>
        </main>
    )
}