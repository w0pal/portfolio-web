export interface Project {
  id: string
  title: string
  description: string
  link: string | null
  imageUrl: string | null
  tags: string[]
}

export const projects: Project[] = [
  {
    id: 'pdf-to-png24-svg',
    title: 'PDF to PNG-24/SVG',
    description: 'As the name suggests. Still in development.',
    link: 'https://pdftopng24-svg.vercel.app/',
    imageUrl: null,
    tags: ['Next.js', 'Vercel'],
  },
  {
    id: 'integrated-token',
    title: 'IntegratedToken',
    description: 'A website for exchanging coins (dummy coins, ERC-20) using SepoliaETH testnet.',
    link: 'https://integratedtoken.vercel.app/',
    imageUrl: null,
    tags: ['Next.js', 'Ethers', 'Metamask', 'Web3'],
  },
  {
    id: 'survey-lebaran-2026',
    title: 'Website Survey Lebaran 2026',
    description: 'Created for the Pre-Internship final assignment.',
    link: 'https://survey-sederhana.vercel.app/',
    imageUrl: null,
    tags: ['Next.js', 'Vercel', 'Railway'],
  },
]
