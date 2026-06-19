<script setup lang="ts">
import { onMounted } from 'vue'
import { useInteractiveTerminal } from '@/composables/useInteractiveTerminal'

const { lines, currentInput, outputRef, handleKeydown, focus } = useInteractiveTerminal()

onMounted(() => {
  focus()
})
</script>

<template>
  <div class="terminal-page" @click="focus">
    <div ref="outputRef" class="terminal-output">
      <p
        v-for="(line, i) in lines"
        :key="i"
        class="line"
        :class="line.type"
      ><span>{{ line.text }}</span></p>
    </div>

    <div class="terminal-input-row">
      <span class="prompt">$</span>
      <input
        v-model="currentInput"
        type="text"
        class="terminal-input"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        @keydown="handleKeydown"
      />
    </div>
  </div>
</template>

<style scoped>
.terminal-page {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 3.25rem);
  background: var(--bg-primary);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--text-primary);
  cursor: text;
}

@media (min-width: 768px) {
  .terminal-page {
    min-height: 100vh;
  }
}

.terminal-output {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem 1.5rem 0.5rem;
  scroll-behavior: smooth;
}

.line {
  white-space: pre-wrap;
  word-break: break-word;
  min-height: 1.6em;
}

.line.system {
  color: var(--accent-green);
}

.line.input {
  color: var(--text-primary);
}

.line.output {
  color: var(--text-primary);
}

.line.error {
  color: var(--accent-red);
}

.terminal-input-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem 1.25rem;
  border-top: 1px solid var(--border-subtle);
}

.prompt {
  color: var(--accent-green);
  user-select: none;
  flex-shrink: 0;
}

.terminal-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  caret-color: var(--accent);
}

.terminal-input::placeholder {
  color: var(--text-muted);
}
</style>
