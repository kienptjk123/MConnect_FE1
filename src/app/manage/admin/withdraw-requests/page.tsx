"use client";

import React, { useState } from "react";
import {
  useAllWithdrawRequestsQuery,
  useReviewWithdrawRequestMutation,
  useWithdrawRequestByIdQuery,
} from "@/queries/useWithdraw";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminWithdrawRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [adminNote, setAdminNote] = useState("");
  const [transactionImage, setTransactionImage] = useState<File | null>(null);

  const { data, isLoading, refetch } = useAllWithdrawRequestsQuery({
    status: statusFilter as any,
    limit: 50,
  });

  const { data: selectedRequest } = useWithdrawRequestByIdQuery(
    selectedRequestId || 0,
    !!selectedRequestId
  );

  const reviewMutation = useReviewWithdrawRequestMutation();

  const requests = data?.result?.requests || [];

  const handleReview = async () => {
    if (!selectedRequestId) return;

    try {
      await reviewMutation.mutateAsync({
        id: selectedRequestId,
        body: {
          status: reviewStatus,
          admin_note: adminNote || undefined,
        },
        transactionImage: transactionImage || undefined,
      });
      toast.success("Withdrawal request reviewed successfully");
      setIsReviewDialogOpen(false);
      setSelectedRequestId(null);
      setAdminNote("");
      setTransactionImage(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to review withdrawal request");
    }
  };

  const openReviewDialog = (requestId: number) => {
    setSelectedRequestId(requestId);
    setIsReviewDialogOpen(true);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading withdrawal requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Withdrawal Requests</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Withdrawal Requests</CardTitle>
          <CardDescription>Review and manage mentor withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-muted-foreground">No withdrawal requests found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>#{request.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.mentor_profile.name || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.mentor_profile.user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(request.amount)}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {request.status === "PENDING" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReviewDialog(request.id)}
                        >
                          Review
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRequestId(request.id)}
                        >
                          View Details
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Withdrawal Request</DialogTitle>
            <DialogDescription>
              Review and approve or reject the withdrawal request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedRequest && (
              <div className="space-y-2">
                <div className="p-4 border rounded-lg">
                  <p className="font-medium">Request #{selectedRequest.result.id}</p>
                  <p className="text-sm text-muted-foreground">
                    Mentor: {selectedRequest.result.mentor_profile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Amount: {formatCurrency(selectedRequest.result.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(selectedRequest.result.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={reviewStatus}
                    onValueChange={(value) => setReviewStatus(value as "APPROVED" | "REJECTED")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APPROVED">Approve</SelectItem>
                      <SelectItem value="REJECTED">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {reviewStatus === "APPROVED" && (
                  <div className="space-y-2">
                    <Label htmlFor="transaction_image">
                      Transaction Receipt Image (Optional)
                    </Label>
                    <Input
                      id="transaction_image"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setTransactionImage(e.target.files?.[0] || null)
                      }
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="admin_note">Admin Note (Optional)</Label>
                  <Textarea
                    id="admin_note"
                    placeholder="Add a note for the mentor..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleReview} disabled={reviewMutation.isPending}>
                    {reviewMutation.isPending ? "Processing..." : "Submit Review"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {selectedRequestId && !isReviewDialogOpen && (
        <Dialog open={!!selectedRequestId} onOpenChange={() => setSelectedRequestId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">Request ID: #{selectedRequest.result.id}</p>
                  <p className="text-sm text-muted-foreground">
                    Mentor: {selectedRequest.result.mentor_profile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Amount: {formatCurrency(selectedRequest.result.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: {getStatusBadge(selectedRequest.result.status)}
                  </p>
                  {selectedRequest.result.admin_note && (
                    <p className="text-sm text-muted-foreground">
                      Admin Note: {selectedRequest.result.admin_note}
                    </p>
                  )}
                  {selectedRequest.result.transaction_image && (
                    <div>
                      <p className="text-sm font-medium mb-2">Transaction Receipt:</p>
                      <img
                        src={selectedRequest.result.transaction_image}
                        alt="Transaction receipt"
                        className="w-full h-auto rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

