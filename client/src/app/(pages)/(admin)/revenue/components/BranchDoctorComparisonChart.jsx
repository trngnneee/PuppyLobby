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
    // Get the data point
    const dataPoint = payload[0]?.payload
    
    return (
      <div className="bg-white/95 backdrop-blur-sm border-2 border-blue-100 rounded-xl shadow-2xl p-4 min-w-[250px]">
        <p className="font-semibold text-gray-800 mb-3 border-b pb-2">{label}</p>
        
        {/* Branch Data */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <p className="text-sm font-semibold text-blue-700">Branch</p>
          </div>
          <p className="text-xs text-gray-600 ml-5">
            Revenue: <span className="font-bold text-gray-800">{formatCurrency(dataPoint?.branch_consultation || 0)}</span>
          </p>
          <p className="text-xs text-gray-600 ml-5">
            Count: <span className="font-bold text-gray-800">{dataPoint?.branch_consultation_count || 0}</span>
          </p>
        </div>

        {/* Doctor Data - Only show if available */}
        {dataPoint?.doctor_consultation !== undefined && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <p className="text-sm font-semibold text-orange-700">Doctor</p>
            </div>
            <p className="text-xs text-gray-600 ml-5">
              Revenue: <span className="font-bold text-gray-800">{formatCurrency(dataPoint?.doctor_consultation || 0)}</span>
            </p>
            <p className="text-xs text-gray-600 ml-5">
              Count: <span className="font-bold text-gray-800">{dataPoint?.doctor_consultation_count || 0}</span>
            </p>
          </div>
        )}
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

export function BranchDoctorComparisonChart({ branchData, doctorData, doctorName }) {
  // Combine branch and doctor data by period
  const periodMap = new Map()

  // Add branch data
  branchData.forEach(item => {
    const period = item.period_start ? new Date(item.period_start).toLocaleDateString("en-GB") : "N/A"
    periodMap.set(period, {
      period,
      branch_consultation: item.consultation_revenue || 0,
      branch_consultation_count: item.consultation_count || 0,
    })
  })

  // Add doctor data if available
  if (doctorData && doctorData.length > 0) {
    doctorData.forEach(item => {
      const period = item.period_start ? new Date(item.period_start).toLocaleDateString("en-GB") : "N/A"
      const existing = periodMap.get(period) || { period, branch_consultation: 0, branch_consultation_count: 0 }
      periodMap.set(period, {
        ...existing,
        doctor_consultation: item.consultation_revenue || 0,
        doctor_consultation_count: item.consultation_count || 0,
      })
    })
  }

  const chartData = Array.from(periodMap.values())
  const hasDoctorData = doctorData && doctorData.length > 0

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-xl border border-blue-100/50 p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Branch vs Doctor Consultation Comparison
            </h3>
            {hasDoctorData && doctorName && (
              <p className="text-sm text-gray-600 mt-1">
                Comparing branch performance with <span className="font-semibold text-orange-600">{doctorName}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorBranchLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2}/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05}/>
            </linearGradient>
            {hasDoctorData && (
              <linearGradient id="colorDoctorLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.2}/>
                <stop offset="100%" stopColor="#f97316" stopOpacity={0.05}/>
              </linearGradient>
            )}
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
          
          {/* Branch Data */}
          <Area 
            type="monotone" 
            dataKey="branch_consultation" 
            fill="url(#colorBranchLine)" 
            stroke="none"
          />
          <Line 
            type="monotone" 
            dataKey="branch_consultation" 
            name="Branch Consultation Revenue" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={<CustomDot />}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />

          {/* Doctor Data - Only show if available */}
          {hasDoctorData && (
            <>
              <Area 
                type="monotone" 
                dataKey="doctor_consultation" 
                fill="url(#colorDoctorLine)" 
                stroke="none"
              />
              <Line 
                type="monotone" 
                dataKey="doctor_consultation" 
                name={`${doctorName || "Doctor"} Consultation Revenue`}
                stroke="#f97316" 
                strokeWidth={3} 
                dot={<CustomDot />}
                activeDot={{ r: 6, strokeWidth: 2 }}
                strokeDasharray="5 5"
              />
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Statistics Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-700">Branch Total</span>
          </div>
          <p className="text-xl font-bold text-blue-600">
            {formatCurrencyShort(chartData.reduce((sum, item) => sum + item.branch_consultation, 0))}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Total consultations: {chartData.reduce((sum, item) => sum + item.branch_consultation_count, 0)}
          </p>
        </div>

        {hasDoctorData && (
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm font-medium text-gray-700">{doctorName || "Doctor"} Total</span>
            </div>
            <p className="text-xl font-bold text-orange-600">
              {formatCurrencyShort(chartData.reduce((sum, item) => sum + (item.doctor_consultation || 0), 0))}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Total consultations: {chartData.reduce((sum, item) => sum + (item.doctor_consultation_count || 0), 0)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
