import { ref, nextTick } from 'vue'

export interface Line {
  text: string
  type: 'output' | 'input' | 'system' | 'error'
}

const BANNER = `  ╔══════════════════════════════╗
  ║       w0pal@terminal         ║
  ║  type 'help' to get started  ║
  ╚══════════════════════════════╝`

const SKILLS = `  Languages:    TypeScript, Python, Go, Bash
  Frontend:     Vue, React, Tailwind
  Tools:        Linux, Docker, Git, Neovim
  Other:        PCB building, Street Photography`

function getUptime(): string {
  const h = Math.floor(Math.random() * 48) + 4
  const m = Math.floor(Math.random() * 60)
  const s = Math.floor(Math.random() * 60)
  return `  up ${h} hours, ${m} minutes, ${s} seconds`
}

const COMMANDS = [
  'help', 'whoami', 'date', 'clear',
   'about', 'skills', 'projects', 'github', 'email', 'banner',]

function processCommand(input: string): Line[] {
  const trimmed = input.trim()
  if (!trimmed) return []

  const parts = trimmed.split(/\s+/)
  const cmd = parts[0].toLowerCase()
  const args = parts.slice(1)

  const inputLine: Line = { text: `$ ${trimmed}`, type: 'input' }

  switch (cmd) {
    case 'help':
      return [inputLine, {
        text: `  Available commands:\n${COMMANDS.map(c => `    ${c}`).join('\n')}`,
        type: 'output',
      }]

    case 'whoami':
      return [inputLine, { text: '  w0pal', type: 'output' }]

    case 'date':
      return [inputLine, { text: `  ${new Date().toLocaleString('id-ID')}`, type: 'output' }]

    case 'clear':
      return []

    case 'about':
      return [inputLine, { text: '  Informatics student, Linux user, street photographer.', type: 'output' }]

    case 'skills':
      return [inputLine, { text: SKILLS, type: 'output' }]

    case 'projects':
      return [inputLine, { text: '  Visit /projects to see my projects.', type: 'output' }]

    case 'github':
      return [inputLine, { text: '  https://github.com/w0pal', type: 'output' }]

    case 'email':
      return [inputLine, { text: '  me@w0pal.xyz', type: 'output' }]

   case 'banner':
      return [inputLine, { text: `\n${BANNER}\n`, type: 'output' }]

    default:
      return [inputLine, { text: `  ${cmd}: command not found. Try 'help'.`, type: 'error' }]
  }
}

export function useInteractiveTerminal() {
  const lines = ref<Line[]>([{ text: BANNER, type: 'system' }])
  const currentInput = ref('')
  const commandHistory = ref<string[]>([])
  const historyIndex = ref(-1)
  const outputRef = ref<HTMLElement | null>(null)

  function execute() {
    const raw = currentInput.value
    if (!raw.trim()) return

    const results = processCommand(raw)
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
  }
}
