import { useState,useEffect } from "react";
import "./App.css";
import MapPanel from "./components/MapPanel";
import FeedPanel from "./components/FeedPanel";


function App() {
 const [posts, setPosts] = useState([]); // array of thread posts with replies
 const [selectedLocation, setSelectedLocation] = useState(null);
 
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
   const response = await fetch(`https://lend-a-tool-backend-uily.onrender.com/api/posts/${postId}/like`, {
     method: "PUT",
     headers: {"Content-Type": "application/json"},
   });
   const likedPost = await response.json();
   setPosts(
     posts.map((p) => {
       if (p.id === postId) {
         return { ...p, like_count: likedPost.like_count };
       }
       return p;
     })
   );
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
         p.latitude === selectedLocation.lat &&
         p.longitude === selectedLocation.lng
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
       selectedLocation={selectedLocation}
     />
    
   </div>
  </>
 );

}


export default App;