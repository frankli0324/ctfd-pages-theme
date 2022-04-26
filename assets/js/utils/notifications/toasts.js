import Alpine from "alpinejs";
import { Toast } from "bootstrap";
import CTFd from "../../index";

export default () => {
  Alpine.store("toast", {title: "", html: ""},);

  CTFd._functions.events.eventToast = (data) => {
      Alpine.store("toast", data);
      new Toast(document.querySelector("[x-ref='toast']")).show();
  }
}
