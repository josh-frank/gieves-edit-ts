import { FunctionComponent } from 'react';
import { selectClientDimensions } from '../redux/clientSlice';
import { useAppDispatch as useDispatch, useAppSelector as useSelector } from '../redux/hooks'
import styles from '../styles/Home.module.css'

const SvgWrapper: FunctionComponent = ( { children } ) => {

    const { width, height } = useSelector( selectClientDimensions ) || { width: 0, height: 0 };

    return <svg
        className={ styles.svgWrapper }
        width={ width }
        height={ height }
        viewBox={ `0 0 ${ width } ${ height }` }
    >
        { children }
    </svg>;

}

export default SvgWrapper;
