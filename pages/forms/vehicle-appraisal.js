import { getSession } from "next-auth/react";
import Nav from "@/components/Nav";
import Header from "@/components/Header";
import VehicleAppraisalForm from "@/components/VehicleAppraisalForm";

export default function VehicleAppraisalPage() {
  return (
    <div>
      <Header />
      <Nav />
      
      <main>
        <div className="max-w-6xl mx-auto mt-4 p-8">
          <div className="bg-black/20 backdrop-blur-sm p-12 rounded-lg">
            <h1 className="mb-6 text-4xl bg-clip-text text-transparent font-bold bg-gradient-to-r from-pink-500 to-violet-700">
              Formularz wyceny pojazdu
            </h1>
            
            <VehicleAppraisalForm />
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