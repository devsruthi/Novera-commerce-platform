export type HeroSlide = {
  id: string
  kind: 'image'
  src: string
  alt: string
  caption: string
}

/** Shared wide hero crop — same 16:9 frame as the shopping-bags reference */
const heroSrc = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=2400&h=1350&q=90`

/**
 * Landscape fashion slides with subjects biased to the right
 * so they sit in the clear photo area beside the left gradient.
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'shopping-bags',
    kind: 'image',
    src: heroSrc('photo-1483985988355-763728e1935b'),
    alt: 'Woman with shopping bags in a red coat and sunglasses',
    caption: 'Street to evening',
  },
  {
    id: 'white-dress',
    kind: 'image',
    src: heroSrc('photo-1490481651871-ab68de25d43d'),
    alt: 'Model in a flowing white dress',
    caption: 'Occasion-ready looks',
  },
  {
    id: 'yellow-tailoring',
    kind: 'image',
    src: heroSrc('photo-1515886657613-9f3515b0c78f'),
    alt: 'Woman in a yellow outfit posing outdoors',
    caption: 'Color-led discovery',
  },
  {
    id: 'editorial-bw',
    kind: 'image',
    src: heroSrc('photo-1469334031218-e382a71b716b'),
    alt: 'Editorial fashion portrait',
    caption: 'Editorial essentials',
  },
  {
    id: 'pastel-street',
    kind: 'image',
    src: heroSrc('photo-1529139574466-a303027c1d8b'),
    alt: 'Stylish woman in a soft pastel outfit',
    caption: 'Modern street polish',
  },
  {
    id: 'evening-black',
    kind: 'image',
    src: heroSrc('photo-1539109136881-3be0616acf4b'),
    alt: 'Model in an elegant black outfit',
    caption: 'Night-out energy',
  },
  {
    id: 'studio-portrait',
    kind: 'image',
    src: heroSrc('photo-1524504388940-b1c1722653e1'),
    alt: 'Fashion model in a studio portrait',
    caption: 'Clean studio style',
  },
  {
    id: 'soft-glam',
    kind: 'image',
    src: heroSrc('photo-1529626455594-4ff0802cfb7e'),
    alt: 'Close-up fashion beauty portrait',
    caption: 'Soft glam',
  },
  {
    id: 'city-layers',
    kind: 'image',
    src: heroSrc('photo-1552374196-1ab2a1c593e8'),
    alt: 'Man in a stylish coat and scarf',
    caption: 'Layered city style',
  },
  {
    id: 'floral-statement',
    kind: 'image',
    src: heroSrc('photo-1496747611176-843222e1e57c'),
    alt: 'Woman in a colorful floral dress',
    caption: 'Statement color',
  },
]
