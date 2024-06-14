import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebsocketProvider } from "y-websocket";

export type CodeContent = {
  text: string;
  language: string;
};
export const store = syncedStore({
  contents: [] as CodeContent[],
});

const doc = getYjsDoc(store);
export const codeWebsocketProvider = (roomId: string) => {
  return new WebsocketProvider(
    `${import.meta.env.VITE_EDITOR_WS_URL}/code`,
    roomId,
    doc,
    { connect: false, maxBackoffTime: 50000 } // 5 minute between reconnects maximum
  );
};
