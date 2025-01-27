import SignupForm from "@/components/Signupform";
import Nav from "@/components/Nav";
import Header from "@/components/Header";

export default function Home() {
  
  return (
    <div>
      <Header />

      <Nav />
      
    <main>
      <div className="max-w-max bg-black/20 backdrop-blur-sm p-12 mx-auto mt-4 rounded-lg text-lg ">
        <h1 className=" mb-6 text-6xl bg-clip-text text-transparent font-bold
         bg-gradient-to-r from-pink-500 to-violet-700  ">
          Browse reports
        </h1>

        <div className="text-white">
          <p className="mb-4">
            Przykładowy tekst
          </p>

          <ul className="list-disc list-inside mb-4">
            <li>Stworzysz stronę taką jak ta z użyciem Reacta </li>
          </ul>
        </div>
        
        <SignupForm />
      </div>
    </main>
    </div>
  );
}
