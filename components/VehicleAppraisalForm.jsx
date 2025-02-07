import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';

const VehicleAppraisalForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getModelFromYear = (year) => {
    if (!year) return 'T25';
    const yearNum = parseInt(year);
    if (yearNum >= 1966 && yearNum <= 1972) return 'T25';
    if (yearNum >= 1973 && yearNum <= 1977) return 'T25A';
    if (yearNum >= 1978 && yearNum <= 1979) return 'T25A1';
    if (yearNum >= 1980 && yearNum <= 1994) return 'T25A2';
    if (yearNum >= 1995) return 'T25 LEDA';
    return 'T25';
  };

  const [formData, setFormData] = useState({
    basicInfo: {
      brand: 'Władimirec',
      model: 'T25',
      year: '',
      mileage: '',
      vin: '',
      isRegistered: false,
      isInsured: false,
      hasTechnicalInspection: false,
      transportDistance: '',
    },
    technicalCondition: {
      engineCondition: '',
      transmissionCondition: '',
      bodyCondition: '',
      interiorCondition: '',
    },
    additionalFeatures: {
      airConditioning: false,
      leatherSeats: false,
      navigation: false,
      sunroof: false,
      parkingSensors: false,
    },
    damageHistory: {
      hasAccidentHistory: false,
      repaintedElements: '',
      currentDamages: '',
    }
  });

  const validateForm = () => {
    let tempErrors = {};
    
    if (!formData.basicInfo.year) {
      tempErrors.year = "Rok produkcji jest wymagany";
    } else {
      const year = parseInt(formData.basicInfo.year);
      if (year < 1965 || year > 2000) {
        tempErrors.year = "Rok produkcji musi być między 1965 a 2000";
      }
    }
    
    if (!formData.basicInfo.mileage) {
      tempErrors.mileage = "Przebieg jest wymagany";
    } else if (formData.basicInfo.mileage < 0) {
      tempErrors.mileage = "Przebieg nie może być ujemny";
    }

    if (formData.basicInfo.transportDistance && formData.basicInfo.transportDistance < 0) {
      tempErrors.transportDistance = "Odległość nie może być ujemna";
    }

    if (!formData.technicalCondition.engineCondition) {
      tempErrors.engineCondition = "Wybierz stan silnika";
    }
    if (!formData.technicalCondition.transmissionCondition) {
      tempErrors.transmissionCondition = "Wybierz stan skrzyni biegów";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };

      // Update model based on year
      if (section === 'basicInfo' && field === 'year') {
        newData.basicInfo.model = getModelFromYear(value);
      }

      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: session.user.id,
          type: "wladimerec-appraisal",
          status: "submitted"
        }),
      });

      if (response.ok) {
        router.push("/browse-reports?success=form-submitted");
      } else {
        const data = await response.json();
        throw new Error(data.error || "Błąd podczas zapisywania formularza");
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error.message
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Podstawowe informacje o pojeździe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marka
              </label>
              <input
                type="text"
                value={formData.basicInfo.brand}
                disabled
                className="w-full p-2 border rounded bg-gray-100 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                value={formData.basicInfo.model}
                disabled
                className="w-full p-2 border rounded bg-gray-100 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rok produkcji
              </label>
              <input
                type="number"
                min="1965"
                max="2000"
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                  errors.year ? 'border-red-500' : ''
                }`}
                value={formData.basicInfo.year}
                onChange={(e) => handleInputChange('basicInfo', 'year', e.target.value)}
              />
              {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Przebieg (mth)
              </label>
              <input
                type="number"
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                  errors.mileage ? 'border-red-500' : ''
                }`}
                value={formData.basicInfo.mileage}
                onChange={(e) => handleInputChange('basicInfo', 'mileage', e.target.value)}
              />
              {errors.mileage && <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Odległość transportu (km)
              </label>
              <input
                type="number"
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                  errors.transportDistance ? 'border-red-500' : ''
                }`}
                value={formData.basicInfo.transportDistance}
                onChange={(e) => handleInputChange('basicInfo', 'transportDistance', e.target.value)}
              />
              {errors.transportDistance && <p className="text-red-500 text-sm mt-1">{errors.transportDistance}</p>}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRegistered"
                checked={formData.basicInfo.isRegistered}
                onChange={(e) => handleInputChange('basicInfo', 'isRegistered', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isRegistered" className="ml-2 text-sm text-gray-700">
                Zarejestrowany
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isInsured"
                checked={formData.basicInfo.isInsured}
                onChange={(e) => handleInputChange('basicInfo', 'isInsured', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isInsured" className="ml-2 text-sm text-gray-700">
                Ubezpieczony
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasTechnicalInspection"
                checked={formData.basicInfo.hasTechnicalInspection}
                onChange={(e) => handleInputChange('basicInfo', 'hasTechnicalInspection', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="hasTechnicalInspection" className="ml-2 text-sm text-gray-700">
                Aktualny przegląd
              </label>
            </div>
          </div>
        </div>

        {/* Technical Condition Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Stan techniczny</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stan silnika
              </label>
              <select
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                  errors.engineCondition ? 'border-red-500' : ''
                }`}
                value={formData.technicalCondition.engineCondition}
                onChange={(e) => handleInputChange('technicalCondition', 'engineCondition', e.target.value)}
              >
                <option value="">Wybierz...</option>
                <option value="excellent">Bardzo dobry</option>
                <option value="good">Dobry</option>
                <option value="fair">Dostateczny</option>
                <option value="poor">Słaby</option>
              </select>
              {errors.engineCondition && <p className="text-red-500 text-sm mt-1">{errors.engineCondition}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stan skrzyni biegów
              </label>
              <select
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                  errors.transmissionCondition ? 'border-red-500' : ''
                }`}
                value={formData.technicalCondition.transmissionCondition}
                onChange={(e) => handleInputChange('technicalCondition', 'transmissionCondition', e.target.value)}
              >
                <option value="">Wybierz...</option>
                <option value="excellent">Bardzo dobry</option>
                <option value="good">Dobry</option>
                <option value="fair">Dostateczny</option>
                <option value="poor">Słaby</option>
              </select>
              {errors.transmissionCondition && <p className="text-red-500 text-sm mt-1">{errors.transmissionCondition}</p>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col items-end">
          {errors.submit && (
            <p className="text-red-500 text-sm mb-2">{errors.submit}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Zapisywanie...' : 'Zapisz wycenę'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleAppraisalForm;