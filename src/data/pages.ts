export interface AboutData {
  aboutParagraphs: string[]
  interests: { icon: string; title: string; description: string }[]
}

export interface StatusData {
  goals: string[]
  interests: string[]
}

export const aboutData: AboutData = {
  aboutParagraphs: [
    'A third-year informatics student passionate about technology and photography. My journey as a PC enthusiast started in 2020, and I transitioned to Linux Desktop in 2023.',
    'Beyond tech, photography became a second hobby, starting from social media. I have a particular interest in street photography, using both camera and smartphone.',
  ],
  interests: [
    { icon: 'Monitor', title: 'PC Enthusiast', description: 'Building and optimizing PCs since 2020' },
    { icon: 'Code', title: 'Linux User', description: 'Linux Desktop user since 2023' },
    { icon: 'Camera', title: 'Photographer', description: 'Street photography with camera & smartphone' },
  ],
}

export const statusData: StatusData = {
  goals: [
    'Graduate college using Linux (journals, thesis, etc.)',
    'Consistent daily photo on Instagram',
  ],
  interests: [
    'Street photography',
    'PC building & optimization',
    'Linux customization',
    'Web development',
  ],
}
