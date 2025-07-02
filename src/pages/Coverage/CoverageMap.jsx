import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import coverageData from '../../assets/warehouses.json';
import { useRef, useState } from 'react';

// Fix icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const defaultCenter = [23.685, 90.3563]; // Bangladesh center

// Helper component to control map programmatically
const FlyToDistrict = ({ position }) => {
    const map = useMap();
    if (position) {
        map.flyTo(position, 10); // Zoom in on the marker
    }
    return null;
};

const CoverageMap = () => {
    const [search, setSearch] = useState('');
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [popupIdx, setPopupIdx] = useState(null);
    const markerRefs = useRef([]);

    const handleSearch = (e) => {
        e.preventDefault();
        const input = search.trim().toLowerCase();

        // Find the district by partial or full match
        const foundIndex = coverageData.findIndex((item) =>
            item.district.toLowerCase().includes(input)
        );

        if (foundIndex !== -1) {
            const district = coverageData[foundIndex];
            setSelectedPosition([district.latitude, district.longitude]);
            setPopupIdx(foundIndex);

            // Open the popup of the marker
            setTimeout(() => {
                if (markerRefs.current[foundIndex]) {
                    markerRefs.current[foundIndex].openPopup();
                }
            }, 300);
        } else {
            alert('District not found');
        }
    };

    return (
        <div>
            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex justify-center mb-4">
                <input
                    type="text"
                    placeholder="Search district name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-bordered w-full max-w-md mr-2"
                />
                <button type="submit" className="btn btn-primary">Search</button>
            </form>

            {/* Map */}
            <div className="h-[500px] w-full rounded-lg overflow-hidden shadow">
                <MapContainer center={defaultCenter} zoom={7} scrollWheelZoom={true} className="h-full w-full">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />

                    {/* Fly to marker when selected */}
                    {selectedPosition && <FlyToDistrict position={selectedPosition} />}

                    {/* All District Markers */}
                    {coverageData.map((district, idx) => (
                        <Marker
                            key={idx}
                            position={[district.latitude, district.longitude]}
                            ref={(ref) => (markerRefs.current[idx] = ref)}
                        >
                            <Popup>
                                <h3 className="font-bold">{district.district}</h3>
                                <p className="text-sm text-gray-700">
                                    <strong>City:</strong> {district.city}<br />
                                    <strong>Covered Areas:</strong> {district.covered_area.join(', ')}
                                </p>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default CoverageMap;
