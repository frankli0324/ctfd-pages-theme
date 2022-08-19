<<<<<<< HEAD:static/assets/scoreboard.b8bb2b0c.js
import{m as t,C as a}from"./index.e6e907a5.js";import{g as e,e as i}from"./index.ed2c37db.js";import"./echarts.b27105f3.js";window.Alpine=t;window.CTFd=a;t.data("ScoreboardDetail",()=>({data:null,async init(){this.data=await a.pages.scoreboard.getScoreboardDetail(10);let o=e(a.config.userMode,this.data);i(this.$refs.scoregraph,o)}}));t.start();
=======
import{m as t,C as a}from"./index.612e8617.js";import{g as e,e as i}from"./index.8275a941.js";import"./echarts.128204f2.js";window.Alpine=t;window.CTFd=a;t.data("ScoreboardDetail",()=>({data:null,async init(){this.data=await a.pages.scoreboard.getScoreboardDetail(10);let o=e(a.config.userMode,this.data);i(this.$refs.scoregraph,o)}}));t.start();
>>>>>>> d3e38c3afc6058fdfcf6abf0b8c7b55b1ac6c74d:static/assets/scoreboard.89bf9918.js
