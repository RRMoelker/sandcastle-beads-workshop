// Wraps runnable content on slides marked `runnable: true` in frontmatter:
//   - ```bash / ```sh / ```shell / ```zsh fenced blocks -> <RunnableBlock>
//   - inline `code` spans                                -> <RunnableInline>
// Both components send the code to the local dev-server runner (see
// setup/vite-plugins.ts) and are only ever present on the "Demo time" slides
// that opt in, so the rest of the deck is untouched.

const FENCE_RE = /```(bash|sh|shell|zsh)\n([\s\S]*?)```/g;
const INLINE_CODE_RE = /(^|[^`])`([^`\n]+)`(?!`)/g;

function toB64(str: string): string {
  return Buffer.from(str, "utf-8").toString("base64");
}

function wrapRunnable(content: string): string {
  content = content.replace(FENCE_RE, (_match, lang: string, code: string) => {
    const trimmed = code.endsWith("\n") ? code.slice(0, -1) : code;
    const b64 = toB64(trimmed);
    return `<RunnableBlock code-b64="${b64}">\n\n\`\`\`${lang}\n${code}\`\`\`\n\n</RunnableBlock>`;
  });

  // Skip inline-code replacement inside the blocks we just wrapped.
  const segments = content.split(/(<RunnableBlock[\s\S]*?<\/RunnableBlock>)/g);
  content = segments
    .map((segment, i) => {
      if (i % 2 === 1) return segment; // already-wrapped block
      return segment.replace(INLINE_CODE_RE, (_match, pre: string, code: string) => {
        return `${pre}<RunnableInline code-b64="${toB64(code)}" />`;
      });
    })
    .join("");

  return content;
}

export default function preparser() {
  return [
    {
      transformSlide(content: string, frontmatter: Record<string, unknown>) {
        if (!frontmatter?.runnable) return undefined;
        let result = wrapRunnable(content);
        // Slides opt into `layout: two-cols` in their own frontmatter; we just
        // supply the right-column content automatically here so every runnable
        // slide gets the shared terminal panel without hand-editing each one.
        if (!result.includes("::right::")) {
          result += "\n\n::right::\n\n<Terminal />\n";
        }
        return result;
      },
    },
  ];
}
