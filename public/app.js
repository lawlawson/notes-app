const API_URL = '/api/notes';
const form = document.getElementById('note-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const noteIdInput = document.getElementById('note-id');
const notesList = document.getElementById('notes-list');

// Fetch and display notes
async function fetchNotes() {
  const res = await fetch(API_URL);
  const notes = await res.json();
  notesList.innerHTML = notes
    .map(
      (note) =>
        `<li>
            <strong>${note.title}</strong>: ${note.content}
            <button onclick="editNote(${note.id}, '${note.title}', '${note.content}')">✏️</button>
            <button onclick="deleteNote(${note.id})">🗑</button>
        </li>`
    )
    .join('');
}

// Add or update note
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = noteIdInput.value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: titleInput.value,
      content: contentInput.value,
    }),
  });

  form.reset();
  noteIdInput.value = '';
  fetchNotes();
});

// Edit note
function editNote(id, title, content) {
  noteIdInput.value = id;
  titleInput.value = title;
  contentInput.value = content;
}

// Delete note
async function deleteNote(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchNotes();
}

// Load notes on startup
fetchNotes();
