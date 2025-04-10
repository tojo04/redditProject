import React, { useState, useContext, createContext } from 'react';

// Sample dummy data
const dummyComments = [
  {
    id: "1",
    parentId: null,
    author: "Hari",
    content: "This is a great post!",
    timestamp: new Date("2025-04-08T10:30:00").toISOString(),
    votes: 15
  },
  {
    id: "2",
    parentId: null,
    author: "Hitesh",
    content: "I have a different opinion on this topic.",
    timestamp: new Date("2025-04-08T11:15:00").toISOString(),
    votes: 8
  },
  {
    id: "3",
    parentId: "1",
    author: "Rushil",
    content: "I agree with Hari. Very insightful!",
    timestamp: new Date("2025-04-08T12:05:00").toISOString(),
    votes: 5
  },
  {
    id: "4",
    parentId: "1",
    author: "Ajay",
    content: "Have you considered the alternative perspective?",
    timestamp: new Date("2025-04-08T13:20:00").toISOString(),
    votes: 3
  },
  {
    id: "5",
    parentId: "4",
    author: "Abhishek",
    content: "That's a good point, ajay. I hadn't thought about it that way.",
    timestamp: new Date("2025-04-08T14:00:00").toISOString(),
    votes: 7
  },
  {
    id: "6",
    parentId: "2",
    author: "EverReady",
    content: "Hitesh, could you elaborate more on your perspective?",
    timestamp: new Date("2025-04-08T15:30:00").toISOString(),
    votes: 4
  },
  {
    id: "7",
    parentId: "6",
    author: "Hitesh",
    content: "Sure! I think that...[lengthy explanation]",
    timestamp: new Date("2025-04-08T16:15:00").toISOString(),
    votes: 9
  },
  {
    id: "8",
    parentId: null,
    author: "Teijas",
    content: "I hope this selects me for the project :D",
    timestamp: new Date("2025-04-09T09:45:00").toISOString(),
    votes: 2
  }
];

// Create Context for Comment Data
const CommentContext = createContext();

// Main Comment Provider Component
export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState(dummyComments);
  const [expandedComments, setExpandedComments] = useState({});
  const [currentUser, setCurrentUser] = useState("Anonymous"); // For simplicity, we'll use a fixed user
  
  // Add a new comment
  const addComment = (parentId, author, content) => {
    const newComment = {
      id: Date.now().toString(),
      parentId: parentId,
      author: author || currentUser,
      content,
      timestamp: new Date().toISOString(),
      votes: 0
    };
    
    setComments(prevComments => [...prevComments, newComment]);
  };
  
  // Edit an existing comment
  const editComment = (commentId, newContent) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              content: newContent,
              edited: true, // Add an 'edited' flag
              editTimestamp: new Date().toISOString()
            } 
          : comment
      )
    );
  };
  
  // Delete a comment and all its replies
  const deleteComment = (commentId) => {
    // Helper function to get all child comment IDs recursively
    const getChildIds = (parentId) => {
      const children = comments.filter(c => c.parentId === parentId);
      const childIds = children.map(c => c.id);
      const descendantIds = children.flatMap(c => getChildIds(c.id));
      return [...childIds, ...descendantIds];
    };
    
    // Get all child comment IDs
    const childIds = getChildIds(commentId);
    // All IDs to delete (including the comment itself)
    const idsToDelete = [commentId, ...childIds];
    
    // Filter out all comments with IDs in the deletion list
    setComments(prevComments => 
      prevComments.filter(comment => !idsToDelete.includes(comment.id))
    );
  };
  
  // Toggle expand/collapse for a comment thread
  const toggleExpanded = (commentId) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };
  
  // Vote on a comment
  const voteComment = (commentId, direction) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId 
          ? { ...comment, votes: comment.votes + direction } 
          : comment
      )
    );
  };

  return (
    <CommentContext.Provider value={{ 
      comments, 
      addComment,
      editComment,
      deleteComment,
      expandedComments, 
      toggleExpanded,
      voteComment,
      currentUser
    }}>
      {children}
    </CommentContext.Provider>
  );
};

// Custom hook to use the comment context
export const useComments = () => useContext(CommentContext);

// CommentSection component - Main container
const CommentSection = () => {
  const { comments } = useComments();
  
  // Get top-level comments (no parent)
  const topLevelComments = comments.filter(comment => comment.parentId === null);
  
  return (
    <div className="comment-section">
      <h2 className="comments-header">Comments</h2>
      <CommentList comments={topLevelComments} />
      <NewCommentForm parentId={null} />
    </div>
  );
};

