import Alpine from "alpinejs";
import CTFd from "./index";

window.CTFd = CTFd;
window.Alpine = Alpine;

CTFd.events.counter.unread.readAll();
CTFd.events.controller.broadcast("counter", {
  count: CTFd.events.counter.unread.getAll().length,
});

Alpine.start();
