"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

import * as commands from "@uiw/react-md-editor/commands";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

function MarkdownPreview({ value }: any) {
  return (
    <div>
      <MDEditor
        value={value}
        preview="preview"
        hideToolbar={true}
        draggable={false}
        visibleDragbar={false}
      />
    </div>
  );
}

export default MarkdownPreview;
