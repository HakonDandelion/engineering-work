// pages/api/form-templates/[id].js
import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Nie jesteś zalogowany" });
  }

  if (req.method === 'GET') {
    try {
      const client = new MongoClient(process.env.DATABASE_URL);
      await client.connect();
      const database = client.db("tradeApp");
      const collection = database.collection("formTemplates");

      const templateId = req.query.id;
      
      const template = await collection.findOne({
        _id: new ObjectId(templateId),
        $or: [
          { isPublic: true },
          { createdBy: session.user.id }
        ]
      });

      if (!template) {
        return res.status(404).json({ error: "Szablon nie został znaleziony" });
      }

      res.status(200).json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Wystąpił błąd podczas pobierania szablonu" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}