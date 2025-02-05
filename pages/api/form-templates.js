// pages/api/form-templates.js
import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  // Sprawdzanie sesji po stronie serwera
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Nie jesteś zalogowany" });
  }

  if (req.method === "POST") {
    try {
      // Walidacja danych
      const { name, description, fields } = req.body;

      if (!name || !fields || fields.length === 0) {
        return res.status(400).json({ 
          error: "Brakuje wymaganych pól",
          details: {
            name: !name ? "Nazwa szablonu jest wymagana" : null,
            fields: !fields || fields.length === 0 ? "Formularz musi zawierać przynajmniej jedno pole" : null
          }
        });
      }

      // Walidacja pól formularza
      const fieldErrors = fields.reduce((errors, field, index) => {
        if (!field.label) {
          errors[`fields.${index}.label`] = "Etykieta pola jest wymagana";
        }
        if (field.type === 'select' && (!field.options || field.options.length === 0)) {
          errors[`fields.${index}.options`] = "Lista wyboru musi zawierać przynajmniej jedną opcję";
        }
        return errors;
      }, {});

      if (Object.keys(fieldErrors).length > 0) {
        return res.status(400).json({ 
          error: "Nieprawidłowe dane pól formularza",
          details: fieldErrors
        });
      }

      const client = new MongoClient(process.env.DATABASE_URL);
      await client.connect();
      const database = client.db("tradeApp");
      const collection = database.collection("formTemplates");

      const templateData = {
        ...req.body,
        createdBy: session.user.id,
        createdAt: new Date(),
        isPublic: req.body.isPublic || false,
      };

      const result = await collection.insertOne(templateData);
      await client.close();

      res.status(201).json({
        message: "Szablon formularza został utworzony",
        templateId: result.insertedId
      });
    } catch (error) {
      console.error("Błąd podczas tworzenia szablonu:", error);
      res.status(500).json({ error: "Wystąpił błąd podczas tworzenia szablonu" });
    }
  } else if (req.method === "GET") {
    try {
      const client = new MongoClient(process.env.DATABASE_URL);
      await client.connect();
      const database = client.db("tradeApp");
      const collection = database.collection("formTemplates");

      const templates = await collection.find({
        $or: [
          { isPublic: true },
          { createdBy: session.user.id }
        ]
      }).toArray();

      await client.close();
      res.status(200).json(templates);
    } catch (error) {
      console.error("Błąd podczas pobierania szablonów:", error);
      res.status(500).json({ error: "Wystąpił błąd podczas pobierania szablonów" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}