import Alpine from "alpinejs";
import CTFd from "./index";

import { getValues, getSpec } from "./utils/graphs/scoreboard";

import embed from "vega-embed";

window.Alpine = Alpine;

Alpine.data("ScoreboardDetail", () => ({
  data: null,

  async init() {
    this.data = await CTFd.pages.scoreboard.getScoreboardDetail(10);

    let values = getValues(this.data);
    let spec = getSpec("Top 10", values);
    embed(this.$refs.scoregraph, spec);
  },
}));

Alpine.start();
