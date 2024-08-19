// Create web server
const express = require('express');
const app = express();
app.use(express.json());
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Read comments.json
const commentsPath = path.join(__dirname, 'comments.json');
let comments = [];
if (fs.existsSync(commentsPath)) {
    const commentsData = fs.readFileSync(commentsPath);
    comments = JSON.parse(commentsData);
}

// Create a new comment
app.post('/comments', (req, res) => {
    const newComment = {
        id: uuidv4(),
        ...req.body
    };
    comments.push(newComment);
    fs.writeFileSync(commentsPath, JSON.stringify(comments));
    res.json(newComment);
});

// Get all comments
app.get('/comments', (req, res) => {
    res.json(comments);
});

// Get a comment by id
app.get('/comments/:id', (req, res) => {
    const comment = comments.find(comment => comment.id === req.params.id);
    if (comment) {
        res.json(comment);
    } else {
        res.status(404).json({ message: 'Comment not found' });
    }
});

// Update a comment by id
app.put('/comments/:id', (req, res) => {
    let comment = comments.find(comment => comment.id === req.params.id);
    if (comment) {
        comment = {
            ...comment,
            ...req.body
        };
        comments = comments.map(c => c.id === req.params.id ? comment : c);
        fs.writeFileSync(commentsPath, JSON.stringify(comments));
        res.json(comment);
    } else {
        res.status(404).json({ message: 'Comment not found' });
    }
});

// Delete a comment by id
app.delete('/comments/:id', (req, res) => {
    comments = comments.filter(comment => comment.id !== req.params.id);
    fs.writeFileSync(commentsPath, JSON.stringify(comments));
    res.json({ message: 'Comment deleted' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Test with Postman
// Create a new comment
// POST http://localhost:3000/comments
// Body: raw, JSON
//