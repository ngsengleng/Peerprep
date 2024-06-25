import { useEffect, useRef, useState } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { goLanguage } from "@codemirror/lang-go";
import { Language } from "@codemirror/language";
import { pythonLanguage } from "@codemirror/lang-python";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { monokai } from "@uiw/codemirror-theme-monokai";
import { useSyncedStore } from "@syncedstore/react";
import { store, codeWebsocketProvider } from "./store";
import { WebsocketProvider } from "y-websocket";

interface CodeEditorProps {
  roomId: string;
}

export default function CodeEditor(props: CodeEditorProps) {
  const state = useSyncedStore(store);

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
    let code: string = "";
    if (state.contents.slice(-1)[0] != null) {
      code = state.contents.slice(-1)[0].text;
    }
    state.contents.push({ text: code, language: option.name });
  };
  useEffect(() => {
    if (props.roomId === "") {
      return;
    }
    const wsp: WebsocketProvider = codeWebsocketProvider(props.roomId);
    wsp.connect();

    return () => {
      wsp.disconnect();
    };
  }, [props.roomId, state.contents]);

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

  // TODO: this is a hacky workaround for syncing language options in two browers until
  // I figure out how to make changes to the state.contents array recognisable as a side effect
  // eslint-disable-next-line
  useEffect(() => {
    if (state.contents.slice(-1)[0] == null) {
      return;
    }
    const lang: string = state.contents.slice(-1)[0].language;
    if (lang === currLang.name) {
      return;
    }
    let option: Language;
    switch (lang) {
      case "python":
        option = pythonLanguage;
        break;
      case "go":
        option = goLanguage;
        break;
      case "javascript":
        option = javascriptLanguage;
        break;
      default:
        option = javascriptLanguage;
    }
    setCurrLang(option);
  });
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
        value={
          state.contents.slice(-1)[0] ? state.contents.slice(-1)[0].text : ""
        }
        theme={monokai}
        height="90vh"
        className="code-editor"
        lang="go"
        extensions={[currLang]}
        onChange={(e: string) => {
          state.contents.push({ text: e, language: currLang.name });
        }}
      />
    </div>
  );
}
