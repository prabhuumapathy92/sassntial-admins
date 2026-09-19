"use server"

export const fetchStrapiAbout = async () => {
  try {
    const response = await fetch('http://localhost:1337/api/about?populate=*', {
      cache: 'no-store', // Since it's localhost, no caching
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching Strapi about:', error)
    return null
  }
}