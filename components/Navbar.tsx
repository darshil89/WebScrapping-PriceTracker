import Image from "next/image";
import Link from "next/link";
import React from "react";

const navIcons = [
  { src: "/assets/icons/search.svg", alt: "Search Icon", link: "/search" },
  {
    src: "/assets/icons/black-heart.svg",
    alt: "Heart Icon",
    link: "/wishlist",
  },
  { src: "/assets/icons/user.svg", alt: "user", link: "/cart" },
];

const Navbar = () => {
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/icons/logo.svg"
            alt="D_Price Logo"
            width={27}
            height={27}
          ></Image>
          <p className="nav-logo">
            Price<span className="text-primary">Wise</span>
          </p>
        </Link>
        <div className="flex items-center gap-5">
          {navIcons.map((icon, index) => (
            <Link href={icon.link} key={index}>
              <Image
                src={icon.src}
                alt={icon.alt}
                width={27}
                height={27}
                className="object-contain cursor-pointer"
              ></Image>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
