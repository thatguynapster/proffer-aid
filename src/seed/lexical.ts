/**
 * Minimal Lexical editor-state builders.
 *
 * Payload stores rich text as a serialized Lexical tree, not HTML or markdown,
 * so seeded content has to be constructed in that shape. These cover the node
 * types the salvaged content actually uses — paragraphs, headings, lists.
 */

type TextNode = {
  type: 'text'
  detail: number
  format: number
  mode: 'normal'
  style: string
  text: string
  version: number
}

const text = (value: string): TextNode => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text: value,
  version: 1,
})

const base = {
  format: '' as const,
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
}

export const p = (value: string) => ({
  ...base,
  type: 'paragraph',
  textFormat: 0,
  textStyle: '',
  children: [text(value)],
})

export const h = (tag: 'h2' | 'h3', value: string) => ({
  ...base,
  type: 'heading',
  tag,
  children: [text(value)],
})

export const ul = (items: string[]) => ({
  ...base,
  type: 'list',
  listType: 'bullet' as const,
  start: 1,
  tag: 'ul' as const,
  children: items.map((item, index) => ({
    ...base,
    type: 'listitem',
    value: index + 1,
    checked: undefined,
    children: [text(item)],
  })),
})

type Node = ReturnType<typeof p> | ReturnType<typeof h> | ReturnType<typeof ul>

export const doc = (...children: Node[]) => ({
  root: {
    ...base,
    type: 'root',
    children,
  },
})
