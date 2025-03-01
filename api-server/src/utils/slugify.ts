import _slugify from 'slugify'

export const slugify = (text: string, randomPrefix: boolean = false): string => {
  let slug = _slugify(text, {
    lower: true,
    trim: true
  })

  if (randomPrefix) {
    slug += `-${crypto.randomUUID().slice(0, 8)}`
  }

  return slug

}