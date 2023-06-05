const mongoose = require("mongoose");

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

if (process.argv.length < 3) {
  console.log("Password is required");
  process.exit(1);
}

const url = `mongodb+srv://kuromika:${process.argv[2]}@cluster0.z0wfn5e.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: { type: String },
  number: { type: String },
});

const Person = mongoose.model("person", personSchema);

switch (process.argv.length) {
  case 3:
    Person.find({}).then((result) => {
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    });
    break;
  default:
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    });
    person.save().then((result) => {
      console.log(`added ${result.name} number ${result.number} to phonebook`);
      mongoose.connection.close();
    });
}
