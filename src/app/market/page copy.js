"use client";
import React, { useState, useEffect } from "react";
import { Activ8, BB, BC } from "@/assets";
import Image from "next/image";
import { MdStore, MdHomeFilled } from "react-icons/md";
import { IoPersonCircleSharp } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
import { IoStarSharp } from "react-icons/io5";
import { foodStore } from "./../../../dev/services";
import { useRouter } from "next/navigation";

const page = () => {
  const [active, setActive] = useState(false);
  const [store, setStore] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");
        console.log(token);

        const form = new FormData();
        form.append("requestID", "rid_1983");

        // Perform the POST request with the Bearer token
        const response = await axios.post(
          "https://api.vplaza.com.ng/users/getuser",
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Handle the response data
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        // Handle any errors
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this useEffect runs once after the initial render

  const LogOut = () => {
    localstorage.removeItem("token");
    router.push("/signin");
  };

  const Store = () => {
    const MyStore = () => {
      return (
        <div>
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
                Stores
              </div>
            </div>
            <input
              type="text"
              className="bg-[#D9D9D9] h-8 text-sm pl-2 w-[90%] ml-[5%] rounded-lg"
              placeholder="Search"
            />
            <div className="w-full mt-2 h-full">
              <Image src={BC} className="w-full h-[225px]" />
            </div>
          </div>
        </div>
      );
    };

    const YourStore = () => {
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
                      <div className="text-[10px] font-medium">
                        {item.seller}
                      </div>
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
                Stores
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

    return <div>{store ? <MyStore /> : <YourStore />}</div>;
  };

  const Activate = () => {
    return (
      <div>
        <div className="flex flex-col h-screen items-center">
          <Image src={Activ8} className="px-3 mt-48 object-cover mb-2 " />
          <div className=" text-xs text-center font-medium w-full px-4">
            Activate your store for just #500 and enjoy a month-long selling
            spree! With Metor, post unlimited goods for sale until the same date
            next month. Don't miss out on this opportunity to showcase your
            items to your university community!
          </div>
          <div
            onClick={() => setActive(true)}
            className="text-[#004AAD] mt-12 text-xl font-bold text-center"
          >
            Activate
          </div>
        </div>

        {/* Nav FOoter */}
        <div className="w-full  h-[100px] sticky bottom-0 bg-white ">
          <div className="bg-[#004AAD] justify-between flex rounded-2xl w-[90%] ml-[5%] h-[70%]">
            <div className=" flex justify-between ml-[5%] mt-3 w-[90%]">
              <div className="h-[50px] w-[50px] rounded-full bg-white text-center items-center justify-center">
              <MdStore
              onClick={() => {
             //   alert("Clicked");
                if (!token) {
                  router.push("/signin");
                 // alert("1");
                } else {
                  // Retrieve and parse the userData from localStorage
                  const userData = JSON.parse(localStorage.getItem("userData"));

                  // Check if userData exists and then access the shop_status and shop_plan
                  if (userData) {
                    const shopStatus = userData.shop_status;
                    const shopPlan = userData.shop_plan;

                    //alert(`shop_status: ${shopStatus}, shop_plan: ${shopPlan}`);

                    if (shopStatus === 1) {
                      //alert("Redirecting to market page");
                      router.push("/market");
                    } else if (shopStatus === 0) {
                     // alert("Redirecting to store page");
                      router.push("/store/product");
                    } else {
                      // Handle other cases or provide a default route
                      //alert("Unhandled shop status");
                      router.push("/");
                    }
                  } else {
                  //  alert("User data not found");
                  }
                }
              }}
              color="#686868"
              size={40}
            />
              </div>
              <MdHomeFilled color="#686868" className="" size={40} />
              <IoPersonCircleSharp
                onClick={() => router.push("/profile")}
                color="#686868"
                size={40}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <div>{active ? <Store /> : <Activate />}</div>;
};

export default page;
