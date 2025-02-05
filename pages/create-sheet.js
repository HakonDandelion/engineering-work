import { useState, useCallback } from "react";
import { useRouter } from 'next/router';
import { getSession, useSession } from "next-auth/react";
import Header from "@/components/Header";
import Nav from "@/components/Nav";

export default function CreateTemplate() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [fieldIdCounter, setFieldIdCounter] = useState(1);

  const [templateData, setTemplateData] = useState({
    name: "",
    description: "",
    isPublic: false,
    fields: [
      {
        id: 'field_0',
        label: "",
        type: "text",
        required: false,
        options: [],
        validation: {}
      }
    ]
  });

  const fieldTypes = [
    { value: "text", label: "Tekst" },
    { value: "number", label: "Liczba" },
    { value: "select", label: "Lista wyboru" },
    { value: "checkbox", label: "Pole wyboru" },
    { value: "date", label: "Data" },
    { value: "textarea", label: "Długi tekst" }
  ];

  const addField = () => {
    const newId = generateId();
    setTemplateData(prev => ({
      ...prev,
      fields: [...prev.fields, {
        id: newId,
        label: "",
        type: "text",
        required: false,
        options: [],
        validation: {}
      }]
    }));
  };

  const removeField = (fieldId) => {
    setTemplateData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const updateField = (fieldId, updates) => {
    setTemplateData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const addOption = (fieldId) => {
    const newOptionId = generateId('option');
    setTemplateData(prev => ({
      ...prev,
      fields: prev.fields.map(field => {
        if (field.id === fieldId) {
          return {
            ...field,
            options: [...field.options, { id: newOptionId, value: "", label: "" }]
          };
        }
        return field;
      })
    }));
  };

  const removeOption = (fieldId, optionId) => {
    setTemplateData(prev => ({
      ...prev,
      fields: prev.fields.map(field => {
        if (field.id === fieldId) {
          return {
            ...field,
            options: field.options.filter(opt => opt.id !== optionId)
          };
        }
        return field;
      })
    }));
  };

  const updateOption = (fieldId, optionId, updates) => {
    setTemplateData(prev => ({
      ...prev,
      fields: prev.fields.map(field => {
        if (field.id === fieldId) {
          return {
            ...field,
            options: field.options.map(opt =>
              opt.id === optionId ? { ...opt, ...updates } : opt
            )
          };
        }
        return field;
      })
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Walidacja podstawowych informacji
    if (!templateData.name.trim()) {
      newErrors.name = "Nazwa szablonu jest wymagana";
    }

    // Walidacja pól formularza
    templateData.fields.forEach((field, index) => {
      if (!field.label.trim()) {
        newErrors[`field_${index}_label`] = "Etykieta pola jest wymagana";
      }

      if (field.type === 'select') {
        if (!field.options || field.options.length === 0) {
          newErrors[`field_${index}_options`] = "Lista wyboru musi zawierać przynajmniej jedną opcję";
        } else {
          field.options.forEach((option, optIndex) => {
            if (!option.label.trim() || !option.value.trim()) {
              newErrors[`field_${index}_option_${optIndex}`] = "Etykieta i wartość opcji są wymagane";
            }
          });
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/form-templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Wystąpił błąd podczas zapisywania szablonu');
      }

      router.push("/select-sheet?success=template-created");
    } catch (error) {
      console.error("Błąd podczas zapisywania szablonu:", error);
      setErrors(prev => ({
        ...prev,
        submit: error.message
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Header />
      <Nav />
      
      <main className="max-w-6xl mx-auto p-8">
        <div className="bg-black/20 backdrop-blur-sm p-8 rounded-lg">
        {errors.submit && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-100">
              {errors.submit}
            </div>
          )}

          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-700 mb-6">
            Stwórz nowy szablon formularza
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Podstawowe informacje o szablonie */}
            <div className="bg-black/30 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">Informacje podstawowe</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Nazwa szablonu
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={templateData.name}
                    onChange={(e) => {
                      setTemplateData(prev => ({ ...prev, name: e.target.value }));
                      if (errors.name) {
                        setErrors(prev => ({ ...prev, name: null }));
                      }
                    }}
                    className={`w-full p-2 bg-black/20 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded text-white`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Opis</label>
                  <textarea
                    value={templateData.description}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 bg-black/20 border border-gray-600 rounded text-white"
                    rows="3"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={templateData.isPublic}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isPublic" className="text-gray-300">
                    Szablon publiczny (widoczny dla wszystkich użytkowników)
                  </label>
                </div>
              </div>
            </div>

            {/* Lista pól formularza */}
            <div className="bg-black/30 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">Pola formularza</h2>
              
              <div className="space-y-6">
                {templateData.fields.map((field) => (
                  <div key={field.id} className="p-4 bg-black/20 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white font-medium">Pole formularza</h3>
                      <button
                        type="button"
                        onClick={() => removeField(field.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Usuń pole
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Etykieta</label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          className="w-full p-2 bg-black/20 border border-gray-600 rounded text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2">Typ pola</label>
                        <select
                          value={field.type}
                          onChange={(e) => updateField(field.id, { type: e.target.value })}
                          className="w-full p-2 bg-black/20 border border-gray-600 rounded text-white"
                        >
                          {fieldTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="flex items-center text-gray-300">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          className="mr-2"
                        />
                        Pole wymagane
                      </label>
                    </div>

                    {field.type === 'select' && (
                      <div className="mt-4">
                        <label className="block text-gray-300 mb-2">Opcje wyboru</label>
                        {field.options.map(option => (
                          <div key={option.id} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={option.label}
                              onChange={(e) => updateOption(field.id, option.id, { label: e.target.value })}
                              placeholder="Etykieta"
                              className="flex-1 p-2 bg-black/20 border border-gray-600 rounded text-white"
                            />
                            <input
                              type="text"
                              value={option.value}
                              onChange={(e) => updateOption(field.id, option.id, { value: e.target.value })}
                              placeholder="Wartość"
                              className="flex-1 p-2 bg-black/20 border border-gray-600 rounded text-white"
                            />
                            <button
                              type="button"
                              onClick={() => removeOption(field.id, option.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Usuń
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addOption(field.id)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          + Dodaj opcję
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addField}
                  className="w-full py-3 px-4 bg-black/30 text-white rounded-lg border-2 border-dashed border-gray-600 hover:bg-black/40"
                >
                  + Dodaj nowe pole
                </button>
              </div>
            </div>

            {/* Przyciski formularza */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
              >
                Anuluj
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-violet-700 text-white hover:opacity-90 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Zapisywanie...' : 'Zapisz szablon'}
              </button>
            </div>
          </form>
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