"use client";

import profileApiRequest from "@/apiRequests/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ProfileResType } from "@/schemaValidations/profile.schema";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function hasAccessToken() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
}

export default function Header() {
  const [profile, setProfile] = useState<ProfileResType | null>(null);

  useEffect(() => {
    if (!hasAccessToken()) {
      console.log("🔐 [Header] No access token found, skipping profile fetch");
      return;
    }

    console.log("🚀 [Header] Starting profile fetch...");
    console.log(
      "🌐 [Header] API Endpoint:",
      process.env.NEXT_PUBLIC_API_ENDPOINT
    );

    (async () => {
      try {
        const res = await profileApiRequest.getProfile();
        console.log("✅ [Header] Profile fetched successfully:", res);
        setProfile(res.payload);
      } catch (err) {
        console.error("❌ [Header] Error fetching user profile:", {
          error: err,
          message: err instanceof Error ? err.message : "Unknown error",
          stack: err instanceof Error ? err.stack : undefined,
          accessToken: hasAccessToken() ? "Present" : "Missing",
          apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || "Not configured",
        });

        // Check if it's a network error
        if (err instanceof Error) {
          if (
            err.message.includes("Failed to fetch") ||
            err.message.includes("fetch")
          ) {
            console.error(
              "🌐 [Header] Network error detected. Possible causes:"
            );
            console.error(
              "  1. Backend API server is not running at:",
              process.env.NEXT_PUBLIC_API_ENDPOINT
            );
            console.error("  2. CORS configuration issues");
            console.error("  3. Network connectivity problems");
            console.error("  4. Firewall blocking the connection");
            console.error(
              "💡 [Header] Try starting the backend server or check network settings"
            );
          }
          if (
            err.message.includes("401") ||
            err.message.includes("Unauthorized")
          ) {
            console.error(
              "🔒 [Header] Authentication error - token might be expired"
            );
            console.error("💡 [Header] Try logging out and logging back in");
          }
        }
      } finally {
      }
    })();
  }, []);

  return (
    <header className="dark:border border dark:rounded-full rounded-full mx-4 dark:bg-white dark:shadow-2xl shadow-2xl min-w-full container">
      <div className="max-w-7xl mx-auto  px-2">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <svg
                width="135"
                height="36"
                viewBox="0 0 135 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M39.2771 13.0203C39.2767 13.0207 39.2764 13.0213 39.2764 13.0218C39.2777 13.4213 39.2413 13.682 39.1431 13.9087C38.8993 14.4684 38.2002 15.0062 36.9879 15.0062C36.9879 15.0062 35.3621 15.1171 34.9958 13.5331C34.9661 13.4038 34.954 13.2709 34.9553 13.138C34.9742 11.3393 35.1062 13.7843 35.1035 7.29072C35.1035 6.87001 34.558 6.64197 34.2051 6.91635C29.1081 10.893 21.6378 16.7256 20.7354 17.4487C20.6613 17.5085 20.5778 17.5609 20.4848 17.5987C20.2222 17.706 19.9676 17.728 19.7332 17.6987C19.6861 17.6926 19.6389 17.6914 19.5918 17.6951C19.3817 17.7109 19.1567 17.6829 18.925 17.5878C18.8321 17.5499 18.7486 17.4987 18.6745 17.439C17.768 16.7122 10.2115 10.832 5.10512 6.86025C4.75221 6.58587 4.20669 6.81391 4.20804 7.23584L4.32118 33.8735C4.32253 34.2735 4.28616 34.5345 4.18783 34.7613C3.94403 35.321 3.24495 35.8588 2.03268 35.8588C2.03268 35.8588 0.406886 35.9697 0.0405097 34.3857C0.0108763 34.2564 -0.00124645 34.1235 0.000100523 33.9906C0.025693 31.6761 0.0149172 5.16522 0.0135702 2.3239C0.0135702 2.10805 0.0499385 1.77271 0.130757 1.57028C0.291046 1.16298 0.650688 0.54472 1.40903 0.25571C1.735 0.131327 2.09329 0.147179 2.44755 0.139863C2.86241 0.131327 3.25034 0.377655 3.98714 0.92153L19.3561 12.9819C19.5595 13.1416 19.8612 13.1429 20.0659 12.9831L35.843 0.738612C35.9104 0.686176 36.5273 0.277661 36.6121 0.247174C37.2721 0.00206482 38.2177 0.355705 38.5464 0.713004C38.7673 0.950797 38.8063 0.982503 38.941 1.22639C39.0757 1.47028 39.2064 2.06294 39.2751 2.63364C39.2764 2.64949 39.2778 2.66534 39.2778 2.6812V13.0188C39.2778 13.0194 39.2775 13.0199 39.2771 13.0203Z"
                  fill="#0077ED"
                />
                <path
                  d="M9.72981 34.1578C9.73004 34.1576 9.73068 34.1572 9.73037 34.1572C9.71146 34.1585 7.88902 34.2832 7.57241 32.515C7.51987 32.2216 7.50728 31.8843 7.50033 31.5863C7.44165 29.0714 7.53704 17.1051 7.54311 16.4718C7.54311 16.452 7.54446 16.4335 7.54717 16.415C7.58369 16.1645 7.90429 14.4901 9.90637 14.6037C9.90637 14.6037 10.5827 14.6037 11.2591 15.2206L14.4449 17.7637C14.4882 17.7982 14.5247 17.8377 14.5531 17.8833C14.7168 18.1412 15.2227 19.0642 14.7952 19.9945C14.7817 20.0254 14.7641 20.0538 14.7438 20.0809C14.595 20.2808 13.9322 21.0236 12.5077 20.5757C12.1628 20.4671 11.8029 20.6991 11.8043 21.0322L11.8665 32.1348C11.8665 32.1472 11.8665 32.1595 11.8679 32.1706C11.8868 32.3631 11.9909 34.0962 9.73007 34.1584C9.72977 34.1584 9.72959 34.158 9.72981 34.1578Z"
                  fill="#0077ED"
                />
                <path
                  d="M38.8825 30.4825C38.8825 30.4826 38.8823 30.4827 38.8822 30.4826C38.8755 30.4718 38.8676 30.46 38.861 30.4493C38.2941 29.5791 37.0582 29.2769 36.0668 29.7495C35.7337 29.9078 35.7914 29.9259 35.4354 30.0456C34.4024 30.39 33.2793 30.5641 32.1052 30.529C27.5875 30.3949 23.8892 27.1172 23.6783 23.0551C23.4432 18.5446 27.4397 14.8209 32.4008 14.8209C32.5055 14.8209 32.6103 14.8209 32.7138 14.8257C34.1015 14.8704 35.4086 15.2052 36.5585 15.7672C37.5781 16.2651 38.7294 15.5956 39.1243 14.6142C39.1485 14.555 39.1579 14.5187 39.1579 14.5187C39.1619 14.5091 39.1646 14.4994 39.1686 14.4897C39.4709 13.5978 39.1418 12.8799 38.2189 12.4556C38.0832 12.3928 37.9462 12.3336 37.8078 12.2756C36.9884 11.9287 36.1219 11.6604 35.2191 11.4779C34.3124 11.293 33.3693 11.1963 32.4008 11.1963C30.0888 11.1963 27.9206 11.7498 26.0507 12.7155C22.2194 14.6976 19.6388 18.4165 19.6388 22.678C19.6388 27.7045 23.2296 31.9769 28.2296 33.5312C29.5367 33.9385 30.9405 34.1597 32.4008 34.1597C34.6227 34.1597 36.3086 33.7705 38.1275 32.8713C39.037 32.4217 39.4118 31.4101 38.9416 30.5774C38.909 30.5198 38.8858 30.4865 38.8828 30.4823C38.8827 30.4822 38.8825 30.4823 38.8825 30.4825Z"
                  fill="#0077ED"
                />
                <path
                  d="M34.6018 17.1497L34.9199 17.3159C34.8157 17.254 34.7097 17.1986 34.6018 17.1497ZM35.2963 27.8555C35.2894 27.861 35.2824 27.8689 35.2761 27.8751C35.2397 27.9112 35.0907 28.0298 34.8605 28.2061C35.0159 28.1185 35.1658 28.0167 35.3112 27.9046C35.3187 27.8987 35.3261 27.8927 35.3334 27.8865C35.3677 27.8576 35.3315 27.8277 35.2963 27.8555Z"
                  fill="#0077ED"
                />
                <path
                  d="M36.2602 25.8703C36.2602 25.8703 36.7293 26.5048 36.2012 27.0909C36.1507 27.1466 36.0917 27.2011 36.0229 27.2544C35.7948 27.4351 35.4924 27.5703 35.2297 27.6953C35.1564 27.7302 35.0741 27.769 34.9836 27.8114C34.2449 28.0656 33.4402 28.2061 32.5961 28.2061C31.863 28.2061 31.158 28.0995 30.5008 27.9034C30.2241 27.821 29.9559 27.723 29.6989 27.6091C27.6133 26.6974 26.1851 24.8314 26.1851 22.6785C26.1851 20.8319 27.2341 19.1972 28.8464 18.1934C29.0262 18.0808 29.2129 17.9767 29.4053 17.881C30.3449 17.416 31.4347 17.1497 32.5961 17.1497C33.0835 17.1497 33.5567 17.1957 34.0118 17.2853C34.207 17.3228 34.398 17.3688 34.5862 17.4221L35.0749 17.5783L35.4513 17.6994L35.5173 17.7212C35.5803 17.7393 35.6408 17.7671 35.7002 17.7949C35.7951 17.8394 35.9316 17.9113 36.0313 17.9973C36.3009 18.2298 36.6338 18.6766 36.3838 19.2989C36.3838 19.2989 36.2182 19.795 35.678 20.0119C35.6776 20.0121 35.6771 20.0122 35.6767 20.0122C35.6762 20.0122 35.6758 20.0122 35.6753 20.0124C35.4802 20.0922 35.2389 20.1344 34.9387 20.1042C34.8263 20.0933 34.7041 20.0715 34.5721 20.0364C34.3308 19.936 34.074 19.8609 33.8046 19.8125C33.8041 19.8124 33.8037 19.8124 33.8032 19.8124C33.8027 19.8124 33.8023 19.8123 33.8018 19.8122C33.6181 19.7796 33.4273 19.7591 33.2337 19.753C33.193 19.7518 33.1523 19.7506 33.1115 19.7506C31.1833 19.7506 29.63 21.1383 29.7213 22.8189C29.8042 24.3325 31.2409 25.5531 32.9978 25.6027C33.4542 25.616 33.891 25.5507 34.2926 25.4223C34.4303 25.3787 34.5651 25.3266 34.6943 25.2673C35.1447 25.0638 35.7092 25.2549 36.0531 25.6098C36.1244 25.6834 36.1938 25.7696 36.2602 25.8703Z"
                  fill="#0077ED"
                />
                <path
                  d="M46.6218 29.4277C45.4998 29.4277 44.5195 29.2351 43.6808 28.8497C42.8535 28.4531 42.1678 27.9374 41.6238 27.3027C41.0798 26.6567 40.6718 25.9597 40.3998 25.2117C40.1392 24.4637 40.0088 23.7441 40.0088 23.0527V22.6787C40.0088 21.9081 40.1448 21.1487 40.4168 20.4007C40.7002 19.6414 41.1195 18.9557 41.6748 18.3437C42.2302 17.7317 42.9215 17.2444 43.7488 16.8817C44.5762 16.5077 45.5338 16.3207 46.6218 16.3207C47.7098 16.3207 48.6675 16.5077 49.4948 16.8817C50.3222 17.2444 51.0135 17.7317 51.5688 18.3437C52.1242 18.9557 52.5435 19.6414 52.8268 20.4007C53.1102 21.1487 53.2518 21.9081 53.2518 22.6787V23.0527C53.2518 23.7441 53.1158 24.4637 52.8438 25.2117C52.5718 25.9597 52.1638 26.6567 51.6198 27.3027C51.0758 27.9374 50.3845 28.4531 49.5458 28.8497C48.7185 29.2351 47.7438 29.4277 46.6218 29.4277ZM46.6218 26.8267C47.2112 26.8267 47.7382 26.7247 48.2028 26.5207C48.6788 26.3167 49.0812 26.0334 49.4098 25.6707C49.7498 25.3081 50.0048 24.8887 50.1748 24.4127C50.3448 23.9367 50.4298 23.4267 50.4298 22.8827C50.4298 22.3047 50.3392 21.7777 50.1578 21.3017C49.9878 20.8144 49.7328 20.3951 49.3928 20.0437C49.0642 19.6811 48.6675 19.4034 48.2028 19.2107C47.7382 19.0181 47.2112 18.9217 46.6218 18.9217C46.0325 18.9217 45.5055 19.0181 45.0408 19.2107C44.5762 19.4034 44.1738 19.6811 43.8338 20.0437C43.5052 20.3951 43.2558 20.8144 43.0858 21.3017C42.9158 21.7777 42.8308 22.3047 42.8308 22.8827C42.8308 23.4267 42.9158 23.9367 43.0858 24.4127C43.2558 24.8887 43.5052 25.3081 43.8338 25.6707C44.1738 26.0334 44.5762 26.3167 45.0408 26.5207C45.5055 26.7247 46.0325 26.8267 46.6218 26.8267ZM55.3642 29.1047V16.6947H59.9372L64.6122 26.8437H65.1902L64.8502 27.1497V16.6947H67.4682V29.1047H62.8612L58.1862 18.9557H57.6082L57.9482 18.6497V29.1047H55.3642ZM70.2558 29.1047V16.6947H74.8288L79.5038 26.8437H80.0818L79.7418 27.1497V16.6947H82.3598V29.1047H77.7528L73.0778 18.9557H72.4998L72.8398 18.6497V29.1047H70.2558ZM85.1474 29.1047V16.6947H87.8674V29.1047H85.1474ZM87.5274 29.1047V26.7927H92.9504V29.1047H87.5274ZM87.5274 23.9537V21.6417H92.5594V23.9537H87.5274ZM87.5274 19.0067V16.6947H92.8314V19.0067H87.5274ZM100.803 29.4277C99.6814 29.4277 98.718 29.2351 97.9134 28.8497C97.1087 28.4531 96.4514 27.9374 95.9414 27.3027C95.4314 26.6567 95.0517 25.9654 94.8024 25.2287C94.5644 24.4807 94.4454 23.7554 94.4454 23.0527V22.6787C94.4454 21.9081 94.57 21.1487 94.8194 20.4007C95.0687 19.6414 95.4484 18.9557 95.9584 18.3437C96.4797 17.7317 97.1314 17.2444 97.9134 16.8817C98.7067 16.5077 99.6417 16.3207 100.718 16.3207C101.84 16.3207 102.832 16.5304 103.693 16.9497C104.555 17.3691 105.24 17.9527 105.75 18.7007C106.272 19.4374 106.578 20.3044 106.668 21.3017H103.863C103.784 20.8031 103.603 20.3781 103.319 20.0267C103.036 19.6754 102.668 19.4034 102.214 19.2107C101.772 19.0181 101.274 18.9217 100.718 18.9217C100.163 18.9217 99.67 19.0181 99.2394 19.2107C98.8087 19.4034 98.446 19.6754 98.1514 20.0267C97.868 20.3781 97.647 20.7974 97.4884 21.2847C97.341 21.7607 97.2674 22.2934 97.2674 22.8827C97.2674 23.4607 97.341 23.9934 97.4884 24.4807C97.647 24.9567 97.8737 25.3761 98.1684 25.7387C98.4744 26.0901 98.8484 26.3621 99.2904 26.5547C99.7324 26.7361 100.237 26.8267 100.803 26.8267C101.665 26.8267 102.39 26.6171 102.979 26.1977C103.58 25.7784 103.943 25.2004 104.067 24.4637H106.855C106.753 25.3704 106.447 26.2034 105.937 26.9627C105.439 27.7107 104.753 28.3114 103.88 28.7647C103.019 29.2067 101.993 29.4277 100.803 29.4277ZM111.054 29.1047V18.7857H113.842V29.1047H111.054ZM107.569 19.1257V16.6947H117.344V19.1257H107.569Z"
                  fill="#0077ED"
                />
              </svg>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Home
            </Link>
            <Link
              href="/course"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Course
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Blog
            </Link>
            <Link
              href="/forum"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Forum
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              About
            </Link>
          </nav>

          <div className="hidden md:flex items-center relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-64 dark:text-gray-700 pl-10 pr-4 py-2 dark:border dark:border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-100 bg-gray-100"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-gray-400 h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* <Link href="/register">
              <Button
                variant="outline"
                className="dark:border-blue-600 border-blue-600 cursor-pointer dark:text-blue-600 dark:hover:text-blue-600 dark:hover:bg-blue-50 rounded-full px-8"
              >
                Sign Up
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="dark:bg-blue-600 bg-blue-600  text-white cursor-pointer hover:bg-blue-700 hover:text-white dark:text-white rounded-full px-8"
              >
                Login
              </Button>
            </Link> */}
            {profile ? (
              <div className="flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-label="Open user menu"
                      className="focus:outline-none"
                    >
                      <Avatar className="h-10 w-10 ring-1 ring-gray-200 hover:cursor-pointer">
                        <AvatarImage
                          src={profile?.result?.avatar || undefined}
                          alt={profile?.result?.name}
                        />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {profile?.result?.name || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.result?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {profile?.result?.email}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/manage/mentee/dashboard">Learning Hub</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link href="/register">
                  <Button
                    variant="outline"
                    className="border-blue-600 cursor-pointer text-blue-600 hover:text-blue-600 hover:bg-blue-50 rounded-full px-8"
                  >
                    Sign Up
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-full px-8">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
