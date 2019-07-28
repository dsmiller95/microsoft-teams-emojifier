import express from 'express';

const app = express();

app.get('/', (req, res) => res.send('Hello Emoji Users!!'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
