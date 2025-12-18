import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 100 100" 
            className="h-12 w-12 text-primary"
            fill="currentColor"
        >
            <path d="M50,10A40,40,0,1,0,90,50,40,40,0,0,0,50,10Zm0,72A32,32,0,1,1,82,50,32,32,0,0,1,50,82Z"/>
            <path d="M50,25a5,5,0,0,0-5,5V50h5a5,5,0,0,0,0-10H50V30a5,5,0,0,0,5-5,5,5,0,0,0-5-5Z" transform="rotate(45 50 50)"/>
            <path d="M50,55a5,5,0,0,0-5,5V75h5a5,5,0,0,0,0-10H50V60a5,5,0,0,0,5-5,5,5,0,0,0-5-5Z" transform="rotate(-135 50 50)"/>
            <text x="50" y="58" textAnchor="middle" fontSize="18" fill="hsl(var(--foreground))" className="font-bold font-headline">C</text>
        </svg>
      <h1 className="text-xl font-bold font-headline tracking-tight">Your College Name</h1>
    </div>
  );
}
