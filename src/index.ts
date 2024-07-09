import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { bot } from './bot';
import routes from './routes';
const app: Application = express();
const PORT = 4000;


// Servir archivos estáticos desde el directorio 'public'


app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
  bot.launch().then(() => {
    console.log(`Bot launched`)
  }).catch((err) => {
    console.error(err)
  })
});

