import { useState, memo } from 'react';
import Map from 'react-map-gl';
// @mui
import { Box, Typography, styled } from '@mui/material';
// components
import Image from 'src/components/image';
import { MapPopup, MapMarker, MapControl, MapBoxProps } from 'src/components/map';

// ----------------------------------------------------------------------
const StyledMapContainer = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 560,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));

type CountryProps = {
  name: string;
  photo: string;
  capital: string;
  latlng: number[];
  timezones: string[];
  country_code: string;
};

function MapMarkersPopups() {
  const [popupInfo, setPopupInfo] = useState<CountryProps | null>(null);

  return (
    <StyledMapContainer>
      <Map
        minZoom={1}
        initialViewState={{
          zoom: 2,
        }}
      >
        <MapControl />

        <MapMarker
          key="marker"
          latitude={10.804833}
          longitude={106.716751}
          // onClick={(event) => {
          //   event.originalEvent.stopPropagation();
          //   setPopupInfo(city);
          // }}
        />

        {popupInfo && (
          <MapPopup latitude={10.804833} longitude={106.716751} onClose={() => setPopupInfo(null)}>
            <Box sx={{ color: 'common.white' }}>
              <Box
                sx={{
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    height: '18px',
                    minWidth: '28px',
                    marginRight: '8px',
                    borderRadius: '4px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: `url(https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/${popupInfo.country_code.toLowerCase()}.svg)`,
                  }}
                />
                <Typography variant="subtitle2">{popupInfo.name}</Typography>
              </Box>

              <Typography component="div" variant="caption">
                Timezones: {popupInfo.timezones}
              </Typography>

              <Typography component="div" variant="caption">
                Lat: {popupInfo.latlng[0]}
              </Typography>

              <Typography component="div" variant="caption">
                Long: {popupInfo.latlng[1]}
              </Typography>

              <Image
                alt={popupInfo.name}
                src={popupInfo.photo}
                ratio="4/3"
                sx={{ mt: 1, borderRadius: 1 }}
              />
            </Box>
          </MapPopup>
        )}
      </Map>
    </StyledMapContainer>
  );
}

export default memo(MapMarkersPopups);
