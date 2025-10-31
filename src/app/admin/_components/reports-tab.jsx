"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiDotsHorizontal } from "react-icons/hi"
import { MdWarning, MdCheckCircle, MdCancel } from "react-icons/md"
import { AiOutlineClockCircle } from "react-icons/ai"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ReportsTab() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/admin/reports")
      const data = await response.json()

      if (data.success) {
        setReports(data.data)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError("Failed to fetch reports")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (data.success) {
        setReports(reports.map((report) => (report.id === reportId ? { ...report, status: newStatus } : report)))
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError("Failed to update report status")
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AiOutlineClockCircle className="h-4 w-4" />
      case "resolved":
        return <MdCheckCircle className="h-4 w-4" />
      case "dismissed":
        return <MdCancel className="h-4 w-4" />
      default:
        return <MdWarning className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "resolved":
        return "default"
      case "dismissed":
        return "outline"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading reports...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Reports</h3>
        <Badge variant="secondary">{reports.length} Total Reports</Badge>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MdWarning className="h-5 w-5 text-orange-500" />
                  {report.report_reason}
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusVariant(report.status)} className="flex items-center gap-1">
                    {getStatusIcon(report.status)}
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <HiDotsHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(report.id, "resolved")}
                        className="text-green-600"
                      >
                        <MdCheckCircle className="mr-2 h-4 w-4" />
                        Mark Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(report.id, "dismissed")}
                        className="text-gray-600"
                      >
                        <MdCancel className="mr-2 h-4 w-4" />
                        Dismiss
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(report.id, "pending")}
                        className="text-orange-600"
                      >
                        <AiOutlineClockCircle className="mr-2 h-4 w-4" />
                        Mark Pending
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{report.report_details}</p>
                </div>

                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Reporter:</span> {report.reporter_name} ({report.reporter_email})
                  </div>
                  <div>
                    <span className="font-medium">Reported User:</span> {report.reported_user_name} (
                    {report.reported_user_email})
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Reported on: {new Date(report.created_at).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reports.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <MdWarning className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reports found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
