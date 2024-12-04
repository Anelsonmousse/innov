"use client";
import { Product } from "@/assets";
import Filter from "@/components/filter";
import Header from "@/components/header";
import Image from "next/image";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { IoFilter, IoSearch } from "react-icons/io5";
import { MdFilter } from "react-icons/md";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  return (
    <main className="pt-8 h-screen bg-[#004AAD] px-2">
      <Header title="Food" />
      <div className="text-center text-[36px] font-bold text-white w-full h-full justify-center items-center my-36">Coming Soon!!!</div>
    </main>
  );
};

export default page;
