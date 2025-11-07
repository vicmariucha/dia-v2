import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { GlucoseRecord } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"

type Props = { data: GlucoseRecord[] }

const Glucose24hChart = ({ data }: Props) => {
  const rows = data.map(d => ({ x: new Date(d.ts), mgdl: d.mgdl }))

  return (
    <Card className="p-4">
      <div className="text-sm text-muted-foreground mb-2">Glicose — últimas 24h</div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows}>
            <defs>
              <linearGradient id="gluc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="currentColor" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="x"
              tickFormatter={(v: Date) => format(v, "HH:mm")}
              tickLine={false}
              axisLine={false}
              minTickGap={32}
            />
            <YAxis
              width={36}
              tickLine={false}
              axisLine={false}
              domain={[60, 200]}
            />
            <Tooltip
              labelFormatter={(v) => format(v as Date, "dd/MM HH:mm")}
              formatter={(v) => [`${v} mg/dL`, "Glicose"]}
            />
            <Area type="monotone" dataKey="mgdl" stroke="currentColor" fill="url(#gluc)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default Glucose24hChart
