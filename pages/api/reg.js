import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: "Wszystkie pola są wymagane!" });
      }

      await client.connect();
      const database = client.db("tradeApp");
      const collection = database.collection("users");

      // **Zahashowanie hasła przed zapisem!**
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await collection.insertOne({
        username,
        email,
        password: hashedPassword, // ⬅️ Teraz zapisujemy zaszyfrowane hasło
        createdAt: new Date(),
      });

      res.status(201).json({
        message: "Użytkownik został pomyślnie zarejestrowany!",
        userId: result.insertedId,
      });
    } catch (error) {
      console.error("Błąd podczas zapisu w bazie:", error);
      res.status(500).json({ error: "Wystąpił błąd podczas rejestracji." });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Metoda ${req.method} nie jest obsługiwana`);
  }
}
