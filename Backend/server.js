const { PrismaClient } = require("@prisma/client");
const express = require("express");
const app = express();
const prisma = new PrismaClient();
const cors = require("cors");

app.use(express.json());

app.use(cors({
    origin: ["https://66bba6ea7cf6ac94d476ea0c--thunderous-empanada-e31d30.netlify.app/"]
}))

async function createQuestion(text) {
    return await prisma.question.create({
        data: { text },
    });
}

async function deleteQuestion(id) {
    return await prisma.question.delete({
        where: { id: Number(id) },
    });
}


async function deleteAnswer(id) {
    return await prisma.answer.delete({
        where: { id: Number(id) },
    });
}


app.delete("/question/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteQuestion(id);
        res.json({ message: "Question Deleted", result });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete question", details: error.message });
    }
});


app.delete("/answer/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteAnswer(id);
        res.json({ message: "Answer Deleted", result });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete answer", details: error.message });
    }
});

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
