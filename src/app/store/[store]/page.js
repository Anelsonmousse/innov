import { BE, Product, Tag } from "@/assets";
import Header from "@/components/header";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { IoHeart, IoHeartCircle, IoSearch } from "react-icons/io5";

const page = () => {
  return (
    <main className="pt-8">
      <div className="px-4">
        <Header title="Store" />
      </div>
      <div className="bg-[#D9D9D9] mx-4 flex items-center gap-1 my-4 p-2 relative rounded-xl">
        <IoSearch size={20} className="shrink-0" fill="#979797" />
        <input className="bg-transparent shrink min-w-0 max-w-full outline-none flex-1" />
      </div>
      <Image
        src={BE}
        className="w-full aspect-video object-cover rounded-lg"
        alt="view"
      />
      <div className="px-4 pt-4">
        <h1 className="font-black text-2xl">Steralizer</h1>
        <p>Bursting your head with delicious meal</p>
      </div>
      <section className="flex mt-2 flex-wrap">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="w-1/2">
            <div className="p-4 relative">
              <div className="relative">
                <Image
                  src={Product}
                  className="w-full rounded-lg"
                  alt="product image"
                />
              </div>

              <h1 className="font-bold pt-2 text-xs truncate">
                Embroidered Polo Shirt Men's High-End
              </h1>
              <div className="relative">
                <p className="flex items-center text-xs gap-1">
                  4.3
                  <span className="inline-block">
                    <FaStar size={10} className="fill-[#FFF500]" />
                  </span>
                  <span className="text-xs bg-[#D9D9D9] px-1 rounded-sm py-[0.1rem]">
                    Seller
                  </span>
                </p>
              </div>
              <p className="font-semibold font-sans text-xl">₦8,500</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default page;