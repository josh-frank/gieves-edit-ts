import { Coordinates } from "./types";

export const reflect = ( mouseDown: number, mouseCurrent: number ): number => mouseCurrent + ( mouseCurrent - mouseDown );

export const toPath = ( points: Coordinates[], closePath: boolean = false ): string => `M ${ points[ 0 ]?.x } ${ points[ 0 ]?.y }` + points?.slice( 1, points.length - 1 ).reduce( ( path, point, index ) => `${ path } ${ index % 3 ? "" : "C " }${ point.x } ${ point.y }`, "" ) + ( closePath ? " Z" : "" );

export const vectorAddition = ( theseCoordinates: Coordinates, thoseCoordinates: Coordinates ): Coordinates => ( { x: theseCoordinates.x + thoseCoordinates.x, y: theseCoordinates.y + thoseCoordinates.y } );

export const vectorEquality = ( theseCoordinates: Coordinates, thoseCoordinates: Coordinates ): boolean => theseCoordinates.x === thoseCoordinates.x && theseCoordinates.y === thoseCoordinates.y;

export const vectorMidpoint = ( theseCoordinates: Coordinates, thoseCoordinates: Coordinates ): Coordinates => ( { x: ( theseCoordinates.x + thoseCoordinates.x ) / 2, y: ( theseCoordinates.y + thoseCoordinates.y ) / 2 } );
