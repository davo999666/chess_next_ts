import Board from "@/component/Board";
import {initialBoard} from "@/utils/boardUtils";

const GameBoard = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <Board board={initialBoard} />
        </div>
    );
};

export default GameBoard;
