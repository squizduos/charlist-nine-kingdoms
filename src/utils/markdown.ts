// Простой конвертер Markdown -> HTML для заметок персонажа.
// Поддерживает: заголовки (# ## ###), **жирный**, *курсив*/_курсив_,
// `код`, списки (- / 1.), ссылки [текст](url), абзацы.
// HTML экранируется до применения разметки, чтобы избежать XSS.

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function renderInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
    .replace(/(?<!_)_([^_\n]+)_(?!_)/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label, url) => {
      const safeUrl = /^(https?:|mailto:)/i.test(url) ? url : '#'
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`
    })
}

export function renderMarkdown(source: string): string {
  const lines = escapeHtml(source || '').split('\n')
  const html: string[] = []
  let listType: 'ul' | 'ol' | null = null

  const closeList = () => {
    if (listType) {
      html.push(listType === 'ul' ? '</ul>' : '</ol>')
      listType = null
    }
  }

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/)
    const ulMatch = line.match(/^[-*]\s+(.*)$/)
    const olMatch = line.match(/^\d+\.\s+(.*)$/)

    if (headingMatch) {
      closeList()
      const level = headingMatch[1].length + 2 // # -> h3, ## -> h4, ### -> h5
      html.push(`<h${level}>${renderInline(headingMatch[2])}</h${level}>`)
      continue
    }

    if (ulMatch) {
      if (listType !== 'ul') {
        closeList()
        html.push('<ul>')
        listType = 'ul'
      }
      html.push(`<li>${renderInline(ulMatch[1])}</li>`)
      continue
    }

    if (olMatch) {
      if (listType !== 'ol') {
        closeList()
        html.push('<ol>')
        listType = 'ol'
      }
      html.push(`<li>${renderInline(olMatch[1])}</li>`)
      continue
    }

    closeList()

    if (line.trim() === '') {
      html.push('<br>')
    } else {
      html.push(`<p>${renderInline(line)}</p>`)
    }
  }

  closeList()

  return html.join('\n')
}

// Обратный конвертер: DOM WYSIWYG-редактора (contenteditable) -> Markdown.
// Понимает тот же ограниченный набор тегов, что генерирует renderMarkdown выше,
// плюс встречающиеся варианты браузерных contenteditable-обёрток (div/b/i/span).

const HEADING_PREFIX: Record<string, string> = {
  h3: '#',
  h4: '##',
  h5: '###',
}

function inlineNodeToMarkdown(node: Node): string {
  let result = ''

  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      result += child.textContent || ''
      return
    }
    if (child.nodeType !== Node.ELEMENT_NODE) return

    const el = child as HTMLElement
    switch (el.tagName.toLowerCase()) {
      case 'strong':
      case 'b':
        result += `**${inlineNodeToMarkdown(el)}**`
        break
      case 'em':
      case 'i':
        result += `*${inlineNodeToMarkdown(el)}*`
        break
      case 'code':
        result += `\`${el.textContent || ''}\``
        break
      case 'a':
        result += `[${inlineNodeToMarkdown(el)}](${el.getAttribute('href') || ''})`
        break
      case 'br':
        result += '\n'
        break
      default:
        // Неизвестный инлайн-тег (например span от execCommand) - разворачиваем содержимое
        result += inlineNodeToMarkdown(el)
    }
  })

  return result
}

function blockNodeToMarkdown(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase()

  if (tag in HEADING_PREFIX) {
    return `${HEADING_PREFIX[tag]} ${inlineNodeToMarkdown(el).trim()}`
  }

  if (tag === 'ul') {
    return Array.from(el.children)
      .map((li) => `- ${inlineNodeToMarkdown(li).trim()}`)
      .join('\n')
  }

  if (tag === 'ol') {
    return Array.from(el.children)
      .map((li, index) => `${index + 1}. ${inlineNodeToMarkdown(li).trim()}`)
      .join('\n')
  }

  // p, div (браузеры оборачивают строки в contenteditable по-разному) и прочее
  return inlineNodeToMarkdown(el).trim()
}

export function htmlToMarkdown(root: HTMLElement): string {
  const lines: string[] = []

  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || ''
      if (text.trim()) lines.push(text)
      return
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return

    const el = node as HTMLElement
    if (el.tagName.toLowerCase() === 'br') {
      lines.push('')
      return
    }

    lines.push(blockNodeToMarkdown(el))
  })

  return lines.join('\n')
}
