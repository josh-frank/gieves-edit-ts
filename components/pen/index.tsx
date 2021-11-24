import { FunctionComponent, useEffect, useRef } from "react"

import { useAppDispatch as useDispatch, useAppSelector as useSelector } from "../../redux/hooks";
import { applyScaleAndOffset, unapplyScaleAndOffset } from "../../redux/artboardSlice";
import { panMode, selectDragDistance, selectMouse, selectMouseDown } from "../../redux/clientSlice";
import { addPoint, closePath, selectPoints } from "../../redux/penSlice";

import { reflect, toPath, vectorAddition } from "../../utilities";
import { Coordinates, MouseDown } from "../../types";
import ClosePathButton from "./closePathButton";

const Pen: FunctionComponent = () => {

    const dispatch = useDispatch();

    const mouse = useSelector( selectMouse );
    const mouseDown = useSelector( selectMouseDown );
    const mouseDistance = useSelector( selectDragDistance );
    const isPanMode = useSelector( panMode );

    const scaleAndOffset = useSelector( applyScaleAndOffset );
    const unscaleAndUnoffset = useSelector( unapplyScaleAndOffset );

    const points = useSelector( selectPoints );

    const scaledAndOffsetPoints = points.map( scaleAndOffset );

    const previousMouse = useRef<Coordinates>();
    const previousMouseDown = useRef<MouseDown | null>();

    useEffect( () => {
        if ( !isPanMode && !mouseDown && previousMouse.current && previousMouseDown.current && previousMouseDown.current.dataset.name !== "close-path" && !previousMouseDown.current.dataset.shapeId && !previousMouseDown.current.dataset.pointIndex ) {
            if ( points.length ) dispatch( addPoint( unscaleAndUnoffset( {
                x: reflect( previousMouse.current.x, previousMouseDown.current.coordinates.x ),
                y: reflect( previousMouse.current.y, previousMouseDown.current.coordinates.y )
            } ) ) );
            dispatch( addPoint( unscaleAndUnoffset( previousMouseDown.current.coordinates ) ) );
            dispatch( addPoint( unscaleAndUnoffset( previousMouse.current ) ) );
        }
        return () => {
            previousMouse.current = mouse;
            previousMouseDown.current = mouseDown;
        };
    }, [ dispatch, isPanMode, mouse, mouseDown, points, unscaleAndUnoffset ] );

    return (
        <g>

            { !isPanMode && mouseDown && !mouseDown.dataset.shapeId && <>
                { points?.length && <circle cx={ reflect( mouse.x, mouseDown.coordinates.x ) } cy={ reflect( mouse.y, mouseDown.coordinates.y ) } r="5" fill="#f00" /> }
                <circle cx={ mouse.x } cy={ mouse.y } r="5" fill="#f00" />
                <line
                    x1={ mouse.x }
                    y1={ mouse.y }
                    x2={ points?.length ? reflect( mouse.x, mouseDown.coordinates.x ) : mouseDown.coordinates.x }
                    y2={ points?.length ? reflect( mouse.y, mouseDown.coordinates.y ) : mouseDown.coordinates.y }
                    stroke="#f00"
                />
                <circle
                    cx={ mouseDown.coordinates.x }
                    cy={ mouseDown.coordinates.y }
                    r={ points?.length ? "5" : "7" }
                    fill={ points?.length ? "#f00" : "white" }
                    stroke={ points?.length ? "none" : "#f00" }
                />
            </> }

            { scaledAndOffsetPoints?.length && <g>
                <path d={ toPath( scaledAndOffsetPoints.map( point => mouseDistance && isPanMode ? vectorAddition( point, mouseDistance ) : point ) ) } stroke="black" fill="none" />
                <g>
                    <circle cx={ scaledAndOffsetPoints[ 1 ]?.x + ( mouseDistance && isPanMode ? mouseDistance.x : 0 ) } cy={ scaledAndOffsetPoints[ 1 ]?.y + ( mouseDistance && isPanMode ? mouseDistance.y : 0 ) } r="5" fill="#f00" />
                    <line
                        x1={ scaledAndOffsetPoints[ 0 ]?.x + ( mouseDistance && isPanMode ? mouseDistance.x : 0 ) }
                        y1={ scaledAndOffsetPoints[ 0 ]?.y + ( mouseDistance && isPanMode ? mouseDistance.y : 0 ) }
                        x2={ scaledAndOffsetPoints[ 1 ]?.x + ( mouseDistance && isPanMode ? mouseDistance.x : 0 ) }
                        y2={ scaledAndOffsetPoints[ 1 ]?.y + ( mouseDistance && isPanMode ? mouseDistance.y : 0 ) }
                        stroke="#f00"
                    />
                    { [ ...Array( scaledAndOffsetPoints.length ) ].reduce( ( result, _, index ) => !( ( index - 2 ) % 3 ) ? [ ...result, index ] : result, [] ).map( ( pointIndex: number ): JSX.Element => <g key={ pointIndex }>
                        <circle cx={ scaledAndOffsetPoints[ pointIndex ]?.x + ( mouseDistance && isPanMode ? mouseDistance.x : 0 ) } cy={ scaledAndOffsetPoints[ pointIndex ]?.y + ( mouseDistance && isPanMode ? mouseDistance.y : 0 ) } r="5" fill="#f00" />
                        <circle cx={ scaledAndOffsetPoints[ pointIndex + 1 ]?.x + ( mouseDistance && isPanMode ? mouseDistance.x : 0 ) } cy={ scaledAndOffsetPoints[ pointIndex + 1 ]?.y + ( mouseDistance && isPanMode ? mouseDistance.y : 0 ) } r="5" fill="#f00" />
                        <circle cx={ scaledAndOffsetPoints[ pointIndex + 2 ]?.x + ( mouseDistance && isPanMode ? mouseDistance.x : 0 ) } cy={ scaledAndOffsetPoints[ pointIndex + 2 ]?.y + ( mouseDistance && isPanMode ? mouseDistance.y : 0 ) } r="5" fill="#f00" />
                        <line
                            x1={ scaledAndOffsetPoints[ pointIndex ]?.x + ( mouseDistance && isPanMode ? mouseDistance.x : 0 ) }
                            y1={ scaledAndOffsetPoints[ pointIndex ]?.y + ( mouseDistance && isPanMode ? mouseDistance.y : 0 ) }
                            x2={ scaledAndOffsetPoints[ pointIndex + 2 ]?.x + ( mouseDistance && isPanMode ? mouseDistance.x : 0 ) }
                            y2={ scaledAndOffsetPoints[ pointIndex + 2 ]?.y + ( mouseDistance && isPanMode ? mouseDistance.y : 0 ) }
                            stroke="#f00"
                        />
                    </g> ) }
                    <ClosePathButton
                        cx={ scaledAndOffsetPoints[ 0 ]?.x + ( mouseDistance && isPanMode ? mouseDistance.x : 0 ) }
                        cy={ scaledAndOffsetPoints[ 0 ]?.y + ( mouseDistance && isPanMode ? mouseDistance.y : 0 ) }
                        closePath={ () => dispatch( closePath() ) }
                    />
                </g>
            </g> }

        </g>
    );
    
};

export default Pen;
