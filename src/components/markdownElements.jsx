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
    h1: ({ children }) => <h1 className="text-3xl">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold">{children}</h2>,
    p: ({ children }) => <p className="text-lg font-light tracking-wide mb-4">{children}</p>,
    a: ({ href, children }) => (
        <a href={href} className="text-blue-500 hover:underline">{children}</a>
    ),
    img: ({ src, alt }) => <Image src={src} alt={alt} className="rounded-small z-0" />,
    strong: ({ children }) => <strong className="text-xl font-bold">{children}</strong>,
    table: ({ children }) => {
        const [thead, tbody] = React.Children.toArray(children);
    
        const columns = React.Children.map(
            thead.props.children.props.children,
            (th, index) => ({
                key: `col${index}`,
                label: th.props.children,
            })
        );
    
        const rows = React.Children.map(tbody.props.children, (tr, rowIndex) => {
            const cells = React.Children.map(tr.props.children, (td, colIndex) => td.props.children);
            return {
                key: `row${rowIndex}`,
                ...Object.fromEntries(
                    cells.map((cell, i) => [`col${i}`, cell])
                ),
            };
        });
    
        return (
            <Table aria-label="Markdown Table" isHeaderSticky 
            classNames={{
             
            }}
            >
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key} >{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={rows}>
                    {(item) => (
                        <TableRow key={item.key} className="max-w-20">
                            {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        );
    }

};


export default markdownElements;