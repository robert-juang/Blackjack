import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
  initials: String,
  playerHand: [{ suit: String,
                 rank: String}],
  playerScore: Number,
  computerHand: [{ suit: String,
                   rank: String}],
  computerScore: Number,
  dateCreated: Date
})

const Score = mongoose.model('Score', ScoreSchema);

mongoose.connect('mongodb://localhost/hw07');