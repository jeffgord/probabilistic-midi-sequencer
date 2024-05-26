import { useState, useEffect } from "react";

export default function ConnectorArrow({ startRef, endRef, arrowDirection }) {
    const [path, setPath] = useState({
        startX: -2000,
        startY: -2000,
        endX: -2000,
        endY: -2000
    });

    useEffect(() => {
        const updatePath = () => {
            const startRect = startRef.current.getBoundingClientRect();
            const endRect = endRef.current.getBoundingClientRect();
            const startX = (arrowDirection === 'right' ? startRect.left : startRect.right);
            const startY = startRect.bottom - 50;
            const endX = (arrowDirection === 'right' ? endRect.left : endRect.right);
            const endY = endRect.top + 50;

            setPath({
                startX: startX,
                startY: startY,
                endX: endX,
                endY: endY
            });
        }

        updatePath();
        window.addEventListener('resize', updatePath);

        return () => { window.removeEventListener('resize', updatePath); }
    }, [startRef, endRef, arrowDirection])

    const bumpX = arrowDirection === 'right' ? path.startX - 40 : path.startX + 40;
    const radius = 20;
    const cornerX = arrowDirection === 'right' ? bumpX + radius : bumpX - radius;
    const lineEndX = arrowDirection === 'right' ? path.endX - 20 : path.endX + 20;

    const pathD = `
        M${path.startX},${path.startY} 
        L${cornerX},${path.startY} 
        A${radius},${radius} 0 0 ${arrowDirection === 'left' ? 1 : 0} ${bumpX},${path.startY + radius} 
        L${bumpX},${path.endY - radius} 
        A${radius},${radius} 0 0 ${arrowDirection === 'left' ? 1 : 0} ${cornerX},${path.endY} 
        L${lineEndX},${path.endY}
    `;

    const arrowX = arrowDirection === 'right' ? path.endX - 20 : path.endX + 20;
    const points = `${path.endX},${path.endY} ${arrowX},${path.endY + 20} ${arrowX},${path.endY - 20}`;

    const style = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    }

    return (
        <svg style={style}>
            <path d={pathD} stroke='var(--dark-grey)' strokeWidth="10" fill='none' />
            <polygon points={points} fill='var(--dark-grey)' />
        </svg>
    );
}
