import React from "react";
import { useLeafletContext } from "@react-leaflet/core";
import { useEffect } from "react";
import * as L from "leaflet";

const LeafletGrid = ({position, setPosition, interacted}) => {
    const context = useLeafletContext();
    const container = context.map;
    const tileSize = 1; // Change this value to your desired tile size in degrees
    
    const changePosition = (latlng) => {
        setPosition(latlng);
    }
   

    React.useEffect(() => {
        if(interacted) {
            highlightTile({lat:position[0],lng:position[1]}, false);
        }
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

    tiles.addTo(container);

    // Event listener for map click
    container.on('click', (event) => {
        highlightTile(event.latlng, true);
    });

    highlightTile = (latlng, changeLocation) => {
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

        
        console.log("Middle point: " + (gridY + tileSize / 2) + ", " + (gridX + tileSize / 2));

        if(changeLocation) {
            // container.panTo(new L.LatLng(gridY + tileSize / 2, gridX + tileSize / 2));
            document.location.search = '?position=' + [gridY + tileSize / 2, gridX + tileSize / 2].join(',');
        }
    }

    return <></>;
};

export default LeafletGrid;
