import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  BlockTypeSelect,
  CodeToggle,
  CreateLink,
  Select,
  DiffSourceToggleWrapper,
  InsertThematicBreak,
  Separator,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  ShowSandpackInfo,
  InsertSandpack,
  InsertCodeBlock,

} from "@mdxeditor/editor";
import {
  thematicBreakPlugin,
  quotePlugin,
  headingsPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  imagePlugin,
  listsPlugin,
  codeBlockPlugin,
  sandpackPlugin,
  codeMirrorPlugin
} from '@mdxeditor/editor'

import "@mdxeditor/editor/style.css";
const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim()
const simpleSandpackConfig = {
  defaultPreset: "react",
  presets: [
    {
      label: "React",
      name: "react",
      meta: "live react",
      sandpackTemplate: "react",
      sandpackTheme: "light",
      snippetFileName: "/App.js",
      snippetLanguage: "jsx",
      initialSnippetContent: defaultSnippetContent,
    },
  ],
};

export default function RTE({ name, control, label, defaultValue = "" }) {
  const [value, setValue] = useState(defaultValue);



  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange } }) => (
          <MDXEditor
            markdown={defaultValue}
            onChange={(newValue) => {
              setValue(newValue); // Update local state
              onChange(newValue); // Pass content to react-hook-form
            }}
            placeholder="Write your content here..."
            // height={300}
            plugins={[
              thematicBreakPlugin(),
              quotePlugin(),
              headingsPlugin(),
              linkPlugin(),
              listsPlugin(),
              markdownShortcutPlugin(),
              codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
              sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
              codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS' } }),
              toolbarPlugin({
                toolbarClassName: 'my-classname',
                toolbarContents: () => (
                  <>
                    {' '}
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <Separator />

                    <BlockTypeSelect />
                    <CodeToggle />
                    <CreateLink />
                    <Separator/>
                    <ConditionalContents
            options={[
                { when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
                { when: (editor) => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo /> },
                { fallback: () => ( <> 
                <InsertCodeBlock />
                <InsertSandpack />
              </>) }
              ]}
            />

                    <Separator />
                    <DiffSourceToggleWrapper />

                  </>
                )
              })
            ]}

          >
          </MDXEditor>
        )}
      />
    </div>
  );
}
