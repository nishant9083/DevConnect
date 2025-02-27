'use client'

import { type Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
  Link as LinkIcon,
  HighlighterIcon,
  Terminal,
  Image as ImageIcon,
  X
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface ToolbarProps {
  editor: Editor | null
}

export function Toolbar({ editor }: ToolbarProps) {
  const [isLinkOpen, setIsLinkOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [isCodeBlockPopupOpen, setIsCodeBlockPopupOpen] = useState(false)
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')

  if (!editor) {
    return null
  }

  const setLink = () => {
    const hasSelection = !editor.state.selection.empty
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    if (!hasSelection) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text: url,
          marks: [{ type: 'link', attrs: { href: url } }],
        })
        .run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
    
    setUrl('')
    setIsLinkOpen(false)
  }

  const languages = [
    { value: 'plaintext', label: 'Plain Text' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'python', label: 'Python' },
    { value: 'rust', label: 'Rust' },
    { value: 'go', label: 'Go' },
    { value: 'bash', label: 'Bash' },
    { value: 'sql', label: 'SQL' },
  ]

  const handleCodeBlockToggle = () => {
    if (editor.isActive('codeBlock')) {
      editor.chain().focus().toggleCodeBlock().run()
      setIsCodeBlockPopupOpen(false)
    } else {
      setIsCodeBlockPopupOpen(true)
      editor.chain().toggleCodeBlock().setCodeBlock({ language: 'plaintext' }).run()
    }
  }

  const insertImage = () => {
    if (imageUrl) {
      editor
        .chain()
        .focus()
        .setImage({ 
          src: imageUrl,
          alt: imageAlt                    
        })
        .run()
      setImageUrl('')
      setImageAlt('')
      setIsImagePopupOpen(false)
    }
  }

  return (
    <div className="border-b p-1">
      <div className="flex flex-wrap items-center gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('strike')}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('code')}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </Toggle>
        <Popover open={isCodeBlockPopupOpen} onOpenChange={setIsCodeBlockPopupOpen}>
          <PopoverTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive('codeBlock')}
              onPressedChange={handleCodeBlockToggle}
            >
              <Terminal className="h-4 w-4" />
            </Toggle>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-1" side="bottom">
            <Select
              value={editor.isActive('codeBlock') ? editor.getAttributes('codeBlock').language : 'plaintext'}
              onValueChange={(language) => {
                setIsCodeBlockPopupOpen(false)
                editor
                  .chain()
                  .focus()
                  .setCodeBlock({ language })
                  .run()
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PopoverContent>
        </Popover>
        <Toggle
          size="sm"
          pressed={editor.isActive('highlight')}
          onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
        >
          <HighlighterIcon className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 1 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 3 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('blockquote')}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Popover open={isLinkOpen} onOpenChange={setIsLinkOpen}>
          <PopoverTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive('link')}
            >
              <LinkIcon className="h-4 w-4" />
            </Toggle>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Paste link"
                className="flex-1"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setLink()
                  }
                }}
              />
              <Button onClick={setLink}>Add</Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={isImagePopupOpen} onOpenChange={setIsImagePopupOpen}>
          <PopoverTrigger asChild>
            <Toggle size="sm">
              <ImageIcon className="h-4 w-4" />
            </Toggle>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <div className="space-y-2">
              <Input
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Input
                placeholder="Alt text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={insertImage}>Add Image</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {editor.isActive('link') && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().unsetLink().run()}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          type='button'
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type='button'
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 