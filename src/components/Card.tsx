import Image from "next/image";
import { ComponentType, SVGProps } from "react";

interface CardProps {
  cover: string;
  title: string;
  date: string;
  Shape: ComponentType<SVGProps<SVGSVGElement>>;
  shapeColor?: string;
}

export default function Card({ cover, title, date, Shape, shapeColor }: CardProps) {
  const isColor = cover.startsWith("bg-");

  return (
    <div className="bg-white border-[6px] border-brand-black">
      <div className="m-4 mb-0">
        {isColor ? (
          <div className={`aspect-[4/3] ${cover}`} />
        ) : (
          <div className="relative aspect-[4/3]">
            <Image src={cover} alt={title} fill className="object-cover" />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between px-4 py-4">
        <div>
          <h3 className="font-display text-[36px] font-medium leading-tight">{title}</h3>
          <p className="text-[24px] text-zinc-400">{date}</p>
        </div>
        <Shape fill={shapeColor} className="w-[96px] h-[96px] shrink-0" />
      </div>
    </div>
  );
}
