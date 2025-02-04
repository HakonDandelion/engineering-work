// pages/api/forms.js
import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const client = new MongoClient(process.env.DATABASE_URL);
      await client.connect();
      const database = client.db("tradeApp");
      const collection = database.collection("forms");

      const formData = {
        ...req.body,
        userId: req.body.userId,
        createdAt: new Date()
      };

      const result = await collection.insertOne(formData);

      res.status(201).json({
        message: "Formularz został zapisany pomyślnie!",
        formId: result.insertedId
      });
    } catch (error) {
      console.error("Błąd podczas zapisu formularza:", error);
      res.status(500).json({ error: "Wystąpił błąd podczas zapisu formularza." });
    }
  } else if (req.method === "GET") {
    try {
      const client = new MongoClient(process.env.DATABASE_URL);
      await client.connect();
      const database = client.db("tradeApp");
      const collection = database.collection("forms");

      const forms = await collection
        .find({ userId: req.query.userId })
        .sort({ createdAt: -1 })
        .toArray();

      res.status(200).json(forms);
    } catch (error) {
      console.error("Błąd podczas pobierania formularzy:", error);
      res.status(500).json({ error: "Wystąpił błąd podczas pobierania formularzy." });
    }
  }
}