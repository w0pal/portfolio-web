import {
  Home,
  User,
  Folder,
  FileText,
  Sparkles,
  type LucideIcon,
} from 'lucide-vue-next'

export interface NavLink {
  href: string
  label: string
  icon: LucideIcon
}

export const navLinks: NavLink[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: User },
  { href: '/portfolio', label: 'Portfolio', icon: Folder },
  { href: '/blog', label: 'Blog', icon: FileText },
  { href: '/status', label: 'Status', icon: Sparkles },
]
