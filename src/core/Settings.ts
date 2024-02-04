let settings = {
    calculateReflectance: false,
    reflectanceFactor: 1,
    secondaryLightIntensityLimit: 1,
    secondaryLightDepthLimit: 10,
    maxLightBounceLimit: 50,
    dispersionFactor: 0.3,
    showGrid: false,
    gridSize: 500,
    gridDivisions: 5,
    lightRayRenderWidth: 3,
    surfaceRenderWidth: 2,
    glassOpacity: 0.05,
};

export function resetSettings() {
    settings.calculateReflectance = false;
    settings.reflectanceFactor = 1;
    settings.secondaryLightIntensityLimit = 1;
    settings.secondaryLightDepthLimit = 10;
    settings.maxLightBounceLimit = 50;
    settings.dispersionFactor = 0.3;

    settings.showGrid = false;
    settings.gridSize = 500;
    settings.gridDivisions = 5;
    settings.lightRayRenderWidth = 3;
    settings.surfaceRenderWidth = 2;
    settings.glassOpacity = 0.05;
}

export default settings;
