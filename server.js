const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const NOTES_FILE = path.join(__dirname, 'notes.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const loadNotes = () => {
  if (!fs.existsSync(NOTES_FILE)) fs.writeFileSync(NOTES_FILE, '[]');
  return JSON.parse(fs.readFileSync(NOTES_FILE));
};

const saveNotes = (notes) => {
  fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
};

app.get('/api/notes', (req, res) => {
  res.json(loadNotes());
});

app.post('/api/notes', (req, res) => {
  const notes = loadNotes();
  const newNote = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
  };
  notes.push(newNote);
  saveNotes(notes);
  res.status(201).json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
  let notes = loadNotes();
  notes = notes.map((note) =>
    note.id == req.params.id
      ? { ...note, title: req.body.title, content: req.body.content }
      : note
  );
  saveNotes(notes);
  res.json({ message: 'Note updated' });
});

app.delete('/api/notes/:id', (req, res) => {
  let notes = loadNotes();
  notes = notes.filter((note) => note.id != req.params.id);
  saveNotes(notes);
  res.json({ message: 'Note deleted' });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
