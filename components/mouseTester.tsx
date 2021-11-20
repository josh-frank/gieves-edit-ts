import { FunctionComponent } from 'react';
import { selectMouse, selectMouseDown } from '../redux/clientSlice';
import { useAppSelector as useSelector } from '../redux/hooks'
import { reflect } from '../utilities';

const MouseTester: FunctionComponent = () => {

    const mouse = useSelector( selectMouse );
    const mouseDown = useSelector( selectMouseDown );
    const reflectMouse = mouseDown && {
        x: reflect( mouse.x, mouseDown.coordinates.x ),
        y: reflect( mouse.y, mouseDown.coordinates.y )
    }

    return <g>
        { reflectMouse && <>
            <line x1={ reflectMouse.x } y1={ reflectMouse.y } x2={ mouse.x } y2={ mouse.y } stroke="red" />
            <circle cx={ reflectMouse.x } cy={ reflectMouse.y } r="5" stroke="red" fill="white" />
            <circle cx={ mouseDown.coordinates.x } cy={ mouseDown.coordinates.y } r="5" stroke="red" fill="white" />
        </> }
        { mouse && <circle cx={ mouse.x } cy={ mouse.y } r="5" stroke="red" fill="white" /> }
    </g>;

}

export default MouseTester;
