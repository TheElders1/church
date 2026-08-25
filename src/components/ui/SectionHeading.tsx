interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'text-center' : 'text-left'}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gold-600">{eyebrow}</p>
      )}
      <h2 className="text-balance text-3xl font-semibold text-plum-900 sm:text-4xl">{title}</h2>
      {description && (
        <p
          className={`mt-4 text-lg text-plum-700 ${align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}
        >
          {description}
        </p>
      )}
    </div>
  )
}
