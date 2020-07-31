const path = require('path');
const db = require('../../db/db.json')
const router = require('express').Router();
const fs = require('fs')
// GET route to send the database json to the front end
router.get("/notes",(req,res) => {
    console.log(`Sent ${db}`)
    res.json(db)
  });
//   POST route to add a new note to the db
router.post('/notes', (req, res) => {
    // create a unique id for the entry, we use the index it will have if it gets added to the db array
    req.body.id = db.length.toString()
    // perform validation
    if (!validateNote(req.body)) {
        res.status(400).send("The note was not posted.")
    }
    else {
        // if it passed validation, add the POSTed note to our local instance of the db array, then write the local instance
        // to file
        db.push(req.body)
        fs.writeFileSync(
            path.join(__dirname, '../../db/db.json'),
            JSON.stringify(db,null,2)
        )
        res.json(db)
    }
});
// DELETE route to remove notes
router.delete('/notes/:id', (req, res) => {
    // take the ID parameter, try to match it to an object in the db
    const result = findById(req.params.id,db)
    if (result) {
        // if it was found, splice it out of our local instance of the db
        db.splice(db.indexOf(result),1)
        // loop through the db instance and reassign ID's so that an object's ID is always its current index
        for (i=0;i<db.length;i++) {
            db[i].id = `${i}`
        }
        // write our local instance to file
        fs.writeFileSync(
            path.join(__dirname, '../../db/db.json'),
            JSON.stringify(db,null,2)
        )
        res.json(db)
    }
    else {
        res.status(400).send('ID not found')
    }
})
// helper functions
function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false
    }
    if (!note.text || typeof note.text !== 'string') {
        return false
    }
    return true
}
function findById(id,db) {
    for (item of db) {
        if  (item.id === id) {
            return item
        }
    }
    return false
}

module.exports = router