import React, { useState } from "react";
import { Controller } from "react-hook-form";
import appwriteService from "../appwrite/config";
import conf from "../conf/conf";
import { Card } from "./ui";
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
    <div className=" !text-[--primary] overflow-x-auto">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        // ref={mdxEditorRef}
        defaultValue={defaultValue}
        render={({ field: { onChange } }) => (
          <Card className="border-none rte-container">
            <MDXEditor
            markdown={defaultValue}
            onChange={(newValue) => {
              setValue(newValue); // Update local state
              onChange(newValue); // Pass content to react-hook-form
            }}
            className="!bg-[--card] min-h-96"
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
              codeMirrorPlugin({ codeBlockLanguages: { text:'text', js: 'JavaScript', css: 'CSS', html: 'HTML' } }),
              toolbarPlugin({
                toolbarClassName: 'toolbar',
                toolbarContents: () => (
                  <span className=" flex flex-row flex-wrap justify-between w-full items-center p-2 overflow-x-hidden max-md:justify-normal">
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

                  </span>
                )
              }),


            ]}

          >
          </MDXEditor>

          </Card>
          
        )}
      />
    </div>
  );
}
