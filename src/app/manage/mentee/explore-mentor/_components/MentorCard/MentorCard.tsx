"use client";

import { Card } from "@/components/ui/card";
import { MentorType } from "@/schemaValidations/mentor.schema";
import { MapPin, MessageCircle, Star, Users } from "lucide-react";
import Image from "next/image";

interface MentorCardProps {
  mentor: MentorType;
}

export default function MentorCard({ mentor }: MentorCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {mentor.coverPhoto && (
          <Image
            src={mentor?.coverPhoto}
            alt="Cover"
            fill
            className="object-cover"
          />
        )}

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

      <div className="pt-8 px-6 pb-4">
        <div className="space-y-3 mt-2">
          <div>
            {mentor.major && (
              <p className="light:text-gray-600 text-base">{mentor.major}</p>
            )}
            <h3 className="font-bold text-xl light:text-gray-900 mb-1 mt-2">
              {mentor?.name}
            </h3>
          </div>
        </div>
      </div>
    </Card>
  );
}
