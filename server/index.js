const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const { randomUUID } = require('crypto');
const bodyParser = require('body-parser');

const PORT = 4000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// IN REAL WORLD APPLICATION, WE WILL USE JWT OR PRE-BUILT IN SOLUTIONS TO HANDLE TOKENS
const middleware = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token || token !== 'abc1234') return res.status(401);
  next();
};

app.get('/me', middleware, (req, res) => {
  res.json({
    token: 'abc1234',
    authorized: true
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'kisi' && password === 'secret') {
    res.json({
      token: 'abc1234',
      authorized: true
    });
  }

  res.status(400).json({
    message: 'You are not authorized to login'
  });
});

const socketIO = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000'
  }
});

const payload = {
  id: 0,
  actor_type: 'string',
  actor_id: 0,
  actor_name: 'string',
  action: 'unlock',
  object_type: 'Lock',
  object_id: 0,
  object_name: 'string',
  success: true,
  error_code: null,
  error_message: null,
  created_at: '2022-10-06T13:49:35Z',
  references: [
    {
      id: 0,
      type: 'Lock'
    },
    {
      id: 0,
      type: 'Organization'
    },
    {
      id: 0,
      type: 'Place'
    },
    {
      id: 0,
      type: 'RoleAssignment'
    }
  ]
};

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('ping', (msg) => {
    if (msg === 'stop') {
      socket.emit('pong', 'all locations are filled');
      socket.disconnect();
      return;
    }

    setInterval(() => {
      const gData = {
        ...payload,
        id: randomUUID(),
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
        size: Math.random() / 3,
        // UNABLE TO FIGURE OUT CUSTOM ICONS FOR POINTERS, I'LL EXPLORE THE DOCS MORE
        color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
        // UNABLE TO FIGURE OUT THE BELOW POINT WITH HARD CODED DATA
        // Preserve the integrity of end users by making the location less accurate(e.g.mark the closest city with at least 1 million inhabitants)
        // IN THE API, WE ARE LIKELY GOING TO RECEIVE THE POPUPLATION OF EACH LOCATIONS, BASED ON THAT WE CAN SOME UP WITH THE SOLUTION
      };

      socketIO.emit('pong', gData);
    }, 3000);
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
