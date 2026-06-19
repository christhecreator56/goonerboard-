"use client";

import React from "react";
import { NodeProps } from "@xyflow/react";
import { Plus, Trash2, Grid } from "lucide-react";
import { NexusNodeWrapper } from "../NexusNodeWrapper";
import { useUpdateNodeData, useDeleteNode } from "@/lib/liveblocks";
import { type CustomNode } from "@/store/canvasStore";

export const NexusTableNode: React.FC<NodeProps<CustomNode>> = ({ id, data, selected }) => {
  const updateNodeData = useUpdateNodeData();
  const deleteNode = useDeleteNode();

  const title = data.title || "DATA MATRIX";
  const headers: string[] = data.headers || ["Col 1", "Col 2"];
  const rows: string[][] = data.rows || [["DATA A", "DATA B"]];

  const handleTitleChange = (newTitle: string) => {
    updateNodeData(id, { title: newTitle });
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const updatedRows = rows.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? value : cell))
    );
    updateNodeData(id, { rows: updatedRows });
  };

  const handleHeaderChange = (colIndex: number, value: string) => {
    const updatedHeaders = headers.map((header, idx) =>
      idx === colIndex ? value : header
    );
    updateNodeData(id, { headers: updatedHeaders });
  };

  const addColumn = () => {
    const newHeader = `COL ${headers.length + 1}`;
    const updatedHeaders = [...headers, newHeader];
    const updatedRows = rows.map((row) => [...row, ""]);
    updateNodeData(id, { headers: updatedHeaders, rows: updatedRows });
  };

  const deleteColumn = (colIndex: number) => {
    if (headers.length <= 1) return;
    const updatedHeaders = headers.filter((_, idx) => idx !== colIndex);
    const updatedRows = rows.map((row) => row.filter((_, idx) => idx !== colIndex));
    updateNodeData(id, { headers: updatedHeaders, rows: updatedRows });
  };

  const addRow = () => {
    const newRow = Array(headers.length).fill("");
    updateNodeData(id, { rows: [...rows, newRow] });
  };

  const deleteRow = (rowIndex: number) => {
    if (rows.length <= 1) return;
    const updatedRows = rows.filter((_, idx) => idx !== rowIndex);
    updateNodeData(id, { rows: updatedRows });
  };

  const colCount = headers.length;

  return (
    <NexusNodeWrapper
      id={id}
      title={title}
      onTitleChange={handleTitleChange}
      onDelete={() => deleteNode(id)}
      selected={selected}
      icon={<Grid size={14} className="text-[#00ff66]" />}
    >
      <div className="flex flex-col gap-3 min-w-[320px] max-w-[480px] font-mono">
        {/* Table structure */}
        <div className="border border-neutral-900 rounded-none overflow-hidden bg-black">
          {/* Headers */}
          <div
            className="grid border-b border-neutral-900 bg-[#0a0a0a] divide-x divide-neutral-900"
            style={{ gridTemplateColumns: `repeat(${colCount}, minmax(80px, 1fr))` }}
          >
            {headers.map((header, colIdx) => (
              <div key={colIdx} className="relative group/head flex items-center p-1.5 min-w-0">
                <input
                  type="text"
                  value={header}
                  onChange={(e) => handleHeaderChange(colIdx, e.target.value)}
                  className="bg-transparent border-none text-[10px] font-bold text-neutral-400 uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-[#00ff66]/40 rounded-none w-full text-center px-1"
                />
                {headers.length > 1 && (
                  <button
                    onClick={() => deleteColumn(colIdx)}
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 opacity-0 group-hover/head:opacity-100 p-0.5 text-neutral-500 hover:text-[#ff0033] rounded-none transition-all cursor-pointer bg-neutral-950"
                  >
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="flex flex-col divide-y divide-neutral-900">
            {rows.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="grid divide-x divide-neutral-900 group/row relative"
                style={{ gridTemplateColumns: `repeat(${colCount}, minmax(80px, 1fr))` }}
              >
                {row.map((cell, colIdx) => (
                  <div key={colIdx} className="flex items-center p-1 min-w-0">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                      className="bg-transparent border-none text-xs text-neutral-300 focus:outline-none focus:bg-neutral-900/30 focus:ring-1 focus:ring-[#00ff66]/40 rounded-none w-full py-1 text-center uppercase font-bold"
                    />
                  </div>
                ))}
                {rows.length > 1 && (
                  <button
                    onClick={() => deleteRow(rowIdx)}
                    className="absolute -right-7 top-1/2 -translate-y-1/2 opacity-0 group-hover/row:opacity-100 p-1 text-neutral-500 hover:text-[#ff0033] rounded-none transition-all cursor-pointer"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={addRow}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-neutral-950 border border-neutral-900 hover:border-[#00ff66] hover:bg-neutral-900/40 rounded-none text-[10px] font-bold text-neutral-400 hover:text-white transition-all cursor-pointer uppercase"
          >
            <Plus size={11} />
            Row
          </button>
          <button
            onClick={addColumn}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-neutral-950 border border-neutral-900 hover:border-[#00ff66] hover:bg-neutral-900/40 rounded-none text-[10px] font-bold text-neutral-400 hover:text-white transition-all cursor-pointer uppercase"
          >
            <Plus size={11} />
            Column
          </button>
        </div>
      </div>
    </NexusNodeWrapper>
  );
};
