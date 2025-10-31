"use client";

import { useState, useEffect } from "react";
import { FaUser, FaUsers } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useToast } from "@/components/ui/use-toast";

export default function NotificationsTab() {
  const [notificationForm, setNotificationForm] = useState({
    type: "individual",
    userId: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await fetch("/api/admin/users");
        const data = await response.json();
        if (data.success) {
          // Sorting
          const sortedUsers = data.data.sort((a, b) =>
            a.email.localeCompare(b.email)
          );
          setUsers(sortedUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (field, value) => {
    setNotificationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const sendNotification = async () => {
    if (!notificationForm.message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a notification message",
        variant: "destructive",
      });
      return;
    }

    if (
      notificationForm.type === "individual" &&
      !notificationForm.userId.trim()
    ) {
      toast({
        title: "Error", 
        description: "Please select a user for individual notification",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    try {
      const endpoint =
        notificationForm.type === "individual"
          ? "/api/admin/notifications/send-individual"
          : "/api/admin/notifications/send-broadcast";

      const payload =
        notificationForm.type === "individual"
          ? {
              userId: notificationForm.userId,
              message: notificationForm.message,
            }
          : { message: notificationForm.message };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: `Notification sent successfully! ${data.notifiedCount ? `Notified ${data.notifiedCount} user(s)` : ''}`,
        });
        // Reset form on success
        setNotificationForm({
          type: "individual",
          userId: "",
          message: "",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send notification",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Send notification error:", error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

return (
    <div className="min-h-screen -mt-5 flex items-start justify-center p-4 pt-16">
        <div className="w-full max-w-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-4"></div>

            {/* Notification Form */}
            <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                    <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                        <IoSend className="h-4 w-4" />
                        Send Notification
                    </h3>
                </div>
                <div className="p-8 space-y-7">
                    {/* Notification Type */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium block mb-3">Notification Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleInputChange("type", "individual")}
                                className={`p-2.5 cursor-pointer rounded-lg border-2 transition-all text-sm ${
                                    notificationForm.type === "individual"
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                                        : "border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                <FaUser className="h-5 w-5 mx-auto mb-1.5 text-blue-600" />
                                <div className="font-medium text-sm">Individual User</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    Send to specific user
                                </div>
                            </button>
                            <button
                                onClick={() => handleInputChange("type", "broadcast")}
                                className={`p-2.5 cursor-pointer rounded-lg border-2 transition-all text-sm ${
                                    notificationForm.type === "broadcast"
                                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                                        : "border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                <FaUsers className="h-5 w-5 mx-auto mb-1.5 text-green-600" />
                                <div className="font-medium text-sm">Broadcast</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    Send to all users
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* User Selection Dropdown  */}
                    {notificationForm.type === "individual" && (
                        <div className="space-y-4">
                            <label className="text-sm font-medium block mb-3">Select User</label>
                            <select
                                value={notificationForm.userId}
                                onChange={(e) => handleInputChange("userId", e.target.value)}
                                disabled={loadingUsers}
                                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">
                                    {loadingUsers ? "Loading users..." : "Select a user"}
                                </option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id.toString()}>
                                        ID: {user.id} - {user.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}  
                    <div className="space-y-4">
                        <label className="text-sm font-medium block mb-3">
                            Notification Message
                        </label>
                        <textarea
                            placeholder="Enter your notification message..."
                            value={notificationForm.message}
                            onChange={(e) => handleInputChange("message", e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                        />
                        <div className="text-xs text-gray-500 text-right">
                            {notificationForm.message.length} characters
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={sendNotification}
                            disabled={sending || !notificationForm.message.trim()}
                            className="w-1/3 cursor-pointer px-4 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full font-medium transition-colors"
                        >
                            {sending ? (
                                <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2 inline-block" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <IoSend className="h-3 w-3 mr-2 inline-block" />
                                    Send{" "}
                                    {notificationForm.type === "broadcast"
                                        ? "to All Users"
                                        : "to User"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}