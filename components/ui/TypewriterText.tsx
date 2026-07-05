'use client'

import { useEffect, useState } from 'react'

interface TypewriterTextProps {
  /** Words/phrases to cycle through. */
  words: string[]
  typingMs?: number
  deletingMs?: number
  /** Pause after a word is fully typed. */
  holdMs?: number
  className?: string
}

/**
 * Typewriter effect: types each word, holds, deletes, then moves to the next,
 * looping forever. Renders the first word statically under
 * prefers-reduced-motion. A blinking caret follows the text.
 */
export default function TypewriterText({
  words,
  typingMs = 70,
  deletingMs = 40,
  holdMs = 1800,
  className = '',
}: TypewriterTextProps) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (reduced || words.length === 0) return
    const word = words[wordIndex % words.length]

    let delay: number
    if (!deleting && text === word) {
      delay = holdMs
    } else if (deleting && text === '') {
      delay = 300
    } else {
      delay = deleting ? deletingMs : typingMs
    }

    const id = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true)
      } else if (deleting && text === '') {
        setDeleting(false)
        setWordIndex((i) => (i + 1) % words.length)
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)))
      }
    }, delay)
    return () => clearTimeout(id)
  }, [text, deleting, wordIndex, words, typingMs, deletingMs, holdMs, reduced])

  // Reserve width of the longest word so the layout never shifts while typing.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '')

  return (
    // className is applied to the inner text span (not this container):
    // effects like bg-clip-text gradients only work directly on the element
    // whose text they clip to.
    // justify-items-center: the typed text stays centered in the reserved slot,
    // so the word grows outward symmetrically instead of leaving a trailing gap.
    <span className="relative inline-grid justify-items-center text-center align-baseline" aria-label={words.join(', ')}>
      {/* Invisible sizer keeps the slot as wide as the longest word */}
      <span className={`invisible whitespace-nowrap col-start-1 row-start-1 ${className}`} aria-hidden="true">
        {longest}
      </span>
      <span className={`whitespace-nowrap col-start-1 row-start-1 ${className}`} aria-hidden="true">
        {reduced ? words[0] : text}
        <span className="typewriter-caret" />
      </span>
    </span>
  )
}
