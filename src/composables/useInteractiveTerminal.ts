import { ref, nextTick, computed } from 'vue'

export interface Line {
  text: string
  type: 'output' | 'input' | 'system' | 'error'
}

const USER = 'w0pal'
const HOSTNAME = 'elitebook'

const ansiClasses: Record<string, string> = {
  '0': '',
  '1': 'ansi-bold',
  '4': 'ansi-uline',
  '30': 'ansi-30',
  '31': 'ansi-31',
  '32': 'ansi-32',
  '33': 'ansi-33',
  '34': 'ansi-34',
  '35': 'ansi-35',
  '36': 'ansi-36',
  '37': 'ansi-37',
  '90': 'ansi-90',
  '91': 'ansi-91',
  '92': 'ansi-92',
  '93': 'ansi-93',
  '94': 'ansi-94',
  '95': 'ansi-95',
  '96': 'ansi-96',
  '97': 'ansi-97',
}

export function ansiToHtml(text: string): string {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const segments = escaped.split(/(\x1b\[[0-9;]*m)/)
  const active: string[] = []
  const out: string[] = []

  for (const seg of segments) {
    const m = seg.match(/^\x1b\[([0-9;]*)m$/)
    if (m) {
      const codes = m[1] ? m[1].split(';') : ['0']
      for (const code of codes) {
        if (code === '0' || code === '') {
          active.length = 0
        } else if (ansiClasses[code]) {
          active.push(ansiClasses[code])
        }
      }
      continue
    }
    if (active.length > 0 && seg) {
      out.push(`<span class="${active.join(' ')}">${seg}</span>`)
    } else if (seg) {
      out.push(seg)
    }
  }

  return out.join('').replace(/\n/g, '<br>')
}

const PORTFOLIO_SECTIONS = [
  { name: 'about', desc: 'Learn about me' },
  { name: 'skills', desc: 'Technologies & tools I use' },
  { name: 'projects', desc: 'View my projects' },
  { name: 'blog', desc: 'Read my blog posts' },
  { name: 'contact', desc: 'Get in touch' },
  { name: 'github', desc: 'GitHub profile' },
]

const INITIAL_HELP = `\x1b[92m  ╔══════════════════════════════════════════════════════╗\x1b[0m
\x1b[92m  ║\x1b[0m        \x1b[97mw0pal@interactive-shell\x1b[0m                     \x1b[92m║\x1b[0m
\x1b[92m  ║\x1b[0m        \x1b[90mExplore my portfolio through the CLI\x1b[0m         \x1b[92m║\x1b[0m
\x1b[92m  ╚══════════════════════════════════════════════════════╝\x1b[0m

  \x1b[94m── Portfolio ──\x1b[0m
  \x1b[97mabout\x1b[0m         Learn about me
  \x1b[97mskills\x1b[0m        Technologies & tools I use
  \x1b[97mprojects\x1b[0m      View my projects
  \x1b[97mblog\x1b[0m          Read my blog posts
  \x1b[97mcontact\x1b[0m       Get in touch
  \x1b[97mgithub\x1b[0m        GitHub profile
  \x1b[97mwhoami\x1b[0m        Who I am
  \x1b[97mneofetch\x1b[0m      System info (simulated)

  \x1b[94m── Navigation ──\x1b[0m
  \x1b[97mls\x1b[0m            List portfolio sections
  \x1b[97mcd\x1b[0m [dir]      Navigate sections
  \x1b[97mpwd\x1b[0m           Print working directory

  \x1b[94m── Shell ──\x1b[0m
  \x1b[97mclear\x1b[0m         Clear terminal
  \x1b[97mhistory\x1b[0m       Command history
  \x1b[97mbanner\x1b[0m        Show this banner
  \x1b[97mhelp\x1b[0m          Show this message

  \x1b[90mTip: Tab for autocompletion, Up/Down for history.\x1b[0m`

const COMMANDS = [
  'help', 'about', 'skills', 'projects', 'blog', 'contact',
  'github', 'whoami', 'neofetch', 'ls', 'cd', 'pwd',
  'clear', 'history', 'banner',
]

function processCommand(input: string, cmdHistory: string[]): Line[] {
  const trimmed = input.trim()
  if (!trimmed) return []

  const parts = trimmed.split(/\s+/)
  const cmd = parts[0].toLowerCase()
  const args = parts.slice(1)

  const inputLine: Line = { text: `$ ${trimmed}`, type: 'input' }

  switch (cmd) {
    case 'help':
      return [inputLine, { text: INITIAL_HELP, type: 'output' }]

    case 'ls':
      return [inputLine, {
        text: PORTFOLIO_SECTIONS.map(s => `  \x1b[94m${s.name}/\x1b[0m  ${s.desc}`).join('\n'),
        type: 'output',
      }]

    case 'cd':
      return [inputLine]

    case 'pwd':
      return [inputLine, { text: '  /portfolio', type: 'output' }]

    case 'whoami':
      return [inputLine, { text: `  ${USER}`, type: 'output' }]

    case 'date':
      return [inputLine, { text: `  ${new Date().toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' })}`, type: 'output' }]

    case 'clear':
      return []

    case 'history': {
      const history = cmdHistory.map((c, i) => `  ${String(i + 1).padStart(4, ' ')}  ${c}`)
      return [inputLine, ...(history.length ? history.map(l => ({ text: l, type: 'output' as const })) : [{ text: '  no history', type: 'output' as const }])]
    }

    case 'banner':
      return [inputLine, { text: INITIAL_HELP, type: 'output' }]

    case 'neofetch': {
      const art = `\x1b[94m          ▗▄▄▄▖      \x1b[0m  \x1b[97m${USER}@${HOSTNAME}\x1b[0m
\x1b[94m          ▝▛▀▀▘      \x1b[0m  \x1b[90mOS:\x1b[0m Fedora Linux 40
\x1b[94m          ▐▌          \x1b[0m  \x1b[90mShell:\x1b[0m /bin/zsh
\x1b[94m  ▗▄▄▄▄▄▄ ▐▌ ▗▄▄▄▄▄▄  \x1b[0m  \x1b[90mWM:\x1b[0m Hyprland
\x1b[94m  ▐▌   ▝▛▀▀▘▝▛▀▀▘   ▐▌\x1b[0m  \x1b[90mTerminal:\x1b[0m foot
\x1b[94m  ▐▌   ▐▌    ▐▌      ▐▌\x1b[0m  \x1b[90mCPU:\x1b[0m AMD Ryzen 7 7840U
\x1b[94m  ▝▛▀▀▀▀▘▗▄▄▄▖▝▛▀▀▀▀▘\x1b[0m  \x1b[90mMemory:\x1b[0m ${Math.floor(Math.random() * 8 + 4)}GiB / 16GiB
\x1b[94m       ▐▌   ▐▌         \x1b[0m
\x1b[94m       ▝▛▀▀▀▀▘         \x1b[0m
\x1b[94m        ▝▀▀▀▀▘          \x1b[0m`
      return [inputLine, { text: art, type: 'output' }]
    }

    case 'about':
      return [inputLine, { text: `  \x1b[97mw0pal\x1b[0m
  \x1b[90m───\x1b[0m
  Informatics student, Linux user, street photographer.
  Building things with TypeScript, Vue, and Python.
 
  \x1b[90mCurrently:\x1b[0m working on portfolio-web
  \x1b[90mLocation:\x1b[0m  Indonesia`, type: 'output' }]

    case 'skills':
      return [inputLine, { text: `  \x1b[97mTechnologies & Tools\x1b[0m
  \x1b[90m───\x1b[0m
  \x1b[94mLanguages:\x1b[0m     TypeScript, JavaScript, Python, Bash
  \x1b[94mFrontend:\x1b[0m      Vue.js, React, Tailwind CSS
  \x1b[94mBackend:\x1b[0m       Node.js, Express
  \x1b[94mTools:\x1b[0m         Linux, Docker, Git, Neovim
  \x1b[94mOther:\x1b[0m         Street Photography`, type: 'output' }]

    case 'projects':
      return [inputLine, { text: `  \x1b[97mProjects\x1b[0m
  \x1b[90m───\x1b[0m
  \x1b[94mportfolio-web\x1b[0m  Personal portfolio built with Vue + TypeScript

  Visit \x1b[94m/projects\x1b[0m to see all projects.`, type: 'output' }]

    case 'blog':
      return [inputLine, { text: `  \x1b[97mBlog\x1b[0m
  \x1b[90m───\x1b[0m
  
  Visit \x1b[94m/blog\x1b[0m to read my posts.`, type: 'output' }]

    case 'contact':
      return [inputLine, { text: `  \x1b[97mContact\x1b[0m
  \x1b[90m───\x1b[0m
  \x1b[94mEmail:\x1b[0m   me@w0pal.xyz
  \x1b[94mGitHub:\x1b[0m github.com/w0pal`, type: 'output' }]

    case 'github':
      return [inputLine, { text: `  https://github.com/w0pal`, type: 'output' }]

    default:
      return [inputLine, { text: `  ${cmd}: command not found. Type 'help' to see available commands.`, type: 'error' }]
  }
}

export function useInteractiveTerminal() {
  const lines = ref<Line[]>([{ text: INITIAL_HELP, type: 'system' }])
  const currentInput = ref('')
  const commandHistory = ref<string[]>([])
  const historyIndex = ref(-1)
  const outputRef = ref<HTMLElement | null>(null)

  const prompt = computed(() => `${USER}@${HOSTNAME} ~`)

  function execute() {
    const raw = currentInput.value
    if (!raw.trim()) return

    const results = processCommand(raw, commandHistory.value)
    if (results.length === 0) {
      lines.value = []
    } else {
      lines.value.push(...results)
    }

    commandHistory.value.push(raw)
    historyIndex.value = commandHistory.value.length
    currentInput.value = ''
    scrollToBottom()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      execute()
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.value.length === 0) return
      historyIndex.value = Math.max(0, historyIndex.value - 1)
      currentInput.value = commandHistory.value[historyIndex.value]
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex.value >= commandHistory.value.length - 1) {
        historyIndex.value = commandHistory.value.length
        currentInput.value = ''
        return
      }
      historyIndex.value = Math.min(commandHistory.value.length - 1, historyIndex.value + 1)
      currentInput.value = commandHistory.value[historyIndex.value]
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      const partial = currentInput.value.toLowerCase()
      if (!partial) return
      const match = COMMANDS.find(c => c.startsWith(partial))
      if (match) currentInput.value = match
    }
  }

  function scrollToBottom() {
    nextTick(() => {
      if (outputRef.value) {
        outputRef.value.scrollTop = outputRef.value.scrollHeight
      }
    })
  }

  function focus() {
    nextTick(() => {
      const input = document.querySelector<HTMLInputElement>('.terminal-input')
      input?.focus()
    })
  }

  return {
    lines,
    currentInput,
    outputRef,
    execute,
    handleKeydown,
    focus,
    prompt,
    ansiToHtml,
  }
}
