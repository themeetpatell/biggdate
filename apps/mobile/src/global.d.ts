// Ambient declarations for non-TS assets imported by source files.

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