// CommentList component - Displays a list of comments
const CommentList = ({ comments, parentId = null }) => {
  const { comments: allComments } = useComments();
  
  // Sort comments by timestamp, newest first
  const sortedComments = [...comments].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
  
  return (
    <div className="comment-list">
      {sortedComments.map(comment => (
        <Comment 
          key={comment.id} 
          comment={comment} 
        />
      ))}
    </div>
  );
};

// EditCommentForm component - Form for editing comments
const EditCommentForm = ({ comment, onCancel }) => {
  const { editComment } = useComments();
  const [content, setContent] = useState(comment.content);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      editComment(comment.id, content);
      onCancel();
    }
  };
  
  return (
    <form className="comment-form edit-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className="form-actions">
        <button type="submit" className="save-btn">Save</button>
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

// Comment component - Individual comment with replies
const Comment = ({ comment }) => {
  const { comments, expandedComments, toggleExpanded, voteComment, deleteComment, currentUser } = useComments();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Find child comments for this comment
  const childComments = comments.filter(c => c.parentId === comment.id);
  const hasReplies = childComments.length > 0;
  
  // Format timestamp
  const formattedTime = new Date(comment.timestamp).toLocaleString();
  
  // Check if this comment thread is expanded
  const isExpanded = expandedComments[comment.id] !== false; // Default to expanded
  
  // Check if current user is the author (for edit/delete permissions)
  const isAuthor = comment.author === currentUser;
  
  // Handle delete confirmation
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = () => {
    deleteComment(comment.id);
    setShowDeleteConfirm(false);
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };
  
  return (
    <div className="comment">
      <div className="comment-content">
        <div className="comment-votes">
          <button 
            className="vote-btn upvote" 
            onClick={() => voteComment(comment.id, 1)}
          >
            ▲
          </button>
          <span className="vote-count">{comment.votes}</span>
          <button 
            className="vote-btn downvote" 
            onClick={() => voteComment(comment.id, -1)}
          >
            ▼
          </button>
        </div>
        <div className="comment-body">
          <div className="comment-header">
            <span className="comment-author">{comment.author}</span>
            <span className="comment-time">{formattedTime}</span>
            {comment.edited && (
              <span className="edited-indicator">(edited)</span>
            )}
          </div>
          
          {isEditing ? (
            <EditCommentForm 
              comment={comment} 
              onCancel={() => setIsEditing(false)} 
            />
          ) : (
            <div className="comment-text">{comment.content}</div>
          )}
          
          <div className="comment-actions">
            <button onClick={() => setIsReplying(!isReplying)}>
              {isReplying ? 'Cancel' : 'Reply'}
            </button>
            
            {hasReplies && (
              <button onClick={() => toggleExpanded(comment.id)}>
                {isExpanded ? 'Collapse Replies' : `Show Replies (${childComments.length})`}
              </button>
            )}
            
            {isAuthor && !isEditing && (
              <>
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button className="delete-btn" onClick={handleDeleteClick}>Delete</button>
              </>
            )}
          </div>
          
          {showDeleteConfirm && (
            <div className="delete-confirm">
              <p>Are you sure you want to delete this comment and all replies?</p>
              <div className="delete-actions">
                <button onClick={confirmDelete} className="confirm-delete">Yes, Delete</button>
                <button onClick={cancelDelete}>Cancel</button>
              </div>
            </div>
          )}
          
          {isReplying && (
            <NewCommentForm 
              parentId={comment.id} 
              onSubmitSuccess={() => setIsReplying(false)} 
            />
          )}
        </div>
      </div>
      
      {/* Render child comments if expanded */}
      {hasReplies && isExpanded && (
        <div className="comment-replies">
          <CommentList comments={childComments} />
        </div>
      )}
    </div>
  );
};

// NewCommentForm component - Form for adding new comments
const NewCommentForm = ({ parentId, onSubmitSuccess }) => {
  const { addComment, currentUser } = useComments();
  const [author, setAuthor] = useState(currentUser);
  const [content, setContent] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (author.trim() && content.trim()) {
      addComment(parentId, author, content);
      setContent('');
      if (onSubmitSuccess) onSubmitSuccess();
    }
  };
  
  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <textarea
        placeholder={parentId ? "Write a reply..." : "Write a comment..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">
        {parentId ? "Reply" : "Comment"}
      </button>
    </form>
  );
};

export default CommentSection;