"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Star,
  BookOpen,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

interface CartItem {
  id: string;
  courseId: number;
  title: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  thumbnail?: string;
  rating: number;
  ratingCount: number;
  totalHours: number;
  lessonsCount: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  quantity: number;
}

const mockCartItems: CartItem[] = [
  {
    id: "1",
    courseId: 1,
    title: "Complete Web Development Bootcamp 2024",
    instructor: "Dr. Angela Yu",
    price: 84.99,
    originalPrice: 199.99,
    rating: 4.7,
    ratingCount: 275842,
    totalHours: 65,
    lessonsCount: 386,
    level: "Beginner",
    quantity: 1,
  },
  {
    id: "2",
    courseId: 2,
    title: "React - The Complete Guide (includes Hooks, React Router, Redux)",
    instructor: "Maximilian Schwarzmüller",
    price: 74.99,
    originalPrice: 139.99,
    rating: 4.6,
    ratingCount: 148203,
    totalHours: 48,
    lessonsCount: 492,
    level: "Intermediate",
    quantity: 1,
  },
  {
    id: "3",
    courseId: 3,
    title: "Node.js, Express, MongoDB & More: The Complete Bootcamp 2024",
    instructor: "Jonas Schmedtmann",
    price: 89.99,
    originalPrice: 179.99,
    rating: 4.8,
    ratingCount: 89654,
    totalHours: 42,
    lessonsCount: 227,
    level: "Advanced",
    quantity: 1,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const originalTotal = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0
  );
  const savings = originalTotal - subtotal;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">
            {cartItems.length} course{cartItems.length !== 1 ? "s" : ""} in cart
          </p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        /* Empty Cart */
        <div className="text-center py-16">
          <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Keep shopping to find a course! Browse our catalog to find great
            courses to add to your cart.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/manage/mentee/explore-courses">Browse Courses</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex gap-4">
                  {/* Course Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          width={128}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <BookOpen className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {item.title}
                        </h3>

                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {item.instructor}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{item.rating}</span>
                            <span>({item.ratingCount.toLocaleString()})</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{item.totalHours} hours</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{item.lessonsCount} lessons</span>
                          </div>

                          <Badge className={getLevelColor(item.level)}>
                            {item.level}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            ${item.price}
                          </span>
                          {item.originalPrice &&
                            item.originalPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ${item.originalPrice}
                              </span>
                            )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 h-8 w-8 hover:bg-gray-200"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 h-8 w-8 hover:bg-gray-200"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({cartItems.length} items):
                  </span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span className="font-medium">-${savings.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-lg py-6">
                Proceed to Checkout
              </Button>

              {savings > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    🎉 You're saving ${savings.toFixed(2)} on this order!
                  </p>
                </div>
              )}

              {/* Continue Shopping */}
              <Button variant="outline" asChild className="w-full mt-3">
                <Link href="/manage/mentee/explore-courses">
                  Continue Shopping
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
