const mongoose = require('mongoose');

const url = process.env.MONGODB_URL;

mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err.message);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator(v) {
        return /\d{2,3}-\d{6,}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('person', personSchema);
