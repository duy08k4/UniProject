const isIsoWithTimezone = (dateStr: string): boolean => {
    // 1. Kiểm tra cấu trúc ISO 8601 có Timezone (Z hoặc +/-HH:mm)
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})$/;

    if (!regex.test(dateStr)) return false;

    // 2. Kiểm tra ngày tháng có hợp lệ về mặt logic không (vd: 31/02)
    const d = new Date(dateStr);
    return d instanceof Date && !isNaN(d.getTime());
};

export default isIsoWithTimezone