import type React from "react"
import { useEffect, useState, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ScaleLoader } from "react-spinners"
import { Cell, Pie, PieChart, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import type { RootState } from "../../../redux/store"
import { ClassService } from "../../../services/class/class.service"
import ScoreFormsService from "../../../services/scoreforms/scoreforms.service"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import { VNScoreFormTag } from "../../../config/enum"
import formatVNTime from "../../../utils/formatVNTime"

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b", "#10b981"]

const formatNumber = (num: number) => num < 10 ? `0${num}` : num.toString()

const StatCard: React.FC<{
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    alert?: boolean;
    onClick?: () => void;
}> = ({ label, value, icon, color, alert, onClick }) => (
    <div
        onClick={onClick}
        className={`relative overflow-hidden flex-1 flex flex-col p-6 bg-white dark:bg-lightDark rounded-medium shadow-sm border border-lighterGray dark:border-gray/20 transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : ''} ${alert ? 'ring-2 ring-mainColor ring-opacity-50' : ''}`}
    >
        <div className="flex items-center justify-between mb-4">
            <span className={`p-3 rounded-normal ${color} bg-opacity-10 text-${color}`}>
                {icon}
            </span>
            {alert && (
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mainColor opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-mainColor"></span>
                </span>
            )}
        </div>
        <div>
            <p className="text-smallSize text-gray font-medium uppercase tracking-wider">{label}</p>
            <h3 className="text-hugeSize font-bold dark:text-white mt-1">{formatNumber(value)}</h3>
        </div>
        <div className={`absolute bottom-0 right-0 w-24 h-24 -mr-8 -mb-8 rounded-full opacity-5 ${color} bg-current`}></div>
    </div>
)

const ChartContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-lightDark p-6 rounded-medium shadow-sm border border-lighterGray dark:border-gray/20 flex flex-col h-full">
        <h3 className="text-normalSize font-bold dark:text-white mb-6 border-l-4 border-mainColor pl-3">{title}</h3>
        <div className="flex-1 flex items-center justify-center min-h-[250px]">
            {children}
        </div>
    </div>
)

