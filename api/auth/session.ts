import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Return empty session for now - auth on Vercel requires a different approach
  return res.json({ user: null })
}
