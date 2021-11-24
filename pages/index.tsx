import { useCallback, useEffect } from 'react';
import type { NextPage } from 'next'
import SvgWrapper from '../components/svgWrapper';
import { setClientDimensions, setKeyDown, setKeyUp, setMouse, setMouseDown, setMouseUp } from '../redux/clientSlice';
// import styles from '../styles/Home.module.css'
import { useAppDispatch as useDispatch } from '../redux/hooks'
// import MouseTester from '../components/mouseTester';
import { setArtboardDimensions, setOffset } from '../redux/artboardSlice';
import Artboard from '../components/artboard';
import Pen from '../components/pen';
import Shapes from '../components/shapes';

const Home: NextPage = () => {

  const dispatch = useDispatch();

  const handleMouseDown = useCallback( ( { target, clientX, clientY } ) => {
    dispatch( setMouse( { x: clientX, y: clientY } ) );
    dispatch( setMouseDown( { coordinates: { x: clientX, y: clientY }, dataset: { ...target.dataset } } ) );
  }, [ dispatch ] );

  const handleMouseUp = useCallback( () => dispatch( setMouseUp() ), [ dispatch ] );

  const handleMouseMove = useCallback( mouseMoveEvent => dispatch( setMouse( { x: mouseMoveEvent.clientX, y: mouseMoveEvent.clientY } ) ), [ dispatch ] );

  const handleKeyDown = useCallback( keyDownEvent => dispatch( setKeyDown( keyDownEvent.key ) ), [ dispatch ] );
  
  const handleKeyUp = useCallback( () => dispatch( setKeyUp() ), [ dispatch ] );

  const handleResize = useCallback( resizeEvent => dispatch( setClientDimensions( { height: resizeEvent.target.innerHeight, width: resizeEvent.target.innerWidth } ) ), [ dispatch ] );

  useEffect( () => {
    dispatch( setClientDimensions( {
      width: window.innerWidth || document.body.clientWidth,
      height: window.innerHeight || document.body.clientHeight
    } ) );
    dispatch( setArtboardDimensions( { width: 500, height: 400 } ) );
    dispatch( setOffset( {
      x: ( ( window.innerWidth || document.body.clientWidth ) - 500 ) / 2,
      y: ( ( window.innerHeight || document.body.clientHeight ) - 400 ) / 2
    } ) );
  }, [ dispatch ] );


  useEffect( () => {
    window.addEventListener( "mousedown", handleMouseDown );
    window.addEventListener( "mousemove", handleMouseMove );
    window.addEventListener( "mouseup", handleMouseUp );
    window.addEventListener( "keydown", handleKeyDown );
    window.addEventListener( "keyup", handleKeyUp );
    window.addEventListener( "resize", handleResize );
    return () => {
      window.removeEventListener( "mousedown", handleMouseDown );
      window.removeEventListener( "mousemove", handleMouseMove );
      window.removeEventListener( "mouseup", handleMouseUp );
      window.removeEventListener( "keydown", handleKeyDown );
      window.removeEventListener( "keyup", handleKeyUp );
      window.removeEventListener( "resize", handleResize );
    };
  }, [ dispatch, handleMouseDown, handleMouseMove, handleMouseUp, handleKeyDown, handleKeyUp, handleResize ] );

  return <>
    <SvgWrapper>
      <Artboard />
      <Pen />
      <Shapes />
    </SvgWrapper>
  </>;

}

export default Home
