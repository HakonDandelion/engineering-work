import SignupForm from "@/components/Signupform";
import Nav from "@/components/Nav";
import Header from "@/components/Header";
import { getSession } from "next-auth/react";

export default function Home() {
  
  return (
    <div>
      <Header />

      <Nav />
      
    <main>
      <div className="max-w-max bg-black/20 backdrop-blur-sm p-12 mx-auto mt-4 rounded-lg text-lg ">
        <h1 className=" mb-6 text-6xl bg-clip-text text-transparent font-bold
         bg-gradient-to-r from-pink-500 to-violet-700  ">
          Strona startowa
        </h1>

        <div className="text-white">
          <p className="mb-4">
            Witaj na sronie starowej aplikacji wspomagającej wycene pojazdów mechanicznych 
          </p>

          <ul className="list-disc list-inside mb-4">
            <li>Stworzysz stronę taką jak ta z użyciem Reacta </li>
            <li>Użyjesz TailwindCSS do ostylowania wyglądu </li>
            <li>Poznasz backendowe środowisko Node.js</li>
            <li>Użyjesz Reactowego frameworka Next.js </li>
            <li>Zapiszesz dane z formularza w bazie MongoDB </li>
            <li>Użyjesz Prismy dla ułatwienia kontaktu z bazą </li>
            <li>Stworzysz repozytorium Git na GitHubie </li>
            <li>Umieścisz swoją aplikację w internecie</li>
          </ul>
        </div>
        
        <SignupForm />
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