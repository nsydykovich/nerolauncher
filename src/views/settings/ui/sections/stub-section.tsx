import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card'
import { useTranslation } from '@/shared/lib/i18n'

interface StubSectionProps {
    titleKey: string
}

export function StubSection({ titleKey }: StubSectionProps) {
    const { t } = useTranslation()

    return (
        <div className='space-y-4'>
            <div>
                <h2 className='text-2xl font-semibold'>{t(titleKey)}</h2>
            </div>
            <div className='space-y-3'>
                {[1, 2, 3].map((i) => (
                    <Card key={i} variant='outline'>
                        <CardHeader>
                            <CardTitle className='text-base'>{t('common.item')} {i}</CardTitle>
                            <CardDescription>{t('common.comingSoon')}</CardDescription>
                        </CardHeader>
                        <CardContent />
                    </Card>
                ))}
            </div>
        </div>
    )
}
