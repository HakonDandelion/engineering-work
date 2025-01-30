import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Nav from "@/components/Nav";

export default function Dashboard() {
  const [username, setUsername] = useState("");

  // W przyszłości można dodać pobieranie danych użytkownika z API/sesji
  useEffect(() => {
    // Tymczasowo hardcodowane dla przykładu
    setUsername("Jan Kowalski");
  }, []);

  return (
    <div>
      <Header />
      <Nav />
      
      <main>
        <div className="max-w-6xl mx-auto mt-4 p-8">
          {/* Sekcja powitalna */}
          <div className="bg-black/20 backdrop-blur-sm p-8 rounded-lg mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-700">
              Witaj, {username}! 👋
            </h1>
            <p className="text-white mt-2">
              Sprawdź swoje ostatnie raporty i statystyki
            </p>
          </div>

          {/* Sekcja raportów */}
          <div className="bg-black/20 backdrop-blur-sm p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">
              Twoje Raporty
            </h2>

            {/* Grid z raportami */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Przykładowe karty raportów */}
              <div className="bg-black/30 p-6 rounded-lg hover:bg-black/40 transition-all cursor-pointer">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Raport #1
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Utworzono: 30.01.2025
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-green-400">Aktywny</span>
                  <button className="text-blue-400 hover:text-blue-300">
                    Szczegóły →
                  </button>
                </div>
              </div>

              <div className="bg-black/30 p-6 rounded-lg hover:bg-black/40 transition-all cursor-pointer">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Raport #2
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Utworzono: 29.01.2025
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400">W przygotowaniu</span>
                  <button className="text-blue-400 hover:text-blue-300">
                    Szczegóły →
                  </button>
                </div>
              </div>

              {/* Przycisk dodawania nowego raportu */}
              <div className="bg-black/30 p-6 rounded-lg hover:bg-black/40 transition-all cursor-pointer border-2 border-dashed border-gray-600 flex items-center justify-center">
                <button className="text-gray-400 hover:text-white flex items-center gap-2">
                  <span className="text-2xl">+</span>
                  <span>Nowy raport</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}