const ActivityItem: React.FC<{
    title: string;
    subtitle: string;
    time?: string;
    statusLabel: string;
    statusColor: string;
    onClick: () => void;
}> = ({ title, subtitle, time, statusLabel, statusColor, onClick }) => (
    <div
        onClick={onClick}
        className="flex items-center gap-4 p-3 rounded-normal hover:bg-lighterGray dark:hover:bg-gray/10 cursor-pointer transition-colors group border-b border-lighterGray dark:border-gray/10 last:border-0"
    >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-linear-to-br from-gray to-lightGray`}>
            {title.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
                <p className="text-smallSize font-bold dark:text-white truncate group-hover:text-mainColor transition-colors">{title}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
                    {statusLabel}
                </span>
            </div>
            <p className="text-mobile-smallSize text-gray truncate">{subtitle}</p>
            {time && <p className="text-[10px] text-gray/60 mt-0.5 italic">{formatVNTime(time)}</p>}
        </div>
    </div>
)

const SAOverview: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const rawClassList = useSelector((state: RootState) => state.class.classList)
    const classList = useMemo(() => rawClassList ?? [], [rawClassList])
    const rawScoreforms = useSelector((state: RootState) => state.scoreForm.scoreFormPagination?.data)
    const scoreforms = useMemo(() => rawScoreforms ?? [], [rawScoreforms])
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        setLoading(true)
        dispatch(changeStateFetching(true))
        await Promise.all([
            ClassService.getAllClasses(1, 1000),
            ScoreFormsService.scoreFormsPagination(1, 1000, undefined, false),
        ])
        dispatch(changeStateFetching(false))
        setLoading(false)
    }, [dispatch])

    useEffect(() => {
        let isMounted = true;
        const initLoad = async () => {
            if (isMounted) await load();
        };
        initLoad();
        return () => { isMounted = false; };
    }, [load])

    const pendingClasses = useMemo(() => classList.filter(c => !c.created_approval && !c.is_deleted && !c.is_banned), [classList])
    const activeClasses = useMemo(() => classList.filter(c => c.created_approval && !c.is_deleted && !c.is_banned), [classList])
    const bannedClasses = useMemo(() => classList.filter(c => c.is_banned && !c.is_deleted), [classList])
    const pendingScoreforms = useMemo(() => scoreforms.filter(sf => sf.is_stopped && sf.status !== "accept"), [scoreforms])

    const classStatusData = useMemo(() => [
        { name: "Hoạt động", value: activeClasses.length, color: "#499C40" },
        { name: "Chờ duyệt", value: pendingClasses.length, color: "#F59E0B" },
        { name: "Đình chỉ", value: bannedClasses.length, color: "#EF4444" },
    ].filter(d => d.value > 0), [activeClasses, pendingClasses, bannedClasses])

    const scoreformTypeData = useMemo(() => {
        const types = [
            "supervisor_score",
            "reviewer_score",
            "committee_score",
            "attendance_check",
            "bonus_score",
            "others"
        ]
        const counts = scoreforms.reduce((acc, sf) => ({
            ...acc,
            [sf.score_form_type]: (acc[sf.score_form_type] ?? 0) + 1
        }), {} as Record<string, number>)

        return types.map(type => ({
            name: VNScoreFormTag[type] ?? type,
            value: counts[type] ?? 0
        }))
    }, [scoreforms])

    const approvalData = useMemo(() => [
        { name: "Đã duyệt", value: scoreforms.filter(sf => sf.status === "accept").length, color: "#499C40" },
        { name: "Chờ duyệt", value: scoreforms.filter(sf => sf.status !== "accept").length, color: "#F59E0B" },
    ].filter(d => d.value > 0), [scoreforms])

    if (loading) return <div className="flex justify-center items-center h-screen"><ScaleLoader color="#499C40" /></div>

    return (
        <div className="w-full flex flex-col gap-8 py-8 px-mainTwoSidePadding bg-lighterGray/30 dark:bg-bgDark min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between bg-white dark:bg-lightDark p-6 rounded-medium shadow-sm border border-lighterGray dark:border-gray/20">
                <div>
                    <h1 className="text-largeSize font-bold dark:text-white flex items-center gap-3">
                        <span className="w-2 h-8 bg-mainColor rounded-full"></span>
                        Tổng quan hệ thống
                    </h1>
                    <p className="text-smallSize text-gray mt-1 font-medium">Theo dõi hoạt động và phê duyệt nội dung</p>
                </div>
                <button onClick={load} className="group p-3 bg-white dark:bg-darkGray border border-lightGray dark:border-gray rounded-normal hover:bg-mainColor hover:border-mainColor transition-all duration-300 shadow-sm" title="Làm mới dữ liệu">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white group-hover:stroke-white group-hover:rotate-180 transition-transform duration-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Tổng lớp học"
                    value={classList.length}
                    color="text-indigo-500"
                    icon={<svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                />
                <StatCard
                    label="Lớp chờ duyệt"
                    value={pendingClasses.length}
                    color="text-amber-500"
                    alert={pendingClasses.length > 0}
                    onClick={() => navigate("/super-admin/classes")}
                    icon={<svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard
                    label="Tổng bảng điểm"
                    value={scoreforms.length}
                    color="text-blue-500"
                    icon={<svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                />
                <StatCard
                    label="Bảng điểm chờ duyệt"
                    value={pendingScoreforms.length}
                    color="text-mainColor"
                    alert={pendingScoreforms.length > 0}
                    onClick={() => navigate("/super-admin/scoreboards")}
                    icon={<svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                />
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Charts Column */}
                <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartContainer title="Phân bổ trạng thái lớp học">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={classStatusData}
                                    dataKey="value"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                >
                                    {classStatusData.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number | string | undefined) => [value ?? 0, "Giá trị"]}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                                <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="fill-gray dark:fill-white font-bold text-xl">
                                    {classList.length}
                                </text>
                                <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="fill-gray dark:fill-gray text-xs">
                                    Tổng số
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    <ChartContainer title="Trạng thái duyệt bảng điểm">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={approvalData}
                                    dataKey="value"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                >
                                    {approvalData.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number | string | undefined) => [value ?? 0, "Giá trị"]}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                                <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="fill-gray dark:fill-white font-bold text-xl">
                                    {scoreforms.length}
                                </text>
                                <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="fill-gray dark:fill-gray text-xs">
                                    Tổng số
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    <div className="col-span-1 md:col-span-2">
                        <ChartContainer title="Phân loại bảng điểm">
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={scoreformTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: number | string | undefined) => [value ?? 0, "Giá trị"]}
                                    />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                        {scoreformTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </div>

                {/* Activity Lists Column */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    {/* Pending Classes */}
                    <div className="bg-white dark:bg-lightDark rounded-medium shadow-sm border border-lighterGray dark:border-gray/20 overflow-hidden flex flex-col h-full">
                        <div className="px-5 py-4 bg-lighterGray/20 dark:bg-gray/10 border-b border-lighterGray dark:border-gray/20 flex justify-between items-center">
                            <p className="font-bold dark:text-white flex items-center gap-2">
                                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                Lớp chờ duyệt
                            </p>
                            <span className="text-tinySize bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold">
                                {formatNumber(pendingClasses.length)} mục
                            </span>
                        </div>
                        <div className="p-4 flex flex-col min-h-[300px]">
                            {pendingClasses.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                                    <svg className="size-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <p className="text-smallSize italic">Tất cả đã được xử lý</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col">
                                        {pendingClasses.slice(0, 5).map(c => (
                                            <ActivityItem
                                                key={c.id}
                                                title={c.label}
                                                subtitle={c.owner?.email ?? "N/A"}
                                                time={c.created_at}
                                                statusLabel="Pending"
                                                statusColor="bg-amber-100 text-amber-600"
                                                onClick={() => navigate("/super-admin/classes")}
                                            />
                                        ))}
                                    </div>
                                    {pendingClasses.length > 5 && (
                                        <button
                                            onClick={() => navigate("/super-admin/classes")}
                                            className="mt-4 w-full py-2 text-smallSize text-mainColor font-bold hover:bg-mainColor/5 rounded-normal transition-colors border border-dashed border-mainColor/30"
                                        >
                                            Xem thêm {pendingClasses.length - 5} lớp nữa
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Pending Scoreforms */}
                    <div className="bg-white dark:bg-lightDark rounded-medium shadow-sm border border-lighterGray dark:border-gray/20 overflow-hidden flex flex-col h-full">
                        <div className="px-5 py-4 bg-lighterGray/20 dark:bg-gray/10 border-b border-lighterGray dark:border-gray/20 flex justify-between items-center">
                            <p className="font-bold dark:text-white flex items-center gap-2">
                                <span className="w-2 h-2 bg-mainColor rounded-full"></span>
                                Bảng điểm chờ duyệt
                            </p>
                            <span className="text-tinySize bg-mainColor/10 text-mainColor px-2 py-0.5 rounded-full font-bold">
                                {formatNumber(pendingScoreforms.length)} mục
                            </span>
                        </div>
                        <div className="p-4 flex flex-col min-h-[300px]">
                            {pendingScoreforms.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                                    <svg className="size-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <p className="text-smallSize italic">Không có bảng điểm cần duyệt</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col">
                                        {pendingScoreforms.slice(0, 5).map(sf => (
                                            <ActivityItem
                                                key={sf.id}
                                                title={sf.label}
                                                subtitle={sf.class?.label ?? "Lớp không xác định"}
                                                time={sf.created_at}
                                                statusLabel="Review"
                                                statusColor="bg-mainColor/10 text-mainColor"
                                                onClick={() => navigate(`/super-admin/scoreboards/${sf.id}`)}
                                            />
                                        ))}
                                    </div>
                                    {pendingScoreforms.length > 5 && (
                                        <button
                                            onClick={() => navigate("/super-admin/scoreboards")}
                                            className="mt-4 w-full py-2 text-smallSize text-mainColor font-bold hover:bg-mainColor/5 rounded-normal transition-colors border border-dashed border-mainColor/30"
                                        >
                                            Xem thêm {pendingScoreforms.length - 5} bảng nữa
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SAOverview
