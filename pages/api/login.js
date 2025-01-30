import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Wszystkie pola są wymagane!" });
    }

    try {
      await client.connect();
      const database = client.db("tradeApp");
      const collection = database.collection("users");

      const user = await collection.findOne({ username });

      if (!user) {
        return res.status(401).json({ error: "Nie znaleziono użytkownika o podanej nazwie." });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Podane hasło jest nieprawidłowe." });
      }

      res.status(200).json({ message: "Zalogowano pomyślnie!" });
    } catch (error) {
      console.error("Błąd podczas logowania:", error);
      res.status(500).json({ error: "Wystąpił błąd podczas logowania." });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Metoda ${req.method} nie jest obsługiwana`);
  }
}
