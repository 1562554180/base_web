// Compatibility shim for @module-federation/vite on legacy projects.
// Some plugin versions may inject this subpath into optimizeDeps.include,
// but the installed dts package does not expose that export path.
export default {};
