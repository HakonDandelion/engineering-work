// pages/api/forms/[id].js
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
      const collection = database.collection("forms");

      const form = await collection.findOne({
        _id: new ObjectId(req.query.id),
        userId: session.user.id
      });

      await client.close();

      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }

      return res.status(200).json(form);
    } catch (error) {
      console.error('Error fetching form:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === 'PUT') {
    try {
      const client = new MongoClient(process.env.DATABASE_URL);
      await client.connect();
      const database = client.db("tradeApp");
      const collection = database.collection("forms");

      const { _id, ...updateData } = req.body;
      const result = await collection.updateOne(
        {
          _id: new ObjectId(req.query.id),
          userId: session.user.id
        },
        { $set: updateData }
      );

      await client.close();

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Form not found" });
      }

      return res.status(200).json({ message: "Form updated successfully" });
    } catch (error) {
      console.error('Error updating form:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}