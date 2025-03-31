import React, {useEffect, useRef, useState} from "react";
import {Stop, StopDetails, StopDetailsBus} from "../types";
import {Marker} from "react-leaflet";
import L, {divIcon, point} from "leaflet";
import {renderToStaticMarkup} from "react-dom/server";
import {getStopDetails} from "./filterStopDetails";
import axios from "axios";

const stopIcon = divIcon({
    html: `<span>1</span>`,
    className: "stop-icon",
    iconSize: point(15, 15, true),
});

const StopPopup = ({stop, stopInfo}: { stop: Stop, stopInfo: StopDetails | null }) => {
    return (
        <div>
            <div style={{textAlign: "center", fontWeight: 600}}>
                {stop.city} {stop.name} ({stop.id})
            </div>
            {stopInfo && stopInfo?.id === stop.id && (
                <div>
                    {stopInfo?.buses.map((bus: StopDetailsBus, i: number) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 5,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    columnGap: "5px",
                                }}
                            >
                                <div style={{width: "32px", textAlign: "center"}}>
                                    {bus.line}
                                </div>
                                <div>{bus.destination}</div>
                            </div>
                            <div>{bus.time}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
};


const StopMarker = ({stop, stopsDetails}: { stop: Stop, stopsDetails: Record<string, StopDetails> }) => {
    const markerRef = useRef<L.Marker>(null);

    const getStopInfoHandler = async () => {
        const stopInfo = getStopDetails(stop.id, stopsDetails)
        const content = renderToStaticMarkup(<StopPopup stop={stop} stopInfo={stopInfo}/>);
        markerRef.current?.unbindPopup();
        const popup = new L.Popup({}).setContent(content);
        markerRef.current?.bindPopup(popup).openPopup();
    }

    return (
        <Marker
            key={stop.id}
            position={[stop.lat, stop.lon]}
            icon={stopIcon}
            ref={markerRef}
            eventHandlers={{click: getStopInfoHandler}}
        />
    );
}

function StopsContainer() {
    const [stops, setStops] = useState<Stop[]>([]);
    const [stopsDetails, setStopsDetails] = useState<Record<string, StopDetails> | null>(null);

    useEffect(() => {
        axios
            .get(`${window.location.href}res/data/stops.json`)
            .then((res) => setStops(res.data))
            .catch(console.error);

        axios
            .get(`${window.location.href}res/data/stop_details.json`)
            .then((res) => setStopsDetails(res.data))
            .catch(console.error);
    }, [])

    return stops.map((stop) => (
        <StopMarker
            key={stop.id}
            stop={stop}
            stopsDetails={stopsDetails!}
        />
    ));
}

StopsContainer.displayName = 'StopsContainer';

export default StopsContainer;
