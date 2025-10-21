import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { DIVE_SITES, MAURITIUS_CENTER } from '../../data/diveSites';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to fly to selected marker
function ChangeMapView({ coords }) {
  const map = useMap();
  if (coords) {
    map.flyTo(coords, 13, { duration: 1.5 });
  }
  return null;
}

ChangeMapView.propTypes = {
  coords: PropTypes.arrayOf(PropTypes.number),
};

const DiveMap = ({ selectedSite, onMarkerClick }) => {
  return (
    <div className="h-[500px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={MAURITIUS_CENTER}
        zoom={10}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {DIVE_SITES.map((site) => (
          <Marker
            key={site.id}
            position={site.coordinates}
            eventHandlers={{
              click: () => onMarkerClick(site),
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg text-ocean-800 mb-2">{site.name}</h3>
                <p className="text-sm text-gray-700 mb-2">{site.description}</p>
                <div className="text-xs text-gray-600">
                  <p>
                    <strong>Depth:</strong> {site.depth}
                  </p>
                  <p>
                    <strong>Difficulty:</strong> {site.difficulty}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <ChangeMapView coords={selectedSite?.coordinates} />
      </MapContainer>
    </div>
  );
};

DiveMap.propTypes = {
  selectedSite: PropTypes.shape({
    id: PropTypes.string.isRequired,
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
  }),
  onMarkerClick: PropTypes.func.isRequired,
};

export default DiveMap;
