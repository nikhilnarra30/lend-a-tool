import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
 iconRetinaUrl:
   "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
 iconUrl:
   "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
 shadowUrl:
   "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationPicker({ onSelect }) {
 useMapEvents({
   click(e) {
     onSelect(e.latlng); // select new location
   },
 });


 return null;
}

export default function MapPanel({ posts, onSelectLocation, selectedLocation }) {
 return (
   <MapContainer center={[36.7783, -119.4179]} zoom={6} style={{ height: "100%", width: "100%", flex: 1, minHeight: 0 }}>
     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
     <LocationPicker onSelect={onSelectLocation} />


     {/* Render markers for all posts */}
     {posts.map((post) => (
       <Marker
         key={post.id}
         position={[post.latitude, post.longitude]}
         eventHandlers={{
           click: () => {
             onSelectLocation({ lat: post.latitude, lng: post.longitude });
           },
         }}
       >
         <Popup>
           <strong>{post.title}</strong>
           <p>{post.content}</p>
         </Popup>
       </Marker>
     ))}


     {/* Selected location marker (pending post) */}
     {selectedLocation && (
       <Marker position={[selectedLocation.lat, selectedLocation.lng]} opacity={0.5}>
         <Popup>Click the feed panel to type your message</Popup>
       </Marker>
     )}
   </MapContainer>
 );
}




