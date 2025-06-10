"use client";
import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Navbar = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("username");
    if (name) setUsername(name);
  }, []);

  return (
    <header className="w-full py-4 px-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold">dApp Platform</h1>
        <nav>{username ? `Hello, ${username}` : ''}</nav>
      </div>
      <ConnectButton showBalance={false} />
    </header>
  );
};