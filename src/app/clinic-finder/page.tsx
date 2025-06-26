// 'use client';

// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';

// // Fix for default marker icon in Leaflet + Next.js
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
// });

// type Place = {
//   id: number;
//   lat: number;
//   lon: number;
//   tags: {
//     name?: string;
//     amenity?: string;
//     phone?: string;
//     address?: string;
//     [key: string]: string | undefined;
//   };
// };

// const DEFAULT_CENTER: [number, number] = [19.0760, 72.8777]; // Mumbai as default

// const ClinicFinderPage: React.FC = () => {
//   const [places, setPlaces] = useState<Place[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // You can make these dynamic (e.g., from user location or input)
//   const bbox = [19.0760, 72.8777, 19.2160, 72.9777]; // South, West, North, East

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];
//       (
//         node["amenity"="hospital"](${bbox.join(',')});
//         node["amenity"="clinic"](${bbox.join(',')});
//         node["amenity"="doctors"](${bbox.join(',')});
//       );
//       out;`;

//     fetch(overpassUrl.replace(/\s+/g, ''))
//       .then(res => res.json())
//       .then(data => setPlaces(data.elements || []))
//       .catch(() => setError('Failed to fetch clinic/hospital data.'))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div style={{ padding: 24 }}>
//       <h1>Clinic & Doctor Finder</h1>
//       <p>Showing hospitals, clinics, and doctors in Mumbai (demo area). You can expand this to use user location or search.</p>
//       {loading && <p>Loading map and places...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <div style={{ height: '500px', width: '100%', marginTop: 16 }}>
//         <MapContainer center={DEFAULT_CENTER} zoom={12} style={{ height: '100%', width: '100%' }}>
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
//           {places.map(place => (
//             <Marker key={place.id} position={[place.lat, place.lon]}>
//               <Popup>
//                 <b>{place.tags.name || "Unknown"}</b><br />
//                 {place.tags.amenity}<br />
//                 {place.tags.phone && <>Phone: {place.tags.phone}<br /></>}
//                 {place.tags.address && <>Address: {place.tags.address}<br /></>}
//               </Popup>
//             </Marker>
//           ))}
//         </MapContainer>
//       </div>
//     </div>
//   );
// };

// export default ClinicFinderPage;




'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Search } from 'lucide-react';

