import { useCallback, useEffect } from 'react';
import type { NextPage } from 'next'
import SvgWrapper from '../components/svgWrapper';
import { setClientDimensions, setMouse, setMouseDown, setMouseUp } from '../redux/clientSlice';
// import styles from '../styles/Home.module.css'
import { useAppDispatch as useDispatch } from '../redux/hooks'
import MouseTester from '../components/mouseTester';

const Home: NextPage = () => {

  const dispatch = useDispatch();

  const handleMouseDown = useCallback( ( { target, clientX, clientY } ) => {
    dispatch( setMouse( { x: clientX, y: clientY } ) );
    dispatch( setMouseDown( { coordinates: { x: clientX, y: clientY }, dataset: { ...target.dataset } } ) );
  }, [ dispatch ] );

  const handleMouseUp = useCallback( () => dispatch( setMouseUp() ), [ dispatch ] );

  const handleMouseMove = useCallback( mouseMoveEvent => dispatch( setMouse( { x: mouseMoveEvent.clientX, y: mouseMoveEvent.clientY } ) ), [ dispatch ] );

  const handleResize = useCallback( resizeEvent => dispatch( setClientDimensions( { height: resizeEvent.target.innerHeight, width: resizeEvent.target.innerWidth } ) ), [ dispatch ] );

  useEffect( () => {
    dispatch( setClientDimensions( {
      width: window.innerWidth || document.body.clientWidth,
      height: window.innerHeight || document.body.clientHeight
    } ) );
  }, [ dispatch ] );

  useEffect( () => {
    window.addEventListener( "mousedown", handleMouseDown );
    window.addEventListener( "mousemove", handleMouseMove );
    window.addEventListener( "mouseup", handleMouseUp );
    window.addEventListener( "resize", handleResize );
    return () => {
      window.removeEventListener( "mousedown", handleMouseDown );
      window.removeEventListener( "mousemove", handleMouseMove );
      window.removeEventListener( "mouseup", handleMouseUp );
      window.removeEventListener( "resize", handleResize );
    };
  }, [ dispatch, handleMouseDown, handleMouseMove, handleMouseUp, handleResize ] );

  return <>
    <SvgWrapper>
      <MouseTester />
    </SvgWrapper>
  </>;

}

export default Home
