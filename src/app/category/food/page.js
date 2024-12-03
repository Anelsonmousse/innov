"use client";

import React from "react";
import { Activ8, BB, BC } from "@/assets";
import { useState } from "react";
import Image from "next/image";
import { MdStore, MdHomeFilled } from "react-icons/md";
import { IoPersonCircleSharp } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
import { IoStarSharp } from "react-icons/io5";
import { foodStore } from "./../../../../dev/services";
import { useRouter } from "next/navigation";

const page = () => {
  const [slider, setSlider] = useState(true);
  const router = useRouter();

  const FoodStore = () => {
    const StoreF = ({ items }) => {
      return (
        <div className=" w-full">
          <div className="w-full flex-1">
            {items.map((item, index) => (
              <div
                onClick={() => {
                  router.push("/food");
                }}
                key={index}
                className="w-[90%] flex ml-[5%] my-2"
              >
                <div className=" flex px-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-[150px] h-[100px] rounded-md"
                  />
                </div>
                <div className="flex-1 w-full mt-2 text-left px-3">
                  <div className="mt-1 text-[14px] text-wrap font-semibold">
                    {item.name}
                  </div>
                  <div className="text-[10px] font-medium">{item.seller}</div>
                  <div className="text-[10px] flex font-medium">
                    {item.rating}{" "}
                    <IoStarSharp color="#004AAD" className="" size={12} />{" "}
                  </div>
                  <div className="text-[18px] text-[#004AAD] ">
                    {" "}
                    {item.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };
    return (
      <div>
        <div className="w-[90%] ml-[5%] flex mt-2 pb-2">
          <div
            onClick={() => {}}
            className="text-sm text-white bg-[#004AAD] h-6 text-wrap px-2 pb-[2px]  rounded-md"
          >
            Food
          </div>
          <div
            onClick={() => setSlider(!slider)}
            className="text-sm text-[#004AAD] border-2 ml-3 border-[#004AAD] rounded-md h-6 text-wrap px-2 pb-[2px]"
          >
            Store
          </div>
        </div>
        <StoreF items={foodStore} />
      </div>
    );
  };

  const ShopStore = () => {
    const StoreS = ({ items }) => {
      return (
        <div className=" w-full">
          <div className="grid grid-cols-2 w-full gap-2">
            {items.map((item, index) => (
              <div
                onClick={() => {
                  router.back();
                }}
                key={index}
                className="flex flex-col items-center rounded-md"
              >
                <div className=" flex px-1">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-[150px] h-[100px] rounded-md"
                  />
                </div>
                <div className="flex-1 w-full mt-2 px-3">
                  <div className="mt-1 text-[14px] text-center font-semibold">
                    {item.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };
    return (
      <div>
        <div className="w-[90%] ml-[5%] flex mt-2 pb-2">
          <div
            onClick={() => setSlider(!slider)}
            className="text-sm text-[#004AAD] border-2 border-[#004AAD] rounded-md h-6 text-wrap px-2 pb-[2px]"
          >
            Food
          </div>
          <div
            onClick={() => {}}
            className="text-sm text-white ml-3 bg-[#004AAD] h-6 text-wrap px-2 pb-[2px] border-2 rounded-md"
          >
            Store
          </div>
        </div>
        <StoreS items={foodStore} />
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="w-full pb-3 pt-3 flex-1">
        <div className="z-30 justify-between flex relative">
          <IoArrowBack
            onClick={() => {
              router.back();
            }}
            color="black"
            className="mb-1 ml-3"
            size={30}
          />
          <div className="flex pt-1 font-semibold text-lg w-full pl-3">
            Food
          </div>
        </div>
        <input
          type="text"
          value=""
          className="bg-[#D9D9D9] h-8 text-sm pl-2 w-[90%] ml-[5%] rounded-lg"
          placeholder="Search"
        />
      </div>
      <div>
        {slider ? (
          <div>
            <FoodStore />
          </div>
        ) : (
          <div>
            <ShopStore />
          </div>
        )}
      </div>
    </div>
  );
};

export default page;