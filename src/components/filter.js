import { IoCloseCircleOutline } from "react-icons/io5";
import Button from "./button";

const Filter = ({ type, onClick }) => {
  return (
    <div className="fixed bg-black bg-opacity-75 w-full h-full top-0 left-0 flex items-end">
      <div className="bg-white p-2 rounded-t-lg min-h-16 w-full">
        <div className="p-4 flex justify-center relative">
          <h1 className="font-bold text-2xl">Filters</h1>
          <IoCloseCircleOutline
            onClick={() => typeof onClick === "function" && onClick()}
            size={32}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          />
        </div>
        {type === "food" && (
          <div className="border-b-2 p-2 border-b-black border-opacity-15">
            <p className="font-sans font-bold">State</p>
            <div className="flex my-3">
              <div className="flex w-1/2 items-center gap-4">
                <input
                  className="accent-main"
                  type="radio"
                  id="new"
                  name="state"
                  value="new"
                />
                <label className="text-xs" htmlFor="new">
                  New
                </label>
              </div>

              <div className="flex w-1/2 items-center gap-4">
                <input
                  className="accent-main bg-[#D9D9D9]"
                  //   checked
                  type="radio"
                  id="used"
                  name="state"
                  value="used"
                />
                <label className="text-xs" htmlFor="used">
                  Used
                </label>
              </div>
            </div>
          </div>
        )}
        <div className="my-4 px-2">
          <p className="font-bold font-sans">Price (₦)</p>
          <div className="flex my-2">
            <div className="w-1/2 p-2">
              <label htmlFor="from" className="text-xs mb-1">
                FROM
              </label>
              <input
                id="from"
                className="min-h-0 w-full border-black border-opacity-15 rounded-md border"
              />
            </div>

            <div className="w-1/2 p-2">
              <label htmlFor="to" className="text-xs mb-1">
                To
              </label>
              <input
                id="to"
                className="min-h-0 w-full border-black border-opacity-15 rounded-md border"
              />
            </div>
          </div>
        </div>
        <Button className="w-full bg-main font-bold mt-8">Apply</Button>
      </div>
    </div>
  );
};

export default Filter;
