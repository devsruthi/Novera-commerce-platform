const img = (photoId: string, w = 900, h = 1200) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=85`

export const CART_EMPTY_VISUALS = {
  video:
    'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4',
  poster: img('photo-1483985988355-763728e1935b', 1600, 900),
  collage: [
    {
      src: img('photo-1515886657613-9f3515b0c78f'),
      alt: 'Yellow tailored fashion look',
    },
    {
      src: img('photo-1490481651871-ab68de25d43d'),
      alt: 'White dress editorial look',
    },
    {
      src: img('photo-1529139574466-a303027c1d8b'),
      alt: 'Pastel street style outfit',
    },
  ],
  strip: [
    {
      src: img('photo-1539109136881-3be0616acf4b', 700, 900),
      alt: 'Black evening outfit',
    },
    {
      src: img('photo-1524504388940-b1c1722653e1', 700, 900),
      alt: 'Studio fashion portrait',
    },
    {
      src: img('photo-1552374196-1ab2a1c593e8', 700, 900),
      alt: 'Layered city style',
    },
    {
      src: img('photo-1496747611176-843222e1e57c', 700, 900),
      alt: 'Floral statement dress',
    },
    {
      src: img('photo-1529626455594-4ff0802cfb7e', 700, 900),
      alt: 'Soft glam beauty portrait',
    },
  ],
}

export const CART_SUCCESS_VISUAL = {
  src: img('photo-1441986300917-64674bd600d8', 1400, 900),
  alt: 'Boutique clothing racks and shopping atmosphere',
}
