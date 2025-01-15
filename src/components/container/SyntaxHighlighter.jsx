import { Prism as Code } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { forwardRef } from "react";

const SyntaxHighlighter = ({ children }) => {
    const transformCodeBlocks = (node) => {
        if (node.name === "code") {
            const language = node.attribs?.class?.split("-")[1] || "javascript"; // Extract language from class (e.g., class="language-js")
            return (
                <Code language={language} style={dark}>
                    {node.children[0]?.data || ""}
                </Code>
            );
        }
    };
    return (
        <div>
            {transformCodeBlocks({children})}
        </div>
    )
}

export default forwardRef(SyntaxHighlighter);