import { motion } from "framer-motion";

const AccordionItem = ({ title, onToggle, children, active }) => {
  return (
    <div
      onClick={onToggle}
      className="border-b cursor-pointer border-gray-light py-4"
    >
      <div className="flex items-center justify-between">
        <p className="font-bold">{title}</p>
        <svg
          className={`${
            active ? "rotate-45" : "rotate-0"
          } transition-transform`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 12H18"
            className="stroke-black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 18V6"
            className="stroke-black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <motion.div
        initial={{
          height: 0,
        }}
        animate={{
          height: active ? "auto" : 0,
        }}
        className={`opacity-95 overflow-hidden`}
      >
        {typeof children === "string" ? (
          <p className="text-sm mt-8">{children}</p>
        ) : (
          children
        )}
      </motion.div>
    </div>
  );
};

export default AccordionItem;
