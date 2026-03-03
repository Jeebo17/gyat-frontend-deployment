import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import MachineModal from "../MachineModal";
import type { TileData } from "../../types/tile";

const baseTile: TileData = {
    id: 11,
    equipmentTypeId: 7,
    exerciseIds: [101],
    exerciseOptions: [
        { id: 101, name: "Lat Pulldown" },
        { id: 102, name: "Seated Cable Row" },
    ],
    outOfOrder: false,
    equipment: {
        name: "Cable Station",
        description: "Multi-purpose cable machine",
        benefits: ["Lat Pulldown"],
        musclesTargeted: ["Back", "Biceps"],
    },
    xCoord: 120,
    yCoord: 80,
    width: 220,
    height: 140,
    rotation: 0,
    colour: "blue",
};

const renderModal = (overrides: Partial<ComponentProps<typeof MachineModal>> = {}) => {
    return render(
        <MachineModal
            tile={baseTile}
            onClose={vi.fn()}
            editMode={true}
            onTileChange={vi.fn()}
            onSave={vi.fn()}
            onOutOfOrderChange={vi.fn()}
            onExerciseIdsChange={vi.fn()}
            {...overrides}
        />
    );
};

describe("MachineModal", () => {
    it("adds a selected exercise from dropdown", async () => {
        const onExerciseIdsChange = vi.fn();
        renderModal({ onExerciseIdsChange });

        const select = screen.getByLabelText("Exercise selector");
        expect(select).toBeInTheDocument();

        await waitFor(() => {
            expect((select as HTMLSelectElement).value).toBe("102");
        });

        fireEvent.click(screen.getByRole("button", { name: "Add Exercise" }));
        expect(onExerciseIdsChange).toHaveBeenCalledWith([101, 102]);
    });

    it("renders already selected exercises in edit mode", () => {
        renderModal();
        expect(screen.getByText("Lat Pulldown")).toBeInTheDocument();
    });

    it("toggles to preview mode in edit flow", () => {
        renderModal();

        fireEvent.click(screen.getByRole("button", { name: "Preview" }));

        expect(screen.getByText("Back to Edit")).toBeInTheDocument();
        expect(screen.queryByLabelText("Exercise selector")).not.toBeInTheDocument();
    });

    it("disables save button when saving", () => {
        renderModal({ saving: true });

        const saveButton = screen.getByRole("button", { name: "Saving..." });
        expect(saveButton).toBeDisabled();
    });
});
