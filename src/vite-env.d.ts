/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_SERVER: string;
  readonly VITE_SOCKET_API_SERVER: string;
  readonly VITE_SOCKET_SERVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
