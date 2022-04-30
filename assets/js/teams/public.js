// import "bootstrap/dist/js/bootstrap.bundle";

import Alpine from "alpinejs";

import CTFd from "../index";

import { getOption as getSolveOption } from "../utils/graphs/echarts/solve-percentage";
import { getOption as getCategoryOption } from "../utils/graphs/echarts/categories";
import { getOption as getUserScoreOption } from "../utils/graphs/echarts/userscore";
import { embed } from "../utils/graphs/echarts";

window.Alpine = Alpine;

Alpine.data("TeamGraphs", () => ({
  solves: null,
  fails: null,
  awards: null,

  async init() {
    this.solves = await CTFd.pages.teams.teamSolves(window.TEAM.id);
    this.fails = await CTFd.pages.teams.teamFails(window.TEAM.id);
    this.awards = await CTFd.pages.teams.teamAwards(window.TEAM.id);

    let solveOption = getSolveOption(
      this.solves.meta.count,
      this.fails.meta.count
    );
    embed(this.$refs.solvepercentage, solveOption);

    let categoryOption = getCategoryOption(this.solves.data);
    embed(this.$refs.categorybreakdown, categoryOption);

    let userScoreOption = getUserScoreOption(
      window.TEAM.id,
      window.TEAM.name,
      this.solves.data,
      this.awards.data
    );
    embed(this.$refs.scoregraph, userScoreOption);
  },
}));

Alpine.start();
