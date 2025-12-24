"use client"

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

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
      <div className="bg-white/95 backdrop-blur-sm border-2 border-blue-100 rounded-xl shadow-2xl p-4">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">
              {entry.dataKey === 'consultation_count' ? entry.value : formatCurrency(entry.value)}
            </span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function RevenueBarChart({ data, selectedBranch }) {


  // Transform data to use correct field names from API
  const chartData = data.map(item => ({
    name: item.branch_name,
    consultation_revenue: item.branch_consultation_revenue || 0,
    consultation_count: item.consultation_count || 0,
  }))

  // Calculate dynamic width based on number of items
  // Aim to show ~7 branches per screen (assuming ~1400px screen width)
  const minWidthPerItem = 150
  const calculatedWidth = chartData.length * minWidthPerItem

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-xl border border-blue-100/50 p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
        <h3 className="text-lg font-bold text-gray-900">
            Consultation Revenue (Exam, Vaccine,...) Comparison by Branch
        </h3>
      </div>
      <div className="overflow-x-auto overflow-y-hidden">
        <ResponsiveContainer width={calculatedWidth} height={350}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorConsultation" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            yAxisId="left"
            tickFormatter={formatCurrencyShort} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#d1d5db' }}
            label={{ value: 'Revenue', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#f97316', fontSize: 12 }}
            tickLine={{ stroke: '#fed7aa' }}
            label={{ value: 'Count', angle: 90, position: 'insideRight', fill: '#f97316' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Bar 
            yAxisId="left"
            dataKey="consultation_revenue" 
            name="Consultation Revenue" 
            fill="url(#colorConsultation)" 
            radius={[8, 8, 0, 0]}
            maxBarSize={80}
          />
          <Line 
            yAxisId="right"
            type="monotone"
            dataKey="consultation_count" 
            name="Consultation Count" 
            stroke="#f97316"
            strokeWidth={3}
            dot={{ fill: '#f97316', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      </div>
    </div>
  )
}
