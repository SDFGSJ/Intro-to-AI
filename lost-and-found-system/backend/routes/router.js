const express = require('express')
const child_process = require('child_process')
const router = express.Router()
// handle the timeout 
const asyncHandler = require('express-async-handler');
const schemas = require('../models/schemas')
// directly install node-fetch will cause error, please install node-fetch@2
// https://stackoverflow.com/questions/69087292/requirenode-fetch-gives-err-require-esm
var fetch = require('node-fetch');
const mongoose = require('mongoose');
const { json, text } = require('body-parser');
const { start } = require('repl');

// GET all items
router.get('/view', async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).send('Database not connected');
    }
    const Items = schemas.Items; // Get the Items model
    // usage http://127.0.0.1:4000/view?p=20&index=10
    // will show 10 items from 200 to 210
    const page = parseInt(req.query.p) || 0;
    const itemsPerPage = parseInt(req.query.index) || 10; // Default to 10 if not provided
    let startIndex = page * itemsPerPage;

    try {
        const totalItems = await Items.countDocuments();

        if (startIndex >= totalItems) {
            startIndex = Math.max(totalItems - itemsPerPage, 0);
        }

        const items = await Items.find()
                                .sort({ dateLost: -1 }) // Sorting by dateLost in descending order
                                .skip(startIndex)
                                .limit(itemsPerPage)
                                .select('-vector');

        res.status(200).json(items);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Error fetching items from database', details: error.message });
    }
});

// image and description handling
async function query(imageUrl) {
    // Fetch the image data from the URL
    const imageResponse = await fetch(imageUrl);
    const imageData = await imageResponse.buffer();
    // Call the image captioning API
    const apiResponse = await fetch(
        "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
        {
            headers: { Authorization: "Bearer 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" },
            method: "POST",
            body: imageData,
        }
    );
    const result = await apiResponse.json();
    return result;
}


router.get('/description/:a', async(req, res) => {
	const name = String(req.params.a);
	const prefix_url = "https://i.imgur.com/";
	const suffix_url = ".jpg";
	const url = prefix_url + name + suffix_url;
	try {
        const response = await query(url);
        res.json(response);
    } catch (error) {
        console.error("Error fetching image description:", error);
        res.status(500).send("Error fetching image description");
    }
	res.end();
})

// search 

router.post('/finding/description', async(req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).send('Database not connected');
    }
    let query = req.body.description
    console.log(req.body.description)
    var query_vector
    try {
        let param = query

        console.log(query)
        //await findpy(param1,param2,param3).then((result)=>{text = result})
        await postpy(param).then(result => {query_vector = result})
        //console.log(query_vector)
        await schemas.Items.aggregate([
            {
                $vectorSearch: {
                    index: "default",
                    path: "vector",
                    queryVector: query_vector,
                    numCandidates: 5,
                    limit: 5
                }
            },
            {
                $project: {
                    vector: 0,
                    score: { $meta: "searchScore" }
                }
            }
          ])
          .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            
            res.status(500).json({error: 'Could not find the document',err})
            console.log(err)
        })
    } catch (error) {
        console.log(error)
    }   
})


// other api functions

// delete a data
router.get('/delete/:id', asyncHandler(async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).send('Database not connected');
    }
    /*
    {
        "_id": {
            "$oid": "6597a762179c12b9eb7d3d51"
        },
        "description": "Black leather wallet",
        "picture": "https://example.com/images/wallet.jpg",
        "dateLost": {
            "$date": {
                "$numberLong": "1704240000000"
            }
        },
        "locationFound": "Main Street Park",
        "status": "Unclaimed",
        "finder": {
            "name": "Test Test",
            "contact": "0912345678",
            "_id": {
                "$oid": "6597a762179c12b9eb7d3d52"
            }
        }
    }
    */
    // url will be http://127.0.0.1:4000/delete/6597a762179c12b9eb7d3d51
    const id = req.params.id;
    console.log(id)
    try {
        await schemas.Items.findByIdAndDelete(id)
        .then(res.send("successfully delete"))
        .catch(error => console.error('Error deleting item:', error));
    } catch (error) {
        res.status(500).send(error)
    }
}))

// insert table item
router.post('/addItem', asyncHandler(async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).send('Database not connected');
    }
    // Example data to be saved
    /*const itemData = {
        "description": "Mikufuwa",
        "picture": "https://example.com/images/wallet.jpg",
        "dateLost": new Date(),
        "locationFound": "Main Street Park",
        "status": "Unclaimed",
        "finder": {
            "name": "Test Test",
            "contact": "0912345678"
        },
        "vector": [].shape() =384
    };*/
    // example of body 
    //generate vector for item
    let obj = req.body

    //console.log('hi there')
    let param = obj.description
    //let param = "aa"
    try {
        //let process = child_process.exec('python')
        await postpy(param).then(result => {obj.vector = result})
        var item = new schemas.Items(obj)
        if (obj.finder) {
            item.finder.name = obj.finder.finderName || 'Anonymous'; 
            item.finder.contact = obj.finder.finderContact;
        }
        //console.log(item)
        await item.save()
            .then(res.status(201).send("successfully insert"))
            .catch(error => console.error('Error saving item:', error));
        
        res.end();
    } catch (error) {
        res.status(500).send(error)
    }
    // Create an instance of the Items model
}))

router.get('/callpy', asyncHandler(async (req, res) => {
	
    console.log('func')

    try {
        let param1 = req.query.param1
        let param2 = req.query.param2
		let process = child_process.spawn('python', ["./routes/findpy.py", param1, param2]) //create a child process
        process.stdout.on('data', (data) => { //collect output form child process. Remember to do sys.stdout.flush() in .py
            const text = data.toString('utf8')
            console.log(text)
            res.status(200).json({a: text}) //response to client
        })
	} catch (error) {
		res.status(500).send(error)
	}
   
}))

function postpy(param){ //Promise python wrapper
    let process = child_process.spawn('python', ["./routes/postpy.py", param]) //create a child process
    return new Promise((resolve)=>{
        process.stdout.on('data', (data) => { //collect output form child process. Remember to do sys.stdout.flush() in .py
            console.log(data)
            const text = data.toString('utf8')
            vector = JSON.parse(text) //python return JSON string, parse it!
            resolve(vector)
        })
    })
}

function findpy(param1, param2, param3){ //Promise python wrapper
    let process = child_process.spawn('python', ["./routes/findpy.py", param1, param2, param3]) //create a child process
    console.log('child process spawned')
    return new Promise((resolve, reject)=>{
        try{
            process.stdout.on('data', (data) => { //collect output form child process. Remember to do sys.stdout.flush() in .py
                const text = data.toString('utf8') //TODO: what is the return val. of findpy?
                resolve(text)
            })
        }catch(err){
            console.log(err)
            reject(err)
        }
    })
   
}

module.exports = router