import React, { useEffect } from 'react';

// Function to inject the custom CSS, including keyframes, into the document head.
// This ensures the custom animation definition is available to the component.
const injectLoaderStyles = () => {
    const styleId = 'four-dot-loader-styles';
    // Prevent injecting multiple times
    if (document.getElementById(styleId)) return;

    const styleSheet = document.createElement("style");
    styleSheet.setAttribute('id', styleId);
    styleSheet.innerHTML = `
        /* Custom Keyframes for the Bouncing/Scaling Animation */
        @keyframes loading-bounce {
            0%, 80%, 100% {
                transform: scale(0);
                opacity: 0.5;
            }
            40% {
                transform: scale(1.0);
                opacity: 1;
            }
        }

        /* Applying the animation class */
        .dot-animation {
            animation: loading-bounce 1.4s infinite ease-in-out both;
        }
    `;
    document.head.appendChild(styleSheet);
};

// Array defining the specific staggered delay for each of the six dots
const dotDelays = ['-0.48s', '-0.32s', '-0.16s', '0s', '0.16s', '0.32s'];

const FourDotLoader = () => {
    // Inject styles only once when the component is mounted
    useEffect(() => {
        injectLoaderStyles();
    }, []);

    return (
        // The outer container keeps the component centered for demonstration purposes
        <div className="flex items-center justify-center py-3">

            {/* Dots container */}
            <div className="flex space-x-4">
                {/* Map over the delays to create the six dots */}
                {dotDelays.map((delay, index) => (
                    <div
                        key={index}
                        // Removed bg-blue-500 from className
                        className="dot-animation w-4 h-4"
                        style={{
                            // Set custom color #003d38
                            backgroundColor: '#003d38',
                            // Inline style to apply the specific staggered delay
                            animationDelay: delay,
                            // Optimization hint for browsers
                            willChange: 'transform, opacity',
                            // Force circular shape
                            borderRadius: '50%',
                        }}
                        role="status" // For accessibility
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default FourDotLoader;
