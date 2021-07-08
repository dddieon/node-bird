const express = require('express');

const router = express.Router();

router.get("/", (req,res) => { //POST /get
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'hello2' }
  ])
})

router.post("/", (req,res) => { //POST /post
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'hello2' }
  ])
})

router.delete("/", (req,res) => { //DELETE /post
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'hello2' }
  ])
})

module.exports = router;