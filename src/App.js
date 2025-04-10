import React from 'react';
import './CommentSection.css';
import CommentSection, { CommentProvider } from './CommentSection';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Reddit-like Comment Section</h1>
      </header>
      <main>
        <CommentProvider>
          <CommentSection />
        </CommentProvider>
      </main>
      <footer className="App-footer">
        <p>Comment Section Project &copy; 2025</p>
      </footer>
    </div>
  );
}

export default App;