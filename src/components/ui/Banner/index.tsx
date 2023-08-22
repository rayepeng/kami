import { clsx } from 'clsx'
import React from 'react'
import type { FC } from 'react'

import {
  ClaritySuccessLine,
  FluentShieldError20Regular,
  FluentWarning28Regular,
  IonInformation,
} from '../Icons/status'

const IconMap = {
  warning: FluentWarning28Regular,
  info: IonInformation,
  error: FluentShieldError20Regular,
  success: ClaritySuccessLine,
}

const bgColorMap = {
  warning: 'bg-amber-50 dark:bg-amber-300',
  info: 'bg-always-blue-50 dark:bg-always-blue-300',
  success: 'bg-always-green-50 dark:bg-always-green-300',
  error: 'bg-always-red-50 dark:bg-always-red-300',
}

const borderColorMap = {
  warning: 'border-amber-300',
  info: 'border-always-blue-300',

  success: 'border-always-green-300',
  error: 'border-always-red-300',
}

const iconColorMap = {
  warning: 'text-amber-500',
  info: 'text-always-blue-500',
  success: 'text-always-green-500',
  error: 'text-always-red-500',
}

export const Banner: FC<{
  type: 'warning' | 'error' | 'success' | 'info'
  message?: string | React.ReactNode
  className?: string
  children?: React.ReactNode
  placement?: 'center' | 'left'
  showIcon?: boolean
}> = (props) => {
  const Icon = IconMap[props.type] || IconMap.info
  const { placement = 'center', showIcon = true } = props
  return (
    <div
      className={clsx(
        'phone:block text-dark-100 flex items-center space-x-4 rounded-md border p-6 dark:bg-opacity-10 dark:text-[#c4c4c4] ' +
          `${bgColorMap[props.type] || bgColorMap.info} ${
            borderColorMap[props.type] || borderColorMap.info
          }`,
        placement == 'center' ? 'justify-center' : 'justify-start',
        props.className,
      )}
    >
      {showIcon && (
        <Icon
          className={`flex-shrink-0 self-start text-3xl ${
            iconColorMap[props.type] || iconColorMap.info
          } phone:float-left phone:-mr-2 mr-2`}
        />
      )}
      {props.message ? (
        <span className="leading-[1.8]">{props.message}</span>
      ) : (
        props.children
      )}
    </div>
  )
}
