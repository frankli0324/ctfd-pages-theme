import Alpine from "alpinejs";
import CTFd from "../index";

import { getOption as getSolveOption } from "../utils/graphs/echarts/solve-percentage";
import { getOption as getCategoryOption } from "../utils/graphs/echarts/categories";
import { getOption as getUserScoreOption } from "../utils/graphs/echarts/userscore";
import { embed } from "../utils/graphs/echarts";

window.Alpine = Alpine;

Alpine.data("UserGraphs", () => ({
  solves: null,
  fails: null,
  awards: null,

  async init() {
    this.solves = await CTFd.pages.users.userSolves("me");
    this.fails = await CTFd.pages.users.userFails("me");
    this.awards = await CTFd.pages.users.userAwards("me");

    let solveOption = getSolveOption(
      this.solves.meta.count,
      this.fails.meta.count
    );
    embed(this.$refs.solvepercentage, solveOption);

    let categoryOption = getCategoryOption(this.solves.data);
    embed(this.$refs.categorybreakdown, categoryOption);

    let userScoreOption = getUserScoreOption(
      CTFd.user.id,
      CTFd.user.name,
      this.solves.data,
      this.awards.data
    );
    embed(this.$refs.scoregraph, userScoreOption);
  },
}));

Alpine.start();
