// import React from "react";
// import { PieceLetter } from "../utils/pieceMap";
// import { pieceSize } from "../utils/classNameSize";
//
// type FunItemPoolProps = {
//     funItems: PieceLetter[];
//     selectedPoolPiece: PieceLetter | null;
//     onSelectPiece: (piece: PieceLetter | null) => void;
// };
//
// const FunItemPool: React.FC<FunItemPoolProps> = ({
//                                                      funItems,
//                                                      selectedPoolPiece,
//                                                      onSelectPiece,
//                                                  }) => {
//     return (
//         <div className="flex flex-col">
//             {funItems.map((item) => {
//                 const isSelected = selectedPoolPiece === item;
//
//                 return (
//                     <span
//                         key={item}
//                         className={`text-3xl  ${pieceSize}`}
//                         style={{
//                             border: isSelected ? "2px solid red" : "2px solid transparent",
//                             borderRadius: 6,
//                             cursor: "pointer",
//                             display: "inline-flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                         }}
//                         onPointerDown={(e) => {
//                             e.preventDefault();
//                             onSelectPiece(isSelected ? null : item);
//                         }}
//                     >
//             {items[item]}
//           </span>
//                 );
//             })}
//         </div>
//     );
// };
//
// export default FunItemPool;
