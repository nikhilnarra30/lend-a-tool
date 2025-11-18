import { useState } from "react";
import "./FeedPanel.css"

export default function FeedPanel({ posts, onAddPost, onAddReply, selectedLocation }) {
 const [message, setMessage] = useState("");
 const [replyMessages, setReplyMessages] = useState({}); // key: postId


 const [title, setTitle] = useState("");


 const handlePostSubmit = (e) => {
   e.preventDefault();
   if (!title.trim() || !message.trim()) return;
   onAddPost(title, message);
   setTitle("");
   setMessage("");
 };


 const handleReplySubmit = (e, postId) => {
   e.preventDefault();
   const reply = replyMessages[postId];
   if (!reply || !reply.trim()) return;
   onAddReply(postId, reply);
   setReplyMessages({ ...replyMessages, [postId]: "" });
 };


 return (
   <div style={{ flex: 1, padding: "1rem", overflowY: "auto", background: "#f9f9f9" }}>
     <h2 id="Feed-Community" >Community Feed</h2>


     <form onSubmit={handlePostSubmit}>
        
        <div className="post">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
            selectedLocation ? "Thread title..." : "Click on the map to select a location"
           }
            />
       </div>

        <div className ="post"> 
           <textarea
             
           value={message}
           onChange={(e) => setMessage(e.target.value)}
           placeholder={
           selectedLocation
               ? "Type your main post..."
               : "Click on the map to select a location"
           }
           
       />
        </div>
      
       
       <br />
       <button className="post-button" type="submit" disabled={!selectedLocation}>Post</button>
     </form>




     <div style={{ marginTop: "1rem" }}>
       {posts.map((post) => (
         <div
         
         key={post.id}
           style={{
  
             border: "1px solid #ddd",
             borderRadius: "4px",
             padding: "0.5rem",
             marginBottom: "0.5rem",
             background: "#fff",
           }}
         >
           {/* Main post */}
           <div style={{ fontWeight: "bold" }}>{post.title}</div>
           <div>{post.content}</div>


           {/* Replies */}
           <div style={{ marginTop: "0.5rem", paddingLeft: "1rem" }}>
             {post.replies.map((r, i) => (
               <div
                 key={i}
                 style={{
                   borderTop: "1px solid #eee",
                   paddingTop: "0.25rem",
                   paddingBottom: "0.25rem",
                 }}
               >
                 {r}
               </div>
             ))}
           </div>


           {/* Reply form */}
           <form onSubmit={(e) => handleReplySubmit(e, post.id)} style={{ marginTop: "0.5rem" }}>
             <input
               type="text"
               value={replyMessages[post.id] || ""}
               onChange={(e) =>
                 setReplyMessages({ ...replyMessages, [post.id]: e.target.value })
               }
               placeholder="Reply..."
               style={{ width: "80%", marginRight: "0.5rem" }}
             />
             <button type="submit">Reply</button>
           </form>
         </div>
       ))}
     </div>
   </div>
 );
}
