import Nav from "@/components/Nav";
import Header from "@/components/Header";
import { useState } from "react";

export default function CreateSheet() {
 const [formFields, setFormFields] = useState([
   { id: 1, label: '', type: 'text', required: false }
 ]);

 const [formData, setFormData] = useState({
   title: '',
   description: ''
 });

 // Dodawanie nowego pola
 const addField = () => {
   setFormFields([
     ...formFields,
     {
       id: formFields.length + 1,
       label: '',
       type: 'text',
       required: false
     }
   ]);
 };

 // Usuwanie pola
 const removeField = (id) => {
   setFormFields(formFields.filter(field => field.id !== id));
 };

 // Aktualizacja pola
 const updateField = (id, updatedValues) => {
   setFormFields(formFields.map(field => 
     field.id === id ? { ...field, ...updatedValues } : field
   ));
 };

 return (
   <div>
     <Header />
     <Nav />
     
     <main>
       <div className="max-w-4xl mx-auto mt-4 p-8">
         <div className="bg-black/20 backdrop-blur-sm p-12 rounded-lg">
           <h1 className="mb-6 text-6xl bg-clip-text text-transparent font-bold bg-gradient-to-r from-pink-500 to-violet-700">
             Create sheet
           </h1>

           <form className="space-y-8">
             {/* Podstawowe informacje o formularzu */}
             <div className="space-y-4">
               <div>
                 <label className="block text-white mb-2">Tytuł formularza</label>
                 <input
                   type="text"
                   className="w-full px-4 py-2 rounded-lg bg-black/30 text-white border border-gray-700 focus:border-violet-500 focus:outline-none"
                   value={formData.title}
                   onChange={(e) => setFormData({...formData, title: e.target.value})}
                   placeholder="Wprowadź tytuł formularza"
                 />
               </div>

               <div>
                 <label className="block text-white mb-2">Opis formularza</label>
                 <textarea
                   className="w-full px-4 py-2 rounded-lg bg-black/30 text-white border border-gray-700 focus:border-violet-500 focus:outline-none"
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   placeholder="Wprowadź opis formularza"
                   rows="3"
                 />
               </div>
             </div>

             {/* Lista pól formularza */}
             <div className="space-y-6">
               <h2 className="text-2xl text-white font-semibold">Pola formularza</h2>
               
               {formFields.map((field) => (
                 <div key={field.id} className="p-4 bg-black/30 rounded-lg space-y-4">
                   <div className="flex justify-between items-center">
                     <h3 className="text-white font-medium">Pole #{field.id}</h3>
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
                       <label className="block text-gray-300 mb-1">Etykieta</label>
                       <input
                         type="text"
                         className="w-full px-3 py-2 rounded bg-black/20 text-white border border-gray-700"
                         value={field.label}
                         onChange={(e) => updateField(field.id, { label: e.target.value })}
                       />
                     </div>

                     <div>
                       <label className="block text-gray-300 mb-1">Typ pola</label>
                       <select
                         className="w-full px-3 py-2 rounded bg-black/20 text-white border border-gray-700"
                         value={field.type}
                         onChange={(e) => updateField(field.id, { type: e.target.value })}
                       >
                         <option value="text">Tekst</option>
                         <option value="number">Liczba</option>
                         <option value="email">Email</option>
                         <option value="date">Data</option>
                         <option value="textarea">Długi tekst</option>
                       </select>
                     </div>
                   </div>

                   <div>
                     <label className="flex items-center text-gray-300">
                       <input
                         type="checkbox"
                         className="mr-2"
                         checked={field.required}
                         onChange={(e) => updateField(field.id, { required: e.target.checked })}
                       />
                       Pole wymagane
                     </label>
                   </div>
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

             {/* Przyciski formularza */}
             <div className="flex justify-end space-x-4">
               <button
                 type="button"
                 className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
               >
                 Anuluj
               </button>
               <button
                 type="submit"
                 className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-violet-700 text-white hover:opacity-90"
               >
                 Zapisz formularz
               </button>
             </div>
           </form>
         </div>
       </div>
     </main>
   </div>
 );
}