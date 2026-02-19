import { useContext } from "react"
import { ThemeContext } from "./context/theme-context"

const ThemeButton = () => {
    const { theme, setTheme } = useContext(ThemeContext)

    function handleTheme() {
        setTheme(theme === "light" ? "dark" : "light")
    }

  return (
    <button
      className="ml-4 rounded px-3 py-1 text-sm bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
      onClick={handleTheme}
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  )
}

export default ThemeButton