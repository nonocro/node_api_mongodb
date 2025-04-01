import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import potions_router from './router/potions.routes.js';
import auth_router from './router/auth.routes.js';
import analytics_router from './router/analytics.routes.js';
import sanitize from 'sanitize';
import cookieParser from 'cookie-parser';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(json());
app.use(cors());

// Define swaggerOptions
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Potion API',
      version: '1.0.0',
      description: 'API documentation for the Potion application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./router/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cookieParser());
app.use(sanitize.middleware);
app.use('/auth', auth_router);
app.use('/analytics', analytics_router);



connect(process.env.MONGO_URI)
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur MongoDB :', err));

app.use('/potions', potions_router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
