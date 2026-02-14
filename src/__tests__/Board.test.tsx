import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Board from "../component/board/Board"; // relative path
import { initialBoard } from "../utils/boardUtils";

// Mock HistoryContext
const addMoveMock = jest.fn();
jest.mock("../context/HistoryContext", () => ({
    useHistory: () => ({
        addMove: addMoveMock,
        moveBack: jest.fn(),
        clearHistory: jest.fn(),
        history: [],
    }),
}));

describe("Board Component", () => {
    test("renders 8x8 board", () => {
        render(<Board />);
        const squares = screen.getAllByTestId(/square-/); // select all squares by data-testid
        expect(squares.length).toBe(64);
    });

    // test("renders initial pieces correctly", () => {
    //     render(<Board />);
    //     const firstPawn = screen.getByAltText(initialBoard[1][0]!); // ✅ use alt text
    //     expect(firstPawn).toBeInTheDocument();
    // });

    // test("can select a piece from the board", () => {
    //     render(<Board />);
    //     const firstPawnSquare = screen.getByAltText(initialBoard[1][0]!); // use alt
    //
    //     fireEvent.pointerDown(firstPawnSquare, { button: 0, clientX: 0, clientY: 0 });
    //     expect(firstPawnSquare).toBeInTheDocument();
    // });

    // test("right click adds/removes circle", () => {
    //     render(<Board />);
    //     const square = screen.getByTestId("square-0-0");
    //
    //     // Add circle
    //     fireEvent.contextMenu(square);
    //     const circle = screen.getByTestId("right-click-circle-0-0");
    //     expect(circle).toBeInTheDocument();
    //
    //     // Remove circle
    //     fireEvent.contextMenu(square);
    //     expect(screen.queryByTestId("right-click-circle-0-0")).toBeNull();
    // });

    // test("moves piece outside board and updates history", () => {
    //     render(<Board />);
    //     const firstPawnSquare = screen.getByAltText(initialBoard[1][0]!); // ✅ use alt text
    //
    //     fireEvent.pointerDown(firstPawnSquare, { button: 0, clientX: 0, clientY: 0 });
    //     fireEvent.pointerUp(document.body, { button: 0, clientX: -1000, clientY: -1000 });
    //
    //     expect(addMoveMock).toHaveBeenCalledWith(
    //         expect.objectContaining({
    //             pieceFrom: initialBoard[1][0],
    //             from: [1, 0],
    //             to: "removed",
    //         })
    //     );
    // });
});
