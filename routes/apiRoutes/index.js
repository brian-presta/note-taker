const path = require('path');
const db = require('../../db/db.json')
const router = require('express').Router();
const fs = require('fs')

router.get("/notes",(req,res) => {
    console.log(`Sent ${db}`)
    res.json(db)
  });
router.post('/notes', (req, res) => {
    req.body.id = db.length.toString()
    if (!validateNote(req.body)) {
        res.status(400).send("The note was not posted.")
    }
    else {
        db.push(req.body)
        fs.writeFileSync(
            path.join(__dirname, '../../db/db.json'),
            JSON.stringify(db,null,2)
        )
        res.json(db)
    }
});
router.delete('/notes/:id', (req, res) => {
    const result = findById(req.params.id,db)
    if (result) {
        db.splice(db.indexOf(result),1)
        for (i=0;i<db.length;i++) {
            db[i].id = `${i}`
        }
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