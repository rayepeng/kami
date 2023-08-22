import { clsx } from 'clsx'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'

import { useUserStore } from '~/atoms/user'
import { Overlay } from '~/components/ui/Overlay'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'

export const BanCopy: FC = (props) => {
  const [showCopyWarn, setShowCopyWarn] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { event } = useAnalyze()
  const router = useRouter()
  useEffect(() => {
    if (!ref.current) {
      return
    }
    const $el = ref.current
    $el.oncopy = (e) => {
      const isLogged = useUserStore.getState().isLogged
      if (isLogged) {
        return
      }
      e.preventDefault()
      setShowCopyWarn(true)
      event({
        action: TrackerAction.Interaction,
        label: `禁止复制触发，在 ${router.asPath}`,
      })
    }

    return () => {
      $el.oncopy = null
    }
  }, [event, router.asPath])
  return (
    <>
      <div ref={ref}>{props.children}</div>
      <Overlay
        onClose={() => {
          setShowCopyWarn(false)
        }}
        show={showCopyWarn}
        center
        blur
        darkness={0.5}
      >
        <div
          className={clsx(
            'transition transition-opacity duration-200',
            !showCopyWarn && 'opacity-0',
          )}
        >
          <h1 className="text-red pointer-events-none mt-0">注意：</h1>
          <div className="pointer-events-none my-3 text-white text-opacity-80">
            <p>本文章为站长原创，保留版权所有，禁止复制。</p>
          </div>
        </div>
      </Overlay>
    </>
  )
}
