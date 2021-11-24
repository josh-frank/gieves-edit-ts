import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { createSelector } from 'reselect'

import { Coordinates, Dimensions } from "../types";

import { RootState } from "./store";

interface ArtboardState {
    dimensions: Dimensions,
    zoom: number,
    offset: Coordinates,
    displayGrid: boolean,
    snapToGrid: boolean,
    gridInterval: number,
    darkMode: boolean
}

const initialState = {
        dimensions: { width: 0, height: 0 },
        zoom: 1,
        offset: { x: 0, y: 0 },
        displayGrid: true,
        snapToGrid: false,
        gridInterval: 10,
        darkMode: false
    } as ArtboardState;

const artboardSlice = createSlice( {
    name: "artboard",
    initialState,
    reducers: {
        setArtboardDimensions: ( state, action: PayloadAction<Dimensions> ) => ( { ...state, dimensions: action.payload } ),
        setZoom: ( state, action: PayloadAction<number> ) => ( { ...state, zoom: action.payload } ),
        zoomIn: ( state ) => ( { ...state, zoom: Math.min( state.zoom + 6.25, 625 ) } ),
        zoomOut: ( state ) => ( { ...state, zoom: Math.max( state.zoom - 6.25, 6.25 ) } ),
        setOffset: ( state, action: PayloadAction<Coordinates> ) => ( { ...state, offset: action.payload } ),
        moveOffset: ( state, action: PayloadAction<Coordinates> ) => ( { ...state, offset: { x: state.offset.x - action.payload.x, y: state.offset.y - action.payload.y } } ),
        toggleGridDisplay: ( state ) => ( { ...state, displayGrid: !state.displayGrid } ),
        toggleSnapToGrid: ( state ) => ( { ...state, snapToGrid: !state.snapToGrid } ),
        setGridInterval: ( state, action: PayloadAction<number> ) => ( { ...state, gridInterval: action.payload } ),
        toggleDarkMode: ( state ) => ( { ...state, darkMode: !state.darkMode } ),
    }
} );

export const {
    setArtboardDimensions,
    setZoom,
    zoomIn,
    zoomOut,
    setOffset,
    moveOffset,
    toggleGridDisplay,
    toggleSnapToGrid,
    setGridInterval,
    toggleDarkMode,
} = artboardSlice.actions;

export const selectArtboardDimensions = ( state: RootState ) => state.artboard.dimensions;
export const selectZoom = ( state: RootState ) => state.artboard.zoom;
export const selectOffset = ( state: RootState ) => state.artboard.offset;
export const selectDisplayGrid = ( state: RootState ) => state.artboard.displayGrid;
export const selectSnapToGrid = ( state: RootState ) => state.artboard.snapToGrid;
export const selectGridInterval = ( state: RootState ) => state.artboard.gridInterval;
export const selectDarkMode = ( state: RootState ) => state.artboard.darkMode;

export const unapplyScale = createSelector( selectZoom, ( zoom ) => ( coordinates: Coordinates ): Coordinates => ( { x: coordinates.x * zoom, y: coordinates.y * zoom } ) );
export const unapplyOffset = createSelector( selectOffset, ( offset ) => ( coordinates: Coordinates ): Coordinates => ( { x: coordinates.x - offset.x, y: coordinates.y - offset.y } ) );
export const applyScaleAndOffset = createSelector( selectZoom, selectOffset, ( zoom, offset ) => ( coordinates: Coordinates ): Coordinates => ( { x: ( coordinates.x - offset.x ) / zoom * 100, y: ( coordinates.y - offset.y ) / zoom * 100 } ) );
export const unapplyScaleAndOffset = createSelector( selectZoom, selectOffset, ( zoom, offset ) => ( coordinates: Coordinates ): Coordinates => ( { x: offset.x + coordinates.x * zoom, y: offset.y + coordinates.y * zoom } ) );

export default artboardSlice.reducer;
