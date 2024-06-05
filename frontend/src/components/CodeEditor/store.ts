import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebsocketProvider } from "y-websocket";

export const store = syncedStore({ text: [] as string[], fragment: "xml" });

const doc = getYjsDoc(store);
export const websocketProvider = (roomId: string) => {
  return new WebsocketProvider(
    `${import.meta.env.VITE_EDITOR_WS_URL}`,
    roomId,
    doc,
    { connect: false }
  );
};
