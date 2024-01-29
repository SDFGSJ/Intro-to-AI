const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes/router')
const mongoose = require('mongoose')
require('dotenv/config')

const app =  express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: 'majority'
};

app.use(cors(corsOptions))
app.use('/', router)

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("final_project").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        const port = process.env.PORT || 4000
        const server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
        mongoose.connect(process.env.DB_URI, dbOptions)
        .then( () =>  {
            console.log("Connected");
        })
        .catch ((err) => {
            console.log(`connect error: ${err.message}`);
            if (mongoose.connection.readyState != 0) {
                console.log(`mongoose.connect returned an error, but ready state is ${mongoose.connection.readyState}`);
            }
        });
        process.on('SIGINT', async () => {
            console.log(mongoose.connection.readyState);
            await client.close();
            await mongoose.connection.close();
            server.close(() => {
                console.log('Server and MongoDB connection closed');
                process.exit(0);
            });
        });
    } catch(error) {
        console.error("Error running the application", error);
        process.exit(1);
    }
}
run().catch(console.dir);


