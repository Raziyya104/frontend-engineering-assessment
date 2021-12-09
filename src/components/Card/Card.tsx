import React, { PropsWithChildren } from 'react';
import './Card.css';

const Card = ({
    className,
    children,
}: PropsWithChildren<{ className: string }>) => (
    <div className={`Card ${className}`} data-testid="Card">
        {children}
    </div>
);

export default Card;
