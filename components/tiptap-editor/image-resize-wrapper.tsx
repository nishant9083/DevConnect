'use client'

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { useState, useCallback } from 'react'

export function ImageResizeWrapper(props: any) {
  const [size, setSize] = useState({ width: props.node.attrs.width, height: props.node.attrs.height })
  const [isResizing, setIsResizing] = useState(false)

  const onResize = useCallback((event: MouseEvent) => {
    if (!isResizing) return

    const newWidth = Math.max(50, event.pageX - props.getPos())
    setSize({ width: newWidth, height: 'auto' })
    props.updateAttributes({ width: newWidth, height: 'auto' })
  }, [isResizing, props])

  return (
    <NodeViewWrapper className="relative image-wrapper" draggable>
      <img 
        src={props.node.attrs.src}
        alt={props.node.attrs.alt || ''}
        style={{ width: size.width, height: size.height }}
        className="rounded-md max-w-full"
      />
      <div 
        className="absolute right-0 bottom-0 w-3 h-3 cursor-se-resize"
        onMouseDown={() => setIsResizing(true)}
        onMouseUp={() => setIsResizing(false)}
        onMouseMove={onResize as any}
      />
    </NodeViewWrapper>
  )
} 