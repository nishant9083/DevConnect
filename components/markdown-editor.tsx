"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import React, { useContext } from "react";
import {  
  ICommand,
  EditorContext
} from "@uiw/react-md-editor";
import * as commands from "@uiw/react-md-editor/commands";
import rehypeSanitize from "rehype-sanitize";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });


const Button = () => {
    const { preview, dispatch } = useContext(EditorContext);
    const click = () => {
      dispatch!({
        preview: preview === "edit" ? "preview" : "edit"
      });
    };
    if (preview === "edit") {
      return (
        <div className="bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded" onClick={click}>
        Preview
        </div>
      );
    }
    return (
      <div className="bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded" onClick={click}>
        Edit
        </div>
    );
  };
  
  const codePreview: ICommand = {
    name: "preview",
    keyCommand: "preview",
    value: "preview",
    icon: <Button />
  };
  
  

function MarkdownEditor({ value, setValue, placeholder="Write you answer..." }: any) {
  return (
    <div>
      <MDEditor
        value={value}
        preview="edit"        
        // draggable={false}
        // visibleDragbar={false}
        extraCommands={[codePreview]}
        onChange={(val) => {
          setValue(val!);
        }}
        previewOptions={{rehypePlugins: [[rehypeSanitize]],}}
        textareaProps={{ placeholder: placeholder}}

      />
    </div>
  );
}

export default MarkdownEditor;
