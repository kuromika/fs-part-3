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

app.get('/api/persons/:id', (request, response) => {
  const person = phonebook.find((person) => {
    return person.id === Number(request.params.id);
  });

  if (!person) {
    return response.status(404).end();
  }
  response.json(person);
})



app.get('/info', (request, response) => {
  response.send(`
  <p>Phonebook has info for ${phonebook.length} people</p>
  <p>${new Date(Date.now()).toUTCString()}</p>
  `)
})



app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`)
})