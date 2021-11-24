import { useState } from "react";
import { useAppDispatch as useDispatch, useAppSelector as useSelector } from "../../redux/hooks";
import { applyScaleAndOffset, unapplyScale } from "../../redux/artboardSlice";
import { panMode, selectDragDistance } from "../../redux/clientSlice";
import { activateShape, deactivateShapes, selectActiveShape } from "../../redux/penSlice";

import { Shape as ShapeType } from "../../types";

import { vectorAddition, toPath } from "../../utilities";
import ShapePoint from "./shapePoint";

interface ShapeProps {
    shape: ShapeType;
}

const Shape = ( { shape }: ShapeProps ): JSX.Element => {
    
    const dispatch = useDispatch();

    const mouseDistance = useSelector( selectDragDistance );

    const activeShape = useSelector( selectActiveShape );

    const scaleAndOffset = useSelector( applyScaleAndOffset );

    const isPanMode = useSelector( panMode );

    const isActive = shape.id === activeShape?.id;

    const [ hovering, setHovering ] = useState( false );

    const scaledShapePoints = shape.points.map( scaleAndOffset );

    return (
        <g>

            <path
                data-name="shape"
                data-shape-id={ shape.id }
                d={ toPath( mouseDistance && isPanMode ? scaledShapePoints.map( point => vectorAddition( point, mouseDistance ) ) : scaledShapePoints, true ) }
                stroke={ isActive || hovering ? "red" : "black" }
                fill="white"
                onMouseEnter={ () => setHovering( true ) }
                onMouseLeave={ () => setHovering( false ) }
                onClick={ () => dispatch( isActive ? deactivateShapes() : activateShape( shape.id ) ) }
            />

            { isActive && (
                <g>
                    <line
                        x1={ scaledShapePoints[ 0 ]?.x + ( mouseDistance && isPanMode ? mouseDistance.x : 0 ) }
                        y1={ scaledShapePoints[ 0 ]?.y + ( mouseDistance && isPanMode ? mouseDistance.y : 0 ) }
                        x2={ scaledShapePoints[ 1 ]?.x + ( mouseDistance && isPanMode ? mouseDistance.x : 0 ) }
                        y2={ scaledShapePoints[ 1 ]?.y + ( mouseDistance && isPanMode ? mouseDistance.y : 0 ) }
                        stroke="#f00"
                    />
                    <ShapePoint shapeId={ shape.id } pointCoordinates={ scaledShapePoints[ 0 ] } pointIndex={ 0 } />
                    <ShapePoint shapeId={ shape.id } pointCoordinates={ scaledShapePoints[ 1 ] } pointIndex={ 1 } />
                    { [ ...Array( scaledShapePoints.length ) ].reduce( ( result, _, index ) => !( ( index - 2 ) % 3 ) ? [ ...result, index ] : result, [] ).map( ( pointIndex: number ): JSX.Element => <g key={ pointIndex }>
                        <line
                            x1={ scaledShapePoints[ pointIndex ]?.x + ( mouseDistance && isPanMode ? mouseDistance.x : 0 ) }
                            y1={ scaledShapePoints[ pointIndex ]?.y + ( mouseDistance && isPanMode ? mouseDistance.y : 0 ) }
                            x2={ scaledShapePoints[ pointIndex + 1 ]?.x + ( mouseDistance && isPanMode ? mouseDistance.x : 0 ) }
                            y2={ scaledShapePoints[ pointIndex + 1 ]?.y + ( mouseDistance && isPanMode ? mouseDistance.y : 0 ) }
                            stroke="#f00"
                        />
                        <line
                            x1={ scaledShapePoints[ pointIndex + 1 ]?.x + ( mouseDistance && isPanMode ? mouseDistance.x : 0 ) }
                            y1={ scaledShapePoints[ pointIndex + 1 ]?.y + ( mouseDistance && isPanMode ? mouseDistance.y : 0 ) }
                            x2={ scaledShapePoints[ pointIndex + 2 ]?.x + ( mouseDistance && isPanMode ? mouseDistance.x : 0 ) }
                            y2={ scaledShapePoints[ pointIndex + 2 ]?.y + ( mouseDistance && isPanMode ? mouseDistance.y : 0 ) }
                            stroke="#f00"
                        />
                        <ShapePoint shapeId={ shape.id } pointCoordinates={ scaledShapePoints[ pointIndex ] } pointIndex={ pointIndex } />
                        <ShapePoint shapeId={ shape.id } pointCoordinates={ scaledShapePoints[ pointIndex + 1 ] } pointIndex={ pointIndex + 1 } />
                        <ShapePoint shapeId={ shape.id } pointCoordinates={ scaledShapePoints[ pointIndex + 2 ] } pointIndex={ pointIndex + 2 } />
                    </g> ) }
                </g>
            ) }

        </g>
    );

};

export default Shape;
