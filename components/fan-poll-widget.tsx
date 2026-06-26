"use client";

import { useActionState, useState } from "react";
import { voteInPoll, type PollVoteState } from "@/lib/supabase/public-actions";
import type { FanPoll } from "@/lib/types";

const initialState: PollVoteState = { status: "idle" };

export function FanPollWidget({ poll }: { poll: FanPoll }) {
  const [state, formAction, pending] = useActionState(voteInPoll, initialState);
  const [selected, setSelected] = useState<string | null>(null);
  const voted = state.status === "success";
  const total = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="fan-poll">
      <p className="fan-poll__question">{poll.question}</p>
      {voted ? (
        <ul className="fan-poll__results">
          {poll.options.map((option) => {
            const pct = total ? Math.round((option.votes / total) * 100) : 0;
            return (
              <li key={option.id}>
                <span className="fan-poll__result-label">{option.label}</span>
                <span className="fan-poll__result-bar">
                  <span style={{ width: `${pct}%` }} />
                </span>
                <span className="fan-poll__result-pct">{pct}%</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <form action={formAction} className="fan-poll__form">
          <input type="hidden" name="pollId" value={poll.id} />
          <input type="hidden" name="optionId" value={selected ?? ""} />
          <div className="fan-poll__options">
            {poll.options.map((option) => (
              <button
                type="button"
                key={option.id}
                className={`fan-poll__option${
                  selected === option.id ? " fan-poll__option--selected" : ""
                }`}
                onClick={() => setSelected(option.id)}
                aria-pressed={selected === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="fan-poll__submit"
            disabled={!selected || pending}
          >
            {pending ? "Submitting…" : "Vote"}
          </button>
        </form>
      )}
      {state.status === "error" ? (
        <p className="fan-poll__error" role="status">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
