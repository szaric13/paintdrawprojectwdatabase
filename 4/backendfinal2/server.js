const app = require('./app');
const mongoose = require('mongoose');
const PORT = 3000;
const DB_URI = 'mongodb+srv://szaric7322rn:jsnmus2409@cluster0.yshmp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected');
    app.listen(PORT, () => {
      console.log(`port http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('connection error:', err));