require('dotenv').config();
const express = require('express');
const PDFDocument = require('pdfkit');
const app = express();
const port = 3000;
const cors = require('cors');




app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
    const apiKey = req.header('X-API-Key');

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: 'Acesso Negado. Chave de API inválida.' });
    }

    next();
});


app.use(express.json());

app.post('/generate-pdf', (req, res) => {
    const titulo = req.body.titulo;
    const text = req.body.text;

    if (!titulo || !text) {
        return res.status(400).json({ error: 'Título e texto são obrigatórios.' });
    }

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');

    doc.font('Helvetica-Bold')
       .fontSize(16)
       .text(titulo, 50, 50);

    doc.font('Helvetica')
       .fontSize(12)
       .text(text, 50, 90);

    doc.pipe(res);
    doc.end();
});


app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
