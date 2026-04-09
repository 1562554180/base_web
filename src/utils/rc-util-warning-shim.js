// Shim for rc-util/es/warning used by @ant-design/compatible
// Suppresses deprecation warnings from antd v4 compatible layer
export default function warning(valid, message) {
  // No-op: suppress antd v4 compatibility warnings
}
export { warning };
