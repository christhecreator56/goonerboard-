import React from "react";
import { NodeProps } from "@xyflow/react";
import { Plus, Trash2, Grid } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";
import { useCanvasStore, type CustomNode } from "@/store/canvasStore";

export const TableNode: React.FC<NodeProps<CustomNode>> = ({ id, data, selected }) => {
  const updateNodeData = useCanvasStore((state) => state.updateNodeData);

  const title = data.title || "Grid Tracker";
  const headers: string[] = data.headers || ["Header 1", "Header 2"];
  const rows: string[][] = data.rows || [["Cell A1", "Cell A2"]];

  const handleTitleChange = (newTitle: string) => {
    updateNodeData(id, { title: newTitle });
  };

  // Cell change
  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const updatedRows = rows.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? value : cell))
    );
    updateNodeData(id, { rows: updatedRows });
  };

  // Header change
  const handleHeaderChange = (colIndex: number, value: string) => {
    const updatedHeaders = headers.map((header, idx) =>
      idx === colIndex ? value : header
    );
    updateNodeData(id, { headers: updatedHeaders });
  };

  // Add Column
  const addColumn = () => {
    const newHeader = `Col ${headers.length + 1}`;
    const updatedHeaders = [...headers, newHeader];
    const updatedRows = rows.map((row) => [...row, ""]);
    updateNodeData(id, { headers: updatedHeaders, rows: updatedRows });
  };

  // Delete Column
  const deleteColumn = (colIndex: number) => {
    if (headers.length <= 1) return; // Keep at least one column
    const updatedHeaders = headers.filter((_, idx) => idx !== colIndex);
    const updatedRows = rows.map((row) => row.filter((_, idx) => idx !== colIndex));
    updateNodeData(id, { headers: updatedHeaders, rows: updatedRows });
  };

  // Add Row
  const addRow = () => {
    const newRow = Array(headers.length).fill("");
    updateNodeData(id, { rows: [...rows, newRow] });
  };

  // Delete Row
  const deleteRow = (rowIndex: number) => {
    if (rows.length <= 1) return; // Keep at least one row
    const updatedRows = rows.filter((_, idx) => idx !== rowIndex);
    updateNodeData(id, { rows: updatedRows });
  };

  const colCount = headers.length;

  return (
    <NodeWrapper
      id={id}
      title={title}
      onTitleChange={handleTitleChange}
      selected={selected}
      icon={<Grid size={14} className="text-purple-400" />}
    >
      <div className="flex flex-col gap-3 min-w-[320px] max-w-[480px]">
        {/* CSS Grid Table Container */}
        <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950">
          {/* Header Row */}
          <div
            className="grid border-b border-neutral-800 bg-neutral-900/40 divide-x divide-neutral-800"
            style={{ gridTemplateColumns: `repeat(${colCount}, minmax(80px, 1fr)) hover-col` }}
          >
            {headers.map((header, colIdx) => (
              <div key={colIdx} className="relative group/head flex items-center p-1.5 min-w-0">
                <input
                  type="text"
                  value={header}
                  onChange={(e) => handleHeaderChange(colIdx, e.target.value)}
                  className="bg-transparent border-none text-[11px] font-bold text-neutral-400 uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-purple-500/50 rounded w-full text-center px-1"
                />
                {headers.length > 1 && (
                  <button
                    onClick={() => deleteColumn(colIdx)}
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 opacity-0 group-hover/head:opacity-100 p-0.5 text-neutral-500 hover:text-red-400 rounded transition-all cursor-pointer bg-neutral-900"
                    title="Delete Column"
                  >
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="flex flex-col divide-y divide-neutral-800">
            {rows.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="grid divide-x divide-neutral-800 group/row relative"
                style={{ gridTemplateColumns: `repeat(${colCount}, minmax(80px, 1fr))` }}
              >
                {row.map((cell, colIdx) => (
                  <div key={colIdx} className="flex items-center p-1 min-w-0">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                      className="bg-transparent border-none text-xs text-neutral-300 focus:outline-none focus:bg-neutral-900/40 focus:ring-1 focus:ring-purple-500/50 rounded w-full py-1 text-center"
                    />
                  </div>
                ))}
                {rows.length > 1 && (
                  <button
                    onClick={() => deleteRow(rowIdx)}
                    className="absolute -right-7 top-1/2 -translate-y-1/2 opacity-0 group-hover/row:opacity-100 p-1 text-neutral-500 hover:text-red-400 rounded transition-all cursor-pointer"
                    title="Delete Row"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2">
          <button
            onClick={addRow}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-neutral-900 border border-neutral-800 hover:border-purple-500 hover:bg-neutral-900/60 rounded-lg text-xs font-medium text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            <Plus size={12} />
            Row
          </button>
          <button
            onClick={addColumn}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-neutral-900 border border-neutral-800 hover:border-purple-500 hover:bg-neutral-900/60 rounded-lg text-xs font-medium text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            <Plus size={12} />
            Column
          </button>
        </div>
      </div>
    </NodeWrapper>
  );
};
