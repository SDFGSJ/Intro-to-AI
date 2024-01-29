const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define the Finder Schema
const finderSchema = new Schema({
    name: { type: String, default: 'Anonymous' },
    contact: { type: String } // You can add more fields as needed
});

// Define the schema for items
const itemSchema = new Schema({
    description: { type: String, required: true },
    picture: { type: String, required: true }, // the url for the image
    dateLost: { type: Date }, // This can be optional
    locationFound: { type: String },
    status: { type: String, default: 'Unclaimed' }, // e.g., 'Claimed', 'Unclaimed'
    finder: finderSchema,
    vector: { type: [Number], required: true }
}, { versionKey: false }); // set the version to be false

const Items = mongoose.model('Items', itemSchema)
const mySchemas = {'Items':Items }

module.exports = mySchemas