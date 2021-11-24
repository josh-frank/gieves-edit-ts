import { MouseEventHandler, useState } from "react"

interface ClosePathButtonProps {
    cx: number;
    cy: number;
    closePath: MouseEventHandler<SVGCircleElement>;
}

const ClosePathButton = ( { cx, cy, closePath }: ClosePathButtonProps ): JSX.Element => {

    const [ showPopup, setShowPopup ] = useState( false );

    return (
        <g>
            <circle
                data-name="close-path"
                cx={ cx }
                cy={ cy }
                r="7"
                fill="#FFF"
                stroke="red"
                onMouseEnter={ () => setShowPopup( true ) }
                onMouseLeave={ () => setShowPopup( false ) }
                onClick={ closePath }
            />
            { showPopup && <g>
                <rect x={ cx } y={ cy } width="60" height="15" fill="#f00" transform="translate( 10 -10 )" />
                <text
                    x={ cx }
                    y={ cy }
                    fill="white"
                    transform="translate( 15 0 )"
                    style={ { fontSize: "10px", fontWeight: "bold" } }
                >
                    Close path
                </text> 
            </g> }
        </g>
    );

}

export default ClosePathButton;
