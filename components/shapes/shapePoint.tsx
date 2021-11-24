import { useAppSelector as useSelector } from "../../redux/hooks";

import { panMode, selectDragDistance } from "../../redux/clientSlice";

import { Coordinates } from "../../types";

interface ShapePointProps {
    shapeId: string;
    pointCoordinates: Coordinates;
    pointIndex: number;
}

const ShapePoint = ( { shapeId, pointCoordinates, pointIndex }: ShapePointProps ): JSX.Element => {

    const mouseDistance = useSelector( selectDragDistance );

    const isPanMode = useSelector( panMode );

    return <circle
        data-name="shape-point"
        data-shape-id={ shapeId }
        data-point-index={ pointIndex }
        cx={ pointCoordinates.x + ( mouseDistance && isPanMode ? mouseDistance.x : 0 ) }
        cy={ pointCoordinates.y + ( mouseDistance && isPanMode ? mouseDistance.y : 0 ) }
        r="5"
        fill="#f00"
    />;

};

export default ShapePoint;
