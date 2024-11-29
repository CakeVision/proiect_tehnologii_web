import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import { syncDatabase } from './modelsClass/index.js';

dotenv.config();

const app = express();
const PORT = 3000;
const router = express.Router()
// Middleware
app.use(express.json());
app.use('/test', router.get('/', async (req, res ) => {
    res.json ({"result": "ok"});

}))
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
