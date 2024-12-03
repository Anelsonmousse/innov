// ItemList.js
import React from 'react';
import Image from 'next/image';

const ProductList = ({ items }) => {
  return (
    <div className="p-4 w-full">
      <div className="grid grid-cols-2 grid-rows-2 w-full gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center p-4 border border-gray-300 rounded">
            <Image src={item.image} alt={item.name} width={150} height={150} className="object-cover" />
            {/* <h2 className="mt-2 text-lg font-semibold">{item.name}</h2> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
