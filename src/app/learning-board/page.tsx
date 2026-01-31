import {initialEmptyBoard} from "@/utils/boardUtils";
import Board from "@/component/Board";

const LearningBoard = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <Board board={initialEmptyBoard} />
        </div>
    );
};

export default LearningBoard;