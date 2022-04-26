import Alpine from "alpinejs";
import embed from "vega-embed";

import CTFd from "./index";
import { getValues, getSpec } from "./utils/graphs/scoreboard";

window.Alpine = Alpine;
window.CTFd = CTFd;

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
