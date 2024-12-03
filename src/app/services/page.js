import Button from "@/components/button";
import Header from "@/components/header";
import { IoLogoWhatsapp } from "react-icons/io";
import { IoArrowBack, IoSearch } from "react-icons/io5";

const page = () => {
  return (
    <main className="p-4">
      <Header title="Services" />
      <section className="flex flex-wrap flex-col lg:flex-row">
        <div className="bg-[#D9D9D9] flex items-center gap-1 my-4 p-2 relative rounded-xl">
          <IoSearch size={20} className="shrink-0" fill="#979797" />
          <input className="bg-transparent shrink min-w-0 max-w-full outline-none flex-1" />
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="lg:w-4/12 shrink ">
            <div className="p-2 m-1 my-2 bg-[#EFEFEF] shadow-xl rounded-xl">
              <div className="flex justify-between items-center">
                <p className="font-bold text-xl">Ikechukwu David</p>
                <p className="text-sm">Electrician</p>
              </div>
              <div className="w-full flex-wrap font-bold flex gap-1 mt-3 py-1">
                <Button className="px-2 shrink-0 flex-1 text-xs">
                  Call Sender
                </Button>
                <Button
                  variant="outline"
                  className="border-main p-2 flex-1 font-bold text-nowrap flex items-center text-main text-xs shrink-0"
                >
                  <IoLogoWhatsapp size={22} className="fill-main mr-[0.1rem]" />
                  Message on Whatsapp
                </Button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default page;
