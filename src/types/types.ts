import {Board as BoardType} from "@/utils/boardUtils";

export interface BoardProps {
    board?: BoardType;
    flipped?: boolean; // new prop to flip the board
}

export interface PageLink {
    name: string;
    href: string;
}