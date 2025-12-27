"use client"

import { useState, useEffect } from "react"
import { Calendar as CalendarIcon, Filter, DollarSign, ShoppingCart, Users, Activity, ChevronDown, BarChart3, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { paramsBuilder } from "@/utils/params";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { RevenueBarChart } from "./components/RevenueBarChart"
import { RevenueStructurePieChart } from "./components/RevenueStructurePieChart"
import { RevenueTrendLineChart } from "./components/RevenueTrendLineChart"
import { BranchDoctorComparisonChart } from "./components/BranchDoctorComparisonChart"
import {toast} from "sonner";
import {DoctorItem} from "./components/DoctorItem";
import PaginationComponent from "@/components/common/Pagination" 
import {SearchBar} from "@/app/(pages)/components/SearchBar";


const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value)
}
const formatCurrencyShort = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}Millions`
  }
  else if (value >= 1000000000){
    return `${(value / 1000000000).toFixed(1)}Billions`
  }
  return formatCurrency(value)
}

export default function RevenuePage() {
  // UI Filter states (user can change without triggering fetch)
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(new Date().getDate() - 7)))
  const [dateTo, setDateTo] = useState(new Date())
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedInterval, setSelectedInterval] = useState(1) // Default to 1 day
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keywordDoctor, setKeywordDoctor] = useState("");
  const [submitKeywordDoctor, setSubmitKeywordDoctor] = useState("");
  // Applied filter states (used for API calls)
  const [appliedDateFrom, setAppliedDateFrom] = useState(new Date(new Date().setDate(new Date().getDate() - 7)))
  const [appliedDateTo, setAppliedDateTo] = useState(new Date())
  const [appliedBranch, setAppliedBranch] = useState("all")
  const [appliedDoctor, setAppliedDoctor] = useState("")
  const [appliedInterval, setAppliedInterval] = useState(1)

  // Data states
  const [branches, setBranches] = useState([])
  const [doctors, setDoctors] = useState([])
  const [summaryRevenue, setSummaryRevenue] = useState({
    total_revenue: {
        consultation_revenue: 0,
        product_revenue: 0,
        total_revenue: 0,
    },
    total_revenue_timeline: []
  })
  // All Branches Revenue Data
  const [branchRevenue, setBranchRevenue] = useState([])

  // Single branch summary data 
  const [singleBranchSummaryRevenue, setSingleBranchSummaryRevenue] = useState({
    total_revenue: {
        consultation_revenue: 0,
        consultation_count: 0,
    },
    total_revenue_timeline: []
  })

  //Doctor Revenue Data
  const [doctorSummaryRevenue, setDoctorSummaryRevenue] = useState({
    total_revenue: {
        consultation_revenue: 0,
        consultation_count: 0,
    },
    total_revenue_timeline: []
  })

  // Fetch branches on initial load   
  useEffect (() => {
    async function getBranches(){
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/list`,{
                method: "GET",
                credentials: "include",
            })
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch branches")
            }
            setBranches(data.branchList)
        }
        catch (error){
            console.error("Error fetching branches:", error)
        }
    }
    getBranches();
  },[])

  // Fetch Doctors when selected branch changes
  useEffect (() => {
    if (selectedBranch === "all") {
        setDoctors([]);
        return;
    }
    async function getDoctors(){
        
        try{
            const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/employee/list/doctors/branch`, {
                branch_id: selectedBranch,
                page: currentPage, 
                keyword: submitKeywordDoctor,
            });
            const response = await fetch(url);
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch doctors")
            }
            setDoctors(data.doctorList);
            setTotalPages(data.totalPages);
            if (data.totalPages < currentPage){
                setCurrentPage(1);
            }
        }
        catch (error){
            console.error("Error fetching doctors:", error)
            toast.error("Error fetching doctors")
        }
    }
    getDoctors();
  }, [selectedBranch, currentPage, submitKeywordDoctor])


  // Fetch data when applied filters change
  useEffect(() => {
    if (appliedBranch !== "all") {
      return
    }
    
    async function fetchSummaryData() {
      try {
        const startDate = format(appliedDateFrom, "yyyy-MM-dd")
        const endDate = format(appliedDateTo, "yyyy-MM-dd")
        const interval = appliedInterval
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/revenue/summary?startDate=${startDate}&endDate=${endDate}&interval=${interval}`,
          {
            method: "GET",
            credentials: "include",
          }
        )
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch summary data")
        }
        console.log("Fetched summary data:", data)
        setSummaryRevenue({
          total_revenue: data.data.total_revenue,
          total_revenue_timeline: data.data.total_revenue_timeline,
        })
        setBranchRevenue(data.data.branch_data)
      } catch (error) {
        console.error("Error fetching summary data:", error)
        toast.error("Error fetching summary data")
      }
    }

    fetchSummaryData()
  }, [appliedDateFrom, appliedDateTo, appliedBranch, appliedInterval])

  useEffect (() => {
    if (appliedBranch === "all")
        return;
    try{
        const fetchBranchSummaryData = async () => {
            const startDate = format(appliedDateFrom, "yyyy-MM-dd")
            const endDate = format(appliedDateTo, "yyyy-MM-dd")
            const interval = appliedInterval
            const branch_id = appliedBranch
            const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/revenue/summary/branch`, {
                startDate: startDate,
                endDate: endDate,
                branch_id: branch_id,
                interval: interval,
            });
            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch branch summary data")
            }
            setSingleBranchSummaryRevenue({
                total_revenue:{
                    consultation_revenue: data.data.total_consultation_revenue,
                    consultation_count: data.data.total_consultation_count,
                }
                ,
                total_revenue_timeline: data.data.timeline_data,
            })

        }
        fetchBranchSummaryData();
    }
    catch(error){
        console.error("Error fetching branch summary data:", error)
        toast.error("Error fetching branch summary data")
    }

  }, [appliedBranch, appliedDateFrom, appliedDateTo, appliedInterval])


  useEffect (() => {
    if (appliedBranch === "all" || !appliedDoctor)
        return;
    try{
        const fetchDoctorSummaryData = async () => {
            const startDate = format(appliedDateFrom, "yyyy-MM-dd")
            const endDate = format(appliedDateTo, "yyyy-MM-dd")
            const interval = appliedInterval
            const branch_id = appliedBranch
            const doctor_id = appliedDoctor.employee_id
            const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/revenue/summary/branch/doctor`, {
                startDate: startDate,
                endDate: endDate,
                branch_id: branch_id,
                doctor_id: doctor_id,
                interval: interval,
            });
            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch doctor summary data")
            }
            setDoctorSummaryRevenue({
                total_revenue:{
                    consultation_revenue: data.data.total_consultation_revenue,
                    consultation_count: data.data.total_consultation_count,
                }
                ,
                total_revenue_timeline: data.data.timeline_data,
            })
        }
        fetchDoctorSummaryData();
    }
    catch (error){
        console.error("Error fetching doctor summary data:", error)
        toast.error("Error fetching doctor summary data")
    }
  }, [appliedBranch, appliedDoctor, appliedDateFrom, appliedDateTo, appliedInterval])

  // Handle apply filters
  const handleApplyFilters = () => {
    // Only update if values actually changed
    const dateFromChanged = appliedDateFrom.getTime() !== dateFrom.getTime()
    const dateToChanged = appliedDateTo.getTime() !== dateTo.getTime()
    const branchChanged = appliedBranch !== selectedBranch
    const doctorChanged = appliedDoctor !== selectedDoctor
    const intervalChanged = appliedInterval !== selectedInterval
    // Check interval can be inside start and end date range
    if (selectedInterval === 7){
        const diffTime = Math.abs(dateTo - dateFrom);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        if (diffDays < 7){
            toast.error("Interval of 7 days cannot fit inside selected date range")
            return;
        }
    }
    else if (selectedInterval === 30){
        const diffTime = Math.abs(dateTo - dateFrom);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        if (diffDays < 30){
            toast.error("Interval of 30 days cannot fit inside selected date range")
            return;
        }
    }
    if (dateFromChanged || dateToChanged || branchChanged || doctorChanged || intervalChanged) {
      setAppliedDateFrom(dateFrom)
      setAppliedDateTo(dateTo)
      setAppliedBranch(selectedBranch)
      setAppliedDoctor(selectedDoctor)
      setAppliedInterval(selectedInterval)
      toast.success("Filters applied successfully")
    } else {
      toast.info("No changes to apply")
    }
  }
  

  const handleBranchChange = (branchId) => {
    setSelectedBranch(branchId)
    setSelectedDoctor("")
  }


  // Calculate KPIs from actual data
  const totalConsultation = summaryRevenue.total_revenue.consultation_revenue || 0
  const totalProduct = summaryRevenue.total_revenue.product_revenue || 0
  const totalRevenue = summaryRevenue.total_revenue.total_revenue || 0
  
  // Calculate average total revenue from timeline
  const averageTotalRevenue = summaryRevenue.total_revenue_timeline.length > 0 
    ? summaryRevenue.total_revenue_timeline.reduce((sum, item) => sum + (item.total_revenue || 0), 0) / summaryRevenue.total_revenue_timeline.length
    : 0
  
  const totalConsultationSingleBranch = singleBranchSummaryRevenue.total_revenue.consultation_revenue || 0
  const totalConsultationCountSingleBranch = singleBranchSummaryRevenue.total_revenue.consultation_count || 0
  const totalConsultationDoctor = doctorSummaryRevenue.total_revenue.consultation_revenue || 0
  const totalConsultationCountDoctor = doctorSummaryRevenue.total_revenue.consultation_count || 0
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clinic Revenue Management</h1>
          <p className="text-gray-600 mt-1">Detailed revenue statistics and analysis</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              From Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              To Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              Interval (Days)
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedInterval === 1 ? "Daily" : 
                   selectedInterval === 7 ? "Weekly" : 
                   selectedInterval === 30 ? "Monthly" : 
                   `${selectedInterval} days`}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem onClick={() => setSelectedInterval(1)}>
                  Daily (1 day)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedInterval(7)}>
                  Weekly (7 days)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedInterval(30)}>
                  Monthly (30 days)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Branch
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {branches.find(b => b.branch_id === selectedBranch)?.branch_name || "Select branch"}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem onClick={() => handleBranchChange("all")}>
                  -- Select branch --
                </DropdownMenuItem>
                {branches.map((branch) => (
                  <DropdownMenuItem
                    key={branch.branch_id}
                    onClick={() => handleBranchChange(branch.branch_id)}
                  >
                    {branch.branch_name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {selectedBranch !== "all" && (
            <div className="space-y-2 md:col-span-2 lg:col-span-4">
              <Label className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Select Doctor
              </Label>
              <div className = "my-10">
                <SearchBar
                    keyword = {keywordDoctor}
                    setKeyword = {setKeywordDoctor}
                    setSubmitKeyword = {setSubmitKeywordDoctor}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 border rounded-md p-4 max-h-[550px] overflow-y-auto">
                {doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <DoctorItem
                      key={doctor.employee_id}
                      item={doctor}
                      doctor={selectedDoctor}
                      setDoctor={setSelectedDoctor}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center text-sm text-gray-500 py-8">
                    No doctors available for this branch.
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-center">
                <PaginationComponent
                  currentPage={currentPage}
                  numberOfPages={totalPages}
                  controlPage={setCurrentPage}
                />
                </div>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleApplyFilters}
            className="bg-gradient-to-r from-sky-600 to-sky-800 hover:from-sky-500 hover:to-sky-600 text-white px-8 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Apply Filters
          </Button>
        </div>
      </div>

      {/* KPIs */}
      {appliedBranch === "all" ? (
        // KPIs for All Branches
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-sky-500 to-sky-800 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-90">Consultation Revenue</span>
            </div>
            <div className="text-3xl font-bold mb-1">{formatCurrencyShort(totalConsultation)}</div>
            <div className="text-sm opacity-90">{formatCurrency(totalConsultation)}</div>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-green-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-90">Product Sales Revenue</span>
            </div>
            <div className="text-3xl font-bold mb-1">{formatCurrencyShort(totalProduct)}</div>
            <div className="text-sm opacity-90">{formatCurrency(totalProduct)}</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-300 to-yellow-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-90">Total Revenue</span>
            </div>
            <div className="text-3xl font-bold mb-1">{formatCurrencyShort(totalRevenue)}</div>
            <div className="text-sm opacity-90">All Branches</div>
          </div>

          <div className="bg-gradient-to-br from-rose-300 to-rose-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-90">Avg Revenue Per Interval</span>
            </div>
            <div className="text-3xl font-bold mb-1">{formatCurrencyShort(averageTotalRevenue)}</div>
            <div className="text-sm opacity-90">{formatCurrency(averageTotalRevenue)}</div>
          </div>
        </div>
      ) : (
        // KPIs for Single Branch
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-90">Branch Consultation Revenue</span>
            </div>
            <div className="text-3xl font-bold mb-1">{formatCurrencyShort(totalConsultationSingleBranch)}</div>
            <div className="text-sm opacity-90">{formatCurrency(totalConsultationSingleBranch)}</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-90">Branch Consultation Count</span>
            </div>
            <div className="text-3xl font-bold mb-1">{totalConsultationCountSingleBranch}</div>
            <div className="text-sm opacity-90">
              {branches.find(b => b.branch_id === appliedBranch)?.branch_name}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-90">Doctor Consultation Revenue</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {appliedDoctor ? formatCurrencyShort(totalConsultationDoctor) : "N/A"}
            </div>
            <div className="text-sm opacity-90">
              {appliedDoctor ? formatCurrency(totalConsultationDoctor) : "Select a doctor"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-90">Doctor Consultation Count</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {appliedDoctor ? totalConsultationCountDoctor : "N/A"}
            </div>
            <div className="text-sm opacity-90">
              {appliedDoctor ? selectedDoctor.employee_name : "Select a doctor"}
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      { appliedBranch === "all" && 
      <RevenueBarChart 
        data={branchRevenue}
        selectedBranch={selectedBranch}
      />}
      
      
      {/* Pie Chart - Revenue Structure */}
      {appliedBranch === "all" && 
      <RevenueStructurePieChart data={summaryRevenue.total_revenue} />}
  

      {/* Line Chart - Timeline */}
      {appliedBranch === "all" &&
      <RevenueTrendLineChart data={summaryRevenue.total_revenue_timeline} />}

      {/* Branch vs Doctor Comparison Chart */}
      {appliedBranch !== "all" && (
        <BranchDoctorComparisonChart 
          branchData={singleBranchSummaryRevenue.total_revenue_timeline}
          doctorData={selectedDoctor ? doctorSummaryRevenue.total_revenue_timeline : []}
          doctorName={selectedDoctor?.employee_name || ""}
        />
      )}

    </div>
  )
}