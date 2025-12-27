"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from "recharts"

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value)
}

const formatCurrencyShort = (value) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  return formatCurrency(value)
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border-2 border-purple-100 rounded-xl shadow-2xl p-4">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{formatCurrency(entry.value)}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

const CustomDot = (props) => {
  const { cx, cy, stroke, payload, value } = props
  if (value > 0) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={stroke}
        stroke="white"
        strokeWidth={2}
      />
    )
  }
  return null
}

export function RevenueTrendLineChart({ data }) {
  // Transform data to chart format
  const chartData = data.map(item => ({
    period: item.period_start ? new Date(item.period_start).toLocaleDateString("en-GB") : "N/A",
    consultation: item.consultation_revenue || 0,
    product: item.product_revenue || 0,
    total: item.total_revenue || 0,
  }))

  return (
    <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-xl border border-purple-100/50 p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
        <h3 className="text-lg font-bold text-gray-900">
          Revenue Trend Over Time
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorConsultationLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2}/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="colorProductLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.2}/>
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="colorTotalLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2}/>
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis 
            dataKey="period" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            tickFormatter={formatCurrencyShort} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Area 
            type="monotone" 
            dataKey="consultation" 
            fill="url(#colorConsultationLine)" 
            stroke="none"
          />
          <Area 
            type="monotone" 
            dataKey="product" 
            fill="url(#colorProductLine)" 
            stroke="none"
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            fill="url(#colorTotalLine)" 
            stroke="none"
          />
          <Line 
            type="monotone" 
            dataKey="consultation" 
            name="Consultation Revenue" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={<CustomDot />}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="product" 
            name="Product Sales Revenue" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={<CustomDot />}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="total" 
            name="Total Revenue" 
            stroke="#f59e0b" 
            strokeWidth={4} 
            dot={<CustomDot />}
            activeDot={{ r: 7, strokeWidth: 2 }}
            strokeDasharray="5 5"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
