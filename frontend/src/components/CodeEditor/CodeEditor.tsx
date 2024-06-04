import { useEffect, useRef, useState } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { goLanguage } from "@codemirror/lang-go";
import { Language } from "@codemirror/language";
import { pythonLanguage } from "@codemirror/lang-python";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { monokai } from "@uiw/codemirror-theme-monokai";
import { useSyncedStore } from "@syncedstore/react";
import { store, websocketProvider } from "./store";

interface CodeEditorProps {
  roomId: string;
}

export default function CodeEditor(props: CodeEditorProps) {
  const state = useSyncedStore(store);

  // const socketRef = useRef<null | WebSocket>(null);
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
    const wsp = websocketProvider(props.roomId);
    wsp.connect();
    return () => {
      wsp.disconnect();
    };
  }, [props.roomId]);

  // close dropdown
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
        value={state.text.slice(-1)[0]}
        theme={monokai}
        height="90vh"
        className="code-editor"
        lang="go"
        extensions={[currLang]}
        onChange={(e: string) => state.text.push(e)}
      />
    </div>
  );
}