type Place = {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    phone?: string;
    address?: string;
    [key: string]: string | undefined;
  };
  distance?: number; // Optional: for sorting by distance
};

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  // Returns distance in km
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const ClinicFinderList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPlaces([]);
    if (!search) return;

    setLoading(true);

    try {
      // 1. Geocode the location
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`);
      const geoData = await geoRes.json();
      if (!geoData[0]) {
        setError('Location not found.');
        setLoading(false);
        return;
      }
      const lat = parseFloat(geoData[0].lat);
      const lon = parseFloat(geoData[0].lon);

      // 2. Query Overpass API for clinics/hospitals/doctors within ~5km radius
      const radius = 5000; // meters
      const overpassQuery = `
        [out:json];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lon});
          node["amenity"="clinic"](around:${radius},${lat},${lon});
          node["amenity"="doctors"](around:${radius},${lat},${lon});
        );
        out;
      `;
      const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
      const overpassRes = await fetch(overpassUrl);
      const overpassData = await overpassRes.json();

      // 3. Sort by distance
      const placesWithDistance = (overpassData.elements || []).map((place: Place) => ({
        ...place,
        distance: haversineDistance(lat, lon, place.lat, place.lon),
      })).sort((a: Place, b: Place) => (a.distance ?? 0) - (b.distance ?? 0));

      setPlaces(placesWithDistance);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

//   return (
//     <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
//       <h1>Find Nearby Clinics & Doctors</h1>
//       <form onSubmit={handleSearch} style={{ marginBottom: 24 }}>
//         <input
//           type="text"
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           placeholder="Enter your city, area, or address"
//           style={{ padding: 8, width: 300, marginRight: 8 }}
//         />
//         <button type="submit" style={{ padding: 8 }}>Search</button>
//       </form>
//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {places.length > 0 && (
//         <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//             gap: '16px'
//             }}>
//             {places.slice(0, 20).map(place => (
//             <div
//                 key={place.id}
//                 style={{
//                 border: '1px solid #ccc',
//                 borderRadius: 8,
//                 padding: 16,
//                 background: '#fafbfc',
//                 boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
//                 }}>

//             <h2 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>
//             {place.tags.name || 'Unknown Name'}
//             </h2>
//             <div style={{ marginBottom: 4 }}>
//                 <b>Type:</b> {place.tags.amenity}
//             </div>
//             {(place.tags['addr:housenumber'] ||
//             place.tags['addr:street'] ||
//             place.tags['addr:city'] ||
//             place.tags['addr:postcode'] ||
//             place.tags['addr:state']) && (
//             <div style={{ marginBottom: 4 }}>
//                 <b>Address:</b>{" "}
//                 {[
//                 place.tags['addr:housenumber'],
//                 place.tags['addr:street'],
//                 place.tags['addr:city'],
//                 place.tags['addr:state'],
//                 place.tags['addr:postcode']
//                 ]
//                 .filter(Boolean)
//                 .join(', ')}
//             </div>
//             )}
//             {place.tags.phone && (
//                 <div style={{ marginBottom: 4 }}>
//                 <b>Phone:</b> {place.tags.phone}
//                 {/* Call button */}
//                 <a href={`tel:${place.tags.phone}`}
//                     style={{
//                     marginLeft: 12,
//                     color: '#0070f3',
//                     textDecoration: 'underline',
//                     fontWeight: 500
//                 }}>
//                 Call
//                 </a>
//                 </div>
//             )}
//             <div>
//             <b>Distance:</b> {place.distance?.toFixed(2)} km
//             </div>

//             {/* Show on Map button */}
//             <div style={{ marginTop: 8 }}>
//             <a href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=18/${place.lat}/${place.lon}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{
//                     color: '#0070f3',
//                     textDecoration: 'underline',
//                     fontWeight: 500
//                 }}> Map
//             </a>
//             </div>

//         </div>
//         ))}
//         </div>
//     )}
//       {!loading && !error && places.length === 0 && (
//         <p>Enter your location to find nearby clinics and doctors.</p>
//       )}
//     </div>
//   );



return (
  <div className="p-6 max-w-3xl mx-auto">
    <br />
    <form
      onSubmit={handleSearch}
      className="mb-8 flex justify-center items-center gap-2"
    >
      <div className="relative w-[340px] flex items-center">
        <Search size={20} className="absolute left-3 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Enter your city, area, or address"
          className="pl-10 pr-3 py-2 w-full rounded-full border border-gray-300 text-base outline-none"
        />
      </div>
      <button
        type="submit"
        className="py-2 px-6 rounded-full bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
    {loading && <p className="text-center">Loading...</p>}
    {error && <p className="text-center text-red-600">{error}</p>}
    {places.length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {places.slice(0, 20).map(place => (
          <div
            key={place.id}
            className="border border-gray-200 rounded-xl p-5 bg-white shadow-md min-h-[180px] flex flex-col justify-between"
          >
            <h2 className="mb-2 text-lg font-semibold flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" />
              {place.tags.name || 'Unknown Name'}
            </h2>
            <div className="mb-1 text-gray-700 flex items-center gap-2">
              <b>Type:</b> {place.tags.amenity}
            </div>
            <div className="mb-1 text-gray-700 flex items-center gap-2">
              <MapPin size={16} />
              {[
                place.tags['addr:housenumber'],
                place.tags['addr:street'],
                place.tags['addr:city'],
                place.tags['addr:state'],
                place.tags['addr:postcode']
              ].filter(Boolean).join(', ') || 'Address not available'}
            </div>
            {place.tags.phone && (
              <div className="mb-1 text-gray-700 flex items-center gap-2">
                <Phone size={16} /> {place.tags.phone}
                <a
                  href={`tel:${place.tags.phone}`}
                  className="ml-3 bg-green-500 text-white px-4 py-1 rounded-md font-medium flex items-center gap-1 hover:bg-green-600 transition"
                >
                  <Phone size={16} /> Call
                </a>
              </div>
            )}
            <div className="text-gray-500 text-sm">
              <b>Distance:</b> {place.distance?.toFixed(2)} km
            </div>
            <div className="mt-3">
              <a
                href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=18/${place.lat}/${place.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-1 rounded-md font-medium inline-flex items-center gap-1 hover:bg-blue-700 transition"
              >
                <MapPin size={16} /> Show on Map
              </a>
            </div>
          </div>
        ))}
      </div>
    )}
    {!loading && !error && places.length === 0 && (
      <div className="text-center mt-12 text-gray-500">
        <p className="text-lg">Enter your location to find nearby clinics and doctors.</p>
      </div>
    )}
  </div>
);



};

export default ClinicFinderList;