import { useState } from "react";
import AccordionItem from "./accordionItem";

const Accordion = ({ items }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  return (
    <section className="w-full border-t border-gray-light">
      {items.map(({ index, title, description }) => (
        <AccordionItem
          key={index}
          index={index}
          title={title}
          onToggle={() =>
            setSelectedIndex((prev) => (prev === index ? null : index))
          }
          active={selectedIndex === index}
        >
          {typeof description === "function" ? description() : description}
        </AccordionItem>
      ))}
    </section>
  );
};

export default Accordion;
