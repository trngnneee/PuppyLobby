import express from 'express';
import indexRoute from './routes/index.route.js';
import cors from "cors";
import cookieParser from 'cookie-parser';
const app = express();
const port = 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
}));

app.use('/', indexRoute);
app.get('/test', (req, res) => {
  res.send("Hello world");
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
})