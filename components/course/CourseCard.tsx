"use client";

import Link from "next/link";
import Image from "next/image";

type Course = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
};

export default function CourseCard({
  id,
  title,
  description,
  price,
  image,
}: Course) {
  const getImageUrl = (imgSource: string) => {
    if (!imgSource)
      return "https://images.unsplash.com/photo-1501504905953-f84476b0dfbb?q=80&w=1000&auto=format&fit=crop";
    if (imgSource.startsWith("http")) return imgSource;

    const cleanPath = imgSource.startsWith("/")
      ? imgSource.substring(1)
      : imgSource;
    return `https://eduvibe-onlineeducationplaform-backend-production.up.railway.app/storage/${cleanPath}`;
  };

  return (
    <Link
      href={`/courses/${id}`}
      className="group block rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-2xl hover:border-yellow-200 dark:hover:border-yellow-500/50 transition-all duration-500 ease-out hover:-translate-y-2 relative"
    >
      <div className="relative aspect-[4/3] w-full bg-gray-50 dark:bg-gray-800 overflow-hidden">
        <Image
          src={getImageUrl(image)}
          alt={title}
          fill
          unoptimized 
          className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
          sizes="(max-width: 768px) 100vw, 25vw"
          onError={(e: any) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1501504905953-f84476b0dfbb?q=80&w=1000&auto=format&fit=crop";
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {description}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-5 transition-colors duration-300">
          <span className="text-2xl font-black text-yellow-600 dark:text-yellow-500 drop-shadow-sm">
            ${price}
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5 group-hover:translate-x-2 transition-transform duration-300 bg-yellow-50 dark:bg-gray-800 px-3 py-1.5 rounded-full group-hover:bg-yellow-100 dark:group-hover:bg-gray-700">
            View Details <span className="text-yellow-600 dark:text-yellow-500">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
