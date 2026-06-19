import {
  Home,
  Folder,
  FileText,
  TerminalSquare,
  type LucideIcon,
} from 'lucide-vue-next'

export interface NavLink {
  href: string
  label: string
  icon: LucideIcon
}

export const navLinks: NavLink[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/projects', label: 'Projects', icon: Folder },
  { href: '/blog', label: 'Blog', icon: FileText },
  { href: '/terminal', label: 'Terminal', icon: TerminalSquare },
]
