import { RechartsDevtools } from "@recharts/devtools"
import { Cell, Pie, PieChart, Tooltip } from "recharts"

const PieChartComponent = () => {
    const data = [
        { name: 'Page A', u: 590 },
        { name: 'Page B', u: 590 },
        { name: 'Page C', u: 868 },
    ]

    const COLORS = ["#6366F1", "#10B981", "#F59E0B"]

    return (
        <PieChart width={400} height={400}>
            <Pie

                data={data}
                dataKey="u"
                isAnimationActive={true}
            >
                {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}

            </Pie>

            <Tooltip />
            <RechartsDevtools />
        </PieChart>
    )
}

export default PieChartComponent