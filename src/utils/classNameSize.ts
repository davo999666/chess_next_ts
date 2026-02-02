
export const pieceSize = `
  w-[7vw] h-[7vw]             /* default small screens */
  sm:w-[7vw] sm:h-[7vw]         /* small phones */
  md:w-[6vw] md:h-[6vw]         /* tablets */
  lg:w-[5vw] lg:h-[5vw]         /* laptops */
  xl:w-[5vw] xl:h-[5vw]     /* desktops */
  2xl:w-[5vw] 2xl:h-[5vw]       /* very large screens */
  max-w-[130px] max-h-[120px]   /* cap size on big screens */
  select-none cursor-grab active:cursor-grabbing
`;
export const boardSize = `
  w-[67vw] h-[75vw]           /* default small screens: fills most width */
  sm:w-[67vw] sm:h-[75vw]     /* small phones */
  md:w-[67vw] md:h-[75vw]     /* tablets */
  lg:w-[40vw] lg:h-[40vw]     /* laptops */
  xl:w-[40vw] xl:h-[40vw]     /* desktops */
  2xl:w-[40vw] 2xl:h-[40vw]   /* very large screens */
  max-w-[960px] max-h-[960px] /* never exceed 960x960 */
  shadow-2xl rounded-md
`;

export const SidebarSize =`
    w-[99vw] h-[70vw]           /* default small screens: fills most width */
sm:w-[100vw] sm:h-[50vw]     /* small phones */
md:w-[100vw] md:h-[50vw]     /* tablets */
lg:w-full lg:h-screen     /* laptops */
xl:w-full xl:h-screen     /* desktops */
2xl:w-full 2xl:h-screen   /* very large screens */
max-w-[960px] max-h-[960px] /* never exceed 960x960 */
shadow-2xl rounded-md
    `;