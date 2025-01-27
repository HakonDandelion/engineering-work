
import { useState } from "react"

export default function Nav(){
    
    const menuItems =[
        {text: "Stwórz arkusz", href: "/create-sheet"},
        {text: "Wybierz arkusz", href: "/select-sheet"}, 
        {text: "Przeglądaj raporty", href: "/browse-reports"}
      ]
    

    return(
        <div className=" bg-black/20 backdrop-blur-sm">
        <nav className="grid grid-cols-2 sm:flex justify-between items-center 
        text-white max-w-screen-xl mx-auto"
        >
          <a
            href="/start"
            className="hover:bg-fuchsia-600/20 min-h-[3rem] px-4 inline-flex items-center justify-self-start"
          >
            Start
          </a>

          <input
            type="checkbox"
            className="peer sm:hidden appearance-none justify-self-end min-h-[3rem] px-3 inline-flex items-center text-3xl after:content-['≡'] checked:after:content-['×']"
            aria-controls="navigation-menu"
            aria-label="Toggle navigation menu"
          />

          <ul
            className="hidden sm:flex flex-col sm:gap-8 sm:flex-row peer-checked:flex 
            col-start-1 col-end-3 bg-black/20 backdrop-blur-sm"
            id="navigation-menu"
          >
            {menuItems.map((item, index) => 
            <li key={index}>
              <a href={item.href} className="hover:bg-fuchsia-600/20 min-h-[3rem] px-4 inline-flex items-center">
              {item.text}
              </a>
              </li>)}
          </ul>
        </nav>
      </div>
    )
}


