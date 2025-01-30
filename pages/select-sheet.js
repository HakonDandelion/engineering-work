import Nav from "@/components/Nav";
import Header from "@/components/Header";
import { useState } from "react";

export default function SelectSheet() {
  // Stan do śledzenia wybranego formularza
  const [selectedSheet, setSelectedSheet] = useState(null);
  
  // Przykładowe dane formularzy
  const sheets = [
    { id: 1, name: "Formularz podstawowy", description: "Podstawowe dane i informacje", fields: 5 },
    { id: 2, name: "Raport finansowy", description: "Szczegółowe dane finansowe", fields: 12 },
    { id: 3, name: "Analiza projektu", description: "Ocena postępu projektu", fields: 8 },
    { id: 4, name: "Ankieta klienta", description: "Badanie satysfakcji klienta", fields: 10 }
  ];

  return (
    <div>
      <Header />
      <Nav />
      
      <main>
        <div className="max-w-6xl mx-auto mt-4 p-8">
          <div className="bg-black/20 backdrop-blur-sm p-12 rounded-lg">
            <h1 className="mb-6 text-6xl bg-clip-text text-transparent font-bold bg-gradient-to-r from-pink-500 to-violet-700">
              Select sheet
            </h1>

            <div className="text-white mb-8">
              <p className="text-xl mb-4">
                Wybierz formularz, który chcesz wypełnić
              </p>
            </div>

            {/* Grid formularzy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {sheets.map((sheet) => (
                <div
                  key={sheet.id}
                  className={`p-6 rounded-lg cursor-pointer transition-all ${
                    selectedSheet === sheet.id
                      ? "bg-violet-900/50 border-2 border-violet-500"
                      : "bg-black/30 hover:bg-black/40 border-2 border-transparent"
                  }`}
                  onClick={() => setSelectedSheet(sheet.id)}
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {sheet.name}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {sheet.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">
                      Liczba pól: {sheet.fields}
                    </span>
                    <span className="text-blue-400">
                      {selectedSheet === sheet.id ? "Wybrano ✓" : "Wybierz →"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Przycisk potwierdzenia */}
            <div className="flex justify-center">
              <button
                className={`px-8 py-3 rounded-lg text-lg font-semibold transition-all ${
                  selectedSheet
                    ? "bg-gradient-to-r from-pink-500 to-violet-700 text-white hover:opacity-90"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!selectedSheet}
              >
                Przejdź do formularza
              </button>
            </div>

            {/* Dodatkowe informacje */}
            <div className="mt-8 text-gray-400 text-sm">
              <h4 className="font-semibold mb-2">Wskazówki:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Wybierz formularz odpowiedni do Twoich potrzeb</li>
                <li>Sprawdź dokładnie opis i liczbę wymaganych pól</li>
                <li>Po wybraniu formularza kliknij przycisk, aby przejść dalej</li>
                <li>W razie wątpliwości skontaktuj się z pomocą techniczną</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}