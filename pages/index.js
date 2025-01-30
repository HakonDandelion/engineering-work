import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "@/components/Header";


export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (router.query.success) {
      setSuccessMessage("Rejestracja zakończona sukcesem! Możesz się teraz zalogować.");
      setTimeout(() => setSuccessMessage(""));
    }
  }, [router.query.success]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Nazwa użytkownika jest wymagana!";
    }
    if (!formData.password) {
      newErrors.password = "Hasło jest wymagane!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setGeneralError(""); // Resetujemy ogólny błąd
    setErrors({}); // Resetujemy błędy
  
    if (!validateForm()) return;
  
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        router.push("/start");
      } else {
        // Sprawdzamy czy to błąd autoryzacji
        if (response.status === 401) {
          setGeneralError("Nieprawidłowa nazwa użytkownika lub hasło.");
        } else {
          setGeneralError(data.error || "Wystąpił błąd podczas logowania.");
        }
      }
    } catch (error) {
      console.error("Błąd sieci:", error);
      setGeneralError("Wystąpił problem z połączeniem. Spróbuj ponownie później.");
    }
  };
  

  return (
    <div
      className={`grid min-h-screen place-items-center p-8 pb-20 gap-16 sm:p-20`}
    >
      <Header />
      <main >
        <div className="w-full max-w-md p-5 bg-white shadow-md rounded-lg ">
          
          {successMessage && (
            <div className="mb-4 p-3 text-green-800 bg-green-200 border border-green-400 rounded">
              {successMessage}
            </div>
          )}

          <form className="flex flex-col min-w-[350px]" onSubmit={handleLogin}>
            <h2 className="mb-5 text-center text-2xl text-gray-800">Zaloguj się</h2>

            <label htmlFor="username" className="mb-2 text-gray-600">Nazwa użytkownika</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Wpisz nazwę użytkownika"
              value={formData.username}
              onChange={handleChange}
              className={`p-2 border rounded ${
                errors.username ? "border-red-500" : formData.username ? "border-green-500" : "border-gray-300"
              }`}
            />
            <p className="text-red-500 text-sm h-5">{errors.username}</p>


            <label htmlFor="password" className="mt-2 mb-2 text-gray-600">Hasło</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Wpisz hasło"
              value={formData.password}
              onChange={handleChange}
              className={`p-2 border rounded ${
                errors.password ? "border-red-500" : formData.password ? "border-green-500" : "border-gray-300"
              }`}
            />
            <p className="text-red-500 text-sm h-5">{errors.password}</p>


            <button
              type="submit"
              className="mt-4 p-2 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-800"
            >
              Zaloguj się
            </button>

            <div className="min-h-[60px] mt-4"> {/* Stała przestrzeń na generalny błąd */}
              {generalError && (
                <div className="p-3 text-red-800 bg-red-100 border border-red-400 rounded text-center">
                  {generalError}
                </div>
              )}
            </div>
          </form>
          <p className=" text-center text-gray-600">
            Nie masz konta? 
            <button
              onClick={() => router.push("/register")}
              className="ml-1 text-blue-600 hover:underline"
            >
              Zarejestruj się
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
