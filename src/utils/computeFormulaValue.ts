/**
 * Tính giá trị công thức từ formula_content và giá trị các cột trong cùng row.
 * @param formula  VD: "col[uuid1] * 0.4 + col[uuid2] * 0.6"
 * @param rowCells Map<colId, valueString> — giá trị các cột trong row hiện tại
 * @returns Kết quả dạng string (làm tròn 2 chữ số thập phân), hoặc null nếu lỗi
 */
export function computeFormulaValue(
    formula: string,
    rowCells: Map<string, string>
): string | null {
    if (!formula) return null
    try {
        // Replace col[uuid] → giá trị số (0 nếu chưa có)
        const expr = formula.replace(/col\[([^\]]+)\]/g, (_, colId) => {
            const val = parseFloat(rowCells.get(colId) ?? "")
            return isNaN(val) ? "0" : val.toString()
        })
        // Whitelist: chỉ cho phép số, toán tử, dấu ngoặc
        if (!/^[\d\s+\-*/().]+$/.test(expr)) return null
        // eslint-disable-next-line no-new-func
        const result = new Function(`return ${expr}`)()
        if (typeof result !== "number" || !isFinite(result)) return null
        // Làm tròn tối đa 2 chữ số thập phân, bỏ trailing zeros
        return parseFloat(result.toFixed(2)).toString()
    } catch {
        return null
    }
}
