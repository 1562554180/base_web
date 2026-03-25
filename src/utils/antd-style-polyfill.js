// Polyfill for @ant-design/compatible to fix resetComponent import issue
// In Ant Design 4.0, resetComponent is no longer exported from antd/es/style
// This file provides a compatibility layer

// resetComponent is a Less mixin that was used in Ant Design 3.x
// In Ant Design 4.0, styles are handled differently
// We export an empty function as a placeholder since the actual reset
// is now handled by the CSS-in-JS system
// Placeholder for resetComponent mixin from Ant Design 3.x
export const resetComponent = () => {
  // No-op: handled by Ant Design 4/5 style system
};

// Placeholder for clearFix mixin from Ant Design 3.x
export const clearFix = () => {
  // No-op: handled by modern layout styles
};

// Export other style utilities that might be needed
export default {
  resetComponent,
  clearFix,
};

