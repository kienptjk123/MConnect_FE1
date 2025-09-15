"use client";

import { MentorType } from "@/schemaValidations/mentor.schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { MapPin, Star, Users, MessageCircle } from "lucide-react";

interface MentorCardProps {
  mentor: MentorType;
}

export default function MentorCard({ mentor }: MentorCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {mentor.coverPhoto && (
          <Image
            src={mentor?.coverPhoto}
            alt="Cover"
            fill
            className="object-cover"
          />
        )}

        {/* Avatar */}
        <div className="absolute -bottom-8 left-6">
          <div className="w-16 h-16 rounded-full border-4 border-white bg-gray-100 overflow-hidden">
            {mentor?.avatar ? (
              <Image
                src={mentor?.avatar}
                alt={mentor?.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">
                  {mentor?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-10 p-6">
        <div className="flex justify-end mb-3">
          <Badge
            variant={mentor.status === "VERIFIED" ? "default" : "secondary"}
            className="text-xs"
          >
            {mentor.status}
          </Badge>
        </div>

        {/* Mentor Info */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {mentor?.name}
            </h3>
            <p className="text-sm text-gray-600">@{mentor?.username}</p>
          </div>

          {/* Location */}
          {mentor.location && (
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{mentor.location}</span>
            </div>
          )}

          {/* Bio */}
          {mentor.bio && (
            <p className="text-gray-600 text-sm line-clamp-2">{mentor.bio}</p>
          )}

          {/* Description */}
          {mentor.description && (
            <p className="text-gray-600 text-sm line-clamp-3">
              {mentor.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600 text-sm">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                <span>4.8</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Users className="h-4 w-4 mr-1" />
                <span>254 Students</span>
              </div>
            </div>

            <div className="flex items-center text-blue-600 text-sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>Contact</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
