import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Wszystkie pola są wymagane!" });
    }

    try {
      const client = new MongoClient(process.env.DATABASE_URL);
      await client.connect();
      const database = client.db("tradeApp");
      const collection = database.collection("users");

      const user = await collection.findOne({ username });

      if (!user) {
        return res.status(401).json({ error: "Nieprawidłowa nazwa użytkownika lub hasło." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Nieprawidłowa nazwa użytkownika lub hasło." });
      }

      res.status(200).json({ message: "Zalogowano pomyślnie!" });
    } catch (error) {
      console.error("Błąd podczas logowania:", error);
      res.status(500).json({ error: "Wystąpił błąd podczas logowania." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Metoda ${req.method} nie jest obsługiwana`);
  }
}
