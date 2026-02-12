import express from 'express';
const app = express();
const PORT = 5001;

app.get('/', (req, res) => res.send('Hello'));

app.listen(PORT, () => {
    console.log(`Minimal server running on port ${PORT}`);
});
