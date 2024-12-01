import * as React from "react";

export const hpf = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        style={{
            enableBackground: "new 0 0 48 24",
        }}
        viewBox="0 0 48 24"
        {...props}
    >
        <path
            className="group-gfx"
            d="M40 4H23.18c-3.53 0-6.8 1.86-8.6 4.9L8 20"
            style={{
                fill: "none",
                strokeLinecap: "round",
                strokeMiterlimit: 10,
            }}
        />
    </svg>
);

export const lpf = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        style={{
            enableBackground: "new 0 0 48 24",
        }}
        viewBox="0 0 48 24"
        {...props}
    >
        <path
            className="group-gfx"
            d="M8 4h16.82c3.53 0 6.8 1.86 8.6 4.9L40 20"
            style={{
                fill: "none",
                strokeLinecap: "round",
                strokeMiterlimit: 10,
            }}
        />
    </svg>
);

export const peak = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        id="Layer_1"
        x={0}
        y={0}
        style={{
            enableBackground: "new 0 0 48 24",
        }}
        viewBox="0 0 48 24"
        {...props}
    >
        <path
            d="M7 12c6.6 0 10.83-3.13 13.35-6.09 1.65-1.93 4.65-1.93 6.3 0C29.17 8.87 33.4 12 40 12M7 12c6.6 0 10.83 3.13 13.35 6.09 1.65 1.93 4.65 1.93 6.3 0C29.17 15.13 33.4 12 40 12"
            className="st0"
        />
    </svg>
);

export const lowshelf = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        style={{
            enableBackground: "new 0 0 48 24",
        }}
        viewBox="0 0 48 24"
        {...props}
    >
        <path
            d="M40 12c-8.81 0-10.48-2.73-14.18-5.35-2.53-1.79-5.23-2.74-13.7-2.74H7M40 12c-8.81 0-10.48 2.73-14.18 5.35-2.53 1.79-5.23 2.74-13.7 2.74H7"
            className="st0"
        />
    </svg>
);

export const highshelf = (props) => ( // same as loweshelf but flipped horizontally
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        style={{
            enableBackground: "new 0 0 48 24",
        }}
        viewBox="0 0 48 24"
        {...props}
    >
        <path
            d="M8 12c8.81 0 10.48-2.73 14.18-5.35 2.53-1.79 5.23-2.74 13.7-2.74H41M8 12c8.81 0 10.48 2.73 14.18 5.35 2.53 1.79 5.23 2.74 13.7 2.74H41"
            className="st0"
        />
    </svg>
);