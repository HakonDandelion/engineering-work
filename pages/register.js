import { useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");


  const validateUsername = () => {
    const trimmedUsername = formData.username.trim();
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;

    if (trimmedUsername.length < 4) {
      setErrors((prev) => ({ ...prev, username: "Nazwa użytkownika musi mieć co najmniej 4 znaki!" }));
    } else if (trimmedUsername.length > 22) {
      setErrors((prev) => ({ ...prev, username: "Nazwa użytkownika może mieć maksymalnie 22 znaki!" }));
    } else if (!usernameRegex.test(trimmedUsername)) {
      setErrors((prev) => ({ ...prev, username: "Dozwolone są tylko litery, cyfry, podkreślenie (_) i myślnik (-)!" }));
    } else {
      setErrors((prev) => ({ ...prev, username: "" }));
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Podaj poprawny adres e-mail!" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrors((prev) => ({
        ...prev,
        password: "Hasło musi mieć min. 6 znaków, zawierać literę i cyfrę!",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const validateConfirmPassword = () => {
    if (formData.confirmPassword !== formData.password) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Hasła nie są identyczne!" }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");
  
    // Walidacja wszystkich pól przed wysłaniem danych
    validateUsername();
    validateEmail();
    validatePassword();
    validateConfirmPassword();
  
    // Jeśli są błędy, nie wysyłaj formularza
    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }
  
    try {
      const response = await fetch("/api/reg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email,
          password: formData.password,
        }),
      });
  
      if (response.ok) {
        router.push("/?success=1"); 
      } else {
        const error = await response.json();
        setServerError(error.error || "Wystąpił błąd podczas rejestracji.");
      }
    } catch (error) {
      setServerError("Błąd sieci. Spróbuj ponownie później.");
    }
  };
  

  return (
    <div
    className={`grid min-h-screen place-items-center p-8 pb-20 gap-16 sm:p-20`}
    >
      <Header />
      <main>
        <div className="w-full max-w-md p-5 bg-white shadow-md rounded-lg ">
          <form className="flex flex-col min-w-[350px]" onSubmit={handleSubmit}>
            <h2 className="mb-5 text-center text-2xl text-gray-800">Zarejestruj się</h2>

            


            <label htmlFor="username" className="mb-2 text-gray-600">Nazwa użytkownika</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Wpisz nazwę użytkownika"
              value={formData.username}
            onChange={handleChange}
            onBlur={validateUsername}
            className={`p-2 border rounded ${
              errors.username ? "border-red-500" : formData.username ? "border-green-500" : "border-gray-300"
            }`}
            />
             <p className="text-red-500 text-sm h-5">{errors.username}</p>


            <label htmlFor="email" className="mt-2 mb-2 text-gray-600">Adres e-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Wpisz adres e-mail"
              value={formData.email}
              onChange={handleChange}
              onBlur={validateEmail}
              className={`p-2 border rounded ${
                errors.email ? "border-red-500" : formData.email ? "border-green-500" : "border-gray-300"
              }`}
            />
            <p className="text-red-500 text-sm h-5">{errors.email}</p>
            

            <label htmlFor="password" className="mt-2 mb-2 text-gray-600">Hasło</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Wpisz hasło"
              value={formData.password}
              onChange={handleChange}
            onBlur={validatePassword}
            className={`p-2 border rounded ${
              errors.password ? "border-red-500" : formData.password ? "border-green-500" : "border-gray-300"
            }`}
          />
          <p className="text-red-500 text-sm h-5">{errors.password}</p>
            

            <label htmlFor="confirmPassword" className="mt-2 mb-2 text-gray-600">Potwierdź hasło</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Potwierdź hasło"
              value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={validateConfirmPassword}
            className={`p-2 border rounded ${
              errors.confirmPassword ? "border-red-500" : formData.confirmPassword ? "border-green-500" : "border-gray-300"
            }`}
          />
          <p className="text-red-500 text-sm h-5">{errors.confirmPassword}</p>
            
            <button
              type="submit"
              className="mt-4 p-2 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-800"
            >
              Zarejestruj się
            </button>
          </form>
          <p className="mt-5 text-center text-gray-600">
            Jesteś zarejestrowany? 
            <button
              onClick={() => router.push("/")}
              className="ml-1 text-blue-600 hover:underline"
            >
              Zaloguj się
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
