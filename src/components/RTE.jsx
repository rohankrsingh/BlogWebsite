import React, { useState, useRef } from "react";
import { Controller } from "react-hook-form";
import appwriteService from "../appwrite/config";
import conf from "../conf/conf";
import {
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  BlockTypeSelect,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertThematicBreak,
  Separator,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  ShowSandpackInfo,
  InsertSandpack,
  InsertCodeBlock,
  ListsToggle,
  InsertTable,
  InsertImage,


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
  codeMirrorPlugin,
  tablePlugin,
  linkDialogPlugin,
  diffSourcePlugin,
} from '@mdxeditor/editor'

import "@mdxeditor/editor/style.css";
import {
  useCodeBlockEditorContext,

} from "@mdxeditor/editor";
import { mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx'
import "@mdxeditor/editor/style.css";
import SyntaxHighlighter from "react-syntax-highlighter";


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
  const [value, setValue] = useState(defaultValue || defaultSnippetContent);
  async function imageUploadHandler(file) {
    if (!file) {
      console.error("No file provided for upload.");
      return null;
    }
  
    try {
      const uploadedFile = await appwriteService.uploadFile(file);
  
      if (uploadedFile) {
        const bucketId = conf.appwriteBucketId; // Replace with your actual bucket ID
        const projectId = conf.appwriteProjectId; // Replace with your actual project ID
        const fileId = uploadedFile.$id; // Assuming the uploaded file has an `$id` field
        console.log(fileId);
        return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/preview?project=${projectId}`;
      }
    } catch (error) {
      console.error("File upload failed:", error);
      return null;
    }
  }
  
  // const mdxEditorRef = useRef < MDXEditorMethods > (null);

  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        // ref={mdxEditorRef}
        defaultValue={defaultValue}
        render={({ field: { onChange } }) => (
          <MDXEditor
            markdown={defaultValue}
            onChange={(newValue) => {
              setValue(newValue); // Update local state
              onChange(newValue); // Pass content to react-hook-form
            }}
            className="dark-theme dark-editor"
            placeholder="Write your content here..."
            // height={300}
            plugins={[
              thematicBreakPlugin(),
              quotePlugin(),
              headingsPlugin(),
              listsPlugin(),
              linkPlugin(),
              linkDialogPlugin({}),
              markdownShortcutPlugin(),
              tablePlugin(),
              imagePlugin({
                imageUploadHandler, 
              }),
              diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
              codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
              sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
              codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS' } }),
              toolbarPlugin({
                toolbarClassName: 'my-classname',
                toolbarContents: () => (
                  <div className="w-full flex justify-between">
                    <DiffSourceToggleWrapper>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <Separator />
                    <ListsToggle />
                    <Separator />
                    <BlockTypeSelect />
                    <Separator />
                    <CreateLink />
                    <InsertImage />
                    <InsertTable />
                    <InsertThematicBreak />

                    <Separator />
                    <ConditionalContents
                      options={[
                        { when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
                        { when: (editor) => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo /> },
                        {
                          fallback: () => (<>
                            <InsertCodeBlock />
                            <InsertSandpack />
                          </>)
                        }
                      ]}
                    />

                    <Separator />
                    </DiffSourceToggleWrapper>

                  </div>
                )
              }),
              //   jsxPlugin({
              //   jsxComponentDescriptors: [

              //     {
              //       name: "CodeGroup",
              //       kind: "flow",
              //       hasChildren: true,
              //       props: [],
              //       Editor: () => {
              //         return (
              //           <div
              //             style={{
              //               border: "1px solid red",
              //               padding: 8,
              //               margin: 8,
              //               display: "inline-block",
              //             }}
              //           >
              //             <NestedLexicalEditor MdxJsxTextElement
              //               getContent={(node) => node.children}

              //               getUpdatedMdastNode={(mdastNode, children) => {
              //                 return { ...mdastNode, children };
              //               }}
              //             />
              //           </div>
              //         );
              //       },
              //     },
              //     {
              //       name: "*",
              //       kind: "flow",
              //       hasChildren: false,
              //       props: [],
              //       Editor: ({ mdastNode }) => {
              //         // you can read the attributes of the JSX node here.
              //         // A more convoluted example is present here: https://github.com/mdx-editor/editor/blob/c6d1067dbe4faeb18246a27988d9b4c334565551/src/jsx-editors/GenericJsxEditor.tsx?plain=1#L40
              //         void mdastNode;
              //         const updateMdastNode = useMdastNodeUpdater();
              //         // here, you can render a custom component for the JSX node.
              //         return (
              //           <div>
              //             Unknown element
              //             <button
              //               onClick={() => {
              //                 updateMdastNode({
              //                   attributes: [
              //                     {
              //                       type: "mdxJsxAttribute",
              //                       name: "foo",
              //                       value: "moo",
              //                     },
              //                   ],
              //                 });
              //               }}
              //             >
              //               Change the foo attribute to "moo"
              //             </button>
              //           </div>
              //         );
              //       },
              //     },
              //   ],
              // }),

            ]}

          >
          </MDXEditor>
        )}
      />
    </div>
  );
}
