const API_URL = '/api/notes';
const form = document.getElementById('note-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const noteIdInput = document.getElementById('note-id');
const notesList = document.getElementById('notes-list');

async function fetchNotes() {
  const res = await fetch(API_URL);
  const notes = await res.json();
  notesList.innerHTML = notes
    .map(
      (note) =>
        `<li>
            <strong>${note.title}</strong> ${note.content} 
        </li>
        <button class="edit-button" onclick="editNote(${note.id}, '${note.title}', '${note.content}')"><i class="fa-regular fa-pen-to-square"></i>Edit note</button>
        <button class="delete-button" onclick="deleteNote(${note.id})"><i class="fa-solid fa-trash"></i>Delete note</button>`
    )
    .join('');
}

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

function editNote(id, title, content) {
  noteIdInput.value = id;
  titleInput.value = title;
  contentInput.value = content;
}

async function deleteNote(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchNotes();
}

fetchNotes();
