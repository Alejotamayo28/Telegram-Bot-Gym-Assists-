import express, { Application } from 'express';
import routes from './routes';
import bodyParser from 'body-parser';

export const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
app.use(express.json());

app.listen(4000, () => {
    console.log(`Server on port: 4000`);
});
