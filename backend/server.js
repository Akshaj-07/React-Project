import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        message: "Backend server is running!"
    });
});


app.get("/api/user", (req, res) => {
    res.json({
        name: "React",
        project: "React",
        status: "Active"
    });
});


app.post("/api/user", (req, res) => {
    const userData = req.body;

    res.json({
        message: "Data received successfully",
        data: userData
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
