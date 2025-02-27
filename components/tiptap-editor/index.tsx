'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import Link from '@tiptap/extension-link'
import Image from "@tiptap/extension-image";
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Highlight from '@tiptap/extension-highlight'
import { Toolbar } from './toolbar'
import { cn } from '@/lib/utils'
import { common, createLowlight } from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { ImageResizeWrapper } from './image-resize-wrapper'

import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import html from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import rust from 'highlight.js/lib/languages/rust'
import go from 'highlight.js/lib/languages/go'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'

// Create a new lowlight instance
const lowlight = createLowlight()

// Register the languages
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('python', python)
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('rust', rust)
lowlight.register('go', go)
lowlight.register('sql', sql)
lowlight.register('bash', bash)

export interface TiptapEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  editable?: boolean
  className?: string,
  showToolbar?: boolean
  stickyToolbar?: boolean
}

export function TiptapEditor({
  content = '',
  onChange,
  placeholder = 'Start writing...',
  editable = true,
  className,
  showToolbar = true,
  stickyToolbar = true,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-outside leading-3 ml-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-outside leading-3 ml-4',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'leading-normal',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 dark:border-gray-700',
          },
        },
        codeBlock: false,
        code: {
          HTMLAttributes: {
            class: 'rounded-md bg-muted px-1.5 py-1 font-mono font-medium dark:bg-muted',
          },
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-md',
          resizable: true,
          draggable: true,
          nodeView: ImageResizeWrapper,
        },        
        allowBase64: true,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4],
        HTMLAttributes: {
          class: 'font-bold leading-tight',
          levels: {
            1: 'text-4xl',
            2: 'text-3xl',
            3: 'text-2xl',
            4: 'text-xl',
          },
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'text-blue-500 underline underline-offset-4 hover:text-blue-600',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose pl-2',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'flex items-start my-4',
        },
        nested: true,
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-300 dark:bg-yellow-900 px-1 rounded',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'rounded-md bg-muted px-1.5 py-1 font-mono font-medium dark:bg-muted',
        },
      }),
    ],
    content,
    editable,
    editorProps: {
      handleDrop: function (view, event, slice, moved) {
        if (!moved && event.dataTransfer?.files.length) {
          return true
        }
        return false
      },
      attributes: {
        class: cn(
          'prose prose-gray dark:prose-invert max-w-none min-h-[300px] focus:outline-none',
          'prose-img:max-h-[300px] prose-img:object-contain',
          'prose-headings:mb-3 prose-headings:mt-6 prose-headings:font-bold prose-headings:tracking-tight',
          'prose-p:leading-7 prose-p:mb-3',
          'prose-li:my-2',
          'prose-code:rounded-md prose-code:bg-gray-200 prose-code:px-1.5 prose-code:py-1 prose-code:font-mono prose-code:font-medium dark:prose-code:bg-gray-800',
          'prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 dark:prose-blockquote:border-gray-700',
          className
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
    enableInputRules: true,
    enablePasteRules: true,
    immediatelyRender: false
  })

  return (
    <div className="relative min-h-[400px] w-full bg-background">
      {showToolbar && (
        <div className={cn(
          "border-b bg-background",
          stickyToolbar && "sticky top-16 z-50"
        )}>
          <Toolbar editor={editor} />
        </div>
      )}
      <div className="min-h-[400px] p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
} 