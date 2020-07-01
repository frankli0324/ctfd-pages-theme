import "./main";
import "bootstrap/js/dist/tab";
import nunjucks from "nunjucks";
import { ezQuery, ezAlert } from "../ezq";
import { htmlEntities } from "../utils";
import Moment from "moment";
import $, { isFunction } from "jquery";
import CTFd from "../CTFd";
import config from "../config";

const api_func = {
    teams: x => CTFd.api.get_team_solves({ teamId: x }),
    users: x => CTFd.api.get_user_solves({ userId: x })
};

const md = CTFd.lib.markdown();

CTFd._internal.challenge = {};
let challenges = [];
let solves = [];
let pages = [];

const loadChal = id => {
    const chal = $.grep(challenges, chal => chal.id == id)[0];

    if (chal.type === "hidden") {
        ezAlert({
            title: "Challenge Hidden!",
            body: "You haven't unlocked this challenge yet!",
            button: "Got it!"
        });
        return;
    }

    displayChal(chal);
};

const loadChalByName = name => {
    const chal = $.grep(challenges, chal => chal.name == name)[0];

    displayChal(chal);
};

const displayChal = chal => {
    return Promise.all([
        CTFd.api.get_challenge({ challengeId: chal.id }),
        $.getScript(config.urlRoot + chal.script),
        $.get(config.urlRoot + chal.template)
    ]).then(responses => {
        const challenge_data = responses[0].data;
        const template_data = responses[2];
        const challenge = CTFd._internal.challenge;

        $("#challenge-window").empty();
        const template = nunjucks.compile(template_data);
        challenge.data = challenge_data;
        challenge.preRender();

        challenge_data["description"] = challenge.render(
            challenge_data["description"]
        );
        challenge_data["script_root"] = CTFd.config.urlRoot;

        $("#challenge-window").append(template.render(challenge_data));

        $(".challenge-solves").click(function (event) {
            getSolves($("#challenge-id").val());
        });
        $(".nav-tabs a").click(function (event) {
            event.preventDefault();
            $(this).tab("show");
        });

        // Handle modal toggling
        $("#challenge-window").on("hide.bs.modal", function (event) {
            $("#submission-input").removeClass("wrong");
            $("#submission-input").removeClass("correct");
            $("#incorrect-key").slideUp();
            $("#correct-key").slideUp();
            $("#already-solved").slideUp();
            $("#too-fast").slideUp();
        });

        $(".load-hint").on("click", function (event) {
            loadHint($(this).data("hint-id"));
        });

        $("#submit-key").click(async function (event) {
            event.preventDefault();
            $("#submit-key").addClass("disabled-button");
            $("#submit-key").prop("disabled", true);
            renderSubmissionResponse(
                await CTFd._internal.challenge.submit()
            );
            await loadPages();
            await loadUserSolves();
        });

        $("#submission-input").keyup(event => {
            if (event.keyCode == 13) {
                $("#submit-key").click();
            }
        });

        $(".input-field").bind({
            focus: function () {
                $(this)
                    .parent()
                    .addClass("input--filled");
            },
            blur: function () {
                const $this = $(this);
                if ($this.val() === "") {
                    $this.parent().removeClass("input--filled");
                    const $label = $this.siblings(".input-label");
                    $label.removeClass("input--hide");
                }
            }
        });

        challenge.postRender();

        window.location.replace(
            window.location.href.split("#")[0] + "#" + chal.name
        );
        $("#challenge-window").modal();
    });
};

