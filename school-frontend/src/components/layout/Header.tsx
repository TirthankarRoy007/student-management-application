import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] dark:border-b-gray-800 px-6 md:px-10 py-3 bg-white dark:bg-background-dark z-10">
      <div className="flex items-center gap-4 text-[#111418] dark:text-white">
        <div className="size-6 text-primary">
          <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
          </svg>
        </div>
        <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">EduTrack Pro</h2>
      </div>
      <div className="hidden md:flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <Link className="text-[#111418] dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors" to="/about">About School</Link>
        </div>
        <Link to="/register" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-all">
          <span className="truncate">Register</span>
        </Link>
      </div>
    </header>
  );
}
