const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const dataGenerators = require('./dataGenerators');

app.use(express.static('public'));

app.get('/generate/name', (req, res) => {
    const gender = req.query.gender || 'all';
    const quantity = parseInt(req.query.quantity) || 1;
    res.json(dataGenerators.generateName(gender, quantity));
});

app.get('/generate/surname', (req, res) => {
    const gender = req.query.gender || 'all';
    const quantity = parseInt(req.query.quantity) || 1;
    res.json(dataGenerators.generateSurname(gender, quantity));
});

app.get('/generate/date', (req, res) => {
    const quantity = parseInt(req.query.quantity) || 1;
    const format = req.query.format || 'DD-MM-YYYY';
    const separator = req.query.separator || '-';
    res.json(dataGenerators.generateDate(quantity, format, separator));
});

app.get('/generate/pesel', (req, res) => {
    const gender = req.query.gender || 'all';
    const year = parseInt(req.query.year) || undefined;
    const quantity = parseInt(req.query.quantity) || 1;
    res.json(dataGenerators.generatePESEL(gender, quantity, year));
});

app.get('/generate/id', (req, res) => {
    const quantity = parseInt(req.query.quantity) || 1;
    res.json(dataGenerators.generateID(quantity));
});

app.get('/generate/swift', (req, res) => {
    const quantity = parseInt(req.query.quantity) || 1;
    res.json(dataGenerators.generateSwift(quantity));
});

app.get('/generate/nip', (req, res) => {
    const quantity = parseInt(req.query.quantity) || 1;
    res.json(dataGenerators.generateNIP(quantity));
});

app.get('/generate/regon', (req, res) => {
    const type = parseInt(req.query.type) || 9;
    const quantity = parseInt(req.query.quantity) || 1;
    res.json(dataGenerators.generateREGON(quantity, type));
});

app.get('/generate/landRegistry', (req, res) => {
    const quantity = parseInt(req.query.quantity) || 1;
    res.json(dataGenerators.generateLandRegistryNumber(quantity));
});

app.get('/generate/bankAccount', (req, res) => {
    const quantity = parseInt(req.query.quantity) || 1;
    res.json(dataGenerators.generateBankAccountNumber(quantity));
});

app.get('/generate/iban', (req, res) => {
    const quantity = parseInt(req.query.quantity) || 1;
    res.json(dataGenerators.generateIBAN(quantity));
});

app.get('/generate/companyName', (req, res) => {
    const wordCount = parseInt(req.query.wordCount) || 1;
    const funny = req.query.funny === 'true';
    const quantity = parseInt(req.query.quantity) || 1;
    res.json(dataGenerators.generateCompanyName(quantity, wordCount, funny));
});

app.get('/generate/street', (req, res) => {
    const wordCount = parseInt(req.query.wordCount) || 1;
    const funny = req.query.funny === 'true';
    const quantity = parseInt(req.query.quantity) || 1;
    res.json(dataGenerators.generateStreet(quantity, wordCount, funny));
});

app.get('/generate/city', (req, res) => {
    const quantity = parseInt(req.query.quantity) || 1;
    res.json(dataGenerators.generateCity(quantity));
});

app.get('/generate/postalCode', (req, res) => {
    const quantity = parseInt(req.query.quantity) || 1;
    res.json(dataGenerators.generatePostalCode(quantity));
});

app.get('/generate/comment', (req, res) => {
    const wordCount = parseInt(req.query.words) || 10;
    const characterCount = parseInt(req.query.characters);
    const quantity = parseInt(req.query.quantity) || 1;
    res.json(dataGenerators.generateComment(quantity, wordCount, characterCount));
});

app.get('/generate/specialComment', (req, res) => {
    const type = req.query.type;
    const quantity = parseInt(req.query.quantity) || 1;
    res.json(dataGenerators.generateSpecialComment(quantity, type));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
