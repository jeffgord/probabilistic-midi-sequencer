import { Tooltip } from "react-tooltip";
import './global.css'

export default function CustomTip({ id, children }) {
    const style = {
        color: 'var(--gold)',
        backgroundColor: 'var(--dark-grey)',
        maxWidth: '300px'
    }

    return (<Tooltip
        id={id}
        border='2px solid var(--gold)'
        place='left'
        opacity={1}
        delay-show={1000}
        style={style}
        className="k2d-regular">
        {children}
    </Tooltip>
    );
}