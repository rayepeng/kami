import classNames from 'clsx'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { Fragment, memo, useEffect } from 'react'

import { withNoSSR } from '~/components/app/HoC/no-ssr'
import { IF } from '~/components/app/If'
import { CloseIcon } from '~/components/ui/Icons/layout'
import { Overlay } from '~/components/ui/Overlay'
import { RootPortal } from '~/components/ui/Portal'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useDetectPadOrMobile } from '~/hooks/ui/use-viewport'

import styles from './index.module.css'

const _HeaderDrawer: FC<{ show: boolean; onExit: () => void }> = memo(
  ({ children, onExit, show }) => {
    const router = useRouter()
    const { event } = useAnalyze()

    useEffect(() => {
      if (show) {
        event({
          action: TrackerAction.Interaction,
          label: '顶部导航被打开了',
        })
      }
    }, [show])

    useEffect(() => {
      const handler = () => {
        onExit()
      }
      router.events.on('routeChangeStart', handler)

      return () => {
        router.events.off('routeChangeStart', handler)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])

    return (
      <RootPortal>
        <Fragment>
          <Overlay show={show} onClose={onExit} zIndex={60} />
          <div
            className={classNames(
              styles['drawer'],
              show ? styles['show'] : null,
            )}
          >
            <div className="pb-4 text-right">
              <span className="-mr-5 -mt-4 inline-block p-4" onClick={onExit}>
                <CloseIcon />
              </span>
            </div>

            {children}
          </div>
        </Fragment>
      </RootPortal>
    )
  },
)
export const HeaderDrawer = IF(withNoSSR(_HeaderDrawer), () =>
  useDetectPadOrMobile(),
)
