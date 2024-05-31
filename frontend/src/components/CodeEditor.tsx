// import * as Y from "yjs";
import { useEffect, useRef } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import createTheme from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import { go } from "@codemirror/lang-go";

interface CodeEditorProps {
  roomId: string;
}

const myTheme = createTheme({
  theme: `dark`,
  settings: {
    background: "#353535",
    backgroundImage: "",
    foreground: "DEE2E6",
    caret: "#AEAFAD",
    selection: "#D6D6D6",
    selectionMatch: "#D6D6D6",
    gutterBackground: "#212121",
    gutterForeground: "#fefefe",
    gutterBorder: "#212121",
    gutterActiveForeground: "",
    lineHighlight: "#6C757D",
  },
  styles: [
    { tag: t.comment, color: "#00F5D4" },
    { tag: t.definition(t.typeName), color: "#194A7B" },
    { tag: t.typeName, color: "#00BBF9" },
    { tag: t.tagName, color: "#008A02" },
    { tag: t.variableName, color: "#FEE440" },
    { tag: t.literal, color: "#C8B6FF" },
  ],
});

export default function CodeEditor(props: CodeEditorProps) {
  // const doc = new Y.Doc();
  const socketRef = useRef<null | WebSocket>(null);
  useEffect(() => {
    if (props.roomId == "") {
      return;
    }
    const socket = new WebSocket(`ws://localhost:8080/ws/${props.roomId}`);
    socket.addEventListener("open", () => {
      socketRef.current = socket;
    });
    socket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
    });

    return () => {
      socket.close();
    };
  }, [props.roomId]);

  return (
    <div className="editor-container">
      <div className="editor-dropdown">dropdown</div>
      <ReactCodeMirror
        value={"mewo mewom meow"}
        theme={myTheme}
        height="90vh"
        className="code-editor"
        lang="go"
        extensions={[go()]}
      />
    </div>
  );
}
