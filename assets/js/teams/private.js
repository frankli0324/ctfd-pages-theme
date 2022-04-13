import Modal from "bootstrap/js/dist/modal";

import Alpine from "alpinejs";

import CTFd from "../index";
import { serializeJSON } from "@ctfdio/ctfd-js/forms";
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
import { copyToClipboard } from "../utils/clipboard";

import embed from "vega-embed";

window.Alpine = Alpine;

Alpine.store("inviteToken", "");

Alpine.data("TeamEditModal", () => ({
  success: null,
  error: null,
  initial: null,
  errors: [],

  init() {
    this.initial = serializeJSON(this.$el.querySelector("form"));
  },

  async updateProfile() {
    let data = serializeJSON(this.$el, this.initial, true);

    data.fields = [];

    for (const property in data) {
      if (property.match(/fields\[\d+\]/)) {
        let field = {};
        let id = parseInt(property.slice(7, -1));
        field["field_id"] = id;
        field["value"] = data[property];
        data.fields.push(field);
        delete data[property];
      }
    }

    let response = await CTFd.pages.teams.updateTeamSettings(data);
    if (response.success) {
      this.success = true;
      this.error = false;
      setTimeout(() => {
        this.success = null;
        this.error = null;
      }, 3000);
    } else {
      this.success = false;
      this.error = true;
      Object.keys(response.errors).map((error) => {
        const error_msg = response.errors[error];
        this.errors.push(error_msg);
      });
    }
  },
}));

Alpine.data("TeamCaptainModal", () => ({
  success: null,
  error: null,
  errors: [],

  async updateCaptain() {
    let data = serializeJSON(this.$el, null, true);
    let response = await CTFd.pages.teams.updateTeamSettings(data);

    if (response.success) {
      window.location.reload();
    } else {
      this.success = false;
      this.error = true;
      Object.keys(response.errors).map((error) => {
        const error_msg = response.errors[error];
        this.errors.push(error_msg);
      });
    }
  },
}));

Alpine.data("TeamInviteModal", () => ({
  copy() {
    copyToClipboard(this.$refs.link);
  },
}));

Alpine.data("TeamDisbandModal", () => ({
  errors: [],

  async disbandTeam() {
    let response = await CTFd.pages.teams.disbandTeam();

    if (response.success) {
      window.location.reload();
    } else {
      this.errors = response.errors[""];
    }
  },
}));

Alpine.data("CaptainMenu", () => ({
  captain: false,

  editTeam() {
    this.teamEditModal = new Modal(document.getElementById("team-edit-modal"));
    this.teamEditModal.show();
  },

  chooseCaptain() {
    this.teamCaptainModal = new Modal(
      document.getElementById("team-captain-modal")
    );
    this.teamCaptainModal.show();
  },

  async inviteMembers() {
    const response = await CTFd.pages.teams.getInviteToken();

    if (response.success) {
      const code = response.data.code;
      const url = `${window.location.origin}${CTFd.config.urlRoot}/teams/invite?code=${code}`;

      document.querySelector("#team-invite-modal input[name=link]").value = url;
      this.$store.inviteToken = url;
      this.teamInviteModal = new Modal(
        document.getElementById("team-invite-modal")
      );
      this.teamInviteModal.show();
    }
  },

  disbandTeam() {
    this.teamDisbandModal = new Modal(
      document.getElementById("team-disband-modal")
    );
    this.teamDisbandModal.show();
  },
}));

Alpine.data("TeamGraphs", () => ({
  solves: null,
  fails: null,
  awards: null,

  async init() {
    this.solves = await CTFd.pages.teams.teamSolves("me");
    this.fails = await CTFd.pages.teams.teamFails("me");
    this.awards = await CTFd.pages.teams.teamAwards("me");

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
