import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';

const VehicleAppraisalForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    basicInfo: {
      brand: '',
      model: '',
      year: '',
      mileage: '',
      vin: '',
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
    
    // Validate basicInfo
    if (!formData.basicInfo.brand.trim()) {
      tempErrors.brand = "Marka jest wymagana";
    }
    if (!formData.basicInfo.model.trim()) {
      tempErrors.model = "Model jest wymagany";
    }
    if (!formData.basicInfo.year) {
      tempErrors.year = "Rok produkcji jest wymagany";
    } else if (formData.basicInfo.year < 1900 || formData.basicInfo.year > new Date().getFullYear()) {
      tempErrors.year = "Nieprawidłowy rok produkcji";
    }
    if (!formData.basicInfo.mileage) {
      tempErrors.mileage = "Przebieg jest wymagany";
    } else if (formData.basicInfo.mileage < 0) {
      tempErrors.mileage = "Przebieg nie może być ujemny";
    }

    // Validate technicalCondition
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
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error when field is modified
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
          type: "vehicle-appraisal",
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
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Podstawowe informacje o pojeździe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marka
              </label>
              <input
                type="text"
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                  errors.brand ? 'border-red-500' : ''
                }`}
                value={formData.basicInfo.brand}
                onChange={(e) => handleInputChange('basicInfo', 'brand', e.target.value)}
              />
              {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                  errors.model ? 'border-red-500' : ''
                }`}
                value={formData.basicInfo.model}
                onChange={(e) => handleInputChange('basicInfo', 'model', e.target.value)}
              />
              {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rok produkcji
              </label>
              <input
                type="number"
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
                Przebieg (km)
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
          </div>
        </div>

        {/* Technical Condition */}
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

        {/* Additional Features */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Wyposażenie dodatkowe</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(formData.additionalFeatures).map(([feature, value]) => (
              <div key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  id={feature}
                  checked={value}
                  onChange={(e) => handleInputChange('additionalFeatures', feature, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={feature} className="ml-2 text-sm text-gray-700">
                  {feature}
                </label>
              </div>
            ))}
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