function renderSubmissionResponse(response) {
    const result = response.data;

    const result_message = $("#result-message");
    const result_notification = $("#result-notification");
    const answer_input = $("#submission-input");
    result_notification.removeClass();
    result_message.text(result.message);

    if (result.status === "authentication_required") {
        window.location =
            CTFd.config.urlRoot +
            "/login?next=" +
            CTFd.config.urlRoot +
            window.location.pathname +
            window.location.hash;
        return;
    } else if (result.status === "incorrect") {
        // Incorrect key
        result_notification.addClass(
            "alert alert-danger alert-dismissable text-center"
        );
        result_notification.slideDown();

        answer_input.removeClass("correct");
        answer_input.addClass("wrong");
        setTimeout(function () {
            answer_input.removeClass("wrong");
        }, 3000);
    } else if (result.status === "correct") {
        // Challenge Solved
        result_notification.addClass(
            "alert alert-success alert-dismissable text-center"
        );
        result_notification.slideDown();

        $(".challenge-solves").text(
            parseInt(
                $(".challenge-solves")
                    .text()
                    .split(" ")[0]
            ) +
            1 +
            " Solves"
        );

        answer_input.val("");
        answer_input.removeClass("wrong");
        answer_input.addClass("correct");
    } else if (result.status === "already_solved") {
        // Challenge already solved
        result_notification.addClass(
            "alert alert-info alert-dismissable text-center"
        );
        result_notification.slideDown();

        answer_input.addClass("correct");
    } else if (result.status === "paused") {
        // CTF is paused
        result_notification.addClass(
            "alert alert-warning alert-dismissable text-center"
        );
        result_notification.slideDown();
    } else if (result.status === "ratelimited") {
        // Keys per minute too high
        result_notification.addClass(
            "alert alert-warning alert-dismissable text-center"
        );
        result_notification.slideDown();

        answer_input.addClass("too-fast");
        setTimeout(function () {
            answer_input.removeClass("too-fast");
        }, 3000);
    }
    setTimeout(function () {
        $(".alert").slideUp();
        $("#submit-key").removeClass("disabled-button");
        $("#submit-key").prop("disabled", false);
    }, 3000);
}

function markSolves() {
    for (let i = solves.length - 1; i >= 0; i--) {
        const btn = $('button[value="' + solves[i].challenge_id + '"]');
        btn.addClass("solved-challenge");
        btn.prepend("<i class='fas fa-check corner-button-check'></i>");
    }
}

async function loadUserSolves() {
    if (CTFd.user.id == 0) return;
    solves = (await api_func[CTFd.config.userMode]("me")).data;
    for (let i = solves.length - 1; i >= 0; i--) {
        const chal_id = solves[i].challenge_id;
        solves.push(chal_id);
    }
    markSolves();
}

async function getSolves(id) {
    const data = (await CTFd.api.get_challenge_solves({ challengeId: id })).data;
    $(".challenge-solves").text(parseInt(data.length) + " Solves");
    const box = $("#challenge-solves-names");
    box.empty();
    for (let i = 0; i < data.length; i++) {
        const id = data[i].account_id;
        const name = data[i].name;
        const date = Moment(data[i].date)
            .local()
            .fromNow();
        const account_url = data[i].account_url;
        box.append(
            '<tr><td><a href="{0}">{2}</td><td>{3}</td></tr>'.format(
                account_url,
                id,
                htmlEntities(name),
                date
            )
        );
    }
}

async function loadPages() {
    challenges = (await CTFd.api.get_challenge_list()).data;
    const pages_board = $('#pages-board');
    for (var i of challenges) {
        var page = i.category.split('.')[0];
        const pageid = page.replace(/ /g, "-").hashCode();
        if ($.inArray(page, pages) == -1) {
            pages.push(page);
            const page_row = $(
                '<a ' +
                'id="{0}-page-row" class="nav-link" '.format(pageid) +
                'data-toggle="pill" role="tab" href="#"' +
                '>' + page.slice(0, 15) + "</a>"
            );
            if (pages.length === 1) page_row.addClass('active');
            page_row.on('shown.bs.tab', loadChals);
            pages_board.append(page_row);
        }
    }
    loadChals();
}

