"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { HomeIcon, RefreshCcw, Bug } from "lucide-react";

export default function NotFound() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const bounceTransition = {
    y: {
      duration: 0.4,
      yoyo: Infinity,
      ease: "easeOut",
    },
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-8 sm:space-x-8 flex flex-col sm:flex-row items-center justify-center">
        {/* Fun animated elements */}
        <div className="relative flex justify-center items-center space-x-4">
          <motion.div
            animate={{ y: ["0%", "-15%"] }}
            transition={bounceTransition}
            className="relative"
          >
            <motion.div
              animate={{ rotate: rotation }}
              className="text-9xl font-bold"
            >
              4
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-4 -right-4"
            >
              <Bug className="h-8 w-8 text-primary" />
            </motion.div>
          </motion.div>

          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <div className="text-9xl font-bold">0</div>
          </motion.div>

          <motion.div
            animate={{ y: ["0%", "-15%"] }}
            transition={bounceTransition}
            className="relative"
          >
            <div className="text-9xl font-bold">4</div>
          </motion.div>
        </div>
        <div className="">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Oops! Page Not Found
            </h1>

            <p className="text-xl text-muted-foreground">
              Looks like this page took a coffee break ☕️
              <br />
              Maybe it's practicing social distancing?
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-sm mx-auto bg-muted/50 rounded-lg p-4 mt-6"
            >
              <p className="text-sm text-muted-foreground">
                Error Code: 404
                <br />
                Status: Page is currently exploring the digital wilderness
                <br />
                Last Seen: Somewhere in the cloud ☁️
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild size="lg">
              <Link href="/">
                <HomeIcon className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>

            <Button
              className="cursor-pointer"
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
