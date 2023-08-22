import type { FC, SVGProps } from 'react'
import SWR from 'swr'
import { useNoteCollection } from '~/atoms/collections/note'
import { usePostCollection } from '~/atoms/collections/post'
import { AnimateChangeInHeight } from '~/components/ui/AnimateChangeInHeight'
import { apiClient } from '~/utils/client'

export const XLogSummary: FC<{
  cid: string
  className?: string
}> = (props) => {
  const { cid } = props
  const { data, isLoading, error } = SWR(
    [`getSummary`, cid],
    async ([, cid]) => {
      return apiClient.proxy.fn.xlog.get_summary.get<{
        data: string
      }>({
        params: {
          cid,
          lang: 'zh',
        },
      })
    },
    {
      revalidateOnFocus: false,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      refreshInterval: 0,
    },
  )

  if (!cid) {
    return null
  }

  return (
    <div
      className={`border-gray-6 mt-4 space-y-2 rounded-xl border p-4 ${
        props.className || ''
      }`}
    >
      <div className="flex items-center font-light">
        <OpenAIIcon className="mr-2 text-lg" />
        AI 生成的摘要
      </div>

      <AnimateChangeInHeight duration={0.3}>
        <p className="text-gray-1 text-sm leading-loose">
          {isLoading ? '加载中...' : error ? '请求错误' : data?.data}
        </p>
        {isLoading && (
          <p className="text-gray-2 text-right text-sm">
            (此服务由{' '}
            <a href="https://xlog.app" target="_blank">
              xLog
            </a>{' '}
            驱动)
          </p>
        )}
      </AnimateChangeInHeight>
    </div>
  )
}

export const XLogSummaryForPost: FC<{
  id: string
}> = ({ id }) => {
  const cid = usePostCollection((state) => state.data.get(id)?.meta?.xLog?.cid)

  if (!cid) return null

  return <XLogSummary cid={cid} className="mb-4" />
}

export const XLogSummaryForNote: FC<{
  id: string
}> = ({ id }) => {
  const cid = useNoteCollection((state) => state.data.get(id)?.meta?.xLog?.cid)

  if (!cid) return null

  return <XLogSummary cid={cid} />
}

export function OpenAIIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      height="1em"
      width="1em"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  )
}
