import { FunctionComponent, EffectCallback, MutableRefObject, useEffect, useRef } from "react";

import { useAppDispatch as useDispatch, useAppSelector as useSelector } from "../redux/hooks";

import { selectArtboardDimensions, selectDisplayGrid, selectGridInterval, selectOffset, selectZoom, setOffset } from "../redux/artboardSlice";
import { panMode, selectDragDistance } from "../redux/clientSlice";

import styles from "../styles/Home.module.css"
import { Coordinates } from "../types";

const Artboard: FunctionComponent = () => {

    const dispatch = useDispatch();

    const mouseDistance = useSelector( selectDragDistance );
    const isPanMode = useSelector( panMode );

    const { width, height } = useSelector( selectArtboardDimensions );
    const zoom = useSelector( selectZoom );
    const offset = useSelector( selectOffset );
    const displayGrid = useSelector( selectDisplayGrid );
    const gridInterval = useSelector( selectGridInterval );

    const previousMouseDistance: MutableRefObject<Coordinates | null> = useRef( null );

    useEffect( (): ReturnType<EffectCallback> => {
        if ( isPanMode && !mouseDistance && previousMouseDistance.current ) dispatch( setOffset( { x: offset.x + previousMouseDistance.current.x, y: offset.y + previousMouseDistance.current.y } ) );
        return () => { previousMouseDistance.current = mouseDistance };
    }, [ dispatch, isPanMode, offset, mouseDistance ] );

    const horizontalLines = gridLineSpacing( height, gridInterval ).map( line => {
        return <g key={ line }>
            { !!line && <text
                x={ offset.x + ( isPanMode && mouseDistance ? mouseDistance.x : 0 ) }
                y={ ( line * zoom ) + offset.y + ( isPanMode && mouseDistance ? mouseDistance.y : 0 ) }
                fill="lightgray"
                fontFamily="Arial Narrow"
                fontSize={ `${ zoom / 33.3 }px`}
                letterSpacing="-0.2px"
                transform="translate( 0, -0.5 )"
            >
                { line }
            </text> }
            <line
                x1={ offset.x + ( isPanMode && mouseDistance ? mouseDistance.x : 0 ) }
                y1={ ( line * zoom ) + offset.y + ( isPanMode && mouseDistance ? mouseDistance.y : 0 ) }
                x2={ ( width * zoom ) + offset.x + ( isPanMode && mouseDistance ? mouseDistance.x : 0 ) }
                y2={ ( line * zoom ) + offset.y + ( isPanMode && mouseDistance ? mouseDistance.y : 0 ) }
                stroke="lightgray"
                strokeWidth="0.5"
            />
        </g>;
    } );

    const verticalLines = gridLineSpacing( width, gridInterval ).map( line => {
        return <g key={ line }>
            { !!line && line < width && <text
                x={ ( ( zoom / 75 ) + line * zoom ) + offset.x + ( isPanMode && mouseDistance ? mouseDistance.x : 0 ) }
                y={ offset.y + ( isPanMode && mouseDistance ? mouseDistance.y : 0 ) }
                fill="lightgray"
                writingMode="vertical-rl"
                fontFamily="Arial Narrow"
                fontSize={ `${ zoom / 33.3 }px`}
                letterSpacing="-0.2px"
                transform="translate( 2 )"
            >
                { line }
            </text> }
            <line
                x1={ ( line * zoom ) + offset.x + ( isPanMode && mouseDistance ? mouseDistance.x : 0 ) }
                y1={ offset.y + ( isPanMode && mouseDistance ? mouseDistance.y : 0 ) }
                x2={ ( line * zoom ) + offset.x + ( isPanMode && mouseDistance ? mouseDistance.x : 0 ) }
                y2={ ( height * zoom ) + offset.y + ( isPanMode && mouseDistance ? mouseDistance.y : 0 ) }
                stroke="lightgray"
                strokeWidth="0.5"
            />
        </g>;
    } );

    return (
        <g>
            { displayGrid && horizontalLines }
            { displayGrid && verticalLines }
            <rect
                className={ styles.artboard }
                x={ offset.x + ( isPanMode && mouseDistance ? mouseDistance.x : 0 ) }
                y={ offset.y + ( isPanMode && mouseDistance ? mouseDistance.y : 0 ) }
                width={ width * zoom }
                height={ height * zoom }
                stroke={ displayGrid ? "none" : "lightgray" }
                fill="none"
            />
        </g>
    );

};

export default Artboard;

const gridLineSpacing = ( range: number, interval: number ): number[] => [ ...Array( Math.floor( range / interval ) + 1 ).keys() ].map( i => i * interval );
