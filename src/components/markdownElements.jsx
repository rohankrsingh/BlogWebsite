import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Prism as Code } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Image } from "@heroui/react";
import React from "react";

const renderCodeBlock = ({ inline, className, children }) => {
    const language = className ? className.replace("language-", "") : "javascript";
    return !inline ? (
        <ScrollArea className="whitespace-nowrap rounded-md border">
            <Code
                language={language}
                style={nightOwl}
                customStyle={{
                    margin: '0',
                    borderRadius: '0.5rem',
                    backgroundColor: 'black',
                    overflow: 'auto',
                }}
                wrapLongLines={true}
            >
                {String(children).trim()}
            </Code>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    ) : (
        <code className={className}>{children}</code>
    );
};

const markdownElements = {
    code: renderCodeBlock,
    h1: ({ children }) => <h1 className="text-3xl mt-8 mb-4 font-bold">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl mt-6 mb-3 font-semibold">{children}</h2>,
    p: ({ children }) => <p className="text-lg font-light tracking-wide mb-4">{children}</p>,
    a: ({ href, children }) => (
        <a href={href} className="text-blue-500 hover:underline">{children}</a>
    ),
    img: ({ src, alt }) => <Image src={src} alt={alt} className="rounded-small z-0" />,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>, // Removed text-xl
    table: ({ children }) => {
        const childrenArray = React.Children.toArray(children);
        const thead = childrenArray.find(child => child?.type === 'thead');
        const tbody = childrenArray.find(child => child?.type === 'tbody');

        if (!thead || !tbody) {
            console.warn('Malformed table: missing thead or tbody');
            return null;
        }

        const headerRows = React.Children.toArray(thead.props.children);
        const firstHeaderRow = headerRows[0];
        const columnElements = firstHeaderRow ? React.Children.toArray(firstHeaderRow.props.children) : [];

        const columns = columnElements.map((th, index) => ({
            key: `col${index}`,
            label: th?.props?.children || `Column ${index + 1}`,
        }));

        const rows = React.Children.map(tbody.props.children, (tr, rowIndex) => {
            const cells = React.Children.toArray(tr.props.children);
            return {
                key: `row${rowIndex}`,
                ...Object.fromEntries(
                    cells.map((td, colIndex) => [
                        `col${colIndex}`,
                        td?.props?.children || '',
                    ])
                ),
            };
        });

        return (
            <Table
            fullWidth={false}
                aria-label="Markdown Table"
                isHeaderSticky
                classNames={{
                    wrapper: "shadow-none border rounded-xl ",
                    th: "text-left text-sm font-bold text-foreground-800 bg-background-200",
                    tbody: "text-balance",
                    td: "whitespace-normal break-words text-balance"
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={rows} >
                    {(item) => (
                        <TableRow key={item.key}>
                            {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        );
    },

    ul: ({ children }) => <ul className="list-disc pl-5 space-y-2 mb-4">{children}</ul>, // Added list styling
    ol: ({ children }) => <ol className="list-decimal pl-5 space-y-2 mb-4">{children}</ol>, // Added list styling
    li: ({ children }) => <li>{children}</li>, // Added list item
    hr: () => <hr className="my-8 border-t border-border" />, // Added horizontal rule
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-accent pl-4 py-2 italic text-foreground-700 mb-4">
            {children}
        </blockquote>
    ),

};


export default markdownElements;