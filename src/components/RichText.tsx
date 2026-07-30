import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

/**
 * Renders Lexical editor state from the CMS.
 *
 * Uses Payload's own converters rather than hand-written ones, so any node type
 * the editor can produce renders correctly — including ones nobody has used
 * yet. Styling is applied via descendant selectors on `.richtext` (see
 * globals.css) instead of per-node converters, which keeps editor output and
 * presentation decoupled: an editor adding a blockquote or a table gets sane
 * styling without a code change.
 */
export function RichText({
  data,
  className = '',
}: {
  data: unknown
  className?: string
}) {
  if (!data || typeof data !== 'object') return null

  return (
    <div className={`richtext ${className}`}>
      <PayloadRichText data={data as SerializedEditorState} />
    </div>
  )
}
