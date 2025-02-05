// pages/forms/[id].js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import Header from "@/components/Header";
import Nav from "@/components/Nav";
import { MongoClient, ObjectId } from 'mongodb';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function FormDetails({ formData: initialFormData }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/forms/${formData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsEditing(false);
        router.reload();
      }
    } catch (error) {
      console.error('Błąd podczas zapisywania:', error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Nagłówek
    doc.setFontSize(20);
    doc.text(`Wycena: ${formData.basicInfo.brand} ${formData.basicInfo.model}`, 14, 20);
    
    // Podstawowe informacje
    doc.setFontSize(14);
    doc.text('Podstawowe informacje', 14, 40);
    const basicInfoData = [
      ['Marka', formData.basicInfo.brand],
      ['Model', formData.basicInfo.model],
      ['Rok produkcji', formData.basicInfo.year],
      ['Przebieg', `${formData.basicInfo.mileage} km`],
    ];
    doc.autoTable({
      startY: 45,
      head: [['Parametr', 'Wartość']],
      body: basicInfoData,
    });

    // Stan techniczny
    doc.text('Stan techniczny', 14, doc.previousAutoTable.finalY + 15);
    const technicalData = [
      ['Stan silnika', translateCondition(formData.technicalCondition.engineCondition)],
      ['Stan skrzyni biegów', translateCondition(formData.technicalCondition.transmissionCondition)],
    ];
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 20,
      head: [['Element', 'Stan']],
      body: technicalData,
    });

    // Wyposażenie dodatkowe
    doc.text('Wyposażenie dodatkowe', 14, doc.previousAutoTable.finalY + 15);
    const featuresData = Object.entries(formData.additionalFeatures)
      .map(([feature, value]) => [translateFeature(feature), value ? 'Tak' : 'Nie']);
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 20,
      head: [['Wyposażenie', 'Dostępność']],
      body: featuresData,
    });

    // Stopka
    doc.setFontSize(10);
    doc.text(`Wygenerowano: ${new Date().toLocaleDateString('pl-PL')}`, 14, doc.previousAutoTable.finalY + 15);

    doc.save(`wycena_${formData.basicInfo.brand}_${formData.basicInfo.model}.pdf`);
  };

  const InputField = ({ label, value, onChange, type = "text" }) => (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 bg-black/20 border border-gray-600 rounded text-white"
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options }) => (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-medium mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 bg-black/20 border border-gray-600 rounded text-white"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Header />
      <Nav />
      
      <main className="max-w-6xl mx-auto p-8">
        <div className="bg-black/20 backdrop-blur-sm p-8 rounded-lg mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-700">
              {formData.basicInfo.brand} {formData.basicInfo.model}
            </h1>
            <div className="space-x-4">
              <button
                onClick={generatePDF}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Eksportuj PDF
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isEditing ? 'Anuluj' : 'Edytuj'}
              </button>
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Zapisz zmiany
                </button>
              )}
              <button
                onClick={() => router.back()}
                className="text-white hover:text-gray-300"
              >
                ← Powrót
              </button>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-black/30 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-white mb-4">Podstawowe informacje</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Marka"
                    value={formData.basicInfo.brand}
                    onChange={(value) => handleInputChange('basicInfo', 'brand', value)}
                  />
                  <InputField
                    label="Model"
                    value={formData.basicInfo.model}
                    onChange={(value) => handleInputChange('basicInfo', 'model', value)}
                  />
                  <InputField
                    label="Rok produkcji"
                    value={formData.basicInfo.year}
                    onChange={(value) => handleInputChange('basicInfo', 'year', value)}
                    type="number"
                  />
                  <InputField
                    label="Przebieg (km)"
                    value={formData.basicInfo.mileage}
                    onChange={(value) => handleInputChange('basicInfo', 'mileage', value)}
                    type="number"
                  />
                </div>
              </div>

              {/* Technical Condition */}
              <div className="bg-black/30 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-white mb-4">Stan techniczny</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    label="Stan silnika"
                    value={formData.technicalCondition.engineCondition}
                    onChange={(value) => handleInputChange('technicalCondition', 'engineCondition', value)}
                    options={[
                      { value: 'excellent', label: 'Bardzo dobry' },
                      { value: 'good', label: 'Dobry' },
                      { value: 'fair', label: 'Dostateczny' },
                      { value: 'poor', label: 'Słaby' },
                    ]}
                  />
                  <SelectField
                    label="Stan skrzyni biegów"
                    value={formData.technicalCondition.transmissionCondition}
                    onChange={(value) => handleInputChange('technicalCondition', 'transmissionCondition', value)}
                    options={[
                      { value: 'excellent', label: 'Bardzo dobry' },
                      { value: 'good', label: 'Dobry' },
                      { value: 'fair', label: 'Dostateczny' },
                      { value: 'poor', label: 'Słaby' },
                    ]}
                  />
                </div>
              </div>

              {/* Additional Features */}
              <div className="bg-black/30 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-white mb-4">Wyposażenie dodatkowe</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(formData.additionalFeatures).map(([feature, value]) => (
                    <div key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        id={feature}
                        checked={value}
                        onChange={(e) => handleInputChange('additionalFeatures', feature, e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor={feature} className="text-gray-300">
                        {translateFeature(feature)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Existing view mode...
            <>
              <div className="text-gray-300 mb-4">
                Utworzono: {formatDate(formData.createdAt)}
              </div>

              <div className="bg-black/30 p-6 rounded-lg mb-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Podstawowe informacje</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div><span className="font-medium">Marka:</span> {formData.basicInfo.brand}</div>
                  <div><span className="font-medium">Model:</span> {formData.basicInfo.model}</div>
                  <div><span className="font-medium">Rok produkcji:</span> {formData.basicInfo.year}</div>
                  <div><span className="font-medium">Przebieg:</span> {formData.basicInfo.mileage} km</div>
                </div>
              </div>

              <div className="bg-black/30 p-6 rounded-lg mb-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Stan techniczny</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <span className="font-medium">Stan silnika:</span> {translateCondition(formData.technicalCondition.engineCondition)}
                  </div>
                  <div>
                    <span className="font-medium">Stan skrzyni biegów:</span> {translateCondition(formData.technicalCondition.transmissionCondition)}
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-white mb-4">Wyposażenie dodatkowe</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-300">
                  {Object.entries(formData.additionalFeatures).map(([feature, value]) => (
                    <div key={feature} className="flex items-center">
                      <span className={`mr-2 ${value ? 'text-green-500' : 'text-red-500'}`}>
                        {value ? '✓' : '✗'}
                      </span>
                      {translateFeature(feature)}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// Helper functions
const translateFeature = (feature) => {
  const translations = {
    airConditioning: "Klimatyzacja",
    leatherSeats: "Skórzane fotele",
    navigation: "Nawigacja",
    sunroof: "Szyberdach",
    parkingSensors: "Czujniki parkowania"
  };
  return translations[feature] || feature;
};

const translateCondition = (condition) => {
  const translations = {
    excellent: "Bardzo dobry",
    good: "Dobry",
    fair: "Dostateczny",
    poor: "Słaby"
  };
  return translations[condition] || condition;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

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

  try {
    const client = new MongoClient(process.env.DATABASE_URL);
    await client.connect();
    const database = client.db("tradeApp");
    const collection = database.collection("forms");

    const form = await collection.findOne({
      _id: new ObjectId(context.params.id),
      userId: session.user.id
    });

    await client.close();

    if (!form) {
      return {
        notFound: true
      };
    }

    return {
      props: {
        session,
        formData: JSON.parse(JSON.stringify({
          ...form,
          _id: form._id.toString()
        }))
      }
    };
  } catch (error) {
    console.error("Error fetching form:", error);
    return {
      notFound: true
    };
  }
}