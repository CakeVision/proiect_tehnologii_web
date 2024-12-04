import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import sessionRoutes from './routes/auth.routes'
import { syncDatabase } from './models/db';
import testRoutes from './routes/test.routes'
import adminRoutes from './routes/admin.routes'
import { authorize, UserType } from './middleware/credentials.middleware';
import { createEnvFile } from './gen_env';
import taskRoutes from './routes/task.routes'
createEnvFile('./.env')

dotenv.config();

const app = express();
const PORT = 3000;
const router = express.Router()
// Middleware
app.use(express.json());
app.use('/test', testRoutes)
app.use('/admin', authorize([UserType.ADMIN]), adminRoutes)
app.use('/session',sessionRoutes)
app.use('/users', userRoutes)
app.use('/tasks', taskRoutes)
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