import Image from "next/image";
import Header from "@/components/Header";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid 
      grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen 
      p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <Header/>
      <main>
  <div className="login-container">
    <form className="login-form">
      <h2>Zaloguj się</h2>
      <label htmlFor="username">Nazwa użytkownika</label>
      <input type="text" id="username" name="username" placeholder="Wpisz nazwę użytkownika" required />
      <label htmlFor="password">Hasło</label>
      <input type="password" id="password" name="password" placeholder="Wpisz hasło" required />
      <button type="submit">Zaloguj się</button>
    </form>
  </div>
</main>
      
    </div>
  );
}
