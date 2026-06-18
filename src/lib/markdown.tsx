/**
 * Minimal in-house markdown renderer.
 * Handles: headings (h1–h4), bold, italic, inline code, fenced code blocks,
 * unordered lists, ordered lists, paragraphs, horizontal rules, and line breaks.
 * No external dependency; keeps the bundle lean.
 */
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RenderMarkdownProps {
  children: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Block-level tokeniser
// ---------------------------------------------------------------------------

type Block =
  | { kind: 'heading'; level: 1 | 2 | 3 | 4; text: string }
  | { kind: 'hr' }
  | { kind: 'code'; lang: string; text: string }
  | { kind: 'ulist'; items: string[] }
  | { kind: 'olist'; items: string[] }
  | { kind: 'paragraph'; text: string };

function tokeniseBlocks(md: string): Block[] {
  const lines = md.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ kind: 'code', lang, text: codeLines.join('\n') });
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,4})\s+(.*)/);
    if (headingMatch) {
      const level = Math.min(headingMatch[1].length, 4) as 1 | 2 | 3 | 4;
      blocks.push({ kind: 'heading', level, text: headingMatch[2] });
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      blocks.push({ kind: 'hr' });
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*+]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+]\s/, ''));
        i++;
      }
      blocks.push({ kind: 'ulist', items });
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      blocks.push({ kind: 'olist', items });
      continue;
    }

    // Blank line — skip
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph — collect until blank line
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !/^---+$/.test(lines[i].trim())) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ kind: 'paragraph', text: paraLines.join('\n') });
    }
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// Inline renderer — bold, italic, inline code
// ---------------------------------------------------------------------------

function renderInline(text: string): ReactNode[] {
  // Split on **bold**, *italic*, `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={idx}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
          {part.slice(1, -1)}
        </code>
      );
    }
    // Preserve \n as <br />
    const lines = part.split('\n');
    return lines.map((l, li) => (
      <span key={`${idx}-${li}`}>
        {l}
        {li < lines.length - 1 && <br />}
      </span>
    ));
  });
}

// ---------------------------------------------------------------------------
// Block renderer
// ---------------------------------------------------------------------------

function renderBlock(block: Block, idx: number): ReactNode {
  switch (block.kind) {
    case 'heading': {
      const Tag = `h${block.level}` as 'h1' | 'h2' | 'h3' | 'h4';
      const sizeClass = {
        1: 'text-2xl font-bold mt-6 mb-2',
        2: 'text-xl font-semibold mt-5 mb-2',
        3: 'text-base font-semibold mt-4 mb-1',
        4: 'text-sm font-semibold mt-3 mb-1',
      }[block.level];
      return (
        <Tag key={idx} className={sizeClass}>
          {renderInline(block.text)}
        </Tag>
      );
    }
    case 'hr':
      return <hr key={idx} className="my-4 border-border" />;
    case 'code':
      return (
        <pre key={idx} className="my-3 overflow-x-auto rounded-md bg-muted p-4 text-xs font-mono">
          <code>{block.text}</code>
        </pre>
      );
    case 'ulist':
      return (
        <ul key={idx} className="my-2 ml-5 list-disc space-y-1 text-sm">
          {block.items.map((item, ii) => (
            <li key={ii}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    case 'olist':
      return (
        <ol key={idx} className="my-2 ml-5 list-decimal space-y-1 text-sm">
          {block.items.map((item, ii) => (
            <li key={ii}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    case 'paragraph':
      return (
        <p key={idx} className="my-2 text-sm leading-relaxed">
          {renderInline(block.text)}
        </p>
      );
  }
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export function Markdown({ children, className }: RenderMarkdownProps) {
  const blocks = tokeniseBlocks(children);
  return (
    <div className={cn('text-foreground', className)}>
      {blocks.map((b, i) => renderBlock(b, i))}
    </div>
  );
}
