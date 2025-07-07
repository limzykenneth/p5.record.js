import terser from "@rollup/plugin-terser";

export default [
  {
    input: "src/main.js",
    output: {
      file: "dist/p5.record.min.js",
      format: "iife",
      plugins: [
        terser()
      ]
    }
  },
  {
    input: "src/main.js",
    output: {
      file: "dist/p5.record.esm.js",
      format: "esm"
    }
  }
];