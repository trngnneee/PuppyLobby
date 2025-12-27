"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value)
}

const formatCurrencyShort = (value) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B VND`
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M VND`
  }
  return formatCurrency(value)
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const percent = ((payload[0].value / payload[0].payload.total) * 100).toFixed(1)
    return (
      <div className="bg-white/98 backdrop-blur-md border-2 border-blue-200 rounded-2xl shadow-2xl p-5 min-w-[240px]">
        <div className="flex items-center gap-2 mb-3">
          <div 
            className="w-4 h-4 rounded-full shadow-lg" 
            style={{ backgroundColor: payload[0].payload.color }}
          />
          <p className="font-bold text-gray-900 text-base">{payload[0].name}</p>
        </div>
        <div className="space-y-2 border-t border-gray-200 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="text-sm font-bold text-gray-900">{formatCurrency(payload[0].value)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Percentage:</span>
            <span className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
              {percent}%
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.65
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <g>
      <text 
        x={x} 
        y={y - 12} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="font-extrabold text-2xl"
        style={{ 
          textShadow: '2px 2px 4px rgba(0,0,0,0.6), 0 0 8px rgba(0,0,0,0.4)',
          stroke: 'rgba(0,0,0,0.3)',
          strokeWidth: '0.5px'
        }}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
      <text 
        x={x} 
        y={y + 12} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="font-bold text-sm"
        style={{ 
          textShadow: '1px 1px 3px rgba(0,0,0,0.6), 0 0 6px rgba(0,0,0,0.4)',
          stroke: 'rgba(0,0,0,0.2)',
          strokeWidth: '0.3px'
        }}
      >
        {formatCurrencyShort(value)}
      </text>
    </g>
  )
}

const CustomLegend = ({ payload }) => {
  const total = payload.reduce((sum, entry) => sum + entry.payload.value, 0)
  
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {payload.map((entry, index) => (
        <div 
          key={`legend-${index}`}
          className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <div 
            className="w-5 h-5 rounded-full shadow-lg ring-2 ring-white" 
            style={{ backgroundColor: entry.color }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">{entry.value}</span>
            <span className="text-xs text-gray-500">{formatCurrencyShort(entry.payload.value)}</span>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-green-50 border border-gray-300 shadow-md hover:shadow-lg transition-all duration-200">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-green-500 shadow-lg ring-2 ring-white" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800">Total Revenue</span>
          <span className="text-xs font-bold text-gray-700">{formatCurrencyShort(total)}</span>
        </div>
      </div>
    </div>
  )
}

export function RevenueStructurePieChart({ data }) {
  // Transform object data to array format for PieChart
  const chartData = [
    {
      name: "Consultation Revenue",
      value: data.consultation_revenue || data.total_consultation_revenue || 0,
      color: "#3b82f6"
    },
    {
      name: "Product Sales Revenue",
      value: data.product_revenue || data.total_product_sales_revenue || 0,
      color: "#10b981"
    }
  ]
  
  const total = chartData.reduce((sum, entry) => sum + entry.value, 0)
  const dataWithTotal = chartData.map(item => ({ ...item, total }))

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-green-50/30 rounded-2xl shadow-2xl border border-blue-100/50 p-8 hover:shadow-3xl transition-all duration-300">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-1.5 h-10 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full shadow-lg"></div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Revenue Structure Analysis
        </h3>
        <div className="w-1.5 h-10 bg-gradient-to-b from-green-500 via-purple-500 to-blue-500 rounded-full shadow-lg"></div>
      </div>
      <div className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3"/>
              </filter>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <Pie
              data={dataWithTotal}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={140}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              filter="url(#shadow)"
              paddingAngle={3}
              animationBegin={0}
              animationDuration={800}
            >
              {dataWithTotal.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              content={<CustomLegend />}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
