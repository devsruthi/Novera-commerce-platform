export const EXAMPLE_SEARCHES = [
  {
    label: 'Wedding guest outfit',
    query: 'I need a blue dress for a wedding under €100',
  },
  {
    label: 'Office blazer under €80',
    query: 'Black blazer for the office under €80',
  },
  {
    label: 'Summer vacation looks',
    query: 'Casual beige knit for travel under 80 euros',
  },
  {
    label: 'Gym outfits',
    query: 'Running shoes that are comfortable',
  },
]

/** @deprecated use EXAMPLE_SEARCHES */
export const EXAMPLE_QUERIES = EXAMPLE_SEARCHES.map((item) => item.query)
