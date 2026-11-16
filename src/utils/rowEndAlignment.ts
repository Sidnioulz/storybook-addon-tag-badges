import { type RefObject, useLayoutEffect } from 'react'

/**
 * Distance in px between the right edge of a sidebar row and the right edge
 * of its badge. It matches the width of the column where Storybook shows the
 * context menu button and status icons, so that a badge never moves when one
 * of them appears or disappears.
 */
export const ROW_END_INSET = 30

// Tree rows and their sticky copies.
export const ROW_SELECTOR = '[data-item-id], [data-sticky-item-id]'

type Measure = () => () => void

const measuresByElement = new Map<Element, Set<Measure>>()
let observer: ResizeObserver | undefined

/**
 * Runs every measurement before any write, so that rows don't force one
 * layout each when the sidebar resizes.
 */
function runMeasures(measures: Iterable<Measure>) {
  const writes = Array.from(measures, (measure) => measure())
  writes.forEach((write) => write())
}

function getObserver() {
  observer ??= new ResizeObserver((entries) => {
    const measures = new Set<Measure>()
    for (const { target } of entries) {
      measuresByElement.get(target)?.forEach((measure) => measures.add(measure))
    }
    runMeasures(measures)
  })
  return observer
}

function observe(element: Element, measure: Measure) {
  let measures = measuresByElement.get(element)
  if (!measures) {
    measures = new Set()
    measuresByElement.set(element, measures)
    getObserver().observe(element)
  }
  measures.add(measure)
}

function unobserve(element: Element, measure: Measure) {
  const measures = measuresByElement.get(element)
  measures?.delete(measure)
  if (measures?.size === 0) {
    measuresByElement.delete(element)
    observer?.unobserve(element)
  }
}

/**
 * Keeps the right edge of a sidebar label at a fixed distance from the right
 * edge of its row, by adjusting the label's end margin.
 *
 * The label's box shrinks whenever Storybook shows trailing content in the
 * row (the context menu button on hover or focus, status icons), and that
 * content differs between rows. The margin absorbs the difference, so that
 * badges line up in one column across rows and stay put on hover.
 *
 * The label must be a block that fills its parent. Only the parent is
 * observed: its size does not depend on the label's margin, so writing the
 * margin cannot trigger the observer again.
 */
export function useRowEndAlignment(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useLayoutEffect(() => {
    const label = ref.current
    const box = label?.parentElement
    const row = label?.closest(ROW_SELECTOR)
    if (
      !enabled ||
      !label ||
      !box ||
      !row ||
      typeof ResizeObserver === 'undefined'
    ) {
      return
    }

    const measure: Measure = () => {
      const trailingSpace =
        row.getBoundingClientRect().right - box.getBoundingClientRect().right
      const margin = Math.max(0, ROW_END_INSET - trailingSpace)
      return () => {
        label.style.marginInlineEnd = `${margin}px`
      }
    }

    runMeasures([measure])
    observe(box, measure)
    observe(row, measure)
    return () => {
      unobserve(box, measure)
      unobserve(row, measure)
      label.style.marginInlineEnd = ''
    }
  }, [ref, enabled])
}
