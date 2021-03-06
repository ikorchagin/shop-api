import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import fileUpload from 'express-fileupload';

import routes from './routes';
import errorHandler from './middlewares/error-handler';
import swagger from './config/swagger';
import corsSettings from './config/cors-settings';

const app = express();

// Before middlewares
app.options('*', cors(corsSettings));
app.use(cors(corsSettings));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use(logger('tiny'));
app.use(express.json({ limit: '30mb' }));

// Routes
app.use('/api', routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger));

// After middlewares
app.use(errorHandler);

export default app;
