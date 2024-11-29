import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

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
    console.log(`Server is running on port ${PORT}`);
});
