import Alpine from "alpinejs";
import { Modal } from "bootstrap";

import CTFd from "../../index";

export default () => {
  Alpine.store("modal", {title: "", html: ""},);

  CTFd._functions.events.eventAlert = (data) => {
      Alpine.store("modal", data);
      new Modal(document.querySelector("[x-ref='modal']")).show();
  }
}
