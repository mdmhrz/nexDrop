import React from 'react';
import CoverageMap from './CoverageMap';


const Coverage = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-6">
                We are available in 64 districts
            </h2>

            {/* Map Component */}
            <CoverageMap></CoverageMap>

            {/* Later: Search box will go here */}
        </div>
    );
};

export default Coverage;