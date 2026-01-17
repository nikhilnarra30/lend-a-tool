const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors({origin:'*'}));
app.use(express.json());

const db = new sqlite3.Database('./db.sqlite');


db.serialize(() => {
 // posts table
 db.run('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, latitude REAL, longitude REAL, like_count INTEGER DEFAULT 0,created_at DATETIME DEFAULT CURRENT_TIMESTAMP)')
 
    // replies table
    db.run("CREATE TABLE IF NOT EXISTS REPLIES (id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER, content TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(post_id) REFERENCES posts(id))")
})
// Get all posts with replies
app.get("/api/posts", (req, res) => {
    db.all("SELECT * FROM posts ORDER BY id DESC", (err, posts) => {
        if (err) return res.send({ error: err.message })

        const getReplies = posts.map ((post) =>
            new Promise ((resolve, reject)=>{
                db.all(
                    "SELECT content From replies WHERE post_id = ? ORDER BY id ASC",
                    [post.id],
                    (err,replies) => {
                        if (err) reject(err);
                        else resolve({...post,replies:replies.map((r)=> r.content)});
                        
                    }
                )
            })
        )
        Promise.all(getReplies)
        .then((results)=> res.send (results))
        .catch((err)=> res.send ({error: err.message}));
    
    })
})

app.post("/api/posts", (req, res) => {
     const {title, content, latitude, longitude} = req.body; 
     if (!title || !content || latitude== null || longitude==null) {
        return res.status(400).send({error: "Missing required fields"})} 
    db.run("INSERT INTO posts (title, content, latitude, longitude) VALUES (?, ?, ?, ?)", [title, content, latitude, longitude], function(err) {
        if (err) return res.send({ error: err.message })
        res.send({id: this.lastID, title, content, latitude, longitude, replies: []})
    })
})

app.put("/api/posts/:postID/like", (req, res) => {
    const {postID} = req.params;
    db.run("UPDATE posts SET like_count = like_count + 1 WHERE id = ?", [postID], function(err) {
        if (err) return res.send({ error: err.message })
        db.run("SELECT like_count FROM posts WHERE id = ?", [postID], function(err, row) {
            if (err) return res.send({ error: err.message })
            res.send({id: postID, like_count: row.like_count})
        })
    })
})


app.put("api/posts/:postID/unlike", (req, res) => {
    const {postID} = req.params;
    db.run( "UDPATE posts SET lke_count = MAX (like_count -1, 0) WHERE id = ?", [postID], function(err) {
        if (err) return res.send ({error: err.message})
        db.run("SELECT like_count FROM posts WHERE id = ?", [postID], function (err,row) {
            if (err) return res.send({error:err.message})
            res.send({id: postID, like_count: row.like_count})
        })
    })
}) 


app.post("/api/posts/:postID/reply", (req,res) => {
    const {postID} = req.params;
    const {content} = req.body;
    if (!content) return res.send({error: "Content is required"})
    db.run("INSERT INTO replies (post_id, content) VALUES (?, ?)", [postID, content], function(err) {
        if (err) return res.send({ error: err.message })
        res.send({id: this.lastID, post_id: postID, content})
    })
})

app.listen(PORT, () => console.log(`Backend running on https://lend-a-tool-backend-uily.onrender.com`))



