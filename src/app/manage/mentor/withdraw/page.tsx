"use client";

import React, { useState } from "react";
import { useMentorEarningsQuery, useMentorWithdrawRequestsQuery, useCreateWithdrawRequestMutation } from "@/queries/useWithdraw";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export default function MentorWithdrawPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: earningsData, isLoading: earningsLoading } = useMentorEarningsQuery();
  const { data: requestsData, isLoading: requestsLoading } = useMentorWithdrawRequestsQuery({ limit: 50 });
  const createMutation = useCreateWithdrawRequestMutation();

  const earnings = earningsData?.result;
  const requests = requestsData?.result?.requests || [];

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (earnings && amount > earnings.available_balance) {
      toast.error("Amount exceeds available balance");
      return;
    }

    try {
      await createMutation.mutateAsync({ amount });
      toast.success("Withdrawal request created successfully");
      setIsDialogOpen(false);
      setWithdrawAmount("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create withdrawal request");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>;
      case "APPROVED":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="outline" className="bg-red-50 text-red-700">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (earningsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Withdraw</h1>
      </div>

      <Tabs defaultValue="earnings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="requests">Withdrawal Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {earnings ? formatCurrency(earnings.total_earned) : formatCurrency(0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {earnings ? formatCurrency(earnings.total_withdrawn) : "0 VND"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {earnings ? formatCurrency(earnings.available_balance) : "0 VND"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button disabled={!earnings || earnings.available_balance <= 0}>
                      Request Withdrawal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Withdrawal Request</DialogTitle>
                      <DialogDescription>
                        Enter the amount you want to withdraw. Maximum: {earnings ? formatCurrency(earnings.available_balance) : "0 VND"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (VND)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          max={earnings?.available_balance}
                          min="1"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleWithdraw} disabled={createMutation.isPending}>
                          {createMutation.isPending ? "Processing..." : "Submit Request"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Earnings Breakdown</CardTitle>
              <CardDescription>Detailed breakdown of your earnings by source</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Courses</p>
                    <p className="text-sm text-muted-foreground">
                      {earnings?.breakdown.courses.transaction_count || 0} transactions
                    </p>
                  </div>
                  <p className="text-lg font-bold">
                    {earnings ? formatCurrency(earnings.breakdown.courses.total_earned) : formatCurrency(0)}
                  </p>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Single Sessions</p>
                    <p className="text-sm text-muted-foreground">
                      {earnings?.breakdown.single_sessions.transaction_count || 0} transactions
                    </p>
                  </div>
                  <p className="text-lg font-bold">
                    {earnings ? formatCurrency(earnings.breakdown.single_sessions.total_earned) : "0 VND"}
                  </p>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Work Experience Packages</p>
                    <p className="text-sm text-muted-foreground">
                      {earnings?.breakdown.work_experience_packages.transaction_count || 0} transactions
                    </p>
                  </div>
                  <p className="text-lg font-bold">
                    {earnings ? formatCurrency(earnings.breakdown.work_experience_packages.total_earned) : "0 VND"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Requests</CardTitle>
              <CardDescription>History of your withdrawal requests</CardDescription>
            </CardHeader>
            <CardContent>
              {requestsLoading ? (
                <p>Loading...</p>
              ) : requests.length === 0 ? (
                <p className="text-muted-foreground">No withdrawal requests yet</p>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium">Request #{request.id}</p>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Amount: {formatCurrency(request.amount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Created: {new Date(request.created_at).toLocaleDateString()}
                        </p>
                        {request.admin_note && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Note: {request.admin_note}
                          </p>
                        )}
                      </div>
                      {request.transaction_image && (
                        <div>
                          <img
                            src={request.transaction_image}
                            alt="Transaction receipt"
                            className="w-32 h-32 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

