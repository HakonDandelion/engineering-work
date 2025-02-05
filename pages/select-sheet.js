// pages/select-sheet.js
import Nav from "@/components/Nav";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from 'next/router';

export default function SelectSheet() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [templates, setTemplates] = useState([]);
  
  // Wbudowane szablony
  const builtInTemplates = [
    { 
      id: "vehicle-appraisal", 
      name: "Formularz wyceny pojazdu", 
      description: "Szczegółowa wycena pojazdów mechanicznych", 
      fields: 15,
      path: "/forms/vehicle-appraisal",
      type: "built-in"
    }
  ];

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/form-templates');
        if (response.ok) {
          const customTemplates = await response.json();
          // Połącz wbudowane szablony z niestandardowymi
          setTemplates([
            ...builtInTemplates,
            ...customTemplates.map(template => ({
              ...template,
              type: 'custom',
              path: `/forms/custom/${template._id}`
            }))
          ]);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania szablonów:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Funkcja obsługująca przejście do wybranego formularza
  const handleFormSelection = () => {
    if (!selectedSheet) return;
    
    const selectedTemplate = templates.find(template => template.id === selectedSheet);
    if (selectedTemplate) {
      router.push(selectedTemplate.path);
    }
  };

  const handleCreateTemplate = () => {
    router.push('/create-template');
  };

  return (
    <div>
      <Header />
      <Nav />
      
      <main>
        <div className="max-w-6xl mx-auto mt-4 p-8">
          <div className="bg-black/20 backdrop-blur-sm p-12 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-6xl bg-clip-text text-transparent font-bold bg-gradient-to-r from-pink-500 to-violet-700">
                Wybierz formularz
              </h1>
              <button
                onClick={handleCreateTemplate}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-700 text-white rounded-lg hover:opacity-90"
              >
                + Nowy szablon
              </button>
            </div>

            {loading ? (
              <div className="text-center text-white py-8">
                Ładowanie szablonów...
              </div>
            ) : (
              <>
                <div className="text-white mb-8">
                  <p className="text-xl mb-4">
                    Wybierz formularz, który chcesz wypełnić
                  </p>
                </div>

                {/* Grid formularzy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {templates.map((template) => (
                    <div
                      key={template.id || template._id}
                      className={`p-6 rounded-lg cursor-pointer transition-all ${
                        selectedSheet === (template.id || template._id)
                          ? "bg-violet-900/50 border-2 border-violet-500"
                          : "bg-black/30 hover:bg-black/40 border-2 border-transparent"
                      }`}
                      onClick={() => setSelectedSheet(template.id || template._id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-white">
                          {template.name}
                        </h3>
                        {template.type === 'custom' && (
                          <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded">
                            Niestandardowy
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-4">
                        {template.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">
                          Liczba pól: {template.fields?.length || template.fields || 0}
                        </span>
                        <span className="text-blue-400">
                          {selectedSheet === (template.id || template._id) ? "Wybrano ✓" : "Wybierz →"}
                        </span>
                      </div>
                      {template.isPublic && (
                        <div className="mt-2 text-sm text-gray-400">
                          ⚡ Szablon publiczny
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Przycisk potwierdzenia */}
                <div className="flex justify-center">
                  <button
                    onClick={handleFormSelection}
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
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session }
  };
}