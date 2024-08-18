import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app
  .use(router)
  .use(createPinia())
  .use(
    createVuetify({
      components,
      directives,
      icons: {
        defaultSet: "mdi",
        sets: {
          mdi,
        },
      },
    }),
  )
  .use(Toast)
  .mount("#app");
