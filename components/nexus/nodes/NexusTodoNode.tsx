"use client";

import React, { useState } from "react";
import { NodeProps } from "@xyflow/react";
import { Plus, X, CheckSquare, Square } from "lucide-react";
import { NexusNodeWrapper } from "../NexusNodeWrapper";
import { useUpdateNodeData, useDeleteNode } from "@/lib/liveblocks";
import { type CustomNode, type TodoItem } from "@/store/canvasStore";

export const NexusTodoNode: React.FC<NodeProps<CustomNode>> = ({ id, data, selected }) => {
  const updateNodeData = useUpdateNodeData();
  const deleteNode = useDeleteNode();
  const [newTodoText, setNewTodoText] = useState("");

  const title = data.title || "CHECKLIST";
  const items: TodoItem[] = data.items || [];

  const handleTitleChange = (newTitle: string) => {
    updateNodeData(id, { title: newTitle });
  };

  const toggleTodo = (todoId: string) => {
    const updatedItems = items.map((item) =>
      item.id === todoId ? { ...item, completed: !item.completed } : item
    );
    updateNodeData(id, { items: updatedItems });
  };

  const addTodo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTodoText.trim()) return;

    const newItem: TodoItem = {
      id: `${Date.now()}`,
      text: newTodoText.trim(),
      completed: false,
    };

    updateNodeData(id, { items: [...items, newItem] });
    setNewTodoText("");
  };

  const removeTodo = (todoId: string) => {
    const updatedItems = items.filter((item) => item.id !== todoId);
    updateNodeData(id, { items: updatedItems });
  };

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <NexusNodeWrapper
      id={id}
      title={title}
      onTitleChange={handleTitleChange}
      onDelete={() => deleteNode(id)}
      selected={selected}
      icon={<CheckSquare size={14} className="text-[#00ff66]" />}
    >
      <div className="flex flex-col gap-3 font-mono">
        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="flex flex-col gap-1.5 select-none">
            <div className="flex justify-between text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
              <span>SYNC STATUS</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-1 bg-neutral-900 rounded-none overflow-hidden border border-neutral-800">
              <div
                className="h-full bg-[#00ff66] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 py-1 px-1 border border-transparent hover:border-neutral-900 bg-neutral-950/20"
            >
              <button
                onClick={() => toggleTodo(item.id)}
                className="flex items-start gap-2.5 text-left flex-1 text-xs text-neutral-300 cursor-pointer"
              >
                <span className="mt-0.5 text-[#00ff66] shrink-0">
                  {item.completed ? (
                    <CheckSquare size={14} className="fill-[#00ff66]/10" />
                  ) : (
                    <Square size={14} />
                  )}
                </span>
                <span
                  className={`break-all leading-tight uppercase ${
                    item.completed ? "line-through text-neutral-600 font-bold" : "text-neutral-200"
                  }`}
                >
                  {item.text}
                </span>
              </button>
              <button
                onClick={() => removeTodo(item.id)}
                className="p-0.5 text-neutral-600 hover:text-[#ff0033] hover:bg-neutral-900 rounded-none transition-all cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {totalCount === 0 && (
            <div className="text-center py-4 text-[10px] text-neutral-700 italic select-none">
              NO PIPELINE TASKS REGISTED.
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={addTodo} className="flex gap-2 mt-1">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            className="flex-1 bg-neutral-950 border border-neutral-900 rounded-none px-2 py-1.5 text-xs text-neutral-200 placeholder-neutral-700 focus:outline-none focus:border-[#00ff66] transition-colors uppercase"
            placeholder="ADD NEW TASK..."
          />
          <button
            type="submit"
            className="p-1.5 bg-neutral-950 hover:bg-[#00ff66] text-neutral-500 hover:text-black border border-neutral-900 hover:border-[#00ff66] rounded-none transition-all cursor-pointer flex items-center justify-center"
          >
            <Plus size={12} />
          </button>
        </form>
      </div>
    </NexusNodeWrapper>
  );
};
