import { useEffect, useState } from 'react'
import { subscribe } from './collection'
import { readBook, type CheeseBook } from './storage'

/**
 * 도감 상태를 읽고 변경을 구독한다.
 *
 * `useSyncExternalStore`를 쓰지 않는 이유: `readBook()`이 호출마다 새 객체를 만들어
 * getSnapshot 캐시 규칙을 어긴다(React가 무한 렌더로 판단한다).
 */
export function useCheeseBook(): CheeseBook {
  const [book, setBook] = useState<CheeseBook>(() => readBook())
  useEffect(() => subscribe(() => setBook(readBook())), [])
  return book
}
