"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

interface CartItem {
  id: string;
  title: string;
  instructor: string;
  image: string;
  originalPrice: number;
  discountPrice?: number;
  quantity: number;
  duration: string;
  level: string;
}

const mockCartItems: CartItem[] = [
  {
    id: "1",
    title: "Complete JavaScript Course 2024",
    instructor: "John Smith",
    image: "/images/sandbox1.png",
    originalPrice: 199,
    discountPrice: 99,
    quantity: 1,
    duration: "40 hours",
    level: "Beginner",
  },
  {
    id: "2",
    title: "React Advanced Patterns",
    instructor: "Sarah Johnson",
    image: "/images/sandbox2.png",
    originalPrice: 149,
    discountPrice: 79,
    quantity: 1,
    duration: "25 hours",
    level: "Advanced",
  },
  {
    id: "3",
    title: "Node.js Backend Development",
    instructor: "Mike Chen",
    image: "/images/sandbox3.png",
    originalPrice: 179,
    quantity: 1,
    duration: "30 hours",
    level: "Intermediate",
  },
];

export default function CartDropdown() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const displayItems = cartItems.slice(0, 3); // Show only 3 items in dropdown

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discountPrice || item.originalPrice;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-10 w-10 rounded-full hover:bg-pink-50 transition-colors"
        >
          <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-white" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {totalItems > 9 ? "9+" : totalItems}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-96 p-0" align="end" sideOffset={5}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-900">Shopping Cart</h3>
          {totalItems > 0 && (
            <Badge variant="secondary" className="text-xs">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </Badge>
          )}
        </div>

        {/* Cart Items */}
        <ScrollArea className="max-h-80">
          {cartItems.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 mb-2">Your cart is empty</p>
              <Button asChild variant="outline" size="sm">
                <Link href="/manage/mentee/explore-courses">
                  Browse Courses
                </Link>
              </Button>
            </div>
          ) : (
            <div className="py-2">
              {displayItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`px-4 py-3 ${
                    index !== displayItems.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Course Image */}
                    <div className="flex-shrink-0">
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            by {item.instructor}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {item.duration}
                            </span>
                            <span>•</span>
                            <span>{item.level}</span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          {item.discountPrice ? (
                            <>
                              <span className="text-sm font-semibold text-green-600">
                                ${item.discountPrice}
                              </span>
                              <span className="text-xs text-gray-500 line-through">
                                ${item.originalPrice}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-semibold text-gray-900">
                              ${item.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium px-2 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Show More Indicator */}
              {cartItems.length > 3 && (
                <div className="px-4 py-2 text-center text-xs text-gray-500 border-t border-gray-100">
                  and {cartItems.length - 3} more items...
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {cartItems.length > 0 && (
          <>
            <Separator />
            <div className="p-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">
                  Subtotal:
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ${calculateSubtotal()}
                </span>
              </div>

              <div className="space-y-2">
                <Button
                  asChild
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  <Link href="/manage/mentee/cart">View Cart & Checkout</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/manage/mentee/explore-courses">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
