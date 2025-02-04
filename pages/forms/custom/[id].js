// pages/forms/custom/[id].js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import Header from "@/components/Header";
import Nav from "@/components/Nav";
import { MongoClient, ObjectId } from 'mongodb';

export default function CustomForm({ template }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error when field is modified
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    template.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = 'To pole jest wymagane';
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
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: template._id,
          formData,
          userId: session.user.id,
          status: "submitted"
        }),
      });

      if (response.ok) {
        router.push("/browse-reports?success=form-submitted");
      } else {
        throw new Error('Błąd podczas zapisywania formularza');
      }
    } catch (error) {
      console.error("Błąd:", error);
      setErrors(prev => ({
        ...prev,
        submit: 'Wystąpił błąd podczas zapisywania formularza'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
        return (
          <input
            type={field.type}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full p-2 bg-black/20 border ${
              errors[field.id] ? 'border-red-500' : 'border-gray-600'
            } rounded text-white`}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            rows="4"
            className={`w-full p-2 bg-black/20 border ${
              errors[field.id] ? 'border-red-500' : 'border-gray-600'
            } rounded text-white`}
          />
        );

      case 'select':
        return (
          <select
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full p-2 bg-black/20 border ${
              errors[field.id] ? 'border-red-500' : 'border-gray-600'
            } rounded text-white`}
          >
            <option value="">Wybierz...</option>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={formData[field.id] || false}
            onChange={(e) => handleInputChange(field.id, e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <Nav />
      
      <main className="max-w-6xl mx-auto mt-4 p-8">
        <div className="bg-black/20 backdrop-blur-sm p-8 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-700">
              {template.name}
            </h1>
            <button
              onClick={() => router.back()}
              className="text-white hover:text-gray-300"
            >
              ← Powrót
            </button>
          </div>

          <p className="text-gray-300 mb-8">{template.description}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {template.fields.map((field) => (
              <div key={field.id} className="bg-black/30 p-6 rounded-lg">
                <label className="block text-white font-medium mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {errors[field.id] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                )}
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-gradient-to-r from-pink-500 to-violet-700 text-white rounded hover:opacity-90 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Zapisywanie...' : 'Zapisz formularz'}
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

  try {
    const client = new MongoClient(process.env.DATABASE_URL);
    await client.connect();
    const database = client.db("tradeApp");
    const collection = database.collection("formTemplates");

    const template = await collection.findOne({
      _id: new ObjectId(context.params.id)
    });

    await client.close();

    if (!template) {
      return {
        notFound: true
      };
    }

    return {
      props: {
        session,
        template: JSON.parse(JSON.stringify({
          ...template,
          _id: template._id.toString()
        }))
      }
    };
  } catch (error) {
    console.error("Error fetching template:", error);
    return {
      notFound: true
    };
  }
}