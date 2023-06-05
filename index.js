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
      response.status(400).send({ error: "malformated id" });
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons", (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: "Name or number missing",
    });
  }

  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });

  person.save().then((result) => {
    response.body = result;
    response.json(result);
  });
});

app.get("/info", (request, response) => {
  response.send(`
  <p>Phonebook has info for ${phonebook.length} people</p>
  <p>${new Date(Date.now()).toUTCString()}</p>
  `);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformated id" });
  }

  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
