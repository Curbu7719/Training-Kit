import { useState } from 'react';
import { ChevronDown, ChevronRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Markdown } from '@/lib/markdown';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Parsing
//
// HintPanel reads the section of body_md that appears AFTER the first `---`
// separator. Authors structure that section as:
//
//   ## Alternative phrasings
//   ### Phrasing 1
//   ...
//   ### Phrasing 2
//   ...
//   ## Hints
//   ### H1
//   ...
//   ### H2
//   ...
//   ### H3
//   ...
//   ## FAQ
//   ### Q: ...
//   A: ...
//
// All sections are optional; the panel renders gracefully if absent.
// ---------------------------------------------------------------------------

interface ParsedHints {
  phrasings: { title: string; body: string }[];
  hints: string[]; // H1, H2, H3 in order
  faq: { q: string; a: string }[];
}

function parseHintSection(section: string): ParsedHints {
  const phrasings: ParsedHints['phrasings'] = [];
  const hints: string[] = [];
  const faq: ParsedHints['faq'] = [];

  // Split into h2 sections
  const h2Sections = section.split(/^## /m).filter(Boolean);

  for (const h2 of h2Sections) {
    const [rawTitle, ...bodyLines] = h2.split('\n');
    const title = rawTitle.trim().toLowerCase();
    const body = bodyLines.join('\n').trim();

    if (title.includes('alternative') || title.includes('phrasing')) {
      // Split by h3
      const h3s = body.split(/^### /m).filter(Boolean);
      for (const h3 of h3s) {
        const [h3Title, ...rest] = h3.split('\n');
        phrasings.push({ title: h3Title.trim(), body: rest.join('\n').trim() });
      }
    } else if (title.includes('hint')) {
      // Split by h3
      const h3s = body.split(/^### /m).filter(Boolean);
      for (const h3 of h3s) {
        const [, ...rest] = h3.split('\n');
        hints.push(rest.join('\n').trim());
      }
    } else if (title.includes('faq')) {
      // Each Q: ... / A: ... pair
      const lines = body.split('\n');
      let currentQ: string | null = null;
      const aLines: string[] = [];

      for (const line of lines) {
        if (line.startsWith('### Q:') || line.startsWith('**Q:')) {
          if (currentQ && aLines.length > 0) {
            faq.push({ q: currentQ, a: aLines.join('\n').trim() });
            aLines.length = 0;
          }
          currentQ = line.replace(/^### Q:|^\*\*Q:\*\*/, '').trim();
        } else if (currentQ) {
          aLines.push(line.replace(/^A:/, '').trimStart());
        }
      }
      if (currentQ && aLines.length > 0) {
        faq.push({ q: currentQ, a: aLines.join('\n').trim() });
      }
    }
  }

  return { phrasings, hints, faq };
}

// Split body_md on the first `---` to separate concept body from hints.
function splitBodyMd(bodyMd: string): { concept: string; hints: string | null } {
  const sepIdx = bodyMd.indexOf('\n---\n');
  if (sepIdx === -1) return { concept: bodyMd, hints: null };
  return {
    concept: bodyMd.slice(0, sepIdx),
    hints: bodyMd.slice(sepIdx + 5),
  };
}

// ---------------------------------------------------------------------------
// Collapsible FAQ item
// ---------------------------------------------------------------------------

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex w-full items-center justify-between gap-2 py-3 text-left text-sm font-medium',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
        aria-expanded={open}
      >
        <span>{q}</span>
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="pb-3 text-sm text-muted-foreground">
          <Markdown>{a}</Markdown>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Props {
  bodyMd: string;
}

// ---------------------------------------------------------------------------
// HintPanel
// ---------------------------------------------------------------------------

export function HintPanel({ bodyMd }: Props) {
  const { hints: hintSection } = splitBodyMd(bodyMd);
  const [revealedHints, setRevealedHints] = useState(0);

  if (!hintSection) return null;

  const parsed = parseHintSection(hintSection);
  const hasSomething =
    parsed.phrasings.length > 0 || parsed.hints.length > 0 || parsed.faq.length > 0;

  if (!hasSomething) return null;

  return (
    <details className="rounded-lg border border-border bg-card">
      <summary
        className={cn(
          'flex cursor-pointer select-none list-none items-center gap-2 p-4 text-sm font-semibold',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
      >
        <Lightbulb className="h-4 w-4 text-warning" />
        Need another explanation?
        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform [[open]_&]:rotate-90" />
      </summary>

      <div className="border-t border-border px-4 pb-4 pt-3">
        <Tabs defaultValue={parsed.phrasings.length > 0 ? 'phrasings' : parsed.hints.length > 0 ? 'hints' : 'faq'}>
          <TabsList className="mb-4">
            {parsed.phrasings.length > 0 && (
              <TabsTrigger value="phrasings">Alternative phrasings</TabsTrigger>
            )}
            {parsed.hints.length > 0 && (
              <TabsTrigger value="hints">Hints</TabsTrigger>
            )}
            {parsed.faq.length > 0 && (
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            )}
          </TabsList>

          {/* Alternative phrasings */}
          {parsed.phrasings.length > 0 && (
            <TabsContent value="phrasings">
              <Tabs defaultValue="p-0">
                <TabsList>
                  {parsed.phrasings.map((p, i) => (
                    <TabsTrigger key={i} value={`p-${i}`}>
                      {p.title || `Version ${i + 1}`}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {parsed.phrasings.map((p, i) => (
                  <TabsContent key={i} value={`p-${i}`}>
                    <Markdown>{p.body}</Markdown>
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>
          )}

          {/* Progressive hint stack */}
          {parsed.hints.length > 0 && (
            <TabsContent value="hints">
              <div className="space-y-3">
                {parsed.hints.slice(0, revealedHints).map((hint, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-border bg-muted/40 px-4 py-3"
                  >
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">
                      Hint {i + 1}
                    </p>
                    <Markdown>{hint}</Markdown>
                  </div>
                ))}

                {revealedHints < parsed.hints.length && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRevealedHints((n) => n + 1)}
                  >
                    {revealedHints === 0 ? 'Show first hint' : 'Show next hint'}
                  </Button>
                )}

                {revealedHints === 0 && (
                  <p className="text-sm text-muted-foreground">
                    {parsed.hints.length} hint{parsed.hints.length > 1 ? 's' : ''} available.
                    Reveal them one at a time.
                  </p>
                )}

                {revealedHints === parsed.hints.length && parsed.hints.length > 0 && (
                  <p className="text-xs text-muted-foreground">All hints revealed.</p>
                )}
              </div>
            </TabsContent>
          )}

          {/* FAQ */}
          {parsed.faq.length > 0 && (
            <TabsContent value="faq">
              <div className="divide-y divide-border rounded-md border border-border px-4">
                {parsed.faq.map((item, i) => (
                  <FaqItem key={i} q={item.q} a={item.a} />
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </details>
  );
}

export { splitBodyMd };
