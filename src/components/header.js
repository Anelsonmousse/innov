"use client";
import { IoArrowBack, IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";

const Header = ({ title }) => {
  const router = useRouter();

  return (
    <header className="w-full pt-4">
      <div className="relative text-center">
        <IoArrowBack
        onClick={() => router.back()} 
          size={30}
          className="absolute top-1/2 -translate-y-1/2 left-0 p-1"
        />
        <h1 className="font-black text-2xl">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
