import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Nav from "@/components/Nav";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch(`/api/forms?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setForms(data);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania formularzy:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchForms();
    }
  }, [session]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'submitted':
        return 'Przesłany';
      case 'pending':
        return 'W trakcie';
      default:
        return 'Nieznany';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div>
      <Header />
      <Nav />
      
      <main>
        <div className="max-w-6xl mx-auto mt-4 p-8">
          {/* Sekcja powitalna */}
          <div className="bg-black/20 backdrop-blur-sm p-8 rounded-lg mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-700">
              Witaj, {session?.user?.name || 'Użytkowniku'}! 👋
            </h1>
            <p className="text-white mt-2">
              Sprawdź swoje formularze i raporty
            </p>
          </div>

          {/* Sekcja formularzy */}
          <div className="bg-black/20 backdrop-blur-sm p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">
              Twoje Formularze
            </h2>

            {loading ? (
              <div className="text-center text-white py-8">
                Ładowanie formularzy...
              </div>
            ) : forms.length === 0 ? (
              <div className="text-center text-white py-8">
                Nie masz jeszcze żadnych formularzy. 
                <button 
                  onClick={() => router.push('/select-sheet')}
                  className="text-blue-400 hover:text-blue-300 ml-2"
                >
                  Stwórz pierwszy formularz
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.map((form) => (
                <div key={form._id} className="bg-black/30 p-6 rounded-lg hover:bg-black/40 transition-all">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {/* Dodajemy sprawdzenie czy basicInfo i jego pola istnieją */}
                    {form.basicInfo?.brand ? `${form.basicInfo.brand} ${form.basicInfo.model || ''}` : 'Formularz niestandardowy'}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Utworzono: {formatDate(form.createdAt)}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={getStatusColor(form.status)}>
                      {getStatusText(form.status)}
                    </span>
                    <button 
                      onClick={() => router.push(`/forms/${form._id}`)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Szczegóły →
                    </button>
                  </div>
                </div>
                ))}

                {/* Przycisk dodawania nowego formularza */}
                <div 
                  onClick={() => router.push('/select-sheet')}
                  className="bg-black/30 p-6 rounded-lg hover:bg-black/40 transition-all cursor-pointer border-2 border-dashed border-gray-600 flex items-center justify-center"
                >
                  <button className="text-gray-400 hover:text-white flex items-center gap-2">
                    <span className="text-2xl">+</span>
                    <span>Nowy formularz</span>
                  </button>
                </div>
              </div>
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