// app.js
import express from 'express';
import "./db.mjs"; 
import mongoose from 'mongoose'; 

const app = express();

// to parse json bodies, uncomment the following line:
// app.use(express.json())

import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));

//use express.json if frontend is using fetch thaat generates aa post request
app.use(express.json())

const Score = mongoose.model('Score');

app.get('/api/scores', async (req, res) => {
    console.log("get request"); 
    try {
      const scores = await Score.find().sort({dateCreated: -1})
      console.log(scores) 
      res.send(scores)
    } catch(error) {
      res.send({error})
    }
});

app.post('/api/scores', async (req, res) => {
    try {
        const data = req.body; 
        console.log(data); 
        const scoreData = new Score({
            initials: req.body.initials, 
            playerHand: req.body.playerHand, 
            playerScore: req.body.playerScore, 
            computerHand: req.body.computerHand, 
            computerScore: req.body.computerScore, 
            dateCreated: req.body.dateCreated
        })
        scoreData.save().then(() => {})
      res.send({scoreData, error: null})
    } catch(error) {
      res.send({error})
    }
});

app.listen(3000);