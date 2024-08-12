const { PrismaClient } = require("@prisma/client");
const express = require("express");
const app = express();
const prisma = new PrismaClient();
const cors = require("cors");

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000"]
}))

async function createQuestion(text) {
    return await prisma.question.create({
        data: { text },
    });
}

async function createAnswer(text, isCorrect, questionId) {
    return await prisma.answer.create({
        data: { 
            text, 
            isCorrect, 
            questionId 
        }
    });
}

app.post("/question", async (req, res) => {
    try {
        const { text } = req.body;
        const result = await createQuestion(text);
        res.json({ message: "Question Created", result });
    } catch (error) {
        res.status(500).json({ error: "Failed to create question", details: error.message });
    }
});


app.get("/questions", async (req, res) => {
    try {
        const result = await prisma.question.findMany({
            include: { answers: true }
        })
        res.json(result);
    } catch (error) 
{
    res.send("Something went wrong")
}})

app.post("/answer", async (req, res) => {
    try {
        const { text, isCorrect, questionId } = req.body;
        const result = await createAnswer(text, isCorrect, questionId);
        res.json({ message: "Answer Created", result });
    } catch (error) {
        res.status(500).json({ error: "Failed to create answer", details: error.message });
    }
});

app.get("/question/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const question = await prisma.question.findUnique({
            where: { id: Number(id) }, 
            include: { answers: true } 
        });
        res.json(question);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch question details", details: error.message });
    }
});


(async () => {
    try {
        await prisma.$connect();
        console.log("Database Connected!");

        app.listen(8081, () => {
            console.log("Server listening on port 8081");
        });
    } catch (err) {
        console.log("Error connecting to the database:", err);
    }
})();
