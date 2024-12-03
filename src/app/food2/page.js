"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AD } from "@/assets";
import Button from "@/components/button";
import Accordion from "@/components/accordion";
import { IoArrowBack, IoArrowDown } from "react-icons/io5";
import { IoStarSharp } from "react-icons/io5";
import { FiArrowDownRight, FiHeart } from "react-icons/fi";
import { Reviews as reviews } from "../../../dev/helpers";
import { FaArrowRight, FaLongArrowAltRight, FaStar } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { MdArrowLeft } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io";

const page = () => {
  const router = useRouter();

  return (
    <main className="grid min-h-screen grid-cols-12 items-start lg:pt-8">
      <section className="col-span-12 lg:col-start-1 lg:col-end-8 lg:p-4 flex flex-col lg:flex-row gap-2">
        <div className="px-2 order-2 lg:order-1">
          <div className="flex lg:flex-col overflow-x-scroll lg:overflow-hidden gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square shrink-0 w-12 h-12 lg:w-16 lg:h-16 relative rounded-xl overflow-hidden"
              >
                <Image
                  className="object-cover w-full h-full"
                  alt="Food Image"
                  fill
                  src={AD}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:max-w-[90%] lg:w-full px-4 lg:pr-8 relative lg:rounded-md aspect-square lg:aspect-square overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            alt="Food Image"
            fill
            src={AD}
          />
          <div className="absolute top-0 p-2 left-0 z-20 flex w-full lg:justify-end justify-between">
            <div className="p-2 cursor-pointer flex items-center justify-center rounded-full lg:hidden">
              <IoArrowBack size={18} className="stroke-white" />
            </div>
            <div className="p-2 cursor-pointer justify-center items-center rounded-full">
              <FiHeart size={18} className="stroke-white" />
            </div>
          </div>
        </div>
      </section>
      <section className="col-span-12 lg:sticky lg:top-0 lg:overflow-y-scroll max-h-screen lg:col-start-8 px-2 pt-3 lg:p-6 lg:pt-8 lg:col-end-12">
        <h1 className="font-bold mb-2 md:text-3xl">
          Bolonese SPag and Meat Balls
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
          <p className="absolute font-sans right-0 text-main font-semibold text-3xl top-0">
            ₦8,500
          </p>
        </div>

        <div className="mt-3">
          <h2 className="font-bold text-sm">Description</h2>
          <p className="text-sm">
            spicy spag with garnished meat balls flavoured nicely.
          </p>
        </div>
        <div className="mt-3">
          <h2 className="font-bold text-sm mb-3">
            Reviews on seller <span className="opacity-60">(422)</span>
          </h2>
          {reviews.slice(0, 3).map(({ name, review, image }, index) => (
            <div
              key={index}
              className="my-4 border-b border-black py-2 border-opacity-10 flex gap-2"
            >
              <div className="w-8 h-8 shrink-0 relative">
                <Image
                  className="rounded-full"
                  fill
                  src={image}
                  alt="fan image"
                />
              </div>
              <div>
                <p className="font-bold text-sm">{name}</p>
                <p className="text-xs">{review}</p>
              </div>
            </div>
          ))}
          <p className="font-bold text-end">View More</p>
        </div>
        <div className="flex flex-col">
          <p className="font-bold text-lg">Rate Food</p>
          <div className="flex gap-1 my-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <FaStar size={20} className="fill-[#D9D9D9]" />
            ))}
          </div>
          <textarea className="border-black resize-none h-[97px] w-full border-opacity-60 border-[0.5px] rounded-xl"></textarea>
          <Button
            className="font-black text-main flex self-end items-center gap-2"
            variant="plain"
          >
            Submit
            <svg
              width="31"
              height="15"
              viewBox="0 0 31 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M30.7071 8.20711C31.0976 7.81658 31.0976 7.18342 30.7071 6.79289L24.3431 0.428932C23.9526 0.0384078 23.3195 0.0384078 22.9289 0.428932C22.5384 0.819457 22.5384 1.45262 22.9289 1.84315L28.5858 7.5L22.9289 13.1569C22.5384 13.5474 22.5384 14.1805 22.9289 14.5711C23.3195 14.9616 23.9526 14.9616 24.3431 14.5711L30.7071 8.20711ZM0 8.5H30V6.5H0V8.5Z"
                fill="#004AAD"
              />
            </svg>
          </Button>
        </div>
        <div className="w-full font-bold flex gap-1 mt-8 py-2">
          <Button className="px-4 shrink-0 text-xs">Call Sender</Button>
          <Button
            variant="outline"
            className="border-main px-4 py-2 flex items-center text-main text-xs shrink-0"
          >
            <IoLogoWhatsapp
              size={22}
              className="fill-main mr-[0.1rem] inline-block align-middle"
            />
            Message on Whatsapp
          </Button>
        </div>
      </section>
    </main>
  );
};

export default page;
