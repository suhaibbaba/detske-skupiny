/**
 * One `application/ld+json` block.
 *
 * Structured data has to be a script tag in the document, which means
 * `dangerouslySetInnerHTML` - there is no other way to put a JSON string
 * inside a `<script>`. That makes the escaping below load-bearing rather than
 * decorative: the payloads are built from Sanity content, and a school name
 * containing `</script>` would otherwise close the tag and turn the rest of
 * the JSON into markup.
 *
 * Escaping `<` is enough to make that impossible, and the two line separators
 * are escaped because they are valid in JSON strings but terminate a
 * statement in older JavaScript parsers.
 *
 * The tag is rendered inside the page body rather than the head. Google reads
 * `ld+json` from either, and Next gives a page no way to add arbitrary tags to
 * a `<head>` it owns.
 */
const escapeForScript = (value: unknown) =>
  JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

export default function JsonLd({ data }: { data: unknown }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeForScript(data) }}
    />
  );
}
