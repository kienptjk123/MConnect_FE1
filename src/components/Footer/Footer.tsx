import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Top contact section */}
      <div className="border-b border-gray-700">
        <div className=" px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Address */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-400 text-sm font-medium">Address:</p>
                <p className="text-white font-semibold">FPT University</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-400 text-sm font-medium">Phone:</p>
                <p className="text-white font-semibold">(00) 875 784 568</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-400 text-sm font-medium">Email:</p>
                <p className="text-white font-semibold">
                  mconnect315@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">M</span>
              </div>
              <span className="text-white text-xl font-bold">CONNECT</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Interdum velit laoreet id donec ultrices tincidunt arcu. Tincidunt
              tortor aliqua facilisi cras fermentum odio eu.
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-4 h-4 text-white" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
              >
                <Instagram className="w-4 h-4 text-white" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <span className="text-white text-sm font-bold">in</span>
              </Link>
              <Link
                href="#"
                className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
              >
                <Twitter className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>

          {/* Our Services */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Our Services:</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>▶</span> Web Development
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>▶</span> UI/UX Design
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>▶</span> Management
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>▶</span> Digital Marketing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>▶</span> Blog News
                </Link>
              </li>
            </ul>
          </div>

          {/* Gallery */}
          {/* <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Gallery</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square bg-gray-700 rounded overflow-hidden">
                <Image
                  src="/images/gallery1.jpg"
                  alt="Gallery image 1"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square bg-gray-700 rounded overflow-hidden">
                <Image
                  src="/images/gallery2.jpg"
                  alt="Gallery image 2"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square bg-gray-700 rounded overflow-hidden">
                <Image
                  src="/images/gallery3.jpg"
                  alt="Gallery image 3"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square bg-gray-700 rounded overflow-hidden">
                <Image
                  src="/images/gallery4.jpg"
                  alt="Gallery image 4"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square bg-gray-700 rounded overflow-hidden">
                <Image
                  src="/images/gallery5.jpg"
                  alt="Gallery image 5"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square bg-gray-700 rounded overflow-hidden">
                <Image
                  src="/images/gallery6.jpg"
                  alt="Gallery image 6"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          </div> */}

          {/* Subscribe */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Subscribe</h3>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
              />
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors">
                SUBSCRIBE NOW
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-blue-900 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white text-sm">
            Copyright © 2025 &nbsp;&nbsp;&nbsp;&nbsp; || All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
