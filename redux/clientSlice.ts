import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Coordinates, Dimensions, MouseDown } from "../types";
import { RootState } from "./store";

interface ClientState {
    dimensions: Dimensions,
    mouse: Coordinates,
    mouseDown: MouseDown | null,
}

const initialState = {} as ClientState;

const clientSlice = createSlice( {
    name: "client",
    initialState,
    reducers: {
        setClientDimensions: ( state, action: PayloadAction<Dimensions> ) => ( { ...state, dimensions: action.payload } ),
        setMouse: ( state, action: PayloadAction<Coordinates> ) => ( { ...state, mouse: action.payload } ),
        setMouseDown: ( state, action: PayloadAction<MouseDown> ) => ( { ...state, mouseDown: action.payload } ),
        setMouseUp: ( state ) => ( { ...state, mouseDown: null } )
    }
} );

export const {
    setClientDimensions,
    setMouse,
    setMouseDown,
    setMouseUp
} = clientSlice.actions;

export const selectClientDimensions = ( state: RootState ) => state.client.dimensions;
export const selectMouse = ( state: RootState ) => state.client.mouse;
export const selectMouseDown = ( state: RootState ) => state.client.mouseDown;
export const selectDragDistance = ( state: RootState ) => state.client.mouseDown ? { x: state.client.mouse.x - state.client.mouseDown.coordinates.x, y: state.client.mouse.y - state.client.mouseDown.coordinates.y } : null;

export default clientSlice.reducer;
