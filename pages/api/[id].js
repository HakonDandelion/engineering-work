// pages/api/forms/[id].js
import { MongoClient, ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Nie jesteś zalogowany" });
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: "Metoda nie jest dozwolona" });
  }

  try {
    const client = new MongoClient(process.env.DATABASE_URL);
    await client.connect();
    const database = client.db("tradeApp");
    const collection = database.collection("forms");

    const formId = req.query.id;
    const updateData = req.body;

    const result = await collection.updateOne(
      { 
        _id: new ObjectId(formId),
        userId: session.user.id 
      },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Formularz nie został znaleziony" });
    }

    res.status(200).json({ message: "Formularz został zaktualizowany" });
  } catch (error) {
    console.error("Błąd podczas aktualizacji formularza:", error);
    res.status(500).json({ error: "Wystąpił błąd podczas aktualizacji formularza" });
  }
}