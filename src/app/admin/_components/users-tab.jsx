"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiDotsHorizontal } from "react-icons/hi"
import { FaUserCheck, FaUserTimes, FaEnvelope, FaPhone, FaSearch } from "react-icons/fa"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UsersTab() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchEmail, setSearchEmail] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchEmail.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter((user) => user.email.toLowerCase().includes(searchEmail.toLowerCase()))
      setFilteredUsers(filtered)
    }
  }, [searchEmail, users])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (data.success) {
        setUsers(data.data)
        setFilteredUsers(data.data)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleBanToggle = async (userId, currentBanStatus) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isBanned: !currentBanStatus }),
      })

      const data = await response.json()

      if (data.success) {
        const updatedUsers = users.map((user) =>
          user.id === userId ? { ...user, is_banned: !currentBanStatus } : user,
        )
        setUsers(updatedUsers)
        setFilteredUsers(
          updatedUsers.filter(
            (user) => searchEmail.trim() === "" || user.email.toLowerCase().includes(searchEmail.toLowerCase()),
          ),
        )
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError("Failed to update user status")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>
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
        <h3 className="text-lg font-semibold">User Management</h3>
        <Badge variant="secondary">{users.length} Total Users</Badge>
      </div>

      {/* Search Input */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search users by email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{user.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FaEnvelope className="h-4 w-4" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1">
                          <FaPhone className="h-4 w-4" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={user.is_banned ? "destructive" : "default"}>
                    {user.is_banned ? "Banned" : "Active"}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <HiDotsHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleBanToggle(user.id, user.is_banned)}
                        className={user.is_banned ? "text-green-600" : "text-red-600"}
                      >
                        {user.is_banned ? (
                          <>
                            <FaUserCheck className="mr-2 h-4 w-4" />
                            Unban User
                          </>
                        ) : (
                          <>
                            <FaUserTimes className="mr-2 h-4 w-4" />
                            Ban User
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredUsers.length === 0 && searchEmail.trim() !== "" && (
          <Card>
            <CardContent className="text-center py-8">
              <FaSearch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found with email containing "{searchEmail}"</p>
            </CardContent>
          </Card>
        )}

        {filteredUsers.length === 0 && searchEmail.trim() === "" && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No users found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
