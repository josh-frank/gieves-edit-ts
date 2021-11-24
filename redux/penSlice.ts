import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

import { Coordinates, Shape } from "../types";
import { reflect } from "../utilities";

const generateId = ( length: number ): string => [ ...Array( length ) ].reduce( result => result + "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[ Math.floor( Math.random() * 52 ) ], "" );

interface PenState {
    points: Coordinates[];
    shapes: Shape[];
    activeShape: Shape | null;
}

const initialState = {
    points: [],
    shapes: [],
    activeShape: null
} as PenState;

const penSlice = createSlice( {
    name: "pen",
    initialState,
    reducers: {
        addPoint: ( state, action: PayloadAction<Coordinates> ) => ( { ...state, points: [ ...state.points, action.payload ] } ),
        closePath: state => {
            if ( state.points.length < 5 ) return state;
            return {
                ...state,
                shapes: [ ...state.shapes, {
                    id: generateId( 5 ),
                    points: [
                        ...state.points,
                        { x: reflect( state.points[ 1 ].x, state.points[ 0 ].x ), y: reflect( state.points[ 1 ].y, state.points[ 0 ].y ) },
                        { x: state.points[ 0 ].x, y: state.points[ 0 ].y },
                        { x: state.points[ 0 ].x, y: state.points[ 0 ].y }
                    ]
                } ],
                points: [] 
            };
        },
        clearPoints: ( state ) => ( { ...state, points: [] } ),
        activateShape: ( state, action: PayloadAction<string> ) => {
            const findShapeToActivate = state.shapes.find( ( { id } ) => id === action.payload );
            return findShapeToActivate ? {
                ...state,
                shapes: [ ...( state.activeShape ? [ state.activeShape ] : [] ), ...state.shapes.filter( ( { id } ) => id !== action.payload ) ],
                activeShape: findShapeToActivate
            } : state;
        },
        updateActiveShape: ( state, action: PayloadAction<Coordinates[]> ) => ( {
            ...state,
            activeShape: state.activeShape ? { id: state.activeShape.id, points: action.payload } : null
        } ),
        deactivateShapes: ( state ) => ( {
            ...state,
            shapes: state.activeShape ? [ state.activeShape, ...state.shapes ] : state.shapes,
            activeShape: null
        } )
    }
} );

export const {
    addPoint,
    closePath,
    clearPoints,
    activateShape,
    updateActiveShape,
    deactivateShapes
} = penSlice.actions;

export const selectPoints = ( state: RootState ) => state.pen.points;
export const selectShapes = ( state: RootState ) => state.pen.shapes;
export const selectActiveShape = ( state: RootState ) => state.pen.activeShape;

export default penSlice.reducer;
