import terser from "@rollup/plugin-terser";

export default [
  {
    input: "src/main.js",
    output: {
      file: "dist/p5.record.min.js",
      format: "iife",
      plugins: [
        process.env.ROLLUP_WATCH ? null :  terser()
      ]
    }
  },
  {
    input: "src/main.js",
    output: {
      file: "dist/p5.record.esm.js",
      format: "esm",
      plugins: [
        process.env.ROLLUP_WATCH ? null :  terser()
      ]
    }
  }
];