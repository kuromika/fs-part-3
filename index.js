const express = require('express');
const res = require('express/lib/response');

const phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const app = express();
app.use(express.json());
const PORT = 3001;

app.get('/api/persons', (request, response) => {
  response.json(phonebook);
})



app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`)
})