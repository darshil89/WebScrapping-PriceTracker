"use client";

import { FormEvent, useState } from "react";

const isValidAmazonProduct = (url: string) => {
  try {
    const parseUrl = new URL(url);
    const hostname = parseUrl.hostname;
    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.endsWith("amazon")
    ) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const Searchbar = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidLink = isValidAmazonProduct(search);
    alert(isValidLink ? "Valid Link" : "Invalid Link");

    try {
      setLoading(true);
      //Scrap the product details
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter product link"
        className="searchbar-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit" className="searchbar-btn" disabled={search === ""}>
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;

// notes
// const parseUrl = new URL(url);: This line of code creates a new URL object by calling the URL constructor and passing a URL string (url) as an argument. The URL constructor is a built-in JavaScript object that allows you to work with URLs easily. It parses the provided URL string and creates a URL object with various properties representing different parts of the URL.

// const hostname = parseUrl.hostname;: After creating the URL object (parseUrl), this line of code extracts the hostname property from the URL object. The hostname property contains the host (domain) part of the URL.
