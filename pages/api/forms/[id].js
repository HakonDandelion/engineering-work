import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

let client;

export default async function handler(req, res) {
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'OPTIONS']);
  
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Nie jesteś zalogowany" });

    if (req.method === 'PUT') {
      if (!client) {
        client = new MongoClient(process.env.DATABASE_URL, {
          useUnifiedTopology: true,
          maxPoolSize: 10
        });
        await client.connect();
      }
      
      await client.connect();
      const database = client.db("tradeApp");
      const collection = database.collection("forms");

      const formId = req.query.id;
      const { _id, ...updateData } = req.body;

      const result = await collection.findOneAndUpdate(
        {
          _id: new ObjectId(formId),
          userId: session.user.id
        },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result.value) {
        return res.status(404).json({ error: "Formularz nie został znaleziony" });
      }

      return res.status(200).json({ message: "Formularz został zaktualizowany" });
    }

    return res.status(405).json({ error: `Metoda ${req.method} nie jest dozwolona` });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Wystąpił błąd serwera" });
  }
}