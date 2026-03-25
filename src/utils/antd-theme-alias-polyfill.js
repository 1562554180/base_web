// Polyfill for @ant-design/compatible to fix antd/es/theme/util/alias import issue
// In Ant Design 4.x, this utility may not exist in the same location
// This provides a compatibility layer

// formatToken function for theme token conversion
export default function formatToken(mapToken) {
  // Simple token formatter for compatibility
  // This is a minimal implementation for @ant-design/compatible
  if (!mapToken || typeof mapToken !== 'object') {
    return {};
  }

  // Return the token as-is for basic compatibility
  // @ant-design/compatible will handle the actual conversion
  return mapToken;
}

