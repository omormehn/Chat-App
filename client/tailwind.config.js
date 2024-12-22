/** @type {import('tailwindcss').Config} */
import withMt from "@material-tailwind/react/utils/withMT";
export default withMt({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
      },
    },
  },
  plugins: [],
});

