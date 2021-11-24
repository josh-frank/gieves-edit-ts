import { FunctionComponent, useEffect, useRef } from "react";

import { useAppDispatch as useDispatch, useAppSelector as useSelector } from "../../redux/hooks";
import { applyScaleAndOffset, unapplyScaleAndOffset } from "../../redux/artboardSlice";
import { selectMouse, selectMouseDown } from "../../redux/clientSlice";
import { selectActiveShape, selectShapes, updateActiveShape } from "../../redux/penSlice";
import { Coordinates, MouseDown } from "../../types";
import { vectorEquality } from "../../utilities";

import Shape from "./shape";

const Shapes: FunctionComponent = () => {

    const dispatch = useDispatch();

    const mouse = useSelector( selectMouse );
    const mouseDown = useSelector( selectMouseDown );

    const scaleAndOffset = useSelector( applyScaleAndOffset );
    const unscaleAndUnoffset = useSelector( unapplyScaleAndOffset );

    const shapes = useSelector( selectShapes );
    const activeShape = useSelector( selectActiveShape );

    const previousMouse = useRef<Coordinates>();
    const previousMouseDown = useRef<MouseDown | null>();

    useEffect( () => { 
        return () => {
            previousMouse.current = mouse;
            previousMouseDown.current = mouseDown;
        }
    }, [ mouse, mouseDown ] );

    useEffect( () => {
        if ( mouseDown && previousMouse.current && previousMouseDown.current?.dataset.pointIndex && !vectorEquality( mouse, previousMouse.current ) ) {
            const updatedActiveShapePoints = [ ...( activeShape?.points || [] ) ];
            updatedActiveShapePoints[ previousMouseDown.current.dataset.pointIndex ] = unscaleAndUnoffset( previousMouse.current );
            dispatch( updateActiveShape( updatedActiveShapePoints ) );
        }
    }, [ dispatch, mouse, mouseDown, activeShape, unscaleAndUnoffset ] );

    return (
        <g>
            { activeShape && <Shape shape={ activeShape } /> }
            { shapes?.length && shapes?.map( shape =>
                <Shape
                    key={ shape.id }
                    shape={ shape }
                />
            ) }
        </g>
    );

};

export default Shapes;
