import { useState,useEffect } from "react";
import "./App.css";
import MapPanel from "./components/MapPanel";
import FeedPanel from "./components/FeedPanel";


function App() {
 const [posts, setPosts] = useState([]); // array of thread posts with replies
 const [selectedLocation, setSelectedLocation] = useState(null);
 const [likedPosts, setLikedPosts] = useState(new Set())

useEffect( () => {
  fetch("https://lend-a-tool-backend-uily.onrender.com/api/posts")
  .then(res => res.json())
  .then(data => setPosts(data));

}, []);

 // Add a new main post (creates a new thread)
 const addPost = async (title, content) => {
   if (!selectedLocation) {
     alert("Click on the map to select a location first");
     return;
   }
   const response = await fetch("https://lend-a-tool-backend-uily.onrender.com/api/posts", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({

      title,
      content,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    }),
 })
   const savedPost = await response.json();
  setPosts(prev => [savedPost, ...prev])
 };

 // Like a specific main post
 const likePost = async(postId) => {
   const isLiked = likedPosts.has(postID);
   const endpoint = isLiked ? "unlike": "like";
  const response = await fetch(`https://lend-a-tool-backend-uily.onrender.com/api/posts/${postId}/${endpoint}`, {
     method: "PUT",
     headers: {"Content-Type": "application/json"},
   });
   const data = await response.json();
   setPosts(prev => prev.map(p => p.id === postId ? {...p, like_count: data.like_count } : p))
   setLikedPosts(prev => {
    const next = new Set(prev)
    if (isLiked) {
      next.delete(postID);
    } else {
      next.add(postID);
    }
   })
 };

 // Add a reply to a specific main post
 const addReply = async(postId, replyContent) => {
const response = await fetch(`https://lend-a-tool-backend-uily.onrender.com/api/posts/${postId}/reply`, {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({content: replyContent}),

})
const savedReply = await response.json();
  setPosts(
     posts.map((p) => {
       if (p.id === postId) {
         return { ...p, replies: [...p.replies, savedReply.content] };
       }
       return p;
     })
   );
 };


 // Get posts for currently selected location
 const currentThreadPosts = selectedLocation
   ? posts.filter(
       (p) =>
         Math.abs(p.latitude - selectedLocation.lat) < 0.00001 &&
         Math.abs (p.longitude - selectedLocation.lng) < 0.00001
         
     )
   : [];


 return (
  <>
   <nav>
    <img src="LendATool_Logo.png" id="logo" alt = "Lend & Connect" />
    
    
   
    <div className= "texttitle">
      LendATool
    </div>
   </nav>

   <div className="app">
     <div className="map-panel">
       <MapPanel
         posts={posts}
         onSelectLocation={setSelectedLocation}
         selectedLocation={selectedLocation}
       />
     </div>
     <FeedPanel
       posts={currentThreadPosts}
       onAddPost={addPost}
       onAddReply={addReply}
       onLikePost={likePost}
       likedPosts={likedPosts}
       selectedLocation={selectedLocation}
     />
    
   </div>
  </>
 );

}


export default App;