// Shim module for bizcharts-plugin-slider
// The original UMD plugin is not compatible with the current BizCharts/G2 version
// and throws runtime errors (e.g. reading 'Util' of undefined).
// We provide an empty stub to avoid breaking the app.

// No-op default export
export default {};

// Named exports that some code might expect
export const Slider = () => null;


