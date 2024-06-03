import React from 'react';
import './Circle_Statistic.scss';

const Circle_Statistic = ({ value, maxValue, color='#179A48', colorbg='#e6e6e6' }) => {
    const percentage = (value / maxValue) * 100;
    const radius = 80; // Increase the radius to make the circle larger
    const strokeWidth = 25; // Maintain the strokeWidth
    const circumference = 2 * Math.PI * radius; // Circumference calculation
    var offset = 0;
    
                    
    if ((circumference * (120 - percentage)) / 100 >= 477) {
        offset = (circumference * (104 - percentage)) / 100;
    } else if ((circumference * (120 - percentage)) / 100 <= 350) {
        offset = (circumference * (111 - percentage)) / 100;
    } else {
        offset = (circumference * (108 - percentage)) / 100;
    }
    // Adjusted offset calculation


    return (
        <svg className="circle-progress" width={radius * 2} height={radius * 2} style={{stroke:color}}>
            <circle
                className="circle-background"
                cx={radius}
                cy={radius}
                r={radius - strokeWidth / 1}
                strokeWidth={strokeWidth}
                style={{stroke:colorbg}}
            />
            <circle
                className="circle-progress"
                cx={radius}
                cy={radius}
                r={radius - strokeWidth / 2}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
            />
            <text x={radius} y={radius} textAnchor="middle" dy=".3em">{percentage.toFixed(2)}%</text>
        </svg>
    );
};

export default Circle_Statistic;
