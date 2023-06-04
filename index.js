const express = require('express');

let phonebook = [
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


const createId = () => {
  return (Math.floor(Math.random() * 10000));
}

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

app.delete('/api/persons/:id', (request, response) => {
  phonebook = phonebook.filter((person) => {
    return person.id !== Number(request.params.id);
  })
  response.status(204).end();
})

app.post('/api/persons', (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'Name or number missing'
    })
  }

  if (phonebook.find((person) => {
    return person.name.toLowerCase() === request.body.name.toLowerCase();
  })) {
    return response.status(400).json({
      error: 'Name already exists'
    })
  }

  const newPerson = {
    id: createId(),
    name: request.body.name,
    number: request.body.number
  }

  phonebook.push(newPerson);

  response.json(newPerson);

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