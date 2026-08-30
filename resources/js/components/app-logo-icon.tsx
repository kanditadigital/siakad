import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="currentColor" />
            <path
                d="M20 8L10 13L20 18L30 13L20 8Z"
                fill="white"
                opacity="0.95"
            />
            <path
                d="M12 14.5V22.5C12 22.5 15 26 20 26C25 26 28 22.5 28 22.5V14.5L20 19L12 14.5Z"
                fill="white"
                opacity="0.85"
            />
            <path
                d="M20 26V32"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.8"
            />
            <circle cx="20" cy="33" r="1.5" fill="white" opacity="0.8" />
        </svg>
    );
}
