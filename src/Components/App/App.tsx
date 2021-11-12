import * as React from 'react';
import './App.scss';
import MojaveWastelandMap from 'Components/MojaveWastelandMap/MojaveWastelandMap';
import SettingsPanel from 'Components/SettingsPanel/SettingsPanel';
import packageJson from './../../../package.json';
import type {
    MarkerInterface,
    MarkerType,
} from 'types';
import type * as L from 'leaflet';
import {
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
} from '@chakra-ui/react';
import { useMedia } from 'react-use';
import {
    selectMarkers,
} from 'Slices/appSlice';
import {
    useAppSelector,
} from 'hooks';

const App = (): JSX.Element => {

    const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = React.useState(false);

    const markers = useAppSelector(selectMarkers);

    const markersRef = React.useRef<{
        [index: string]: L.Marker;
    }>({});

    const isLargeScreen = useMedia('(min-width: 1024px)');

    const handleTypeClick = (type: MarkerType) => (): void => { // eslint-disable-line @typescript-eslint/no-unused-vars

        handleSettingsDrawerClose();

    };

    const handleShowAllClick = (): void => {

        handleSettingsDrawerClose();

    };

    const handleMapCreation = (map: L.Map): void => {

        map.on('click', (event: L.LeafletMouseEvent) => {
            // Allow figuring out what lat + lng we are clicking.
            if ((window as any).debug === true) { // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
                console.log(event.latlng);
            }
        });

    };

    const handleMarkerTitleClick = (markerData: MarkerInterface = {}) => (): void => {

        const marker = markerData.id && markersRef.current[markerData.id] || null;

        if (marker && markerData.lat && markerData.lng) {
            // Open the popup of the marker.
            marker.openPopup([markerData.lat, markerData.lng]);
        }

        handleSettingsDrawerClose();

    };

    /**
     * When a marker is added to the map, add it to our markers property for use
     * with handleMarkerTitleClick.
     */
    const handleMarkerAdd = (event: L.LeafletEvent): void => {

        const marker = event.target as L.Marker;

        const markerLatLng = marker.getLatLng();

        const lat = markerLatLng.lat;
        const lng = markerLatLng.lng;

        const markerData: MarkerInterface | undefined = markers && markers.find((item) => item.lat === lat && item.lng === lng);

        if (markerData && markerData.id) {
            markersRef.current[markerData.id] = marker;
        }

    };

    const handleOpenSettingsClick = (): void => {

        setIsSettingsDrawerOpen(true);

    };

    const handleSettingsDrawerClose = (): void => {

        setIsSettingsDrawerOpen(false);

    };

    const AppSettingsPanel = (): JSX.Element => { // eslint-disable-line react/no-multi-comp

        return (
            <SettingsPanel
                appVersion={packageJson.version}
                className="app__settings-panel"
                onTypeClick={handleTypeClick}
                onShowAllClick={handleShowAllClick}
                onMarkerTitleClick={handleMarkerTitleClick}
                isLargeScreen={isLargeScreen}
            />
        );

    };

    return (

        <div
            className="app"
        >

            {isLargeScreen ? (

                <AppSettingsPanel />

            ) : (

                <div
                    className="app__small-screen-settings-button-container"
                >

                    <Button
                        className="app__small-screen-settings-button"
                        onClick={handleOpenSettingsClick}
                        colorScheme="teal"
                    >
                        Open Settings
                    </Button>

                </div>

            )}

            {/* Drawer for small screens */}
            <Drawer
                isOpen={isSettingsDrawerOpen}
                placement="bottom"
                onClose={handleSettingsDrawerClose}
                size="full"
            >

                <DrawerOverlay />

                <DrawerContent>

                    <DrawerCloseButton
                        zIndex="1"
                    />

                    <DrawerBody
                        paddingX="2"
                    >

                        <AppSettingsPanel />

                    </DrawerBody>

                </DrawerContent>

            </Drawer>

            <MojaveWastelandMap
                className="app__mojave-wasteland-map"
                onMapCreation={handleMapCreation}
                onMarkerAdd={handleMarkerAdd}
            />

        </div>

    );

};

export default App;
