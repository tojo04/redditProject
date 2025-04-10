# Reddit-like Nested Comment Section

A React-based implementation of a threaded comment system similar to Reddit. It features  hierarchical comment structures with reply functionality. I Also added the Upvote/Downvote
functionality.

## Features

- Hierarchical (nested) comment structure
- Post new top-level comments
- Reply to any existing comment
- Expandable/collapsible comment threads
- Upvote/Downvote functionality
- Responsive design for various screen sizes
- Preloaded dummy data for demonstration


## Tech Stack

- **Frontend**: React.js
- **State Management**: React Context/State
- **Styling**: Vanilla CSS
- **Data Handling**: Hardcoded dummy data

## Installation

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher) 

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/tojo04/redditProject.git
   cd redditProject
   ```

2. Install dependencies:
   ```bash
   npm install
   
   ```

3. Start the development server:
   ```bash
   npm start
  
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### Adding a Top-Level Comment

1. Navigate to the main comment form at the bottom of the page
2. Enter your name (default is anonymous)
3. Enter your comment text
3. Click "Comment" to post your comment

### Replying to an Existing Comment

1. Click the "Reply" button under the comment you want to respond to
2. Enter your name
3. Enter your reply in the comment form that appears
4. Click "Reply" to post your reply

### Expanding/Collapsing Comment Threads

- Click the (Show replies)/(collapse replies) button next to the "Reply" button to show or hide its replies

## Data Structure

Each comment follows this structure:

```javascript
{
  id: "unique-identifier",
  parentId: "parent-comment-id" || null, // null for top-level comments
  author: "Username",
  content: "Comment text content",
  timestamp: "2023-05-15T12:30:00Z",
  upvotes: 5,
  downvotes: 1
}
```

## Customization

### Styling

The project uses Vanilla CSS for simplicity and to keep the implementation straightforward.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Inspired by Reddit's comment system
- Built as a demonstration project