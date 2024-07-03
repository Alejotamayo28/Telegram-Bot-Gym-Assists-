import express, { Application } from 'express';
import routes, { bot } from './routes';
import bodyParser from 'body-parser';
import cors from 'cors';
const app: Application = express();
const PORT = 4000;


// Servir archivos estáticos desde el directorio 'public'


app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
  bot.launch()
});

