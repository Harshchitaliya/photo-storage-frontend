const Card ={
  card: {
    root: {
      base: "flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 relative",
      children: "flex h-full w-full flex-col justify-center gap-2 p-4",
      horizontal: {
        off: "flex-col",
        on: "flex-col md:max-w-xl md:flex-row",
      },
      href: "hover:bg-gray-100 dark:hover:bg-gray-700",
    },
    img: {
      base: "object-cover",
      horizontal: {
        off: "rounded-t-lg w-full h-48",
        on: "h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg",
      },
    },
  },
}

export default Card;
