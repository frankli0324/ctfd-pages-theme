import Alpine from "alpinejs";
import CTFd from "./index";

import { serializeJSON } from "@ctfdio/ctfd-js/forms";
import { copyToClipboard } from "./utils/clipboard";
import { getValues, getSpec } from "./utils/graphs/scoreboard";

import embed from "vega-embed";
import dayjs from "dayjs";

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
