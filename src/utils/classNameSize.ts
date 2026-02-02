
export const pieceSize = `
  w-[7vw] h-[7vw]             /* default small screens */
  sm:w-[7vw] sm:h-[7vw]         /* small phones */
  md:w-[7vw] md:h-[7vw]         /* tablets */
  lg:w-[6vw] lg:h-[5.5vw]         /* laptops */
  xl:w-[5.5vw] xl:h-[5vw]     /* desktops */
  2xl:w-[5.5vw] 2xl:h-[5vw]       /* very large screens */
  max-w-[130px] max-h-[120px]   /* cap size on big screens */
  select-none cursor-grab active:cursor-grabbing
`;
export const boardSize = `
  w-[68vw] h-[68vw]           /* default small screens: fills most width */
  sm:w-[60vw] sm:h-[50vw]     /* small phones */
  md:w-[60vw] md:h-[50vw]     /* tablets */
  lg:w-[45vw] lg:h-[40vw]     /* laptops */
  xl:w-[45vw] xl:h-[40vw]     /* desktops */
  2xl:w-[45vw] 2xl:h-[40vw]   /* very large screens */
  max-w-[960px] max-h-[960px] /* never exceed 960x960 */
  shadow-2xl rounded-md
`;

export const SidebarSize =`
    w-[100vw] h-[50vw]           /* default small screens: fills most width */
sm:w-[100vw] sm:h-[50vw]     /* small phones */
md:w-[100vw] md:h-[50vw]     /* tablets */
lg:w-[45vw] lg:h-[40vw]     /* laptops */
xl:w-[45vw] xl:h-[40vw]     /* desktops */
2xl:w-[45vw] 2xl:h-[40vw]   /* very large screens */
max-w-[960px] max-h-[960px] /* never exceed 960x960 */
shadow-2xl rounded-md
    `;