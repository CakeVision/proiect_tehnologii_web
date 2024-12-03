import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import sessionRoutes from './routes/authRoutes'
import { syncDatabase } from './modelsClass/index';
import testRoutes from './routes/utilRoutes'
import adminRoutes from './routes/admin.routes'
import { authorize, UserType } from './middleware/credentials.middleware';
dotenv.config();

const app = express();
const PORT = 3000;
const router = express.Router()
// Middleware
app.use(express.json());
app.use('/test', testRoutes)
app.use('/admin', authorize([UserType.ADMIN]), adminRoutes)
app.use('/session',sessionRoutes)
app.use('/api/users', userRoutes)
app.listen(PORT, () => {
    syncDatabase()
    .then(() => {
      console.log('Database connection established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
    console.log(`Server is running on port ${PORT}`);
});
