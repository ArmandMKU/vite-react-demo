// vite.config.js
import { chunkSplitPlugin } from "vite-plugin-chunk-split";

export default {
  // config options
  plugins: [
    // ...
    chunkSplitPlugin(),
  ],
};
