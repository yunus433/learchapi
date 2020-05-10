const express = require('express');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const socketIO = require('socket.io');
const cloudinary = require('cloudinary');

const sockets = require('./sockets/sockets');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/learchapi";

// const indexRouteController = require('./routes/indexRoute');
const authRouteController = require('./routes/authRoute');
const profileRouteController = require('./routes/profileRoute');
const userRouteController = require('./routes/userRoute');
const requestRouteController = require('./routes/requestRoute')
const chatRouteController = require('./routes/chatRoute');

const {
  SESSION_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  auto_reconnect: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(express.static(path.join(__dirname, "public")));

const session = expressSession({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
});

app.use(session);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.io = io;
  req.cloudinary = cloudinary;
  next();
});

// app.use('/', indexRouteController);
app.use('/auth', authRouteController);
app.use('/profile', profileRouteController);
app.use('/user', userRouteController);
app.use('/request', requestRouteController);
app.use('/chat', chatRouteController);

io.on('connection', (socket) => {
  sockets(socket, io);
});

server.listen(PORT, () => {
  console.log(`Server is on port ${PORT}`);
});
