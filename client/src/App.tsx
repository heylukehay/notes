import './App.css';
import { useState } from 'react';

export type Note = {
  id: number;
  title: string;
  content: string;
  date?: string;
  time?: string;
};

function App() {

  const [notes, setNotes] = useState<Note[]>([] );

  return (
    <div className="app-container">
      <form className="note-form">
        <input
          type="text"
          placeholder="Title"
          className="note-title"
          required
        ></input>

        <textarea
          placeholder="Write your note here..."
          className="note-content"
          required
          rows={10}
        ></textarea>

        <button type="submit" className="note-submit">
          Add Note
        </button>
      </form>

      <div className="notes-list">
        <div className="note-item">
          <div className="note-header">
            <button>x</button>
          </div>
          <h3 className="note-title">Sample Note Title</h3>
          <p className="note-content">This is a sample note content. You can write anything you want here.</p>
          <div className="note-footer">
            <span className="note-date">1999-01-01</span>
            <span className="note-time">12:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;