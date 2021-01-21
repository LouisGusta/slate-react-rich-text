import { render } from '@testing-library/react'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { createEditor, Editor, Transforms, Text } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { AiOutlineBold, AiOutlineLeft, AiOutlineRight, AiOutlineLineHeight, AiOutlineItalic } from "react-icons/ai"


import './TextEditor.css'

const CustomEditor = {
    isBoldMarkActive(editor) {
        const [match] = Editor.nodes(
            editor,
            {
                match: n => n.bold === true,
                universal: true,
            })
        return !!match
    },

    isCodeBlockActive(editor) {
        const [match] = Editor.nodes(
            editor,
            {
                match: n => n.type === 'code',
            })
        return !!match
    },
    isTitleActive(editor) {
        const [match] = Editor.nodes(
            editor,
            {
                match: n => n.type === 'title',
            })
        return !!match
    },

    isItalicMarkActive(editor) {
        const [match] = Editor.nodes(
            editor,
            {
                match: n => n.italic === true,
                universal: true,
            })
        return !!match
    },

    toggleBoldMark(editor) {
        const isActive = CustomEditor.isBoldMarkActive(editor)
        Transforms.setNodes(
            editor,
            { bold: isActive ? null : true },
            { match: n => Text.isText(n), split: true }
        )
    },

    toggleItalicMark(editor) {
        const isActive = CustomEditor.isItalicMarkActive(editor)
        Transforms.setNodes(
            editor,
            { italic: isActive ? null : true },
            { match: n => Text.isText(n), split: true }
        )
    },

    toggleCodeBlock(editor) {
        const isActive = CustomEditor.isCodeBlockActive(editor)
        Transforms.setNodes(
            editor,
            { type: isActive ? null : 'code' },
            { match: n => Editor.isBlock(editor, n) }
        )
    },

    toggleTitleMark(editor) {
        const isActive = CustomEditor.isTitleActive(editor)
        Transforms.setNodes(
            editor,
            { type: isActive ? null : 'title' },
            { match: n => Editor.isBlock(editor, n) }
        )
    }
}

const TextEditor = () => {
    const editor = useMemo(() => withReact(createEditor()), [])
    const [value, setValue] = useState([
        {
            type: 'title',
            children: [{ text: 'Aqui vai um título' }],
        },
        {

            type: 'paragraph',
            children: [{ text: '' }],

        },
        {

            type: 'paragraph',
            children: [{ text: 'Aqui um texto normal' }],

        },
        {

            type: 'paragraph',
            children: [{ text: '' }],

        },
        {
            type: 'paragraph',
            children: [{
                text: 'Aqui um texto em negrito e itálico',
                bold: 'true',
                italic: 'true',
            }],
        }
    ])

    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case 'code':
                return <CodeElement {...props} />
            case 'title':
                return <TitleElement {...props} />
            default:
                return <DefaultElement {...props} />
        }
    }, [])

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])

    return (
        <div className='container'>
            <Slate
                editor={editor}
                value={value}
                onChange={value => setValue(value)}
            >

                <div className='btn-content'>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleTitleMark(editor)
                        }}
                    >
                        <AiOutlineLineHeight />
                    </button>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleItalicMark(editor)
                        }}
                    >
                        <AiOutlineItalic />
                    </button>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleBoldMark(editor)
                        }}
                    >
                        <AiOutlineBold />
                    </button>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleCodeBlock(editor)
                        }}
                    >
                        <AiOutlineLeft /><AiOutlineRight />
                    </button>

                </div>
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={event => {
                        if (!event.ctrlKey) {
                            return
                        }
                        switch (event.code) {
                            case 'BracketLeft': {
                                event.preventDefault()

                                CustomEditor.toggleCodeBlock(editor)
                                break
                            }
                            case 'KeyB': {
                                event.preventDefault()
                                CustomEditor.toggleBoldMark(editor)
                                break
                            }
                            case 'KeyH': {
                                event.preventDefault()
                                CustomEditor.toggleTitleMark(editor)
                                break
                            }
                            case 'KeyI': {
                                event.preventDefault()
                                CustomEditor.toggleItalicMark(editor)
                                break
                            }
                        }
                    }}
                />
            </Slate>
        </div>
    )
}

const TitleElement = props => {
    return (
        <h1 {...props.attributes}>
            {props.children}
        </h1>
    )
}

const Leaf = props => {
    console.log(props.leaf)

    return (
        <span
            {...props.attributes}
            style={
                {
                    fontWeight: props.leaf.bold ? 'bold' : 'normal',
                    fontStyle: props.leaf.italic ? 'italic' : 'normal',
                }}
        >
            { props.children}
        </span >
    )
}



const CodeElement = props => {
    return (
        <pre {...props.attributes}>
            <code>{props.children}</code>
        </pre>
    )
}

const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
}

export default TextEditor
