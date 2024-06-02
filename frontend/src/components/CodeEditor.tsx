// import * as Y from "yjs";
import { useEffect, useRef, useState } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import createTheme from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import { goLanguage } from "@codemirror/lang-go";
import { Language } from "@codemirror/language";
import { pythonLanguage } from "@codemirror/lang-python";
import { javascriptLanguage } from "@codemirror/lang-javascript";

interface CodeEditorProps {
  roomId: string;
}

const myTheme = createTheme({
  theme: `dark`,
  settings: {
    background: "#2E2E2E",
    backgroundImage: "",
    foreground: "DEE2E6",
    caret: "#AEAFAD",
    selection: "#000000",
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
    { tag: t.definitionKeyword, color: "#b05279" },
    { tag: t.self, color: "#9E86C8" },
  ],
});

export default function CodeEditor(props: CodeEditorProps) {
  // const doc = new Y.Doc();
  const socketRef = useRef<null | WebSocket>(null);
  const dropdownRef = useRef<null | HTMLDivElement>(null);
  const langOptions: Language[] = [
    pythonLanguage,
    goLanguage,
    javascriptLanguage,
  ];
  const [currLang, setCurrLang] = useState<Language>(pythonLanguage);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const handleDropdownOptions = (option: Language) => {
    setCurrLang(option);
  };
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [isVisible]);

  useEffect(() => {
    setIsVisible(false);
  }, [currLang]);

  return (
    <div className="editor-container">
      <div className="editor-dropdown" onClick={() => setIsVisible(true)}>
        <div className="dropdown__current">
          <div className="dropdown-text__current">{currLang.name}</div>
          {isVisible ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
            </svg>
          )}
        </div>

        {isVisible && (
          <div ref={dropdownRef}>
            <ul className="dropdown-items">
              {langOptions
                .filter((value: Language) => value != currLang)
                .map((option: Language) => (
                  <div
                    key={option.name}
                    onClick={() => handleDropdownOptions(option)}
                  >
                    {option.name}
                  </div>
                ))}
            </ul>
          </div>
        )}
      </div>
      <ReactCodeMirror
        value={""}
        theme={myTheme}
        height="90vh"
        className="code-editor"
        lang="go"
        extensions={[currLang]}
      />
    </div>
  );
}
