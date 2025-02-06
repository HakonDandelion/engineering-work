import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'OPTIONS']);
  
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Nie jesteś zalogowany" });
  }

  switch (req.method) {
    case 'OPTIONS':
      return res.status(200).end();
      
    case 'PUT':
      try {
        const client = new MongoClient(process.env.DATABASE_URL);
        await client.connect();
        const database = client.db("tradeApp");
        const collection = database.collection("forms");

        const formId = req.query.id;
        const { _id, ...updateData } = req.body;

        const result = await collection.updateOne(
          {
            _id: new ObjectId(formId),
            userId: session.user.id
          },
          { $set: updateData }
        );

        await client.close();

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: "Formularz nie został znaleziony" });
        }

        return res.status(200).json({ message: "Formularz został zaktualizowany" });
      } catch (error) {
        console.error("Error updating form:", error);
        return res.status(500).json({ error: "Wystąpił błąd podczas aktualizacji formularza" });
      }

    default:
      return res.status(405).json({ error: `Metoda ${req.method} nie jest dozwolona` });
  }
}