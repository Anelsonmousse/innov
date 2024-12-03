import Header from "@/components/header";
import { IoCheckmark, IoCheckmarkCircle } from "react-icons/io5";

const page = () => {
  return (
    <main className="px-4 pt-8  flex flex-col items-center">
      <section className="max-w-[960px]">
        <Header title="Notifications" />
        <section className="mt-8">
          {["Today", "Yesterday", "24th April, 2024"].map((date, index) => (
            <div className="my-4" key={index}>
              <p className="font-bold text-lg">{date}</p>
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-center shadow-xl rounded-xl px-3 py-2"
                >
                  <IoCheckmarkCircle size={72} className="fill-main" />
                  <div>
                    <h2 className="font-bold">A new seller is available</h2>
                    <p className="text-xs">
                      A new product was posted and we felt you might be
                      interested
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </section>
      </section>
    </main>
  );
};

export default page;
