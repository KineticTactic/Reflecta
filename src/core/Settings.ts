let settings = {
    calculateReflectance: false,
    reflectanceFactor: 1,
    secondaryLightIntensityLimit: 1,
    secondaryLightDepthLimit: 10,
    maxLightBounceLimit: 50,
    dispersionFactor: 0.3,
    lightRayRenderWidth: 3,
    surfaceRenderWidth: 2,
};

export function resetSettings() {
    settings.calculateReflectance = false;
    settings.reflectanceFactor = 1;
    settings.secondaryLightIntensityLimit = 1;
    settings.secondaryLightDepthLimit = 10;
    settings.maxLightBounceLimit = 50;
    settings.dispersionFactor = 0.3;
    settings.lightRayRenderWidth = 3;
    settings.surfaceRenderWidth = 2;
}

export default settings;
