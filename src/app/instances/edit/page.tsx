'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { InstanceEditView } from '@/views/instances'

function EditInstancePageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')

  if (!id) {
    React.useEffect(() => {
      router.push('/instances')
    }, [router])
    return <div className='flex h-full items-center justify-center'>Redirecting...</div>
  }

  return <InstanceEditView instanceId={id} />
}

export default function EditInstancePage() {
  return (
    <Suspense fallback={<div className='flex h-full items-center justify-center'>Loading...</div>}>
      <EditInstancePageContent />
    </Suspense>
  )
}
