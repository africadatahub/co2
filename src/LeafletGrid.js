import { useEffect, useContext, useState } from "react";
import { AppContext } from "./AppContext";

import axios from "axios";


import { useLeafletContext } from "@react-leaflet/core";
import * as L from "leaflet";

const LeafletGrid = () => {

    const { position, setPosition, findAddress, throttledFindAddress, setCity, setCountry } = useContext(AppContext);

    const [drawn, setDrawn] = useState(false);
    const context = useLeafletContext();
    const container = context.map;
    const tileSize = 1; 
    let lastClickTime = 0;
    const throttleTime = 2000; 

    useEffect(() => {
        
        highlightTile({lat:position[0],lng:position[1]}, false);
        
    }, [position]);

    
    var tiles = new L.GridLayer();
    tiles.setZIndex(10000);
    tiles.setOpacity(1);
    tiles.createTile = function (coords) {
        var tile = L.DomUtil.create("canvas", "leaflet-tile");
        var ctx = tile.getContext("2d");
        var size = this.getTileSize();
        tile.width = size.x;
        tile.height = size.y;

        // Calculate longitude and latitude bounds for the current tile
        var bounds = this._tileCoordsToBounds(coords);
        var tileBounds = [
            Math.floor(bounds.getSouth() / tileSize) * tileSize,
            Math.ceil(bounds.getNorth() / tileSize) * tileSize,
            Math.floor(bounds.getWest() / tileSize) * tileSize,
            Math.ceil(bounds.getEast() / tileSize) * tileSize
        ];

        // Draw grid lines at 1-degree intervals
        ctx.strokeStyle = "rgb(255, 122, 0, 0.2)";
        ctx.beginPath();

        for (var x = tileBounds[2]; x <= tileBounds[3]; x += tileSize) {
            var xPixel = Math.floor((x - bounds.getWest()) / (bounds.getEast() - bounds.getWest()) * size.x);
            ctx.moveTo(xPixel, 0);
            ctx.lineTo(xPixel, size.y);
        }

        for (var y = tileBounds[0]; y <= tileBounds[1]; y += tileSize) {
            var yPixel = Math.floor((bounds.getNorth() - y) / (bounds.getNorth() - bounds.getSouth()) * size.y);
            ctx.moveTo(0, yPixel);
            ctx.lineTo(size.x, yPixel);
        }

        ctx.stroke();

        return tile;
    };

    if(!drawn) {
        tiles.addTo(container);
        setDrawn(true);
    }

    useEffect(() => {
        container.on('click', (event) => {
            const now = new Date().getTime();
            if(now - lastClickTime > throttleTime) {
                lastClickTime = now;
                highlightTile(event.latlng, true);
            }
        });
    }, [container]);
    

    const highlightTile = (latlng, clicked) => {

        var clickedLatLng = latlng;

        // Calculate the grid square corresponding to the clicked point
        var gridX = Math.floor(clickedLatLng.lng / tileSize) * tileSize;
        var gridY = Math.floor(clickedLatLng.lat / tileSize) * tileSize;

        // remove all rectangles
        container.eachLayer(function (layer) {
            if (layer instanceof L.Rectangle) {
                container.removeLayer(layer);
            }
        });

        // Highlight the grid square
        var bounds = L.latLngBounds([[gridY, gridX], [gridY + tileSize, gridX + tileSize]]);

        L.rectangle(bounds, { color: 'rgb(255, 122, 0, 1)', weight: 2 }).addTo(container);

        let middlePoint = [gridY + tileSize / 2, gridX + tileSize / 2];
 
        if(clicked) {
            window.history.pushState(
                {}, 
                '', 
                window.location.pathname + '?position=' + [gridY + tileSize / 2, gridX + tileSize / 2].join(',')
            );

            // TODO: position can be a string so we need to check if it's a string or a latlng
            // if it's a string, we need to get the latlng from the string

            findAddress(middlePoint);
            
        }
            
       
    }

    return <></>;
};

export default LeafletGrid;
