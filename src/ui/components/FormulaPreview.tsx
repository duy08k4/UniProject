import type React from "react"

const FormulaPreview: React.FC<{ formula: string; cols: { id?: string; label: string }[]; nowrap?: boolean }> = ({ formula, cols, nowrap }) => {
    if (!formula) return <span className="text-gray dark:text-gray/60 text-[11px]">Chưa có công thức</span>

    const parts: { text: string; type: 'col' | 'op' | 'num' | 'other' }[] = []
    let remaining = formula

    while (remaining.length > 0) {
        const colMatch = remaining.match(/^col\[([^\]]+)\]/)
        if (colMatch) {
            const col = cols.find(c => c.id === colMatch[1])
            parts.push({ text: col ? col.label : colMatch[0], type: 'col' })
            remaining = remaining.slice(colMatch[0].length)
            continue
        }
        const numMatch = remaining.match(/^[\d.]+/)
        if (numMatch) {
            parts.push({ text: numMatch[0], type: 'num' })
            remaining = remaining.slice(numMatch[0].length)
            continue
        }
        const opMatch = remaining.match(/^[+\-*/()% ]/)
        if (opMatch) {
            parts.push({ text: opMatch[0], type: 'op' })
            remaining = remaining.slice(1)
            continue
        }
        parts.push({ text: remaining[0], type: 'other' })
        remaining = remaining.slice(1)
    }

    return (
        <span className={`flex items-center gap-0.5 text-smallSize font-mono ${nowrap ? 'flex-nowrap' : 'flex-wrap'}`}>
            {parts.map((p, i) => {
                if (p.type === 'col') return (
                    <span key={i} className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-[11px] font-bold">{p.text}</span>
                )
                if (p.type === 'op') return (
                    <span key={i} className="px-0.5 text-gray dark:text-gray-400 font-bold">{p.text}</span>
                )
                if (p.type === 'num') return (
                    <span key={i} className="text-mainColor dark:text-mainColor font-bold">{p.text}</span>
                )
                return <span key={i} className="text-red-500">{p.text}</span>
            })}
        </span>
    )
}

export default FormulaPreview
