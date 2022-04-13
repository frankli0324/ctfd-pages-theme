import Alpine from "alpinejs";
import embed from "vega-embed";

import CTFd from "../index";
import {
  getValues as getSolveValues,
  getSpec as getSolveSpec,
} from "../utils/graphs/solve-percentage";
import {
  getValues as getCategoryValues,
  getSpec as getCategorySpec,
} from "../utils/graphs/categories";
import {
  getValues as getUserValues,
  getSpec as getUserSpec,
} from "../utils/graphs/userscore";

window.Alpine = Alpine;

Alpine.data("UserGraphs", () => ({
  solves: null,
  fails: null,
  awards: null,

  async init() {
    this.solves = await CTFd.pages.users.userSolves(window.USER.id);
    this.fails = await CTFd.pages.users.userFails(window.USER.id);
    this.awards = await CTFd.pages.users.userAwards(window.USER.id);

    let solveValues = getSolveValues(this.solves, this.fails);
    let solveSpec = getSolveSpec("Solves Percentage", solveValues);
    embed(this.$refs.solvepercentage, solveSpec);

    let categoryValues = getCategoryValues(this.solves);
    let categorySpec = getCategorySpec("Category Breakdown", categoryValues);
    embed(this.$refs.categorybreakdown, categorySpec);

    let userValues = getUserValues(this.solves, this.awards);
    let userSpec = getUserSpec("Score Graph", userValues);
    embed(this.$refs.scoregraph, userSpec);
  },
}));

Alpine.start();
