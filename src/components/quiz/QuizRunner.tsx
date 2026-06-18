import { useRef, useState } from 'react';
import { Trophy } from 'lucide-react';
import { QuizQuestion, type QuizQuestionRow } from './QuizQuestion';
import { submitQuiz } from '@/lib/api';
import type { QuizSubmitResponse } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Props {
  questions: QuizQuestionRow[];
  onComplete: (totalScore: number, maxScore: number) => void;
}

// ---------------------------------------------------------------------------
// QuizRunner sequences through questions one at a time.
//
// Design note: QuizQuestion owns its display state (selected choices, result).
// It calls onSubmit to get a QuizSubmitResponse and shows feedback, then calls
// onNext (no args) when the user clicks "Next". We bridge the two with a ref
// that captures each result as it arrives.
// ---------------------------------------------------------------------------

export function QuizRunner({ questions, onComplete }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  // Holds the result of the most recent submit so onNext can read it.
  const lastResultRef = useRef<QuizSubmitResponse | null>(null);

  const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

  async function handleSubmit(questionId: string, chosen: number[]): Promise<QuizSubmitResponse> {
    const res = await submitQuiz(questionId, chosen);
    lastResultRef.current = res;
    return res;
  }

  function handleNext() {
    const res = lastResultRef.current;
    if (!res) return;

    const newTotal = totalScore + res.points;
    const newCorrect = correctCount + (res.is_correct ? 1 : 0);

    setTotalScore(newTotal);
    setCorrectCount(newCorrect);
    lastResultRef.current = null;

    if (currentIdx + 1 >= questions.length) {
      setDone(true);
      onComplete(newTotal, maxScore);
    } else {
      setCurrentIdx((i) => i + 1);
    }
  }

  if (done) {
    const pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    return (
      <div className="space-y-4 text-center" data-testid="quiz-complete-panel">
        <Trophy className="mx-auto h-10 w-10 text-warning" />
        <div>
          <p className="text-lg font-semibold">Quiz complete!</p>
          <p className="text-sm text-muted-foreground">
            {correctCount}/{questions.length} correct &mdash;{' '}
            {totalScore}/{maxScore} points ({pct}%)
          </p>
        </div>
        <div className="h-2 w-full rounded-full bg-muted">
          <div
            className={cn(
              'h-2 rounded-full transition-all',
              pct >= 70 ? 'bg-success' : 'bg-warning'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  const current = questions[currentIdx];

  return (
    <QuizQuestion
      key={current.id}
      question={current}
      questionNumber={currentIdx + 1}
      totalQuestions={questions.length}
      onSubmit={handleSubmit}
      onNext={handleNext}
    />
  );
}
