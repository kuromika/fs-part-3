const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const Person = require("./models/person");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.static("build"));
app.use(cors());
app.use(express.json());

morgan.token("data", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(res.body);
  }
});

app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.data(req, res),
    ].join(" ");
  })
);

const createId = () => {
  return Math.floor(Math.random() * 10000);
};

app.get("/", (request, response) => {
  response.sendFile("/build/index.html");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((result) => {
      if (!result) {
        return response.status(404).end();
      }
      response.json(result);
    })
    .catch((err) => {
      response.status(400).end();
    });
});

app.delete("/api/persons/:id", (request, response) => {
  phonebook = phonebook.filter((person) => {
    return person.id !== Number(request.params.id);
  });
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: "Name or number missing",
    });
  }

  if (
    phonebook.find((person) => {
      return person.name.toLowerCase() === request.body.name.toLowerCase();
    })
  ) {
    return response.status(400).json({
      error: "Name already exists",
    });
  }

  const newPerson = {
    id: createId(),
    name: request.body.name,
    number: request.body.number,
  };

  phonebook.push(newPerson);

  response.body = newPerson;

  response.json(newPerson);
});

app.get("/info", (request, response) => {
  response.send(`
  <p>Phonebook has info for ${phonebook.length} people</p>
  <p>${new Date(Date.now()).toUTCString()}</p>
  `);
});

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
