import React from "react";

const Footer = () => {
  return (
    <footer className="footer border z-10 border-t-[#33353F] border-l-transparent border-r-transparent  border-b-transparent text-white text-center">
      <div className="container md:py-6 py-4 flex justify-center">
      <p className="text-slate-600 text-sm flex items-center gap-1">
  <span>This project is</span>
  <a
    href="https://github.com/gosiast/ai-english-coach"
    target="_blank"
    className="text-pink-400 hover:underline"
  >
    open sourced
  </a>
  <span>by</span>
  <a
    href="https://github.com/gosiast"
    target="_blank"
    className="hover:text-pink-400 hover:underline"
  >
    Małgorzata Stano
  </a>
</p>

      </div>
    </footer>
  );
};

export default Footer;