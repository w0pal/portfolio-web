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
  background: #0d1117;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
  color: #e6edf3;
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
  color: #3fb950;
}

.line.input {
  color: #e6edf3;
}

.line.output {
  color: #e6edf3;
}

.line.error {
  color: #f85149;
}

.terminal-input-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem 1.25rem;
  border-top: 1px solid #30363d;
}

.prompt {
  color: #3fb950;
  user-select: none;
  flex-shrink: 0;
}

.terminal-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #e6edf3;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  caret-color: #58a6ff;
}

.terminal-input::placeholder {
  color: #8b949e;
}
</style>