function loadChals() {
    const categories = [];
    const $challenges_board = $("#challenges-board");
    const current_page_id = $("#pages-board>.active")[0].id;
    $challenges_board.empty();

    for (let i = challenges.length - 1; i >= 0; i--) {
        challenges[i].solves = 0;
        var category = challenges[i].category.split('.')[1];
        const page = '{0}-page-row'.format(challenges[i]
            .category.split('.')[0]
            .replace(/ /g, "-").hashCode());
        if (page !== current_page_id) continue;
        if (category === undefined) category = "";
        if ($.inArray(category, categories) == -1) {
            categories.push(category);
            const categoryid = category.replace(/ /g, "-").hashCode();
            const categoryrow = $(
                "" +
                '<div id="{0}-row" class="pt-5">'.format(categoryid) +
                '<div class="category-header col-md-12 mb-3">' +
                "</div>" +
                '<div class="category-challenges col-md-12">' +
                '<div class="challenges-row col-md-12"></div>' +
                "</div>" +
                "</div>"
            );
            categoryrow
                .find(".category-header")
                .append($("<h3>" + category + "</h3>"));

            $challenges_board.append(categoryrow);
        }
    }
    for (let i = 0; i <= challenges.length - 1; i++) {
        const chalinfo = challenges[i];
        const chalid = chalinfo.name.replace(/ /g, "-").hashCode();
        var category = chalinfo.category.split('.')[1];
        if (category === undefined) category = "";
        const page = '{0}-page-row'.format(challenges[i]
            .category.split('.')[0]
            .replace(/ /g, "-").hashCode());
        if (page !== current_page_id) continue;
        const catid = category.replace(/ /g, "-").hashCode();
        const chalwrap = $(
            "<div id='{0}' class='col-md-3 d-inline-block'></div>".format(chalid)
        );
        let chalbutton = $(
            '<button ' +
            'class="btn btn-dark challenge-button w-100 text-truncate pt-3 pb-3 mb-2" ' +
            'value="{0}">'.format(chalinfo.id) +
            '</button>'
        );;

        const chalheader = $("<p>{0}</p>".format(chalinfo.name));
        const chalscore = $("<span>{0}</span>".format(chalinfo.value));
        for (let j = 0; j < chalinfo.tags.length; j++) {
            const tag = "tag-" + chalinfo.tags[j].value.replace(/ /g, "-");
            chalwrap.addClass(tag);
        }

        chalbutton.append(chalheader);
        chalbutton.append(chalscore);
        chalwrap.append(chalbutton);

        $("#" + catid + "-row")
            .find(".category-challenges > .challenges-row")
            .append(chalwrap);
    }
    $(".challenge-button").click(function (event) {
        loadChal(this.value);
        getSolves(this.value);
    });
    markSolves();
}

async function update() {
    await loadUserSolves();
    await loadPages();
}

$(async () => {
    await update();
    if (window.location.hash.length > 0) {
        loadChalByName(decodeURIComponent(window.location.hash.substring(1)));
    }

    $("#submission-input").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#submit-key").click();
        }
    });

    $(".nav-tabs a").click(function (event) {
        event.preventDefault();
        $(this).tab("show");
    });

    $("#challenge-window").on("hidden.bs.modal", function (event) {
        $(".nav-tabs a:first").tab("show");
        history.replaceState("", window.document.title, window.location.pathname);
    });

    $(".challenge-solves").click(function (event) {
        getSolves($("#challenge-id").val());
    });

    $("#challenge-window").on("hide.bs.modal", function (event) {
        $("#submission-input").removeClass("wrong");
        $("#submission-input").removeClass("correct");
        $("#incorrect-key").slideUp();
        $("#correct-key").slideUp();
        $("#already-solved").slideUp();
        $("#too-fast").slideUp();
    });
});
setInterval(update, 300000); // Update every 5 minutes.

const displayHint = data => {
    ezAlert({
        title: "Hint",
        body: md.loadUserSolves(data.content),
        button: "Got it!"
    });
};

const displayUnlock = id => {
    ezQuery({
        title: "Unlock Hint?",
        body: "Are you sure you want to open this hint?",
        success: () => {
            const params = {
                target: id,
                type: "hints"
            };
            CTFd.api.post_unlock_list({}, params).then(response => {
                if (response.success) {
                    CTFd.api.get_hint({ hintId: id }).then(response => {
                        displayHint(response.data);
                    });

                    return;
                }

                ezAlert({
                    title: "Error",
                    body: md.render(response.errors.score),
                    button: "Got it!"
                });
            });
        }
    });
};

const loadHint = id => {
    CTFd.api.get_hint({ hintId: id }).then(response => {
        if (response.data.content) {
            displayHint(response.data);
            return;
        }

        displayUnlock(id);
    });
};
