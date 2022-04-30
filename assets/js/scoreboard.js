import Alpine from "alpinejs";
import CTFd from "./index";

import { getOption } from "./utils/graphs/echarts/scoreboard";
import { embed } from "./utils/graphs/echarts";

window.Alpine = Alpine;

Alpine.data("ScoreboardDetail", () => ({
  data: null,

  async init() {
    this.data = await CTFd.pages.scoreboard.getScoreboardDetail(10);
    console.log(this.data);

    let option = getOption(CTFd.config.userMode, this.data);
    embed(this.$refs.scoregraph, option);
  },
}));

Alpine.start();
