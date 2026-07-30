type LexicalNode = { type?: string; tag?: string; children?: LexicalNode[]; text?: string }
type LexicalDoc = { root?: { children?: LexicalNode[]; [key: string]: unknown } }

/** Concatenate a node's text content, ignoring formatting. */
export function nodeText(node: LexicalNode): string {
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(nodeText).join('')
}

/** Wrap a subset of nodes back into a valid editor state so it can be rendered
 *  by the normal RichText component. */
function reroot(doc: LexicalDoc, children: LexicalNode[]) {
  return { ...doc, root: { ...(doc.root ?? {}), children } }
}

export type SplitBody = {
  intro: unknown | null
  faqs: { question: string; answer: unknown }[]
}

/**
 * Split a page body into its lead-in and a set of question/answer pairs.
 *
 * The FAQ recovered from the old site is authored as ordinary rich text — an
 * `h2` heading followed by `h3` questions each trailed by their answer. Deriving
 * the accordion from that structure means editors keep writing normal prose in
 * the CMS and get an accordion for free, with no extra schema field to teach
 * them and nothing to keep in sync.
 *
 * If the marker heading isn't present, everything is returned as intro and no
 * accordion renders — so a page that doesn't follow the convention degrades to
 * plain content rather than breaking.
 */
export function splitFaqBody(data: unknown, marker = 'frequently asked questions'): SplitBody {
  if (!data || typeof data !== 'object') return { intro: null, faqs: [] }

  const doc = data as LexicalDoc
  const children = doc.root?.children ?? []

  const markerIndex = children.findIndex(
    (node) =>
      node.type === 'heading' &&
      node.tag === 'h2' &&
      nodeText(node).trim().toLowerCase() === marker,
  )

  if (markerIndex === -1) {
    return { intro: children.length > 0 ? reroot(doc, children) : null, faqs: [] }
  }

  const intro = children.slice(0, markerIndex)
  const rest = children.slice(markerIndex + 1)

  const faqs: { question: string; answer: unknown }[] = []
  let current: { question: string; nodes: LexicalNode[] } | null = null

  for (const node of rest) {
    if (node.type === 'heading' && node.tag === 'h3') {
      if (current) faqs.push({ question: current.question, answer: reroot(doc, current.nodes) })
      current = { question: nodeText(node).trim(), nodes: [] }
    } else if (current) {
      current.nodes.push(node)
    }
  }
  if (current) faqs.push({ question: current.question, answer: reroot(doc, current.nodes) })

  return {
    intro: intro.length > 0 ? reroot(doc, intro) : null,
    faqs: faqs.filter((f) => f.question.length > 0),
  }
}
