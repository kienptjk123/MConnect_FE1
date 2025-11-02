"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import {
  useCreateMentorCardMutation,
  useDefaultCardQuery,
  useMentorCardsQuery,
  useSetDefaultCardMutation,
} from "@/queries/useMentorCard";
import {
  useCreateWithdrawRequestMutation,
  useMentorEarningsQuery,
  useMentorWithdrawRequestsQuery,
} from "@/queries/useWithdraw";
import { useProfile } from "@/stores/profileStore";
import {
  Copy,
  CreditCard,
  MoreHorizontal,
  Plus,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

export default function MentorWithdrawPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountOwnerName, setAccountOwnerName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const profile = useProfile();

  const { data: earningsData, isLoading: earningsLoading } =
    useMentorEarningsQuery();
  const { data: requestsData, isLoading: requestsLoading } =
    useMentorWithdrawRequestsQuery({ limit: 50 });
  const { data: cardsData, isLoading: cardsLoading } = useMentorCardsQuery();
  const { data: defaultCardData } = useDefaultCardQuery();
  const createMutation = useCreateWithdrawRequestMutation();
  const createCardMutation = useCreateMentorCardMutation();
  const setDefaultCardMutation = useSetDefaultCardMutation();

  // Set default account owner name from profile
  useEffect(() => {
    if (profile?.name && !accountOwnerName) {
      setAccountOwnerName(profile.name);
    }
  }, [profile?.name, accountOwnerName]);

  // Load default card info when available
  useEffect(() => {
    if (defaultCardData?.payload?.result) {
      const defaultCard = defaultCardData.payload.result;
      setAccountNumber(defaultCard.accountNumber);
      setBankName(defaultCard.bankName);
      setAccountOwnerName(defaultCard.cardHolderName);
      setSelectedCardId(defaultCard.id);
    }
  }, [defaultCardData]);

  const earnings = earningsData?.payload?.result;
  const requests = requestsData?.payload?.result?.requests || [];
  const cards = cardsData?.payload?.result?.cards || [];

  // Mock data for the chart - you can replace this with real data
  const chartData = [
    { name: "Aug 01", value: 30000 },
    { name: "Aug 05", value: 25000 },
    { name: "Aug 10", value: 35000 },
    { name: "Aug 15", value: 31749 },
    { name: "Aug 20", value: 28000 },
    { name: "Aug 25", value: 32000 },
    { name: "Aug 30", value: 29000 },
    { name: "Aug 31", value: 33000 },
  ];

  // Format cards for display
  const paymentMethods = (cards || [])
    .filter((card) => card && card.id) // Filter out null/undefined cards
    .map((card) => ({
      id: card.id,
      type: "BANK", // Since we're storing bank account info, not actual cards
      number: `**** **** **** ${card.accountNumber?.slice(-4) || "****"}`,
      bankName: card.bankName || "",
      holder: card.cardHolderName || "",
      isSelected: selectedCardId === card.id,
      isDefault: card.isDefault,
      fullAccountNumber: card.accountNumber || "",
    }));

  const handleCardSelect = (card: any) => {
    if (!card) return;
    setSelectedCardId(card.id);
    setAccountNumber(card.fullAccountNumber || "");
    setBankName(card.bankName || "");
    setAccountOwnerName(card.holder || "");
  };

  const handleAddNewCard = async () => {
    if (!accountNumber || !bankName || !accountOwnerName) {
      toast.error("Please fill in all card information");
      return;
    }

    try {
      await createCardMutation.mutateAsync({
        account_number: accountNumber,
        bank_name: bankName,
        card_holder_name: accountOwnerName,
        is_default: !cards || cards.length === 0, // Make first card default
      });
      toast.success("Card added successfully");
      setIsAddCardDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add card");
    }
  };

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

    if (!accountNumber || !bankName || !accountOwnerName) {
      toast.error("Please fill in all payment information");
      return;
    }

    try {
      await createMutation.mutateAsync({
        amount,
        account_number: accountNumber,
        bank_name: bankName,
        account_owner_name: accountOwnerName,
      });
      toast.success("Withdrawal request created successfully");
      setIsDialogOpen(false);
      setWithdrawAmount("");
      // Don't clear card info if using saved card
      if (!selectedCardId) {
        setAccountNumber("");
        setBankName("");
        setAccountOwnerName("");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create withdrawal request"
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Pending
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Rejected
          </Badge>
        );
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
    <div className="container mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Good Morning</p>
          <h1 className="text-2xl font-bold">Earning</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border rounded-lg bg-white"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">
            1
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {earnings ? formatCurrency(earnings.total_earned) : "$0.00"}
                </p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {earnings
                    ? formatCurrency(earnings.available_balance)
                    : "$0.00"}
                </p>
                <p className="text-sm text-gray-600">Current Balance</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {earnings
                    ? formatCurrency(earnings.total_withdrawn)
                    : "$0.00"}
                </p>
                <p className="text-sm text-gray-600">Total Withdrawals</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">162,000 đ</p>
                <p className="text-sm text-gray-600">Today Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Statistics Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Statistic</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Revenue</span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cards Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Cards</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Revenue</span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {cardsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading cards...</p>
              </div>
            ) : cards && cards.length > 0 ? (
              <>
                {/* Display first card as featured card */}
                {(cards || [])
                  .filter((card) => card && card.id)
                  .slice(0, 1)
                  .map(
                    (card) =>
                      card && (
                        <div
                          key={card.id}
                          className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-xl"
                        >
                          <div className="flex justify-between items-start mb-8">
                            <span className="text-2xl font-bold">BANK</span>
                            <span className="text-lg">...</span>
                            {card.isDefault && (
                              <Badge className="bg-green-500 text-white">
                                Default
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg tracking-wider">
                              **** **** ****{" "}
                              {card.accountNumber?.slice(-4) || "****"}
                            </p>
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-xs opacity-80">BANK</p>
                                <p className="text-sm">{card.bankName || ""}</p>
                              </div>
                              <div>
                                <p className="text-xs opacity-80">
                                  ACCOUNT HOLDER
                                </p>
                                <p className="text-sm">
                                  {card.cardHolderName || ""}
                                </p>
                              </div>
                              <Copy className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      )
                  )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No saved payment methods</p>
              </div>
            )}

            {/* Add New Card Button */}
            <Dialog
              open={isAddCardDialogOpen}
              onOpenChange={setIsAddCardDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full py-6 border-dashed">
                  <Plus className="w-4 h-4 mr-2" />
                  Add new card
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Payment Method</DialogTitle>
                  <DialogDescription>
                    Add a new bank account for withdrawals
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="new_account_number">Account Number</Label>
                    <Input
                      id="new_account_number"
                      type="text"
                      placeholder="Enter bank account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_bank_name">Bank Name</Label>
                    <Input
                      id="new_bank_name"
                      type="text"
                      placeholder="Enter bank name"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_card_holder_name">
                      Account Holder Name
                    </Label>
                    <Input
                      id="new_card_holder_name"
                      type="text"
                      placeholder="Enter account holder name"
                      value={accountOwnerName}
                      onChange={(e) => setAccountOwnerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddCardDialogOpen(false);
                        setAccountNumber("");
                        setBankName("");
                        setAccountOwnerName("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddNewCard}
                      disabled={createCardMutation.isPending}
                    >
                      {createCardMutation.isPending ? "Adding..." : "Add Card"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Withdraw Money Section */}
        <Card>
          <CardHeader>
            <CardTitle>Withdraw your money</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {cardsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-xs text-gray-500">Loading cards...</p>
                </div>
              ) : paymentMethods && paymentMethods.length > 0 ? (
                paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      method.isSelected
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleCardSelect(method)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        BANK
                      </div>
                      <div>
                        <p className="text-sm font-medium">{method.bankName}</p>
                        <p className="text-xs text-gray-500">
                          {method.number} • {method.holder}
                        </p>
                        {method.isDefault && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Default
                          </Badge>
                        )}
                      </div>
                    </div>
                    {method.isSelected && (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No saved payment methods</p>
                  <p className="text-xs">Add a card to get started</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold">
                  {earnings
                    ? formatCurrency(earnings.available_balance)
                    : "$0.00"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Current Balance</p>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={!earnings || earnings.available_balance <= 0}
                  >
                    Withdraw Money
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Withdrawal Request</DialogTitle>
                    <DialogDescription>
                      Enter the amount you want to withdraw. Maximum:{" "}
                      {earnings
                        ? formatCurrency(earnings.available_balance)
                        : "0 VND"}
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

                    {/* Payment method selection */}
                    {cards && cards.length > 0 && (
                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <div className="space-y-2">
                          {(cards || [])
                            .filter((card) => card && card.id)
                            .map((card) => (
                              <div
                                key={card.id}
                                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                                  selectedCardId === card.id
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-200"
                                }`}
                                onClick={() =>
                                  handleCardSelect({
                                    id: card.id,
                                    bankName: card.bankName,
                                    holder: card.cardHolderName,
                                    fullAccountNumber: card.accountNumber,
                                  })
                                }
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                                    BANK
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {card.bankName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      ****{" "}
                                      {card.accountNumber?.slice(-4) || "****"}{" "}
                                      • {card.cardHolderName}
                                    </p>
                                  </div>
                                </div>
                                {selectedCardId === card.id && (
                                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg
                                      className="w-2 h-2 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            ))}

                          {/* Manual entry option */}
                          <div
                            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                              selectedCardId === null
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200"
                            }`}
                            onClick={() => {
                              setSelectedCardId(null);
                              setAccountNumber("");
                              setBankName("");
                              setAccountOwnerName(profile?.name || "");
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <Plus className="w-8 h-5" />
                              <p className="text-sm font-medium">
                                Enter manually
                              </p>
                            </div>
                            {selectedCardId === null && (
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-2 h-2 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Manual entry fields - show when no card selected or no cards exist */}
                    {(selectedCardId === null ||
                      !cards ||
                      cards.length === 0) && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="account_number">Account Number</Label>
                          <Input
                            id="account_number"
                            type="text"
                            placeholder="Enter bank account number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bank_name">Bank Name</Label>
                          <Input
                            id="bank_name"
                            type="text"
                            placeholder="Enter bank name (e.g., Vietcombank, Techcombank)"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="account_owner_name">
                            Account Owner Name
                          </Label>
                          <Input
                            id="account_owner_name"
                            type="text"
                            placeholder="Enter account owner name"
                            value={accountOwnerName}
                            onChange={(e) =>
                              setAccountOwnerName(e.target.value)
                            }
                            required
                          />
                          {profile?.name && (
                            <p className="text-xs text-muted-foreground">
                              Recommended: {profile.name}
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {/* Show selected card info when card is selected */}
                    {selectedCardId !== null && cards && cards.length > 0 && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">
                          Selected Payment Method:
                        </h4>
                        <p className="text-sm">Bank: {bankName}</p>
                        <p className="text-sm">
                          Account: **** {accountNumber?.slice(-4) || "****"}
                        </p>
                        <p className="text-sm">Holder: {accountOwnerName}</p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setWithdrawAmount("");
                          // Reset to default card if available
                          if (defaultCardData?.payload?.result) {
                            const defaultCard = defaultCardData.payload.result;
                            setAccountNumber(defaultCard.accountNumber);
                            setBankName(defaultCard.bankName);
                            setAccountOwnerName(defaultCard.cardHolderName);
                            setSelectedCardId(defaultCard.id);
                          } else {
                            setAccountNumber("");
                            setBankName("");
                            setAccountOwnerName("");
                            setSelectedCardId(null);
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleWithdraw}
                        disabled={createMutation.isPending}
                      >
                        {createMutation.isPending
                          ? "Processing..."
                          : "Submit Request"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Withdraw History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Withdraw History</CardTitle>
          </CardHeader>
          <CardContent>
            {requestsLoading ? (
              <p>Loading...</p>
            ) : !requests || requests.length === 0 ? (
              <p className="text-muted-foreground">
                No withdrawal requests yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>DATE</TableHead>
                    <TableHead>METHOD</TableHead>
                    <TableHead>AMOUNT</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests
                    ?.filter((request) => request && request.id)
                    .slice(0, 7)
                    .map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="text-sm">
                          {new Date(request.created_at).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}{" "}
                          at{" "}
                          {new Date(request.created_at).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                              VISA
                            </div>
                            <span className="text-sm">{request.bank_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(request.amount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
